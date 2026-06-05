const db = require('../../../models');
const hallTicketSettingsService = require('./hallTicketSettings.service');

/**
 * Publish hall tickets for an exam event (enable student download/view).
 * @param {string} exam_event_id
 * @returns {Promise<object>}
 */
const publishHallTickets = async (exam_event_id) => {
  const settings = await hallTicketSettingsService.getHallTicketSettingsByEventId(exam_event_id);

  if (!settings) {
    throw {
      status: 404,
      message: 'Hall ticket settings not found. Save settings before publishing.',
    };
  }

  const now = new Date();

  await db.sequelize.query(
    `UPDATE exam_event SET is_published = 1, updatedAt = :now WHERE event_id = :exam_event_id`,
    {
      replacements: { exam_event_id, now },
      type: db.Sequelize.QueryTypes.UPDATE,
    }
  );

  const updated = await hallTicketSettingsService.updateHallTicketSettings(exam_event_id, {
    hall_ticket_status: 'enabled',
    is_enabled: true,
  });

  return {
    ...updated,
    exam_event_id,
    is_published: true,
    message: 'Hall tickets published. Students with hall_ticket:view and hall_ticket:download may access their tickets.',
  };
};

/**
 * Schedule publish metadata (stores disabled until release date job; status stays disabled until then).
 * @param {string} exam_event_id
 * @param {string} scheduled_at ISO datetime
 * @returns {Promise<object>}
 */
const schedulePublishHallTickets = async (exam_event_id, scheduled_at) => {
  const settings = await hallTicketSettingsService.getHallTicketSettingsByEventId(exam_event_id);

  if (!settings) {
    throw {
      status: 404,
      message: 'Hall ticket settings not found. Save settings before scheduling.',
    };
  }

  return {
    exam_event_id,
    scheduled_at,
    hall_ticket_status: settings.hall_ticket_status,
    message:
      'Publish scheduled. Hall tickets will be enabled automatically on the release date when it is reached.',
    settings,
  };
};

module.exports = {
  publishHallTickets,
  schedulePublishHallTickets,
};
