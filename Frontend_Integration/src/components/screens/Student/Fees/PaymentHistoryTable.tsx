import React, { useState } from 'react';
import { Download } from 'lucide-react';
import type { PaymentHistoryItem } from '../../../../types/Student/Fees/fees';

interface PaymentHistoryTableProps {
  paymentHistory: PaymentHistoryItem[];
  onDownloadReceipt: (item: PaymentHistoryItem) => void;
}

export const PaymentHistoryTable: React.FC<PaymentHistoryTableProps> = ({ paymentHistory, onDownloadReceipt }) => {
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <div className="bg-white border border-[#e4e7ec] rounded-2xl shadow-sm overflow-hidden flex flex-col">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/70 border-b border-[#e4e7ec]">
              <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider text-[#344054] w-24">Sr. No.</th>
              <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider text-[#344054]">Title</th>
              <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider text-[#344054] w-40">Amount</th>
              <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider text-[#344054] w-40">Status</th>
              <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider text-[#344054] w-32 text-center">Receipt</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e4e7ec]">
            {paymentHistory.map((item) => (
              <tr key={item.srNo} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-8 py-6 text-[15px] font-medium text-[#475467]">{item.srNo}</td>
                <td className="px-8 py-6 text-[15px] font-medium text-[#101828]">{item.title}</td>
                <td className="px-8 py-6 text-[15px] font-medium text-[#475467]">{item.amount}</td>
                <td className="px-8 py-6 text-[15px] font-medium">
                  <div className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full text-xs font-semibold w-fit border border-emerald-100">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                    {item.status}
                  </div>
                </td>
                <td className="px-8 py-6 text-[15px] font-medium text-center">
                  <button 
                    onClick={() => onDownloadReceipt(item)}
                    className="p-2 hover:bg-gray-100/80 rounded-lg text-[#0e1680] hover:text-[#0b1260] transition-colors cursor-pointer"
                    title="Download Receipt"
                  >
                    <Download size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-6 py-4 border-t border-[#e4e7ec] print:hidden">
        <button 
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          className="px-4 py-2 border border-[#d0d5dd] hover:bg-gray-50 text-[14px] font-semibold rounded-lg transition-colors flex items-center gap-2 text-[#344054] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          ← Previous
        </button>
        <div className="flex items-center gap-1">
          {[1, 2, 3, '...', 8, 9, 10].map((num, i) => (
            <button
              key={i}
              disabled={typeof num === 'string'}
              onClick={() => typeof num === 'number' && setCurrentPage(num)}
              className={`w-10 h-10 flex items-center justify-center text-[14px] font-medium rounded-lg transition-all ${
                currentPage === num
                  ? 'bg-[#f0f1fd] text-[#0e1680] font-bold'
                  : 'text-[#475467] hover:bg-gray-50'
              } disabled:cursor-default cursor-pointer`}
            >
              {num}
            </button>
          ))}
        </div>
        <button 
          disabled={currentPage === 10}
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, 10))}
          className="px-4 py-2 border border-[#d0d5dd] hover:bg-gray-50 text-[14px] font-semibold rounded-lg transition-colors flex items-center gap-2 text-[#344054] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          Next →
        </button>
      </div>
    </div>
  );
};
