import React, { useState } from 'react';
import { Calendar, ChevronDown, X } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface Student {
  id: number;
  studentId: string;
  name: string;
  seatNo: string;
  isAbsent: boolean;
}

const mockStudents: Student[] = [
  { id: 1, studentId: 'VU4S23242019', name: 'xyzsyzsyz', seatNo: '12901', isAbsent: false },
  { id: 2, studentId: 'VU4S23242023', name: 'abcabc', seatNo: '12902', isAbsent: false },
  { id: 3, studentId: 'VU4S23242023', name: 'abcabc', seatNo: '12902', isAbsent: false },
  { id: 4, studentId: 'VU4S23242023', name: 'abcabc', seatNo: '12902', isAbsent: true },
  { id: 5, studentId: 'VU4S23242023', name: 'abcabc', seatNo: '12902', isAbsent: false },
  { id: 6, studentId: 'VU4S23242023', name: 'abcabc', seatNo: '12902', isAbsent: false },
  { id: 7, studentId: 'VU4S23242023', name: 'abcabc', seatNo: '12902', isAbsent: false },
  { id: 8, studentId: 'VU4S23242023', name: 'abcabc', seatNo: '12902', isAbsent: true },
  { id: 9, studentId: 'VU4S23242023', name: 'abcabc', seatNo: '12902', isAbsent: false },
  { id: 10, studentId: 'VU4S23242023', name: 'abcabc', seatNo: '12902', isAbsent: false },
  { id: 11, studentId: 'VU4S23242024', name: 'johndoe', seatNo: '12903', isAbsent: false },
];

