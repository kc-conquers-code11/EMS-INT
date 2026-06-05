const { Queue } = require('bullmq');
const { getRedisConnection } = require('../config/redis.connection');
const hallTicketSettingsService = require('../services/hall_ticket/hallTicketSettings.service');
const db = require('../../models');

const QUEUE_NAME = 'hall-ticket-publish';

const hallTicketPublishQueue = new Queue(QUEUE_NAME, {
  connection: getRedisConnection(),
});

const jobIdForEvent = (examEventId) => `publish-hall-ticket-${examEventId}`;

const saveScheduledPublishAt = async (examEventId, scheduledAt) => {
  const now = new Date();
  try {
    await db.sequelize.query(
      `UPDATE hall_ticket_settings
       SET scheduled_publish_at = :scheduled_at, updatedAt = :now
       WHERE exam_event_id = :exam_event_id`,
      {
        replacements: {
          exam_event_id: examEventId,
          scheduled_at: new Date(scheduledAt),
          now,
        },
        type: db.Sequelize.QueryTypes.UPDATE,
      }
    );
  } catch (err) {
    console.warn('[hallTicket.queue] scheduled_publish_at update skipped:', err.message);
  }
};

/**
 * Enqueue hall ticket publish (immediate or delayed).
 * @param {string} examEventId
 * @param {string} [scheduledAt] ISO datetime
 * @returns {Promise<import('bullmq').Job>}
 */
const addPublishJob = async (examEventId, scheduledAt) => {
  const settings = await hallTicketSettingsService.getHallTicketSettingsByEventId(examEventId);
  if (!settings) {
    throw {
      status: 404,
      message: 'Hall ticket settings not found. Save settings before publishing.',
    };
  }

  const jobId = jobIdForEvent(examEventId);
  const existing = await hallTicketPublishQueue.getJob(jobId);
  if (existing) {
    const state = await existing.getState();
    if (state === 'active') {
      throw { status: 409, message: 'Publish job is already running for this exam event' };
    }
    await existing.remove();
  }

  const delay = scheduledAt
    ? Math.max(0, new Date(scheduledAt).getTime() - Date.now())
    : 0;

  if (scheduledAt) {
    await saveScheduledPublishAt(examEventId, scheduledAt);
  }

  const job = await hallTicketPublishQueue.add(
    'publish-hall-tickets',
    {
      exam_event_id: examEventId,
      include_principal_signature: true,
      scheduled_at: scheduledAt || null,
    },
    {
      jobId,
      delay,
      removeOnComplete: true,
      removeOnFail: false,
    }
  );

  return job;
};

module.exports = {
  QUEUE_NAME,
  hallTicketPublishQueue,
  jobIdForEvent,
  addPublishJob,
};
