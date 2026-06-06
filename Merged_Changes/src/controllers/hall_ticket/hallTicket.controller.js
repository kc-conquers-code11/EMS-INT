const hallTicketService = require('../../services/hall_ticket/hall_ticket.service');
const hallTicketSettingsService = require('../../services/hall_ticket/hallTicketSettings.service');
const hallTicketGenerateService = require('../../services/hall_ticket/hallTicketGenerate.service');
const hallTicketGenerationControlService = require('../../services/hall_ticket/hallTicketGenerationControl.service');
const hallTicketStudentService = require('../../services/hall_ticket/hallTicketStudent.service');
const {
  getHallTicketPublishStatus,
  scheduleDelayedPublish,
  startPublishInBackground,
} = require('../../services/hall_ticket/hallTicketPublishJob.service');
const { isStudentUser } = require('../../middlewares/role.middleware');
const { ZodError } = require('zod');

const handleError = (res, error, fallbackMessage) => {
  if (error instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: error.errors || error.issues,
    });
  }

  const status = error.status || 500;
  console.error(fallbackMessage, error);
  return res.status(status).json({
    success: false,
    message: error.message || fallbackMessage,
    ...(process.env.NODE_ENV === 'development' && error.message && { error: error.message }),
  });
};

// --- Legacy global settings (backward compatible) ---

const getHallTicketSettings = async (req, res) => {
  try {
    const settings = await hallTicketService.getHallTicketSettings();
    return res.status(200).json({
      success: true,
      data: settings,
      message: 'Hall ticket settings retrieved successfully',
    });
  } catch (error) {
    return handleError(res, error, 'Failed to fetch hall ticket settings');
  }
};

const updateHallTicketSettingsLegacy = async (req, res) => {
  try {
    const updatedSettings = await hallTicketService.updateHallTicketSettings(req.body);
    return res.status(200).json({
      success: true,
      data: updatedSettings,
      message: 'Hall ticket settings updated',
    });
  } catch (error) {
    return handleError(res, error, 'Failed to update hall ticket settings');
  }
};

const downloadHallTicket = async (req, res) => {
  try {
    const studentPortal = isStudentUser(req.user);
    if (
      studentPortal &&
      req.params?.studentId &&
      req.user?.student_id &&
      req.params.studentId !== req.user.student_id
    ) {
      return res.status(403).json({
        success: false,
        message: 'You can only download your own hall ticket',
      });
    }
    const includePrincipalSignature = studentPortal
      ? true
      : req.query.include_principal_signature !== 'false' &&
        req.query.include_principal_signature !== '0';

    const { filePathToStream, fileNameToStream } = await hallTicketService.downloadHallTicket(
      req.params,
      {
        isStudentPortal: studentPortal,
        skipDateWindowCheck: !studentPortal,
        forceRegenerate: !studentPortal,
        includePrincipalSignature,
      }
    );
    res.setHeader('Content-Type', 'application/pdf');
    res.download(filePathToStream, fileNameToStream, (err) => {
      if (err && !res.headersSent) {
        return res.status(500).json({
          success: false,
          message: 'File transfer failed',
        });
      }
    });
  } catch (error) {
    return handleError(res, error, 'Failed to download hall ticket');
  }
};

const downloadHallTicketBulk = async (req, res) => {
  try {
    const data = await hallTicketService.downloadHallTicketBulk({
      eventId: req.body.exam_event_id,
      include_principal_signature: req.body.include_principal_signature !== false,
    });
    return res.status(200).json({
      success: true,
      data,
      message: 'Hall ticket bulk download completed',
    });
  } catch (error) {
    return handleError(res, error, 'Failed to bulk download hall tickets');
  }
};

// --- Per exam event settings ---

const createHallTicketSettings = async (req, res) => {
  try {
    const data = await hallTicketSettingsService.createHallTicketSettings(req.body);
    return res.status(201).json({
      success: true,
      data,
      message: 'Hall ticket settings created successfully',
    });
  } catch (error) {
    return handleError(res, error, 'Failed to create hall ticket settings');
  }
};

