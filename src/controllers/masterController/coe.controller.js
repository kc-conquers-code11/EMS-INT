// src/controllers/masterController/coe.controller.js
const {
  createCOESchema,
  updateCOESchema,
  idParamSchema,
  institutionIdParamSchema,
} = require('../../validations/masterValidations/coe.validations.js');
const { ZodError } = require('zod');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const emailService = require('../../services/email.service.js');
const {
  encryptCredential,
  decryptCredential,
} = require('../../helpers/credentialCrypto.helper.js');

const COE_DEFAULT_TEMP_PASSWORD = 'Password@123';

const generateTemporaryPassword = () => COE_DEFAULT_TEMP_PASSWORD;

const isDuplicateEntryError = (error) =>
  error?.name === 'SequelizeUniqueConstraintError' ||
  error?.original?.code === 'ER_DUP_ENTRY';

const { getUserTypeId: resolveUserTypeId } = require('../../helpers/userType.helper.js');
const {
  getEffectiveScope,
  buildInstitutionScopeClause,
  assertInstitutionAccess,
} = require('../../helpers/scope.helper.js');

const getUserTypeId = async (db, userType) => resolveUserTypeId(userType);

// src/controllers/masterController/coe.controller.js
const getAllCOEs = async (req, res) => {
  try {
    const scope = getEffectiveScope(req.user);
    const { clause, replacements } = buildInstitutionScopeClause(scope, 'c');
    const scopeSql = clause ? `AND ${clause}` : '';

    const coes = await req.db.sequelize.query(
      `SELECT 
        c.coe_id,
        c.institution_id,
        c.name,
        c.employee_id,
        c.email,
        c.phone_number,
        c.qualification,
        c.status,
        c.createdAt,
        c.updatedAt,
        i.name as institution_name
      FROM coe c
      LEFT JOIN institution i ON i.institution_id = c.institution_id
      WHERE c.status = 1
      ${scopeSql}
      ORDER BY c.createdAt DESC`,
      {
        replacements,
        type: req.db.sequelize.QueryTypes.SELECT,
      }
    );

    res.status(200).json({
      success: true,
      data: coes,
      message: 'COEs retrieved successfully',
    });
  } catch (error) {
    console.error('Error in getAllCOEs:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

const getCOEById = async (req, res) => {
  try {
    const { id } = idParamSchema.parse(req.params);

    const [coe] = await req.db.sequelize.query(
      `SELECT 
        c.*,
        i.name as institution_name
      FROM coe c
      LEFT JOIN institution i ON i.institution_id = c.institution_id
      WHERE c.coe_id = :id AND c.status = 1`,
      {
        replacements: { id },
        type: req.db.sequelize.QueryTypes.SELECT,
      }
    );

    if (!coe) {
      return res.status(404).json({
        success: false,
        message: 'COE not found',
      });
    }

    res.status(200).json({
      success: true,
      data: coe,
      message: 'COE retrieved successfully',
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors,
      });
    }

    console.error('Error in getCOEById:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

const getCOEsByInstitution = async (req, res) => {
  try {
    const { institutionId } = institutionIdParamSchema.parse(req.params);

    const coes = await req.db.sequelize.query(
      `SELECT 
        c.*,
        i.name as institution_name
      FROM coe c
      LEFT JOIN institution i ON i.institution_id = c.institution_id
      WHERE c.institution_id = :institutionId AND c.status = 1
      ORDER BY c.createdAt DESC`,
      {
        replacements: { institutionId },
        type: req.db.sequelize.QueryTypes.SELECT,
      }
    );

    res.status(200).json({
      success: true,
      data: coes,
      message: 'COEs retrieved successfully',
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors,
      });
    }

    console.error('Error in getCOEsByInstitution:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

const createCOE = async (req, res) => {
  try {
    const validatedData = createCOESchema.parse(req.body);
    console.log('Creating COE with data:', validatedData);
    

    // Check if institution exists
    const [institution] = await req.db.sequelize.query(
      'SELECT * FROM institution WHERE institution_id = :institution_id AND status = 1',
      {
        replacements: { institution_id: validatedData.institution_id },
        type: req.db.sequelize.QueryTypes.SELECT,
      }
    );

    if (!institution) {
      console.log('Institution not found for ID:', validatedData.institution_id);
      return res.status(404).json({
        success: false,
        message: 'Institution not found',
      });
    }

    // Check if COE with this email already exists
    const [existingCOE] = await req.db.sequelize.query(
      'SELECT coe_id FROM coe WHERE email = :email AND status = 1',
      {
        replacements: { email: validatedData.email },
        type: req.db.sequelize.QueryTypes.SELECT,
      }
    );

    if (existingCOE) {
      return res.status(400).json({
        success: false,
        message: 'COE with this email already exists',
      });
    }

    // Email must be unique across all system users (faculty, student, COE, etc.)
    const [existingUser] = await req.db.sequelize.query(
      'SELECT uid FROM users WHERE email = :email LIMIT 1',
      {
        replacements: { email: validatedData.email },
        type: req.db.sequelize.QueryTypes.SELECT,
      }
    );

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message:
          'This email is already registered as a system user. Use a different email for the COE account.',
      });
    }

    const coeId = crypto.randomUUID();
    const temporaryPassword = generateTemporaryPassword();
    const hashedPassword = await bcrypt.hash(temporaryPassword, 10);
    const encryptedPassword = encryptCredential(temporaryPassword);
    const coeUserTypeId = await getUserTypeId(req.db, 'COE');

    await req.db.sequelize.transaction(async (transaction) => {
      await req.db.sequelize.query(
        `INSERT INTO coe (
          coe_id, institution_id, name, employee_id, email, phone_number, qualification, status, createdAt, updatedAt
        ) VALUES (
          :coe_id, :institution_id, :name, :employee_id, :email, :phone_number, :qualification, :status, NOW(), NOW()
        )`,
        {
          replacements: {
            coe_id: coeId,
            institution_id: validatedData.institution_id,
            name: validatedData.name,
            employee_id: validatedData.employee_id,
            email: validatedData.email,
            phone_number: validatedData.phone_number,
            qualification: validatedData.qualification || null,
            status: validatedData.status !== undefined ? validatedData.status : 1,
          },
          type: req.db.sequelize.QueryTypes.INSERT,
          transaction,
        }
      );

      await req.db.sequelize.query(
        `INSERT INTO users (
          uid, email, user_type, password, password_encrypted, coe_id, is_active, createdAt, updatedAt
        ) VALUES (
          UUID(), :email, :user_type, :password, :password_encrypted, :coe_id, 1, NOW(), NOW()
        )`,
        {
          replacements: {
            email: validatedData.email,
            user_type: coeUserTypeId,
            password: hashedPassword,
            password_encrypted: encryptedPassword,
            coe_id: coeId,
          },
          type: req.db.sequelize.QueryTypes.INSERT,
          transaction,
        }
      );
    });

    let email_delivery = { sent: [], failed: [] };
    try {
      const result = await emailService.sendCOEAccountCreationEmail({
        email: validatedData.email,
        name: validatedData.name,
        employeeId: validatedData.employee_id,
        password: temporaryPassword,
        institutionName: institution.name,
      });
      email_delivery = {
        sent: [{ role: 'COE', email: result.to, messageId: result.messageId }],
        failed: [],
      };
    } catch (emailError) {
      console.error('Error sending COE email:', emailError);
      email_delivery = {
        sent: [],
        failed: [
          {
            role: 'COE',
            email: validatedData.email,
            error: emailError.message || 'Failed to send email',
          },
        ],
      };
    }

    const emailMsg =
      email_delivery.sent.length > 0
        ? `COE created successfully. Login credentials were emailed to ${validatedData.email} (temporary password: ${temporaryPassword}). Ask them to check spam/junk if not received.`
        : `COE created successfully but the credential email failed: ${email_delivery.failed[0]?.error}. Check SMTP settings in .env. Temporary password: ${temporaryPassword}.`;

    res.status(201).json({
      success: true,
      data: {
        coe_id: coeId,
        email: validatedData.email,
        name: validatedData.name,
        email_delivery,
      },
      message: emailMsg,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors,
      });
    }

    if (isDuplicateEntryError(error)) {
      const duplicateEmail =
        error?.fields?.idx_users_email ||
        error?.errors?.[0]?.value ||
        req.body?.email;
      return res.status(400).json({
        success: false,
        message: duplicateEmail
          ? `Email ${duplicateEmail} is already registered. Use a different email.`
          : 'Email is already registered. Use a different email.',
      });
    }

    console.error('Error in createCOE:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

const updateCOE = async (req, res) => {
  try {
    const { id } = idParamSchema.parse(req.params);
    const validatedData = updateCOESchema.parse(req.body);

    const [coe] = await req.db.sequelize.query(
      'SELECT * FROM coe WHERE coe_id = :id AND status = 1',
      {
        replacements: { id },
        type: req.db.sequelize.QueryTypes.SELECT,
      }
    );

    if (!coe) {
      return res.status(404).json({
        success: false,
        message: 'COE not found',
      });
    }

    const updates = [];
    const replacements = { id };

    if (validatedData.name !== undefined) {
      updates.push('name = :name');
      replacements.name = validatedData.name;
    }
    if (validatedData.employee_id !== undefined) {
      updates.push('employee_id = :employee_id');
      replacements.employee_id = validatedData.employee_id;
    }
    if (validatedData.email !== undefined) {
      updates.push('email = :email');
      replacements.email = validatedData.email;
    }
    if (validatedData.phone_number !== undefined) {
      updates.push('phone_number = :phone_number');
      replacements.phone_number = validatedData.phone_number;
    }
    if (validatedData.qualification !== undefined) {
      updates.push('qualification = :qualification');
      replacements.qualification = validatedData.qualification;
    }
    if (validatedData.status !== undefined) {
      updates.push('status = :status');
      replacements.status = validatedData.status;
    }

    if (updates.length > 0) {
      updates.push('updatedAt = NOW()');

      await req.db.sequelize.query(
        `UPDATE coe SET ${updates.join(', ')} WHERE coe_id = :id`,
        {
          replacements,
          type: req.db.sequelize.QueryTypes.UPDATE,
        }
      );

      // Update email in users table if email changed
      if (validatedData.email && validatedData.email !== coe.email) {
        await req.db.sequelize.query(
          'UPDATE users SET email = :email WHERE coe_id = :coe_id',
          {
            replacements: { email: validatedData.email, coe_id: id },
            type: req.db.sequelize.QueryTypes.UPDATE,
          }
        );
      }
    }

    res.status(200).json({
      success: true,
      message: 'COE updated successfully',
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors,
      });
    }

    console.error('Error in updateCOE:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

/**
 * Return COE login password to authorized callers over HTTPS only.
 * Bcrypt hashes cannot be reversed; recoverable copy is AES-encrypted with JWT_SECRET server-side.
 */
const revealCOECredential = async (req, res) => {
  try {
    const { id } = idParamSchema.parse(req.params);

    const [coe] = await req.db.sequelize.query(
      'SELECT coe_id, email, name FROM coe WHERE coe_id = :id AND status = 1',
      {
        replacements: { id },
        type: req.db.sequelize.QueryTypes.SELECT,
      }
    );

    if (!coe) {
      return res.status(404).json({
        success: false,
        message: 'COE not found',
      });
    }

    const [user] = await req.db.sequelize.query(
      `SELECT uid, password_encrypted
       FROM users
       WHERE coe_id = :coe_id AND deletedAt IS NULL
       LIMIT 1`,
      {
        replacements: { coe_id: id },
        type: req.db.sequelize.QueryTypes.SELECT,
      }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No login account found for this COE',
      });
    }

    let plainPassword = null;
    let rotated = false;

    if (user.password_encrypted) {
      try {
        plainPassword = decryptCredential(user.password_encrypted);
      } catch (decryptError) {
        console.error('Failed to decrypt COE credential:', decryptError);
      }
    }

    if (!plainPassword) {
      plainPassword = generateTemporaryPassword();
      const hashedPassword = await bcrypt.hash(plainPassword, 10);
      const encryptedPassword = encryptCredential(plainPassword);

      await req.db.sequelize.query(
        `UPDATE users
         SET password = :password, password_encrypted = :password_encrypted, updatedAt = NOW()
         WHERE uid = :uid`,
        {
          replacements: {
            password: hashedPassword,
            password_encrypted: encryptedPassword,
            uid: user.uid,
          },
          type: req.db.sequelize.QueryTypes.UPDATE,
        }
      );
      rotated = true;
    }

    res.status(200).json({
      success: true,
      data: {
        coe_id: id,
        email: coe.email,
        password: plainPassword,
      },
      message: rotated
        ? 'A new temporary password was generated and stored securely.'
        : 'Credential retrieved successfully.',
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors,
      });
    }

    console.error('Error in revealCOECredential:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

const deleteCOE = async (req, res) => {
  try {
    const { id } = idParamSchema.parse(req.params);

    const [coe] = await req.db.sequelize.query(
      'SELECT * FROM coe WHERE coe_id = :id AND status = 1',
      {
        replacements: { id },
        type: req.db.sequelize.QueryTypes.SELECT,
      }
    );

    if (!coe) {
      return res.status(404).json({
        success: false,
        message: 'COE not found',
      });
    }

    // Soft delete by setting status to 0
    await req.db.sequelize.query(
      'UPDATE coe SET status = 0, updatedAt = NOW() WHERE coe_id = :id',
      {
        replacements: { id },
        type: req.db.sequelize.QueryTypes.UPDATE,
      }
    );

    // Also disable user account
    await req.db.sequelize.query(
      'UPDATE users SET is_active = 0 WHERE coe_id = :coe_id',
      {
        replacements: { coe_id: id },
        type: req.db.sequelize.QueryTypes.UPDATE,
      }
    );

    res.status(200).json({
      success: true,
      message: 'COE deleted successfully',
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors,
      });
    }

    console.error('Error in deleteCOE:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

module.exports = {
  getAllCOEs,
  getCOEById,
  getCOEsByInstitution,
  createCOE,
  updateCOE,
  revealCOECredential,
  deleteCOE,
};
