// src/templates/receiptTemplate.js

const getReceiptTemplate = (data) => {
  const {
    txn_id,
    sid,
    event_name,
    amount,
    payment_mode,
    razorpay_payment_id,
    paid_at,
  } = data;

  const shortId = txn_id ? txn_id.substring(0, 8).toUpperCase() : 'N/A';
  const formattedAmount = amount ? `Rs ${parseFloat(amount).toFixed(2)}` : 'Rs 0.00';
  const formattedDate = paid_at ? new Date(paid_at).toLocaleString() : 'N/A';

  return `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: 'Helvetica', Arial, sans-serif; margin: 0; padding: 40px; color: #333; }
            .watermark {
                position: absolute; top: 30%; left: 25%;
                font-size: 120px; color: rgba(200, 200, 200, 0.2);
                transform: rotate(-45deg); z-index: -1;
            }
            .header { text-align: center; margin-bottom: 40px; }
            .header h1 { margin: 0; font-size: 24px; color: #222; }
            .header h2 { margin: 5px 0 0 0; font-size: 18px; color: #555; font-weight: normal; }
            .content { border-top: 2px solid #333; padding-top: 20px; }
            .content h3 { font-size: 16px; margin-bottom: 20px; }
            .row { display: flex; margin-bottom: 15px; font-size: 14px; }
            .label { width: 150px; font-weight: bold; }
            .value { flex: 1; }
            .footer { text-align: center; margin-top: 60px; font-size: 12px; font-style: italic; color: #777; }
        </style>
    </head>
    <body>
        <div class="watermark">PAID</div>
        
        <div class="header">
            <h1>Institution Name</h1>
            <h2>Fee Receipt</h2>
        </div>

        <div class="content">
            <h3>Receipt Details</h3>
            
            <div class="row">
                <div class="label">Receipt No:</div>
                <div class="value">${shortId}</div>
            </div>
            <div class="row">
                <div class="label">Student ID:</div>
                <div class="value">${sid || 'N/A'}</div>
            </div>
            <div class="row">
                <div class="label">Event Name:</div>
                <div class="value">${event_name || 'N/A'}</div>
            </div>
            <div class="row">
                <div class="label">Amount:</div>
                <div class="value">${formattedAmount}</div>
            </div>
            <div class="row">
                <div class="label">Payment Mode:</div>
                <div class="value">${payment_mode || 'N/A'}</div>
            </div>
            <div class="row">
                <div class="label">Payment ID:</div>
                <div class="value">${razorpay_payment_id || 'N/A'}</div>
            </div>
            <div class="row">
                <div class="label">Payment Date:</div>
                <div class="value">${formattedDate}</div>
            </div>
        </div>

        <div class="footer">
            This is a computer-generated receipt and does not require a physical signature.
        </div>
    </body>
    </html>
  `;
};

module.exports = { getReceiptTemplate };