import React from 'react';

interface BranchSuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const BranchSuccessModal: React.FC<BranchSuccessModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
            <div className="bg-white w-[510px] rounded-[20px] p-10 flex flex-col items-center gap-7 shadow-xl animate-in fade-in zoom-in duration-300">
                {/* Success Icon */}
                <div className="w-32 h-32 flex items-center justify-center rounded-full bg-white border-[10px] border-white relative overflow-hidden">
                    <svg 
                        className="w-full h-full text-[#81D66A]" 
                        viewBox="0 0 136 136" 
                        fill="none" 
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <circle cx="68" cy="68" r="60" stroke="currentColor" strokeWidth="8" />
                        <path 
                            d="M45 68L60 83L91 52" 
                            stroke="currentColor" 
                            strokeWidth="8" 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                        />
                    </svg>
                </div>

                <div className="text-center">
                    <h2 className="text-[24px] font-semibold text-black leading-8">
                        Branch Added successfully !
                    </h2>
                </div>

                <div className="w-full flex justify-center">
                    <button
                        onClick={onClose}
                        className="bg-[#0e1680] hover:bg-[#0a106e] text-white px-8 py-2.5 rounded-lg font-semibold text-base transition-colors shadow-sm min-w-[100px]"
                    >
                        Back
                    </button>
                </div>
            </div>
        </div>
    );
};
