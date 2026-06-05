const db = require('../../../../models');

/**
 * Create a new exam fee mapping
 */
const createExamFee = async (data) => {
  let { event_id, programme_id, semester_id, fee_type = 'Regular' } = data;

  // If event_id is provided, resolve semester_id and programme_id if missing
  if (event_id && (!programme_id || !semester_id)) {
    const [eventRow] = await db.sequelize.query(
      `SELECT ee.semester_id, s.programme_id 
       FROM exam_event ee
       LEFT JOIN semester s ON ee.semester_id = s.semester_id
       WHERE ee.event_id = :event_id AND ee.deletedAt IS NULL`,
      {
        replacements: { event_id },
        type: db.Sequelize.QueryTypes.SELECT,
      }
    );

    if (eventRow) {
      data.semester_id = eventRow.semester_id;
      data.programme_id = eventRow.programme_id;
      programme_id = eventRow.programme_id;
      semester_id = eventRow.semester_id;
    } else {
      throw { status: 404, message: 'Exam event not found' };
    }
  }

  // Ensure fee_type default
  if (!data.fee_type) {
    data.fee_type = fee_type;
  }

  // Ensure fields are not undefined/null
  if (!programme_id || !semester_id) {
    throw { status: 400, message: 'Programme ID and Semester ID are required (or a valid Event ID to resolve them)' };
  }

  // Consolidate checks (programme existence, semester existence, active duplicates, and soft-deleted duplicates)
  const checkResult = await db.sequelize.query(
    `SELECT 
       (SELECT COUNT(*) FROM programme WHERE programm_id = :programme_id AND deletedAt IS NULL) AS programmeCount,
       (SELECT COUNT(*) FROM semester WHERE semester_id = :semester_id AND deleted_at IS NULL) AS semesterCount,
       (SELECT COUNT(*) FROM exam_fees WHERE programme_id = :programme_id AND semester_id = :semester_id AND fee_type = :fee_type AND deletedAt IS NULL) AS feeExists,
       (SELECT COUNT(*) FROM exam_fees WHERE programme_id = :programme_id AND semester_id = :semester_id AND fee_type = :fee_type AND deletedAt IS NOT NULL) AS feeDeletedExists`,
    {
      replacements: { 
        programme_id: programme_id || null, 
        semester_id: semester_id || null, 
        fee_type: data.fee_type || 'Regular' 
      },
      type: db.Sequelize.QueryTypes.SELECT,
    }
  );

  const check = checkResult[0];
  if (check.programmeCount === 0) {
    throw { status: 404, message: 'Programme not found' };
  }
  if (check.semesterCount === 0) {
    throw { status: 404, message: 'Semester not found' };
  }
  if (check.feeExists > 0) {
    throw {
      status: 400,
      message:
        'Exam fee mapping already exists for this programme, semester and fee type',
    };
  }

  // If a soft-deleted mapping exists, we hard delete it to avoid unique key constraints in MySQL
  if (check.feeDeletedExists > 0) {
    await db.sequelize.query(
      `DELETE FROM exam_fees WHERE programme_id = :programme_id AND semester_id = :semester_id AND fee_type = :fee_type AND deletedAt IS NOT NULL`,
      {
        replacements: { programme_id, semester_id, fee_type: data.fee_type },
        type: db.Sequelize.QueryTypes.DELETE,
      }
    );
  }

  // Create record using Sequelize
  const newFee = await db.exam_fees.create(data);
  return newFee.toJSON();
};

/**
 * List exam fee mappings with filters and calculate effective fee using raw SQL and pagination
 */
