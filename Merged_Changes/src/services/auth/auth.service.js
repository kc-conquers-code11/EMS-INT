const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const db = require('../../../models');
const {
  resolveUserScope,
  scopeToPublic,
} = require('../../helpers/scope.helper.js');

const loginService = async (payload) => {
  const { email, password } = payload;

  // 1. Fetch User and Role in one Raw SQL query (since associations are forbidden)
  const [users] = await db.sequelize.query(
    `SELECT u.*, ut.base as role_name,
            c.institution_id,
            i.name AS institution_name,
            COALESCE(
              (SELECT JSON_ARRAYAGG(p.code) 
               FROM role_permissions rp 
               JOIN permissions p ON rp.permission_id = p.id 
               WHERE rp.utid = u.user_type), 
              JSON_ARRAY()
            ) as permissions
     FROM users u
     JOIN user_types ut ON u.user_type = ut.utid
     LEFT JOIN coe c ON c.coe_id = u.coe_id AND c.status = 1
     LEFT JOIN institution i ON i.institution_id = c.institution_id
     WHERE u.email = :email AND u.deletedAt IS NULL AND ut.deletedAt IS NULL
     LIMIT 1`,
    {
      nest: true,
      replacements: { email },
      type: db.Sequelize.QueryTypes.SELECT,
    }
  );

  if (!users) throw { status: 401, message: 'Invalid credentials' };
  if (!users.is_active) throw { status: 401, message: 'Account is suspended' };

  // 2. Check password
  const isPasswordValid = await bcrypt.compare(password, users.password);
  if (!isPasswordValid) throw { status: 401, message: 'Invalid credentials' };

  const authId = crypto.randomUUID();

  // 3. Generate JWT
  const token = jwt.sign(
    {
      auth_id: authId,
      id: users.uid,
      utid: users.user_type,
      role: users.role_name,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
  );

  // 4. Calculate exact expiry date directly from the signed JWT
  const decoded = jwt.decode(token);
  const expiresAt = new Date(decoded.exp * 1000);
  const now = new Date();

  // 5. Hash token
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

  // 6. Database Transaction: Ensure Token and Last Login update together or fail together
  await db.sequelize.transaction(async (t) => {
    await db.sequelize.query(
      `INSERT INTO user_auth_token (auth_id, uid, user_type, token, token_hash, expires_at, login_time, createdAt, updatedAt)
       VALUES (:auth_id, :uid, :user_type, :token, :token_hash, :expires_at, :now, :now, :now)`,
      {
        replacements: {
          auth_id: authId,
          uid: users.uid,
          user_type: users.user_type,
          token,
          token_hash: tokenHash,
          expires_at: expiresAt,
          now: now,
        },
        transaction: t,
      }
    );

    await db.sequelize.query(
      `UPDATE users SET last_login = :now WHERE uid = :uid`,
      {
        replacements: { now, uid: users.uid },
        transaction: t,
      }
    );
  });

  const userPermissions = typeof users.permissions === 'string' ? JSON.parse(users.permissions) : (users.permissions || []);

  const baseUser = {
    uid: users.uid,
    role: users.role_name,
    student_id: users.student_id || null,
    faculty_id: users.faculty_id || null,
    coe_id: users.coe_id || null,
    hod_id: users.hod_id || null,
  };
  const scope = await resolveUserScope(baseUser);
  const scopePublic = scopeToPublic(scope);

  return {
    token,
    expires_at: expiresAt,
    role: users.role_name,
    uid: users.uid,
    permissions: userPermissions,
    institution_id: scopePublic?.institution_id || null,
    institution_name: scopePublic?.institution_name || null,
    depart_id: scopePublic?.depart_id || null,
    depart_name: scopePublic?.depart_name || null,
    branch_id: scopePublic?.branch_id || null,
    student_id: scopePublic?.student_id || null,
    faculty_id: scopePublic?.faculty_id || null,
    coe_id: scopePublic?.coe_id || null,
    hod_id: scopePublic?.hod_id || null,
    scope: scopePublic,
  };
};

const logoutService = async (token) => {
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
  await db.sequelize.query(
    `DELETE FROM user_auth_token WHERE token_hash = :tokenHash`,
    {
      replacements: { tokenHash },
    }
  );
};

module.exports = { loginService, logoutService };
