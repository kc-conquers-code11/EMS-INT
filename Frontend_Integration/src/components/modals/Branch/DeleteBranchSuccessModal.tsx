import React from 'react';

interface DeleteBranchSuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const DeleteBranchSuccessModal: React.FC<DeleteBranchSuccessModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
            <div className="bg-white w-[400px] p-8 rounded-[24px] shadow-xl animate-in fade-in zoom-in duration-200 text-center">
                {/* Success Icon */}
                <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 bg-[#fee4e2] rounded-full flex items-center justify-center">
                        <svg className="w-10 h-10 text-[#f04438]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </div>
                </div>

                {/* Message */}
                <h2 className="text-xl font-bold text-[#101828] mb-8">
                    Branch deleted successfully!
                </h2>

                {/* Back Button */}
                <button
                    onClick={onClose}
                    className="w-full py-3 bg-[#0e1680] text-white rounded-lg font-semibold hover:bg-[#0a0f5a] transition-colors shadow-lg"
                >
                    Back
                </button>
            </div>
        </div>
    );
};
