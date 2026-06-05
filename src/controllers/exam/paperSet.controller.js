const { ZodError } = require('zod');
const PaperSetService = require('../../services/exam/paperSet.service.js');
const { getEffectiveScope } = require('../../helpers/scope.helper.js');
const {
  requestPaperSetSchema,
  setIdParamSchema,
  finalLockBodySchema,
  listPaperSetsSchema,
} = require('../../validations/exam/paperSet.validation.js');

const requireFacultyId = (req) => {
  const facultyId = req.user?.faculty_id;
  if (!facultyId) {
    throw {
      status: 403,
      message:
        'Faculty profile is not linked to this account. Ensure users.faculty_id is set.',
    };
  }
  return facultyId;
};

const resolveListUserId = (req) => {
  if (req.user.role === 'Faculty') {
    return requireFacultyId(req);
  }
  return req.user.uid;
};

const handleError = (res, error, label) => {
  if (error instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: error.errors,
    });
  }
  if (error.status) {
    return res.status(error.status).json({
      success: false,
      message: error.message,
    });
  }
  console.error(`Error in ${label}:`, error);
  return res.status(500).json({
    success: false,
    message: error.message || 'Internal server error',
  });
};

const requestPaperSet = async (req, res) => {
  try {
    const payload = requestPaperSetSchema.parse(req.body);
    const paperService = new PaperSetService(req.db);
    const result = await paperService.requestPaperSet(payload, req.user.uid);

    return res.status(201).json({
      success: true,
      data: result,
      message: 'Question paper request created and sent to faculty',
    });
  } catch (error) {
    return handleError(res, error, 'requestPaperSet');
  }
};

const acceptPaperSet = async (req, res) => {
  try {
    const { set_id } = setIdParamSchema.parse(req.params);
    const facultyId = requireFacultyId(req);
    const paperService = new PaperSetService(req.db);
    const result = await paperService.acceptPaperSet(set_id, facultyId);

    return res.status(200).json({
      success: true,
      data: result,
      message: result.message,
    });
  } catch (error) {
    return handleError(res, error, 'acceptPaperSet');
  }
};

const uploadPaperSet = async (req, res) => {
  try {
    const { set_id } = setIdParamSchema.parse(req.params);
    const facultyId = requireFacultyId(req);

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded. Send multipart/form-data with field "file".',
      });
    }

    const paperService = new PaperSetService(req.db);
    const result = await paperService.uploadPaperFile(
      set_id,
      facultyId,
      req.file
    );

    return res.status(200).json({
      success: true,
      data: result,
      message: 'Question paper document uploaded successfully',
    });
  } catch (error) {
    return handleError(res, error, 'uploadPaperSet');
  }
};

const savePaperDraft = async (req, res) => {
  try {
    const { set_id } = setIdParamSchema.parse(req.params);
    const facultyId = requireFacultyId(req);
    const payload = req.body;

    if (!payload || !Array.isArray(payload.questions)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payload structure. Expected an object with a questions array.',
      });
    }

    const paperService = new PaperSetService(req.db);
    const result = await paperService.saveDraftPayload(set_id, facultyId, payload);

    return res.status(200).json({
      success: true,
      data: result,
      message: 'Question paper draft saved successfully',
    });
  } catch (error) {
    return handleError(res, error, 'savePaperDraft');
  }
};

const lockAndSubmitPaperSet = async (req, res) => {
  try {
    const { set_id } = setIdParamSchema.parse(req.params);
    const facultyId = requireFacultyId(req);
    const paperService = new PaperSetService(req.db);
    const result = await paperService.lockAndSubmit(set_id, facultyId);

    return res.status(200).json({
      success: true,
      data: result,
      message: result.message,
    });
  } catch (error) {
    return handleError(res, error, 'lockAndSubmitPaperSet');
  }
};

