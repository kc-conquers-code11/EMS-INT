const { ZodError } = require('zod');
const db = require('../../../models');
const {
  createTimeSlotSchema,
  bulkCreateTimeSlotSchema,
  updateTimeSlotSchema,
  slotIdParamSchema,
  getSlotsByEventSchema,
} = require('../../validations/timeTable/timeSlot.validations.js');

const formatTime = (t) => {
  if (!t) return t;
  const parts = t.split(':');
  const h = parts[0].padStart(2, '0');
  const m = parts[1] || '00';
  const s = parts[2] || '00';
  return `${h}:${m}:${s}`;
};


/**
 * Get all time slots with filtering
 */
const getAllTimeSlots = async (req, res) => {
  try {
    const { page = 1, limit = 20, event_id } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const offset = (pageNum - 1) * limitNum;

    let whereConditions = ['ts.deleted_at IS NULL'];
    const replacements = {};

    if (event_id) {
      whereConditions.push('ts.event_id = :event_id');
      replacements.event_id = event_id;
    }

    const whereClause = `WHERE ${whereConditions.join(' AND ')}`;

    // Get total count
    const [countResult] = await db.sequelize.query(
      `SELECT COUNT(*) as total FROM time_slot ts ${whereClause}`,
      { replacements, type: db.Sequelize.QueryTypes.SELECT }
    );

    const timeSlots = await db.sequelize.query(
      `
      SELECT 
        ts.*,
        ee.event_name, ee.exam_type, ee.status as event_status
      FROM time_slot ts
      LEFT JOIN exam_event ee ON ts.event_id = ee.event_id AND ee.deletedAt IS NULL
      ${whereClause}
      ORDER BY ts.start_time ASC
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
      data: timeSlots,
      message: 'Time slots retrieved successfully',
    });
  } catch (error) {
    console.error('Error in getAllTimeSlots:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

/**
 * Get time slot by ID
 */
const getTimeSlotById = async (req, res) => {
  try {
    const { slot_id } = slotIdParamSchema.parse(req.params);

    const [timeSlot] = await db.sequelize.query(
      `
      SELECT 
        ts.*,
        ee.event_name, ee.exam_type, ee.status as event_status
      FROM time_slot ts
      LEFT JOIN exam_event ee ON ts.event_id = ee.event_id AND ee.deletedAt IS NULL
      WHERE ts.slot_id = :slot_id AND ts.deleted_at IS NULL
    `,
      {
        replacements: { slot_id },
        nest: true,
        type: db.Sequelize.QueryTypes.SELECT,
      }
    );

    if (!timeSlot) {
      return res.status(404).json({
        success: false,
        message: 'Time slot not found',
      });
    }

    res.status(200).json({
      success: true,
      data: timeSlot,
      message: 'Time slot retrieved successfully',
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors || error.issues,
      });
    }
    console.error('Error in getTimeSlotById:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

/**
 * Get time slots by exam event
 */
const getTimeSlotsByEvent = async (req, res) => {
  try {
    const { event_id } = getSlotsByEventSchema.parse(req.params);

    const timeSlots = await db.sequelize.query(
      `
      SELECT 
        slot_id, slot_label, start_time, end_time, created_at
      FROM time_slot
      WHERE event_id = :event_id AND deleted_at IS NULL
      ORDER BY start_time ASC
    `,
      {
        replacements: { event_id },
        nest: true,
        type: db.Sequelize.QueryTypes.SELECT,
      }
    );

    res.status(200).json({
      success: true,
      data: timeSlots,
      message: 'Time slots retrieved successfully',
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors || error.issues,
      });
    }
    console.error('Error in getTimeSlotsByEvent:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

/**
 * Create time slot
 */
const createTimeSlot = async (req, res) => {
  try {
    if (!req.body.slot_label && req.body.start_time && req.body.end_time) {
      const formatLabel = (t) => {
        const [h, m] = t.split(':');
        const hr = parseInt(h, 10);
        return `${hr % 12 || 12}:${m} ${hr >= 12 ? 'PM' : 'AM'}`;
      };
      req.body.slot_label = `${formatLabel(req.body.start_time)} - ${formatLabel(req.body.end_time)}`;
    }
    const validatedData = createTimeSlotSchema.parse(req.body);
    validatedData.start_time = formatTime(validatedData.start_time);
    validatedData.end_time = formatTime(validatedData.end_time);

    // Check if exam event exists (only if event_id is provided)
    if (validatedData.event_id) {
      const [examEvent] = await db.sequelize.query(
        `SELECT event_id FROM exam_event WHERE event_id = :event_id AND deletedAt IS NULL`,
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
    }

    // Check for duplicate slot label within same event / semester
    let duplicateQuery = `SELECT slot_id FROM time_slot WHERE slot_label = :slot_label AND deleted_at IS NULL`;
    const duplicateReplacements = { slot_label: validatedData.slot_label };
    if (validatedData.event_id) {
      duplicateQuery += ` AND event_id = :event_id`;
      duplicateReplacements.event_id = validatedData.event_id;
    } else if (validatedData.semester_id) {
      duplicateQuery += ` AND semester_id = :semester_id`;
      duplicateReplacements.semester_id = validatedData.semester_id;
    } else {
      duplicateQuery += ` AND event_id IS NULL AND semester_id IS NULL`;
    }

    const [existingSlot] = await db.sequelize.query(duplicateQuery, {
      replacements: duplicateReplacements,
      type: db.Sequelize.QueryTypes.SELECT,
    });

    if (existingSlot) {
      return res.status(400).json({
        success: false,
        message:
          'A time slot with this label already exists for this scope',
      });
    }

    // Check for overlapping time slots within same event / semester
    let overlapQuery = `
      SELECT slot_id FROM time_slot 
      WHERE deleted_at IS NULL
        AND (
          (start_time <= :start_time AND end_time > :start_time) OR
          (start_time < :end_time AND end_time >= :end_time) OR
          (start_time >= :start_time AND end_time <= :end_time)
        )`;
    const overlapReplacements = {
      start_time: validatedData.start_time,
      end_time: validatedData.end_time,
    };
    if (validatedData.event_id) {
      overlapQuery += ` AND event_id = :event_id`;
      overlapReplacements.event_id = validatedData.event_id;
    } else if (validatedData.semester_id) {
      overlapQuery += ` AND semester_id = :semester_id`;
      overlapReplacements.semester_id = validatedData.semester_id;
    } else {
      overlapQuery += ` AND event_id IS NULL AND semester_id IS NULL`;
    }

    const [overlappingSlot] = await db.sequelize.query(overlapQuery, {
      replacements: overlapReplacements,
      type: db.Sequelize.QueryTypes.SELECT,
    });

    if (overlappingSlot) {
      return res.status(400).json({
        success: false,
        message: 'Time slot overlaps with an existing slot in this scope',
      });
    }

    // Create time slot
    const slot_id = require('crypto').randomUUID();
    const now = new Date();

    await db.sequelize.query(
      `INSERT INTO time_slot (
        slot_id, event_id, semester_id, slot_label, start_time, end_time, created_at, updated_at
      ) VALUES (
        :slot_id, :event_id, :semester_id, :slot_label, :start_time, :end_time, :now, :now
      )`,
      {
        replacements: {
          slot_id,
          event_id: validatedData.event_id || null,
          semester_id: validatedData.semester_id || null,
          slot_label: validatedData.slot_label,
          start_time: validatedData.start_time,
          end_time: validatedData.end_time,
          now,
        },
        type: db.Sequelize.QueryTypes.INSERT,
      }
    );

    // Fetch created time slot
    const [createdSlot] = await db.sequelize.query(
      `
      SELECT ts.*, ee.event_name
      FROM time_slot ts
      LEFT JOIN exam_event ee ON ts.event_id = ee.event_id
      WHERE ts.slot_id = :slot_id
    `,
      {
        replacements: { slot_id },
        nest: true,
        type: db.Sequelize.QueryTypes.SELECT,
      }
    );

    res.status(201).json({
      success: true,
      data: createdSlot,
      message: 'Time slot created successfully',
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors || error.issues,
      });
    }
    console.error('Error in createTimeSlot:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

/**
 * Bulk create time slots
 */
const bulkCreateTimeSlots = async (req, res) => {
  try {
    const formatLabel = (t) => {
      const [h, m] = t.split(':');
      const hr = parseInt(h, 10);
      return `${hr % 12 || 12}:${m} ${hr >= 12 ? 'PM' : 'AM'}`;
    };
    if (req.body.slots && Array.isArray(req.body.slots)) {
      req.body.slots = req.body.slots.map(slot => {
        if (!slot.slot_label && slot.start_time && slot.end_time) {
          return {
            ...slot,
            slot_label: `${formatLabel(slot.start_time)} - ${formatLabel(slot.end_time)}`
          };
        }
        return slot;
      });
    }
    const { event_id, slots } = bulkCreateTimeSlotSchema.parse(req.body);

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

    const results = {
      success: [],
      failed: [],
    };

    for (const slot of slots) {
      try {
        slot.start_time = formatTime(slot.start_time);
        slot.end_time = formatTime(slot.end_time);
        // Check for duplicate label
        let duplicateQuery = `SELECT slot_id FROM time_slot WHERE slot_label = :slot_label AND deleted_at IS NULL`;
        const duplicateReplacements = { slot_label: slot.slot_label };
        if (event_id) {
          duplicateQuery += ` AND event_id = :event_id`;
          duplicateReplacements.event_id = event_id;
        } else if (slot.semester_id) {
          duplicateQuery += ` AND semester_id = :semester_id`;
          duplicateReplacements.semester_id = slot.semester_id;
        } else {
          duplicateQuery += ` AND event_id IS NULL AND semester_id IS NULL`;
        }

        const [existingSlot] = await db.sequelize.query(duplicateQuery, {
          replacements: duplicateReplacements,
          type: db.Sequelize.QueryTypes.SELECT,
        });

        if (existingSlot) {
          results.failed.push({
            ...slot,
            error: 'Slot label already exists for this scope',
          });
          continue;
        }

        // Check for overlap
        let overlapQuery = `
          SELECT slot_id FROM time_slot 
          WHERE deleted_at IS NULL
            AND (
              (start_time <= :start_time AND end_time > :start_time) OR
              (start_time < :end_time AND end_time >= :end_time) OR
              (start_time >= :start_time AND end_time <= :end_time)
            )`;
        const overlapReplacements = {
          start_time: slot.start_time,
          end_time: slot.end_time,
        };
        if (event_id) {
          overlapQuery += ` AND event_id = :event_id`;
          overlapReplacements.event_id = event_id;
        } else if (slot.semester_id) {
          overlapQuery += ` AND semester_id = :semester_id`;
          overlapReplacements.semester_id = slot.semester_id;
        } else {
          overlapQuery += ` AND event_id IS NULL AND semester_id IS NULL`;
        }

        const [overlappingSlot] = await db.sequelize.query(overlapQuery, {
          replacements: overlapReplacements,
          type: db.Sequelize.QueryTypes.SELECT,
        });

        if (overlappingSlot) {
          results.failed.push({
            ...slot,
            error: 'Time slot overlaps with existing slot in this scope',
          });
          continue;
        }

        const slot_id = require('crypto').randomUUID();
        const now = new Date();

        await db.sequelize.query(
          `INSERT INTO time_slot (
            slot_id, event_id, semester_id, slot_label, start_time, end_time, created_at, updated_at
          ) VALUES (
            :slot_id, :event_id, :semester_id, :slot_label, :start_time, :end_time, :now, :now
          )`,
          {
            replacements: {
              slot_id,
              event_id: event_id || null,
              semester_id: slot.semester_id || null,
              slot_label: slot.slot_label,
              start_time: slot.start_time,
              end_time: slot.end_time,
              now,
            },
            type: db.Sequelize.QueryTypes.INSERT,
          }
        );

        results.success.push({
          slot_id,
          ...slot,
        });
      } catch (err) {
        results.failed.push({
          ...slot,
          error: err.message,
        });
      }
    }

    res.status(201).json({
      success: true,
      data: results,
      message: `${results.success.length} time slots created successfully, ${results.failed.length} failed`,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors || error.issues,
      });
    }
    console.error('Error in bulkCreateTimeSlots:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

/**
 * Update time slot
 */
const updateTimeSlot = async (req, res) => {
  try {
    const { slot_id } = slotIdParamSchema.parse(req.params);
    const validatedData = updateTimeSlotSchema.parse(req.body);

    // Check if time slot exists
    const [existingSlot] = await db.sequelize.query(
      `SELECT * FROM time_slot WHERE slot_id = :slot_id AND deleted_at IS NULL`,
      {
        replacements: { slot_id },
        type: db.Sequelize.QueryTypes.SELECT,
      }
    );

    if (!existingSlot) {
      return res.status(404).json({
        success: false,
        message: 'Time slot not found',
      });
    }

    // Build update query
    const updateFields = [];
    const replacements = { slot_id };

    if (validatedData.semester_id !== undefined) {
      updateFields.push('semester_id = :semester_id');
      replacements.semester_id = validatedData.semester_id || null;
    }

    const targetEventId = existingSlot.event_id;
    const targetSemesterId = validatedData.semester_id !== undefined ? validatedData.semester_id : existingSlot.semester_id;

    if (validatedData.slot_label !== undefined) {
      // Check for duplicate label
      let duplicateQuery = `SELECT slot_id FROM time_slot WHERE slot_label = :slot_label AND slot_id != :slot_id AND deleted_at IS NULL`;
      const duplicateReplacements = { slot_label: validatedData.slot_label, slot_id };
      
      if (targetEventId) {
        duplicateQuery += ` AND event_id = :event_id`;
        duplicateReplacements.event_id = targetEventId;
      } else if (targetSemesterId) {
        duplicateQuery += ` AND semester_id = :semester_id`;
        duplicateReplacements.semester_id = targetSemesterId;
      } else {
        duplicateQuery += ` AND event_id IS NULL AND semester_id IS NULL`;
      }

      const [duplicate] = await db.sequelize.query(duplicateQuery, {
        replacements: duplicateReplacements,
        type: db.Sequelize.QueryTypes.SELECT,
      });

      if (duplicate) {
        return res.status(400).json({
          success: false,
          message:
            'A time slot with this label already exists for this scope',
        });
      }

      updateFields.push('slot_label = :slot_label');
      replacements.slot_label = validatedData.slot_label;
    }

    if (validatedData.start_time !== undefined) {
      validatedData.start_time = formatTime(validatedData.start_time);
      updateFields.push('start_time = :start_time');
      replacements.start_time = validatedData.start_time;
    }

    if (validatedData.end_time !== undefined) {
      validatedData.end_time = formatTime(validatedData.end_time);
      updateFields.push('end_time = :end_time');
      replacements.end_time = validatedData.end_time;
    }

    // Check for overlap if time or semester changed
    const newStartTime = validatedData.start_time || existingSlot.start_time;
    const newEndTime = validatedData.end_time || existingSlot.end_time;

    if (
      validatedData.start_time !== undefined ||
      validatedData.end_time !== undefined ||
      validatedData.semester_id !== undefined
    ) {
      let overlapQuery = `
        SELECT slot_id FROM time_slot 
        WHERE slot_id != :slot_id 
          AND deleted_at IS NULL
          AND (
            (start_time <= :start_time AND end_time > :start_time) OR
            (start_time < :end_time AND end_time >= :end_time) OR
            (start_time >= :start_time AND end_time <= :end_time)
          )`;
      const overlapReplacements = {
        slot_id,
        start_time: newStartTime,
        end_time: newEndTime,
      };

      if (targetEventId) {
        overlapQuery += ` AND event_id = :event_id`;
        overlapReplacements.event_id = targetEventId;
      } else if (targetSemesterId) {
        overlapQuery += ` AND semester_id = :semester_id`;
        overlapReplacements.semester_id = targetSemesterId;
      } else {
        overlapQuery += ` AND event_id IS NULL AND semester_id IS NULL`;
      }

      const [overlapping] = await db.sequelize.query(overlapQuery, {
        replacements: overlapReplacements,
        type: db.Sequelize.QueryTypes.SELECT,
      });

      if (overlapping) {
        return res.status(400).json({
          success: false,
          message: 'Time slot overlaps with another slot in this scope',
        });
      }
    }

    updateFields.push('updated_at = :now');
    replacements.now = new Date();

    if (updateFields.length > 0) {
      await db.sequelize.query(
        `UPDATE time_slot SET ${updateFields.join(', ')} WHERE slot_id = :slot_id`,
        { replacements, type: db.Sequelize.QueryTypes.UPDATE }
      );
    }

    // Fetch updated time slot
    const [updatedSlot] = await db.sequelize.query(
      `
      SELECT ts.*, ee.event_name
      FROM time_slot ts
      LEFT JOIN exam_event ee ON ts.event_id = ee.event_id
      WHERE ts.slot_id = :slot_id
    `,
      {
        replacements: { slot_id },
        nest: true,
        type: db.Sequelize.QueryTypes.SELECT,
      }
    );

    res.status(200).json({
      success: true,
      data: updatedSlot,
      message: 'Time slot updated successfully',
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors || error.issues,
      });
    }
    console.error('Error in updateTimeSlot:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

/**
 * Soft delete time slot
 */
const deleteTimeSlot = async (req, res) => {
  try {
    const { slot_id } = slotIdParamSchema.parse(req.params);

    // Check if time slot exists
    const [existingSlot] = await db.sequelize.query(
      `SELECT slot_id FROM time_slot WHERE slot_id = :slot_id AND deleted_at IS NULL`,
      {
        replacements: { slot_id },
        type: db.Sequelize.QueryTypes.SELECT,
      }
    );

    if (!existingSlot) {
      return res.status(404).json({
        success: false,
        message: 'Time slot not found',
      });
    }

    // Check if time slot is used in timetable
    const [timetableEntry] = await db.sequelize.query(
      `SELECT timetable_id FROM timetable WHERE slot_id = :slot_id AND deletedAt IS NULL LIMIT 1`,
      { replacements: { slot_id }, type: db.Sequelize.QueryTypes.SELECT }
    );

    if (timetableEntry) {
      return res.status(400).json({
        success: false,
        message:
          'Cannot delete time slot as it is already used in timetable schedule',
      });
    }

    const now = new Date();
    await db.sequelize.query(
      `UPDATE time_slot SET deleted_at = :now WHERE slot_id = :slot_id`,
      { replacements: { slot_id, now }, type: db.Sequelize.QueryTypes.UPDATE }
    );

    res.status(200).json({
      success: true,
      message: 'Time slot deleted successfully',
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors || error.issues,
      });
    }
    console.error('Error in deleteTimeSlot:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

/**
 * Restore soft deleted time slot
 */
const restoreTimeSlot = async (req, res) => {
  try {
    const { slot_id } = slotIdParamSchema.parse(req.params);

    const [timeSlot] = await db.sequelize.query(
      `SELECT slot_id FROM time_slot WHERE slot_id = :slot_id AND deleted_at IS NOT NULL`,
      {
        replacements: { slot_id },
        type: db.Sequelize.QueryTypes.SELECT,
      }
    );

    if (!timeSlot) {
      return res.status(404).json({
        success: false,
        message: 'Deleted time slot not found',
      });
    }

    await db.sequelize.query(
      `UPDATE time_slot SET deleted_at = NULL WHERE slot_id = :slot_id`,
      { replacements: { slot_id }, type: db.Sequelize.QueryTypes.UPDATE }
    );

    res.status(200).json({
      success: true,
      message: 'Time slot restored successfully',
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors || error.issues,
      });
    }
    console.error('Error in restoreTimeSlot:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

/**
 * Permanently delete time slot
 */
const permanentDeleteTimeSlot = async (req, res) => {
  try {
    const { slot_id } = slotIdParamSchema.parse(req.params);

    const [timeSlot] = await db.sequelize.query(
      `SELECT slot_id FROM time_slot WHERE slot_id = :slot_id`,
      {
        replacements: { slot_id },
        type: db.Sequelize.QueryTypes.SELECT,
      }
    );

    if (!timeSlot) {
      return res.status(404).json({
        success: false,
        message: 'Time slot not found',
      });
    }

    await db.sequelize.query(`DELETE FROM time_slot WHERE slot_id = :slot_id`, {
      replacements: { slot_id },
      type: db.Sequelize.QueryTypes.DELETE,
    });

    res.status(200).json({
      success: true,
      message: 'Time slot permanently deleted successfully',
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors || error.issues,
      });
    }
    console.error('Error in permanentDeleteTimeSlot:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

module.exports = {
  getAllTimeSlots,
  getTimeSlotById,
  getTimeSlotsByEvent,
  createTimeSlot,
  bulkCreateTimeSlots,
  updateTimeSlot,
  deleteTimeSlot,
  restoreTimeSlot,
  permanentDeleteTimeSlot,
};
