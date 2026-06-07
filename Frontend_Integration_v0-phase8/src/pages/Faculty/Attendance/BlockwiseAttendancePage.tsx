import { useState } from 'react';
import { Search, ChevronDown, SlidersHorizontal, ChevronLeft, ChevronRight, UploadCloud } from 'lucide-react';
import { FeedbackModal } from '../../../components/modals/FeedbackModal';

type Mode = 'online' | 'offline';
type Status = 'Present' | 'Absent' | 'Malpractice';

interface Student {
  id: number;
  prn: string;
  seat: string;
  name: string;
  status: Status;
}

const filterOptions: Record<string, string[]> = {
  'Semester': ['Semester 1', 'Semester 2', 'Semester 3', 'Semester 4', 'Semester 5', 'Semester 6', 'Semester 7', 'Semester 8'],
  'Academic year': ['2023-2024', '2024-2025'],
  'Exam session': ['Morning (10:00 - 13:00)', 'Afternoon (14:00 - 17:00)'],
  'Exam Event': ['Mid Term', 'End Term', 'Practical'],
  'Programme': ['B.Tech', 'M.Tech', 'Ph.D'],
  'Branch': ['Computer Science', 'Mechanical', 'Electrical', 'Civil'],
  'Course': ['Data Structures', 'Algorithms', 'Database Management', 'Operating Systems']
};

const MOCK_STUDENTS: Student[] = Array.from({ length: 25 }, (_, i) => ({
  id: i + 1,
  prn: `2024000${(i + 1).toString().padStart(3, '0')}`,
  seat: `S-${100 + i}`,
  name: `Student ${i + 1}`,
  status: i % 7 === 0 ? 'Absent' : i % 12 === 0 ? 'Malpractice' : 'Present'
}));

