// src/services/payment/payment.service.js
const Razorpay = require('razorpay');
const crypto = require('crypto');
const db = require('../../../models');
const { generateReceipt } = require('../../helpers/receipt.helper.js');
const fs = require('fs');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const createOrderService = async (data) => {
  const { exam_reg_id, amount, currency } = data;

  // Check if exam registration exists
  const examRegistration = await db.sequelize.query(
    `SELECT er.*, ee.event_name, ee.fee_regular, ee.fee_backlog 
     FROM exam_registration er
     JOIN exam_event ee ON er.event_id = ee.event_id
     WHERE er.exam_reg_id = :exam_reg_id AND er.reg_status != 'cancelled'`,
    {
      replacements: { exam_reg_id },
      type: db.Sequelize.QueryTypes.SELECT,
    }
  );

  if (!examRegistration || examRegistration.length === 0) {
    throw new Error('Exam registration not found');
  }

  // Check if payment already exists for this registration
  const existingTransaction = await db.sequelize.query(
    `SELECT * FROM fee_transaction 
     WHERE exam_reg_id = :exam_reg_id 
     AND txn_status = 'success'
     AND deletedAt IS NULL`,
    {
      replacements: { exam_reg_id },
      type: db.Sequelize.QueryTypes.SELECT,
    }
  );

  if (existingTransaction && existingTransaction.length > 0) {
    const error = new Error('Payment already completed for this registration');
    error.transaction = existingTransaction[0];
    throw error;
  }

  // Check for pending transaction
  const pendingTransaction = await db.sequelize.query(
    `SELECT * FROM fee_transaction 
     WHERE exam_reg_id = :exam_reg_id 
     AND txn_status IN ('pending', 'initiated')
     AND deletedAt IS NULL`,
    {
      replacements: { exam_reg_id },
      type: db.Sequelize.QueryTypes.SELECT,
    }
  );

  // If pending transaction exists, you can either reuse or create new
  if (pendingTransaction && pendingTransaction.length > 0) {
    // Optional: Delete old pending transaction
    await db.sequelize.query(
      `DELETE FROM fee_transaction WHERE txn_id = :txn_id`,
      {
        replacements: { txn_id: pendingTransaction[0].txn_id },
        type: db.Sequelize.QueryTypes.DELETE,
      }
    );
  }

  // Create Razorpay Order
  const shortId = exam_reg_id.substring(0, 8);
  const receipt = `EXAM_${shortId}_${Date.now()}`;
  const order = await razorpay.orders.create({
    amount: Math.round(amount * 100), // Convert to paise
    currency: currency,
    receipt: receipt,
    notes: {
      exam_reg_id: exam_reg_id,
      exam_event: examRegistration[0].event_name,
    },
  });

  // Create fee transaction record
  const txn_id = crypto.randomUUID();
  const now = new Date();

  await db.sequelize.query(
    `INSERT INTO fee_transaction (
      txn_id, exam_reg_id, amount, razorpay_order_id, 
      txn_status, payment_mode, createdAt, updatedAt
    ) VALUES (
      :txn_id, :exam_reg_id, :amount, :razorpay_order_id,
      'initiated', 'razorpay', :now, :now
    )`,
    {
      replacements: {
        txn_id,
        exam_reg_id,
        amount,
        razorpay_order_id: order.id,
        now,
      },
      type: db.Sequelize.QueryTypes.INSERT,
    }
  );

  return {
    id: order.id,
    amount: order.amount,
    currency: order.currency,
    receipt: order.receipt,
    txn_id: txn_id,
    key_id: process.env.RAZORPAY_KEY_ID,
  };
};

