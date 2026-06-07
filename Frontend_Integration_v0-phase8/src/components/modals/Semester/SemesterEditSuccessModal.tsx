import React from 'react';

interface SemesterEditSuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const SemesterEditSuccessModal = ({ isOpen, onClose }: SemesterEditSuccessModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-[24px] p-10 flex flex-col items-center max-w-[400px] w-full shadow-2xl animate-in fade-in zoom-in duration-300">
                {/* Success Icon */}
                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                        <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                </div>

                {/* Text Content */}
                <h3 className="text-[20px] font-bold text-[#101828] mb-8 text-center px-4 leading-relaxed">
                    Semester under Scheme edited successfully !!
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
