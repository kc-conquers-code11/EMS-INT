const crypto = require('crypto');
const db = require('../../../models');
const {
  createBlockSchema,
  updateBlockSchema,
} = require('../../validations/allocation/blockAllocation.validations');

const createBlock = async (data) => {
  const validated = createBlockSchema.parse(data);
  const block_id = crypto.randomUUID();
  const now = new Date();

  if (validated.timetable_id) {
    const [timetable] = await db.sequelize.query(
      `SELECT timetable_id FROM timetable WHERE timetable_id = :timetable_id`,
      { replacements: { timetable_id: validated.timetable_id }, type: db.Sequelize.QueryTypes.SELECT }
    );
    if (!timetable) throw { status: 404, message: 'Timetable not found' };
  }

  if (validated.room_id) {
    const [room] = await db.sequelize.query(
      `SELECT room_id FROM room WHERE room_id = :room_id`,
      { replacements: { room_id: validated.room_id }, type: db.Sequelize.QueryTypes.SELECT }
    );
    if (!room) throw { status: 404, message: 'Room not found' };
  }

  await db.sequelize.query(
    `INSERT INTO block_allocation 
      (block_id, timetable_id, room_id, block_no, allocated_capacity, createdAt, updatedAt)
     VALUES 
      (:block_id, :timetable_id, :room_id, :block_no, :allocated_capacity, :now, :now)`,
    {
      replacements: {
        block_id,
        timetable_id: validated.timetable_id || null,
        room_id: validated.room_id || null,
        block_no: validated.block_no,
        allocated_capacity: validated.allocated_capacity,
        now,
      },
      type: db.Sequelize.QueryTypes.INSERT,
    }
  );

  return getBlockById(block_id);
};

const getBlockById = async (block_id) => {
  const [row] = await db.sequelize.query(
    `SELECT * FROM block_allocation WHERE block_id = :block_id`,
    {
      replacements: { block_id },
      type: db.Sequelize.QueryTypes.SELECT,
    }
  );
  if (!row) {
    throw { status: 404, message: 'Block not found' };
  }
  return row;
};

const getAllBlocks = async ({ page = 1, limit = 10, timetable_id, room_id }) => {
  const offset = (page - 1) * limit;
  
  let whereClauses = [];
  let replacements = { limit, offset };

  if (timetable_id) {
    whereClauses.push('timetable_id = :timetable_id');
    replacements.timetable_id = timetable_id;
  }
  if (room_id) {
    whereClauses.push('room_id = :room_id');
    replacements.room_id = room_id;
  }

  const whereString = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

  const [{ total }] = await db.sequelize.query(
    `SELECT COUNT(*) as total FROM block_allocation ${whereString}`,
    {
      replacements,
      type: db.Sequelize.QueryTypes.SELECT,
    }
  );

  const rows = await db.sequelize.query(
    `SELECT * FROM block_allocation 
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

const updateBlock = async (block_id, data) => {
  const validated = updateBlockSchema.parse(data);
  const now = new Date();
  
  if (Object.keys(validated).length === 0) {
    return getBlockById(block_id);
  }

  if (validated.timetable_id) {
    const [timetable] = await db.sequelize.query(
      `SELECT timetable_id FROM timetable WHERE timetable_id = :timetable_id`,
      { replacements: { timetable_id: validated.timetable_id }, type: db.Sequelize.QueryTypes.SELECT }
    );
    if (!timetable) throw { status: 404, message: 'Timetable not found' };
  }

  if (validated.room_id) {
    const [room] = await db.sequelize.query(
      `SELECT room_id FROM room WHERE room_id = :room_id`,
      { replacements: { room_id: validated.room_id }, type: db.Sequelize.QueryTypes.SELECT }
    );
    if (!room) throw { status: 404, message: 'Room not found' };
  }

  let setClauses = [];
  let replacements = { block_id, now };

  for (const [key, value] of Object.entries(validated)) {
    setClauses.push(`${key} = :${key}`);
    replacements[key] = value;
  }
  setClauses.push('updatedAt = :now');

  const [_, metadata] = await db.sequelize.query(
    `UPDATE block_allocation SET ${setClauses.join(', ')} WHERE block_id = :block_id`,
    {
      replacements,
      type: db.Sequelize.QueryTypes.UPDATE,
    }
  );

  if (metadata === 0) {
    throw { status: 404, message: 'Block not found' };
  }

  return getBlockById(block_id);
};

const deleteBlock = async (block_id) => {
  // Select before delete to check existence
  await getBlockById(block_id);

  await db.sequelize.query(
    `DELETE FROM block_allocation WHERE block_id = :block_id`,
    {
      replacements: { block_id },
      type: db.Sequelize.QueryTypes.DELETE,
    }
  );
  
  return { deleted_id: block_id };
};

module.exports = {
  createBlock,
  getBlockById,
  getAllBlocks,
  updateBlock,
  deleteBlock,
};
