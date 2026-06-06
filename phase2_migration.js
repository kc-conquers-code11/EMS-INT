const db = require('./models');

async function migrate() {
  try {
    // 1. Alter attendance_record
    await db.sequelize.query(`
      ALTER TABLE attendance_record
      MODIFY COLUMN seating_id CHAR(36) NULL,
      MODIFY COLUMN submitted_by CHAR(36) NULL;
    `);
    console.log("attendance_record altered successfully.");

    // 2. Alter copy_case
    await db.sequelize.query(`
      ALTER TABLE copy_case
      MODIFY COLUMN sid CHAR(36) NULL,
      MODIFY COLUMN timetable_id CHAR(36) NULL,
      MODIFY COLUMN room_id CHAR(36) NULL,
      MODIFY COLUMN supervisor_id CHAR(36) NULL,
      ADD COLUMN seating_id CHAR(36) NULL AFTER case_id;
    `);
    console.log("copy_case altered successfully.");

    console.log("Phase 2 schema migration complete.");
  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    process.exit();
  }
}

migrate();
