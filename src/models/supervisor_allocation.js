const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'supervisor_allocation',
    {
      duty_id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      timetable_id: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      room_id: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      faculty_id: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      duty_status: {
        type: DataTypes.STRING(30),
        allowNull: true,
        defaultValue: 'assigned',
      },
      assigned_at: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: DataTypes.NOW,
      },
      accepted_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      remarks: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      tableName: 'supervisor_allocation',
      timestamps: false,
      indexes: [
        {
          name: 'PRIMARY',
          unique: true,
          using: 'BTREE',
          fields: [{ name: 'duty_id' }],
        },
        {
          name: 'idx_supervisor_faculty_id',
          using: 'BTREE',
          fields: [{ name: 'faculty_id' }],
        },
        {
          name: 'idx_supervisor_timetable_id',
          using: 'BTREE',
          fields: [{ name: 'timetable_id' }],
        },
        {
          name: 'idx_supervisor_faculty_status',
          using: 'BTREE',
          fields: [{ name: 'faculty_id' }, { name: 'duty_status' }],
        },
        {
          name: 'uq_supervisor_faculty_timetable',
          unique: true,
          using: 'BTREE',
          fields: [{ name: 'faculty_id' }, { name: 'timetable_id' }],
        }
      ],
    }
  );
};
