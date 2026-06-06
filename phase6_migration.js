const db = require('./models');

async function migrate() {
  try {
    // Modify case_status column default
    await db.sequelize.query(`
      ALTER TABLE copy_case 
      MODIFY COLUMN case_status VARCHAR(30) DEFAULT 'PENDING';
    `);
    
    // Update existing records
    const [result] = await db.sequelize.query(`
      UPDATE copy_case 
      SET case_status = 'PENDING' 
      WHERE case_status = 'new';
    `);

    console.log("copy_case migration complete. Rows updated:", result.affectedRows);
  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    process.exit();
  }
}

migrate();