const getHallTicketSettingsByEvent = async (req, res) => {
  try {
    const { exam_event_id } = req.params;
    const data = await hallTicketSettingsService.getHallTicketSettingsByEventId(exam_event_id);
    if (!data) {
      return res.status(404).json({
        success: false,
        message: 'Hall ticket settings not found for this exam event',
      });
    }
    return res.status(200).json({
      success: true,
      data,
      message: 'Hall ticket settings retrieved successfully',
    });
  } catch (error) {
    return handleError(res, error, 'Failed to fetch hall ticket settings');
  }
};

const updateHallTicketSettingsByEvent = async (req, res) => {
  try {
    const { exam_event_id } = req.params;
    const data = await hallTicketSettingsService.updateHallTicketSettings(exam_event_id, req.body);
    return res.status(200).json({
      success: true,
      data,
      message: 'Hall ticket settings updated successfully',
    });
  } catch (error) {
    return handleError(res, error, 'Failed to update hall ticket settings');
  }
};

const deleteHallTicketSettingsByEvent = async (req, res) => {
  try {
    const { exam_event_id } = req.params;
    await hallTicketSettingsService.deleteHallTicketSettings(exam_event_id);
    return res.status(200).json({
      success: true,
      message: 'Hall ticket settings deleted successfully',
    });
  } catch (error) {
    return handleError(res, error, 'Failed to delete hall ticket settings');
  }
};

const previewStudentView = async (req, res) => {
  try {
    const { exam_event_id } = req.params;
    const data = await hallTicketSettingsService.previewStudentView(exam_event_id);
    return res.status(200).json({
      success: true,
      data,
      message: 'Hall ticket preview retrieved successfully',
    });
  } catch (error) {
    return handleError(res, error, 'Failed to load hall ticket preview');
  }
};

const saveHallTicketSettings = async (req, res) => {
  try {
    const data = await hallTicketSettingsService.saveHallTicketSettings(req.body);
    return res.status(200).json({
      success: true,
      data,
      message: 'Hall ticket settings saved successfully',
    });
  } catch (error) {
    if (error.status === 409) {
      return handleError(res, error, 'Hall ticket settings already exist');
    }
    return handleError(res, error, 'Failed to save hall ticket settings');
  }
};

// --- Generation control & generate ---

const getHallTicketGenerationControlData = async (req, res) => {
  try {
    const data = await hallTicketGenerationControlService.getHallTicketGenerationControlData(req.query);
    return res.status(200).json({
      success: true,
      data,
      message: 'Hall ticket generation control data retrieved successfully',
    });
  } catch (error) {
    return handleError(res, error, 'Failed to fetch generation control data');
  }
};

const getStudentsEligibility = async (req, res) => {
  try {
    const data = await hallTicketGenerationControlService.getStudentsEligibility(req.query);
    return res.status(200).json({
      success: true,
      data,
      message: 'Student eligibility list retrieved successfully',
    });
  } catch (error) {
    return handleError(res, error, 'Failed to fetch student eligibility');
  }
};

const generateHallTicket = async (req, res) => {
  try {
    const data = await hallTicketGenerateService.generateHallTicketsFromRequest(req.body);
    return res.status(200).json({
      success: true,
      data,
      message: 'Hall ticket generation completed',
    });
  } catch (error) {
    return handleError(res, error, 'Failed to generate hall ticket');
  }
};

const getEligibilityFilterOptions = async (req, res) => {
  try {
    const { exam_event_id } = req.query;
    const data = await hallTicketGenerationControlService.getEligibilityFilterOptions(
      exam_event_id
    );
    return res.status(200).json({
      success: true,
      data,
      message: 'Filter options retrieved successfully',
    });
  } catch (error) {
    return handleError(res, error, 'Failed to fetch filter options');
  }
};