export const BlockwiseAttendancePage = () => {
  const [mode, setMode] = useState<Mode>('online');
  const [students, setStudents] = useState<Student[]>(MOCK_STUDENTS);
  const [showSuccess, setShowSuccess] = useState(false);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [filterError, setFilterError] = useState<string | null>(null);

  const handleFilterChange = (filter: string, value: string) => {
    setFilters(prev => ({ ...prev, [filter]: value }));
    if (filterError) setFilterError(null);
  };

  const handleSearch = () => {
    const missingFilters = Object.keys(filterOptions).filter(
      key => !filters[key] || filters[key] === ''
    );
    if (missingFilters.length > 0) {
      setFilterError("Please fill all the dropdowns before searching.");
      return;
    }
    setFilterError(null);
    // Add logic here to apply search filters if needed
  };

  const handleStatusChange = (id: number, status: Status) => {
    setStudents(students.map(s => s.id === id ? { ...s, status } : s));
  };

  const handleSave = () => {
    setShowSuccess(true);
  };

  return (
    <div className="flex flex-col w-full min-h-full" style={{ fontFamily: "'Instrument Sans', sans-serif" }}>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-[28px] font-semibold text-[#171822] leading-[42px]">Blockwise Attendance</h1>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#eaecf0] mb-6">
        <button
          onClick={() => setMode('online')}
          className={`pb-3 px-1 text-[16px] font-semibold transition-colors relative ${
            mode === 'online' ? 'text-[#0e1680]' : 'text-[#667085] hover:text-[#344054]'
          }`}
        >
          Online
          {mode === 'online' && (
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#0e1680] rounded-t-sm" />
          )}
        </button>
        <button
          onClick={() => setMode('offline')}
          className={`pb-3 px-1 ml-6 text-[16px] font-semibold transition-colors relative ${
            mode === 'offline' ? 'text-[#0e1680]' : 'text-[#667085] hover:text-[#344054]'
          }`}
        >
          Offline
          {mode === 'offline' && (
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#0e1680] rounded-t-sm" />
          )}
        </button>
      </div>

      {/* Filters (Common) */}
      <div className="flex flex-col mb-6">
        <div className="flex flex-wrap gap-4">
          {Object.entries(filterOptions).map(([filter, options]) => (
            <div key={filter} className="relative">
              <select
                value={filters[filter] || ''}
                onChange={(e) => handleFilterChange(filter, e.target.value)}
                className={`w-[160px] h-[40px] px-3.5 border ${filterError && !filters[filter] ? 'border-red-500' : 'border-[#d0d5dd]'} rounded-[8px] text-[14px] text-[#667085] bg-white appearance-none focus:outline-none focus:border-[#0e1680] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] cursor-pointer`}
              >
                <option value="">{filter}</option>
                {options.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#667085] pointer-events-none" />
            </div>
          ))}
          <div className="flex items-end">
            <button 
              onClick={handleSearch}
              className="h-[40px] px-6 bg-[#0e1680] text-white text-[14px] font-semibold rounded-[8px] shadow-sm hover:bg-[#0a1060] transition-colors"
            >
              Search
            </button>
          </div>
        </div>
        {filterError && (
          <p className="text-red-500 text-[14px] mt-2 font-medium">{filterError}</p>
        )}
      </div>

      {mode === 'online' ? (
        <>
          {/* Action Bar */}
          <div className="flex justify-between items-center mb-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Search"
                className="w-[320px] h-[40px] pl-10 pr-4 border border-[#d0d5dd] rounded-[8px] text-[16px] text-[#667085] bg-white focus:outline-none focus:border-[#0e1680] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#667085]" />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 border border-[#d0d5dd] rounded-[8px] text-[14px] font-semibold text-[#344054] bg-white shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] hover:bg-gray-50 transition-colors">
              <SlidersHorizontal size={20} />
              Filters
            </button>
          </div>

          {/* Table Container */}
          <div className="bg-white border border-[#eaecf0] rounded-[10px] shadow-[0px_1px_3px_0px_rgba(16,24,40,0.1),0px_1px_2px_0px_rgba(16,24,40,0.06)] overflow-hidden flex flex-col mb-4">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#f9fafb] border-b border-[#eaecf0]">
                    <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider text-[#667085]">Sr. no.</th>
                    <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider text-[#667085]">PRN no.</th>
                    <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider text-[#667085]">Seat no.</th>
                    <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider text-[#667085]">Student name</th>
                    <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider text-[#667085] text-center">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((row, i) => (
                    <tr key={row.id} className="border-b border-[#eaecf0] hover:bg-slate-50/50 transition-colors group">
                      <td className="px-8 py-6 text-[15px] font-medium text-[#475467]">{i + 1}</td>
                      <td className="px-8 py-6 text-[15px] font-medium text-[#475467]">{row.prn}</td>
                      <td className="px-8 py-6 text-[15px] font-medium text-[#475467]">{row.seat}</td>
                      <td className="px-8 py-6 text-[15px] font-medium text-[#101828]">{row.name}</td>
                      <td className="px-8 py-6 text-[15px] font-medium">
                        <div className="flex items-center justify-center gap-6">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name={`status-${row.id}`}
                              checked={row.status === 'Present'}
                              onChange={() => handleStatusChange(row.id, 'Present')}
                              className="w-4 h-4 text-[#0e1680] border-gray-300 focus:ring-[#0e1680]"
                            />
                            <span className="text-[14px] text-[#344054] font-medium">Present</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name={`status-${row.id}`}
                              checked={row.status === 'Absent'}
                              onChange={() => handleStatusChange(row.id, 'Absent')}
                              className="w-4 h-4 text-[#0e1680] border-gray-300 focus:ring-[#0e1680]"
                            />
                            <span className="text-[14px] text-[#344054] font-medium">Absent</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name={`status-${row.id}`}
                              checked={row.status === 'Malpractice'}
                              onChange={() => handleStatusChange(row.id, 'Malpractice')}
                              className="w-4 h-4 text-[#0e1680] border-gray-300 focus:ring-[#0e1680]"
                            />
                            <span className="text-[14px] text-[#344054] font-medium">Malpractice</span>
                          </label>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-6 py-3 border-t border-[#eaecf0] mt-auto">
              <button className="flex items-center gap-2 px-3.5 py-2 border border-[#d0d5dd] rounded-[8px] text-[14px] font-medium text-[#344054] bg-white hover:bg-gray-50 transition-colors shadow-sm">
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>
              <div className="flex gap-1">
                {[1, 2, 3].map((p, i) => (
                  <button
                    key={i}
                    className={`w-10 h-10 rounded-[8px] flex items-center justify-center text-[14px] font-medium transition-colors ${
                      p === 1 ? 'bg-[#f0f1ff] text-[#0e1680]' : 'text-[#667085] hover:bg-gray-50'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
              <button className="flex items-center gap-2 px-3.5 py-2 border border-[#d0d5dd] rounded-[8px] text-[14px] font-medium text-[#344054] bg-white hover:bg-gray-50 transition-colors shadow-sm">
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Footer Action */}
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleSave}
              className="px-6 py-2.5 bg-[#0e1680] text-white text-[16px] font-semibold rounded-[8px] shadow-sm hover:bg-[#0a1060] transition-colors"
            >
              Save
            </button>
          </div>
        </>
      ) : (
        <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto mt-8">
          <div className="bg-white border border-[#eaecf0] rounded-[12px] p-8 shadow-sm text-center flex flex-col items-center">
             <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                <UploadCloud className="w-8 h-8 text-[#0e1680]" />
             </div>
             <h3 className="text-lg font-semibold text-[#101828] mb-2">Upload Attendance Sheet</h3>
             <p className="text-[#667085] text-sm mb-6 max-w-md">
               Download the template below, fill in the offline attendance records, and upload the bulk sheet here to process blockwise attendance.
             </p>
             <div className="flex gap-4">
               <button className="px-5 py-2.5 bg-white border border-[#d0d5dd] text-[#344054] font-semibold rounded-[8px] hover:bg-gray-50 transition-colors shadow-sm">
                 Download Template
               </button>
               <button onClick={handleSave} className="px-5 py-2.5 bg-[#0e1680] text-white font-semibold rounded-[8px] hover:bg-[#0a1060] transition-colors shadow-sm">
                 Upload File
               </button>
             </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      <FeedbackModal
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
        type="success"
        title="Attendance submitted successfully!"
        backLabel="Back"
      />
    </div>
  );
};
