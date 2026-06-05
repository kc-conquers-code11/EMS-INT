import { useState } from 'react';
import { Search, SlidersHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';
import { FeedbackModal } from '../../../components/modals/FeedbackModal';
import { RaiseConflictModal } from '../../../components/screens/Faculty/SupervisorDuty/RaiseConflictModal';
import type { SupervisorDuty, SupervisorDutyModalType } from '../../../types/Faculty/supervisorDuty';

const MOCK_DUTIES: SupervisorDuty[] = [
  { duty_id: 1, timetable_id: 101, room_id: 201, faculty_id: 501, date: '20/05/26', time: '2:00 to 3:00 pm', subject_name: 'Automata Theory', room_no: '203', duty_status: 'Pending' },
  { duty_id: 2, timetable_id: 102, room_id: 201, faculty_id: 501, date: '20/05/26', time: '2:00 to 3:00 pm', subject_name: 'Networking', room_no: '203', duty_status: 'Pending' },
  { duty_id: 3, timetable_id: 103, room_id: 201, faculty_id: 501, date: '20/05/26', time: '2:00 to 3:00 pm', subject_name: 'Operating System', room_no: '203', duty_status: 'Pending' },
];

export const SupervisorDutyPage = () => {
  const [activeTab, setActiveTab] = useState<'View Assigned Duties' | 'View Status' | 'Pending Duties'>('View Assigned Duties');
  const [duties, setDuties] = useState<SupervisorDutyView[]>(MOCK_DUTIES);
  
  // Modals state
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [conflictModalItem, setConflictModalItem] = useState<SupervisorDutyView | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 10;

  // ── Actions ─────────────────────────────────────────────────
  const handleAccept = (item: SupervisorDutyView) => {
    // In production: Call API to accept duty, setting duty_status to 'Accepted' and accepted_at to now
    setDuties(prev => prev.map(d => d.duty_id === item.duty_id ? { ...d, duty_status: 'Accepted', accepted_at: new Date().toISOString() } : d));
    setIsSuccessModalOpen(true);
  };

  const handleConflict = (item: SupervisorDutyView) => {
    setConflictModalItem(item);
  };

  const handleConflictSubmit = (reason: string) => {
    // In production: Call API to submit conflict with reason in 'remarks'
    console.log("Conflict raised for duty", conflictModalItem?.duty_id, "Reason:", reason);
    if (conflictModalItem) {
      setDuties(prev => prev.map(d => d.duty_id === conflictModalItem.duty_id ? { ...d, duty_status: 'Conflict', remarks: reason } : d));
    }
    setConflictModalItem(null);
  };

  const handleHold = (item: SupervisorDutyView) => {
    // In production: Call API to put duty on hold
    setDuties(prev => prev.map(d => d.duty_id === item.duty_id ? { ...d, duty_status: 'Hold' } : d));
  };

  // ── Pagination Helper ──────────────────────────────────────
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1, 2, 3);
      if (currentPage > 4) pages.push('...');
      if (currentPage > 3 && currentPage < totalPages - 2) pages.push(currentPage);
      if (currentPage < totalPages - 3) pages.push('...');
      pages.push(totalPages - 2, totalPages - 1, totalPages);
      const seen = new Set<string>();
      return pages.filter(p => { const k = String(p); if (seen.has(k)) return false; seen.add(k); return true; });
    }
    return pages;
  };

  return (
    <div className="flex flex-col w-full min-h-screen pb-20" style={{ fontFamily: "'Instrument Sans', sans-serif" }}>
      {/* Title */}
      <h1 className="text-[28px] font-semibold text-[#171822] mb-6">
        Accept Supervisor Duty
      </h1>

      {/* Tabs */}
      <div className="flex bg-[#f8f9fc] rounded-[8px] p-1 w-max mb-6">
        {(['View Assigned Duties', 'View Status', 'Pending Duties'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2.5 rounded-[6px] font-semibold text-[15px] transition-all duration-300 ${
              activeTab === tab 
                ? 'bg-[#0e1680] text-white shadow-sm' 
                : 'text-[#667085] hover:text-[#0e1680]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Filters row */}
      <div className="flex items-center justify-end gap-3 mb-4">
        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search"
            className="w-[220px] h-[40px] pl-3 pr-10 border border-[#d0d5dd] rounded-[8px] text-[14px] text-[#101828] bg-white focus:outline-none focus:ring-2 focus:ring-[#0e1680]/20 transition-all shadow-sm"
          />
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-[16px] h-[16px] text-[#667085]" />
        </div>

        {/* Date filter */}
        <button className="flex items-center gap-2 h-[40px] px-4 border border-[#d0d5dd] rounded-[8px] text-[14px] font-medium text-[#344054] bg-white hover:bg-gray-50 transition-colors shadow-sm">
          Date
          <SlidersHorizontal className="w-[16px] h-[16px] text-[#667085]" />
        </button>

        {/* Subject filter */}
        <button className="flex items-center gap-2 h-[40px] px-4 border border-[#d0d5dd] rounded-[8px] text-[14px] font-medium text-[#344054] bg-white hover:bg-gray-50 transition-colors shadow-sm">
          Subject
          <SlidersHorizontal className="w-[16px] h-[16px] text-[#667085]" />
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-[0px_12px_16px_0px_rgba(16,24,40,0.08)] border border-[#eaecf0] overflow-hidden flex flex-col">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#eaecf0] bg-[#f9fafb]">
              <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider text-[#667085]">Sr no.</th>
              <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider text-[#667085]">Date</th>
              <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider text-[#667085]">Time</th>
              <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider text-[#667085]">Subject</th>
              <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider text-[#667085]">Room</th>
              {activeTab === 'View Assigned Duties' ? (
                <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider text-[#667085] text-center">Action</th>
              ) : (
                <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider text-[#667085] text-left">Status</th>
              )}
            </tr>
          </thead>
          <tbody>
            {duties
              .filter(d => activeTab === 'Pending Duties' ? d.duty_status === 'Pending' : true)
              .map((duty, index) => (
              <tr key={duty.duty_id} className="border-b border-[#eaecf0] hover:bg-slate-50/50 transition-colors group">
                <td className="px-8 py-6 text-[15px] font-medium text-[#475467]">{index + 1}</td>
                <td className="px-8 py-6 text-[15px] font-medium text-[#101828]">{duty.date}</td>
                <td className="px-8 py-6 text-[15px] font-medium text-[#475467]">{duty.time}</td>
                <td className="px-8 py-6 text-[15px] font-medium text-[#475467]">{duty.subject_name}</td>
                <td className="px-8 py-6 text-[15px] font-medium text-[#475467]">{duty.room_no}</td>
                {activeTab === 'View Assigned Duties' ? (
                  <td className="px-8 py-6 text-[15px] font-medium text-center">
                    <div className="flex items-center justify-center gap-3">
                      <button
                        onClick={() => handleAccept(duty)}
                        className="min-w-[100px] py-2 bg-[#0e1680] text-white text-[14px] font-bold rounded-[8px] hover:bg-[#0a1060] transition-colors shadow-sm"
                      >
                        {duty.duty_status === 'Accepted' ? 'Accepted ✓' : 'Accept'}
                      </button>
                      <button
                        onClick={() => handleConflict(duty)}
                        className={`min-w-[100px] py-2 text-[14px] font-bold rounded-[8px] transition-colors shadow-sm ${
                          duty.duty_status === 'Conflict'
                            ? 'bg-red-50 text-red-600 border border-red-200'
                            : 'bg-[#0e1680] text-white hover:bg-[#0a1060]'
                        }`}
                      >
                        {duty.duty_status === 'Conflict' ? 'Conflicted' : 'Conflict'}
                      </button>
                      <button
                        onClick={() => handleHold(duty)}
                        className={`min-w-[100px] py-2 text-[14px] font-bold rounded-[8px] transition-colors shadow-sm ${
                          duty.duty_status === 'Hold'
                            ? 'bg-amber-50 text-amber-600 border border-amber-200'
                            : 'bg-[#0e1680] text-white hover:bg-[#0a1060]'
                        }`}
                      >
                        {duty.duty_status === 'Hold' ? 'On Hold' : 'Hold'}
                      </button>
                    </div>
                  </td>
                ) : (
                  <td className="px-8 py-6 text-[15px] font-medium">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      duty.duty_status === 'Accepted' ? 'bg-[#effbe7] text-[#095512]' :
                      duty.duty_status === 'Conflict' ? 'bg-red-50 text-red-700' :
                      duty.duty_status === 'Hold' ? 'bg-amber-50 text-amber-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {duty.duty_status}
                    </span>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[#eaecf0]">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="flex items-center gap-2 px-3.5 py-2 border border-[#d0d5dd] rounded-[8px] text-[14px] font-semibold text-[#344054] bg-white hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
          >
            <ChevronLeft className="w-[16px] h-[16px]" />
            Previous
          </button>

          <div className="flex items-center gap-1">
            {getPageNumbers().map((page, idx) =>
              typeof page === 'string' ? (
                <span key={`dots-${idx}`} className="w-10 h-10 flex items-center justify-center text-[14px] text-[#667085]">...</span>
              ) : (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-10 h-10 flex items-center justify-center rounded-[8px] text-[14px] font-semibold transition-colors ${
                    currentPage === page ? 'bg-[#f0f1ff] text-[#0e1680]' : 'text-[#667085] hover:bg-gray-100'
                  }`}
                >
                  {page}
                </button>
              )
            )}
          </div>

          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="flex items-center gap-2 px-3.5 py-2 border border-[#d0d5dd] rounded-[8px] text-[14px] font-semibold text-[#344054] bg-white hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
          >
            Next
            <ChevronRight className="w-[16px] h-[16px]" />
          </button>
        </div>
      </div>

      {/* Global Submit Action */}
      <div className="flex justify-end mt-6">
        <button className="px-10 py-3 bg-[#0e1680] text-white text-[15px] font-bold rounded-[8px] hover:bg-[#0a1060] transition-colors shadow-md">
          Submit
        </button>
      </div>

      {/* ── Modals ──────────────────────────────────────────────── */}
      
      {/* Duty Accepted Success Modal */}
      <FeedbackModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        type="success"
        title="Duty Accepted!"
        backLabel="Back"
      />

      {/* Raise Conflict Modal */}
      <RaiseConflictModal
        isOpen={!!conflictModalItem}
        onClose={() => setConflictModalItem(null)}
        onSubmit={handleConflictSubmit}
      />
    </div>
  );
};
