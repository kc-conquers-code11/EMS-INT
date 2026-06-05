// models/otp_log.js
const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'otp_log',
    {
      otp_id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      uid: {
        type: DataTypes.UUID,  // Changed to UUID to match users.uid
        allowNull: true,
      },
      purpose: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      otp_hash: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      expires_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      is_used: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: 0,
      },
      attempts: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'otp_log',
      timestamps: true,
      indexes: [
        {
          name: 'PRIMARY',
          unique: true,
          using: 'BTREE',
          fields: [{ name: 'otp_id' }],
        },
        {
          name: 'idx_otp_log_email_purpose',
          using: 'BTREE',
          fields: [{ name: 'email' }, { name: 'purpose' }],
        },
      ],
    }
  );
};