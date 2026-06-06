const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'users',
    {
      uid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      user_type: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: 'Nullable for future SSO / OAuth users',
      },
      password_encrypted: {
        type: DataTypes.STRING(512),
        allowNull: true,
        comment: 'AES-GCM encrypted recoverable password (server-side JWT_SECRET only)',
      },

      // Nullable entity links — only one will be set per user
      student_id: {
        type: DataTypes.UUID,
        allowNull: true,
        comment: 'Set when utid resolves to Student type',
      },
      faculty_id: {
        type: DataTypes.UUID,
        allowNull: true,
        comment: 'Set when utid resolves to Faculty type',
      },
      coe_id: {
        type: DataTypes.UUID,
        allowNull: true,
        comment: 'Set when utid resolves to COE type',
      },
      hod_id: {
        type: DataTypes.UUID,
        allowNull: true,
        comment: 'Set when utid resolves to HOD type',
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      last_login: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      deletedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'users',
      timestamps: true,
      paranoid: true,
      indexes: [
        {
          name: 'PRIMARY',
          unique: true,
          using: 'BTREE',
          fields: [{ name: 'uid' }],
        },
        {
          name: 'idx_users_email',
          unique: true,
          using: 'BTREE',
          fields: [{ name: 'email' }],
        },
      ],
    }
  );
};
