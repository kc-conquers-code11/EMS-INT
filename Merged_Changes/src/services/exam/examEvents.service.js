const db = require('../../../models');

/**
 * Reschedule an exam event
 */
const rescheduleExamEvent = async (id, payload) => {
  return await db.sequelize.transaction(async (t) => {
    // 1. Verify the exam event exists
    // Using raw SQL query to satisfy the requirement: "Verifies the exam event exists (raw SELECT query — no associations)"
    const [existingEvent] = await db.sequelize.query(
      'SELECT * FROM exam_event WHERE event_id = :id LIMIT 1',
      {
        replacements: { id },
        type: db.Sequelize.QueryTypes.SELECT,
        transaction: t,
      }
    );

    if (!existingEvent) {
      throw { status: 404, message: 'Exam event not found' };
    }

    // 2. Update reschedule_reason, updated_dates, and updatedAt atomically using transaction
    // Using Sequelize model update inside the transaction for safety and automatic JSON handling
    const eventModel = await db.exam_event.findOne({
      where: { event_id: id },
      transaction: t,
    });

    await eventModel.update(
      {
        reschedule_reason: payload.reschedule_reason,
        updated_dates: payload.updated_dates,
      },
      { transaction: t }
    );

    return eventModel.toJSON();
  });
};

module.exports = {
  rescheduleExamEvent,
};
