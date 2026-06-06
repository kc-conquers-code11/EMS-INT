const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  const VPaymentHistory = sequelize.define('v_payment_history', {
    txn_id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true
    },
    exam_reg_id: {
      type: DataTypes.UUID,
      allowNull: true
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    payment_mode: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    txn_status: {
      type: DataTypes.ENUM('initiated','pending', 'success', 'failed'),
      allowNull: true
    },
    razorpay_order_id: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    razorpay_payment_id: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    paid_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    sid: {
      type: DataTypes.UUID,
      allowNull: true
    },
    reg_status: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    event_id: {
      type: DataTypes.UUID,
      allowNull: true
    },
    event_name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    exam_type: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    fee_regular: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    fee_backlog: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    student_name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    student_email: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'v_payment_history',
    timestamps: true,
    paranoid: false,
    sync: { force: false }
  });

  VPaymentHistory.createView = async function() {
    await sequelize.query(`
      CREATE OR REPLACE VIEW v_payment_history AS
      SELECT
        ft.txn_id, ft.exam_reg_id, ft.amount, ft.payment_mode,
        ft.txn_status, ft.razorpay_order_id, ft.razorpay_payment_id,
        ft.paid_at, ft.createdAt, ft.updatedAt,
        er.sid, er.reg_status,
        ee.event_id, ee.event_name, ee.exam_type,
        ee.fee_regular, ee.fee_backlog,
        pd.name AS student_name, pd.email AS student_email
      FROM fee_transaction ft
      JOIN exam_registration er ON ft.exam_reg_id = er.exam_reg_id
      JOIN exam_event ee ON er.event_id = ee.event_id
      LEFT JOIN students s ON er.sid = s.sid
      LEFT JOIN student_personaldetails pd ON s.sid = pd.stud_id
      WHERE ft.deletedAt IS NULL;
    `);
  };

  return VPaymentHistory;
};