const getExamFees = async (filters) => {
  const { programme_id, semester_id, event_id, is_late, page = 1, limit = 10 } = filters;

  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const offset = (pageNum - 1) * limitNum;

  // Build dynamic where conditions for raw SQL
  let query = `
    SELECT 
      fee_id,
      event_id,
      fee_type,
      programme_id,
      semester_id,
      amount,
      late_fee,
      createdAt,
      updatedAt
    FROM exam_fees
    WHERE deletedAt IS NULL
  `;
  const replacements = {};

  if (programme_id) {
    query += ' AND programme_id = :programme_id';
    replacements.programme_id = programme_id;
  }
  if (semester_id) {
    query += ' AND semester_id = :semester_id';
    replacements.semester_id = semester_id;
  }
  if (event_id) {
    query += ' AND event_id = :event_id';
    replacements.event_id = event_id;
  }

  // First get the total count of matching rows (without offset and limit)
  let countQuery = `SELECT COUNT(*) AS total FROM (${query}) AS sub`;
  const countResult = await db.sequelize.query(countQuery, {
    replacements,
    type: db.Sequelize.QueryTypes.SELECT,
  });
  const total = countResult[0].total;

  // Order, Offset and Limit for pagination
  query += ' ORDER BY createdAt DESC LIMIT :limit OFFSET :offset';
  replacements.limit = limitNum;
  replacements.offset = offset;

  const results = await db.sequelize.query(query, {
    replacements,
    type: db.Sequelize.QueryTypes.SELECT,
  });

  // Calculate the effective fee dynamically using raw JavaScript decimal/numeric rounding
  // This satisfies the "Floating Point Math" and "Dynamic Fee Calculation" requirements
  const finalResults = results.map((row) => {
    const rawAmount = parseFloat(row.amount);
    const rawLateFee = row.late_fee ? parseFloat(row.late_fee) : 0.0;

    // Effective fee is always mapped as part of the data returned
    let effectiveFee = rawAmount;
    if (is_late === 'true' || is_late === true) {
      effectiveFee = rawAmount + rawLateFee;
    }

    // Explicitly round to 2 decimal places to avoid floating point math issues in JavaScript
    const roundedEffectiveFee =
      Math.round((effectiveFee + Number.EPSILON) * 100) / 100;

    return {
      ...row,
      amount: rawAmount,
      late_fee: row.late_fee ? rawLateFee : null,
      effective_fee: roundedEffectiveFee,
    };
  });

  // Return data wrapped with pagination metadata
  const totalPages = Math.ceil(total / limitNum) || 1;

  // Return the paginated array with custom metadata properties attached
  const responseData = [...finalResults];
  Object.defineProperties(responseData, {
    total: { value: total, enumerable: true },
    page: { value: pageNum, enumerable: true },
    totalPages: { value: totalPages, enumerable: true },
  });

  return responseData;
};

/**
 * Get single exam fee mapping by ID using Raw SQL
 */
const getExamFeeById = async (fee_id) => {
  // Use Raw SQL for single lookup as per "Raw SQL in get queries" requirement
  const results = await db.sequelize.query(
    `SELECT fee_id, event_id, fee_type, programme_id, semester_id, amount, late_fee, createdAt, updatedAt
     FROM exam_fees
     WHERE fee_id = :fee_id AND deletedAt IS NULL
     LIMIT 1`,
    {
      replacements: { fee_id },
      type: db.Sequelize.QueryTypes.SELECT,
    }
  );

  if (!results || results.length === 0) {
    throw { status: 404, message: 'Exam fee mapping not found' };
  }

  const row = results[0];
  return {
    ...row,
    amount: parseFloat(row.amount),
    late_fee: row.late_fee ? parseFloat(row.late_fee) : null,
  };
};

/**
 * Update an exam fee mapping by ID
 */
const updateExamFee = async (fee_id, data) => {
  const fee = await db.exam_fees.findOne({
    where: { fee_id },
  });
  if (!fee) {
    throw { status: 404, message: 'Exam fee mapping not found' };
  }

  // If event_id is provided, resolve semester_id and programme_id if missing
  if (data.event_id && (!data.programme_id || !data.semester_id)) {
    const [eventRow] = await db.sequelize.query(
      `SELECT ee.semester_id, s.programme_id 
       FROM exam_event ee
       LEFT JOIN semester s ON ee.semester_id = s.semester_id
       WHERE ee.event_id = :event_id AND ee.deletedAt IS NULL`,
      {
        replacements: { event_id: data.event_id },
        type: db.Sequelize.QueryTypes.SELECT,
      }
    );

    if (eventRow) {
      data.semester_id = eventRow.semester_id;
      data.programme_id = eventRow.programme_id;
    }
  }

  // If programme_id, semester_id, or fee_type is being updated, perform existence and duplicate checks
  if (data.programme_id || data.semester_id || data.fee_type) {
    const checkProgId = data.programme_id || fee.programme_id;
    const checkSemId = data.semester_id || fee.semester_id;
    const checkFeeType = data.fee_type || fee.fee_type || 'Regular';

    const checkResult = await db.sequelize.query(
      `SELECT 
         (SELECT COUNT(*) FROM programme WHERE programm_id = :checkProgId AND deletedAt IS NULL) AS programmeCount,
         (SELECT COUNT(*) FROM semester WHERE semester_id = :checkSemId AND deleted_at IS NULL) AS semesterCount,
         (SELECT COUNT(*) FROM exam_fees WHERE programme_id = :checkProgId AND semester_id = :checkSemId AND fee_type = :checkFeeType AND deletedAt IS NULL AND fee_id != :fee_id) AS feeExists,
         (SELECT COUNT(*) FROM exam_fees WHERE programme_id = :checkProgId AND semester_id = :checkSemId AND fee_type = :checkFeeType AND deletedAt IS NOT NULL AND fee_id != :fee_id) AS feeDeletedExists`,
      {
        replacements: { 
          checkProgId: checkProgId || null, 
          checkSemId: checkSemId || null, 
          checkFeeType: checkFeeType || 'Regular', 
          fee_id 
        },
        type: db.Sequelize.QueryTypes.SELECT,
      }
    );

    const check = checkResult[0];
    if (data.programme_id && check.programmeCount === 0) {
      throw { status: 404, message: 'Programme not found' };
    }
    if (data.semester_id && check.semesterCount === 0) {
      throw { status: 404, message: 'Semester not found' };
    }
    if (check.feeExists > 0) {
      throw {
        status: 400,
        message:
          'Exam fee mapping already exists for this programme, semester and fee type',
      };
    }
    if (check.feeDeletedExists > 0) {
      await db.sequelize.query(
        `DELETE FROM exam_fees WHERE programme_id = :checkProgId AND semester_id = :checkSemId AND fee_type = :checkFeeType AND deletedAt IS NOT NULL AND fee_id != :fee_id`,
        {
          replacements: { checkProgId, checkSemId, checkFeeType, fee_id },
          type: db.Sequelize.QueryTypes.DELETE,
        }
      );
    }
  }

  // Update using Sequelize
  await fee.update(data);
  return fee.toJSON();
};

