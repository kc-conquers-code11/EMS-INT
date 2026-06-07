import React, { useState, useMemo } from 'react';
import { X, Search, Download, Filter, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';
import type { SeatingArrangementRow } from '../../../../types/Faculty/BlockwiseAllocation/blockwiseAllocation';

/* ── Seed data ──────────────────────────────────────────────────── */
const MOCK_ALL_STUDENTS: SeatingArrangementRow[] = [
  { id: '1', studentName: 'abc', rollNo: 'VU4F2324034', seatNo: '377721', subject: 'Automata Theory',  blockNo: '203' },
  { id: '2', studentName: 'abc', rollNo: 'VU4F2324034', seatNo: '377721', subject: 'Networking',       blockNo: '203' },
  { id: '3', studentName: 'abc', rollNo: 'VU4F2324034', seatNo: '377721', subject: 'Operating System', blockNo: '203' },
  { id: '4', studentName: 'def', rollNo: 'VU4F2324035', seatNo: '377722', subject: 'Automata Theory',  blockNo: '204' },
  { id: '5', studentName: 'def', rollNo: 'VU4F2324035', seatNo: '377722', subject: 'Networking',       blockNo: '204' },
  { id: '6', studentName: 'ghi', rollNo: 'VU4F2324036', seatNo: '377723', subject: 'Operating System', blockNo: '205' },
];

const UNIQUE_SUBJECTS = [...new Set(MOCK_ALL_STUDENTS.map(s => s.subject))];
const UNIQUE_BLOCKS   = [...new Set(MOCK_ALL_STUDENTS.map(s => s.blockNo))];

const ROWS_PER_PAGE = 3;
const TOTAL_PAGES   = 10;

/* ── Pagination ─────────────────────────────────────────────────── */
const Pagination: React.FC<{
  current: number; total: number; onChange: (p: number) => void;
}> = ({ current, total, onChange }) => {
  const pages = [1, 2, 3, '...', 8, 9, 10];
  return (
    <div className="flex items-center justify-between">
      <button
        onClick={() => onChange(Math.max(1, current - 1))}
        disabled={current === 1}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#d0d5dd] text-[13px] font-medium text-[#344054] hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronLeft size={15} /> Previous
      </button>

      <div className="flex items-center gap-0.5">
        {pages.map((p, i) =>
          p === '...' ? (
            <span key={`e-${i}`} className="px-2 text-[13px] text-[#667085]">...</span>
          ) : (
            <button
              key={p}
              onClick={() => onChange(p as number)}
              className={`w-8 h-8 rounded-lg text-[13px] font-medium transition-colors ${
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
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#d0d5dd] text-[13px] font-medium text-[#344054] hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        Next <ChevronRight size={15} />
      </button>
    </div>
  );
};

/* ── SeatingArrangementModal ─────────────────────────────────────── */
interface Props {
  roomBlockNo: string;
  onClose: () => void;
}

export const SeatingArrangementModal: React.FC<Props> = ({ roomBlockNo, onClose }) => {
  const [search, setSearch]             = useState('');
  const [subjectFilter, setSubjectFilter] = useState('');
  const [blockFilter, setBlockFilter]   = useState('');
  const [showSubjectDrop, setShowSubjectDrop] = useState(false);
  const [showBlockDrop, setShowBlockDrop]     = useState(false);
  const [currentPage, setCurrentPage]   = useState(1);

  // Seating arrangement exists only for room 213 in our mock data
  const hasSeatingArrangement = roomBlockNo === '213';

  /* ── filtered rows ── */
  const filtered = useMemo(() => {
    if (!hasSeatingArrangement) return [];
    return MOCK_ALL_STUDENTS.filter(row => {
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        row.studentName.toLowerCase().includes(q) ||
        row.rollNo.toLowerCase().includes(q) ||
        row.seatNo.toLowerCase().includes(q) ||
        row.subject.toLowerCase().includes(q) ||
        row.blockNo.toLowerCase().includes(q);

      const matchesSubject = !subjectFilter || row.subject === subjectFilter;
      const matchesBlock   = !blockFilter   || row.blockNo  === blockFilter;

      return matchesSearch && matchesSubject && matchesBlock;
    });
  }, [hasSeatingArrangement, search, subjectFilter, blockFilter]);

  const paginated = filtered.slice((currentPage - 1) * ROWS_PER_PAGE, currentPage * ROWS_PER_PAGE);

  const resetPage = () => setCurrentPage(1);

  return (
    /* ── Backdrop ── */
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
      <div className="bg-white rounded-2xl shadow-2xl w-[640px] max-h-[90vh] flex flex-col font-['Instrument_Sans'] overflow-hidden">
        
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4">
          <h2 className="text-[18px] font-semibold text-[#101828]">View Seating Arrangement</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-[#667085] transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {!hasSeatingArrangement ? (
          /* ── Gorgeous Empty State (If No Seating Arrangement Exists) ── */
          <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
            <div className="w-16 h-16 bg-[#fee4e2] text-[#d92d20] rounded-full flex items-center justify-center mb-4">
              <AlertCircle size={32} />
            </div>
            <h3 className="text-[18px] font-bold text-[#101828] mb-2">
              No Seating Arrangement Found
            </h3>
            <p className="text-[14px] text-[#667085] max-w-[360px] mb-8">
              The seating arrangement details for room / block <span className="font-semibold text-[#101828]">{roomBlockNo}</span> have not been created or allocated yet.
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-[#0e1680] text-white text-[14px] font-semibold rounded-lg hover:bg-[#0b1260] transition-colors shadow-sm"
            >
              Close
            </button>
          </div>
        ) : (
          /* ── Content (If Seating Arrangement Exists) ── */
          <>
            {/* ── Search & Filters ── */}
            <div className="flex items-center gap-3 px-6 pb-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#667085]" />
                <input
                  type="text"
                  placeholder="Search"
                  value={search}
                  onChange={e => { setSearch(e.target.value); resetPage(); }}
                  className="w-full pl-9 pr-3 py-2 border border-[#d0d5dd] rounded-lg text-[13px] text-[#101828] placeholder-[#667085] focus:outline-none focus:ring-2 focus:ring-[#0e1680]/20 focus:border-[#0e1680] transition-colors"
                />
              </div>

              {/* Subject filter */}
              <div className="relative">
                <button
                  onClick={() => { setShowSubjectDrop(p => !p); setShowBlockDrop(false); }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-[13px] font-medium transition-colors ${
                    subjectFilter ? 'bg-[#0e1680] text-white border-[#0e1680]' : 'border-[#d0d5dd] text-[#344054] hover:bg-gray-50'
                  }`}
                >
                  Subject <Filter size={14} />
                </button>
                {showSubjectDrop && (
                  <div className="absolute top-full left-0 mt-1 bg-white border border-[#e4e7ec] rounded-xl shadow-lg z-10 min-w-[160px] py-1">
                    <button
                      onClick={() => { setSubjectFilter(''); setShowSubjectDrop(false); resetPage(); }}
                      className="w-full text-left px-4 py-2 text-[13px] hover:bg-gray-50 text-[#667085]"
                    >
                      All subjects
                    </button>
                    {UNIQUE_SUBJECTS.map(s => (
                      <button
                        key={s}
                        onClick={() => { setSubjectFilter(s); setShowSubjectDrop(false); resetPage(); }}
                        className={`w-full text-left px-4 py-2 text-[13px] hover:bg-gray-50 ${subjectFilter === s ? 'text-[#0e1680] font-semibold' : 'text-[#344054]'}`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Block filter */}
              <div className="relative">
                <button
                  onClick={() => { setShowBlockDrop(p => !p); setShowSubjectDrop(false); }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-[13px] font-medium transition-colors ${
                    blockFilter ? 'bg-[#0e1680] text-white border-[#0e1680]' : 'border-[#d0d5dd] text-[#344054] hover:bg-gray-50'
                  }`}
                >
                  Block <Filter size={14} />
                </button>
                {showBlockDrop && (
                  <div className="absolute top-full left-0 mt-1 bg-white border border-[#e4e7ec] rounded-xl shadow-lg z-10 min-w-[120px] py-1">
                    <button
                      onClick={() => { setBlockFilter(''); setShowBlockDrop(false); resetPage(); }}
                      className="w-full text-left px-4 py-2 text-[13px] hover:bg-gray-50 text-[#667085]"
                    >
                      All blocks
                    </button>
                    {UNIQUE_BLOCKS.map(b => (
                      <button
                        key={b}
                        onClick={() => { setBlockFilter(b); setShowBlockDrop(false); resetPage(); }}
                        className={`w-full text-left px-4 py-2 text-[13px] hover:bg-gray-50 ${blockFilter === b ? 'text-[#0e1680] font-semibold' : 'text-[#344054]'}`}
                      >
                        Block {b}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* ── Table ── */}
            <div className="px-6 overflow-x-auto">
              <table className="w-full text-[13px] text-[#101828]">
                <thead>
                  <tr className="border-b border-[#e4e7ec]">
                    <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider text-left text-[#667085] pr-4">Student Name</th>
                    <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider text-left text-[#667085] pr-4">Roll No</th>
                    <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider text-left text-[#667085] pr-4">Seat No</th>
                    <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider text-left text-[#667085] pr-4">Subject</th>
                    <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider text-left text-[#667085]">Block No</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-8 py-6 text-[15px] font-medium text-center text-[#667085]">No results found.</td>
                    </tr>
                  ) : (
                    paginated.map(row => (
                      <tr key={row.id} className="border-b border-[#f2f4f7] last:border-0 hover:bg-[#fafafa] transition-colors">
                        <td className="px-8 py-6 text-[15px] font-medium pr-4 text-[#344054]">{row.studentName}</td>
                        <td className="px-8 py-6 text-[15px] font-medium pr-4 text-[#344054]">{row.rollNo}</td>
                        <td className="px-8 py-6 text-[15px] font-medium pr-4 text-[#0e1680]">{row.seatNo}</td>
                        <td className="px-8 py-6 text-[15px] font-medium pr-4 text-[#0e1680]">{row.subject}</td>
                        <td className="px-8 py-6 text-[15px] font-medium text-[#344054]">{row.blockNo}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* ── Pagination ── */}
            <div className="px-6 pt-4 pb-2">
              <Pagination current={currentPage} total={TOTAL_PAGES} onChange={setCurrentPage} />
            </div>

            {/* ── Footer: Download ── */}
            <div className="flex justify-end px-6 py-4 border-t border-[#f2f4f7] mt-2">
              <button className="flex items-center gap-2 px-5 py-2.5 bg-[#0e1680] text-white text-[14px] font-semibold rounded-lg hover:bg-[#0b1260] transition-colors shadow-sm">
                <span>Download</span>
                <Download size={16} strokeWidth={2} />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
