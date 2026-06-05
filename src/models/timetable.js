const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'timetable',
    {
      timetable_id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      event_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      mapping_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      exam_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      slot_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      shift: {
        type: DataTypes.STRING(20),
        allowNull: true,
        defaultValue: 'MORNING',
      },
      is_published: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: 0,
      },
      status: {
        type: DataTypes.STRING(30),
        allowNull: true,
        defaultValue: 'scheduled',
      },
      rescheduled_from: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      reschedule_reason: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      venue: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      created_by: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: DataTypes.NOW,
      },
      deletedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null,
      },
    },
    {
      sequelize,
      tableName: 'timetable',
      timestamps: true,
      paranoid: true,
      indexes: [
        {
          name: 'PRIMARY',
          unique: true,
          using: 'BTREE',
          fields: [{ name: 'timetable_id' }],
        },
        {
          name: 'idx_timetable_event',
          using: 'BTREE',
          fields: [{ name: 'event_id' }],
        },
        {
          name: 'idx_timetable_mapping',
          using: 'BTREE',
          fields: [{ name: 'mapping_id' }],
        },
        {
          name: 'idx_timetable_slot',
          using: 'BTREE',
          fields: [{ name: 'slot_id' }],
        },
        {
          name: 'idx_timetable_date',
          using: 'BTREE',
          fields: [{ name: 'exam_date' }],
        },
        {
          name: 'uq_timetable_event_mapping',
          unique: true,
          using: 'BTREE',
          fields: [{ name: 'event_id' }, { name: 'mapping_id' }],
        },
      ],
    }
  );
};