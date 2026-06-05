// src/controllers/payment/payment.controller.js
const {
  createOrderService,
  verifyPaymentService,
  getPaymentStatusService,
  getStudentPaymentHistoryService,
  getTransactionByOrderIdService,
  getPaymentHistoryService,
  generateReceiptService,
} = require('../../services/payment/payment.service.js');

// Create Razorpay Order
const createOrder = async (req, res) => {
  try {
    const result = await createOrderService(req.body);
    res.status(200).json({
      success: true,
      data: result,
      message: 'Order created successfully',
    });
  } catch (error) {
    if (error.transaction) {
      return res.status(400).json({
        success: false,
        message: error.message,
        transaction: error.transaction,
      });
    }

    if (error.message === 'Exam registration not found') {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    console.error('Error in createOrder:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create order',
      error: error.description || error.message,
    });
  }
};

// Verify Payment
const verifyPayment = async (req, res) => {
  try {
    const result = await verifyPaymentService(req.body);

    res.status(200).json({
      success: true,
      data: result,
      message: 'Payment verified successfully',
    });
  } catch (error) {
    if (error.message === 'Invalid payment signature') {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment signature',
        error: 'Payment verification failed',
      });
    }

    if (error.message === 'Transaction not found') {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    console.error('Error in verifyPayment:', error);
    res.status(500).json({
      success: false,
      message: 'Payment verification failed',
      error: error.message,
    });
  }
};

// Get Payment Status
const getPaymentStatus = async (req, res) => {
  try {
    const transaction = await getPaymentStatusService(req.params.txn_id);

    res.status(200).json({
      success: true,
      data: transaction,
      message: 'Payment status retrieved successfully',
    });
  } catch (error) {
    if (error.message === 'Transaction not found') {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    console.error('Error in getPaymentStatus:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

// Get Payment History by Student
const getStudentPaymentHistory = async (req, res) => {
  try {
    const { sid } = req.params;
    const { page, limit } = req.query;

    const result = await getStudentPaymentHistoryService(sid, page, limit);

    res.status(200).json({
      success: true,
      ...result,
      message: 'Payment history retrieved successfully',
    });
  } catch (error) {
    console.error('Error in getStudentPaymentHistory:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

// Get Transaction by Razorpay Order ID
const getTransactionByOrderId = async (req, res) => {
  try {
    const { order_id } = req.params;

    const transaction = await getTransactionByOrderIdService(order_id);

    res.status(200).json({
      success: true,
      data: transaction,
      message: 'Transaction retrieved successfully',
    });
  } catch (error) {
    if (error.message === 'Transaction not found') {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    console.error('Error in getTransactionByOrderId:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

// Get Payment History (detailed with view)
const getPaymentHistory = async (req, res) => {
  try {
    const result = await getPaymentHistoryService(req.params.studentId, req.query);

    res.status(200).json({
      success: true,
      ...result,
      message: 'Payment history retrieved successfully',
    });
  } catch (error) {
    console.error('Error in getPaymentHistory:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

// Download Fee Receipt
const downloadReceipt = async (req, res) => {
  try {
    const { receiptPath, receiptName } = await generateReceiptService(req.params.txn_id);

    return res.download(receiptPath, receiptName, (err) => {
      if (err) {
        console.error("Error pushing file to client:", err);
        if (!res.headersSent) {
          res.status(500).json({ success: false, message: 'File transfer failed' });
        }
      }
    });
  } catch (error) {
    if (error.message === 'Transaction not found') {
      return res.status(404).json({ success: false, message: error.message });
    }
    
    if (error.message === 'Receipt can only be generated for successful payments') {
      return res.status(400).json({ success: false, message: error.message });
    }

    console.error('Error in downloadReceipt:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate receipt',
      error: error.message,
    });
  }
};

module.exports = {
  createOrder,
  verifyPayment,
  getPaymentStatus,
  getStudentPaymentHistory,
  getTransactionByOrderId,
  getPaymentHistory,
  downloadReceipt,
};
