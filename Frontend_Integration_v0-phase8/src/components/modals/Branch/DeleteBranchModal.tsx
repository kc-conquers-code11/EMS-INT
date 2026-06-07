import React from 'react';

interface DeleteBranchModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    branchName: string;
}

export const DeleteBranchModal: React.FC<DeleteBranchModalProps> = ({ isOpen, onClose, onConfirm, branchName }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
            <div className="bg-white w-[400px] p-8 rounded-[24px] shadow-xl animate-in fade-in zoom-in duration-200 text-center">
                {/* Warning Icon */}
                <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 bg-[#fee4e2] rounded-full flex items-center justify-center">
                        <div className="w-12 h-12 bg-[#f04438] rounded-full flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Message */}
                <h2 className="text-xl font-bold text-[#101828] mb-8">
                    Do you really want to delete this Branch?
                </h2>

                {/* Actions */}
                <div className="flex gap-3">
                    <button
                        onClick={onConfirm}
                        className="flex-1 py-2.5 bg-[#0e1680] text-white rounded-lg font-semibold hover:bg-[#0a0f5a] transition-colors shadow-sm"
                    >
                        Delete
                    </button>
                    <button
                        onClick={onClose}
                        className="flex-1 py-2.5 bg-[#0e1680] text-white rounded-lg font-semibold hover:bg-[#0a0f5a] transition-colors shadow-sm"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};
