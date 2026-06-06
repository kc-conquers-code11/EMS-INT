const path = require('path');
const db = require(path.join(__dirname, '../models'));
const { Sequelize } = require('sequelize');

async function migrate() {
  try {
    await db.sequelize.authenticate();
    console.log('Database connected.');

    // Drop and create reval_application table if needed, or simply sync
    await db.reval_application.sync({ alter: true });
    console.log('reval_application table created/altered successfully.');

    // We also need to add reval_application to db.js (models/index.js) if it's dynamic it should pick it up automatically since it reads all .js files
    
    console.log('Migration completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Error in migration:', error);
    process.exit(1);
  }
}

migrate();
