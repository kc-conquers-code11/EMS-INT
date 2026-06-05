import React from 'react';
import type { PendingFeeItem } from '../../../../types/Student/Fees/fees';

interface PendingFeesListProps {
  pendingFees: PendingFeeItem[];
  onPayNow: (fee: PendingFeeItem) => void;
}

export const PendingFeesList: React.FC<PendingFeesListProps> = ({ pendingFees, onPayNow }) => {
  return (
    <div className="bg-white border border-[#e4e7ec] rounded-2xl shadow-sm overflow-hidden flex flex-col font-['Instrument_Sans']">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/70 border-b border-[#e4e7ec]">
              <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider text-[#344054] w-24">Sr. No.</th>
              <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider text-[#344054]">Title</th>
              <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider text-[#344054] w-64">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e4e7ec]">
            {pendingFees.map((item, index) => (
              <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-8 py-6 text-[15px] font-medium text-[#475467]">{index + 1}</td>
                <td className="px-8 py-6 text-[15px] font-medium text-[#101828]">{item.title}</td>
                <td className="px-8 py-6 text-[15px] font-medium">
                  {item.type === 'Done' ? (
                    <span className="text-[#344054]">Done</span>
                  ) : (
                    <span className="text-[#344054]">
                      Pending{' '}
                      <button 
                        onClick={() => onPayNow(item)}
                        className="font-bold text-[#0e1680] hover:underline focus:outline-none cursor-pointer"
                      >
                        (Pay now)
                      </button>
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-6 py-4 border-t border-[#e4e7ec] print:hidden">
        <button 
          disabled
          className="px-4 py-2 border border-[#d0d5dd] text-[14px] font-semibold rounded-lg text-[#344054] opacity-50 cursor-not-allowed"
        >
          ← Previous
        </button>
        <div className="flex items-center gap-1">
          {[1, 2, 3, '...', 8, 9, 10].map((num, i) => (
            <button
              key={i}
              disabled
              className={`w-10 h-10 flex items-center justify-center text-[14px] font-medium rounded-lg ${
                num === 1
                  ? 'bg-[#f0f1fd] text-[#0e1680] font-bold'
                  : 'text-[#475467]'
              } opacity-80`}
            >
              {num}
            </button>
          ))}
        </div>
        <button 
          disabled
          className="px-4 py-2 border border-[#d0d5dd] text-[14px] font-semibold rounded-lg text-[#344054] opacity-50 cursor-not-allowed"
        >
          Next →
        </button>
      </div>
    </div>
  );
};
