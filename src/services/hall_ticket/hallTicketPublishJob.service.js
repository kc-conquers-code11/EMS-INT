const db = require('../../../models');
const hallTicketPublishService = require('./hallTicketPublish.service');
const hallTicketService = require('./hall_ticket.service');
const hallTicketSettingsService = require('./hallTicketSettings.service');
const { getStudentsEligibility } = require('./hallTicketGenerationControl.service');

const pendingTimeouts = new Map();
const publishingIds = new Set();
const lastPublishErrors = new Map();

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
    console.warn('[hallTicketPublishJob] scheduled_publish_at update skipped:', err.message);
  }
};

const clearPendingPublish = (examEventId) => {
  const timeout = pendingTimeouts.get(examEventId);
  if (timeout) clearTimeout(timeout);
  pendingTimeouts.delete(examEventId);
};

const assertPublishSettings = async (examEventId) => {
  const settings = await hallTicketSettingsService.getHallTicketSettingsByEventId(examEventId);
  if (!settings) {
    throw {
      status: 404,
      message: 'Hall ticket settings not found. Save settings before publishing.',
    };
  }
  if (publishingIds.has(examEventId)) {
    throw { status: 409, message: 'Publish is already running for this exam event' };
  }
  return settings;
};

/**
 * Full publish job: enable event, generate PDFs for eligible students, set published_at.
 * @param {{ exam_event_id: string, include_principal_signature?: boolean }} jobData
 */
const runHallTicketPublishJob = async (jobData) => {
  const { exam_event_id, include_principal_signature: includePrincipalSignature = true } =
    jobData;

  const publishResult = await hallTicketPublishService.publishHallTickets(exam_event_id);

  const { students } = await getStudentsEligibility({
    exam_event_id,
    eligibility_status: 'eligible',
  });

  const eligible = students.filter(
    (s) => s.student_id && s.eligibility === 'Eligible' && !s.on_hold
  );
  const results = [];

  for (const student of eligible) {
    try {
      await hallTicketService.downloadHallTicket(
        { studentId: student.student_id, eventId: exam_event_id },
        {
          skipDateWindowCheck: true,
          forceRegenerate: true,
          includePrincipalSignature,
        }
      );
      console.log(`[hallTicketPublishJob] PDF generated for student ${student.student_id}`);
      results.push({ student_id: student.student_id, success: true });
    } catch (err) {
      console.error(
        `[hallTicketPublishJob] Failed for student ${student.student_id}:`,
        err.message || err
      );
      results.push({
        student_id: student.student_id,
        success: false,
        error: err.message || 'Generation failed',
      });
    }
  }

  const now = new Date();
  try {
    await db.sequelize.query(
      `UPDATE hall_ticket_settings
       SET published_at = :now,
           scheduled_publish_at = NULL,
           hall_ticket_status = 'enabled',
           is_enabled = 1,
           updatedAt = :now
       WHERE exam_event_id = :exam_event_id`,
      {
        replacements: { exam_event_id, now },
        type: db.Sequelize.QueryTypes.UPDATE,
      }
    );
  } catch (err) {
    console.warn('[hallTicketPublishJob] published_at column missing, updating status only:', err.message);
    await hallTicketSettingsService.updateHallTicketSettings(exam_event_id, {
      hall_ticket_status: 'enabled',
      is_enabled: true,
    });
  }

  lastPublishErrors.delete(exam_event_id);

  return {
    ...publishResult,
    generated_count: results.filter((r) => r.success).length,
    results,
    published_at: now.toISOString(),
  };
};

/**
 * Run publish in-process (no Redis).
 * @param {{ exam_event_id: string, include_principal_signature?: boolean }} jobData
 */
const executePublishJob = async (jobData) => {
  const { exam_event_id } = jobData;
  await assertPublishSettings(exam_event_id);
  clearPendingPublish(exam_event_id);
  publishingIds.add(exam_event_id);
  try {
    return await runHallTicketPublishJob(jobData);
  } catch (err) {
    lastPublishErrors.set(exam_event_id, err.message || 'Publish failed');
    throw err;
  } finally {
    publishingIds.delete(exam_event_id);
  }
};

/**
 * Schedule publish via setTimeout (for Schedule Publish modal).
 * @param {string} examEventId
 * @param {string} scheduledAt ISO datetime
 */
const scheduleDelayedPublish = async (examEventId, scheduledAt) => {
  await assertPublishSettings(examEventId);
  clearPendingPublish(examEventId);

  const delayMs = Math.max(0, new Date(scheduledAt).getTime() - Date.now());
  if (delayMs < 1000) {
    return executePublishJob({ exam_event_id: examEventId });
  }

  await saveScheduledPublishAt(examEventId, scheduledAt);

  const timeout = setTimeout(() => {
    pendingTimeouts.delete(examEventId);
    executePublishJob({ exam_event_id: examEventId }).catch((err) => {
      console.error('[hallTicketPublishJob] scheduled publish failed:', err.message || err);
    });
  }, delayMs);

  pendingTimeouts.set(examEventId, timeout);
  return { exam_event_id: examEventId, scheduled_at: scheduledAt };
};

/**
 * Start publish without blocking the HTTP response.
 * @param {string} examEventId
 */
const startPublishInBackground = async (examEventId) => {
  await assertPublishSettings(examEventId);
  clearPendingPublish(examEventId);

  setImmediate(() => {
    executePublishJob({ exam_event_id: examEventId }).catch((err) => {
      console.error('[hallTicketPublishJob] background publish failed:', err.message || err);
    });
  });

  return { exam_event_id: examEventId, status: 'active' };
};

/**
 * @param {string} examEventId
 */
const getHallTicketPublishStatus = async (examEventId) => {
  const settings = await hallTicketSettingsService.getHallTicketSettingsByEventId(examEventId);
  const [eventRow] = await db.sequelize.query(
    `SELECT is_published FROM exam_event WHERE event_id = :exam_event_id AND deletedAt IS NULL LIMIT 1`,
    {
      replacements: { exam_event_id: examEventId },
      type: db.Sequelize.QueryTypes.SELECT,
    }
  );

  const isPublished =
    settings?.hall_ticket_status === 'enabled' ||
    Number(eventRow?.is_published) === 1;

  let scheduled_at = settings?.scheduled_publish_at
    ? new Date(settings.scheduled_publish_at).toISOString()
    : null;
  let published_at = settings?.published_at
    ? new Date(settings.published_at).toISOString()
    : null;

  let status = 'not_found';

  if (lastPublishErrors.has(examEventId)) {
    status = 'failed';
  } else if (publishingIds.has(examEventId)) {
    status = 'active';
  } else if (pendingTimeouts.has(examEventId)) {
    status = 'scheduled';
  } else if (scheduled_at && new Date(scheduled_at).getTime() > Date.now()) {
    status = 'scheduled';
  } else if (isPublished) {
    status = 'completed';
  }

  return {
    status,
    scheduled_at,
    published_at,
    is_published: isPublished,
    error: lastPublishErrors.get(examEventId) || null,
  };
};

module.exports = {
  runHallTicketPublishJob,
  executePublishJob,
  scheduleDelayedPublish,
  startPublishInBackground,
  getHallTicketPublishStatus,
};
