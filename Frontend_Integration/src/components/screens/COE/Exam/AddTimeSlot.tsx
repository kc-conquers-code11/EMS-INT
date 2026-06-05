import React from 'react';
import { Search, Filter, Trash2, Pencil, ChevronRight, ChevronLeft } from 'lucide-react';

interface TimeSlot {
  id: number;
  srNo: number;
  semester: string;
  timeSlot: string;
}

const DUMMY_SLOTS: TimeSlot[] = [
  { id: 1, srNo: 1, semester: '1st', timeSlot: '10:00 AM to 11:00 AM' },
  { id: 2, srNo: 2, semester: '1st', timeSlot: '02:00 PM to 03:00 PM' },
];

export const AddTimeSlot: React.FC<{ onNext?: () => void }> = ({ onNext }) => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedSemesterFilter, setSelectedSemesterFilter] = React.useState('');
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 5;

  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedSemesterFilter]);

  const filteredSlots = DUMMY_SLOTS.filter(slot => {
    const matchesSearch = searchQuery === '' || slot.timeSlot.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSemester = selectedSemesterFilter === '' || slot.semester === selectedSemesterFilter;
    return matchesSearch && matchesSemester;
  });

  const totalPages = Math.ceil(filteredSlots.length / itemsPerPage);
  const paginatedSlots = filteredSlots.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getPageNumbers = () => {
    if (totalPages === 0) return [];
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (currentPage <= 4) return [1, 2, 3, 4, 5, '...', totalPages];
    if (currentPage >= totalPages - 3) return [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
  };

  const pages = getPageNumbers();
  const isEmpty = paginatedSlots.length === 0;

  const semesters = Array.from(new Set(DUMMY_SLOTS.map(s => s.semester).filter(Boolean)));

  const labelClass = "block text-sm font-medium text-[#344054] mb-1.5";
  const inputClass = "w-full px-3.5 py-2.5 bg-white border border-[#d0d5dd] rounded-lg text-sm text-[#101828] placeholder-[#687b96] focus:outline-none focus:ring-2 focus:ring-[#0e1680] shadow-sm";

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      {/* Form Section */}
      <div className="flex flex-col gap-6">
        <div>
          <label className={labelClass}>Select Semester</label>
          <select className={inputClass} defaultValue="">
            <option value="" disabled>Select Semester</option>
            <option>Semester 1</option>
            <option>Semester 2</option>
            <option>Semester 3</option>
            <option>Semester 4</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-5">
          <div>
            <label className={labelClass}>Start Time</label>
            <div className="relative">
              <input type="time" className={inputClass} />
            </div>
          </div>
          <div>
            <label className={labelClass}>End Time</label>
            <div className="relative">
              <input type="time" className={inputClass} />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button className="px-6 py-2.5 bg-[#0e1680] text-white text-sm font-semibold rounded-lg hover:bg-blue-900 transition-all shadow-md">
            Add Time Slot
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="flex flex-col gap-4 mt-4">
        {/* Search and Filter */}
        <div className="flex justify-end gap-3 flex-wrap">
          <div className="relative w-[180px]">
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-3 pr-8 py-2 bg-white border border-[#d0d5dd] rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-[#0e1680] shadow-sm"
            />
            <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none">
              <Search size={14} className="text-[#687b96]" />
            </div>
          </div>
          
          <div className="relative flex items-center">
            <select
              value={selectedSemesterFilter}
              onChange={(e) => setSelectedSemesterFilter(e.target.value)}
              className="appearance-none bg-white border border-[#d0d5dd] rounded-lg px-3 py-2 pr-8 text-xs font-semibold text-[#344054] hover:bg-gray-50 shadow-sm transition-colors cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#0e1680]"
            >
              <option value="">Semester</option>
              {semesters.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <Filter size={12} className="absolute right-2.5 text-[#344054] pointer-events-none" />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white border border-[#eaecf0] rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#f9fafb] border-b border-[#eaecf0]">
              <tr>
                <th className="px-6 py-3 text-[10px] font-medium text-[#475467] uppercase tracking-wider text-center">Sr No.</th>
                <th className="px-6 py-3 text-[10px] font-medium text-[#475467] uppercase tracking-wider text-center">Semester</th>
                <th className="px-6 py-3 text-[10px] font-medium text-[#475467] uppercase tracking-wider text-center">Time Slot</th>
                <th className="px-6 py-3 text-[10px] font-medium text-[#475467] uppercase tracking-wider text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eaecf0]">
              {isEmpty ? (
                <tr>
                  <td colSpan={4} className="h-[200px] text-center">
                    <span className="text-[14px] font-medium text-[#98a2b3]">No Time Slots Found</span>
                  </td>
                </tr>
              ) : (
                paginatedSlots.map((slot) => (
                  <tr key={slot.id} className="hover:bg-gray-50 transition-colors h-[64px]">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#475467] text-center">{slot.srNo}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#475467] text-center">{slot.semester}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#475467] text-center">{slot.timeSlot}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center gap-3">
                        <button className="text-[#98a2b3] hover:text-red-600 transition-colors">
                          <Trash2 size={18} />
                        </button>
                        <button className="text-[#98a2b3] hover:text-[#0e1680] transition-colors">
                          <Pencil size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Section */}
        <div className="px-6 py-4 flex items-center justify-between border-t border-[#eaecf0] bg-white rounded-b-xl border">
          <button
            type="button"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={isEmpty || currentPage === 1}
            className="flex items-center gap-2 px-3 py-1.5 border border-[#d0d5dd] rounded-lg text-xs font-semibold text-[#344054] hover:bg-gray-50 transition-colors shadow-sm disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white"
          >
            <ChevronLeft size={16} />
            Previous
          </button>

          <div className="flex items-center gap-1.5">
            {pages.map((page, i) => (
              <button
                key={i}
                type="button"
                onClick={() => typeof page === 'number' && setCurrentPage(page)}
                disabled={isEmpty || page === '...'}
                className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-medium transition-colors ${
                  page === currentPage
                    ? 'bg-[#f9fafb] text-[#101828] font-semibold border border-[#eaecf0]'
                    : 'text-[#667085] hover:bg-gray-50'
                } disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent`}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={isEmpty || currentPage === totalPages}
            className="flex items-center gap-2 px-3 py-1.5 border border-[#d0d5dd] rounded-lg text-xs font-semibold text-[#344054] hover:bg-gray-50 transition-colors shadow-sm disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white"
          >
            Next
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {onNext && (
        <div className="flex justify-end pt-4">
          <button onClick={onNext} className="flex items-center gap-2 px-8 py-2.5 bg-[#0e1680] text-white text-[16px] font-semibold rounded-lg hover:bg-blue-900 transition-all shadow-md">
            Next
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
};
