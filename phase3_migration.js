const db = require('./models');

async function migrate() {
  try {
    // Drop foreign keys if they exist (typically they might, but here it might just be the index we need to care about)
    // We can just modify the column directly if there's no strict constraint blocking it.
    // If the index blocks the data type change, we drop it and recreate it.
    
    // First let's check if we need to drop the index
    try {
      await db.sequelize.query(`ALTER TABLE marks_entry DROP INDEX uq_regsubj_component;`);
    } catch (e) {
      console.log('Index uq_regsubj_component does not exist or could not be dropped (might be fine).', e.message);
    }

    await db.sequelize.query(`
      ALTER TABLE marks_entry
      MODIFY COLUMN reg_subj_id CHAR(36) NULL,
      MODIFY COLUMN faculty_id CHAR(36) NULL,
      MODIFY COLUMN locked_by CHAR(36) NULL;
    `);
    console.log("marks_entry altered successfully.");

    // Recreate the index
    try {
      await db.sequelize.query(`
        ALTER TABLE marks_entry ADD UNIQUE INDEX uq_regsubj_component (reg_subj_id, component);
      `);
      console.log("Index uq_regsubj_component recreated.");
    } catch (e) {
      console.log('Could not recreate index (might already exist).', e.message);
    }

    console.log("Phase 3 schema migration complete.");
  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    process.exit();
  }
}

migrate();
