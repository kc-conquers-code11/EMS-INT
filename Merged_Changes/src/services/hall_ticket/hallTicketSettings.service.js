const crypto = require('crypto');
const db = require('../../../models');
const {
  hallTicketSettingsCreateSchema,
  hallTicketSettingsUpdateSchema,
} = require('../../validations/hall_ticket/hallTicket.validations');

/**
 * Normalize a raw settings row from the database.
 * @param {object|null} row
 * @returns {object|null}
 */
const normalizeSettingsRow = (row) => {
  if (!row) return null;
  const settings = { ...row };
  if (typeof settings.instructions === 'string') {
    try {
      settings.instructions = JSON.parse(settings.instructions);
    } catch {
      settings.instructions = [];
    }
  }
  if (settings.hall_ticket_status == null && settings.is_enabled != null) {
    settings.hall_ticket_status = settings.is_enabled ? 'enabled' : 'disabled';
  }
  return settings;
};

/**
 * Create hall ticket settings for an exam event.
 * @param {object} data
 * @returns {Promise<object>}
 */
const createHallTicketSettings = async (data) => {
  const validated = hallTicketSettingsCreateSchema.parse(data);

  const existing = await db.sequelize.query(
    `SELECT id FROM hall_ticket_settings WHERE exam_event_id = :exam_event_id LIMIT 1`,
    {
      replacements: { exam_event_id: validated.exam_event_id },
      type: db.Sequelize.QueryTypes.SELECT,
    }
  );

  if (existing.length > 0) {
    throw { status: 409, message: 'Hall ticket settings already exist for this exam event' };
  }

  const eventRows = await db.sequelize.query(
    `SELECT event_id, event_name FROM exam_event WHERE event_id = :exam_event_id AND deletedAt IS NULL LIMIT 1`,
    {
      replacements: { exam_event_id: validated.exam_event_id },
      type: db.Sequelize.QueryTypes.SELECT,
    }
  );

  if (!eventRows.length) {
    throw { status: 404, message: 'Exam event not found' };
  }

  const id = crypto.randomUUID();
  const now = new Date();
  const isEnabled = validated.hall_ticket_status === 'enabled' ? 1 : 0;

  await db.sequelize.query(
    `INSERT INTO hall_ticket_settings
      (id, exam_event_id, hall_ticket_status, release_date, download_last_date,
       late_exam_required, is_enabled, instructions, generated_at, createdAt, updatedAt)
     VALUES
      (:id, :exam_event_id, :hall_ticket_status, :release_date, :download_last_date,
       :late_exam_required, :is_enabled, :instructions, :generated_at, :now, :now)`,
    {
      replacements: {
        id,
        exam_event_id: validated.exam_event_id,
        hall_ticket_status: validated.hall_ticket_status,
        release_date: validated.release_date,
        download_last_date: validated.download_last_date,
        late_exam_required: validated.late_exam_required,
        is_enabled: isEnabled,
        instructions: JSON.stringify(validated.instructions || []),
        generated_at: isEnabled ? now : null,
        now,
      },
      type: db.Sequelize.QueryTypes.INSERT,
    }
  );

  return getHallTicketSettingsByEventId(validated.exam_event_id);
};

/**
 * Fetch hall ticket settings for a given exam event.
 * @param {string} exam_event_id
 * @returns {Promise<object|null>}
 */
const getHallTicketSettingsByEventId = async (exam_event_id) => {
  const rows = await db.sequelize.query(
    `SELECT * FROM hall_ticket_settings WHERE exam_event_id = :exam_event_id LIMIT 1`,
    {
      replacements: { exam_event_id },
      type: db.Sequelize.QueryTypes.SELECT,
    }
  );

  return normalizeSettingsRow(rows[0] || null);
};

/**
 * Update hall ticket settings for an exam event.
 * @param {string} exam_event_id
 * @param {object} data
 * @returns {Promise<object>}
 */
