// src/components/modals/Institution/COECreatedSuccessModal.tsx
import React from "react";

interface COECreatedSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const COECreatedSuccessModal: React.FC<COECreatedSuccessModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center bg-[rgba(16,24,40,0.6)] backdrop-blur-[4px]">
      <div className="bg-white rounded-[20px] shadow-lg w-full max-w-[510px] p-[40px_20px] flex flex-col items-center text-center">
        {/* Success Icon */}
        <div className="w-[100px] h-[100px] flex items-center justify-center mb-6 bg-green-100 rounded-full">
          <svg
            className="w-16 h-16 text-green-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        <h3 className="text-2xl font-bold text-[#0e1680] mb-4">
          COE Created Successfully!
        </h3>

        <p className="text-gray-600 mb-6">
          The COE has been created and an email with login credentials has been
          sent to their email address.
        </p>

        <button
          onClick={onClose}
          className="bg-[#0e1680] text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-[#0a106e] transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
};
