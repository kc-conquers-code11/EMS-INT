const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'attendance_record',
    {
      att_id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      seating_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      is_present: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: 0,
      },
      submitted_by: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      submitted_at: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    },
    {
      sequelize,
      tableName: 'attendance_record',
      timestamps: false,
      indexes: [
        {
          name: 'PRIMARY',
          unique: true,
          using: 'BTREE',
          fields: [{ name: 'att_id' }],
        },
      ],
    }
  );
};