const setStudentHallTicketHold = async (req, res) => {
  try {
    const { exam_reg_id, on_hold } = req.body;
    const data = await hallTicketGenerationControlService.setStudentHallTicketHold(
      exam_reg_id,
      on_hold
    );
    return res.status(200).json({
      success: true,
      data,
      message: on_hold ? 'Student placed on hold' : 'Hold removed successfully',
    });
  } catch (error) {
    return handleError(res, error, 'Failed to update student hold status');
  }
};

const publishHallTickets = async (req, res) => {
  try {
    const { exam_event_id, scheduled_at } = req.body;

    if (scheduled_at) {
      const delayMs = new Date(scheduled_at).getTime() - Date.now();
      if (delayMs >= 1000) {
        const data = await scheduleDelayedPublish(exam_event_id, scheduled_at);
        return res.status(200).json({
          success: true,
          data: {
            exam_event_id,
            message: 'Scheduled',
            scheduled_at: data.scheduled_at || scheduled_at,
          },
          message: 'Hall ticket publish scheduled successfully',
        });
      }
    }

    const data = await startPublishInBackground(exam_event_id);
    return res.status(200).json({
      success: true,
      data: {
        exam_event_id,
        message: 'Publishing',
        scheduled_at: null,
        status: data.status,
      },
      message: 'Hall tickets are being published',
    });
  } catch (error) {
    return handleError(res, error, 'Failed to publish hall tickets');
  }
};

const getHallTicketPublishStatusHandler = async (req, res) => {
  try {
    const { exam_event_id } = req.params;
    const data = await getHallTicketPublishStatus(exam_event_id);
    return res.status(200).json({
      success: true,
      data,
      message: 'Publish status retrieved successfully',
    });
  } catch (error) {
    return handleError(res, error, 'Failed to fetch publish status');
  }
};

const getStudentHallTicketView = async (req, res) => {
  try {
    const uid = req.user?.uid;
    if (!uid) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    const data = await hallTicketStudentService.getStudentHallTicketView(
      uid,
      req.query.event_id
    );
    return res.status(200).json({
      success: true,
      data,
      message: 'Student hall ticket retrieved successfully',
    });
  } catch (error) {
    return handleError(res, error, 'Failed to load hall ticket');
  }
};

const downloadStudentHallTicket = async (req, res) => {
  try {
    const uid = req.user?.uid;
    if (!uid) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    const studentId = await hallTicketStudentService.getStudentIdByUid(uid);
    const eventId = req.query.event_id || req.params.eventId;
    const { filePathToStream, fileNameToStream } = await hallTicketService.downloadHallTicket(
      {
        studentId,
        eventId,
      },
      {
        isStudentPortal: true,
        skipDateWindowCheck: false,
        forceRegenerate: false,
        includePrincipalSignature: true,
      }
    );
    res.setHeader('Content-Type', 'application/pdf');
    res.download(filePathToStream, fileNameToStream, (err) => {
      if (err && !res.headersSent) {
        return res.status(500).json({
          success: false,
          message: 'File transfer failed',
        });
      }
    });
  } catch (error) {
    return handleError(res, error, 'Failed to download hall ticket');
  }
};

module.exports = {
  getHallTicketSettings,
  updateHallTicketSettingsLegacy,
  downloadHallTicket,
  downloadHallTicketBulk,
  createHallTicketSettings,
  getHallTicketSettingsByEvent,
  updateHallTicketSettingsByEvent,
  deleteHallTicketSettingsByEvent,
  previewStudentView,
  saveHallTicketSettings,
  getHallTicketGenerationControlData,
  getStudentsEligibility,
  generateHallTicket,
  getEligibilityFilterOptions,
  setStudentHallTicketHold,
  publishHallTickets,
  getHallTicketPublishStatusHandler,
  getStudentHallTicketView,
  downloadStudentHallTicket,
};
