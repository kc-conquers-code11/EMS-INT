// models/exam_registration.js
const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'exam_registration',
    {
      exam_reg_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      sid: {
        type: DataTypes.UUID,
        allowNull: true,
        comment: 'Student ID (UUID from students table)',
      },
      event_id: {
        type: DataTypes.UUID,
        allowNull: true,
        comment: 'Exam event ID (UUID from exam_event table)',
      },
      reg_type: {
        type: DataTypes.STRING(30),
        allowNull: true,
        defaultValue: 'regular',
        comment: 'regular, backlog, improvement, late',
      },
      reg_status: {
        type: DataTypes.STRING(30),
        allowNull: true,
        defaultValue: 'pending',
        comment: 'pending, approved, rejected, payment_pending, completed',
      },
      registered_at: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      // New fields for approval workflow
      approved_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      approved_by: {
        type: DataTypes.UUID,
        allowNull: true,
        comment: 'User UID who approved the registration',
      },
      rejection_reason: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      rejected_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      rejected_by: {
        type: DataTypes.UUID,
        allowNull: true,
        comment: 'User UID who rejected the registration',
      },
      approval_notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      // Fee and payment fields
      fee_amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: 0.00,
      },
      payment_status: {
        type: DataTypes.STRING(30),
        allowNull: true,
        defaultValue: 'pending',
        comment: 'pending, completed, failed, refunded',
      },
      payment_transaction_id: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      payment_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      hall_ticket_hold_override: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      tableName: 'exam_registration',
      timestamps: true,
      indexes: [
        {
          name: 'PRIMARY',
          unique: true,
          using: 'BTREE',
          fields: [{ name: 'exam_reg_id' }],
        },
        {
          name: 'uq_stud_event',
          unique: true,
          using: 'BTREE',
          fields: [{ name: 'sid' }, { name: 'event_id' }],
        },
        {
          name: 'idx_exam_reg_payment_status',
          using: 'BTREE',
          fields: [{ name: 'payment_status' }],
        },
        {
          name: 'idx_exam_reg_approved_by',
          using: 'BTREE',
          fields: [{ name: 'approved_by' }],
        },
        {
          name: 'idx_exam_reg_status',
          using: 'BTREE',
          fields: [{ name: 'reg_status' }],
        },
      ],
    }
  );
};