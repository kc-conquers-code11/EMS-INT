import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const ViewExamAllocationTable: React.FC = () => {
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const allTableData = [
    { id: 1, room: '213', date: '20/05/26', session: '2:00 to 3:00 pm', subject: 'Automata Theory' },
    { id: 2, room: '203', date: '20/05/26', session: '2:00 to 3:00 pm', subject: 'Networking' },
    { id: 3, room: '312', date: '20/05/26', session: '2:00 to 3:00 pm', subject: 'Operating System' },
    { id: 4, room: '101', date: '21/05/26', session: '10:00 to 11:00 am', subject: 'Database Management' },
    { id: 5, room: '102', date: '21/05/26', session: '10:00 to 11:00 am', subject: 'Data Structures' },
    { id: 6, room: '105', date: '22/05/26', session: '2:00 to 3:00 pm', subject: 'Machine Learning' },
    { id: 7, room: '210', date: '22/05/26', session: '2:00 to 3:00 pm', subject: 'Artificial Intelligence' },
    { id: 8, room: '304', date: '23/05/26', session: '9:00 to 10:00 am', subject: 'Computer Graphics' },
    { id: 9, room: '305', date: '23/05/26', session: '9:00 to 10:00 am', subject: 'Compiler Design' },
    { id: 10, room: '401', date: '24/05/26', session: '2:00 to 3:00 pm', subject: 'Software Engineering' },
    { id: 11, room: '402', date: '24/05/26', session: '2:00 to 3:00 pm', subject: 'Cloud Computing' },
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(allTableData.length / itemsPerPage);
  const paginatedData = allTableData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleExport = () => {
    const ws = XLSX.utils.json_to_sheet(allTableData.map(row => ({
      'Room/Block No': row.room,
      'Date': row.date,
      'Exam Session': row.session,
      'Subject': row.subject
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "ExamAllocation");
    XLSX.writeFile(wb, "Exam_Allocation.xlsx");
    setIsExportModalOpen(true);
  };

  const handleDownload = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('View Exam Allocation', 14, 20);
    
    autoTable(doc, {
      startY: 30,
      head: [['Room/Block No', 'Date', 'Exam Session', 'Subject']],
      body: allTableData.map(row => [row.room, row.date, row.session, row.subject]),
      theme: 'grid',
      styles: { halign: 'center', cellPadding: 6 },
      headStyles: { fillColor: [249, 250, 251], textColor: [102, 112, 133], fontStyle: 'bold', lineWidth: 0.1, lineColor: [228, 231, 236] },
      bodyStyles: { textColor: [71, 84, 103], lineWidth: 0.1, lineColor: [228, 231, 236] },
      alternateRowStyles: { fillColor: [255, 255, 255] }
    });

    doc.save('Exam_Allocation.pdf');
    setIsDownloadModalOpen(true);
  };

  return (
    <div className="flex flex-col gap-6 w-full animate-in fade-in zoom-in-95 duration-200">
      
      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 w-full -mt-16">
        <button 
          onClick={handleExport}
          className="flex items-center justify-center gap-2 px-6 py-2.5 bg-[#0E1680] hover:bg-[#0b126c] text-white text-[14px] font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z" fill="#107C41" stroke="#107C41" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M14 2V8H20" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M8 13L16 19M16 13L8 19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Export
        </button>
        <button 
          onClick={handleDownload}
          className="flex items-center justify-center gap-2 px-6 py-2.5 bg-[#0E1680] hover:bg-[#0b126c] text-white text-[14px] font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
        >
          Download
        </button>
      </div>

      {/* Table */}
      <div className="bg-white border border-[#e4e7ec] rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-center border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-[#f9fafb] border-b border-[#e4e7ec]">
                <th className="py-4 px-6 text-[12px] font-semibold text-[#667085]">Room/Block No</th>
                <th className="py-4 px-6 text-[12px] font-semibold text-[#667085]">Date</th>
                <th className="py-4 px-6 text-[12px] font-semibold text-[#667085]">Exam Session</th>
                <th className="py-4 px-6 text-[12px] font-semibold text-[#667085]">Subject</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e4e7ec]">
              {paginatedData.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50/50">
                  <td className="py-4 px-6 text-[14px] text-[#475467]">{row.room}</td>
                  <td className="py-4 px-6 text-[14px] text-[#475467]">{row.date}</td>
                  <td className="py-4 px-6 text-[14px] text-[#475467]">{row.session}</td>
                  <td className="py-4 px-6 text-[14px] text-[#475467]">{row.subject}</td>
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

      {/* ── EXPORT SUCCESS MODAL ── */}
      {isExportModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center font-sans bg-black/55 backdrop-blur-[4px] animate-in fade-in duration-200">
          <div className="bg-white flex flex-col items-center justify-center rounded-[20px] shadow-2xl w-[510px] min-h-[424px] p-[20px] py-[45px] animate-in zoom-in-95 duration-200">
            <div className="flex flex-col items-center w-full px-8 gap-[28px] justify-center">
              <div className="flex items-center justify-center p-[10px] rounded-[8px] w-[136px] h-[136px]">
                <svg viewBox="0 0 104.667 104.667" className="w-[104px] h-[104px]" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M100.667 47.9143V52.361C100.661 62.7837 97.2858 72.9253 91.0451 81.2732C84.8045 89.621 76.0325 95.728 66.0376 98.6832C56.0426 101.638 45.3601 101.284 35.5833 97.6715C25.8065 94.0595 17.4592 87.3838 11.7863 78.6402C6.11346 69.8965 3.41899 59.5533 4.10477 49.1532C4.79055 38.7531 8.81984 28.8532 15.5917 20.9302C22.3635 13.0071 31.5151 7.48535 41.6816 5.18837C51.848 2.8914 62.4846 3.9423 72.005 8.18434M100.667 13.6667L52.3333 62.0483L37.8333 47.5483" stroke="#81D66A" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h2 className="text-[24px] font-semibold text-[#101828] text-center max-w-[444px] leading-snug">
                Exam Schedule Exported to<br/>Excel successfully!
              </h2>
              <button 
                onClick={() => setIsExportModalOpen(false)} 
                className="mt-2 w-[100px] h-[44px] bg-[#0E1680] hover:bg-[#0b126c] flex items-center justify-center rounded-[8px] transition-colors cursor-pointer text-white font-semibold text-[16px]"
              >
                Back
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── DOWNLOAD SUCCESS MODAL ── */}
      {isDownloadModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center font-sans bg-black/55 backdrop-blur-[4px] animate-in fade-in duration-200">
          <div className="bg-white flex flex-col items-center justify-center rounded-[20px] shadow-2xl w-[510px] min-h-[424px] p-[20px] py-[45px] animate-in zoom-in-95 duration-200">
            <div className="flex flex-col items-center w-full px-8 gap-[28px] justify-center">
              <div className="flex items-center justify-center p-[10px] rounded-[8px] w-[136px] h-[136px]">
                <svg viewBox="0 0 104.667 104.667" className="w-[104px] h-[104px]" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M100.667 47.9143V52.361C100.661 62.7837 97.2858 72.9253 91.0451 81.2732C84.8045 89.621 76.0325 95.728 66.0376 98.6832C56.0426 101.638 45.3601 101.284 35.5833 97.6715C25.8065 94.0595 17.4592 87.3838 11.7863 78.6402C6.11346 69.8965 3.41899 59.5533 4.10477 49.1532C4.79055 38.7531 8.81984 28.8532 15.5917 20.9302C22.3635 13.0071 31.5151 7.48535 41.6816 5.18837C51.848 2.8914 62.4846 3.9423 72.005 8.18434M100.667 13.6667L52.3333 62.0483L37.8333 47.5483" stroke="#81D66A" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h2 className="text-[24px] font-semibold text-[#101828] text-center max-w-[444px] leading-snug">
                Exam Schedule Downloaded<br/>successfully!
              </h2>
              <button 
                onClick={() => setIsDownloadModalOpen(false)} 
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
