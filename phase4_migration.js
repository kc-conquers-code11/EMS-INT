const db = require('./models');

async function migrate() {
  try {
    // Add is_approved, approved_by, approved_at to marks_entry
    try {
      await db.sequelize.query(`
        ALTER TABLE marks_entry 
        ADD COLUMN is_approved BOOLEAN DEFAULT 0,
        ADD COLUMN approved_by CHAR(36) NULL,
        ADD COLUMN approved_at DATETIME NULL;
      `);
      console.log("marks_entry altered successfully: Added is_approved, approved_by, approved_at.");
    } catch (e) {
      console.log('Columns might already exist.', e.message);
    }

    console.log("Phase 4 schema migration complete.");
  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    process.exit();
  }
}

migrate();
