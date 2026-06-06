import React from 'react';
import { SignUpForm } from '../../components/screens/Auth/StudentSignUpForm';
import { AuthGraphic } from '../../components/screens/Auth/AuthGraphic';

export const StudentSignUpPage = () => {
    return (
        <div className="min-h-screen bg-white flex items-center p-6 justify-center">
            <div className="flex w-full max-w-[1440px] items-center justify-between gap-8 lg:gap-10 xl:gap-20 2xl:gap-32">

                {/* Left Side Graphic Panel */}
                <AuthGraphic />

                {/* Right Side Form Panel */}
                <div className="flex-1 flex justify-center items-center h-full">
                    <SignUpForm />
                </div>
            </div>
        </div>
    );
};
