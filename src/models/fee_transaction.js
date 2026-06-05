//src/models/fee_transaction.js
const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'fee_transaction',
    {
      txn_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      exam_reg_id: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },
      payment_mode: {
        type: DataTypes.STRING(30),
        allowNull: true,
      },
      txn_reference: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      txn_status: {
        type: DataTypes.ENUM('initiated','pending', 'success', 'failed'),
        allowNull: true,
        defaultValue: 'pending',
      },
      razorpay_order_id: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      razorpay_payment_id: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      razorpay_signature: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      paid_at: {
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
      tableName: 'fee_transaction',
      timestamps: true,
      paranoid: true,
      indexes: [
        {
          name: 'PRIMARY',
          unique: true,
          using: 'BTREE',
          fields: [{ name: 'txn_id' }],
        },
        {
          name: 'idx_fee_transaction_exam_reg_id',
          // name: 'idx_razorpay_order',
          using: 'BTREE',
          fields: [{ name: 'razorpay_order_id' }],
        },
        {
          name: 'idx_exam_reg',
          using: 'BTREE',
          fields: [{ name: 'exam_reg_id' }],
        },
        {
          name: 'idx_ft_exam_reg_status',
          using: 'BTREE',
          fields: [{ name: 'exam_reg_id' }, { name: 'txn_status' }, { name: 'deletedAt' }, { name: 'paid_at' }],
        },
      ],
    }
  );
};