const reviewPaper = async (req, res) => {
  try {
    const { set_id } = setIdParamSchema.parse(req.params);
    const { status, rejection_reason } = req.body;
    
    // Ensure COE only
    if (req.user.role !== 'COE') {
      return res.status(403).json({ success: false, message: 'Access denied: COE only' });
    }

    if (!['APPROVED', 'REJECTED'].includes(status)) {
       return res.status(400).json({ success: false, message: 'Status must be APPROVED or REJECTED' });
    }

    if (status === 'REJECTED' && !rejection_reason) {
       return res.status(400).json({ success: false, message: 'Rejection reason is required' });
    }

    const paperService = new PaperSetService(req.db);
    const result = await paperService.reviewPaperDraft(set_id, req.user.uid, status, rejection_reason);

    return res.status(200).json({
      success: true,
      data: result,
      message: result.message,
    });
  } catch (error) {
    return handleError(res, error, 'reviewPaper');
  }
};

const finalLockPaperSet = async (req, res) => {
  try {
    const { set_id } = setIdParamSchema.parse(req.params);
    const { remarks } = finalLockBodySchema.parse(req.body || {});
    const paperService = new PaperSetService(req.db);
    const result = await paperService.finalLock(set_id, req.user.uid, remarks);

    return res.status(200).json({
      success: true,
      data: result,
      message: result.message,
    });
  } catch (error) {
    return handleError(res, error, 'finalLockPaperSet');
  }
};

const downloadPaperSet = async (req, res) => {
  try {
    const { set_id } = setIdParamSchema.parse(req.params);
    const userId = resolveListUserId(req);
    const userRole = req.user.role;

    const paperService = new PaperSetService(req.db);
    const { absolutePath, fileName, mimeType } =
      await paperService.resolveDownload(set_id, userId, userRole);

    return res.download(absolutePath, fileName, {
      headers: { 'Content-Type': mimeType },
    });
  } catch (error) {
    return handleError(res, error, 'downloadPaperSet');
  }
};

const getPaperSetApprovalHistory = async (req, res) => {
  try {
    const { set_id } = setIdParamSchema.parse(req.params);
    const paperService = new PaperSetService(req.db);
    const history = await paperService.getApprovalHistory(set_id);

    return res.status(200).json({
      success: true,
      data: history,
      message: 'Audit history retrieved successfully',
    });
  } catch (error) {
    return handleError(res, error, 'getPaperSetApprovalHistory');
  }
};

const getPaperSetById = async (req, res) => {
  try {
    const { set_id } = setIdParamSchema.parse(req.params);
    const userId = resolveListUserId(req);
    const userRole = req.user.role;

    const paperService = new PaperSetService(req.db);
    const result = await paperService.getPaperSetById(
      set_id,
      userId,
      userRole
    );

    return res.status(200).json({
      success: true,
      data: result,
      message: 'Question paper request retrieved successfully',
    });
  } catch (error) {
    return handleError(res, error, 'getPaperSetById');
  }
};

const listPaperSets = async (req, res) => {
  try {
    const filters = listPaperSetsSchema.parse(req.query);
    const { page, limit, ...rest } = filters;
    const userId = resolveListUserId(req);
    const userRole = req.user.role;

    const paperService = new PaperSetService(req.db);
    const result = await paperService.listPaperSets(
      rest,
      page,
      limit,
      userId,
      userRole,
      getEffectiveScope(req.user)
    );

    return res.status(200).json({
      success: true,
      data: result.data,
      pagination: result.pagination,
      message: 'Question paper requests retrieved successfully',
    });
  } catch (error) {
    return handleError(res, error, 'listPaperSets');
  }
};

// --- Aliases requested for Phase 2 ---
const createPaperRequest = requestPaperSet;

const getRequestsByFaculty = async (req, res) => {
  // Ensure faculty only
  if (req.user.role !== 'Faculty') {
    return res.status(403).json({ success: false, message: 'Access denied: Faculty only' });
  }
  return listPaperSets(req, res);
};

const getRequestsByCOE = async (req, res) => {
  // Ensure COE only
  if (req.user.role !== 'COE') {
    return res.status(403).json({ success: false, message: 'Access denied: COE only' });
  }
  return listPaperSets(req, res);
};

module.exports = {
  requestPaperSet,
  acceptPaperSet,
  uploadPaperSet,
  lockAndSubmitPaperSet,
  finalLockPaperSet,
  downloadPaperSet,
  getPaperSetApprovalHistory,
  getPaperSetById,
  listPaperSets,
  createPaperRequest,
  getRequestsByFaculty,
  getRequestsByCOE,
  savePaperDraft,
  reviewPaper,
};
