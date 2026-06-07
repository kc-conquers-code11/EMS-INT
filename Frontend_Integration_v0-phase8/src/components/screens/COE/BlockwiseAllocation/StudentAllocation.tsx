import React, { useState } from 'react';
import { Search, ChevronDown, CheckCircle, ChevronLeft, ChevronRight, Mail, UserCheck } from 'lucide-react';
import { SuccessModal } from './SuccessModal';

interface StudentRow {
  srNo: number;
  studentId: string;
  studentName: string;
  checked: boolean;
}

const INITIAL_STUDENTS: StudentRow[] = [
  { srNo: 1, studentId: 'vu4s2425001', studentName: 'XYZ', checked: true },
  { srNo: 2, studentId: 'vu4s2425002', studentName: 'abc', checked: true },
  { srNo: 3, studentId: 'vu4s2425003', studentName: 'ncd', checked: true },
  { srNo: 4, studentId: 'vu4s2425004', studentName: 'pqr', checked: true },
  { srNo: 5, studentId: 'vu4s2425004', studentName: 'pqr', checked: true },
  { srNo: 6, studentId: 'vu4s2425004', studentName: 'pqr', checked: true },
];

export const StudentAllocation: React.FC = () => {
  const [floor, setFloor] = useState('1');
  const [room, setRoom] = useState('1');
  const [branch, setBranch] = useState('IT');
  const [year, setYear] = useState('TE');
  const [division, setDivision] = useState('A');
  const [selectStudentsCount, setSelectStudentsCount] = useState('30');
  const [students, setStudents] = useState<StudentRow[]>(INITIAL_STUDENTS);
  const [supervisor, setSupervisor] = useState('Prof. Nilesh Mali');
  
  const [currentPage, setCurrentPage] = useState(1);
  const [toastMessage, setToastMessage] = useState<{ title: string; desc: string; type: 'success' | 'info' } | null>(null);
  
  const [showStudentSuccessModal, setShowStudentSuccessModal] = useState(false);
  const [showSupervisorSuccessModal, setShowSupervisorSuccessModal] = useState(false);
  const [showMailSuccessModal, setShowMailSuccessModal] = useState(false);

  const triggerToast = (title: string, desc: string, type: 'success' | 'info' = 'success') => {
    setToastMessage({ title, desc, type });
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCheckboxChange = (srNo: number) => {
    setStudents(prev =>
      prev.map(s => (s.srNo === srNo ? { ...s, checked: !s.checked } : s))
    );
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    setStudents(prev => prev.map(s => ({ ...s, checked: isChecked })));
  };

  return (
    <div className="bg-white border border-[#e4e7ec] rounded-2xl p-8 shadow-sm flex flex-col gap-6 max-w-4xl font-['Instrument_Sans'] relative overflow-hidden">
      
      {/* ── Saved Toast Notification ── */}
      {toastMessage && (
        <div className={`absolute top-4 right-4 border rounded-xl px-4 py-3 shadow-md flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300 z-50 ${
          toastMessage.type === 'success'
            ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
            : 'bg-blue-50 border-blue-200 text-blue-800'
        }`}>
          <CheckCircle size={18} className={toastMessage.type === 'success' ? 'text-emerald-600' : 'text-blue-600'} />
          <div className="flex flex-col">
            <span className="text-[13px] font-semibold leading-tight">{toastMessage.title}</span>
            <span className="text-[11px] leading-tight opacity-90">{toastMessage.desc}</span>
          </div>
        </div>
      )}

      {/* ── Success Modal Overlay: Student Block Allocation (Figma Node 15894-119967) ── */}
      <SuccessModal 
        isOpen={showStudentSuccessModal} 
        title="Block allocated to student successfully !!" 
        onClose={() => setShowStudentSuccessModal(false)} 
      />

      {/* ── Success Modal Overlay: Supervisor Allocation (Figma Node 15895-124568) ── */}
      <SuccessModal 
        isOpen={showSupervisorSuccessModal} 
        title="Supervisor allocated successfully !!" 
        onClose={() => setShowSupervisorSuccessModal(false)} 
      />

      {/* ── Success Modal Overlay: Email Sent to Supervisor (Figma Node 15895-125307) ── */}
      <SuccessModal 
        isOpen={showMailSuccessModal} 
        title="E-Mail sent to supervisor successfully !!" 
        onClose={() => setShowMailSuccessModal(false)} 
      />

      {/* ── Filter Fields Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Select Floor */}
        <div className="flex flex-col gap-2">
          <label className="text-[13px] font-semibold text-[#344054]">
            Select floor
          </label>
          <div className="relative">
            <select
              value={floor}
              onChange={e => setFloor(e.target.value)}
              className="w-full appearance-none bg-white border border-[#d0d5dd] rounded-lg px-4 py-3 text-[14px] text-[#101828] focus:outline-none focus:ring-2 focus:ring-[#0e1680]/20 focus:border-[#0e1680] transition-all cursor-pointer"
            >
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
            </select>
            <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#667085] pointer-events-none" />
          </div>
        </div>

        {/* Select Room */}
        <div className="flex flex-col gap-2">
          <label className="text-[13px] font-semibold text-[#344054]">
            Select room
          </label>
          <div className="relative">
            <select
              value={room}
              onChange={e => setRoom(e.target.value)}
              className="w-full appearance-none bg-white border border-[#d0d5dd] rounded-lg px-4 py-3 text-[14px] text-[#101828] focus:outline-none focus:ring-2 focus:ring-[#0e1680]/20 focus:border-[#0e1680] transition-all cursor-pointer"
            >
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
            </select>
            <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#667085] pointer-events-none" />
          </div>
        </div>

        {/* Select Branch */}
        <div className="flex flex-col gap-2">
          <label className="text-[13px] font-semibold text-[#344054]">
            Select branch
          </label>
          <div className="relative">
            <select
              value={branch}
              onChange={e => setBranch(e.target.value)}
              className="w-full appearance-none bg-white border border-[#d0d5dd] rounded-lg px-4 py-3 text-[14px] text-[#101828] focus:outline-none focus:ring-2 focus:ring-[#0e1680]/20 focus:border-[#0e1680] transition-all cursor-pointer"
            >
              <option value="IT">IT</option>
              <option value="CS">Computer Science</option>
              <option value="EXTC">Electronics & Telecom</option>
            </select>
            <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#667085] pointer-events-none" />
          </div>
        </div>

        {/* Select Year */}
        <div className="flex flex-col gap-2">
          <label className="text-[13px] font-semibold text-[#344054]">
            Select year
          </label>
          <div className="relative">
            <select
              value={year}
              onChange={e => setYear(e.target.value)}
              className="w-full appearance-none bg-white border border-[#d0d5dd] rounded-lg px-4 py-3 text-[14px] text-[#101828] focus:outline-none focus:ring-2 focus:ring-[#0e1680]/20 focus:border-[#0e1680] transition-all cursor-pointer"
            >
              <option value="TE">TE</option>
              <option value="SE">SE</option>
              <option value="BE">BE</option>
            </select>
            <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#667085] pointer-events-none" />
          </div>
        </div>

        {/* Select Division */}
        <div className="flex flex-col gap-2 md:col-span-2">
          <label className="text-[13px] font-semibold text-[#344054]">
            Select division
          </label>
          <div className="relative">
            <select
              value={division}
              onChange={e => setDivision(e.target.value)}
              className="w-full appearance-none bg-white border border-[#d0d5dd] rounded-lg px-4 py-3 text-[14px] text-[#101828] focus:outline-none focus:ring-2 focus:ring-[#0e1680]/20 focus:border-[#0e1680] transition-all cursor-pointer"
            >
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
            </select>
            <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#667085] pointer-events-none" />
          </div>
        </div>
      </div>

      {/* ── Select Students Form Block ── */}
      <div className="border-t border-[#e4e7ec] pt-6 flex flex-col md:flex-row items-end gap-3">
        <div className="flex flex-col gap-2 flex-1 w-full">
          <label className="text-[13px] font-semibold text-[#344054]">
            Select students
          </label>
          <input
            type="text"
            value={selectStudentsCount}
            onChange={e => setSelectStudentsCount(e.target.value)}
            className="w-full bg-white border border-[#d0d5dd] rounded-lg px-4 py-3 text-[14px] text-[#101828] focus:outline-none focus:ring-2 focus:ring-[#0e1680]/20 focus:border-[#0e1680] transition-all"
            placeholder="30"
          />
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto shrink-0 justify-end">
          <button
            onClick={() => setShowStudentSuccessModal(true)}
            className="px-6 py-3 bg-[#0e1680] text-white text-[14px] font-semibold rounded-lg hover:bg-[#0b1260] transition-colors shadow-sm whitespace-nowrap"
          >
            Allocate
          </button>
          <button
            onClick={() => triggerToast('Allocated Students', 'Batch allocation complete.')}
            className="px-6 py-3 bg-[#0e1680] text-white text-[14px] font-semibold rounded-lg hover:bg-[#0b1260] transition-colors shadow-sm whitespace-nowrap"
          >
            Allocate Students
          </button>
          <button
            onClick={() => triggerToast('Search Finished', 'Filter criteria updated successfully.', 'info')}
            className="flex items-center gap-2 px-6 py-3 bg-[#0e1680] text-white text-[14px] font-semibold rounded-lg hover:bg-[#0b1260] transition-colors shadow-sm whitespace-nowrap"
          >
            <span>Search</span>
            <Search size={16} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* ── Students Allocation Table ── */}
      <div className="w-full overflow-x-auto rounded-xl border border-[#e4e7ec] bg-white shadow-sm mt-4">
        <table className="w-full text-[14px] text-[#101828]">
          <thead>
            <tr className="border-b border-[#e4e7ec] bg-gray-50/50">
              <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider text-left text-[#667085] w-20">Sr no.</th>
              <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider text-left text-[#667085]">Student ID</th>
              <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider text-left text-[#667085]">Student Name</th>
              <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider text-right text-[#667085] w-20">
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={students.every(s => s.checked)}
                  className="w-4 h-4 text-[#0e1680] border-gray-300 rounded focus:ring-[#0e1680] cursor-pointer"
                />
              </th>
            </tr>
          </thead>
          <tbody>
            {students.map(row => (
              <tr
                key={row.srNo}
                className="border-b border-[#e4e7ec] last:border-0 hover:bg-[#fafafa] transition-colors"
              >
                <td className="px-8 py-6 text-[15px] font-medium text-[#344054]">{row.srNo}</td>
                <td className="px-8 py-6 text-[15px] font-medium text-[#344054]">{row.studentId}</td>
                <td className="px-8 py-6 text-[15px] font-medium text-[#344054]">{row.studentName}</td>
                <td className="px-8 py-6 text-[15px] font-medium text-right">
                  <input
                    type="checkbox"
                    checked={row.checked}
                    onChange={() => handleCheckboxChange(row.srNo)}
                    className="w-4 h-4 text-[#0e1680] border-gray-300 rounded focus:ring-[#0e1680] cursor-pointer"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Table Pagination ── */}
      <div className="flex items-center justify-between border-t border-[#e4e7ec] pt-4 mt-2">
        <button
          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
          disabled={currentPage === 1}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#d0d5dd] text-[13px] font-medium text-[#344054] hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft size={15} /> Previous
        </button>

        <div className="flex items-center gap-0.5">
          {[1, 2, 3, '...', 8, 9, 10].map((p, i) =>
            p === '...' ? (
              <span key={`ell-${i}`} className="px-2 text-[13px] text-[#667085]">...</span>
            ) : (
              <button
                key={p}
                onClick={() => setCurrentPage(p as number)}
                className={`w-8 h-8 rounded-lg text-[13px] font-medium transition-colors ${
                  currentPage === p ? 'bg-[#0e1680] text-white' : 'text-[#667085] hover:bg-gray-100'
                }`}
              >
                {p}
              </button>
            )
          )}
        </div>

        <button
          onClick={() => setCurrentPage(prev => Math.min(10, prev + 1))}
          disabled={currentPage === 10}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#d0d5dd] text-[13px] font-medium text-[#344054] hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Next <ChevronRight size={15} />
        </button>
      </div>

      {/* ── Allocate Supervisor Dropdown ── */}
      <div className="border-t border-[#e4e7ec] pt-6 flex flex-col gap-2">
        <label className="text-[13px] font-semibold text-[#344054]">
          Allocate supervisor
        </label>
        <div className="relative">
          <select
            value={supervisor}
            onChange={e => setSupervisor(e.target.value)}
            className="w-full appearance-none bg-white border border-[#d0d5dd] rounded-lg px-4 py-3 text-[14px] text-[#101828] focus:outline-none focus:ring-2 focus:ring-[#0e1680]/20 focus:border-[#0e1680] transition-all cursor-pointer"
          >
            <option value="Prof. Nilesh Mali">Prof. Nilesh Mali</option>
            <option value="Prof. Amit Sharma">Prof. Amit Sharma</option>
            <option value="Dr. Snehal Patel">Dr. Snehal Patel</option>
          </select>
          <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#667085] pointer-events-none" />
        </div>
      </div>

      {/* ── Bottom Right Action Buttons ── */}
      <div className="flex justify-end gap-3 mt-4 border-t border-[#e4e7ec] pt-6">
        <button
          onClick={() => setShowMailSuccessModal(true)}
          className="flex items-center gap-2 px-6 py-2.5 border border-[#ced5fb] text-[#0e1680] text-[14px] font-semibold rounded-lg hover:bg-[#f0f1fd] transition-colors"
        >
          <Mail size={16} />
          <span>Send mail of allocation</span>
        </button>
        <button
          onClick={() => setShowSupervisorSuccessModal(true)}
          className="flex items-center gap-2 px-6 py-2.5 bg-[#0e1680] text-white text-[14px] font-semibold rounded-lg hover:bg-[#0b1260] transition-colors shadow-sm"
        >
          <UserCheck size={16} />
          <span>Allocate</span>
        </button>
      </div>

    </div>
  );
};
