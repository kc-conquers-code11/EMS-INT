const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'rhr_student',
    {
      rhr_id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      result_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      reason: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      is_resolved: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: 0,
      },
      resolved_by: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      resolved_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'rhr_student',
      timestamps: true,
      indexes: [
        {
          name: 'PRIMARY',
          unique: true,
          using: 'BTREE',
          fields: [{ name: 'rhr_id' }],
        },
      ],
    }
  );
};
