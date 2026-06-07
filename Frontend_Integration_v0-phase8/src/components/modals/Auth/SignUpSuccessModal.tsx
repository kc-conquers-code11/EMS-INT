import React from 'react';
import { useNavigate } from 'react-router-dom';

interface SignUpSuccessModalProps {
    isOpen: boolean;
    redirectTo?: string;
}

export const SignUpSuccessModal: React.FC<SignUpSuccessModalProps> = ({ isOpen, redirectTo = '/login' }) => {
    const navigate = useNavigate();

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-[#101828]/60 backdrop-blur-[4px] z-50 flex items-center justify-center">
            <div className="bg-white w-full max-w-[510px] h-[442px] rounded-[20px] flex flex-col items-center justify-center gap-6 relative shadow-xl">
                {/* Check Circle Icon */}
                <div className="flex items-center justify-center w-[120px] h-[120px]">
                    <svg className="w-[80px] h-[80px] text-[#81d66a]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>

                {/* Text */}
                <h2 className="font-semibold text-[24px] text-black leading-[32px] tracking-tight">
                    Signed up successfully !!
                </h2>

                {/* Button */}
                <button
                    onClick={() => navigate(redirectTo)}
                    className="mt-4 bg-[#0e1680] text-white rounded-[8px] py-2.5 px-[18px] w-[86px] font-semibold text-[16px] shadow-sm hover:bg-[#0a1060] transition-colors"
                >
                    Back
                </button>
            </div>
        </div>
    );
};
