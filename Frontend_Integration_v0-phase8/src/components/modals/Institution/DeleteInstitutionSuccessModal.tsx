// src/components/modals/Institution/DeleteInstitutionSuccessModal.tsx
import React from "react";

interface DeleteInstitutionSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  isPermanent?: boolean;
}

export const DeleteInstitutionSuccessModal: React.FC<
  DeleteInstitutionSuccessModalProps
> = ({ isOpen, onClose, isPermanent = false }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-[rgba(16,24,40,0.6)] backdrop-blur-[4px]">
      <div className="bg-white rounded-[20px] shadow-[0px_12px_16px_0px_rgba(16,24,40,0.08),0px_4px_6px_0px_rgba(16,24,40,0.03)] w-full max-w-[510px] p-[40px_20px] flex flex-col items-center text-center">
        {/* Success Icon */}
        <div className="w-[136px] h-[136px] flex items-center justify-center mb-[28px]">
          <svg
            className="w-full h-full text-[#81D66A]"
            viewBox="0 0 104.667 104.667"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100.667 47.9143V52.361C100.661 62.7837 97.2858 72.9253 91.0451 81.2732C84.8045 89.621 76.0325 95.728 66.0376 98.6832C56.0426 101.638 45.3601 101.284 35.5833 97.6715C25.8065 94.0595 17.4592 87.3838 11.7863 78.6402C6.11346 69.8965 3.41899 59.5533 4.10477 49.1532C4.79055 38.7531 8.81984 28.8532 15.5917 20.9302C22.3635 13.0071 31.5151 7.48535 41.6816 5.18837C51.848 2.8914 62.4846 3.9123 72.005 8.18434M100.667 13.6667L52.3333 62.0483L37.8333 47.5483"
              stroke="currentColor"
              strokeWidth="8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* Message */}
        <h3 className="text-[24px] font-semibold text-black leading-[32px] mb-[28px] max-w-[435px]">
          Institution {isPermanent ? "permanently deleted" : "deleted"}{" "}
          successfully!
        </h3>

        {/* Back Button */}
        <div className="flex items-center justify-center w-full">
          <button
            onClick={onClose}
            className="bg-[#0e1680] text-white px-[18px] py-[10px] rounded-[8px] font-semibold text-[16px] leading-[24px] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] hover:bg-[#0a106e] transition-colors min-w-[100px]"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
};
