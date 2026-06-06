import React, { useState } from 'react';
import { Download, Eye, ChevronLeft, ChevronRight } from 'lucide-react';

/* ── Types ──────────────────────────────────────────────────────── */
interface ResultHistoryRow {
  id: string;
  semester: string;
  examEvent: string;
  result: string;
  cgpa: string;
}

/* ── Seed data ──────────────────────────────────────────────────── */
const HISTORY_DATA: ResultHistoryRow[] = [
  { id: '1', semester: 'Semester I',   examEvent: 'Winter 2024', result: 'Pass',        cgpa: '7.2' },
  { id: '2', semester: 'Semester II',  examEvent: 'Summer 2025', result: 'Distinction', cgpa: '7.8' },
  { id: '3', semester: 'Semester III', examEvent: 'Winter 2025', result: 'First class', cgpa: '8.1' },
  { id: '4', semester: 'Semester IV',  examEvent: 'Summer 2026', result: 'Pass',        cgpa: '7.9' },
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
    <div className="flex items-center justify-between mt-4">
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
            <span key={`ellipsis-${i}`} className="px-2 py-1 text-[14px] text-[#667085]">
              ...
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onChange(p as number)}
              className={`w-9 h-9 rounded-lg text-[14px] font-medium transition-colors ${
                current === p
                  ? 'bg-[#0e1680] text-white'
                  : 'text-[#667085] hover:bg-gray-100'
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

/* ── ResultHistoryTable ─────────────────────────────────────────── */
export const ResultHistoryTable: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-[16px] font-semibold text-[#101828]">
        Semester-wise Result List
      </h2>

      {/* Table */}
      <div className="w-full overflow-x-auto rounded-xl border border-[#e4e7ec] bg-white shadow-sm">
        <table className="w-full text-[14px] text-[#101828]">
          <thead>
            <tr className="border-b border-[#e4e7ec] bg-white">
              <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider text-left text-[#667085]">Semester</th>
              <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider text-left text-[#667085]">Exam event</th>
              <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider text-left text-[#667085]">Result</th>
              <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider text-left text-[#667085]">CGPA</th>
              <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider text-left text-[#667085]">Action</th>
            </tr>
          </thead>
          <tbody>
            {HISTORY_DATA.map(row => (
              <tr
                key={row.id}
                className="border-b border-[#e4e7ec] last:border-0 hover:bg-[#fafafa] transition-colors"
              >
                <td className="px-8 py-6 text-[15px] font-medium">{row.semester}</td>
                <td className="px-8 py-6 text-[15px] font-medium">{row.examEvent}</td>
                <td className="px-8 py-6 text-[15px] font-medium">{row.result}</td>
                <td className="px-8 py-6 text-[15px] font-medium">{row.cgpa}</td>
                <td className="px-8 py-6 text-[15px] font-medium">
                  <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-[#0e1680] text-white text-[13px] font-semibold rounded-lg hover:bg-[#0b1260] transition-colors">
                      <span>View</span>
                      <Eye size={15} strokeWidth={2} />
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-[#0e1680] text-white text-[13px] font-semibold rounded-lg hover:bg-[#0b1260] transition-colors">
                      <span>Download</span>
                      <Download size={15} strokeWidth={2} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <Pagination current={currentPage} total={TOTAL_PAGES} onChange={setCurrentPage} />
    </div>
  );
};
