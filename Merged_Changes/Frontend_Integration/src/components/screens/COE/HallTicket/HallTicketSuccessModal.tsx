import React from 'react';

interface HallTicketSuccessModalProps {
  onClose: () => void;
  message?: string;
}

export const HallTicketSuccessModal: React.FC<HallTicketSuccessModalProps> = ({ onClose, message = 'Settings saved successfully !' }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-[20px] px-5 py-[45px] w-[510px] shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="flex flex-col items-center justify-center gap-7">

          {/* Success Icon */}
          <div className="flex items-center justify-center p-[10px] w-[136px] h-[136px] rounded-[8px]">
            <svg width="116" height="116" viewBox="0 0 116 116" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="58" cy="58" r="54" stroke="#81D66A" strokeWidth="4" strokeDasharray="8 8" />
              <path d="M40 58L52 70L76 46" stroke="#81D66A" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          {/* Message */}
          <p className="text-[24px] font-semibold text-black text-center leading-[32px] w-[425px] font-['Instrument_Sans']">
            {message}
          </p>

          {/* Back Button */}
          <div className="flex items-center justify-center w-full h-[44px]">
            <button
              id="hall-ticket-success-back"
              onClick={onClose}
              className="bg-[#0e1680] text-white font-semibold text-[16px] leading-[24px] px-[18px] py-[10px] rounded-[8px] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] hover:bg-[#0c1260] transition-colors cursor-pointer font-['Instrument_Sans']"
            >
              Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
