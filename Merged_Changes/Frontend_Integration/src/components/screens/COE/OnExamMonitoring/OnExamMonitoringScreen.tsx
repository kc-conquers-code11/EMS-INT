import React, { useState } from 'react';
import { Search, Filter, RefreshCw, X } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const OnExamMonitoringScreen: React.FC = () => {
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDownloadSuccessOpen, setIsDownloadSuccessOpen] = useState(false);
  const [emergencyMessage, setEmergencyMessage] = useState('');
  const [isBroadcastConfirmOpen, setIsBroadcastConfirmOpen] = useState(false);
  const [isBroadcastSuccessOpen, setIsBroadcastSuccessOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const stats = [
    { label: 'Rooms Active', value: '165', icon: <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg></div> },
    { label: 'Total Present', value: '102', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#667085" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg> },
    { label: 'Total Absent', value: '4', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#667085" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="18" y1="8" x2="23" y2="13"></line><line x1="23" y1="8" x2="18" y2="13"></line></svg> },
    { label: 'Report Submitted', value: '4', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#667085" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg> },
  ];

  const allTableData = [
    { id: 1, room: '203', supervisor: 'abc', present: 200, absent: 200, status: 'Pending' },
    { id: 2, room: '203', supervisor: 'xyz', present: 200, absent: 150, status: 'Submited' },
    { id: 3, room: '203', supervisor: 'xyz', present: 200, absent: 500, status: 'Submited' },
    { id: 4, room: '101', supervisor: 'john', present: 190, absent: 10, status: 'Submited' },
    { id: 5, room: '102', supervisor: 'jane', present: 195, absent: 5, status: 'Pending' },
    { id: 6, room: '105', supervisor: 'smith', present: 180, absent: 20, status: 'Pending' },
    { id: 7, room: '210', supervisor: 'doe', present: 200, absent: 0, status: 'Submited' },
    { id: 8, room: '304', supervisor: 'alice', present: 150, absent: 50, status: 'Submited' },
    { id: 9, room: '305', supervisor: 'bob', present: 160, absent: 40, status: 'Pending' },
    { id: 10, room: '401', supervisor: 'eve', present: 198, absent: 2, status: 'Submited' },
    { id: 11, room: '402', supervisor: 'mallory', present: 199, absent: 1, status: 'Pending' },
  ];

  const filteredData = allTableData.filter(row => 
    row.room.toLowerCase().includes(searchQuery.toLowerCase()) || 
    row.supervisor.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleDownloadReport = () => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Exam Monitoring Report', 14, 20);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Room No:  203', 14, 32);
    doc.text('Supervisor Name:  ABC', 14, 40);
    doc.text('Exam Session:  End Sem Apr 2026', 14, 48);
    doc.text('Generated On:  25/05/26', 14, 56);
    
    doc.setFont('helvetica', 'bold');
    doc.text('Attendance Details', 14, 68);

    autoTable(doc, {
      startY: 74,
      head: [['Total', 'Present Student', 'Absent Student']],
      body: [
        ['Thread', '1000', '200'],
        ['Supplement Sheets', '1000', '150'],
        ['Answer Book', '1000', '500'],
      ],
      theme: 'grid',
      styles: { halign: 'center', cellPadding: 6, fontSize: 10 },
      headStyles: { fillColor: [249, 250, 251], textColor: [71, 84, 103], fontStyle: 'bold', lineWidth: 0.1, lineColor: [228, 231, 236] },
      bodyStyles: { textColor: [102, 112, 133], lineWidth: 0.1, lineColor: [228, 231, 236] },
      alternateRowStyles: { fillColor: [255, 255, 255] }
    });

    const finalY = (doc as any).lastAutoTable.finalY || 130;

    doc.setFont('helvetica', 'bold');
    doc.text('Incident Description', 14, finalY + 14);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(150, 150, 150);
    doc.text('Description....', 14, finalY + 22);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('Supervisor Remark', 14, finalY + 36);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(150, 150, 150);
    doc.text('Remarks.......', 14, finalY + 44);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('10:45 AM, 4 April 2026', 14, finalY + 60);

    doc.setFont('helvetica', 'bold');
    doc.text('Signature', 170, finalY + 60, { align: 'center' });
    doc.setFont('helvetica', 'normal');
    doc.text('Admin/COE', 170, finalY + 68, { align: 'center' });

    doc.save('Monitoring_Report.pdf');
    setIsDownloadSuccessOpen(true);
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in zoom-in-95 duration-200">
      
      <div className="flex items-center justify-between">
        <h1 className="text-[24px] font-semibold text-[#101828]">Monitor Exam Execution</h1>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-[#f8f9fc] rounded-xl p-6 border border-[#e4e7ec] shadow-sm flex flex-col items-center justify-center gap-3">
            {stat.icon}
            <div className="text-center">
              <h2 className="text-[24px] font-bold text-[#101828]">{stat.value}</h2>
              <p className="text-[13px] text-[#475467] font-medium">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* REFRESH BTN */}
      <div className="flex justify-end mt-2">
        <button className="flex items-center gap-2 bg-[#0E1680] hover:bg-[#0b126c] text-white px-5 py-2.5 rounded-lg text-[14px] font-semibold shadow-sm transition-colors cursor-pointer">
          Refresh <RefreshCw size={16} />
        </button>
      </div>

      {/* TOOLBAR */}
      <div className="flex items-center justify-end gap-3">
        <div className="relative">
          <input 
            type="text" 
            placeholder="Search" 
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1); // Reset page on search
            }}
            className="pl-3.5 pr-10 py-2 bg-white border border-[#d0d5dd] rounded-lg text-[14px] focus:outline-none shadow-sm w-[240px]" 
          />
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-[#667085]" size={16} />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-[#d0d5dd] rounded-lg text-[14px] font-medium text-[#344054] hover:bg-gray-50 shadow-sm transition-colors cursor-pointer">
          Room
          <Filter size={16} className="text-[#667085]" />
        </button>
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-[#d0d5dd] rounded-lg text-[14px] font-medium text-[#344054] hover:bg-gray-50 shadow-sm transition-colors cursor-pointer">
          Status
          <Filter size={16} className="text-[#667085]" />
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white border border-[#e4e7ec] rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-center border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-[#f9fafb] border-b border-[#e4e7ec]">
                <th className="py-4 px-6 text-[12px] font-semibold text-[#667085]">Room No</th>
                <th className="py-4 px-6 text-[12px] font-semibold text-[#667085]">Supervisor Name</th>
                <th className="py-4 px-6 text-[12px] font-semibold text-[#667085]">Present Count</th>
                <th className="py-4 px-6 text-[12px] font-semibold text-[#667085]">Absent Count</th>
                <th className="py-4 px-6 text-[12px] font-semibold text-[#667085]">Report Status</th>
                <th className="py-4 px-6 text-[12px] font-semibold text-[#667085]">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e4e7ec]">
              {paginatedData.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50/50">
                  <td className="py-4 px-6 text-[14px] text-[#475467]">{row.room}</td>
                  <td className="py-4 px-6 text-[14px] text-[#475467]">{row.supervisor}</td>
                  <td className="py-4 px-6 text-[14px] text-[#475467]">{row.present}</td>
                  <td className="py-4 px-6 text-[14px] text-[#475467]">{row.absent}</td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 text-[12px] font-medium rounded-full ${
                      row.status === 'Pending' ? 'bg-orange-50 text-orange-600 border border-orange-200' : 'bg-green-50 text-green-600 border border-green-200'
                    }`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <button 
                      onClick={() => setIsViewModalOpen(true)}
                      className="px-5 py-2 bg-[#0E1680] hover:bg-[#0b126c] text-white text-[13px] font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
                    >
                      View Report
                    </button>
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
            disabled={currentPage === 1 || totalPages === 0}
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
            disabled={currentPage === totalPages || totalPages === 0}
            className="flex items-center gap-2 px-4 py-2 border border-[#d0d5dd] rounded-lg text-[14px] font-semibold text-[#344054] hover:bg-gray-50 transition-all shadow-sm cursor-pointer disabled:opacity-50"
          >
            <span>Next</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12H19M19 12L12 5M19 12L12 19"/></svg>
          </button>
        </div>
      </div>

      {/* Emergency Message */}
      <div className="flex flex-col gap-3 mt-4">
        <label className="text-[14px] font-semibold text-[#344054]">Enter Emergency Message</label>
        <textarea 
          value={emergencyMessage}
          onChange={(e) => setEmergencyMessage(e.target.value)}
          placeholder="Enter message details..." 
          className="w-full h-[120px] p-4 border border-[#d0d5dd] rounded-xl text-[14px] focus:outline-none resize-none shadow-sm"
        />
        <div className="flex justify-end">
          <button 
            onClick={() => {
              if (emergencyMessage.trim().length > 0) {
                setIsBroadcastConfirmOpen(true);
              }
            }}
            className="px-6 py-2.5 bg-[#0E1680] hover:bg-[#0b126c] text-white text-[14px] font-semibold rounded-lg shadow-sm transition-colors cursor-pointer disabled:opacity-50"
          >
            Send to all Supervisors
          </button>
        </div>
      </div>

      {/* ── VIEW MODAL ── */}
      {isViewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-[700px] max-h-[90vh] rounded-[20px] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between px-8 py-5 border-b border-[#e4e7ec]">
              <h2 className="text-[18px] font-bold text-[#101828]">Exam Monitoring Report</h2>
              <button onClick={() => setIsViewModalOpen(false)} className="text-[#667085] hover:text-[#101828] transition-colors">
                <X size={20} />
              </button>
            </div>
            
            {/* Body */}
            <div className="flex-1 overflow-y-auto px-8 py-6 flex flex-col gap-6 custom-scrollbar">
              <div className="grid grid-cols-2 gap-y-4">
                <div className="flex items-center gap-4">
                  <span className="text-[14px] font-semibold text-[#344054] w-[120px]">Room No</span>
                  <span className="text-[14px] text-[#475467]">203</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-[14px] font-semibold text-[#344054] w-[120px]">Supervisor Name</span>
                  <span className="text-[14px] text-[#475467]">ABC</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-[14px] font-semibold text-[#344054] w-[120px]">Exam Session</span>
                  <span className="text-[14px] text-[#475467]">End Sem Apr 2026</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-[14px] font-semibold text-[#344054] w-[120px]">Generated On</span>
                  <span className="text-[14px] text-[#475467]">25/05/26</span>
                </div>
              </div>

              <div className="flex flex-col gap-2 mt-2">
                <h3 className="text-[15px] font-bold text-[#101828]">Attendance Details</h3>
                <div className="border border-[#e4e7ec] rounded-xl overflow-hidden mt-2">
                  <table className="w-full text-center whitespace-nowrap">
                    <thead>
                      <tr className="bg-[#f9fafb] border-b border-[#e4e7ec]">
                        <th className="py-4 text-[12px] font-semibold text-[#667085]">Total</th>
                        <th className="py-4 text-[12px] font-semibold text-[#667085]">Present Student</th>
                        <th className="py-4 text-[12px] font-semibold text-[#667085]">Absent Student</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#e4e7ec]">
                      <tr className="hover:bg-gray-50/50">
                        <td className="py-5 text-[14px] text-[#475467]">Thread</td>
                        <td className="py-5 text-[14px] text-[#475467]">1000</td>
                        <td className="py-5 text-[14px] text-blue-500 font-semibold">200</td>
                      </tr>
                      <tr className="hover:bg-gray-50/50">
                        <td className="py-5 text-[14px] text-[#475467]">Supplement Sheets</td>
                        <td className="py-5 text-[14px] text-[#475467]">1000</td>
                        <td className="py-5 text-[14px] text-blue-500 font-semibold">150</td>
                      </tr>
                      <tr className="hover:bg-gray-50/50">
                        <td className="py-5 text-[14px] text-[#475467]">Answer Book</td>
                        <td className="py-5 text-[14px] text-[#475467]">1000</td>
                        <td className="py-5 text-[14px] text-blue-500 font-semibold">500</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex flex-col gap-1 mt-4">
                <h3 className="text-[15px] font-bold text-[#101828]">Incident Description</h3>
                <p className="text-[14px] text-[#98a2b3]">Description....</p>
              </div>

              <div className="flex flex-col gap-1 mt-2">
                <h3 className="text-[15px] font-bold text-[#101828]">Supervisor Remark</h3>
                <p className="text-[14px] text-[#98a2b3]">Remarks.......</p>
              </div>

              <div className="flex justify-between items-end mt-12 mb-4">
                <span className="text-[15px] font-bold text-[#101828]">10:45 AM, 4 April 2026</span>
                <div className="flex flex-col items-center">
                  <span className="text-[14px] font-bold text-[#101828] mb-1">Signature</span>
                  <span className="text-[14px] text-[#475467]">Admin/COE</span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-[#e4e7ec] flex justify-end">
              <button 
                onClick={() => {
                  handleDownloadReport();
                  setIsViewModalOpen(false);
                }}
                className="w-[180px] py-3 bg-[#0E1680] hover:bg-[#0b126c] text-white text-[15px] font-bold rounded-lg shadow-sm transition-all cursor-pointer"
              >
                Download Report
              </button>
            </div>
          </div>
        </div>
      )}

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
      {/* ── BROADCAST CONFIRM MODAL ── */}
      {isBroadcastConfirmOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center font-sans bg-black/55 backdrop-blur-[4px] animate-in fade-in duration-200">
          <div className="bg-white flex flex-col rounded-[20px] shadow-2xl w-[600px] overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-8 py-5 border-b border-[#e4e7ec]">
              <h2 className="text-[18px] font-bold text-[#101828]">Broadcast Confirmation</h2>
              <button onClick={() => setIsBroadcastConfirmOpen(false)} className="text-[#667085] hover:text-[#101828] transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="p-8">
              <div className="w-full h-[140px] p-4 border border-[#d0d5dd] rounded-xl text-[14px] text-[#475467] bg-gray-50 overflow-y-auto">
                {emergencyMessage}
              </div>
            </div>
            <div className="px-8 pb-8 flex justify-end">
              <button 
                onClick={() => {
                  setIsBroadcastConfirmOpen(false);
                  setIsBroadcastSuccessOpen(true);
                  setEmergencyMessage(''); // Clear after sending
                }}
                className="w-[120px] py-3 bg-[#0E1680] hover:bg-[#0b126c] text-white text-[15px] font-semibold rounded-lg shadow-sm transition-all cursor-pointer"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── BROADCAST SUCCESS MODAL ── */}
      {isBroadcastSuccessOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center font-sans bg-black/55 backdrop-blur-[4px] animate-in fade-in duration-200">
          <div className="bg-white flex flex-col items-center justify-center rounded-[20px] shadow-2xl w-[510px] min-h-[424px] p-[20px] py-[45px] animate-in zoom-in-95 duration-200">
            <div className="flex flex-col items-center w-full px-8 gap-[28px] justify-center">
              <div className="flex items-center justify-center p-[10px] rounded-[8px] w-[136px] h-[136px]">
                <svg viewBox="0 0 104.667 104.667" className="w-[104px] h-[104px]" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M100.667 47.9143V52.361C100.661 62.7837 97.2858 72.9253 91.0451 81.2732C84.8045 89.621 76.0325 95.728 66.0376 98.6832C56.0426 101.638 45.3601 101.284 35.5833 97.6715C25.8065 94.0595 17.4592 87.3838 11.7863 78.6402C6.11346 69.8965 3.41899 59.5533 4.10477 49.1532C4.79055 38.7531 8.81984 28.8532 15.5917 20.9302C22.3635 13.0071 31.5151 7.48535 41.6816 5.18837C51.848 2.8914 62.4846 3.9423 72.005 8.18434M100.667 13.6667L52.3333 62.0483L37.8333 47.5483" stroke="#81D66A" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h2 className="text-[24px] font-semibold text-[#101828] text-center max-w-[444px] leading-snug">
                Broadcast Confirmed Successfully!
              </h2>
              <button 
                onClick={() => setIsBroadcastSuccessOpen(false)} 
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
