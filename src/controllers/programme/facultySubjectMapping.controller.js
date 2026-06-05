const { ZodError } = require('zod');
const facultySubjectMappingService = require('../../services/programme/facultySubjectMapping.service.js');
const { getEffectiveScope } = require('../../helpers/scope.helper.js');
const {
  mappingIdParamSchema,
  listQuerySchema,
  createMappingSchema,
  updateMappingSchema,
  subjectsLookupQuerySchema,
  upsertFacultyMappingSchema,
  facultyIdParamSchema,
} = require('../../validations/programme/facultySubjectMapping.validation.js');
const { z } = require('zod');

const subjectIdParamSchema = z.object({
  subject_id: z.string().uuid(),
});

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

const listMappings = async (req, res) => {
  try {
    const query = listQuerySchema.parse(req.query);
    const result = await facultySubjectMappingService.listMappings(
      getEffectiveScope(req.user),
      req.user,
      query
    );
    return res.status(200).json({
      success: true,
      ...result,
      message: 'Subject-faculty mappings retrieved successfully',
    });
  } catch (error) {
    return handleError(res, error, 'listMappings');
  }
};

const getSubjectMappingDetail = async (req, res) => {
  try {
    const { subject_id } = subjectIdParamSchema.parse(req.params);
    const semester_id = req.query.semester_id || null;
    const data = await facultySubjectMappingService.getMappingDetailBySubject(
      getEffectiveScope(req.user),
      req.user,
      subject_id,
      semester_id
    );
    return res.status(200).json({
      success: true,
      data,
      message: 'Mapping detail retrieved successfully',
    });
  } catch (error) {
    return handleError(res, error, 'getSubjectMappingDetail');
  }
};

const listFacultyLookup = async (req, res) => {
  try {
    const data = await facultySubjectMappingService.listDepartmentFaculty(
      getEffectiveScope(req.user),
      req.user
    );
    return res.status(200).json({
      success: true,
      data,
      message: 'Faculty list retrieved successfully',
    });
  } catch (error) {
    return handleError(res, error, 'listFacultyLookup');
  }
};

const listSemestersLookup = async (req, res) => {
  try {
    const data = await facultySubjectMappingService.listDepartmentSemesters(
      getEffectiveScope(req.user),
      req.user
    );
    return res.status(200).json({
      success: true,
      data,
      message: 'Semesters list retrieved successfully',
    });
  } catch (error) {
    return handleError(res, error, 'listSemestersLookup');
  }
};

const listSubjectsLookup = async (req, res) => {
  try {
    const { semester_id } = subjectsLookupQuerySchema.parse(req.query);
    const data = await facultySubjectMappingService.listDepartmentSubjects(
      getEffectiveScope(req.user),
      req.user,
      semester_id
    );
    return res.status(200).json({
      success: true,
      data,
      message: 'Subjects list retrieved successfully',
    });
  } catch (error) {
    return handleError(res, error, 'listSubjectsLookup');
  }
};

const listMySubjects = async (req, res) => {
  try {
    const data = await facultySubjectMappingService.listMySubjects(
      getEffectiveScope(req.user),
      req.user
    );
    return res.status(200).json({
      success: true,
      data,
      message: 'Assigned subjects retrieved successfully',
    });
  } catch (error) {
    return handleError(res, error, 'listMySubjects');
  }
};

const createMapping = async (req, res) => {
  try {
    const payload = createMappingSchema.parse(req.body);
    const data = await facultySubjectMappingService.upsertMappingsForSubject(
      getEffectiveScope(req.user),
      req.user,
      payload,
      req.user.uid
    );
    return res.status(201).json({
      success: true,
      data,
      message: 'Subject-faculty mapping saved successfully',
    });
  } catch (error) {
    return handleError(res, error, 'createMapping');
  }
};

const updateSubjectMapping = async (req, res) => {
  try {
    const { subject_id } = subjectIdParamSchema.parse(req.params);
    const payload = updateMappingSchema.parse(req.body);
    const data = await facultySubjectMappingService.upsertMappingsForSubject(
      getEffectiveScope(req.user),
      req.user,
      {
        subject_id,
        semester_id: payload.semester_id,
        faculty_ids: payload.faculty_ids,
        faculty_role: payload.faculty_role,
      },
      req.user.uid
    );
    return res.status(200).json({
      success: true,
      data,
      message: 'Subject-faculty mapping updated successfully',
    });
  } catch (error) {
    return handleError(res, error, 'updateSubjectMapping');
  }
};

const deleteMapping = async (req, res) => {
  try {
    const { id } = mappingIdParamSchema.parse(req.params);
    const result = await facultySubjectMappingService.deleteMapping(
      getEffectiveScope(req.user),
      req.user,
      id
    );
    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    return handleError(res, error, 'deleteMapping');
  }
};

const getFacultyAllocationPanel = async (req, res) => {
  try {
    const { faculty_id } = facultyIdParamSchema.parse(req.params);
    const data = await facultySubjectMappingService.getFacultyAllocationPanel(
      getEffectiveScope(req.user),
      req.user,
      faculty_id
    );
    return res.status(200).json({
      success: true,
      data,
      message: 'Faculty allocation panel retrieved successfully',
    });
  } catch (error) {
    return handleError(res, error, 'getFacultyAllocationPanel');
  }
};

const upsertFacultyMapping = async (req, res) => {
  try {
    const { faculty_id } = facultyIdParamSchema.parse(req.params);
    const payload = upsertFacultyMappingSchema.parse({
      ...req.body,
      faculty_id,
    });
    const data = await facultySubjectMappingService.upsertMappingsForFaculty(
      getEffectiveScope(req.user),
      req.user,
      payload
    );
    return res.status(200).json({
      success: true,
      data,
      message: 'Faculty subject assignments saved successfully',
    });
  } catch (error) {
    return handleError(res, error, 'upsertFacultyMapping');
  }
};

module.exports = {
  listMappings,
  getSubjectMappingDetail,
  listFacultyLookup,
  listSemestersLookup,
  listSubjectsLookup,
  listMySubjects,
  createMapping,
  updateSubjectMapping,
  deleteMapping,
  getFacultyAllocationPanel,
  upsertFacultyMapping,
};
