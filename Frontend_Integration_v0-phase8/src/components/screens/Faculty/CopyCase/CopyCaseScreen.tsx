import React, { useState } from 'react';
import { Calendar, Clock, Image as ImageIcon, FileText, ChevronDown, X, Upload } from 'lucide-react';

export const CopyCaseScreen: React.FC = () => {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isUploadSuccessOpen, setIsUploadSuccessOpen] = useState(false);
  const [filesUploaded, setFilesUploaded] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleUploadClick = () => {
    setIsUploadModalOpen(false);
    setIsUploadSuccessOpen(true);
  };

  const handleSuccessBack = () => {
    setIsUploadSuccessOpen(false);
    setFilesUploaded(true);
  };

  const handleSubmitActivity = () => {
    if (filesUploaded) {
      setIsSubmitted(true);
    }
  };

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-300">
      
      {/* Form Section */}
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <label className="text-[13px] font-medium text-[#344054]">Enter Student name</label>
          <input 
            type="text" 
            placeholder="XYZ"
            className="w-full h-11 pl-4 pr-4 bg-white border border-[#d0d5dd] rounded-lg text-[14px] text-[#101828] focus:outline-none focus:border-[#9BA3F2] focus:ring-1 focus:ring-[#9BA3F2] shadow-sm"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-[13px] font-medium text-[#344054]">Enter Enrollment number</label>
          <input 
            type="text" 
            placeholder="vu4s2425001"
            className="w-full h-11 pl-4 pr-4 bg-white border border-[#d0d5dd] rounded-lg text-[14px] text-[#101828] focus:outline-none focus:border-[#9BA3F2] focus:ring-1 focus:ring-[#9BA3F2] shadow-sm"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-[13px] font-medium text-[#344054]">Enter Subject name</label>
          <input 
            type="text" 
            placeholder="DBMS"
            className="w-full h-11 pl-4 pr-4 bg-white border border-[#d0d5dd] rounded-lg text-[14px] text-[#101828] focus:outline-none focus:border-[#9BA3F2] focus:ring-1 focus:ring-[#9BA3F2] shadow-sm"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-[13px] font-medium text-[#344054]">Enter Student seat number</label>
          <input 
            type="text" 
            placeholder="70192"
            className="w-full h-11 pl-4 pr-4 bg-white border border-[#d0d5dd] rounded-lg text-[14px] text-[#101828] focus:outline-none focus:border-[#9BA3F2] focus:ring-1 focus:ring-[#9BA3F2] shadow-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-x-12">
          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-medium text-[#344054]">Date</label>
            <div className="relative">
              <input 
                type="text" 
                placeholder="11/05/2026"
                className="w-full h-11 pl-4 pr-10 bg-white border border-[#d0d5dd] rounded-lg text-[14px] text-[#475467] focus:outline-none focus:border-[#9BA3F2] focus:ring-1 focus:ring-[#9BA3F2] shadow-sm"
              />
              <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-[#667085]" size={18} />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-medium text-[#344054]">Time</label>
            <div className="relative">
              <input 
                type="text" 
                placeholder="2:00 pm"
                className="w-full h-11 pl-4 pr-10 bg-white border border-[#d0d5dd] rounded-lg text-[14px] text-[#475467] focus:outline-none focus:border-[#9BA3F2] focus:ring-1 focus:ring-[#9BA3F2] shadow-sm"
              />
              <Clock className="absolute right-3 top-1/2 -translate-y-1/2 text-[#667085]" size={18} />
            </div>
          </div>
        </div>
      </div>

      {/* Uploaded Files Section */}
      {filesUploaded && (
        <div className="flex flex-col gap-3 animate-in fade-in duration-300">
          <div className="flex items-center gap-2 text-[#475467]">
            <ImageIcon size={18} className="text-[#0E1680]"/>
            <span className="text-[14px] font-medium">Photo.png</span>
          </div>
          <div className="flex items-center gap-2 text-[#475467]">
            <FileText size={18} className="text-[#0E1680]"/>
            <span className="text-[14px] font-medium">Declaration.pdf</span>
          </div>
          <div className="flex items-center gap-2 text-[#475467]">
            <ImageIcon size={18} className="text-[#0E1680]"/>
            <span className="text-[14px] font-medium">Signature.png</span>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end items-center gap-4 mt-2">
        <button 
          onClick={() => setIsUploadModalOpen(true)}
          className="px-6 py-2.5 bg-[#0E1680] hover:bg-[#0b126c] text-white text-[14px] font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
        >
          Upload Proof
        </button>
        <button 
          onClick={handleSubmitActivity}
          disabled={!filesUploaded}
          className={`px-6 py-2.5 text-white text-[14px] font-semibold rounded-lg shadow-sm transition-colors ${
            filesUploaded 
              ? 'bg-[#0E1680] hover:bg-[#0b126c] cursor-pointer' 
              : 'bg-[#9BA3F2] cursor-not-allowed'
          }`}
        >
          Submit Activity
        </button>
      </div>

      {/* Table Section (Visible after submit) */}
      {isSubmitted && (
        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-300 mt-4">
          <div className="bg-white border border-[#e4e7ec] rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-center border-collapse whitespace-nowrap">
                <thead>
                  <tr className="bg-[#f0f1fd] border-b border-[#e4e7ec]">
                    <th className="py-4 px-6 text-[12px] font-semibold text-[#667085] w-16">Sr. No.</th>
                    <th className="py-4 px-6 text-[12px] font-semibold text-[#667085]">Seat No.</th>
                    <th className="py-4 px-6 text-[12px] font-semibold text-[#667085]">Student name</th>
                    <th className="py-4 px-6 text-[12px] font-semibold text-[#667085]">Subject name</th>
                    <th className="py-4 px-6 text-[12px] font-semibold text-[#667085]">Examiner</th>
                    <th className="py-4 px-6 text-[12px] font-semibold text-[#667085]">Examiner remark</th>
                    <th className="py-4 px-6 text-[12px] font-semibold text-[#667085]">Copy case Date</th>
                    <th className="py-4 px-6 text-[12px] font-semibold text-[#667085]">Final Status</th>
                    <th className="py-4 px-6 text-[12px] font-semibold text-[#667085]">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e4e7ec]">
                  <tr className="hover:bg-gray-50/50 h-16">
                    <td className="py-4 px-6 text-[14px] text-[#475467]">1</td>
                    <td className="py-4 px-6 text-[14px] text-[#475467]">70192</td>
                    <td className="py-4 px-6 text-[14px] text-[#475467]">XYZ</td>
                    <td className="py-4 px-6 text-[14px] text-[#475467]">DBMS</td>
                    <td className="py-4 px-6 text-[14px] text-[#475467]">ABC Faculty</td>
                    <td className="py-4 px-6 text-[14px] text-[#475467]">Set A - Operating System</td>
                    <td className="py-4 px-6 text-[14px] text-[#475467]">11/05/2026</td>
                    <td className="py-4 px-6 text-[14px] text-[#475467]">Pending</td>
                    <td className="py-4 px-6 text-[14px] text-[#0E1680] font-semibold cursor-pointer">View</td>
                  </tr>
                  {/* Empty rows to match mockup visual */}
                  {[...Array(4)].map((_, i) => (
                    <tr key={i} className="hover:bg-gray-50/50 h-16">
                      <td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="h-[68px] border-t border-[#e4e7ec] px-6 flex items-center justify-between bg-white">
              <button disabled className="flex items-center gap-2 px-4 py-2 border border-[#d0d5dd] rounded-lg text-[14px] font-semibold text-[#344054] hover:bg-gray-50 transition-all shadow-sm cursor-pointer disabled:opacity-50">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M5 12L12 19M5 12L12 5"/></svg>
                <span>Previous</span>
              </button>
              <div className="flex items-center gap-1">
                <button className="w-10 h-10 flex items-center justify-center text-[14px] font-semibold rounded-lg text-[#0E1680] bg-[#f0f1fd] font-bold">1</button>
                <button className="w-10 h-10 flex items-center justify-center text-[14px] font-semibold rounded-lg text-[#475467] hover:bg-gray-50">2</button>
                <button className="w-10 h-10 flex items-center justify-center text-[14px] font-semibold rounded-lg text-[#475467] hover:bg-gray-50">3</button>
                <span className="text-[#475467]">..</span>
                <button className="w-10 h-10 flex items-center justify-center text-[14px] font-semibold rounded-lg text-[#475467] hover:bg-gray-50">8</button>
                <button className="w-10 h-10 flex items-center justify-center text-[14px] font-semibold rounded-lg text-[#475467] hover:bg-gray-50">9</button>
                <button className="w-10 h-10 flex items-center justify-center text-[14px] font-semibold rounded-lg text-[#475467] hover:bg-gray-50">10</button>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 border border-[#d0d5dd] rounded-lg text-[14px] font-semibold text-[#344054] hover:bg-gray-50 transition-all shadow-sm cursor-pointer">
                <span>Next</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12H19M19 12L12 5M19 12L12 19"/></svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── UPLOAD PROOF MODAL ── */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center font-sans bg-black/55 backdrop-blur-[4px] animate-in fade-in duration-200">
          <div className="bg-white flex flex-col rounded-[16px] shadow-2xl w-[700px] animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between px-8 py-6 border-b border-[#e4e7ec]">
              <h2 className="text-[18px] font-semibold text-[#101828]">Upload Proof</h2>
              <button onClick={() => setIsUploadModalOpen(false)} className="text-[#667085] hover:text-[#101828] transition-colors cursor-pointer">
                <X size={24} />
              </button>
            </div>
            
            {/* Body */}
            <div className="flex flex-col px-8 py-8 gap-8">
              <div className="flex flex-col gap-2">
                <label className="text-[13px] font-medium text-[#344054]">Remarks</label>
                <div className="relative">
                  <select className="w-full h-11 pl-4 pr-10 bg-white border border-[#d0d5dd] rounded-lg text-[14px] text-[#475467] appearance-none focus:outline-none focus:border-[#9BA3F2] focus:ring-1 focus:ring-[#9BA3F2] shadow-sm cursor-pointer">
                    <option>Set A - Operating System</option>
                    <option>Set B - Data Structures</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-[#667085] pointer-events-none" size={18} />
                </div>
              </div>

              <div className="flex items-center gap-4">
                <label className="flex-1 h-11 bg-[#f0f1fd] text-[#0E1680] text-[14px] font-semibold rounded-lg hover:bg-[#e4e6fb] transition-colors cursor-pointer flex items-center justify-center gap-2">
                  Upload Copy Proof
                  <input type="file" accept="image/*,.pdf" className="hidden" />
                </label>
                <label className="flex-1 h-11 bg-[#f0f1fd] text-[#0E1680] text-[14px] font-semibold rounded-lg hover:bg-[#e4e6fb] transition-colors cursor-pointer flex items-center justify-center gap-2">
                  Upload Student Declaration
                  <input type="file" accept="image/*,.pdf" className="hidden" />
                </label>
                <label className="flex-1 h-11 bg-[#f0f1fd] text-[#0E1680] text-[14px] font-semibold rounded-lg hover:bg-[#e4e6fb] transition-colors cursor-pointer flex items-center justify-center gap-2">
                  Upload supervisor signature
                  <input type="file" accept="image/*,.pdf" className="hidden" />
                </label>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end px-8 py-6">
              <button 
                onClick={handleUploadClick}
                className="px-8 py-2.5 bg-[#0E1680] hover:bg-[#0b126c] text-white text-[14px] font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── UPLOAD SUCCESS MODAL ── */}
      {isUploadSuccessOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center font-sans bg-black/55 backdrop-blur-[4px] animate-in fade-in duration-200">
          <div className="bg-white flex flex-col items-center justify-center rounded-[20px] shadow-2xl w-[510px] min-h-[424px] p-[20px] py-[45px] animate-in zoom-in-95 duration-200">
            <div className="flex flex-col items-center w-full px-8 gap-[28px] justify-center">
              <div className="flex items-center justify-center p-[10px] rounded-[8px] w-[136px] h-[136px]">
                <svg viewBox="0 0 104.667 104.667" className="w-[104px] h-[104px]" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M100.667 47.9143V52.361C100.661 62.7837 97.2858 72.9253 91.0451 81.2732C84.8045 89.621 76.0325 95.728 66.0376 98.6832C56.0426 101.638 45.3601 101.284 35.5833 97.6715C25.8065 94.0595 17.4592 87.3838 11.7863 78.6402C6.11346 69.8965 3.41899 59.5533 4.10477 49.1532C4.79055 38.7531 8.81984 28.8532 15.5917 20.9302C22.3635 13.0071 31.5151 7.48535 41.6816 5.18837C51.848 2.8914 62.4846 3.9423 72.005 8.18434M100.667 13.6667L52.3333 62.0483L37.8333 47.5483" stroke="#81D66A" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h2 className="text-[24px] font-semibold text-[#101828] text-center max-w-[444px] leading-snug">
                Proof Uploaded<br/>Successfully!
              </h2>
              <button 
                onClick={handleSuccessBack} 
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
