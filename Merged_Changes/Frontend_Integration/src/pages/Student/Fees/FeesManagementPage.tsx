import React, { useState } from 'react';
import { PendingFeesList } from '../../../components/screens/Student/Fees/PendingFeesList';
import { PaymentHistoryTable } from '../../../components/screens/Student/Fees/PaymentHistoryTable';
import { MockPaymentModal } from '../../../components/screens/Student/Fees/MockPaymentModal';
import type { PendingFeeItem, PaymentHistoryItem } from '../../../types/Student/Fees/fees';

export const FeesManagementPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'Payment Records' | 'Payment History'>('Payment History');
  
  // Pending records
  const [pendingFees, setPendingFees] = useState<PendingFeeItem[]>([
    { id: '1', title: 'Fees paid for final exam', amount: '₹1,500', dueDate: '15 June 2026', type: 'Done' },
    { id: '2', title: 'Fees paid for backlog exam', amount: '₹800', dueDate: '20 June 2026', type: 'Done' },
    { id: '3', title: 'Admission Fees', amount: '₹2,500', dueDate: '10 June 2026', type: 'Pending' },
  ]);

  // Paid history items
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistoryItem[]>([
    { srNo: 1, title: 'Fees paid for revaluation', amount: '₹500', date: '12 May 2026', status: 'Done' },
    { srNo: 2, title: 'Fees paid for Reassessment', amount: '₹350', date: '08 April 2026', status: 'Done' },
    { srNo: 3, title: 'Fees paid for backlog exam', amount: '₹800', date: '15 March 2026', status: 'Done' },
    { srNo: 4, title: 'Fees paid for Final exam', amount: '₹1,200', date: '10 November 2025', status: 'Done' },
  ]);

  // Modal payment states
  const [selectedFee, setSelectedFee] = useState<PendingFeeItem | null>(null);

  const handlePayNow = (fee: PendingFeeItem) => {
    setSelectedFee(fee);
  };

  const handlePaymentSuccess = () => {
    if (!selectedFee) return;
    
    // Mark status to Done
    setPendingFees(prev => prev.map(item => 
      item.id === selectedFee.id ? { ...item, type: 'Done' } : item
    ));
    
    // Add to history
    setPaymentHistory(prev => [
      {
        srNo: prev.length + 1,
        title: selectedFee.title.startsWith('Fees paid') ? selectedFee.title : `Fees paid for ${selectedFee.title.toLowerCase()}`,
        amount: selectedFee.amount,
        date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }),
        status: 'Done'
      },
      ...prev
    ]);
    
    // Close modal
    setSelectedFee(null);
  };

  const downloadReceipt = (item: PaymentHistoryItem) => {
    const receiptNo = `PVPP/REC/${item.srNo * 1024 + 578}`;
    const printWindow = document.createElement('iframe');
    printWindow.style.position = 'fixed';
    printWindow.style.right = '0';
    printWindow.style.bottom = '0';
    printWindow.style.width = '0';
    printWindow.style.height = '0';
    printWindow.style.border = 'none';
    document.body.appendChild(printWindow);

    const receiptHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Receipt - ${receiptNo}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');
          body {
            font-family: 'Inter', sans-serif;
            color: #101828;
            margin: 0;
            padding: 40px;
            background-color: #ffffff;
            -webkit-print-color-adjust: exact;
          }
          .receipt-container {
            max-width: 650px;
            margin: 0 auto;
            border: 1px solid #e4e7ec;
            border-radius: 16px;
            padding: 40px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 2px solid #f2f4f7;
            padding-bottom: 20px;
            margin-bottom: 24px;
          }
          .logo-area {
            display: flex;
            align-items: center;
            gap: 12px;
          }
          .logo-box {
            width: 40px;
            height: 40px;
            background-color: #0e1680;
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #ffffff;
            font-weight: 800;
            font-size: 20px;
          }
          .college-title {
            font-size: 18px;
            font-weight: 700;
            color: #0e1680;
            margin: 0;
          }
          .college-subtitle {
            font-size: 11px;
            color: #687b96;
            margin: 2px 0 0 0;
          }
          .receipt-badge {
            background-color: #ecfdf3;
            color: #027a48;
            border: 1px solid #abedf2;
            padding: 6px 14px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
          }
          .details-grid {
            display: grid;
            grid-template-cols: 1fr 1fr;
            gap: 24px;
            margin-bottom: 32px;
          }
          .details-block h4 {
            font-size: 11px;
            color: #687b96;
            margin: 0 0 8px 0;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .details-block p {
            font-size: 13px;
            font-weight: 600;
            color: #1d2939;
            margin: 0;
            line-height: 1.5;
          }
          .table-container {
            margin-bottom: 32px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
          }
          th {
            background-color: #f8f9fc;
            padding: 12px 16px;
            font-size: 12px;
            font-weight: 600;
            color: #687b96;
            text-align: left;
            border-bottom: 1px solid #eaecf0;
          }
          td {
            padding: 16px;
            font-size: 13px;
            color: #344054;
            border-bottom: 1px solid #eaecf0;
          }
          .total-row {
            background-color: #f8f9fc;
            font-weight: 700;
          }
          .total-row td {
            color: #0e1680;
            font-size: 15px;
            border-bottom: none;
          }
          .footer {
            margin-top: 40px;
            text-align: center;
            font-size: 11px;
            color: #687b96;
            border-top: 1px solid #eaecf0;
            padding-top: 20px;
          }
          .signature-area {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            margin-top: 40px;
            padding: 0 10px;
          }
          .signature-box {
            text-align: center;
            width: 150px;
          }
          .signature-line {
            border-top: 1px solid #d0d5dd;
            margin-bottom: 6px;
          }
          @media print {
            body {
              padding: 0;
            }
            .receipt-container {
              border: none;
              box-shadow: none;
              padding: 0;
            }
          }
        </style>
      </head>
      <body>
        <div class="receipt-container">
          <div class="header">
            <div class="logo-area">
              <div class="logo-box">P</div>
              <div>
                <h1 class="college-title">PVPP College of Engineering</h1>
                <p class="college-subtitle">Sion, Mumbai - 400022 • Examination Authority</p>
              </div>
            </div>
            <div class="receipt-badge">PAID</div>
          </div>

          <div class="details-grid">
            <div class="details-block">
              <h4>Receipt Details</h4>
              <p>Receipt No: ${receiptNo}</p>
              <p>Date: ${item.date}</p>
              <p>Transaction: SUCCESS</p>
            </div>
            <div class="details-block">
              <h4>Student Details</h4>
              <p>Name: XYZ</p>
              <p>Class: B.E. (Information Technology)</p>
              <p>Semester: VI</p>
            </div>
          </div>

          <div class="table-container">
            <table>
              <thead>
                <tr>
                  <th>Description</th>
                  <th style="text-align: right;">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>${item.title}</td>
                  <td style="text-align: right; font-weight: 600;">${item.amount}</td>
                </tr>
                <tr class="total-row">
                  <td>Total Amount Paid</td>
                  <td style="text-align: right;">${item.amount}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="signature-area">
            <div class="signature-box">
              <div class="signature-line"></div>
              <span style="font-size: 11px; color: #687b96;">Student Signature</span>
            </div>
            <div class="signature-box">
              <div style="font-family: 'Courier New', monospace; font-size: 11px; font-weight: bold; color: #0e1680; margin-bottom: 2px;">ONLINE VERIFIED</div>
              <div class="signature-line"></div>
              <span style="font-size: 11px; color: #687b96;">Controller of Exams</span>
            </div>
          </div>

          <div class="footer">
            <p>This is a computer-generated document and does not require a physical signature.</p>
            <p style="font-size: 9px; margin-top: 4px; color: #98a2b3;">PVPP COE Exam Portal Security Hash: ${Math.random().toString(36).substring(2).toUpperCase()}</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const doc = printWindow.contentDocument || printWindow.contentWindow?.document;
    if (doc) {
      doc.open();
      doc.write(receiptHtml);
      doc.close();

      setTimeout(() => {
        printWindow.contentWindow?.focus();
        printWindow.contentWindow?.print();
        setTimeout(() => {
          document.body.removeChild(printWindow);
        }, 1000);
      }, 500);
    }
  };

  return (
    <div className="flex flex-col min-h-full p-8 gap-8 font-['Instrument_Sans']">
      {/* ── Title ── */}
      <h1 className="text-[24px] font-semibold text-[#101828]">Fees Payment</h1>

      {/* ── Tabs ── */}
      <div className="flex items-center bg-[#f0f1fd] rounded-xl p-1 gap-1 w-fit">
        {(['Payment Records', 'Payment History'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-lg text-[14px] font-semibold transition-all duration-200 ${
              activeTab === tab
                ? 'bg-[#0e1680] text-white shadow-sm'
                : 'text-[#687b96] hover:text-[#0e1680]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ── Payment Records Tab ── */}
      {activeTab === 'Payment Records' && (
        <PendingFeesList pendingFees={pendingFees} onPayNow={handlePayNow} />
      )}

      {/* ── Payment History Tab ── */}
      {activeTab === 'Payment History' && (
        <PaymentHistoryTable paymentHistory={paymentHistory} onDownloadReceipt={downloadReceipt} />
      )}

      {/* ── Payment Gateway Modal ── */}
      {selectedFee && (
        <MockPaymentModal 
          selectedFee={selectedFee} 
          onClose={() => setSelectedFee(null)} 
          onPaymentSuccess={handlePaymentSuccess} 
        />
      )}
    </div>
  );
};
