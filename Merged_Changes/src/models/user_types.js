const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'user_types',
    {
      utid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      base: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment:
          "Unique identifier for the user type. For example: 'SuperAdmin', 'Faculty', 'Student', 'COE'",
      },
      deletedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'user_types',
      timestamps: true,
      paranoid: true,
      indexes: [
        {
          name: 'PRIMARY',
          unique: true,
          using: 'BTREE',
          fields: [{ name: 'utid' }],
        },
        {
          name: 'idx_user_types_base',
          unique: true,
          using: 'BTREE',
          fields: [{ name: 'base' }],
        },
      ],
    }
  );
};
