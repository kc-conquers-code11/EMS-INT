import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginFormData } from '../../../schemas/authSchema';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';

const Logomark = () => (
    <div className="flex items-center gap-2">
        <div className="w-[32px] h-[32px] bg-[#0e1680] rounded-lg flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
        </div>
        <span className="font-semibold text-[31px] text-[#1d2939] tracking-tight">Log in</span>
    </div>
);

const EyeSlashIcon = () => (
    <svg className="w-4 h-4 text-[#98a2b3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
    </svg>
);

const EyeIcon = () => (
    <svg className="w-4 h-4 text-[#98a2b3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
);

export const FacultyLoginForm = () => {
    const [showPassword, setShowPassword] = useState(false);
    const { login, isLoading, error, dismissError } = useAuth();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormData) => {
        try {
            dismissError();
            await login(data);
        } catch (err) {
            console.error('Login error:', err);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center w-full max-w-[360px] mx-auto h-full py-8">
            <div className="w-full flex flex-col gap-8">
                <div className="flex flex-col items-center gap-4 w-full">
                    <Logomark />
                </div>

                {error && (
                    <p className="text-red-500 text-sm text-center leading-tight">
                        {error}
                    </p>
                )}

                <div className="flex flex-col gap-8 w-full">
                    <div className="flex flex-col gap-2 text-center">
                        <h1 className="text-[30px] font-semibold text-[#101828] leading-[38px] tracking-tight">
                            Sign in to your account
                        </h1>
                        <p className="text-[16px] text-[#687b96] leading-6">
                            Welcome back! Please enter your details.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 w-full">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[14px] font-medium text-[#344054] leading-5">Email*</label>
                            <input
                                type="email"
                                {...register('email')}
                                placeholder="Enter your e-mail"
                                className={`w-full bg-white border ${errors.email ? 'border-red-500 ring-2 ring-red-500/10' : 'border-[#d0d5dd]'} rounded-lg px-3.5 py-2.5 text-[#101828] placeholder-[#687b96] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0e1680]/20`}
                            />
                            {errors.email && (
                                <span className="text-xs text-red-500 mt-1 flex items-center gap-1">
                                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    {errors.email.message}
                                </span>
                            )}
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-[14px] font-medium text-[#344054] leading-5">Password*</label>
                            <div className="relative w-full">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    {...register('password')}
                                    placeholder="Enter your password"
                                    className={`w-full bg-white border ${errors.password ? 'border-red-500 ring-2 ring-red-500/10' : 'border-[#d0d5dd]'} rounded-lg pl-3.5 pr-10 py-2.5 text-[#101828] placeholder-[#687b96] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0e1680]/20`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center"
                                >
                                    {showPassword ? <EyeIcon /> : <EyeSlashIcon />}
                                </button>
                            </div>
                            <div className="flex justify-between items-start mt-1">
                                <p className="text-[14px] text-[#475467] leading-5">Must be at least 8 characters.</p>
                                {errors.password && (
                                    <span className="text-xs text-red-500 flex items-center gap-1 max-w-[150px] text-right">
                                        <svg className="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        {errors.password.message}
                                    </span>
                                )}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-[#0e1680] text-white rounded-lg py-2.5 px-[18px] font-medium text-[16px] shadow-sm hover:bg-[#0a1060] transition-colors mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Logging in...' : 'Log in'}
                        </button>
                    </form>

                    <div className="flex flex-col gap-7 w-full mt-1">
                        <div className="flex items-center gap-3 w-full">
                            <div className="h-px bg-[#eaecf0] flex-1" />
                            <span className="text-[14px] font-medium text-[#475467]">OR</span>
                            <div className="h-px bg-[#eaecf0] flex-1" />
                        </div>

                        <div className="flex items-center justify-center gap-1 text-[14px]">
                            <span className="text-[#101828]">I don't have an account?</span>
                            <Link to="/faculty-signup" className="text-[#0e1680] font-semibold hover:underline">
                                Sign Up
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
