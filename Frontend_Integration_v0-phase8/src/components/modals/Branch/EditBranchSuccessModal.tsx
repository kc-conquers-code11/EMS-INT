import React from 'react';

interface EditBranchSuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const EditBranchSuccessModal: React.FC<EditBranchSuccessModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
            <div className="bg-white w-[400px] p-8 rounded-[24px] shadow-xl animate-in fade-in zoom-in duration-200 text-center">
                {/* Success Icon */}
                <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 bg-[#effbe7] rounded-full flex items-center justify-center">
                        <div className="w-12 h-12 bg-[#32d583] rounded-full flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Message */}
                <h2 className="text-xl font-bold text-[#101828] mb-8">
                    Branch edited successfully !!
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
