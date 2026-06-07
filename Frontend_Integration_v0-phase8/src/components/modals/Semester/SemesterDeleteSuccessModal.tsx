import React from 'react';

interface SemesterDeleteSuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const SemesterDeleteSuccessModal = ({ isOpen, onClose }: SemesterDeleteSuccessModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-[24px] p-10 flex flex-col items-center max-w-[400px] w-full shadow-2xl animate-in fade-in zoom-in duration-300">
                {/* Trash Icon */}
                <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                        <svg className="w-10 h-10 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1-1v3M4 7h16" />
                        </svg>
                    </div>
                </div>

                {/* Text Content */}
                <h3 className="text-[20px] font-bold text-[#101828] mb-8 text-center px-4 leading-relaxed">
                    Semester deleted successfully !!
                </h3>

                {/* Back Button */}
                <button
                    onClick={onClose}
                    className="w-full max-w-[120px] bg-[#0e1680] text-white py-3 rounded-xl font-semibold hover:bg-[#0a1060] transition-colors shadow-lg"
                >
                    Back
                </button>
            </div>
        </div>
    );
};
