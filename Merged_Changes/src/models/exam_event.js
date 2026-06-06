// models/exam_event.js
const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'exam_event',
    {
      event_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      institution_id: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      academic_id: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      semester_id: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      event_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      exam_type: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      exam_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      exam_time: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      reg_start: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      reg_end: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      fee_regular: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: 0.0,
      },
      fee_backlog: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: 0.0,
      },
      // New fields for late registration
      late_reg_allowed: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      late_reg_deadline: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      late_reg_fee: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: 0.00,
      },
      late_reg_max_days: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
        comment: 'Maximum days allowed after regular deadline',
      },
      pattern_id: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      is_published: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: 0,
      },
      status: {
        type: DataTypes.STRING(30),
        allowNull: true,
        defaultValue: 'draft',
        comment: 'draft, published, closed, cancelled',
      },
      created_by: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      reschedule_reason: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      updated_dates: {
        type: DataTypes.JSON,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'exam_event',
      timestamps: true,
      paranoid: true,
      indexes: [
        {
          name: 'PRIMARY',
          unique: true,
          using: 'BTREE',
          fields: [{ name: 'event_id' }],
        },
        {
          name: 'fk_exam_event_institution',
          using: 'BTREE',
          fields: [{ name: 'institution_id' }],
        },
        {
          name: 'fk_exam_event_academic',
          using: 'BTREE',
          fields: [{ name: 'academic_id' }],
        },
        {
          name: 'fk_exam_event_semester',
          using: 'BTREE',
          fields: [{ name: 'semester_id' }],
        },
        {
          name: 'idx_exam_event_late_reg',
          using: 'BTREE',
          fields: [{ name: 'late_reg_allowed' }, { name: 'late_reg_deadline' }],
        },
      ],
    }
  );
};