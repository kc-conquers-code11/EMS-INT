import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signUpSchema, signUpStepTwoSchema, type SignUpFormData, type SignUpStepTwoFormData, type SignUpStepThreeFormData } from '../../../schemas/authSchema';
import { SignUpSuccessModal } from '../../modals/Auth/SignUpSuccessModal';

const Logomark = () => (
    <div className="flex items-center gap-2">
        <div className="w-[32px] h-[32px] bg-[#0e1680] rounded-lg flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
        </div>
        <span className="font-semibold text-[31px] text-[#1d2939] tracking-tight">Sign Up</span>
    </div>
);

const BackIcon = () => (
    <svg className="w-5 h-5 text-[#687b96]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
);

const ChevronDownIcon = () => (
    <svg className="w-4 h-4 text-[#687b96]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
);

const StepOne = ({ onNext, defaultValues }: { onNext: (data: SignUpFormData) => void, defaultValues: SignUpFormData | null }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SignUpFormData>({
        resolver: zodResolver(signUpSchema),
        defaultValues: defaultValues || undefined
    });

    return (
        <div className="flex flex-col gap-8 w-full">
            <div className="flex justify-center w-full">
                <p className="text-[16px] text-[#687b96] leading-6 text-center">
                    Welcome ! Please enter your details.
                </p>
            </div>

            <form onSubmit={handleSubmit(onNext)} className="flex flex-col gap-5 w-full">
                {/* Student Name */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-[14px] font-medium text-[#344054] leading-5">Student Name</label>
                    <input
                        type="text"
                        {...register('studentName')}
                        placeholder="John"
                        className={`w-full bg-white border ${errors.studentName ? 'border-red-500 ring-2 ring-red-500/10' : 'border-[#d0d5dd]'} rounded-lg px-3.5 py-2.5 text-[#101828] placeholder-[#687b96] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0e1680]/20`}
                    />
                    {errors.studentName && (
                            <span className="text-xs text-red-500 mt-1 flex items-center gap-1">
                                <svg className="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                {errors.studentName.message}
                            </span>
                        )}
                </div>

                {/* Email */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-[14px] font-medium text-[#344054] leading-5">Email</label>
                    <input
                        type="email"
                        {...register('email')}
                        placeholder="john@gmail.com"
                        className={`w-full bg-white border ${errors.email ? 'border-red-500 ring-2 ring-red-500/10' : 'border-[#d0d5dd]'} rounded-lg px-3.5 py-2.5 text-[#101828] placeholder-[#687b96] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0e1680]/20`}
                    />
                    {errors.email && (
                            <span className="text-xs text-red-500 mt-1 flex items-center gap-1">
                                <svg className="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                {errors.email.message}
                            </span>
                        )}
                </div>

                {/* Passwords row */}
                <div className="flex gap-4 w-full">
                    <div className="flex flex-col gap-1.5 flex-1">
                        <label className="text-[14px] font-medium text-[#344054] leading-5">Password</label>
                        <input
                            type="password"
                            {...register('password')}
                            placeholder="xyz@1234"
                            className={`w-full bg-white border ${errors.password ? 'border-red-500 ring-2 ring-red-500/10' : 'border-[#d0d5dd]'} rounded-lg px-3.5 py-2.5 text-[#101828] placeholder-[#687b96] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0e1680]/20`}
                        />
                        {errors.password && (
                            <span className="text-xs text-red-500 mt-1 flex items-center gap-1">
                                <svg className="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                {errors.password.message}
                            </span>
                        )}
                    </div>

                    <div className="flex flex-col gap-1.5 flex-1">
                        <label className="text-[14px] font-medium text-[#344054] leading-5">Confirm Password</label>
                        <input
                            type="password"
                            {...register('confirmPassword')}
                            placeholder="xyz@1234"
                            className={`w-full bg-white border ${errors.confirmPassword ? 'border-red-500 ring-2 ring-red-500/10' : 'border-[#d0d5dd]'} rounded-lg px-3.5 py-2.5 text-[#101828] placeholder-[#687b96] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0e1680]/20`}
                        />
                        {errors.confirmPassword && (
                            <span className="text-xs text-red-500 mt-1 flex items-center gap-1">
                                <svg className="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                {errors.confirmPassword.message}
                            </span>
                        )}
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full bg-[#0e1680] text-white rounded-lg py-2.5 px-[18px] font-medium text-[16px] shadow-sm hover:bg-[#0a1060] transition-colors mt-4"
                >
                    Next
                </button>
                <button
                    type="submit"
                    className="w-full bg-[#0e1680] text-white rounded-lg py-2.5 px-[18px] font-medium text-[16px] shadow-sm hover:bg-[#0a1060] transition-colors mt-4"
                >
                    Back
                </button>
            </form>
        </div>
    );
};

const StepTwo = ({ onBack, onSubmit }: { onBack: () => void, onSubmit: (data: SignUpStepTwoFormData) => void }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SignUpStepTwoFormData>({
        resolver: zodResolver(signUpStepTwoSchema),
    });

    return (
        <div className="flex flex-col gap-6 w-full max-w-[480px] mx-auto overflow-y-auto max-h-[70vh] px-2 pb-4 scrollbar-hide">
            <div className="flex items-center justify-center w-full relative mb-2">
                <button 
                    onClick={onBack}
                    className="absolute left-0 flex items-center gap-2 text-[#687b96] hover:text-[#344054] transition-colors group"
                >
                    <BackIcon />
                </button>
                <p className="text-[16px] text-[#687b96] leading-6 text-center">
                    Additional Details
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 w-full">
                {/* College ID & GR Number */}
                <div className="flex gap-4 w-full">
                    <div className="flex flex-col gap-1.5 flex-1">
                        <label className="text-[14px] font-medium text-[#344054] leading-5">College ID</label>
                        <input
                            type="text"
                            {...register('stud_clg_id')}
                            placeholder="vu4s2425001"
                            className={`w-full bg-white border ${errors.stud_clg_id ? 'border-red-500 ring-2 ring-red-500/10' : 'border-[#d0d5dd]'} rounded-lg px-3 py-2 text-[#101828] placeholder-[#687b96] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0e1680]/20`}
                        />
                        {errors.stud_clg_id && (
                            <span className="text-xs text-red-500 mt-1 flex items-center gap-1">
                                <svg className="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                {errors.stud_clg_id.message}
                            </span>
                        )}
                    </div>

                    <div className="flex flex-col gap-1.5 flex-1">
                        <label className="text-[14px] font-medium text-[#344054] leading-5">GR Number</label>
                        <input
                            type="text"
                            {...register('gr_number')}
                            placeholder="GR-12345"
                            className={`w-full bg-white border ${errors.gr_number ? 'border-red-500 ring-2 ring-red-500/10' : 'border-[#d0d5dd]'} rounded-lg px-3 py-2 text-[#101828] placeholder-[#687b96] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0e1680]/20`}
                        />
                        {errors.gr_number && (
                            <span className="text-xs text-red-500 mt-1 flex items-center gap-1">
                                <svg className="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                {errors.gr_number.message}
                            </span>
                        )}
                    </div>
                </div>

                {/* Program & Branch */}
                <div className="flex gap-4 w-full">
                    <div className="flex flex-col gap-1.5 flex-1 relative">
                        <label className="text-[14px] font-medium text-[#344054] leading-5">Program</label>
                        <select
                            {...register('programm_id')}
                            className={`w-full bg-white border ${errors.programm_id ? 'border-red-500 ring-2 ring-red-500/10' : 'border-[#d0d5dd]'} rounded-lg px-3 py-2 text-[#101828] appearance-none shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0e1680]/20`}
                            defaultValue=""
                        >
                            <option value="" disabled>Select</option>
                            <option value="1">B.Tech</option>
                            <option value="2">M.Tech</option>
                            <option value="3">B.Sc</option>
                        </select>
                        <div className="absolute right-3 top-[32px] pointer-events-none">
                            <ChevronDownIcon />
                        </div>
                        {errors.programm_id && (
                            <span className="text-xs text-red-500 mt-1 flex items-center gap-1">
                                <svg className="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                {errors.programm_id.message}
                            </span>
                        )}
                    </div>

                    <div className="flex flex-col gap-1.5 flex-1 relative">
                        <label className="text-[14px] font-medium text-[#344054] leading-5">Branch</label>
                        <select
                            {...register('branch_id')}
                            className={`w-full bg-white border ${errors.branch_id ? 'border-red-500 ring-2 ring-red-500/10' : 'border-[#d0d5dd]'} rounded-lg px-3 py-2 text-[#101828] appearance-none shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0e1680]/20`}
                            defaultValue=""
                        >
                            <option value="" disabled>Select</option>
                            <option value="1">CS</option>
                            <option value="2">IT</option>
                            <option value="3">MECH</option>
                        </select>
                        <div className="absolute right-3 top-[32px] pointer-events-none">
                            <ChevronDownIcon />
                        </div>
                        {errors.branch_id && (
                            <span className="text-xs text-red-500 mt-1 flex items-center gap-1">
                                <svg className="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                {errors.branch_id.message}
                            </span>
                        )}
                    </div>
                </div>

                {/* Academic Year & Gender */}
                <div className="flex gap-4 w-full">
                    <div className="flex flex-col gap-1.5 flex-1 relative">
                        <label className="text-[14px] font-medium text-[#344054] leading-5">Year</label>
                        <select
                            {...register('academic_year')}
                            className={`w-full bg-white border ${errors.academic_year ? 'border-red-500 ring-2 ring-red-500/10' : 'border-[#d0d5dd]'} rounded-lg px-3 py-2 text-[#101828] appearance-none shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0e1680]/20`}
                            defaultValue=""
                        >
                            <option value="" disabled>Select</option>
                            <option value="FY">First Year (FY)</option>
                            <option value="SY">Second Year (SY)</option>
                            <option value="TY">Third Year (TY)</option>
                            <option value="LY">Final Year (LY)</option>
                        </select>
                        <div className="absolute right-3 top-[32px] pointer-events-none">
                            <ChevronDownIcon />
                        </div>
                        {errors.academic_year && (
                            <span className="text-xs text-red-500 mt-1 flex items-center gap-1">
                                <svg className="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                {errors.academic_year.message}
                            </span>
                        )}
                    </div>

                    <div className="flex flex-col gap-1.5 flex-1 relative">
                        <label className="text-[14px] font-medium text-[#344054] leading-5">Gender</label>
                        <select
                            {...register('gender')}
                            className={`w-full bg-white border ${errors.gender ? 'border-red-500 ring-2 ring-red-500/10' : 'border-[#d0d5dd]'} rounded-lg px-3 py-2 text-[#101828] appearance-none shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0e1680]/20`}
                            defaultValue=""
                        >
                            <option value="" disabled>Select</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                        <div className="absolute right-3 top-[32px] pointer-events-none">
                            <ChevronDownIcon />
                        </div>
                        {errors.gender && (
                            <span className="text-xs text-red-500 mt-1 flex items-center gap-1">
                                <svg className="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                {errors.gender.message}
                            </span>
                        )}
                    </div>
                </div>

                {/* Category & Handicap */}
                <div className="flex gap-4 w-full">
                    <div className="flex flex-col gap-1.5 flex-1 relative">
                        <label className="text-[14px] font-medium text-[#344054] leading-5">Category</label>
                        <select
                            {...register('cat_id')}
                            className={`w-full bg-white border ${errors.cat_id ? 'border-red-500 ring-2 ring-red-500/10' : 'border-[#d0d5dd]'} rounded-lg px-3 py-2 text-[#101828] appearance-none shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0e1680]/20`}
                            defaultValue=""
                        >
                            <option value="" disabled>Select</option>
                            <option value="1">General</option>
                            <option value="2">OBC</option>
                            <option value="3">SC</option>
                            <option value="4">ST</option>
                        </select>
                        <div className="absolute right-3 top-[32px] pointer-events-none">
                            <ChevronDownIcon />
                        </div>
                        {errors.cat_id && (
                            <span className="text-xs text-red-500 mt-1 flex items-center gap-1">
                                <svg className="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                {errors.cat_id.message}
                            </span>
                        )}
                    </div>

                    <div className="flex flex-col gap-1.5 flex-1 relative">
                        <label className="text-[14px] font-medium text-[#344054] leading-5">Physically Handicap</label>
                        <select
                            {...register('physically_handicap')}
                            className={`w-full bg-white border ${errors.physically_handicap ? 'border-red-500 ring-2 ring-red-500/10' : 'border-[#d0d5dd]'} rounded-lg px-3 py-2 text-[#101828] appearance-none shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0e1680]/20`}
                            defaultValue=""
                        >
                            <option value="" disabled>Select</option>
                            <option value="1">Yes</option>
                            <option value="0">No</option>
                        </select>
                        <div className="absolute right-3 top-[32px] pointer-events-none">
                            <ChevronDownIcon />
                        </div>
                        {errors.physically_handicap && (
                            <span className="text-xs text-red-500 mt-1 flex items-center gap-1">
                                <svg className="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                {errors.physically_handicap.message}
                            </span>
                        )}
                    </div>
                </div>

                {/* Defence & Enrollment Number */}
                <div className="flex gap-4 w-full">
                    <div className="flex flex-col gap-1.5 flex-1 relative">
                        <label className="text-[14px] font-medium text-[#344054] leading-5">Defence Status</label>
                        <select
                            {...register('defence_status')}
                            className={`w-full bg-white border ${errors.defence_status ? 'border-red-500 ring-2 ring-red-500/10' : 'border-[#d0d5dd]'} rounded-lg px-3 py-2 text-[#101828] appearance-none shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0e1680]/20`}
                            defaultValue=""
                        >
                            <option value="" disabled>Select</option>
                            <option value="1">Yes</option>
                            <option value="0">No</option>
                        </select>
                        <div className="absolute right-3 top-[32px] pointer-events-none">
                            <ChevronDownIcon />
                        </div>
                        {errors.defence_status && (
                            <span className="text-xs text-red-500 mt-1 flex items-center gap-1">
                                <svg className="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                {errors.defence_status.message}
                            </span>
                        )}
                    </div>

                    <div className="flex flex-col gap-1.5 flex-1">
                        <label className="text-[14px] font-medium text-[#344054] leading-5">Enrollment Number</label>
                        <input
                            type="text"
                            {...register('enrollment_number')}
                            placeholder="EN-12345"
                            className={`w-full bg-white border ${errors.enrollment_number ? 'border-red-500 ring-2 ring-red-500/10' : 'border-[#d0d5dd]'} rounded-lg px-3 py-2 text-[#101828] placeholder-[#687b96] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0e1680]/20`}
                        />
                        {errors.enrollment_number && (
                            <span className="text-xs text-red-500 mt-1 flex items-center gap-1">
                                <svg className="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                {errors.enrollment_number.message}
                            </span>
                        )}
                    </div>
                </div>

                {/* Contact No */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-[14px] font-medium text-[#344054] leading-5">Contact No</label>
                    <input
                        type="text"
                        {...register('contactNo')}
                        placeholder="1029384756"
                        className={`w-full bg-white border ${errors.contactNo ? 'border-red-500 ring-2 ring-red-500/10' : 'border-[#d0d5dd]'} rounded-lg px-3 py-2 text-[#101828] placeholder-[#687b96] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0e1680]/20`}
                    />
                    {errors.contactNo && (
                            <span className="text-xs text-red-500 mt-1 flex items-center gap-1">
                                <svg className="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                {errors.contactNo.message}
                            </span>
                        )}
                </div>

                <button
                    type="submit"
                    className="w-full bg-[#0e1680] text-white rounded-lg py-2.5 px-[18px] font-medium text-[16px] shadow-sm hover:bg-[#0a1060] transition-colors mt-2"
                >
                    Submit
                </button>
            </form>
        </div>
    );
};

const StepThree = ({ onSubmit, isSubmitting }: { onSubmit: (data: SignUpStepThreeFormData) => void, isSubmitting: boolean }) => {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [error, setError] = useState('');
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const handleChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return;
        
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        setError('');

        if (value !== '' && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        if (pastedData) {
            const newOtp = [...otp];
            for (let i = 0; i < pastedData.length; i++) {
                newOtp[i] = pastedData[i];
            }
            setOtp(newOtp);
            setError('');
            if (pastedData.length < 6) {
                inputRefs.current[pastedData.length]?.focus();
            } else {
                inputRefs.current[5]?.focus();
            }
        }
    };

    const handleConfirm = () => {
        const otpString = otp.join('');
        if (otpString.length < 6) {
            setError('Please enter a valid 6-digit OTP');
            return;
        }
        onSubmit({ otp: otpString });
    };

    return (
        <div className="flex flex-col gap-8 w-full max-w-[320px] mx-auto items-center">
            <p className="text-[16px] font-medium text-[#101828] text-center w-full">
                Enter OTP:
            </p>

            <div className="flex gap-3 justify-center w-full">
                {otp.map((digit, index) => (
                    <input
                        key={index}
                        ref={(el) => { inputRefs.current[index] = el; }}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        onPaste={handlePaste}
                        className="w-[40px] h-[50px] border border-[rgba(0,0,0,0.5)] rounded-[5px] text-center text-xl font-medium focus:outline-none focus:ring-2 focus:ring-[#0e1680]/50 focus:border-transparent transition-all bg-white"
                    />
                ))}
            </div>
            {error && <p className="text-red-500 text-xs text-center">{error}</p>}

            <button
                onClick={handleConfirm}
                disabled={isSubmitting}
                className="w-full bg-[#0e1680] text-white rounded-[8px] py-2.5 px-[18px] font-medium text-[16px] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] hover:bg-[#0a1060] transition-colors mt-2"
            >
                Confirm
            </button>
        </div>
    );
};

export const SignUpForm = () => {
    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [stepOneData, setStepOneData] = useState<SignUpFormData | null>(null);
    const [stepTwoData, setStepTwoData] = useState<SignUpStepTwoFormData | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const handleNextStep1 = (data: SignUpFormData) => {
        setStepOneData(data);
        setStep(2);
    };

    const handleNextStep2 = (data: SignUpStepTwoFormData) => {
        setStepTwoData(data);
        setStep(3);
    };

    const handleFinalSubmit = async (stepThreeData: SignUpStepThreeFormData) => {
        if (!stepOneData || !stepTwoData) return;
        
        setIsSubmitting(true);
        const finalData = {
            ...stepOneData,
            ...stepTwoData,
            ...stepThreeData
        };
        
        console.log('Final complete signup data with OTP:', finalData);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsSubmitting(false);
        setShowSuccessModal(true);
    };

    return (
        <div className="flex flex-col items-center justify-center w-full max-w-[400px] mx-auto h-full">
            <div className="w-full flex flex-col gap-8">
                <div className="flex justify-center w-full">
                    <Logomark />
                </div>

                {step === 1 && (
                    <StepOne 
                        defaultValues={stepOneData} 
                        onNext={handleNextStep1} 
                    />
                )}
                
                {step === 2 && (
                    <StepTwo 
                        onBack={() => setStep(1)} 
                        onSubmit={handleNextStep2} 
                    />
                )}

                {step === 3 && (
                    <StepThree 
                        onSubmit={handleFinalSubmit} 
                        isSubmitting={isSubmitting}
                    />
                )}
            </div>
            
            <SignUpSuccessModal isOpen={showSuccessModal} />
        </div>
    );
};