const verifyPaymentService = async (data) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    exam_reg_id,
  } = data;

  // Generate expected signature
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');

  // Verify signature
  const isValid = expectedSignature === razorpay_signature;

  if (!isValid) {
    throw new Error('Invalid payment signature');
  }

  // Find the transaction
  let transactionQuery = `
    SELECT * FROM fee_transaction 
    WHERE razorpay_order_id = :razorpay_order_id 
    AND deletedAt IS NULL
  `;
  const replacements = { razorpay_order_id };

  if (exam_reg_id) {
    transactionQuery += ` AND exam_reg_id = :exam_reg_id`;
    replacements.exam_reg_id = exam_reg_id;
  }

  const transaction = await db.sequelize.query(transactionQuery, {
    replacements,
    type: db.Sequelize.QueryTypes.SELECT,
  });

  if (!transaction || transaction.length === 0) {
    throw new Error('Transaction not found');
  }

  // Update transaction status
  const now = new Date();
  await db.sequelize.query(
    `UPDATE fee_transaction 
     SET txn_status = 'success', 
         razorpay_payment_id = :razorpay_payment_id,
         razorpay_signature = :razorpay_signature,
         paid_at = :now,
         updatedAt = :now
     WHERE txn_id = :txn_id`,
    {
      replacements: {
        razorpay_payment_id,
        razorpay_signature,
        now,
        txn_id: transaction[0].txn_id,
      },
      type: db.Sequelize.QueryTypes.UPDATE,
    }
  );

  // Update exam registration status
  if (transaction[0].exam_reg_id) {
    await db.sequelize.query(
      `UPDATE exam_registration 
       SET reg_status = 'confirmed', 
           updatedAt = :now 
       WHERE exam_reg_id = :exam_reg_id`,
      {
        replacements: {
          exam_reg_id: transaction[0].exam_reg_id,
          now,
        },
        type: db.Sequelize.QueryTypes.UPDATE,
      }
    );
  }

  // Fetch updated transaction
  const [updatedTransaction] = await db.sequelize.query(
    `SELECT ft.*, er.sid, er.event_id, ee.event_name
     FROM fee_transaction ft
     LEFT JOIN exam_registration er ON ft.exam_reg_id = er.exam_reg_id
     LEFT JOIN exam_event ee ON er.event_id = ee.event_id
     WHERE ft.txn_id = :txn_id`,
    {
      replacements: { txn_id: transaction[0].txn_id },
      type: db.Sequelize.QueryTypes.SELECT,
    }
  );

  return {
    transaction: updatedTransaction,
    payment_id: razorpay_payment_id,
    order_id: razorpay_order_id,
  };
};

const getPaymentStatusService = async (txn_id) => {
  const [transaction] = await db.sequelize.query(
    `SELECT ft.*, er.sid, er.event_id, ee.event_name
     FROM fee_transaction ft
     LEFT JOIN exam_registration er ON ft.exam_reg_id = er.exam_reg_id
     LEFT JOIN exam_event ee ON er.event_id = ee.event_id
     WHERE ft.txn_id = :txn_id AND ft.deletedAt IS NULL`,
    {
      replacements: { txn_id },
      type: db.Sequelize.QueryTypes.SELECT,
    }
  );

  if (!transaction) {
    throw new Error('Transaction not found');
  }

  return transaction;
};

const getStudentPaymentHistoryService = async (sid, page = 1, limit = 10) => {
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const offset = (pageNum - 1) * limitNum;

  const [countResult] = await db.sequelize.query(
    `SELECT COUNT(*) as total 
     FROM fee_transaction ft
     JOIN exam_registration er ON ft.exam_reg_id = er.exam_reg_id
     WHERE er.sid = :sid 
     AND ft.txn_status = 'success'
     AND ft.deletedAt IS NULL`,
    {
      replacements: { sid },
      type: db.Sequelize.QueryTypes.SELECT,
    }
  );

  const transactions = await db.sequelize.query(
    `SELECT ft.*, er.event_id, ee.event_name, ee.exam_type
     FROM fee_transaction ft
     JOIN exam_registration er ON ft.exam_reg_id = er.exam_reg_id
     JOIN exam_event ee ON er.event_id = ee.event_id
     WHERE er.sid = :sid 
     AND ft.txn_status = 'success'
     AND ft.deletedAt IS NULL
     ORDER BY ft.paid_at DESC
     LIMIT :limit OFFSET :offset`,
    {
      replacements: { sid, limit: limitNum, offset },
      type: db.Sequelize.QueryTypes.SELECT,
    }
  );

  return {
    total: parseInt(countResult.total),
    page: pageNum,
    totalPages: Math.ceil(parseInt(countResult.total) / limitNum),
    data: transactions,
  };
};

const getTransactionByOrderIdService = async (order_id) => {
  const [transaction] = await db.sequelize.query(
    `SELECT ft.*, er.sid, er.event_id, ee.event_name
     FROM fee_transaction ft
     LEFT JOIN exam_registration er ON ft.exam_reg_id = er.exam_reg_id
     LEFT JOIN exam_event ee ON er.event_id = ee.event_id
     WHERE ft.razorpay_order_id = :order_id AND ft.deletedAt IS NULL`,
    {
      replacements: { order_id },
      type: db.Sequelize.QueryTypes.SELECT,
    }
  );

  if (!transaction) {
    throw new Error('Transaction not found');
  }

  return transaction;
};

