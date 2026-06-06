// src/validations/payment/payment.validations.js
const { z } = require('zod');

// Create order validation schema
const createOrderSchema = z.object({
  exam_reg_id: z
    .string()
    .uuid('Exam registration ID must be a valid UUID')
    .min(1, 'Exam registration ID is required'),
  amount: z
    .number()
    .positive('Amount must be positive')
    .min(1, 'Amount must be at least 1'),
  currency: z
    .string()
    .length(3, 'Currency must be 3 characters')
    .default('INR'),
});

// Verify payment validation schema
const verifyPaymentSchema = z.object({
  razorpay_order_id: z.string().min(1, 'Razorpay order ID is required'),
  razorpay_payment_id: z.string().min(1, 'Razorpay payment ID is required'),
  razorpay_signature: z.string().min(1, 'Razorpay signature is required'),
  exam_reg_id: z
    .string()
    .uuid('Exam registration ID must be a valid UUID')
    .optional(),
});

// Get payment status validation
const paymentStatusSchema = z.object({
  txn_id: z.string().uuid('Transaction ID must be a valid UUID'),
});

// Payment history validation schemas
const paymentHistorySchema = z.object({ 
  studentId: z.string().uuid('Student ID must be a valid UUID') 
});

const paymentHistoryQuerySchema = z.object({
  page: z.coerce.number().positive().default(1),
  limit: z.coerce.number().positive().max(100).default(10),
  status: z.enum(['success','pending','initiated','failed','all']).optional().default('success'),
  exam_type: z.enum(['regular','backlog']).optional(),
});

// Download receipt validation schema
const receiptParamSchema = z.object({ 
  txn_id: z.uuid('Transaction ID must be a valid UUID') 
});

module.exports = {
  createOrderSchema,
  verifyPaymentSchema,
  paymentStatusSchema,
  paymentHistorySchema,
  paymentHistoryQuerySchema,
  receiptParamSchema,
};
