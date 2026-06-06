const dotenv = require('dotenv');

dotenv.config();

const db = require('../models');

const { verifyEmailTransport } = require('./services/email.service.js');
const app = require('./app.js');

const PORT = process.env.PORT || 5000;
const ENV = process.env.NODE_ENV || 'development';

async function ensureProfilePhotoColumns() {
  for (const table of ['faculty', 'hod']) {
    const [columns] = await db.sequelize.query(
      `SELECT DATA_TYPE, CHARACTER_MAXIMUM_LENGTH
       FROM INFORMATION_SCHEMA.COLUMNS
       WHERE TABLE_SCHEMA = DATABASE()
         AND TABLE_NAME = ?
         AND COLUMN_NAME = 'profile_photo'`,
      { replacements: [table] }
    );

    if (columns.length === 0) continue;

    const dataType = String(columns[0].DATA_TYPE || '').toLowerCase();
    if (dataType !== 'longtext') {
      await db.sequelize.query(
        `ALTER TABLE \`${table}\`
         MODIFY COLUMN profile_photo LONGTEXT NULL
         COMMENT 'Base64 or file path for profile photo'`
      );
      console.log(`✅ Expanded ${table}.profile_photo to LONGTEXT`);
    }
  }
}

async function ensurePasswordEncryptedColumn() {
  const [columns] = await db.sequelize.query(
    `SELECT COLUMN_NAME
     FROM INFORMATION_SCHEMA.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME = 'users'
       AND COLUMN_NAME = 'password_encrypted'`
  );

  if (columns.length === 0) {
    await db.sequelize.query(
      `ALTER TABLE users
       ADD COLUMN password_encrypted VARCHAR(512) NULL
       COMMENT 'AES-GCM encrypted recoverable password (server-side only)'`
    );
    console.log('✅ Added users.password_encrypted column');
  }
}

async function startServer() {
  try {
    await db.sequelize.authenticate();
    console.log('✅ Database connected');

    await verifyEmailTransport();
    if (ENV === 'development') {
      await db.sequelize.sync({ alter: true });
      console.log('✅ Models synced (alter:true — disable in production)');
    }

    await ensurePasswordEncryptedColumn();
    await ensureProfilePhotoColumns();


    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running in [${ENV}] mode on port ${PORT}`);
    });

    const shutdown = async (signal) => {
      console.log(`${signal} received, shutting down...`);
      server.close(async () => {
        await db.sequelize.close();
        console.log('✅ Server and DB closed');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  } catch (error) {
    console.error('❌ Server startup failed:', error);
    process.exit(1);
  }
}

if (ENV !== 'test') {
  startServer();
}

module.exports = app;
