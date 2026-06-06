const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'user_auth_token',
    {
      auth_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      token: {
        type: DataTypes.TEXT('LONG'),
        allowNull: false,
        comment: 'The full JWT token',
      },
      token_hash: {
        type: DataTypes.STRING(64),
        allowNull: false,
        comment: 'SHA-256 hash of the token for fast, unique lookups',
      },
      expires_at: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'When this token expires — used for cleanup and validation',
      },
      user_type: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      login_time: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      uid: {
        type: DataTypes.UUID,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: 'user_auth_token',
      timestamps: true,
      paranoid: false,
      indexes: [
        {
          name: 'PRIMARY',
          unique: true,
          using: 'BTREE',
          fields: [{ name: 'auth_id' }],
        },
        {
          name: 'idx_user_auth_token_hash',
          unique: true,
          using: 'BTREE',
          fields: [{ name: 'token_hash' }],
        },
        {
          name: 'idx_user_auth_token_uid',
          using: 'BTREE',
          fields: [{ name: 'uid' }],
        },
        {
          name: 'idx_user_auth_token_expires_at',
          using: 'BTREE',
          fields: [{ name: 'expires_at' }],
        },
      ],
    }
  );
};
