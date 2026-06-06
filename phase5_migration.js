const db = require('./models');

async function migrate() {
  try {
    // Create revaluation_entry table
    await db.sequelize.query(`
      CREATE TABLE IF NOT EXISTS revaluation_entry (
        reval_id INT AUTO_INCREMENT PRIMARY KEY,
        reg_subj_id CHAR(36) NOT NULL,
        component VARCHAR(30) NOT NULL,
        faculty_id CHAR(36) NOT NULL,
        revised_marks DECIMAL(6,2) NULL,
        is_locked BOOLEAN DEFAULT 0,
        locked_at DATETIME NULL,
        evaluation_remarks TEXT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY uq_reval_regsubj_comp (reg_subj_id, component)
      );
    `);
    
    console.log("revaluation_entry table created successfully.");
  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    process.exit();
  }
}

migrate();
