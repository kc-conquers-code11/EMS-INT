const { ZodError } = require('zod');
const db = require('../../../models');
const {
  createTimetableSchema,
  bulkCreateTimetableSchema,
  updateTimetableSchema,
  rescheduleTimetableSchema,
  timetableIdParamSchema,
  getTimetableByEventSchema,
  getTimetableByDateRangeSchema,
  publishTimetableSchema,
} = require('../../validations/timeTable/timetable.validations.js');

/**
 * Get all timetable entries with filtering
 */
const getAllTimetableEntries = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      event_id,
      branch_id,
      semester_id,
      status,
    } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const offset = (pageNum - 1) * limitNum;

    let whereConditions = ['tt.deletedAt IS NULL'];
    const replacements = {};

    if (event_id) {
      whereConditions.push('tt.event_id = :event_id');
      replacements.event_id = event_id;
    }
    if (status) {
      whereConditions.push('tt.status = :status');
      replacements.status = status;
    }
    if (branch_id) {
      whereConditions.push('b.branch_id = :branch_id');
      replacements.branch_id = branch_id;
    }
    if (semester_id) {
      whereConditions.push('s.semester_id = :semester_id');
      replacements.semester_id = semester_id;
    }

    const whereClause = `WHERE ${whereConditions.join(' AND ')}`;

    // Get total count
    const [countResult] = await db.sequelize.query(
      `SELECT COUNT(*) as total FROM timetable tt ${whereClause}`,
      { replacements, type: db.Sequelize.QueryTypes.SELECT }
    );

    const entries = await db.sequelize.query(
      `
      SELECT 
        tt.*,
        ee.event_name, ee.exam_type,
        s.semester_number, s.term_type as term,
        b.branch_name, b.branch_code,
        sub.subject_name, sub.subject_code, sub.subject_type, sub.credits,
        ts.slot_label, ts.start_time, ts.end_time
      FROM timetable tt
      LEFT JOIN exam_event ee ON tt.event_id = ee.event_id AND ee.deletedAt IS NULL
      LEFT JOIN semester_subject_mapping ssm ON tt.mapping_id = ssm.mapping_id AND ssm.deletedAt IS NULL
      LEFT JOIN semester s ON ssm.semester_id = s.semester_id
      LEFT JOIN branch b ON ssm.branch_id = b.branch_id AND b.deletedAt IS NULL
      LEFT JOIN subject sub ON ssm.subject_id = sub.subject_id AND sub.deletedAt IS NULL
      LEFT JOIN time_slot ts ON tt.slot_id = ts.slot_id AND ts.deletedAt IS NULL
      ${whereClause}
      ORDER BY tt.exam_date ASC, ts.start_time ASC
      LIMIT :limit OFFSET :offset
    `,
      {
        replacements: { ...replacements, limit: limitNum, offset },
        nest: true,
        type: db.Sequelize.QueryTypes.SELECT,
      }
    );

    res.status(200).json({
      success: true,
      total: parseInt(countResult.total),
      page: pageNum,
      totalPages: Math.ceil(parseInt(countResult.total) / limitNum),
      data: entries,
      message: 'Timetable entries retrieved successfully',
    });
  } catch (error) {
    console.error('Error in getAllTimetableEntries:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

/**
 * Get timetable entry by ID
 */
const getTimetableEntryById = async (req, res) => {
  try {
    const { timetable_id } = timetableIdParamSchema.parse(req.params);

    const [entry] = await db.sequelize.query(
      `
      SELECT 
        tt.*,
        ee.event_name, ee.exam_type, ee.status as event_status,
        s.semester_number, s.term_type as term,
        b.branch_name, b.branch_code,
        sub.subject_name, sub.subject_code, sub.subject_type, sub.credits,
        sub.max_theory, sub.max_practical, sub.max_oral, sub.max_tw,
        ts.slot_label, ts.start_time, ts.end_time
      FROM timetable tt
      LEFT JOIN exam_event ee ON tt.event_id = ee.event_id AND ee.deletedAt IS NULL
      LEFT JOIN semester_subject_mapping ssm ON tt.mapping_id = ssm.mapping_id AND ssm.deletedAt IS NULL
      LEFT JOIN semester s ON ssm.semester_id = s.semester_id
      LEFT JOIN branch b ON ssm.branch_id = b.branch_id AND b.deletedAt IS NULL
      LEFT JOIN subject sub ON ssm.subject_id = sub.subject_id AND sub.deletedAt IS NULL
      LEFT JOIN time_slot ts ON tt.slot_id = ts.slot_id AND ts.deletedAt IS NULL
      WHERE tt.timetable_id = :timetable_id AND tt.deletedAt IS NULL
    `,
      {
        replacements: { timetable_id },
        nest: true,
        type: db.Sequelize.QueryTypes.SELECT,
      }
    );

    if (!entry) {
      return res.status(404).json({
        success: false,
        message: 'Timetable entry not found',
      });
    }

    res.status(200).json({
      success: true,
      data: entry,
      message: 'Timetable entry retrieved successfully',
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors || error.issues,
      });
    }
    console.error('Error in getTimetableEntryById:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

/**
 * Get timetable by exam event
 */
const getTimetableByEvent = async (req, res) => {
  try {
    const { event_id } = getTimetableByEventSchema.parse(req.params);
    const { include_published_only = 'false' } = req.query;

    const entries = await db.sequelize.query(
      `
      SELECT 
        tt.*,
        s.semester_number, s.term_type as term,
        b.branch_name, b.branch_code,
        sub.subject_name, sub.subject_code, sub.subject_type, sub.credits,
        ts.slot_label, ts.start_time, ts.end_time
      FROM timetable tt
      LEFT JOIN semester_subject_mapping ssm ON tt.mapping_id = ssm.mapping_id AND ssm.deletedAt IS NULL
      LEFT JOIN semester s ON ssm.semester_id = s.semester_id
      LEFT JOIN branch b ON ssm.branch_id = b.branch_id AND b.deletedAt IS NULL
      LEFT JOIN subject sub ON ssm.subject_id = sub.subject_id AND sub.deletedAt IS NULL
      LEFT JOIN time_slot ts ON tt.slot_id = ts.slot_id AND ts.deletedAt IS NULL
      WHERE tt.event_id = :event_id 
        AND tt.deletedAt IS NULL
        ${include_published_only === 'true' ? 'AND tt.is_published = 1' : ''}
      ORDER BY tt.exam_date ASC, ts.start_time ASC, b.branch_name ASC
    `,
      {
        replacements: { event_id },
        nest: true,
        type: db.Sequelize.QueryTypes.SELECT,
      }
    );

    res.status(200).json({
      success: true,
      data: entries,
      message: 'Timetable entries retrieved successfully',
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors || error.issues,
      });
    }
    console.error('Error in getTimetableByEvent:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

/**
 * Get timetable by date range
 */
const getTimetableByDateRange = async (req, res) => {
  try {
    const { start_date, end_date } = getTimetableByDateRangeSchema.parse(
      req.query
    );

    const entries = await db.sequelize.query(
      `
      SELECT 
        tt.*,
        ee.event_name,
        s.semester_number,
        b.branch_name,
        sub.subject_name, sub.subject_code,
        ts.slot_label, ts.start_time, ts.end_time
      FROM timetable tt
      LEFT JOIN exam_event ee ON tt.event_id = ee.event_id AND ee.deletedAt IS NULL
      LEFT JOIN semester_subject_mapping ssm ON tt.mapping_id = ssm.mapping_id AND ssm.deletedAt IS NULL
      LEFT JOIN semester s ON ssm.semester_id = s.semester_id
      LEFT JOIN branch b ON ssm.branch_id = b.branch_id AND b.deletedAt IS NULL
      LEFT JOIN subject sub ON ssm.subject_id = sub.subject_id AND sub.deletedAt IS NULL
      LEFT JOIN time_slot ts ON tt.slot_id = ts.slot_id AND ts.deletedAt IS NULL
      WHERE tt.exam_date BETWEEN :start_date AND :end_date
        AND tt.deletedAt IS NULL
      ORDER BY tt.exam_date ASC, ts.start_time ASC
    `,
      {
        replacements: { start_date, end_date },
        nest: true,
        type: db.Sequelize.QueryTypes.SELECT,
      }
    );

    res.status(200).json({
      success: true,
      data: entries,
      message: 'Timetable entries retrieved successfully',
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors || error.issues,
      });
    }
    console.error('Error in getTimetableByDateRange:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

/**
 * Get timetable by branch and semester
 */
const getTimetableByBranchAndSemester = async (req, res) => {
  try {
    const { branch_id, semester_id } = req.params;

    const entries = await db.sequelize.query(
      `
      SELECT 
        tt.*,
        ee.event_name,
        sub.subject_name, sub.subject_code, sub.subject_type,
        ts.slot_label, ts.start_time, ts.end_time
      FROM timetable tt
      LEFT JOIN semester_subject_mapping ssm ON tt.mapping_id = ssm.mapping_id AND ssm.deletedAt IS NULL
      LEFT JOIN exam_event ee ON tt.event_id = ee.event_id AND ee.deletedAt IS NULL
      LEFT JOIN subject sub ON ssm.subject_id = sub.subject_id AND sub.deletedAt IS NULL
      LEFT JOIN time_slot ts ON tt.slot_id = ts.slot_id AND ts.deletedAt IS NULL
      WHERE ssm.branch_id = :branch_id 
        AND ssm.semester_id = :semester_id
        AND tt.deletedAt IS NULL
        AND tt.is_published = 1
      ORDER BY tt.exam_date ASC, ts.start_time ASC
    `,
      {
        replacements: { branch_id, semester_id },
        nest: true,
        type: db.Sequelize.QueryTypes.SELECT,
      }
    );

    res.status(200).json({
      success: true,
      data: entries,
      message: 'Timetable entries retrieved successfully',
    });
  } catch (error) {
    console.error('Error in getTimetableByBranchAndSemester:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

/**
 * Get student timetable by student ID
 */
const getStudentTimetable = async (req, res) => {
  try {
    const { student_id } = req.params;

    // Get student's branch and current semester
    const [student] = await db.sequelize.query(
      `
      SELECT s.branch_id, NULL as current_semester_id, s.gr_number as enrollment_no
      FROM students s
      WHERE s.sid = :student_id AND s.deletedAt IS NULL
    `,
      {
        replacements: { student_id },
        type: db.Sequelize.QueryTypes.SELECT,
      }
    );

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found',
      });
    }

    const entries = await db.sequelize.query(
      `
      SELECT 
        tt.*,
        ee.event_name,
        sub.subject_name, sub.subject_code, sub.subject_type,
        sub.max_theory, sub.max_practical,
        ts.slot_label, ts.start_time, ts.end_time
      FROM timetable tt
      LEFT JOIN semester_subject_mapping ssm ON tt.mapping_id = ssm.mapping_id AND ssm.deletedAt IS NULL
      LEFT JOIN exam_event ee ON tt.event_id = ee.event_id AND ee.deletedAt IS NULL
      LEFT JOIN subject sub ON ssm.subject_id = sub.subject_id AND sub.deletedAt IS NULL
      LEFT JOIN time_slot ts ON tt.slot_id = ts.slot_id AND ts.deletedAt IS NULL
      WHERE ssm.branch_id = :branch_id 
        AND ssm.semester_id = :semester_id
        AND tt.deletedAt IS NULL
        AND tt.is_published = 1
        AND ee.status IN ('published', 'ongoing')
      ORDER BY tt.exam_date ASC, ts.start_time ASC
    `,
      {
        replacements: {
          branch_id: student.branch_id,
          semester_id: student.current_semester_id,
        },
        nest: true,
        type: db.Sequelize.QueryTypes.SELECT,
      }
    );

    res.status(200).json({
      success: true,
      data: {
        student_name: student.enrollment_no,
        entries,
      },
      message: 'Student timetable retrieved successfully',
    });
  } catch (error) {
    console.error('Error in getStudentTimetable:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

/**
 * Create timetable entry
 */
const createTimetableEntry = async (req, res) => {
  try {
    const validatedData = createTimetableSchema.parse(req.body);
    const created_by = req.user?.uid || null;

    // Check if exam event exists
    const [examEvent] = await db.sequelize.query(
      `SELECT event_id, status FROM exam_event WHERE event_id = :event_id AND deletedAt IS NULL`,
      {
        replacements: { event_id: validatedData.event_id },
        type: db.Sequelize.QueryTypes.SELECT,
      }
    );

    if (!examEvent) {
      return res.status(404).json({
        success: false,
        message: 'Exam event not found',
      });
    }

    // Check if mapping exists
    const [mapping] = await db.sequelize.query(
      `SELECT mapping_id FROM semester_subject_mapping WHERE mapping_id = :mapping_id AND deletedAt IS NULL AND is_active = 1`,
      {
        replacements: { mapping_id: validatedData.mapping_id },
        type: db.Sequelize.QueryTypes.SELECT,
      }
    );

    if (!mapping) {
      return res.status(404).json({
        success: false,
        message: 'Subject mapping not found or inactive',
      });
    }

    // Check if time slot exists
    const [timeSlot] = await db.sequelize.query(
      `SELECT slot_id, start_time, end_time FROM time_slot WHERE slot_id = :slot_id AND deletedAt IS NULL`,
      {
        replacements: { slot_id: validatedData.slot_id },
        type: db.Sequelize.QueryTypes.SELECT,
      }
    );

    if (!timeSlot) {
      return res.status(404).json({
        success: false,
        message: 'Time slot not found',
      });
    }

    // Check for duplicate entry (same event and mapping)
    const [existingEntry] = await db.sequelize.query(
      `SELECT timetable_id FROM timetable 
       WHERE event_id = :event_id AND mapping_id = :mapping_id AND deletedAt IS NULL`,
      {
        replacements: {
          event_id: validatedData.event_id,
          mapping_id: validatedData.mapping_id,
        },
        type: db.Sequelize.QueryTypes.SELECT,
      }
    );

    if (existingEntry) {
      return res.status(400).json({
        success: false,
        message: 'This subject is already scheduled for this exam event',
      });
    }

    // Check for clash detection (same date, same time slot, different subject)
    const [clashEntry] = await db.sequelize.query(
      `SELECT tt.timetable_id, ssm.mapping_id, sub.subject_name
       FROM timetable tt
       JOIN semester_subject_mapping ssm ON tt.mapping_id = ssm.mapping_id
       JOIN subject sub ON ssm.subject_id = sub.subject_id
       WHERE tt.event_id = :event_id 
         AND tt.exam_date = :exam_date 
         AND tt.slot_id = :slot_id
         AND tt.deletedAt IS NULL
         AND tt.status != 'cancelled'`,
      {
        replacements: {
          event_id: validatedData.event_id,
          exam_date: validatedData.exam_date,
          slot_id: validatedData.slot_id,
        },
        type: db.Sequelize.QueryTypes.SELECT,
      }
    );

    if (clashEntry) {
      return res.status(409).json({
        success: false,
        message: `Schedule clash: Another exam is already scheduled at this date and time slot`,
        clash_details: clashEntry,
      });
    }

    // Check for same branch multiple exams on same day
    const [branchExams] = await db.sequelize.query(
      `
      SELECT COUNT(*) as exam_count
      FROM timetable tt
      JOIN semester_subject_mapping ssm ON tt.mapping_id = ssm.mapping_id
      WHERE tt.event_id = :event_id 
        AND tt.exam_date = :exam_date 
        AND ssm.branch_id = (SELECT branch_id FROM semester_subject_mapping WHERE mapping_id = :mapping_id)
        AND tt.deletedAt IS NULL
        AND tt.status != 'cancelled'
    `,
      {
        replacements: {
          event_id: validatedData.event_id,
          exam_date: validatedData.exam_date,
          mapping_id: validatedData.mapping_id,
        },
        type: db.Sequelize.QueryTypes.SELECT,
      }
    );

    if (branchExams && branchExams[0] && branchExams[0].exam_count >= 2) {
      return res.status(409).json({
        success: false,
        message: 'A branch cannot have more than 2 exams on the same day',
      });
    }

    // Create timetable entry
    const timetable_id = require('crypto').randomUUID();
    const now = new Date();

    await db.sequelize.query(
      `INSERT INTO timetable (
        timetable_id, event_id, mapping_id, exam_date, slot_id, shift, 
        venue, is_published, status, created_by, createdAt, updatedAt
      ) VALUES (
        :timetable_id, :event_id, :mapping_id, :exam_date, :slot_id, :shift,
        :venue, :is_published, :status, :created_by, :now, :now
      )`,
      {
        replacements: {
          timetable_id,
          event_id: validatedData.event_id,
          mapping_id: validatedData.mapping_id,
          exam_date: validatedData.exam_date,
          slot_id: validatedData.slot_id,
          shift: validatedData.shift,
          venue: validatedData.venue || null,
          is_published: 0,
          status: 'scheduled',
          created_by,
          now,
        },
        type: db.Sequelize.QueryTypes.INSERT,
      }
    );

    // Fetch created entry
    const [createdEntry] = await db.sequelize.query(
      `
      SELECT 
        tt.*,
        sub.subject_name, sub.subject_code,
        ts.slot_label, ts.start_time, ts.end_time
      FROM timetable tt
      LEFT JOIN semester_subject_mapping ssm ON tt.mapping_id = ssm.mapping_id
      LEFT JOIN subject sub ON ssm.subject_id = sub.subject_id
      LEFT JOIN time_slot ts ON tt.slot_id = ts.slot_id
      WHERE tt.timetable_id = :timetable_id
    `,
      {
        replacements: { timetable_id },
        nest: true,
        type: db.Sequelize.QueryTypes.SELECT,
      }
    );

    res.status(201).json({
      success: true,
      data: createdEntry,
      message: 'Timetable entry created successfully',
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors || error.issues,
      });
    }
    console.error('Error in createTimetableEntry:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

/**
 * Bulk create timetable entries
 */
const bulkCreateTimetableEntries = async (req, res) => {
  try {
    const { entries } = bulkCreateTimetableSchema.parse(req.body);
    const created_by = req.user?.uid || null;

    const results = {
      success: [],
      failed: [],
    };

    for (const entry of entries) {
      try {
        const validated = createTimetableSchema.parse(entry);

        // Quick validations
        const [examEvent] = await db.sequelize.query(
          `SELECT event_id FROM exam_event WHERE event_id = :event_id AND deletedAt IS NULL`,
          {
            replacements: { event_id: validated.event_id },
            type: db.Sequelize.QueryTypes.SELECT,
          }
        );
        if (!examEvent) {
          results.failed.push({ ...entry, error: 'Exam event not found' });
          continue;
        }

        const [mapping] = await db.sequelize.query(
          `SELECT mapping_id FROM semester_subject_mapping WHERE mapping_id = :mapping_id AND deletedAt IS NULL AND is_active = 1`,
          {
            replacements: { mapping_id: validated.mapping_id },
            type: db.Sequelize.QueryTypes.SELECT,
          }
        );
        if (!mapping) {
          results.failed.push({
            ...entry,
            error: 'Subject mapping not found or inactive',
          });
          continue;
        }

        const [timeSlot] = await db.sequelize.query(
          `SELECT slot_id FROM time_slot WHERE slot_id = :slot_id AND deletedAt IS NULL`,
          {
            replacements: { slot_id: validated.slot_id },
            type: db.Sequelize.QueryTypes.SELECT,
          }
        );
        if (!timeSlot) {
          results.failed.push({ ...entry, error: 'Time slot not found' });
          continue;
        }

        // Check for duplicate
        const [existing] = await db.sequelize.query(
          `SELECT timetable_id FROM timetable WHERE event_id = :event_id AND mapping_id = :mapping_id AND deletedAt IS NULL`,
          {
            replacements: {
              event_id: validated.event_id,
              mapping_id: validated.mapping_id,
            },
            type: db.Sequelize.QueryTypes.SELECT,
          }
        );
        if (existing) {
          results.failed.push({
            ...entry,
            error: 'Subject already scheduled for this exam event',
          });
          continue;
        }

        const timetable_id = require('crypto').randomUUID();
        const now = new Date();

        await db.sequelize.query(
          `INSERT INTO timetable (
            timetable_id, event_id, mapping_id, exam_date, slot_id, shift, 
            venue, is_published, status, created_by, createdAt, updatedAt
          ) VALUES (
            :timetable_id, :event_id, :mapping_id, :exam_date, :slot_id, :shift,
            :venue, :is_published, :status, :created_by, :now, :now
          )`,
          {
            replacements: {
              timetable_id,
              event_id: validated.event_id,
              mapping_id: validated.mapping_id,
              exam_date: validated.exam_date,
              slot_id: validated.slot_id,
              shift: validated.shift,
              venue: validated.venue || null,
              is_published: 0,
              status: 'scheduled',
              created_by,
              now,
            },
            type: db.Sequelize.QueryTypes.INSERT,
          }
        );

        results.success.push({ timetable_id, ...validated });
      } catch (err) {
        results.failed.push({ ...entry, error: err.message });
      }
    }

    res.status(201).json({
      success: true,
      data: results,
      message: `${results.success.length} timetable entries created successfully, ${results.failed.length} failed`,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors || error.issues,
      });
    }
    console.error('Error in bulkCreateTimetableEntries:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

/**
 * Update timetable entry
 */
const updateTimetableEntry = async (req, res) => {
  try {
    const { timetable_id } = timetableIdParamSchema.parse(req.params);
    const validatedData = updateTimetableSchema.parse(req.body);

    // Check if entry exists
    const [existingEntry] = await db.sequelize.query(
      `SELECT * FROM timetable WHERE timetable_id = :timetable_id AND deletedAt IS NULL`,
      {
        replacements: { timetable_id },
        type: db.Sequelize.QueryTypes.SELECT,
      }
    );

    if (!existingEntry) {
      return res.status(404).json({
        success: false,
        message: 'Timetable entry not found',
      });
    }

    // Build update query
    const updateFields = [];
    const replacements = { timetable_id };

    if (validatedData.exam_date !== undefined) {
      updateFields.push('exam_date = :exam_date');
      replacements.exam_date = validatedData.exam_date;
    }

    if (validatedData.slot_id !== undefined) {
      updateFields.push('slot_id = :slot_id');
      replacements.slot_id = validatedData.slot_id;
    }

    if (validatedData.shift !== undefined) {
      updateFields.push('shift = :shift');
      replacements.shift = validatedData.shift;
    }

    if (validatedData.venue !== undefined) {
      updateFields.push('venue = :venue');
      replacements.venue = validatedData.venue;
    }

    if (validatedData.status !== undefined) {
      updateFields.push('status = :status');
      replacements.status = validatedData.status;
    }

    updateFields.push('updatedAt = :now');
    replacements.now = new Date();

    if (updateFields.length > 0) {
      await db.sequelize.query(
        `UPDATE timetable SET ${updateFields.join(', ')} WHERE timetable_id = :timetable_id`,
        { replacements, type: db.Sequelize.QueryTypes.UPDATE }
      );
    }

    // Fetch updated entry
    const [updatedEntry] = await db.sequelize.query(
      `
      SELECT 
        tt.*,
        sub.subject_name,
        ts.slot_label, ts.start_time, ts.end_time
      FROM timetable tt
      LEFT JOIN semester_subject_mapping ssm ON tt.mapping_id = ssm.mapping_id
      LEFT JOIN subject sub ON ssm.subject_id = sub.subject_id
      LEFT JOIN time_slot ts ON tt.slot_id = ts.slot_id
      WHERE tt.timetable_id = :timetable_id
    `,
      {
        replacements: { timetable_id },
        nest: true,
        type: db.Sequelize.QueryTypes.SELECT,
      }
    );

    res.status(200).json({
      success: true,
      data: updatedEntry,
      message: 'Timetable entry updated successfully',
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors || error.issues,
      });
    }
    console.error('Error in updateTimetableEntry:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

/**
 * Reschedule timetable entry
 */
const rescheduleTimetableEntry = async (req, res) => {
  try {
    const { timetable_id } = timetableIdParamSchema.parse(req.params);
    const { new_date, new_slot_id, reason } = rescheduleTimetableSchema.parse(
      req.body
    );
    const created_by = req.user?.uid || null;

    // Check if entry exists
    const [existingEntry] = await db.sequelize.query(
      `SELECT * FROM timetable WHERE timetable_id = :timetable_id AND deletedAt IS NULL AND status != 'cancelled'`,
      {
        replacements: { timetable_id },
        type: db.Sequelize.QueryTypes.SELECT,
      }
    );

    if (!existingEntry) {
      return res.status(404).json({
        success: false,
        message: 'Timetable entry not found or already cancelled',
      });
    }

    // Check if new time slot exists
    const [newTimeSlot] = await db.sequelize.query(
      `SELECT slot_id FROM time_slot WHERE slot_id = :slot_id AND deletedAt IS NULL`,
      {
        replacements: { slot_id: new_slot_id },
        type: db.Sequelize.QueryTypes.SELECT,
      }
    );

    if (!newTimeSlot) {
      return res.status(404).json({
        success: false,
        message: 'New time slot not found',
      });
    }

    // Check for clash with new date and slot
    const [clashEntry] = await db.sequelize.query(
      `SELECT tt.timetable_id
       FROM timetable tt
       WHERE tt.event_id = :event_id 
         AND tt.exam_date = :new_date 
         AND tt.slot_id = :slot_id
         AND tt.timetable_id != :timetable_id
         AND tt.deletedAt IS NULL
         AND tt.status != 'cancelled'`,
      {
        replacements: {
          event_id: existingEntry.event_id,
          new_date,
          slot_id: new_slot_id,
          timetable_id,
        },
        type: db.Sequelize.QueryTypes.SELECT,
      }
    );

    if (clashEntry) {
      return res.status(409).json({
        success: false,
        message:
          'Schedule clash: Another exam is already scheduled at this date and time slot',
      });
    }

    const now = new Date();
    const new_timetable_id = require('crypto').randomUUID();

    // Create new rescheduled entry
    await db.sequelize.query(
      `INSERT INTO timetable (
        timetable_id, event_id, mapping_id, exam_date, slot_id, shift, 
        venue, is_published, status, rescheduled_from, reschedule_reason, 
        created_by, createdAt, updatedAt
      ) VALUES (
        :new_timetable_id, :event_id, :mapping_id, :new_date, :new_slot_id, :shift,
        :venue, :is_published, :status, :rescheduled_from, :reason, 
        :created_by, :now, :now
      )`,
      {
        replacements: {
          new_timetable_id,
          event_id: existingEntry.event_id,
          mapping_id: existingEntry.mapping_id,
          new_date,
          new_slot_id,
          shift: existingEntry.shift,
          venue: existingEntry.venue,
          is_published: existingEntry.is_published,
          status: 'rescheduled',
          rescheduled_from: timetable_id,
          reason,
          created_by,
          now,
        },
        type: db.Sequelize.QueryTypes.INSERT,
      }
    );

    // Mark old entry as cancelled
    await db.sequelize.query(
      `UPDATE timetable SET status = 'cancelled', updatedAt = :now WHERE timetable_id = :timetable_id`,
      {
        replacements: { timetable_id, now },
        type: db.Sequelize.QueryTypes.UPDATE,
      }
    );

    // Fetch new entry
    const [newEntry] = await db.sequelize.query(
      `
      SELECT 
        tt.*,
        sub.subject_name,
        ts.slot_label, ts.start_time, ts.end_time
      FROM timetable tt
      LEFT JOIN semester_subject_mapping ssm ON tt.mapping_id = ssm.mapping_id
      LEFT JOIN subject sub ON ssm.subject_id = sub.subject_id
      LEFT JOIN time_slot ts ON tt.slot_id = ts.slot_id
      WHERE tt.timetable_id = :new_timetable_id
    `,
      {
        replacements: { new_timetable_id },
        nest: true,
        type: db.Sequelize.QueryTypes.SELECT,
      }
    );

    res.status(200).json({
      success: true,
      data: {
        original_entry_id: timetable_id,
        new_entry: newEntry,
      },
      message: 'Exam rescheduled successfully',
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors || error.issues,
      });
    }
    console.error('Error in rescheduleTimetableEntry:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

/**
 * Publish timetable
 */
const publishTimetable = async (req, res) => {
  try {
    const { event_id, is_published } = publishTimetableSchema.parse(req.body);

    // Check if exam event exists
    const [examEvent] = await db.sequelize.query(
      `SELECT event_id FROM exam_event WHERE event_id = :event_id AND deletedAt IS NULL`,
      {
        replacements: { event_id },
        type: db.Sequelize.QueryTypes.SELECT,
      }
    );

    if (!examEvent) {
      return res.status(404).json({
        success: false,
        message: 'Exam event not found',
      });
    }

    const now = new Date();

    await db.sequelize.query(
      `UPDATE timetable SET is_published = :is_published, updatedAt = :now WHERE event_id = :event_id AND deletedAt IS NULL`,
      {
        replacements: { event_id, is_published: is_published ? 1 : 0, now },
        type: db.Sequelize.QueryTypes.UPDATE,
      }
    );

    // Also update exam event status if publishing
    if (is_published) {
      await db.sequelize.query(
        `UPDATE exam_event SET is_published = 1, status = 'published', updatedAt = :now WHERE event_id = :event_id`,
        {
          replacements: { event_id, now },
          type: db.Sequelize.QueryTypes.UPDATE,
        }
      );
    }

    res.status(200).json({
      success: true,
      message: `Timetable ${is_published ? 'published' : 'unpublished'} successfully`,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors || error.issues,
      });
    }
    console.error('Error in publishTimetable:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

/**
 * Soft delete timetable entry
 */
const deleteTimetableEntry = async (req, res) => {
  try {
    const { timetable_id } = timetableIdParamSchema.parse(req.params);

    const [existingEntry] = await db.sequelize.query(
      `SELECT timetable_id FROM timetable WHERE timetable_id = :timetable_id AND deletedAt IS NULL`,
      {
        replacements: { timetable_id },
        type: db.Sequelize.QueryTypes.SELECT,
      }
    );

    if (!existingEntry) {
      return res.status(404).json({
        success: false,
        message: 'Timetable entry not found',
      });
    }

    const now = new Date();
    await db.sequelize.query(
      `UPDATE timetable SET deletedAt = :now WHERE timetable_id = :timetable_id`,
      {
        replacements: { timetable_id, now },
        type: db.Sequelize.QueryTypes.UPDATE,
      }
    );

    res.status(200).json({
      success: true,
      message: 'Timetable entry deleted successfully',
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors || error.issues,
      });
    }
    console.error('Error in deleteTimetableEntry:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

/**
 * Restore soft deleted timetable entry
 */
const restoreTimetableEntry = async (req, res) => {
  try {
    const { timetable_id } = timetableIdParamSchema.parse(req.params);

    const [entry] = await db.sequelize.query(
      `SELECT timetable_id FROM timetable WHERE timetable_id = :timetable_id AND deletedAt IS NOT NULL`,
      {
        replacements: { timetable_id },
        type: db.Sequelize.QueryTypes.SELECT,
      }
    );

    if (!entry) {
      return res.status(404).json({
        success: false,
        message: 'Deleted timetable entry not found',
      });
    }

    await db.sequelize.query(
      `UPDATE timetable SET deletedAt = NULL WHERE timetable_id = :timetable_id`,
      { replacements: { timetable_id }, type: db.Sequelize.QueryTypes.UPDATE }
    );

    res.status(200).json({
      success: true,
      message: 'Timetable entry restored successfully',
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors || error.issues,
      });
    }
    console.error('Error in restoreTimetableEntry:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

/**
 * Get clash detection report
 */
/**
 * Get clash detection report for all events
 */
const getClashDetectionReport = async (req, res) => {
  try {
    // Find all clashes in the timetable
    const clashes = await db.sequelize.query(
      `
      SELECT 
        tt1.timetable_id as entry1_id,
        tt2.timetable_id as entry2_id,
        tt1.event_id,
        ee.event_name,
        tt1.exam_date,
        ts1.slot_label,
        ts1.start_time,
        ts1.end_time,
        sub1.subject_name as subject1,
        sub2.subject_name as subject2,
        b1.branch_name as branch1,
        b2.branch_name as branch2
      FROM timetable tt1
      JOIN timetable tt2 ON tt1.event_id = tt2.event_id 
        AND tt1.exam_date = tt2.exam_date 
        AND tt1.slot_id = tt2.slot_id
        AND tt1.timetable_id < tt2.timetable_id
        AND tt1.deletedAt IS NULL 
        AND tt2.deletedAt IS NULL
        AND tt1.status != 'cancelled' 
        AND tt2.status != 'cancelled'
      JOIN semester_subject_mapping ssm1 ON tt1.mapping_id = ssm1.mapping_id
      JOIN semester_subject_mapping ssm2 ON tt2.mapping_id = ssm2.mapping_id
      JOIN subject sub1 ON ssm1.subject_id = sub1.subject_id
      JOIN subject sub2 ON ssm2.subject_id = sub2.subject_id
      JOIN branch b1 ON ssm1.branch_id = b1.branch_id
      JOIN branch b2 ON ssm2.branch_id = b2.branch_id
      JOIN time_slot ts1 ON tt1.slot_id = ts1.slot_id
      LEFT JOIN exam_event ee ON tt1.event_id = ee.event_id
      ORDER BY tt1.exam_date, ts1.start_time
    `,
      {
        nest: true,
        type: db.Sequelize.QueryTypes.SELECT,
      }
    );

    // Find branch having multiple exams on same day
    const branchMultipleExams = await db.sequelize.query(
      `
      SELECT 
        tt.exam_date,
        tt.event_id,
        ee.event_name,
        b.branch_name,
        COUNT(*) as exam_count,
        GROUP_CONCAT(DISTINCT sub.subject_name SEPARATOR ', ') as subjects
      FROM timetable tt
      JOIN semester_subject_mapping ssm ON tt.mapping_id = ssm.mapping_id
      JOIN branch b ON ssm.branch_id = b.branch_id
      JOIN subject sub ON ssm.subject_id = sub.subject_id
      LEFT JOIN exam_event ee ON tt.event_id = ee.event_id
      WHERE tt.deletedAt IS NULL 
        AND tt.status != 'cancelled'
      GROUP BY tt.exam_date, tt.event_id, b.branch_id
      HAVING COUNT(*) > 2
      ORDER BY tt.exam_date, b.branch_name
    `,
      {
        nest: true,
        type: db.Sequelize.QueryTypes.SELECT,
      }
    );

    res.status(200).json({
      success: true,
      data: {
        slot_clashes: clashes,
        branch_exam_limit_violations: branchMultipleExams,
        summary: {
          total_slot_clashes: clashes.length,
          total_branch_violations: branchMultipleExams.length,
        },
      },
      message: 'Clash detection report generated successfully',
    });
  } catch (error) {
    console.error('Error in getClashDetectionReport:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

/**
 * Get clash detection report for a specific event
 */
const getClashDetectionReportByEvent = async (req, res) => {
  try {
    const { event_id } = req.params;

    // Validate UUID format
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(event_id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid event ID format',
      });
    }

    // Find all clashes in the timetable for specific event
    const clashes = await db.sequelize.query(
      `
      SELECT 
        tt1.timetable_id as entry1_id,
        tt2.timetable_id as entry2_id,
        tt1.exam_date,
        ts1.slot_label,
        ts1.start_time,
        ts1.end_time,
        sub1.subject_name as subject1,
        sub2.subject_name as subject2,
        b1.branch_name as branch1,
        b2.branch_name as branch2
      FROM timetable tt1
      JOIN timetable tt2 ON tt1.event_id = tt2.event_id 
        AND tt1.exam_date = tt2.exam_date 
        AND tt1.slot_id = tt2.slot_id
        AND tt1.timetable_id < tt2.timetable_id
        AND tt1.deletedAt IS NULL 
        AND tt2.deletedAt IS NULL
        AND tt1.status != 'cancelled' 
        AND tt2.status != 'cancelled'
      JOIN semester_subject_mapping ssm1 ON tt1.mapping_id = ssm1.mapping_id
      JOIN semester_subject_mapping ssm2 ON tt2.mapping_id = ssm2.mapping_id
      JOIN subject sub1 ON ssm1.subject_id = sub1.subject_id
      JOIN subject sub2 ON ssm2.subject_id = sub2.subject_id
      JOIN branch b1 ON ssm1.branch_id = b1.branch_id
      JOIN branch b2 ON ssm2.branch_id = b2.branch_id
      JOIN time_slot ts1 ON tt1.slot_id = ts1.slot_id
      WHERE tt1.event_id = :event_id
      ORDER BY tt1.exam_date, ts1.start_time
    `,
      {
        replacements: { event_id },
        nest: true,
        type: db.Sequelize.QueryTypes.SELECT,
      }
    );

    // Find branch having multiple exams on same day for specific event
    const branchMultipleExams = await db.sequelize.query(
      `
      SELECT 
        tt.exam_date,
        b.branch_name,
        COUNT(*) as exam_count,
        GROUP_CONCAT(sub.subject_name SEPARATOR ', ') as subjects
      FROM timetable tt
      JOIN semester_subject_mapping ssm ON tt.mapping_id = ssm.mapping_id
      JOIN branch b ON ssm.branch_id = b.branch_id
      JOIN subject sub ON ssm.subject_id = sub.subject_id
      WHERE tt.deletedAt IS NULL 
        AND tt.status != 'cancelled'
        AND tt.event_id = :event_id
      GROUP BY tt.exam_date, b.branch_id
      HAVING COUNT(*) > 2
      ORDER BY tt.exam_date, b.branch_name
    `,
      {
        replacements: { event_id },
        nest: true,
        type: db.Sequelize.QueryTypes.SELECT,
      }
    );

    res.status(200).json({
      success: true,
      data: {
        event_id,
        slot_clashes: clashes,
        branch_exam_limit_violations: branchMultipleExams,
        summary: {
          total_slot_clashes: clashes.length,
          total_branch_violations: branchMultipleExams.length,
        },
      },
      message: 'Clash detection report generated successfully',
    });
  } catch (error) {
    console.error('Error in getClashDetectionReportByEvent:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

module.exports = {
  getAllTimetableEntries,
  getTimetableEntryById,
  getTimetableByEvent,
  getTimetableByDateRange,
  getTimetableByBranchAndSemester,
  getStudentTimetable,
  createTimetableEntry,
  bulkCreateTimetableEntries,
  updateTimetableEntry,
  rescheduleTimetableEntry,
  publishTimetable,
  deleteTimetableEntry,
  restoreTimetableEntry,
  getClashDetectionReport,
  getClashDetectionReportByEvent,
};