const getPaymentHistoryService = async (studentId, query) => {
  const { page, limit, status, exam_type } = query;
  const offset = (page - 1) * limit;

  let baseQuery = `FROM v_payment_history WHERE sid = :studentId`;
  let replacements = { studentId, limit, offset };

  if (status !== 'all') {
    baseQuery += ` AND txn_status = :status`;
    replacements.status = status;
  }

  if (exam_type) {
    baseQuery += ` AND exam_type = :exam_type`;
    replacements.exam_type = exam_type;
  }

  const [countResult] = await db.sequelize.query(
    `SELECT COUNT(*) as total, SUM(amount) as total_paid, MAX(paid_at) as last_payment ${baseQuery}`,
    { replacements, type: db.Sequelize.QueryTypes.SELECT }
  );

  const transactions = await db.sequelize.query(
    `SELECT * ${baseQuery} ORDER BY paid_at DESC, createdAt DESC LIMIT :limit OFFSET :offset`,
    { replacements, type: db.Sequelize.QueryTypes.SELECT }
  );

  return {
    total: parseInt(countResult.total || 0),
    page,
    totalPages: Math.ceil(parseInt(countResult.total || 0) / limit),
    data: transactions,
    summary: {
      total_paid: parseFloat(countResult.total_paid || 0),
      count: parseInt(countResult.total || 0),
      last_payment: countResult.last_payment,
    },
  };
};

const generateReceiptService = async (txn_id) => {
  // Fetch transaction
  const [transaction] = await db.sequelize.query(
    `SELECT ft.*, s.stud_clg_id AS sid, ee.event_name 
     FROM fee_transaction ft
     JOIN exam_registration er ON ft.exam_reg_id = er.exam_reg_id
     JOIN exam_event ee ON er.event_id = ee.event_id
     JOIN students s ON er.sid = s.sid
     WHERE ft.txn_id = :txn_id AND ft.deletedAt IS NULL`,
    {
      replacements: { txn_id },
      type: db.Sequelize.QueryTypes.SELECT,
    }
  );

  if (!transaction) {
    throw new Error('Transaction not found');
  }

  if (transaction.txn_status !== 'success') {
    throw new Error('Receipt can only be generated for successful payments');
  }

  // Check if receipt exists
  const [existingReceipt] = await db.sequelize.query(
    `SELECT * FROM fee_receipt WHERE txn_id = :txn_id AND deletedAt IS NULL`,
    {
      replacements: { txn_id },
      type: db.Sequelize.QueryTypes.SELECT,
    }
  );

  let receiptPath = '';
  let receiptName = '';

  if (existingReceipt && fs.existsSync(existingReceipt.file_path)) {
    receiptPath = existingReceipt.file_path;
    receiptName = existingReceipt.file_name;
  } else {
    // Generate new receipt
    const receiptData = await generateReceipt(transaction);
    receiptPath = receiptData.filePath;
    receiptName = receiptData.fileName;
    const receipt_id = crypto.randomUUID();
    const now = new Date();

    if (existingReceipt) {
      await db.sequelize.query(
        `UPDATE fee_receipt 
         SET file_path = :file_path, file_name = :file_name, file_size_kb = :file_size_kb, updatedAt = :now 
         WHERE receipt_id = :receipt_id`,
        {
          replacements: {
            file_path: receiptData.filePath,
            file_name: receiptData.fileName,
            file_size_kb: receiptData.fileSizeKb,
            now,
            receipt_id: existingReceipt.receipt_id,
          },
          type: db.Sequelize.QueryTypes.UPDATE,
        }
      );
    } else {
      await db.sequelize.query(
        `INSERT INTO fee_receipt (receipt_id, txn_id, sid, file_path, file_name, file_size_kb, generated_at, createdAt, updatedAt) 
         VALUES (:receipt_id, :txn_id, :sid, :file_path, :file_name, :file_size_kb, :now, :now, :now)`,
        {
          replacements: {
            receipt_id,
            txn_id,
            sid: transaction.sid,
            file_path: receiptData.filePath,
            file_name: receiptData.fileName,
            file_size_kb: receiptData.fileSizeKb,
            now,
          },
          type: db.Sequelize.QueryTypes.INSERT,
        }
      );
    }
  }

  return { receiptPath, receiptName };
};

module.exports = {
  createOrderService,
  verifyPaymentService,
  getPaymentStatusService,
  getStudentPaymentHistoryService,
  getTransactionByOrderIdService,
  getPaymentHistoryService,
  generateReceiptService,
};
