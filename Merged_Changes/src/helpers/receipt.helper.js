// src/helpers/receipt_helper.js
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
const { getReceiptTemplate } = require('../templates/receiptTemplate'); // Adjust path as needed

const { z } = require('zod');

const txnDataSchema = z.object({
  txn_id: z.string(),
  sid: z.string(),
  event_name: z.string().optional(),
  amount: z.union([z.string(), z.number()]).optional(),
  payment_mode: z.string().optional(),
  razorpay_payment_id: z.string().optional(),
  paid_at: z.union([z.string(), z.date()]).optional(),
});

const generateReceipt = async (txnData) => {
  try {
    const validatedData = txnDataSchema.parse(txnData);
    const { sid } = validatedData;

    // Update txnData to validatedData for template
    txnData = validatedData;

    // 1. Ensure directory exists using process.cwd() to target the root of your project dynamically
    const dir = path.join(process.cwd(), 'uploads', 'exam', 'fees', String(sid));
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // 2. Define File Paths
    const fileName = `exam_receipt.pdf`;
    const filePath = path.join(dir, fileName);

    // 3. Get HTML Content
    const htmlContent = getReceiptTemplate(txnData);

    // 4. Generate PDF with Puppeteer
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    
    await page.pdf({
      path: filePath,
      format: 'A4',
      printBackground: true, // Ensures CSS backgrounds (like the watermark) are printed
      margin: { top: '20px', right: '20px', bottom: '20px', left: '20px' }
    });

    await browser.close();

    // 5. Return stats for the database
    const stats = fs.statSync(filePath);
    return {
      filePath,
      fileName,
      fileSizeKb: Math.round(stats.size / 1024),
    };
  } catch (error) {
    console.error('Error in generateReceipt:', error);
    throw error;
  }
};

module.exports = {
  generateReceipt,
};
