const crypto = require('crypto');
const db = require('../../../models');
const {
  createDutySchema,
  updateDutySchema,
} = require('../../validations/allocation/supervisorAllocation.validations');

const createDuty = async (data) => {
  const validated = createDutySchema.parse(data);
  const duty_id = crypto.randomUUID();
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

  const [faculty] = await db.sequelize.query(
    `SELECT faculty_id FROM faculty WHERE faculty_id = :faculty_id`,
    { replacements: { faculty_id: validated.faculty_id }, type: db.Sequelize.QueryTypes.SELECT }
  );
  if (!faculty) throw { status: 404, message: 'Faculty not found' };

  await db.sequelize.query(
    `INSERT INTO supervisor_allocation 
      (duty_id, timetable_id, room_id, faculty_id, duty_status, assigned_at, accepted_at, remarks, createdAt, updatedAt)
     VALUES 
      (:duty_id, :timetable_id, :room_id, :faculty_id, :duty_status, :now, NULL, :remarks, :now, :now)`,
    {
      replacements: {
        duty_id,
        timetable_id: validated.timetable_id || null,
        room_id: validated.room_id || null,
        faculty_id: validated.faculty_id,
        duty_status: validated.duty_status || 'assigned',
        remarks: validated.remarks || null,
        now,
      },
      type: db.Sequelize.QueryTypes.INSERT,
    }
  );

  return getDutyById(duty_id);
};

const getDutyById = async (duty_id) => {
  const [row] = await db.sequelize.query(
    `SELECT * FROM supervisor_allocation WHERE duty_id = :duty_id`,
    {
      replacements: { duty_id },
      type: db.Sequelize.QueryTypes.SELECT,
    }
  );
  if (!row) {
    throw { status: 404, message: 'Duty not found' };
  }
  return row;
};

const getAllDuties = async ({ page = 1, limit = 10, faculty_id, duty_status, timetable_id }) => {
  const offset = (page - 1) * limit;
  
  let whereClauses = [];
  let replacements = { limit, offset };

  if (faculty_id) {
    whereClauses.push('faculty_id = :faculty_id');
    replacements.faculty_id = faculty_id;
  }
  if (duty_status) {
    whereClauses.push('duty_status = :duty_status');
    replacements.duty_status = duty_status;
  }
  if (timetable_id) {
    whereClauses.push('timetable_id = :timetable_id');
    replacements.timetable_id = timetable_id;
  }

  const whereString = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

  const [{ total }] = await db.sequelize.query(
    `SELECT COUNT(*) as total FROM supervisor_allocation ${whereString}`,
    {
      replacements,
      type: db.Sequelize.QueryTypes.SELECT,
    }
  );

  const rows = await db.sequelize.query(
    `SELECT * FROM supervisor_allocation 
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

const updateDuty = async (duty_id, data) => {
  const validated = updateDutySchema.parse(data);
  const now = new Date();
  
  if (Object.keys(validated).length === 0) {
    return getDutyById(duty_id);
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

  if (validated.faculty_id) {
    const [faculty] = await db.sequelize.query(
      `SELECT faculty_id FROM faculty WHERE faculty_id = :faculty_id`,
      { replacements: { faculty_id: validated.faculty_id }, type: db.Sequelize.QueryTypes.SELECT }
    );
    if (!faculty) throw { status: 404, message: 'Faculty not found' };
  }

  let setClauses = [];
  let replacements = { duty_id, now };

  for (const [key, value] of Object.entries(validated)) {
    setClauses.push(`${key} = :${key}`);
    replacements[key] = value;
  }
  setClauses.push('updatedAt = :now');

  const [_, metadata] = await db.sequelize.query(
    `UPDATE supervisor_allocation SET ${setClauses.join(', ')} WHERE duty_id = :duty_id`,
    {
      replacements,
      type: db.Sequelize.QueryTypes.UPDATE,
    }
  );

  if (metadata === 0) {
    throw { status: 404, message: 'Duty not found' };
  }

  return getDutyById(duty_id);
};

const deleteDuty = async (duty_id) => {
  await getDutyById(duty_id);

  await db.sequelize.query(
    `DELETE FROM supervisor_allocation WHERE duty_id = :duty_id`,
    {
      replacements: { duty_id },
      type: db.Sequelize.QueryTypes.DELETE,
    }
  );
  
  return { deleted_id: duty_id };
};

const acceptDuty = async (duty_id) => {
  const duty = await getDutyById(duty_id);
  
  if (duty.duty_status !== 'assigned') {
    throw { status: 409, message: 'Only assigned duties can be accepted' };
  }

  const now = new Date();
  await db.sequelize.query(
    `UPDATE supervisor_allocation 
     SET duty_status = 'accepted', accepted_at = :now, updatedAt = :now 
     WHERE duty_id = :duty_id`,
    {
      replacements: { duty_id, now },
      type: db.Sequelize.QueryTypes.UPDATE,
    }
  );

  return getDutyById(duty_id);
};

const rejectDuty = async (duty_id, remarks) => {
  const duty = await getDutyById(duty_id);
  
  if (duty.duty_status !== 'assigned') {
    throw { status: 409, message: 'Only assigned duties can be rejected' };
  }

  const now = new Date();
  await db.sequelize.query(
    `UPDATE supervisor_allocation 
     SET duty_status = 'rejected', remarks = :remarks, updatedAt = :now 
     WHERE duty_id = :duty_id`,
    {
      replacements: { duty_id, remarks: remarks || null, now },
      type: db.Sequelize.QueryTypes.UPDATE,
    }
  );

  return getDutyById(duty_id);
};

module.exports = {
  createDuty,
  getDutyById,
  getAllDuties,
  updateDuty,
  deleteDuty,
  acceptDuty,
  rejectDuty,
};