export const AbsentReportingScreen: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  
  // Button click states for color changing
  const [submitBtnClicked, setSubmitBtnClicked] = useState(false);
  const [resetBtnClicked, setResetBtnClicked] = useState(false);
  const [viewBtnClicked, setViewBtnClicked] = useState(false);

  const [isSubmitConfirmOpen, setIsSubmitConfirmOpen] = useState(false);
  const [isSubmitSuccessOpen, setIsSubmitSuccessOpen] = useState(false);
  
  const [isViewMode, setIsViewMode] = useState(false);
  const [isDownloadSuccessOpen, setIsDownloadSuccessOpen] = useState(false);

  const absentStudents = students.filter(s => s.isAbsent);

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Absent Reporting', 14, 20);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Session:  Summer 2026', 14, 32);
    doc.text('Block:  Block A', 14, 40);
    doc.text('Subject:  Data structure', 14, 48);
    doc.text('Date:  11/05/2026', 14, 56);
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Absent Students', 14, 72);

    autoTable(doc, {
      startY: 78,
      head: [['sr.no', 'Student ID', 'Student Name', 'Seat no', 'Attendance', 'Mark absent']],
      body: absentStudents.map((s, idx) => [
        (idx + 1).toString(),
        s.studentId,
        s.name,
        s.seatNo,
        'Absent',
        'Yes'
      ]),
      theme: 'grid',
      styles: { halign: 'center', cellPadding: 6, fontSize: 10 },
      headStyles: { fillColor: [249, 250, 251], textColor: [71, 84, 103], fontStyle: 'bold', lineWidth: 0.1, lineColor: [228, 231, 236] },
      bodyStyles: { textColor: [102, 112, 133], lineWidth: 0.1, lineColor: [228, 231, 236] },
      alternateRowStyles: { fillColor: [255, 255, 255] }
    });

    doc.save('Absentee_Report.pdf');
    setIsDownloadSuccessOpen(true);
  };

  const handleLoadStudents = () => {
    setStudents(mockStudents.map(s => ({ ...s }))); // Deep copy
    setIsLoaded(true);
    setCurrentPage(1);
    setSubmitBtnClicked(false);
    setResetBtnClicked(false);
    setViewBtnClicked(false);
  };

  const handleToggleAbsent = (id: number) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, isAbsent: !s.isAbsent } : s));
  };

  const handleReset = () => {
    setResetBtnClicked(true);
    setStudents(mockStudents.map(s => ({ ...s }))); // Reset to initial mock
    setIsLoaded(false); // Hide the table so user must click Load students again
  };

  const totalPages = Math.ceil(students.length / itemsPerPage);
  const paginatedData = students.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  if (isViewMode) {
    const viewTotalPages = Math.ceil(absentStudents.length / itemsPerPage);
    const viewPaginatedData = absentStudents.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    
    return (
      <div className="flex flex-col gap-8 animate-in fade-in duration-300">
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-2 gap-y-4 max-w-[500px]">
            <div className="flex items-center gap-4">
              <span className="text-[14px] font-bold text-[#101828] w-[100px]">Session:</span>
              <span className="text-[14px] text-[#475467]">Summer 2026</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-[14px] font-bold text-[#101828] w-[100px]">Block:</span>
              <span className="text-[14px] text-[#475467]">Block A</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-[14px] font-bold text-[#101828] w-[100px]">Subject:</span>
              <span className="text-[14px] text-[#475467]">Data structure</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-[14px] font-bold text-[#101828] w-[100px]">Date:</span>
              <span className="text-[14px] text-[#475467]">11/05/2026</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <h2 className="text-[16px] font-semibold text-[#101828]">Absent Students</h2>
          <div className="bg-white border border-[#e4e7ec] rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-center border-collapse whitespace-nowrap">
                <thead>
                  <tr className="bg-[#f9fafb] border-b border-[#e4e7ec]">
                    <th className="py-4 px-6 text-[12px] font-semibold text-[#667085] w-20">sr.no</th>
                    <th className="py-4 px-6 text-[12px] font-semibold text-[#667085]">Student ID</th>
                    <th className="py-4 px-6 text-[12px] font-semibold text-[#667085]">Student Name</th>
                    <th className="py-4 px-6 text-[12px] font-semibold text-[#667085]">Seat no</th>
                    <th className="py-4 px-6 text-[12px] font-semibold text-[#667085]">Attendance</th>
                    <th className="py-4 px-6 text-[12px] font-semibold text-[#667085]">Mark absent</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e4e7ec]">
                  {viewPaginatedData.map((student, idx) => (
                    <tr key={student.id} className="hover:bg-gray-50/50">
                      <td className="py-4 px-6 text-[14px] text-[#475467]">{(currentPage - 1) * itemsPerPage + idx + 1}</td>
                      <td className="py-4 px-6 text-[14px] text-[#475467]">{student.studentId}</td>
                      <td className="py-4 px-6 text-[14px] text-[#475467]">{student.name}</td>
                      <td className="py-4 px-6 text-[14px] text-[#475467]">{student.seatNo}</td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center justify-center px-2.5 py-0.5 text-[12px] font-medium rounded-full bg-red-50 text-red-600 border border-red-200">
                          Absent
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex justify-center">
                          <input 
                            type="checkbox" 
                            checked={true}
                            readOnly
                            className="w-4 h-4 text-[#0E1680] bg-white border-[#d0d5dd] rounded focus:ring-[#0E1680] opacity-70 pointer-events-none"
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="h-[68px] border-t border-[#e4e7ec] px-6 flex items-center justify-between bg-white">
              <button 
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1 || viewTotalPages === 0}
                className="flex items-center gap-2 px-4 py-2 border border-[#d0d5dd] rounded-lg text-[14px] font-semibold text-[#344054] hover:bg-gray-50 transition-all shadow-sm cursor-pointer disabled:opacity-50"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M5 12L12 19M5 12L12 5"/></svg>
                <span>Previous</span>
              </button>
              <div className="flex items-center gap-1">
                {Array.from({ length: viewTotalPages }, (_, i) => i + 1).map((page) => (
                  <button 
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 flex items-center justify-center text-[14px] font-semibold rounded-lg ${
                      currentPage === page 
                      ? 'text-[#0E1680] bg-[#f0f1fd] font-bold' 
                      : 'text-[#475467] hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              <button 
                onClick={() => setCurrentPage(Math.min(viewTotalPages, currentPage + 1))}
                disabled={currentPage === viewTotalPages || viewTotalPages === 0}
                className="flex items-center gap-2 px-4 py-2 border border-[#d0d5dd] rounded-lg text-[14px] font-semibold text-[#344054] hover:bg-gray-50 transition-all shadow-sm cursor-pointer disabled:opacity-50"
              >
                <span>Next</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12H19M19 12L12 5M19 12L12 19"/></svg>
              </button>
            </div>
          </div>

          <div className="flex justify-end items-center gap-4 mt-2">
            <button 
              onClick={() => {
                setIsViewMode(false);
                setCurrentPage(1);
              }}
              className="px-6 py-2.5 bg-white border border-[#d0d5dd] text-[#344054] text-[14px] font-semibold rounded-lg shadow-sm hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Back
            </button>
            <button 
              onClick={handleDownloadPDF}
              className="px-6 py-2.5 bg-[#0E1680] hover:bg-[#0b126c] text-white text-[14px] font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              Download report as pdf
            </button>
          </div>
        </div>

        {/* ── DOWNLOAD SUCCESS MODAL ── */}
        {isDownloadSuccessOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center font-sans bg-black/55 backdrop-blur-[4px] animate-in fade-in duration-200">
            <div className="bg-white flex flex-col items-center justify-center rounded-[20px] shadow-2xl w-[510px] min-h-[424px] p-[20px] py-[45px] animate-in zoom-in-95 duration-200">
              <div className="flex flex-col items-center w-full px-8 gap-[28px] justify-center">
                <div className="flex items-center justify-center p-[10px] rounded-[8px] w-[136px] h-[136px]">
                  <svg viewBox="0 0 104.667 104.667" className="w-[104px] h-[104px]" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100.667 47.9143V52.361C100.661 62.7837 97.2858 72.9253 91.0451 81.2732C84.8045 89.621 76.0325 95.728 66.0376 98.6832C56.0426 101.638 45.3601 101.284 35.5833 97.6715C25.8065 94.0595 17.4592 87.3838 11.7863 78.6402C6.11346 69.8965 3.41899 59.5533 4.10477 49.1532C4.79055 38.7531 8.81984 28.8532 15.5917 20.9302C22.3635 13.0071 31.5151 7.48535 41.6816 5.18837C51.848 2.8914 62.4846 3.9423 72.005 8.18434M100.667 13.6667L52.3333 62.0483L37.8333 47.5483" stroke="#81D66A" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h2 className="text-[24px] font-semibold text-[#101828] text-center max-w-[444px] leading-snug">
                  Report Downloaded<br/>Successfully!
                </h2>
                <button 
                  onClick={() => setIsDownloadSuccessOpen(false)} 
                  className="mt-2 w-[100px] h-[44px] bg-[#0E1680] hover:bg-[#0b126c] flex items-center justify-center rounded-[8px] transition-colors cursor-pointer text-white font-semibold text-[16px]"
                >
                  Back
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-300">
      
      {/* Filters Section */}
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-2 gap-x-12 gap-y-6">
          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-medium text-[#344054]">Select Session</label>
            <div className="relative">
              <select className="w-full h-11 pl-4 pr-10 bg-white border border-[#d0d5dd] rounded-lg text-[14px] text-[#101828] appearance-none focus:outline-none focus:border-[#9BA3F2] focus:ring-1 focus:ring-[#9BA3F2] shadow-sm cursor-pointer">
                <option>Summer 2026</option>
                <option>Winter 2026</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-[#667085] pointer-events-none" size={18} />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-medium text-[#344054]">Select block</label>
            <div className="relative">
              <select className="w-full h-11 pl-4 pr-10 bg-white border border-[#d0d5dd] rounded-lg text-[14px] text-[#101828] appearance-none focus:outline-none focus:border-[#9BA3F2] focus:ring-1 focus:ring-[#9BA3F2] shadow-sm cursor-pointer">
                <option>Block A</option>
                <option>Block B</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-[#667085] pointer-events-none" size={18} />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-medium text-[#344054]">Select Subject</label>
            <div className="relative">
              <select className="w-full h-11 pl-4 pr-10 bg-white border border-[#d0d5dd] rounded-lg text-[14px] text-[#475467] appearance-none focus:outline-none focus:border-[#9BA3F2] focus:ring-1 focus:ring-[#9BA3F2] shadow-sm cursor-pointer">
                <option>Data Structures</option>
                <option>Operating Systems</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-[#667085] pointer-events-none" size={18} />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-medium text-[#344054]">Select date</label>
            <div className="relative">
              <input 
                type="text" 
                defaultValue="11/05/2026"
                className="w-full h-11 pl-4 pr-10 bg-white border border-[#d0d5dd] rounded-lg text-[14px] text-[#475467] focus:outline-none focus:border-[#9BA3F2] focus:ring-1 focus:ring-[#9BA3F2] shadow-sm"
              />
              <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-[#667085]" size={18} />
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-2">
          <button 
            onClick={handleLoadStudents}
            className="px-6 py-2.5 bg-[#0E1680] hover:bg-[#0b126c] text-white text-[14px] font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            Load students
          </button>
        </div>
      </div>

      {/* Table Section */}
      {isLoaded && (
        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="bg-white border border-[#e4e7ec] rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-center border-collapse whitespace-nowrap">
                <thead>
                  <tr className="bg-[#f9fafb] border-b border-[#e4e7ec]">
                    <th className="py-4 px-6 text-[12px] font-semibold text-[#667085] w-20">sr.no</th>
                    <th className="py-4 px-6 text-[12px] font-semibold text-[#667085]">Student ID</th>
                    <th className="py-4 px-6 text-[12px] font-semibold text-[#667085]">Student Name</th>
                    <th className="py-4 px-6 text-[12px] font-semibold text-[#667085]">Seat no</th>
                    <th className="py-4 px-6 text-[12px] font-semibold text-[#667085]">Attendance</th>
                    <th className="py-4 px-6 text-[12px] font-semibold text-[#667085]">Mark absent</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e4e7ec]">
                  {paginatedData.map((student, idx) => (
                    <tr key={student.id} className="hover:bg-gray-50/50">
                      <td className="py-4 px-6 text-[14px] text-[#475467]">{(currentPage - 1) * itemsPerPage + idx + 1}</td>
                      <td className="py-4 px-6 text-[14px] text-[#475467]">{student.studentId}</td>
                      <td className="py-4 px-6 text-[14px] text-[#475467]">{student.name}</td>
                      <td className="py-4 px-6 text-[14px] text-[#475467]">{student.seatNo}</td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center justify-center px-2.5 py-0.5 text-[12px] font-medium rounded-full ${
                          student.isAbsent 
                            ? 'bg-red-50 text-red-600 border border-red-200' 
                            : 'bg-green-50 text-green-600 border border-green-200'
                        }`}>
                          {student.isAbsent ? 'Absent' : 'Present'}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex justify-center">
                          <input 
                            type="checkbox" 
                            checked={student.isAbsent}
                            onChange={() => handleToggleAbsent(student.id)}
                            className="w-4 h-4 text-[#0E1680] bg-white border-[#d0d5dd] rounded focus:ring-[#0E1680] cursor-pointer"
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="h-[68px] border-t border-[#e4e7ec] px-6 flex items-center justify-between bg-white">
              <button 
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="flex items-center gap-2 px-4 py-2 border border-[#d0d5dd] rounded-lg text-[14px] font-semibold text-[#344054] hover:bg-gray-50 transition-all shadow-sm cursor-pointer disabled:opacity-50"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M5 12L12 19M5 12L12 5"/></svg>
                <span>Previous</span>
              </button>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button 
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 flex items-center justify-center text-[14px] font-semibold rounded-lg ${
                      currentPage === page 
                      ? 'text-[#0E1680] bg-[#f0f1fd] font-bold' 
                      : 'text-[#475467] hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              <button 
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="flex items-center gap-2 px-4 py-2 border border-[#d0d5dd] rounded-lg text-[14px] font-semibold text-[#344054] hover:bg-gray-50 transition-all shadow-sm cursor-pointer disabled:opacity-50"
              >
                <span>Next</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12H19M19 12L12 5M19 12L12 19"/></svg>
              </button>
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="flex justify-end items-center gap-4 mt-2">
            <button 
              onClick={() => {
                setSubmitBtnClicked(true);
                setIsSubmitConfirmOpen(true);
              }}
              className={`px-6 py-2.5 text-white text-[14px] font-semibold rounded-lg shadow-sm transition-colors cursor-pointer ${
                submitBtnClicked ? 'bg-[#9BA3F2] hover:bg-[#8089eb]' : 'bg-[#0E1680] hover:bg-[#0b126c]'
              }`}
            >
              Submit absentee report
            </button>
            <button 
              onClick={handleReset}
              className={`px-6 py-2.5 text-white text-[14px] font-semibold rounded-lg shadow-sm transition-colors cursor-pointer ${
                resetBtnClicked ? 'bg-[#9BA3F2] hover:bg-[#8089eb]' : 'bg-[#0E1680] hover:bg-[#0b126c]'
              }`}
            >
              Reset
            </button>
            <button 
              onClick={() => {
                setViewBtnClicked(true);
                setIsViewMode(true);
                setCurrentPage(1); // Reset page for view mode
              }}
              className={`px-6 py-2.5 text-white text-[14px] font-semibold rounded-lg shadow-sm transition-colors cursor-pointer ${
                viewBtnClicked ? 'bg-[#9BA3F2] hover:bg-[#8089eb]' : 'bg-[#0E1680] hover:bg-[#0b126c]'
              }`}
            >
              View report
            </button>
          </div>
        </div>
      )}

      {/* ── SUBMIT CONFIRM MODAL ── */}
      {isSubmitConfirmOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center font-sans bg-black/55 backdrop-blur-[4px] animate-in fade-in duration-200">
          <div className="bg-white flex flex-col items-center justify-center rounded-[20px] shadow-2xl w-[510px] min-h-[400px] p-[20px] py-[45px] animate-in zoom-in-95 duration-200">
            <div className="flex flex-col items-center w-full px-8 gap-[24px] justify-center text-center">
              <div className="flex items-center justify-center">
                <svg width="104" height="104" viewBox="0 0 104 104" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="52" cy="52" r="48" stroke="#F04438" strokeWidth="8"/>
                  <path d="M52 32V56" stroke="#F04438" strokeWidth="8" strokeLinecap="round"/>
                  <circle cx="52" cy="72" r="4" fill="#F04438"/>
                </svg>
              </div>
              <div className="flex flex-col gap-2">
                <h2 className="text-[20px] font-bold text-[#101828] max-w-[360px] leading-snug">
                  You are about to submit the absentee report.
                </h2>
                <h2 className="text-[20px] font-bold text-[#101828] max-w-[360px] leading-snug">
                  This will be recorded as official data.
                </h2>
              </div>
              <div className="flex items-center gap-4 mt-4">
                <button 
                  onClick={() => {
                    setIsSubmitConfirmOpen(false);
                    setIsSubmitSuccessOpen(true);
                  }} 
                  className="w-[120px] h-[44px] bg-[#0E1680] hover:bg-[#0b126c] flex items-center justify-center rounded-[8px] transition-colors cursor-pointer text-white font-semibold text-[16px]"
                >
                  Confirm
                </button>
                <button 
                  onClick={() => setIsSubmitConfirmOpen(false)} 
                  className="w-[120px] h-[44px] bg-[#0E1680] hover:bg-[#0b126c] flex items-center justify-center rounded-[8px] transition-colors cursor-pointer text-white font-semibold text-[16px]"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── SUBMIT SUCCESS MODAL ── */}
      {isSubmitSuccessOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center font-sans bg-black/55 backdrop-blur-[4px] animate-in fade-in duration-200">
          <div className="bg-white flex flex-col items-center justify-center rounded-[20px] shadow-2xl w-[510px] min-h-[424px] p-[20px] py-[45px] animate-in zoom-in-95 duration-200">
            <div className="flex flex-col items-center w-full px-8 gap-[28px] justify-center">
              <div className="flex items-center justify-center p-[10px] rounded-[8px] w-[136px] h-[136px]">
                <svg viewBox="0 0 104.667 104.667" className="w-[104px] h-[104px]" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M100.667 47.9143V52.361C100.661 62.7837 97.2858 72.9253 91.0451 81.2732C84.8045 89.621 76.0325 95.728 66.0376 98.6832C56.0426 101.638 45.3601 101.284 35.5833 97.6715C25.8065 94.0595 17.4592 87.3838 11.7863 78.6402C6.11346 69.8965 3.41899 59.5533 4.10477 49.1532C4.79055 38.7531 8.81984 28.8532 15.5917 20.9302C22.3635 13.0071 31.5151 7.48535 41.6816 5.18837C51.848 2.8914 62.4846 3.9423 72.005 8.18434M100.667 13.6667L52.3333 62.0483L37.8333 47.5483" stroke="#81D66A" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h2 className="text-[24px] font-semibold text-[#101828] text-center max-w-[444px] leading-snug">
                Absentee Report Submitted<br/>Successfully
              </h2>
              <button 
                onClick={() => setIsSubmitSuccessOpen(false)} 
                className="mt-2 w-[100px] h-[44px] bg-[#0E1680] hover:bg-[#0b126c] flex items-center justify-center rounded-[8px] transition-colors cursor-pointer text-white font-semibold text-[16px]"
              >
                Back
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
