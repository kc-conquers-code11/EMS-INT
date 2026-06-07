import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { BlockwiseAllocationRow } from '../../../../types/Faculty/BlockwiseAllocation/blockwiseAllocation';
import { SeatingArrangementModal } from './SeatingArrangementModal';

/* ── Seed data ──────────────────────────────────────────────────── */
const ALLOCATION_DATA: BlockwiseAllocationRow[] = [
  { id: '1', roomBlockNo: '213', date: '20/05/26', examSession: '2:00 to 3:00 pm', subject: 'Automata Theory' },
  { id: '2', roomBlockNo: '213', date: '20/05/26', examSession: '2:00 to 3:00 pm', subject: 'Networking' },
  { id: '3', roomBlockNo: '213', date: '20/05/26', examSession: '2:00 to 3:00 pm', subject: 'Operating System' },
];

const TOTAL_PAGES = 10;

/* ── Pagination ─────────────────────────────────────────────────── */
const Pagination: React.FC<{
  current: number;
  total: number;
  onChange: (p: number) => void;
}> = ({ current, total, onChange }) => {
  const pages = [1, 2, 3, '...', 8, 9, 10];
  return (
    <div className="flex items-center justify-between mt-2 px-1">
      <button
        onClick={() => onChange(Math.max(1, current - 1))}
        disabled={current === 1}
        className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#d0d5dd] text-[14px] font-medium text-[#344054] hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronLeft size={16} />
        Previous
      </button>

      <div className="flex items-center gap-1">
        {pages.map((p, i) =>
          p === '...' ? (
            <span key={`e-${i}`} className="px-2 py-1 text-[14px] text-[#667085]">...</span>
          ) : (
            <button
              key={p}
              onClick={() => onChange(p as number)}
              className={`w-9 h-9 rounded-lg text-[14px] font-medium transition-colors ${
                current === p ? 'bg-[#0e1680] text-white' : 'text-[#667085] hover:bg-gray-100'
              }`}
            >
              {p}
            </button>
          )
        )}
      </div>

      <button
        onClick={() => onChange(Math.min(total, current + 1))}
        disabled={current === total}
        className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#d0d5dd] text-[14px] font-medium text-[#344054] hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        Next
        <ChevronRight size={16} />
      </button>
    </div>
  );
};

/* ── BlockwiseAllocationTable ────────────────────────────────────── */
export const BlockwiseAllocationTable: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-4">
      {/* Table */}
      <div className="w-full overflow-x-auto rounded-xl border border-[#e4e7ec] bg-white shadow-sm">
        <table className="w-full text-[14px] text-[#101828]">
          <thead>
            <tr className="border-b border-[#e4e7ec]">
              <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider text-left text-[#667085]">Room/Block No</th>
              <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider text-left text-[#667085]">Date</th>
              <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider text-left text-[#667085]">Exam Session</th>
              <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider text-left text-[#667085]">Subject</th>
              <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider text-left text-[#667085]">Action</th>
            </tr>
          </thead>
          <tbody>
            {ALLOCATION_DATA.map(row => (
              <tr
                key={row.id}
                className="border-b border-[#e4e7ec] last:border-0 hover:bg-[#fafafa] transition-colors"
              >
                <td className="px-8 py-6 text-[15px] font-medium text-[#344054]">{row.roomBlockNo}</td>
                <td className="px-8 py-6 text-[15px] font-medium text-[#344054]">{row.date}</td>
                <td className="px-8 py-6 text-[15px] font-medium text-[#0e1680]">{row.examSession}</td>
                <td className="px-8 py-6 text-[15px] font-medium text-[#0e1680]">{row.subject}</td>
                <td className="px-8 py-6 text-[15px] font-medium">
                  <button
                    onClick={() => setSelectedRoom(row.roomBlockNo)}
                    className="px-4 py-2 bg-[#0e1680] text-white text-[13px] font-semibold rounded-lg hover:bg-[#0b1260] transition-colors whitespace-nowrap"
                  >
                    View Seating Arrangement
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <Pagination current={currentPage} total={TOTAL_PAGES} onChange={setCurrentPage} />

      {/* Modal */}
      {selectedRoom !== null && (
        <SeatingArrangementModal
          roomBlockNo={selectedRoom}
          onClose={() => setSelectedRoom(null)}
        />
      )}
    </div>
  );
};
