const crypto = require('crypto');
const db = require('../../../models');
const {
  createSeatingSchema,
  updateSeatingSchema,
} = require('../../validations/allocation/studentSeating.validations');

const createSeating = async (data) => {
  const validated = createSeatingSchema.parse(data);
  const seating_id = crypto.randomUUID();
  const now = new Date();

  // Validate block_id exists
  const [block] = await db.sequelize.query(
    `SELECT block_id FROM block_allocation WHERE block_id = :block_id`,
    { replacements: { block_id: validated.block_id }, type: db.Sequelize.QueryTypes.SELECT }
  );
  if (!block) throw { status: 404, message: 'Block not found' };

  // Validate exam_reg_id exists
  const [examReg] = await db.sequelize.query(
    `SELECT exam_reg_id FROM exam_registration WHERE exam_reg_id = :exam_reg_id`,
    { replacements: { exam_reg_id: validated.exam_reg_id }, type: db.Sequelize.QueryTypes.SELECT }
  );
  if (!examReg) throw { status: 404, message: 'Exam registration not found' };

  // Check for existing active record
  const [existing] = await db.sequelize.query(
    `SELECT seating_id FROM student_seating
     WHERE block_id = :block_id 
       AND exam_reg_id = :exam_reg_id 
       AND seat_no = :seat_no
       AND deletedAt IS NULL`,
    {
      replacements: {
        block_id: validated.block_id,
        exam_reg_id: validated.exam_reg_id,
        seat_no: validated.seat_no,
      },
      type: db.Sequelize.QueryTypes.SELECT,
    }
  );

  if (existing) {
    throw { status: 409, message: 'Seat already allocated for this student in this block' };
  }

  await db.sequelize.query(
    `INSERT INTO student_seating 
      (seating_id, block_id, exam_reg_id, seat_no, createdAt, updatedAt, deletedAt)
     VALUES 
      (:seating_id, :block_id, :exam_reg_id, :seat_no, :now, :now, NULL)`,
    {
      replacements: {
        seating_id,
        block_id: validated.block_id,
        exam_reg_id: validated.exam_reg_id,
        seat_no: validated.seat_no,
        now,
      },
      type: db.Sequelize.QueryTypes.INSERT,
    }
  );

  return getSeatingById(seating_id);
};

const getSeatingById = async (seating_id) => {
  const [row] = await db.sequelize.query(
    `SELECT * FROM student_seating WHERE seating_id = :seating_id AND deletedAt IS NULL`,
    {
      replacements: { seating_id },
      type: db.Sequelize.QueryTypes.SELECT,
    }
  );
  if (!row) {
    throw { status: 404, message: 'Seating not found' };
  }
  return row;
};

const getAllSeatings = async ({ page = 1, limit = 10, block_id, exam_reg_id }) => {
  const offset = (page - 1) * limit;
  
  let whereClauses = ['deletedAt IS NULL'];
  let replacements = { limit, offset };

  if (block_id) {
    whereClauses.push('block_id = :block_id');
    replacements.block_id = block_id;
  }
  if (exam_reg_id) {
    whereClauses.push('exam_reg_id = :exam_reg_id');
    replacements.exam_reg_id = exam_reg_id;
  }

  const whereString = `WHERE ${whereClauses.join(' AND ')}`;

  const [{ total }] = await db.sequelize.query(
    `SELECT COUNT(*) as total FROM student_seating ${whereString}`,
    {
      replacements,
      type: db.Sequelize.QueryTypes.SELECT,
    }
  );

  const rows = await db.sequelize.query(
    `SELECT * FROM student_seating 
     ${whereString} 
     ORDER BY createdAt DESC 
     LIMIT :limit OFFSET :offset`,
    {
      replacements,
      type: db.Sequelize.QueryTypes.SELECT,
    }
  );

  return {
    total,
    page,
    totalPages: Math.ceil(total / limit),
    data: rows,
  };
};

const updateSeating = async (seating_id, data) => {
  const validated = updateSeatingSchema.parse(data);
  const now = new Date();
  
  if (Object.keys(validated).length === 0) {
    return getSeatingById(seating_id);
  }

  if (validated.block_id) {
    const [block] = await db.sequelize.query(
      `SELECT block_id FROM block_allocation WHERE block_id = :block_id`,
      { replacements: { block_id: validated.block_id }, type: db.Sequelize.QueryTypes.SELECT }
    );
    if (!block) throw { status: 404, message: 'Block not found' };
  }

  if (validated.exam_reg_id) {
    const [examReg] = await db.sequelize.query(
      `SELECT exam_reg_id FROM exam_registration WHERE exam_reg_id = :exam_reg_id`,
      { replacements: { exam_reg_id: validated.exam_reg_id }, type: db.Sequelize.QueryTypes.SELECT }
    );
    if (!examReg) throw { status: 404, message: 'Exam registration not found' };
  }

  let setClauses = [];
  let replacements = { seating_id, now };

  for (const [key, value] of Object.entries(validated)) {
    setClauses.push(`${key} = :${key}`);
    replacements[key] = value;
  }
  setClauses.push('updatedAt = :now');

  const [_, metadata] = await db.sequelize.query(
    `UPDATE student_seating 
     SET ${setClauses.join(', ')} 
     WHERE seating_id = :seating_id AND deletedAt IS NULL`,
    {
      replacements,
      type: db.Sequelize.QueryTypes.UPDATE,
    }
  );

  if (metadata === 0) {
    throw { status: 404, message: 'Seating not found' };
  }

  return getSeatingById(seating_id);
};

const softDeleteSeating = async (seating_id) => {
  const now = new Date();
  const [_, metadata] = await db.sequelize.query(
    `UPDATE student_seating 
     SET deletedAt = :now, updatedAt = :now 
     WHERE seating_id = :seating_id AND deletedAt IS NULL`,
    {
      replacements: { seating_id, now },
      type: db.Sequelize.QueryTypes.UPDATE,
    }
  );
  
  if (metadata === 0) {
    throw { status: 404, message: 'Seating not found' };
  }

  return { deleted_id: seating_id };
};

const getSeatsByBlock = async (block_id, query) => {
  return getAllSeatings({ ...query, block_id });
};

module.exports = {
  createSeating,
  getSeatingById,
  getAllSeatings,
  updateSeating,
  softDeleteSeating,
  getSeatsByBlock,
};