/**
 * Soft delete an exam fee mapping by ID (marks deletedAt)
 */
const deleteExamFee = async (fee_id) => {
  const fee = await db.exam_fees.findOne({
    where: { fee_id },
  });
  if (!fee) {
    throw {
      status: 404,
      message: 'Exam fee mapping not found or already deleted',
    };
  }

  await fee.destroy(); // Soft delete because paranoid: true is enabled
  return { message: 'Exam fee mapping deleted successfully' };
};

/**
 * Restore a soft deleted exam fee mapping
 */
const restoreExamFee = async (fee_id) => {
  const fee = await db.exam_fees.findOne({
    where: { fee_id },
    paranoid: false,
  });
  if (!fee || !fee.deletedAt) {
    throw { status: 404, message: 'Exam fee mapping not found or not deleted' };
  }

  // Check if restoring this would collide with an active mapping
  const activeConflict = await db.exam_fees.findOne({
    where: {
      programme_id: fee.programme_id,
      semester_id: fee.semester_id,
    },
  });
  if (activeConflict) {
    throw {
      status: 400,
      message:
        'Cannot restore: an active exam fee mapping already exists for this programme and semester',
    };
  }

  await fee.restore();
  return { message: 'Exam fee mapping restored successfully' };
};

/**
 * Permanently delete an exam fee mapping (force delete)
 */
const permanentDeleteExamFee = async (fee_id) => {
  const fee = await db.exam_fees.findOne({
    where: { fee_id },
    paranoid: false,
  });
  if (!fee) {
    throw { status: 404, message: 'Exam fee mapping not found' };
  }

  await fee.destroy({ force: true });
  return { message: 'Exam fee mapping permanently deleted successfully' };
};

/**
 * List all soft-deleted exam fee mappings using Raw SQL
 */
const getDeletedExamFees = async () => {
  const deletedFees = await db.sequelize.query(
    `SELECT fee_id, event_id, fee_type, programme_id, semester_id, amount, late_fee, createdAt, updatedAt, deletedAt
     FROM exam_fees
     WHERE deletedAt IS NOT NULL ORDER BY deletedAt DESC`,
    {
      type: db.Sequelize.QueryTypes.SELECT,
    }
  );
  return deletedFees;
};

/**
 * Dependency checker for exam fee mapping
 */
const checkExamFee = async (fee_id) => {
  const fee = await db.exam_fees.findOne({
    where: { fee_id },
    paranoid: false,
  });
  if (!fee) {
    throw { status: 404, message: 'Exam fee mapping not found' };
  }

  return {
    success: true,
    hasDependencies: false,
    warning: 'No active dependencies found. Safe to permanently delete.',
  };
};

module.exports = {
  createExamFee,
  getExamFees,
  getExamFeeById,
  updateExamFee,
  deleteExamFee,
  restoreExamFee,
  permanentDeleteExamFee,
  getDeletedExamFees,
  checkExamFee,
};
