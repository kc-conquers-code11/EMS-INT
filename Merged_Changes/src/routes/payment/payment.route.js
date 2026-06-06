// src/routes/payment/payment.route.js
const express = require('express');
const router = express.Router();
const { validate } = require('../../middlewares/validate.js');
const {
  createOrderSchema,
  verifyPaymentSchema,
  paymentStatusSchema,
  paymentHistorySchema,
  paymentHistoryQuerySchema,
  receiptParamSchema,
} = require('../../validations/payment/payment.validations.js');

const {
  createOrder,
  verifyPayment,
  getPaymentStatus,
  getStudentPaymentHistory,
  getTransactionByOrderId,
  getPaymentHistory,
  downloadReceipt,
} = require('../../controllers/payment/payment.controller.js');
// Auth + requireStudent applied at app mount (/api/v1/payments)

// Create Razorpay order
router.post('/create-order', validate(createOrderSchema, 'body'), createOrder);

// Verify payment
router.post('/verify-payment', validate(verifyPaymentSchema, 'body'), verifyPayment);

// Get payment status by transaction ID
router.get('/status/:txn_id', validate(paymentStatusSchema, 'params'), getPaymentStatus);

// Get payment history by student ID
router.get('/student/:sid/history', getStudentPaymentHistory);

// Get transaction by Razorpay order ID
router.get('/order/:order_id', getTransactionByOrderId);

// Get detailed payment history by student ID
router.get(
  '/history/:studentId',
  validate(paymentHistorySchema, 'params'),
  validate(paymentHistoryQuerySchema, 'query'),
  getPaymentHistory
);

// Download payment receipt by transaction ID
router.get('/receipt/:txn_id', validate(receiptParamSchema, 'params'), downloadReceipt);

module.exports = router;
