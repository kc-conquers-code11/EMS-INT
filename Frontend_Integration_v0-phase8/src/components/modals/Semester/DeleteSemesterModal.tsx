import React from 'react';

interface DeleteSemesterModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export const DeleteSemesterModal = ({ isOpen, onClose, onConfirm }: DeleteSemesterModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-[24px] p-10 flex flex-col items-center max-w-[400px] w-full shadow-2xl animate-in fade-in zoom-in duration-300">
                {/* Warning Icon */}
                <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                        <svg className="w-10 h-10 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                </div>

                {/* Text Content */}
                <h3 className="text-[20px] font-bold text-[#101828] mb-8 text-center px-4 leading-relaxed">
                    Do you really want to delete this Semester?
                </h3>

                {/* Buttons */}
                <div className="flex gap-4 w-full justify-center">
                    <button
                        onClick={onConfirm}
                        className="flex-1 max-w-[120px] bg-[#0e1680] text-white py-3 rounded-xl font-semibold hover:bg-red-700 transition-colors shadow-lg"
                    >
                        Delete
                    </button>
                    <button
                        onClick={onClose}
                        className="flex-1 max-w-[120px] bg-[#0e1680] text-white py-3 rounded-xl font-semibold hover:bg-gray-700 transition-colors shadow-lg"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};
