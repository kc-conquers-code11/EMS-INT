import React, { useState } from 'react';

export const NotificationTab: React.FC = () => {
  const [notificationType, setNotificationType] = useState('Pending Fees Reminder');
  const [selectStudents, setSelectStudents] = useState('All Pending Students');
  const [messagePreview, setMessagePreview] = useState(
    'Dear Student, your exam fee payment of ₹1500 is pending. Please complete payment before 25-Apr-2026 to avoid late fine.'
  );

  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [isSendingSms, setIsSendingSms] = useState(false);

  // Success Modal states
  const [isEmailSuccessOpen, setIsEmailSuccessOpen] = useState(false);
  const [isSmsSuccessOpen, setIsSmsSuccessOpen] = useState(false);

  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSendingEmail(true);
    setTimeout(() => {
      setIsSendingEmail(false);
      setIsEmailSuccessOpen(true);
    }, 800);
  };

  const handleSendSms = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSendingSms(true);
    setTimeout(() => {
      setIsSendingSms(false);
      setIsSmsSuccessOpen(true);
    }, 800);
  };

  return (
    <div className="w-full flex flex-col gap-6 font-['Instrument_Sans'] select-none">
      
      {/* ── Notification Form (EXACT alignment with Figma node-id 15695:150705) ── */}
      <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-5 bg-white border border-[#e4e7ec] rounded-2xl p-8 shadow-xs">
        
        {/* 1. Notification Type */}
        <div className="flex flex-col gap-1.5 w-full">
          <label className="text-[14px] font-semibold text-[#344054]">Notification Type</label>
          <div className="relative">
            <select
              value={notificationType}
              onChange={(e) => setNotificationType(e.target.value)}
              className="w-full px-3.5 py-3 bg-white border border-[#d0d5dd] rounded-lg text-[14px] text-[#101828] focus:outline-none focus:ring-4 focus:ring-[#0e1680]/5 focus:border-[#0e1680] shadow-xs appearance-none cursor-pointer"
            >
              <option value="Pending Fees Reminder">Pending Fees Reminder</option>
              <option value="Late Fees Alert">Late Fees Alert</option>
              <option value="General Exam Alert">General Exam Alert</option>
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#667085]">
              <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </div>

        {/* 2. Select Students */}
        <div className="flex flex-col gap-1.5 w-full">
          <label className="text-[14px] font-semibold text-[#344054]">Select Students</label>
          <div className="relative">
            <select
              value={selectStudents}
              onChange={(e) => setSelectStudents(e.target.value)}
              className="w-full px-3.5 py-3 bg-white border border-[#d0d5dd] rounded-lg text-[14px] text-[#101828] focus:outline-none focus:ring-4 focus:ring-[#0e1680]/5 focus:border-[#0e1680] shadow-xs appearance-none cursor-pointer"
            >
              <option value="All Pending Students">All Pending Students</option>
              <option value="Defaulters Only">Defaulters Only</option>
              <option value="Regular Students Only">Regular Students Only</option>
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#667085]">
              <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </div>

        {/* 3. Message Preview */}
        <div className="flex flex-col gap-1.5 w-full">
          <label className="text-[14px] font-semibold text-[#344054]">Message Preview</label>
          <textarea
            value={messagePreview}
            onChange={(e) => setMessagePreview(e.target.value)}
            rows={4}
            className="w-full px-3.5 py-3 bg-white border border-[#d0d5dd] rounded-lg text-[14px] text-[#101828] focus:outline-none focus:ring-4 focus:ring-[#0e1680]/5 focus:border-[#0e1680] shadow-xs transition-all resize-none"
          />
        </div>

        {/* Action Buttons aligned right (EXACT gap and layout from Figma) */}
        <div className="flex justify-end gap-[50px] items-center mt-[15px]">
          {/* Send email Button */}
          <button
            type="button"
            onClick={handleSendEmail}
            disabled={isSendingEmail || isSendingSms}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-[#0b0f4d] hover:bg-blue-900 text-white text-[14px] font-semibold rounded-lg shadow-sm focus:ring-4 focus:ring-[#0b0f4d]/20 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed min-w-[114px] h-[44px] cursor-pointer"
          >
            {isSendingEmail ? (
              <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : null}
            <span>Send email</span>
          </button>

          {/* Send SMS Button */}
          <button
            type="button"
            onClick={handleSendSms}
            disabled={isSendingEmail || isSendingSms}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-[#0b0f4d] hover:bg-blue-900 text-white text-[14px] font-semibold rounded-lg shadow-sm focus:ring-4 focus:ring-[#0b0f4d]/20 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed min-w-[109px] h-[44px] cursor-pointer"
          >
            {isSendingSms ? (
              <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : null}
            <span>Send SMS</span>
          </button>
        </div>
      </form>

      {/* ── Email Success Pop Up Overlay (EXACT alignment with Figma success system) ── */}
      {isEmailSuccessOpen && (
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
                Emails sent successfully!
              </p>

              <div className="flex h-[44px] items-center justify-center w-full">
                <button
                  type="button"
                  onClick={() => setIsEmailSuccessOpen(false)}
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

      {/* ── SMS Success Pop Up Overlay (EXACT alignment with Figma success system) ── */}
      {isSmsSuccessOpen && (
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
                SMS sent successfully!
              </p>

              <div className="flex h-[44px] items-center justify-center w-full">
                <button
                  type="button"
                  onClick={() => setIsSmsSuccessOpen(false)}
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
