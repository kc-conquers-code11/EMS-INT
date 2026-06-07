import React from 'react';

interface SuccessModalProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
}

export const SuccessModal: React.FC<SuccessModalProps> = ({ isOpen, title, onClose }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center" 
      style={{ background: 'rgba(16,24,40,0.6)', backdropFilter: 'blur(4px)' }}
    >
      <div 
        className="bg-white flex flex-col items-center justify-center rounded-2xl shadow-2xl animate-in zoom-in-95 duration-200" 
        style={{ width: '510px', height: '442px' }}
      >
        <div className="flex flex-col items-center gap-[40px] w-full px-8">
          <div className="flex flex-col items-center gap-[24px] w-full">
            {/* The exact green checkmark with broken circle from student management */}
            <div className="w-[120px] h-[120px] flex items-center justify-center">
              <svg width="120" height="120" viewBox="0 0 74.6667 74.6667" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path 
                  d="M70.6667 34.2858V37.3524C70.6626 44.5405 68.335 51.5347 64.0311 57.2918C59.7272 63.049 53.6776 67.2607 46.7845 69.2988C39.8914 71.3368 32.5242 71.0921 25.7816 68.601C19.0389 66.11 13.2822 61.5061 9.36987 55.476C5.45756 49.4459 3.59931 42.3126 4.07226 35.1401C4.54521 27.9676 7.32403 21.1402 11.9943 15.676C16.6645 10.2118 22.976 6.40369 29.9873 4.81957C36.9986 3.23545 44.3342 3.96021 50.9 6.88575M70.6667 10.6667L37.3333 44.0333L27.3333 34.0333" 
                  stroke="#81D66A" 
                  strokeWidth="6" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            
            <h2 
              className="text-[24px] font-semibold text-black text-center max-w-[440px] leading-tight" 
              style={{ fontFamily: "'Instrument Sans', sans-serif" }}
            >
              {title}
            </h2>
          </div>

          <button 
            onClick={onClose} 
            className="bg-[#0e1680] flex items-center justify-center h-[44px] px-10 text-white text-[16px] font-semibold rounded-lg hover:bg-blue-900 transition-all shadow-md min-w-[140px] focus:outline-none"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
};
