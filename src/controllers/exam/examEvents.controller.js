//EMS-Backend/src/controllers/exam/examEvents.controller.js
const examEventsService = require('../../services/exam/examEvents.service.js');
const {
  createExamEventSchema,
  updateExamEventSchema,
  examEventIdParamSchema,
  idParamSchema,
  rescheduleExamEventSchema,
} = require('../../validations/exam/examEvents.validation.js');
const { ZodError } = require('zod');
const db = require('../../../models/index.js');
const {
  getEffectiveScope,
  buildInstitutionScopeClause,
  assertInstitutionAccess,
} = require('../../helpers/scope.helper.js');


// Get all exam events with related details
const getAllExamEvents = async (req, res) => {
  try {
    const scope = getEffectiveScope(req.user);
    const { clause, replacements } = buildInstitutionScopeClause(scope, 'ee');
    const scopeSql = clause ? `AND ${clause}` : '';

    let query = `
      SELECT 
        ee.*,
        i.name as institution_name, i.institution_type as institution_type,
        ay.academic_name, ay.current_ay,
        s.semester_number, s.term_type as term,
        ep.pattern_name, ep.grading_type
      FROM exam_event ee
      LEFT JOIN institution i ON ee.institution_id = i.institution_id
      LEFT JOIN academic_year ay ON ee.academic_id = ay.academic_id
      LEFT JOIN semester s ON ee.semester_id = s.semester_id
      LEFT JOIN exam_pattern ep ON ee.pattern_id = ep.pattern_id
      WHERE ee.deletedAt IS NULL
      ${scopeSql}
      ORDER BY ee.createdAt DESC
    `;

    const examEvents = await db.sequelize.query(query, {
      replacements,
      nest: true,
      type: db.Sequelize.QueryTypes.SELECT,
    });

    res.status(200).json({
      success: true,
      data: examEvents,
      message: 'Exam events retrieved successfully',
    });
  } catch (error) {
    console.error('Error in getAllExamEvents:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

// Get exam event by ID with related details
const getExamEventById = async (req, res) => {
  try {
    const { event_id } = examEventIdParamSchema.parse(req.params);

    let query = `
      SELECT 
        ee.*,
        i.name as institution_name, i.institution_type as institution_type,
        ay.academic_name, ay.current_ay,
        s.semester_number, s.term_type as term,
        ep.pattern_name, ep.grading_type
      FROM exam_event ee
      LEFT JOIN institution i ON ee.institution_id = i.institution_id
      LEFT JOIN academic_year ay ON ee.academic_id = ay.academic_id
      LEFT JOIN semester s ON ee.semester_id = s.semester_id
      LEFT JOIN exam_pattern ep ON ee.pattern_id = ep.pattern_id
      WHERE ee.event_id = :event_id AND ee.deletedAt IS NULL
    `;

    const [examEvent] = await db.sequelize.query(query, {
      replacements: { event_id },
      nest: true,
      type: db.Sequelize.QueryTypes.SELECT,
    });

    if (!examEvent) {
      return res.status(404).json({
        success: false,
        message: 'Exam event not found',
      });
    }

    assertInstitutionAccess(getEffectiveScope(req.user), examEvent.institution_id);

    res.status(200).json({
      success: true,
      data: examEvent,
      message: 'Exam event retrieved successfully',
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors || error.issues,
      });
    }

    console.error('Error in getExamEventById:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

// Get exam events by institution ID
const getExamEventsByInstitution = async (req, res) => {
  try {
    const { id } = idParamSchema.parse(req.params);

    // Check if institution exists
    const institutionQuery = await db.sequelize.query(
      `SELECT * FROM institution WHERE institution_id = :id`,
      {
        replacements: { id },
        type: db.Sequelize.QueryTypes.SELECT,
      }
    );

    if (!institutionQuery || institutionQuery.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Institution not found',
      });
    }

    const examEvents = await db.sequelize.query(
      `
      SELECT 
        ee.*,
        ay.academic_name,
        s.semester_number,
        ep.pattern_name
      FROM exam_event ee
      LEFT JOIN academic_year ay ON ee.academic_id = ay.academic_id
      LEFT JOIN semester s ON ee.semester_id = s.semester_id
      LEFT JOIN exam_pattern ep ON ee.pattern_id = ep.pattern_id
      WHERE ee.institution_id = :id AND ee.deletedAt IS NULL
      ORDER BY ee.createdAt DESC
    `,
      {
        replacements: { id },
        nest: true,
        type: db.Sequelize.QueryTypes.SELECT,
      }
    );

    res.status(200).json({
      success: true,
      data: examEvents,
      institution_name: institutionQuery[0].name,
      message: 'Exam events retrieved successfully',
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors || error.issues,
      });
    }

    console.error('Error in getExamEventsByInstitution:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

// Get exam events by academic year
const getExamEventsByAcademicYear = async (req, res) => {
  try {
    const { id } = idParamSchema.parse(req.params);

    // Check if academic year exists
    const academicYearQuery = await db.sequelize.query(
      `SELECT * FROM academic_year WHERE academic_id = :id`,
      {
        replacements: { id },
        type: db.Sequelize.QueryTypes.SELECT,
      }
    );

    if (!academicYearQuery || academicYearQuery.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Academic year not found',
      });
    }

    const examEvents = await db.sequelize.query(
      `
      SELECT 
        ee.*,
        i.name as institution_name,
        s.semester_number,
        ep.pattern_name
      FROM exam_event ee
      LEFT JOIN institution i ON ee.institution_id = i.institution_id
      LEFT JOIN semester s ON ee.semester_id = s.semester_id
      LEFT JOIN exam_pattern ep ON ee.pattern_id = ep.pattern_id
      WHERE ee.academic_id = :id AND ee.deletedAt IS NULL
      ORDER BY ee.createdAt DESC
    `,
      {
        replacements: { id },
        nest: true,
        type: db.Sequelize.QueryTypes.SELECT,
      }
    );

    res.status(200).json({
      success: true,
      data: examEvents,
      academic_name: academicYearQuery[0].academic_name,
      message: 'Exam events retrieved successfully',
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors || error.issues,
      });
    }

    console.error('Error in getExamEventsByAcademicYear:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

// Get exam events by semester
const getExamEventsBySemester = async (req, res) => {
  try {
    const { id } = idParamSchema.parse(req.params);

    // Check if semester exists
    const semesterQuery = await db.sequelize.query(
      `SELECT * FROM semester WHERE semester_id = :id`,
      {
        replacements: { id },
        type: db.Sequelize.QueryTypes.SELECT,
      }
    );

    if (!semesterQuery || semesterQuery.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Semester not found',
      });
    }

    const examEvents = await db.sequelize.query(
      `
      SELECT 
        ee.*,
        i.name as institution_name,
        ay.academic_name,
        ep.pattern_name
      FROM exam_event ee
      LEFT JOIN institution i ON ee.institution_id = i.institution_id
      LEFT JOIN academic_year ay ON ee.academic_id = ay.academic_id
      LEFT JOIN exam_pattern ep ON ee.pattern_id = ep.pattern_id
      WHERE ee.semester_id = :id AND ee.deletedAt IS NULL
      ORDER BY ee.createdAt DESC
    `,
      {
        replacements: { id },
        nest: true,
        type: db.Sequelize.QueryTypes.SELECT,
      }
    );

    res.status(200).json({
      success: true,
      data: examEvents,
      semester_number: semesterQuery[0].semester_number,
      message: 'Exam events retrieved successfully',
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors || error.issues,
      });
    }

    console.error('Error in getExamEventsBySemester:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

// Get exam events by status
const getExamEventsByStatus = async (req, res) => {
  try {
    const { status } = req.params;

    const validStatuses = [
      'draft',
      'published',
      'ongoing',
      'completed',
      'cancelled',
    ];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message:
          'Invalid status. Valid statuses: draft, published, ongoing, completed, cancelled',
      });
    }

    const examEvents = await db.sequelize.query(
      `
      SELECT 
        ee.*,
        i.name as institution_name,
        ay.academic_name,
        s.semester_number,
        ep.pattern_name
      FROM exam_event ee
      LEFT JOIN institution i ON ee.institution_id = i.institution_id
      LEFT JOIN academic_year ay ON ee.academic_id = ay.academic_id
      LEFT JOIN semester s ON ee.semester_id = s.semester_id
      LEFT JOIN exam_pattern ep ON ee.pattern_id = ep.pattern_id
      WHERE ee.status = :status AND ee.deletedAt IS NULL
      ORDER BY ee.createdAt DESC
    `,
      {
        replacements: { status },
        nest: true,
        type: db.Sequelize.QueryTypes.SELECT,
      }
    );

    res.status(200).json({
      success: true,
      data: examEvents,
      message: `Exam events with status '${status}' retrieved successfully`,
    });
  } catch (error) {
    console.error('Error in getExamEventsByStatus:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

// Get published exam events (for public view)
const getPublishedExamEvents = async (req, res) => {
  try {
    const examEvents = await db.sequelize.query(
      `
      SELECT 
        ee.*,
        i.name as institution_name,
        ay.academic_name,
        s.semester_number, s.term_type as term,
        ep.pattern_name
      FROM exam_event ee
      LEFT JOIN institution i ON ee.institution_id = i.institution_id
      LEFT JOIN academic_year ay ON ee.academic_id = ay.academic_id
      LEFT JOIN semester s ON ee.semester_id = s.semester_id
      LEFT JOIN exam_pattern ep ON ee.pattern_id = ep.pattern_id
      WHERE ee.status IN ('published', 'ongoing') 
        AND ee.is_published = 1 
        AND ee.deletedAt IS NULL
      ORDER BY ee.createdAt DESC
    `,
      {
        nest: true,
        type: db.Sequelize.QueryTypes.SELECT,
      }
    );

    res.status(200).json({
      success: true,
      data: examEvents,
      message: 'Published exam events retrieved successfully',
    });
  } catch (error) {
    console.error('Error in getPublishedExamEvents:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

// Create new exam event
const createExamEvent = async (req, res) => {
  try {
    const validatedData = createExamEventSchema.parse(req.body);

    // Get the authenticated user ID from token
    const created_by = req.user?.uid || null;

    // Check if institution exists
    const institution = await db.sequelize.query(
      `SELECT * FROM institution WHERE institution_id = :institution_id`,
      {
        replacements: { institution_id: validatedData.institution_id },
        type: db.Sequelize.QueryTypes.SELECT,
      }
    );

    if (!institution || institution.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Institution not found. Please select a valid institution.',
      });
    }

    // Check if academic year exists
    const academicYear = await db.sequelize.query(
      `SELECT * FROM academic_year WHERE academic_id = :academic_id`,
      {
        replacements: { academic_id: validatedData.academic_id },
        type: db.Sequelize.QueryTypes.SELECT,
      }
    );

    if (!academicYear || academicYear.length === 0) {
      return res.status(404).json({
        success: false,
        message:
          'Academic year not found. Please select a valid academic year.',
      });
    }

    // Check if semester exists
    const semester = await db.sequelize.query(
      `SELECT * FROM semester WHERE semester_id = :semester_id`,
      {
        replacements: { semester_id: validatedData.semester_id },
        type: db.Sequelize.QueryTypes.SELECT,
      }
    );

    if (!semester || semester.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Semester not found. Please select a valid semester.',
      });
    }

    // Check if exam pattern exists (if provided)
    if (validatedData.pattern_id) {
      const examPattern = await db.sequelize.query(
        `SELECT * FROM exam_pattern WHERE pattern_id = :pattern_id`,
        {
          replacements: { pattern_id: validatedData.pattern_id },
          type: db.Sequelize.QueryTypes.SELECT,
        }
      );

      if (!examPattern || examPattern.length === 0) {
        return res.status(404).json({
          success: false,
          message:
            'Exam pattern not found. Please select a valid exam pattern.',
        });
      }
    }

    // Validate registration dates
    if (validatedData.reg_start && validatedData.reg_end) {
      if (new Date(validatedData.reg_start) > new Date(validatedData.reg_end)) {
        return res.status(400).json({
          success: false,
          message:
            'Registration start date cannot be after registration end date',
        });
      }
    }

    // Check for duplicate exam event
    const existingEvent = await db.sequelize.query(
      `SELECT * FROM exam_event 
       WHERE event_name = :event_name 
       AND semester_id = :semester_id 
       AND deletedAt IS NULL`,
      {
        replacements: {
          event_name: validatedData.event_name,
          semester_id: validatedData.semester_id,
        },
        type: db.Sequelize.QueryTypes.SELECT,
      }
    );

    if (existingEvent && existingEvent.length > 0) {
      return res.status(400).json({
        success: false,
        message:
          'An exam event with this name already exists for the selected semester',
      });
    }

    // Create exam event using raw SQL
    const event_id = require('crypto').randomUUID();
    const now = new Date();

    await db.sequelize.query(
      `INSERT INTO exam_event (
        event_id, institution_id, academic_id, semester_id, event_name, 
        exam_type, reg_start, reg_end, fee_regular, fee_backlog, 
        pattern_id, is_published, status, created_by, createdAt, updatedAt
      ) VALUES (
        :event_id, :institution_id, :academic_id, :semester_id, :event_name,
        :exam_type, :reg_start, :reg_end, :fee_regular, :fee_backlog,
        :pattern_id, :is_published, :status, :created_by, :now, :now
      )`,
      {
        replacements: {
          event_id,
          institution_id: validatedData.institution_id,
          academic_id: validatedData.academic_id,
          semester_id: validatedData.semester_id,
          event_name: validatedData.event_name,
          exam_type: validatedData.exam_type || null,
          reg_start: validatedData.reg_start || null,
          reg_end: validatedData.reg_end || null,
          fee_regular: validatedData.fee_regular || 0,
          fee_backlog: validatedData.fee_backlog || 0,
          pattern_id: validatedData.pattern_id || null,
          is_published: validatedData.is_published ? 1 : 0,
          status: validatedData.status || 'draft',
          created_by: created_by,
          now: now,
        },
        type: db.Sequelize.QueryTypes.INSERT,
      }
    );

    // Fetch the created exam event
    const [createdEvent] = await db.sequelize.query(
      `
      SELECT 
        ee.*,
        i.name as institution_name,
        ay.academic_name,
        s.semester_number, s.term_type as term,
        ep.pattern_name
      FROM exam_event ee
      LEFT JOIN institution i ON ee.institution_id = i.institution_id
      LEFT JOIN academic_year ay ON ee.academic_id = ay.academic_id
      LEFT JOIN semester s ON ee.semester_id = s.semester_id
      LEFT JOIN exam_pattern ep ON ee.pattern_id = ep.pattern_id
      WHERE ee.event_id = :event_id
    `,
      {
        replacements: { event_id },
        nest: true,
        type: db.Sequelize.QueryTypes.SELECT,
      }
    );

    res.status(201).json({
      success: true,
      data: createdEvent,
      message: 'Exam event created successfully',
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors || error.issues,
      });
    }

    console.error('Error in createExamEvent:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

// Update exam event
const updateExamEvent = async (req, res) => {
  try {
    const { event_id } = examEventIdParamSchema.parse(req.params);
    const validatedData = updateExamEventSchema.parse(req.body);

    // Check if exam event exists
    const existingEvent = await db.sequelize.query(
      `SELECT * FROM exam_event WHERE event_id = :event_id AND deletedAt IS NULL`,
      {
        replacements: { event_id },
        type: db.Sequelize.QueryTypes.SELECT,
      }
    );

    if (!existingEvent || existingEvent.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Exam event not found',
      });
    }

    // Check relationships if being updated
    if (validatedData.institution_id) {
      const institution = await db.sequelize.query(
        `SELECT * FROM institution WHERE institution_id = :institution_id`,
        {
          replacements: { institution_id: validatedData.institution_id },
          type: db.Sequelize.QueryTypes.SELECT,
        }
      );

      if (!institution || institution.length === 0) {
        return res.status(404).json({
          success: false,
          message:
            'New institution not found. Please select a valid institution.',
        });
      }
    }

    if (validatedData.academic_id) {
      const academicYear = await db.sequelize.query(
        `SELECT * FROM academic_year WHERE academic_id = :academic_id`,
        {
          replacements: { academic_id: validatedData.academic_id },
          type: db.Sequelize.QueryTypes.SELECT,
        }
      );

      if (!academicYear || academicYear.length === 0) {
        return res.status(404).json({
          success: false,
          message:
            'New academic year not found. Please select a valid academic year.',
        });
      }
    }

    if (validatedData.semester_id) {
      const semester = await db.sequelize.query(
        `SELECT * FROM semester WHERE semester_id = :semester_id`,
        {
          replacements: { semester_id: validatedData.semester_id },
          type: db.Sequelize.QueryTypes.SELECT,
        }
      );

      if (!semester || semester.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'New semester not found. Please select a valid semester.',
        });
      }
    }

    if (validatedData.pattern_id) {
      const examPattern = await db.sequelize.query(
        `SELECT * FROM exam_pattern WHERE pattern_id = :pattern_id`,
        {
          replacements: { pattern_id: validatedData.pattern_id },
          type: db.Sequelize.QueryTypes.SELECT,
        }
      );

      if (!examPattern || examPattern.length === 0) {
        return res.status(404).json({
          success: false,
          message:
            'Exam pattern not found. Please select a valid exam pattern.',
        });
      }
    }

    // Validate registration dates
    const regStart =
      validatedData.reg_start !== undefined
        ? validatedData.reg_start
        : existingEvent[0].reg_start;
    const regEnd =
      validatedData.reg_end !== undefined
        ? validatedData.reg_end
        : existingEvent[0].reg_end;

    if (regStart && regEnd) {
      if (new Date(regStart) > new Date(regEnd)) {
        return res.status(400).json({
          success: false,
          message:
            'Registration start date cannot be after registration end date',
        });
      }
    }

    // Check for duplicate (excluding current event)
    if (validatedData.event_name) {
      const semesterId =
        validatedData.semester_id || existingEvent[0].semester_id;

      const duplicateEvent = await db.sequelize.query(
        `SELECT * FROM exam_event 
         WHERE event_name = :event_name 
         AND semester_id = :semester_id 
         AND event_id != :event_id
         AND deletedAt IS NULL`,
        {
          replacements: {
            event_name: validatedData.event_name,
            semester_id: semesterId,
            event_id: event_id,
          },
          type: db.Sequelize.QueryTypes.SELECT,
        }
      );

      if (duplicateEvent && duplicateEvent.length > 0) {
        return res.status(400).json({
          success: false,
          message:
            'An exam event with this name already exists for the semester',
        });
      }
    }

    // Build update query dynamically
    const updateFields = [];
    const replacements = { event_id };

    if (validatedData.institution_id !== undefined) {
      updateFields.push('institution_id = :institution_id');
      replacements.institution_id = validatedData.institution_id;
    }
    if (validatedData.academic_id !== undefined) {
      updateFields.push('academic_id = :academic_id');
      replacements.academic_id = validatedData.academic_id;
    }
    if (validatedData.semester_id !== undefined) {
      updateFields.push('semester_id = :semester_id');
      replacements.semester_id = validatedData.semester_id;
    }
    if (validatedData.event_name !== undefined) {
      updateFields.push('event_name = :event_name');
      replacements.event_name = validatedData.event_name;
    }
    if (validatedData.exam_type !== undefined) {
      updateFields.push('exam_type = :exam_type');
      replacements.exam_type = validatedData.exam_type;
    }
    if (validatedData.reg_start !== undefined) {
      updateFields.push('reg_start = :reg_start');
      replacements.reg_start = validatedData.reg_start;
    }
    if (validatedData.reg_end !== undefined) {
      updateFields.push('reg_end = :reg_end');
      replacements.reg_end = validatedData.reg_end;
    }
    if (validatedData.fee_regular !== undefined) {
      updateFields.push('fee_regular = :fee_regular');
      replacements.fee_regular = validatedData.fee_regular;
    }
    if (validatedData.fee_backlog !== undefined) {
      updateFields.push('fee_backlog = :fee_backlog');
      replacements.fee_backlog = validatedData.fee_backlog;
    }
    if (validatedData.pattern_id !== undefined) {
      updateFields.push('pattern_id = :pattern_id');
      replacements.pattern_id = validatedData.pattern_id;
    }
    if (validatedData.is_published !== undefined) {
      updateFields.push('is_published = :is_published');
      replacements.is_published = validatedData.is_published ? 1 : 0;
    }
    if (validatedData.status !== undefined) {
      updateFields.push('status = :status');
      replacements.status = validatedData.status;
    }

    updateFields.push('updatedAt = :now');
    replacements.now = new Date();

    if (updateFields.length > 1) {
      // More than just updatedAt
      await db.sequelize.query(
        `UPDATE exam_event SET ${updateFields.join(', ')} WHERE event_id = :event_id`,
        {
          replacements,
          type: db.Sequelize.QueryTypes.UPDATE,
        }
      );
    }

    // Fetch updated exam event
    const [updatedEvent] = await db.sequelize.query(
      `
      SELECT 
        ee.*,
        i.name as institution_name,
        ay.academic_name,
        s.semester_number, s.term_type as term,
        ep.pattern_name
      FROM exam_event ee
      LEFT JOIN institution i ON ee.institution_id = i.institution_id
      LEFT JOIN academic_year ay ON ee.academic_id = ay.academic_id
      LEFT JOIN semester s ON ee.semester_id = s.semester_id
      LEFT JOIN exam_pattern ep ON ee.pattern_id = ep.pattern_id
      WHERE ee.event_id = :event_id
    `,
      {
        replacements: { event_id },
        nest: true,
        type: db.Sequelize.QueryTypes.SELECT,
      }
    );

    res.status(200).json({
      success: true,
      data: updatedEvent,
      message: 'Exam event updated successfully',
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors || error.issues,
      });
    }

    console.error('Error in updateExamEvent:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

// Update exam event status
const updateExamEventStatus = async (req, res) => {
  try {
    const { event_id } = examEventIdParamSchema.parse(req.params);
    const { status } = req.body;

    const validStatuses = [
      'draft',
      'published',
      'ongoing',
      'completed',
      'cancelled',
    ];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Valid statuses: ${validStatuses.join(', ')}`,
      });
    }

    // Check if exam event exists
    const existingEvent = await db.sequelize.query(
      `SELECT * FROM exam_event WHERE event_id = :event_id AND deletedAt IS NULL`,
      {
        replacements: { event_id },
        type: db.Sequelize.QueryTypes.SELECT,
      }
    );

    if (!existingEvent || existingEvent.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Exam event not found',
      });
    }

    // If publishing, also set is_published to true
    let is_published = undefined;
    if (status === 'published') {
      is_published = 1;
    } else if (status === 'draft' && existingEvent[0].status === 'published') {
      is_published = 0;
    }

    const updateFields = ['status = :status', 'updatedAt = :now'];
    const replacements = { event_id, status, now: new Date() };

    if (is_published !== undefined) {
      updateFields.push('is_published = :is_published');
      replacements.is_published = is_published;
    }

    await db.sequelize.query(
      `UPDATE exam_event SET ${updateFields.join(', ')} WHERE event_id = :event_id`,
      {
        replacements,
        type: db.Sequelize.QueryTypes.UPDATE,
      }
    );

    res.status(200).json({
      success: true,
      message: `Exam event status updated to '${status}' successfully`,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors || error.issues,
      });
    }

    console.error('Error in updateExamEventStatus:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

// Toggle publish status
const togglePublishStatus = async (req, res) => {
  try {
    const { event_id } = examEventIdParamSchema.parse(req.params);
    const { is_published } = req.body;

    if (typeof is_published !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: 'is_published must be a boolean value',
      });
    }

    // Check if exam event exists
    const existingEvent = await db.sequelize.query(
      `SELECT * FROM exam_event WHERE event_id = :event_id AND deletedAt IS NULL`,
      {
        replacements: { event_id },
        type: db.Sequelize.QueryTypes.SELECT,
      }
    );

    if (!existingEvent || existingEvent.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Exam event not found',
      });
    }

    // If publishing, also update status to published if it's draft
    let status = existingEvent[0].status;
    if (is_published && status === 'draft') {
      status = 'published';
    }

    const now = new Date();
    await db.sequelize.query(
      `UPDATE exam_event SET is_published = :is_published, status = :status, updatedAt = :now WHERE event_id = :event_id`,
      {
        replacements: {
          event_id,
          is_published: is_published ? 1 : 0,
          status,
          now,
        },
        type: db.Sequelize.QueryTypes.UPDATE,
      }
    );

    res.status(200).json({
      success: true,
      message: `Exam event ${is_published ? 'published' : 'unpublished'} successfully`,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors || error.issues,
      });
    }

    console.error('Error in togglePublishStatus:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

// Soft delete exam event
const deleteExamEvent = async (req, res) => {
  try {
    const { event_id } = examEventIdParamSchema.parse(req.params);

    // Check if exam event exists
    const existingEvent = await db.sequelize.query(
      `SELECT * FROM exam_event WHERE event_id = :event_id AND deletedAt IS NULL`,
      {
        replacements: { event_id },
        type: db.Sequelize.QueryTypes.SELECT,
      }
    );

    if (!existingEvent || existingEvent.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Exam event not found',
      });
    }

    // Soft delete by setting deletedAt
    const now = new Date();
    await db.sequelize.query(
      `UPDATE exam_event SET deletedAt = :now WHERE event_id = :event_id`,
      {
        replacements: { event_id, now },
        type: db.Sequelize.QueryTypes.UPDATE,
      }
    );

    res.status(200).json({
      success: true,
      message: 'Exam event deleted successfully',
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors || error.issues,
      });
    }

    console.error('Error in deleteExamEvent:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

// Get deleted exam events
const getDeletedExamEvents = async (req, res) => {
  try {
    const examEvents = await db.sequelize.query(
      `
      SELECT 
        ee.*,
        i.name as institution_name,
        ay.academic_name,
        s.semester_number,
        ep.pattern_name
      FROM exam_event ee
      LEFT JOIN institution i ON ee.institution_id = i.institution_id
      LEFT JOIN academic_year ay ON ee.academic_id = ay.academic_id
      LEFT JOIN semester s ON ee.semester_id = s.semester_id
      LEFT JOIN exam_pattern ep ON ee.pattern_id = ep.pattern_id
      WHERE ee.deletedAt IS NOT NULL
      ORDER BY ee.deletedAt DESC
    `,
      {
        nest: true,
        type: db.Sequelize.QueryTypes.SELECT,
      }
    );

    res.status(200).json({
      success: true,
      data: examEvents,
      message: 'Deleted exam events retrieved successfully',
    });
  } catch (error) {
    console.error('Error in getDeletedExamEvents:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

// Restore soft deleted exam event
const restoreExamEvent = async (req, res) => {
  try {
    const { event_id } = examEventIdParamSchema.parse(req.params);

    // Check if exam event exists and is deleted
    const existingEvent = await db.sequelize.query(
      `SELECT * FROM exam_event WHERE event_id = :event_id AND deletedAt IS NOT NULL`,
      {
        replacements: { event_id },
        type: db.Sequelize.QueryTypes.SELECT,
      }
    );

    if (!existingEvent || existingEvent.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Deleted exam event not found',
      });
    }

    // Restore by setting deletedAt to NULL
    await db.sequelize.query(
      `UPDATE exam_event SET deletedAt = NULL WHERE event_id = :event_id`,
      {
        replacements: { event_id },
        type: db.Sequelize.QueryTypes.UPDATE,
      }
    );

    res.status(200).json({
      success: true,
      message: 'Exam event restored successfully',
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors || error.issues,
      });
    }

    console.error('Error in restoreExamEvent:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

// Permanently delete exam event
const permanentDeleteExamEvent = async (req, res) => {
  try {
    const { event_id } = examEventIdParamSchema.parse(req.params);

    // Check if exam event exists (including soft deleted)
    const existingEvent = await db.sequelize.query(
      `SELECT * FROM exam_event WHERE event_id = :event_id`,
      {
        replacements: { event_id },
        type: db.Sequelize.QueryTypes.SELECT,
      }
    );

    if (!existingEvent || existingEvent.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Exam event not found',
      });
    }

    // Permanent delete
    await db.sequelize.query(
      `DELETE FROM exam_event WHERE event_id = :event_id`,
      {
        replacements: { event_id },
        type: db.Sequelize.QueryTypes.DELETE,
      }
    );

    res.status(200).json({
      success: true,
      message: 'Exam event permanently deleted successfully',
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors || error.issues,
      });
    }

    console.error('Error in permanentDeleteExamEvent:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

// Get exam events dropdown (for form selects)
const getExamEventsDropdown = async (req, res) => {
  try {
    const { semester_id, status } = req.query;

    let whereCondition = 'ee.deletedAt IS NULL';
    const replacements = {};

    if (semester_id) {
      whereCondition += ' AND ee.semester_id = :semester_id';
      replacements.semester_id = semester_id;
    }

    if (status) {
      whereCondition += ' AND ee.status = :status';
      replacements.status = status;
    }

    const examEvents = await db.sequelize.query(
      `
      SELECT 
        ee.event_id,
        ee.event_name,
        ee.exam_type,
        ee.status,
        ee.semester_id,
        s.semester_number,
        ay.academic_name
      FROM exam_event ee
      LEFT JOIN semester s ON ee.semester_id = s.semester_id
      LEFT JOIN academic_year ay ON ee.academic_id = ay.academic_id
      WHERE ${whereCondition}
      ORDER BY ee.createdAt DESC
    `,
      {
        replacements,
        nest: true,
        type: db.Sequelize.QueryTypes.SELECT,
      }
    );

    // Group by semester
    const eventsBySemester = {};
    for (const event of examEvents) {
      if (!eventsBySemester[event.semester_id]) {
        eventsBySemester[event.semester_id] = [];
      }
      eventsBySemester[event.semester_id].push(event);
    }

    res.status(200).json({
      success: true,
      data: examEvents,
      groupedBySemester: eventsBySemester,
      message: 'Exam events dropdown retrieved successfully',
    });
  } catch (error) {
    console.error('Error in getExamEventsDropdown:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};


/**
 * Reschedule an exam event by ID
 * created by krrish mahar
 */
const rescheduleExamEvent = async (req, res) => {
  try {
    // Validate request parameters and body
    const { event_id } = examEventIdParamSchema.parse(req.params);
    rescheduleExamEventSchema.parse(req.body);

    const data = await examEventsService.rescheduleExamEvent(event_id, req.body);

    return res.status(200).json({
      success: true,
      data,
      message: 'Exam event rescheduled successfully',
    });
  } catch (error) {
    console.error('Error in rescheduleExamEvent controller:', error);

    if (error.name === 'ZodError') {
      return res.status(400).json({
        success: false,
        errors: error.errors || error.issues,
      });
    }

    return res.status(error.status || 500).json({
      success: false,
      errors: [{ message: error.message || 'Internal server error' }],
    });
  }
};


module.exports = {
  getAllExamEvents,
  getExamEventById,
  getExamEventsByInstitution,
  getExamEventsByAcademicYear,
  getExamEventsBySemester,
  getExamEventsByStatus,
  getPublishedExamEvents,
  createExamEvent,
  updateExamEvent,
  updateExamEventStatus,
  togglePublishStatus,
  deleteExamEvent,
  getDeletedExamEvents,
  restoreExamEvent,
  permanentDeleteExamEvent,
  getExamEventsDropdown,
  rescheduleExamEvent,
};
