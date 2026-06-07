import React from 'react';
import { FacultySignUpForm } from '../../components/screens/Auth/FacultySignUpForm';
import { AuthGraphic } from '../../components/screens/Auth/AuthGraphic';

export const FacultySignUpPage = () => {
    return (
        <div className="min-h-screen bg-white flex items-center p-6 justify-center">
            <div className="flex w-full max-w-[1440px] items-center justify-between gap-8 lg:gap-10 xl:gap-20 2xl:gap-32">
                
                {/* Left Side Graphic Panel */}
                <AuthGraphic />

                {/* Right Side Form Panel */}
                <div className="flex-1 flex justify-center items-center h-full">
                    <FacultySignUpForm />
                </div>
            </div>
        </div>
    );
};
