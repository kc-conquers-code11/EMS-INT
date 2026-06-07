import React, { useState, useRef } from 'react';
import { Calendar, UploadCloud, RefreshCw, X } from 'lucide-react';
import toast from 'react-hot-toast';

export const OfflinePaymentTab: React.FC = () => {
  const [paymentMode, setPaymentMode] = useState('Cash/Offline');
  const [ddNumber, setDdNumber] = useState('DD123778');
  const [bankName, setBankName] = useState('SBI');
  const [paymentDate, setPaymentDate] = useState('2026-04-18');
  const [amountPaid, setAmountPaid] = useState('2100');
  const [remarks, setRemarks] = useState('Verified from bank slip');
  const [fileName] = useState('fee_receipt.jpg');

  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Date Input Ref
  const dateInputRef = useRef<HTMLInputElement>(null);

  // Modal State
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isApprovedModalOpen, setIsApprovedModalOpen] = useState(false);
  const [isRejectedModalOpen, setIsRejectedModalOpen] = useState(false);

  const handleApprove = () => {
    setIsApproving(true);
    setTimeout(() => {
      setIsApproving(false);
      setIsApprovedModalOpen(true);
    }, 800);
  };

  const handleReject = () => {
    setIsRejecting(true);
    setTimeout(() => {
      setIsRejecting(false);
      setIsRejectedModalOpen(true);
    }, 800);
  };

  const handleGenerateReceipt = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      toast.success('Exam Fee Receipt Generated Successfully! Downloading PDF...');
    }, 1000);
  };

  const handleModalUpload = () => {
    setIsUploadModalOpen(false);
    setIsSuccessModalOpen(true);
  };

  return (
    <div className="flex flex-col gap-6 w-full font-['Instrument_Sans']">

      {/* ── Offline Payment Verification Form (EXACT alignment with Figma) ── */}
      <form onSubmit={(e) => e.preventDefault()} className="bg-white border border-[#e4e7ec] rounded-2xl p-8 shadow-xs flex flex-col gap-5">

        {/* 1. Payment mode */}
        <div className="flex flex-col gap-1.5 w-full">
          <label className="text-[14px] font-semibold text-[#344054]">Payment mode</label>
          <input
            type="text"
            value={paymentMode}
            onChange={(e) => setPaymentMode(e.target.value)}
            className="w-full px-3.5 py-3 bg-white border border-[#d0d5dd] rounded-lg text-[14px] text-[#101828] focus:outline-none focus:ring-4 focus:ring-[#0e1680]/5 focus:border-[#0e1680] shadow-xs transition-all"
          />
        </div>

        {/* 2. DD number */}
        <div className="flex flex-col gap-1.5 w-full">
          <label className="text-[14px] font-semibold text-[#344054]">DD number</label>
          <input
            type="text"
            value={ddNumber}
            onChange={(e) => setDdNumber(e.target.value)}
            className="w-full px-3.5 py-3 bg-white border border-[#d0d5dd] rounded-lg text-[14px] text-[#101828] focus:outline-none focus:ring-4 focus:ring-[#0e1680]/5 focus:border-[#0e1680] shadow-xs transition-all"
          />
        </div>

        {/* 3. Bank name */}
        <div className="flex flex-col gap-1.5 w-full">
          <label className="text-[14px] font-semibold text-[#344054]">Bank name</label>
          <input
            type="text"
            value={bankName}
            onChange={(e) => setBankName(e.target.value)}
            className="w-full px-3.5 py-3 bg-white border border-[#d0d5dd] rounded-lg text-[14px] text-[#101828] focus:outline-none focus:ring-4 focus:ring-[#0e1680]/5 focus:border-[#0e1680] shadow-xs transition-all"
          />
        </div>

        {/* 4. Payment date */}
        <div className="flex flex-col gap-1.5 w-full">
          <label className="text-[14px] font-semibold text-[#344054]">Payment date</label>
          <div className="relative">
            <input
              ref={dateInputRef}
              type="date"
              value={paymentDate}
              onChange={(e) => setPaymentDate(e.target.value)}
              onClick={() => {
                try {
                  dateInputRef.current?.showPicker();
                } catch (e) { }
              }}
              className="w-full pl-3.5 pr-10 py-3 bg-white border border-[#d0d5dd] rounded-lg text-[14px] text-[#101828] focus:outline-none focus:ring-4 focus:ring-[#0e1680]/5 focus:border-[#0e1680] shadow-xs transition-all cursor-pointer [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:cursor-pointer"
            />
            <div
              onClick={() => {
                try {
                  dateInputRef.current?.showPicker();
                } catch (e) { }
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#667085] hover:text-[#0e1680] cursor-pointer pointer-events-none"
            >
              <Calendar size={18} />
            </div>
          </div>
        </div>

        {/* 5. Amount paid */}
        <div className="flex flex-col gap-1.5 w-full">
          <label className="text-[14px] font-semibold text-[#344054]">Amount paid</label>
          <input
            type="text"
            value={amountPaid}
            onChange={(e) => setAmountPaid(e.target.value)}
            className="w-full px-3.5 py-3 bg-white border border-[#d0d5dd] rounded-lg text-[14px] text-[#101828] focus:outline-none focus:ring-4 focus:ring-[#0e1680]/5 focus:border-[#0e1680] shadow-xs transition-all"
          />
        </div>

        {/* 6. Remarks */}
        <div className="flex flex-col gap-1.5 w-full">
          <label className="text-[14px] font-semibold text-[#344054]">Remarks</label>
          <input
            type="text"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            className="w-full px-3.5 py-3 bg-white border border-[#d0d5dd] rounded-lg text-[14px] text-[#101828] focus:outline-none focus:ring-4 focus:ring-[#0e1680]/5 focus:border-[#0e1680] shadow-xs transition-all"
          />
        </div>

        {/* 7. Upload proof */}
        <div className="flex flex-col gap-1.5 w-full">
          <label className="text-[14px] font-semibold text-[#344054]">Upload proof</label>
          <div className="relative">
            <input
              type="text"
              readOnly
              value={fileName}
              onClick={() => setIsUploadModalOpen(true)}
              className="w-full pl-3.5 pr-10 py-3 bg-white border border-[#d0d5dd] rounded-lg text-[14px] text-[#101828] focus:outline-none focus:ring-4 focus:ring-[#0e1680]/5 focus:border-[#0e1680] shadow-xs transition-all cursor-pointer"
            />
            <div
              onClick={() => setIsUploadModalOpen(true)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#667085] hover:text-[#0e1680] cursor-pointer"
            >
              <UploadCloud size={18} />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-[50px] items-center mt-[15px]">
          {/* Approve Payment Button */}
          <button
            type="button"
            onClick={handleApprove}
            disabled={isApproving || isRejecting || isGenerating}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-[#0E1680] hover:bg-[#0c126b] active:bg-[#9BA3F2] disabled:bg-[#9BA3F2] disabled:hover:bg-[#9BA3F2] text-white text-[14px] font-semibold rounded-lg shadow-sm focus:ring-4 focus:ring-[#0E1680]/20 transition-all disabled:cursor-not-allowed min-w-[165px] h-[44px] cursor-pointer"
          >
            {isApproving ? <RefreshCw className="animate-spin" size={16} /> : null}
            <span>Approve Payment</span>
          </button>

          {/* Reject Payment Button */}
          <button
            type="button"
            onClick={handleReject}
            disabled={isApproving || isRejecting || isGenerating}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-[#0E1680] hover:bg-[#0c126b] active:bg-[#9BA3F2] disabled:bg-[#9BA3F2] disabled:hover:bg-[#9BA3F2] text-white text-[14px] font-semibold rounded-lg shadow-sm focus:ring-4 focus:ring-[#0E1680]/20 transition-all disabled:cursor-not-allowed min-w-[155px] h-[44px] cursor-pointer"
          >
            {isRejecting ? <RefreshCw className="animate-spin" size={16} /> : null}
            <span>Reject Payment</span>
          </button>

          {/* Generate Receipt Button */}
          <button
            type="button"
            onClick={handleGenerateReceipt}
            disabled={isApproving || isRejecting || isGenerating}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-[#0E1680] hover:bg-[#0c126b] active:bg-[#9BA3F2] disabled:bg-[#9BA3F2] disabled:hover:bg-[#9BA3F2] text-white text-[14px] font-semibold rounded-lg shadow-sm focus:ring-4 focus:ring-[#0E1680]/20 transition-all disabled:cursor-not-allowed min-w-[163px] h-[44px] cursor-pointer"
          >
            {isGenerating ? <RefreshCw className="animate-spin" size={16} /> : null}
            <span>Generate receipt</span>
          </button>
        </div>
      </form>

      {/* ── Custom 'Upload Fees Receipt' Modal overlay (EXACT alignment with Figma) ── */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-[866px] min-h-[344px] shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col justify-between">
            {/* Header */}
            <div className="h-[60px] px-6 flex items-center justify-between border-b border-[#e4e7ec]">
              <span className="text-[16px] font-bold text-[#101828] tracking-tight">
                Upload Fees Receipt
              </span>
              <button
                type="button"
                onClick={() => setIsUploadModalOpen(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer text-[#667085]"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body / Dashed upload area */}
            <div className="px-6 py-4 flex-1 flex items-center justify-center">
              <div className="w-full min-h-[126px] border-2 border-dashed border-[#d0d5dd] hover:border-[#0e1680] bg-[#f9fafb] rounded-xl flex flex-col items-center justify-center gap-2 p-6 transition-colors cursor-pointer group">
                <div className="p-2 bg-white rounded-lg border border-[#e4e7ec] shadow-xs text-[#475467] group-hover:text-[#0e1680] group-hover:border-[#d2d6fc] transition-all">
                  <UploadCloud size={20} />
                </div>
                <div className="flex flex-col items-center gap-0.5 text-center select-none">
                  <span className="text-[14px] font-semibold text-[#101828] group-hover:text-[#0e1680] transition-colors">
                    Click to upload <span className="text-[#667085] font-normal">or drag and drop</span>
                  </span>
                  <span className="text-[12px] text-[#667085]">
                    PDF or excel
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Footer Buttons */}
            <div className="h-[84px] px-6 border-t border-[#e4e7ec] flex items-center justify-center gap-6 bg-[#f9fafb]">
              <button
                type="button"
                onClick={handleModalUpload}
                className="px-6 py-2.5 bg-[#0E1680] hover:bg-blue-900 text-white text-[14px] font-semibold rounded-lg shadow-sm focus:ring-4 focus:ring-[#0E1680]/20 transition-all min-w-[161px] h-[44px] cursor-pointer"
              >
                Upload
              </button>
              <button
                type="button"
                onClick={() => setIsUploadModalOpen(false)}
                className="px-6 py-2.5 bg-white border border-[#d0d5dd] hover:bg-gray-50 text-[#344054] text-[14px] font-semibold rounded-lg shadow-sm focus:ring-4 focus:ring-[#0E1680]/10 transition-all min-w-[161px] h-[44px] cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Success Pop Up Overlay (EXACT alignment with Figma node-id 15695:150360) ── */}
      {isSuccessModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-[4px] flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-[20px] w-[510px] min-h-[424px] shadow-[0px_12px_8px_rgba(16,24,40,0.08),0px_4px_3px_rgba(16,24,40,0.03)] flex flex-col items-center p-[20px] py-[45px] animate-in zoom-in-95 duration-200">
            <div className="flex flex-col gap-[28px] h-[334px] items-center justify-center w-full">
              {/* Exact Green Tickmark Check Circle from Figma SVG */}
              <div className="flex items-center justify-center p-[10px] rounded-[8px] w-[136px] h-[136px]">
                <svg viewBox="0 0 104.667 104.667" className="w-[104px] h-[104px]" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M100.667 47.9143V52.361C100.661 62.7837 97.2858 72.9253 91.0451 81.2732C84.8045 89.621 76.0325 95.728 66.0376 98.6832C56.0426 101.638 45.3601 101.284 35.5833 97.6715C25.8065 94.0595 17.4592 87.3838 11.7863 78.6402C6.11346 69.8965 3.41899 59.5533 4.10477 49.1532C4.79055 38.7531 8.81984 28.8532 15.5917 20.9302C22.3635 13.0071 31.5151 7.48535 41.6816 5.18837C51.848 2.8914 62.4846 3.9423 72.005 8.18434M100.667 13.6667L52.3333 62.0483L37.8333 47.5483"
                    stroke="#81D66A"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <p className="font-semibold leading-[32px] text-[24px] text-black text-center w-[425px]">
                Receipt uploaded successfully !
              </p>

              <div className="flex h-[44px] items-center justify-center w-full">
                <button
                  type="button"
                  onClick={() => setIsSuccessModalOpen(false)}
                  className="w-[86px] cursor-pointer flex flex-col items-start"
                >
                  <div className="bg-[#0e1680] hover:bg-blue-950 flex gap-[8px] items-center justify-center px-[18px] py-[10px] rounded-[8px] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] w-full h-[44px] transition-colors">
                    <span className="font-semibold leading-[24px] text-[16px] text-center text-white">
                      Back
                    </span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Success Pop Up Overlay (EXACT alignment with Figma node-id 15695:150983) ── */}
      {isApprovedModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-[4px] flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-[20px] w-[510px] min-h-[424px] shadow-[0px_12px_8px_rgba(16,24,40,0.08),0px_4px_3px_rgba(16,24,40,0.03)] flex flex-col items-center p-[20px] py-[45px] animate-in zoom-in-95 duration-200">
            <div className="flex flex-col gap-[28px] h-[334px] items-center justify-center w-full">
              {/* Exact Green Tickmark Check Circle from Figma SVG */}
              <div className="flex items-center justify-center p-[10px] rounded-[8px] w-[136px] h-[136px]">
                <svg viewBox="0 0 104.667 104.667" className="w-[104px] h-[104px]" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M100.667 47.9143V52.361C100.661 62.7837 97.2858 72.9253 91.0451 81.2732C84.8045 89.621 76.0325 95.728 66.0376 98.6832C56.0426 101.638 45.3601 101.284 35.5833 97.6715C25.8065 94.0595 17.4592 87.3838 11.7863 78.6402C6.11346 69.8965 3.41899 59.5533 4.10477 49.1532C4.79055 38.7531 8.81984 28.8532 15.5917 20.9302C22.3635 13.0071 31.5151 7.48535 41.6816 5.18837C51.848 2.8914 62.4846 3.9423 72.005 8.18434M100.667 13.6667L52.3333 62.0483L37.8333 47.5483"
                    stroke="#81D66A"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <p className="font-semibold leading-[32px] text-[24px] text-black text-center w-[425px]">
                Payment Approved!
              </p>

              <div className="flex h-[44px] items-center justify-center w-full">
                <button
                  type="button"
                  onClick={() => setIsApprovedModalOpen(false)}
                  className="w-[86px] cursor-pointer flex flex-col items-start"
                >
                  <div className="bg-[#0e1680] hover:bg-blue-950 flex gap-[8px] items-center justify-center px-[18px] py-[10px] rounded-[8px] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] w-full h-[44px] transition-colors">
                    <span className="font-semibold leading-[24px] text-[16px] text-center text-white">
                      Back
                    </span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Success Pop Up Overlay (EXACT alignment with Figma node-id 15742:87823) ── */}
      {isRejectedModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-[4px] flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-[20px] w-[510px] min-h-[424px] shadow-[0px_12px_8px_rgba(16,24,40,0.08),0px_4px_3px_rgba(16,24,40,0.03)] flex flex-col items-center p-[20px] py-[45px] animate-in zoom-in-95 duration-200">
            <div className="flex flex-col gap-[28px] h-[334px] items-center justify-center w-full">
              {/* Exact Red Cross close mark from Figma SVG */}
              <div className="flex items-center justify-center p-[10px] rounded-[8px] w-[136px] h-[136px]">
                <svg viewBox="0 0 78 78" className="w-[78px] h-[78px]" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M73 5L5 73M5 5L73 73"
                    stroke="#F61D1D"
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <p className="font-semibold leading-[32px] text-[24px] text-black text-center w-[425px]">
                Payment Rejected!
              </p>

              <div className="flex h-[44px] items-center justify-center w-full">
                <button
                  type="button"
                  onClick={() => setIsRejectedModalOpen(false)}
                  className="w-[86px] cursor-pointer flex flex-col items-start"
                >
                  <div className="bg-[#0e1680] hover:bg-blue-950 flex gap-[8px] items-center justify-center px-[18px] py-[10px] rounded-[8px] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] w-full h-[44px] transition-colors">
                    <span className="font-semibold leading-[24px] text-[16px] text-center text-white">
                      Back
                    </span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
