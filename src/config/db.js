const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

const dbName =
  process.env.NODE_ENV === 'test'
    ? process.env.TEST_DB_NAME || 'test_ems'
    : process.env.DB_NAME;

const sequelize = new Sequelize(
  dbName,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    logging: false,
  }
);

module.exports = sequelize;