const updateHallTicketSettings = async (exam_event_id, data) => {
  const validated = hallTicketSettingsUpdateSchema.parse(data);

  const existing = await getHallTicketSettingsByEventId(exam_event_id);
  if (!existing) {
    throw { status: 404, message: 'Hall ticket settings not found for this exam event' };
  }

  const fields = [];
  const replacements = { exam_event_id, now: new Date() };

  if (validated.hall_ticket_status !== undefined) {
    fields.push('hall_ticket_status = :hall_ticket_status');
    replacements.hall_ticket_status = validated.hall_ticket_status;
    fields.push('is_enabled = :is_enabled');
    replacements.is_enabled = validated.hall_ticket_status === 'enabled' ? 1 : 0;
    if (validated.hall_ticket_status === 'enabled') {
      fields.push('generated_at = :generated_at');
      replacements.generated_at = replacements.now;
    }
  }
  if (validated.release_date !== undefined) {
    fields.push('release_date = :release_date');
    replacements.release_date = validated.release_date;
  }
  if (validated.download_last_date !== undefined) {
    fields.push('download_last_date = :download_last_date');
    replacements.download_last_date = validated.download_last_date;
  }
  if (validated.late_exam_required !== undefined) {
    fields.push('late_exam_required = :late_exam_required');
    replacements.late_exam_required = validated.late_exam_required;
  }
  if (validated.instructions !== undefined) {
    fields.push('instructions = :instructions');
    replacements.instructions = JSON.stringify(validated.instructions);
  }

  fields.push('updatedAt = :now');

  await db.sequelize.query(
    `UPDATE hall_ticket_settings SET ${fields.join(', ')} WHERE exam_event_id = :exam_event_id`,
    {
      replacements,
      type: db.Sequelize.QueryTypes.UPDATE,
    }
  );

  return getHallTicketSettingsByEventId(exam_event_id);
};

/**
 * Delete hall ticket settings for an exam event.
 * @param {string} exam_event_id
 * @returns {Promise<void>}
 */
const deleteHallTicketSettings = async (exam_event_id) => {
  const existing = await getHallTicketSettingsByEventId(exam_event_id);
  if (!existing) {
    throw { status: 404, message: 'Hall ticket settings not found for this exam event' };
  }

  await db.sequelize.query(
    `DELETE FROM hall_ticket_settings WHERE exam_event_id = :exam_event_id`,
    {
      replacements: { exam_event_id },
      type: db.Sequelize.QueryTypes.DELETE,
    }
  );
};

/**
 * Upsert settings (create or update) — used by COE save flow.
 * @param {object} data
 * @returns {Promise<object>}
 */
const saveHallTicketSettings = async (data) => {
  const parsed = hallTicketSettingsCreateSchema.parse(data);
  const existing = await getHallTicketSettingsByEventId(parsed.exam_event_id);
  if (existing) {
    const { exam_event_id, ...updatePayload } = parsed;
    return updateHallTicketSettings(exam_event_id, updatePayload);
  }
  return createHallTicketSettings(parsed);
};

/**
 * Preview payload for student-facing hall ticket view.
 * @param {string} exam_event_id
 * @returns {Promise<object>}
 */
const previewStudentView = async (exam_event_id) => {
  const settings = await getHallTicketSettingsByEventId(exam_event_id);
  if (!settings) {
    throw { status: 404, message: 'Hall ticket settings not found for this exam event' };
  }

  const eventRows = await db.sequelize.query(
    `SELECT event_id, event_name, exam_type, exam_date, exam_time, semester_id, status
     FROM exam_event WHERE event_id = :exam_event_id AND deletedAt IS NULL LIMIT 1`,
    {
      replacements: { exam_event_id },
      type: db.Sequelize.QueryTypes.SELECT,
    }
  );

  if (!eventRows.length) {
    throw { status: 404, message: 'Exam event not found' };
  }

  const sampleRegistrations = await db.sequelize.query(
    `SELECT er.sid, er.exam_reg_id
     FROM exam_registration er
     WHERE er.event_id = :exam_event_id AND er.reg_status = 'confirmed'
     LIMIT 1`,
    {
      replacements: { exam_event_id },
      type: db.Sequelize.QueryTypes.SELECT,
    }
  );

  let sampleStudent = null;
  if (sampleRegistrations.length > 0) {
    const hallTicketGenerateService = require('./hallTicketGenerate.service');
    try {
      sampleStudent = await hallTicketGenerateService.buildHallTicketPayload(
        sampleRegistrations[0].sid,
        exam_event_id,
        { skipDateWindowCheck: true, skipStatusCheck: true }
      );
    } catch {
      sampleStudent = null;
    }
  }

  return {
    settings,
    exam_event: eventRows[0],
    sample_hall_ticket: sampleStudent,
  };
};

module.exports = {
  normalizeSettingsRow,
  createHallTicketSettings,
  getHallTicketSettingsByEventId,
  updateHallTicketSettings,
  deleteHallTicketSettings,
  saveHallTicketSettings,
  previewStudentView,
};
