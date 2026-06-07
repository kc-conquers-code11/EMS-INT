import React, { useState } from 'react';
import { X } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const GenerateReportsTab: React.FC = () => {
  const [course, setCourse] = useState('Operating System');
  const [semester, setSemester] = useState('2nd');
  const [reportType, setReportType] = useState('COPO Matrix');
  
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDownloadSuccessOpen, setIsDownloadSuccessOpen] = useState(false);
  
  const [isViewClicked, setIsViewClicked] = useState(false);
  const [isDownloadClicked, setIsDownloadClicked] = useState(false);

  const handleDownloadReport = () => {
    setIsDownloadClicked(true);
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('COPO Report', 14, 20);
    
    doc.setFontSize(10);
    doc.setTextColor(71, 84, 103);
    doc.text('Course Name:', 14, 30);
    doc.text('Operating System', 40, 30);
    
    doc.text('Batch:', 14, 36);
    doc.text('2022', 40, 36);
    
    doc.text('Course Code:', 14, 42);
    doc.text('IT302', 40, 42);
    
    doc.text('Department:', 14, 48);
    doc.text('Information Technology', 40, 48);

    autoTable(doc, {
      startY: 55,
      head: [['CO/PO', 'PO1', 'PO2', 'PO3', 'PO4']],
      body: [
        ['CO1', '1', '3', '2', '3'],
        ['CO2', '3', '3', '1', '2'],
        ['CO3', '2', '2', '3', '1'],
      ],
      theme: 'grid',
      styles: { halign: 'center', cellPadding: 6 },
      headStyles: { fillColor: [249, 250, 251], textColor: [102, 112, 133], fontStyle: 'bold', lineWidth: 0.1, lineColor: [228, 231, 236] },
      bodyStyles: { textColor: [71, 84, 103], lineWidth: 0.1, lineColor: [228, 231, 236] },
      alternateRowStyles: { fillColor: [255, 255, 255] }
    });

    doc.save('COPO_Report.pdf');
    setIsViewModalOpen(false);
    setIsDownloadSuccessOpen(true);
  };

  const ChevronDown = () => (
    <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#667085" strokeWidth="2" strokeLinecap="round">
      <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
  );

  return (
    <div className="flex flex-col gap-6 w-full font-['Instrument_Sans'] select-none p-2 animate-in fade-in zoom-in-95 duration-200">
      
      {/* ── FORM FIELDS ── */}
      <div className="flex flex-col gap-5 w-full">
        
        {/* Select Course */}
        <div className="flex flex-col gap-1.5 w-full">
          <label className="text-[14px] font-medium text-[#344054]">Select Course</label>
          <div className="relative">
            <select
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              className="w-full px-3.5 py-3 bg-white border border-[#d0d5dd] rounded-lg text-[14px] text-[#667085] focus:outline-none focus:ring-4 focus:ring-[#0E1680]/5 focus:border-[#0E1680] shadow-sm appearance-none cursor-pointer"
            >
              <option value="Operating System">Operating System</option>
            </select>
            <ChevronDown />
          </div>
        </div>

        {/* Select Semester */}
        <div className="flex flex-col gap-1.5 w-full">
          <label className="text-[14px] font-medium text-[#344054]">Select Semester</label>
          <div className="relative">
            <select
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              className="w-full px-3.5 py-3 bg-white border border-[#d0d5dd] rounded-lg text-[14px] text-[#667085] focus:outline-none focus:ring-4 focus:ring-[#0E1680]/5 focus:border-[#0E1680] shadow-sm appearance-none cursor-pointer"
            >
              <option value="2nd">2nd</option>
            </select>
            <ChevronDown />
          </div>
        </div>

        {/* Select Report Type */}
        <div className="flex flex-col gap-1.5 w-full">
          <label className="text-[14px] font-medium text-[#344054]">Select Report Type</label>
          <div className="relative">
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full px-3.5 py-3 bg-white border border-[#d0d5dd] rounded-lg text-[14px] text-[#667085] focus:outline-none focus:ring-4 focus:ring-[#0E1680]/5 focus:border-[#0E1680] shadow-sm appearance-none cursor-pointer"
            >
              <option value="COPO Matrix">COPO Matrix</option>
            </select>
            <ChevronDown />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col items-end gap-3 mt-4">
          <button 
            onClick={() => setIsSuccessOpen(true)}
            className="w-[200px] py-3 bg-[#0E1680] hover:bg-blue-900 text-white text-[14px] font-semibold rounded-lg shadow-sm transition-all cursor-pointer"
          >
            Generate Report
          </button>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => {
                setIsViewClicked(true);
                setIsViewModalOpen(true);
              }}
              className={`w-[140px] py-2.5 ${isViewClicked ? 'bg-[#9BA3F2] hover:bg-[#858de2]' : 'bg-[#0E1680] hover:bg-[#0b126c]'} text-white text-[14px] font-semibold rounded-lg shadow-sm transition-all cursor-pointer`}
            >
              View Report
            </button>
            <button 
              onClick={handleDownloadReport}
              className={`w-[160px] py-2.5 ${isDownloadClicked ? 'bg-[#9BA3F2] hover:bg-[#858de2]' : 'bg-[#0E1680] hover:bg-[#0b126c]'} text-white text-[14px] font-semibold rounded-lg shadow-sm transition-all cursor-pointer`}
            >
              Download Report
            </button>
          </div>
        </div>

      </div>

      {/* ── SUCCESS MODAL ── */}
      {isSuccessOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-[20px] w-[510px] min-h-[424px] shadow-2xl flex flex-col items-center justify-center p-[20px] py-[45px] animate-in zoom-in-95 duration-200">
            <div className="flex flex-col gap-[28px] items-center justify-center w-full">
              <div className="flex items-center justify-center p-[10px] rounded-[8px] w-[136px] h-[136px]">
                <svg viewBox="0 0 104.667 104.667" className="w-[104px] h-[104px]" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M100.667 47.9143V52.361C100.661 62.7837 97.2858 72.9253 91.0451 81.2732C84.8045 89.621 76.0325 95.728 66.0376 98.6832C56.0426 101.638 45.3601 101.284 35.5833 97.6715C25.8065 94.0595 17.4592 87.3838 11.7863 78.6402C6.11346 69.8965 3.41899 59.5533 4.10477 49.1532C4.79055 38.7531 8.81984 28.8532 15.5917 20.9302C22.3635 13.0071 31.5151 7.48535 41.6816 5.18837C51.848 2.8914 62.4846 3.9423 72.005 8.18434M100.667 13.6667L52.3333 62.0483L37.8333 47.5483" stroke="#81D66A" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <p className="font-semibold text-[24px] text-black text-center">
                Report Generated successfully !
              </p>
              <button
                type="button"
                onClick={() => setIsSuccessOpen(false)}
                className="mt-2 w-[100px] h-[44px] bg-[#0E1680] hover:bg-blue-900 flex items-center justify-center rounded-[8px] transition-colors cursor-pointer"
              >
                <span className="font-semibold text-[16px] text-white">Back</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── VIEW REPORT MODAL ── */}
      {isViewModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-[800px] shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="h-[60px] px-6 flex items-center justify-between border-b border-[#e4e7ec] shrink-0">
              <span className="text-[16px] font-bold text-[#101828]">COPO Report</span>
              <button onClick={() => setIsViewModalOpen(false)} className="p-1 hover:bg-gray-100 rounded-lg text-[#667085] cursor-pointer">
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto flex flex-col gap-6">
              
              {/* Info section */}
              <div className="grid grid-cols-2 gap-y-3 text-[14px] text-[#344054]">
                <div className="flex gap-4"><span className="font-medium w-[100px]">Course Name</span><span className="text-[#667085]">Operating System</span></div>
                <div className="flex gap-4"><span className="font-medium w-[100px]">Batch</span><span className="text-[#667085]">2022</span></div>
                <div className="flex gap-4"><span className="font-medium w-[100px]">Course Code</span><span className="text-[#667085]">IT302</span></div>
                <div className="flex gap-4"><span className="font-medium w-[100px]">Department</span><span className="text-[#667085]">Information Technology</span></div>
              </div>

              {/* Table section */}
              <div className="border border-[#e4e7ec] rounded-xl overflow-hidden">
                <table className="w-full text-center border-collapse">
                  <thead>
                    <tr className="bg-[#f9fafb] border-b border-[#e4e7ec]">
                      <th className="py-4 px-4 text-[12px] font-semibold text-[#667085]">CO/PO</th>
                      <th className="py-4 px-4 text-[12px] font-semibold text-[#667085]">PO1</th>
                      <th className="py-4 px-4 text-[12px] font-semibold text-[#667085]">PO2</th>
                      <th className="py-4 px-4 text-[12px] font-semibold text-[#667085]">PO3</th>
                      <th className="py-4 px-4 text-[12px] font-semibold text-[#667085]">PO4</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e4e7ec]">
                    <tr className="hover:bg-gray-50/50">
                      <td className="py-4 px-4 text-[14px] font-semibold text-[#475467] border-r border-[#e4e7ec]">CO1</td>
                      <td className="py-4 px-4 text-[14px] text-[#475467]">1</td>
                      <td className="py-4 px-4 text-[14px] text-[#475467]">3</td>
                      <td className="py-4 px-4 text-[14px] text-[#475467]">2</td>
                      <td className="py-4 px-4 text-[14px] text-[#475467]">3</td>
                    </tr>
                    <tr className="hover:bg-gray-50/50">
                      <td className="py-4 px-4 text-[14px] font-semibold text-[#475467] border-r border-[#e4e7ec]">CO2</td>
                      <td className="py-4 px-4 text-[14px] text-[#475467]">3</td>
                      <td className="py-4 px-4 text-[14px] text-[#475467]">3</td>
                      <td className="py-4 px-4 text-[14px] text-[#475467]">1</td>
                      <td className="py-4 px-4 text-[14px] text-[#475467]">2</td>
                    </tr>
                    <tr className="hover:bg-gray-50/50">
                      <td className="py-4 px-4 text-[14px] font-semibold text-[#475467] border-r border-[#e4e7ec]">CO3</td>
                      <td className="py-4 px-4 text-[14px] text-[#475467]">2</td>
                      <td className="py-4 px-4 text-[14px] text-[#475467]">2</td>
                      <td className="py-4 px-4 text-[14px] text-[#475467]">3</td>
                      <td className="py-4 px-4 text-[14px] text-[#475467]">1</td>
                    </tr>
                  </tbody>
                </table>
              </div>

            </div>

            {/* Footer */}
            <div className="p-6 flex justify-end shrink-0 border-t border-[#e4e7ec]">
              <button 
                onClick={handleDownloadReport}
                className="px-8 py-2.5 bg-[#0E1680] hover:bg-blue-900 text-white text-[14px] font-semibold rounded-lg shadow-sm transition-all cursor-pointer"
              >
                Download Report
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── DOWNLOAD SUCCESS MODAL ── */}
      {isDownloadSuccessOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-[20px] w-[510px] min-h-[424px] shadow-2xl flex flex-col items-center justify-center p-[20px] py-[45px] animate-in zoom-in-95 duration-200">
            <div className="flex flex-col gap-[28px] items-center justify-center w-full">
              <div className="flex items-center justify-center p-[10px] rounded-[8px] w-[136px] h-[136px]">
                <svg viewBox="0 0 104.667 104.667" className="w-[104px] h-[104px]" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M100.667 47.9143V52.361C100.661 62.7837 97.2858 72.9253 91.0451 81.2732C84.8045 89.621 76.0325 95.728 66.0376 98.6832C56.0426 101.638 45.3601 101.284 35.5833 97.6715C25.8065 94.0595 17.4592 87.3838 11.7863 78.6402C6.11346 69.8965 3.41899 59.5533 4.10477 49.1532C4.79055 38.7531 8.81984 28.8532 15.5917 20.9302C22.3635 13.0071 31.5151 7.48535 41.6816 5.18837C51.848 2.8914 62.4846 3.9423 72.005 8.18434M100.667 13.6667L52.3333 62.0483L37.8333 47.5483" stroke="#81D66A" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <p className="font-semibold text-[24px] text-black text-center">
                Report Downloaded successfully !
              </p>
              <button
                type="button"
                onClick={() => setIsDownloadSuccessOpen(false)}
                className="mt-2 w-[100px] h-[44px] bg-[#0E1680] hover:bg-blue-900 flex items-center justify-center rounded-[8px] transition-colors cursor-pointer"
              >
                <span className="font-semibold text-[16px] text-white">Back</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
