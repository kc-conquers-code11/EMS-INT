import React from "react";

interface DeleteInstitutionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  institutionName?: string;
  isPermanent?: boolean;
}

export const DeleteInstitutionModal: React.FC<DeleteInstitutionModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  institutionName,
  isPermanent = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-[rgba(16,24,40,0.6)] backdrop-blur-[4px]">
      <div className="bg-white rounded-[20px] shadow-[0px_12px_16px_0px_rgba(16,24,40,0.08),0px_4px_6px_0px_rgba(16,24,40,0.03)] w-full max-w-[510px] p-[40px_20px] flex flex-col items-center text-center">
        {/* Danger Icon */}
        <div className="w-[136px] h-[136px] flex items-center justify-center mb-[28px]">
          <svg
            className="w-full h-full text-[#ff4141]"
            viewBox="0 0 121.333 121.333"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M60.6667 83.3333V60.6667M60.6667 38H60.7233M117.333 60.6667C117.333 91.9628 91.9628 117.333 60.6667 117.333C29.3705 117.333 4 91.9628 4 60.6667C4 29.3705 29.3705 4 60.6667 4C91.9628 4 117.333 29.3705 117.333 60.6667Z"
              stroke="currentColor"
              strokeWidth="8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* Message */}
        <h3 className="text-[24px] font-semibold text-black leading-[32px] mb-[16px] max-w-[400px]">
          {isPermanent
            ? "Permanently Delete Institution?"
            : "Delete Institution?"}
        </h3>

        {institutionName && (
          <p className="text-gray-600 mb-[28px] text-center">
            Are you sure you want to{" "}
            {isPermanent ? "permanently delete" : "delete"}{" "}
            <strong className="text-red-600">"{institutionName}"</strong>?
            {isPermanent && (
              <span className="block mt-2 text-sm text-red-500">
                This action cannot be undone.
              </span>
            )}
          </p>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-4 w-full">
          <button
            onClick={onClose}
            className="bg-gray-100 text-gray-700 px-[18px] py-[10px] rounded-[8px] font-semibold text-[16px] leading-[24px] hover:bg-gray-200 transition-colors min-w-[100px]"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="bg-[#ff4141] text-white px-[18px] py-[10px] rounded-[8px] font-semibold text-[16px] leading-[24px] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] hover:bg-[#e63b3b] transition-colors min-w-[100px]"
          >
            {isPermanent ? "Permanently Delete" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};
