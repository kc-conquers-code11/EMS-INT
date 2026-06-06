import { useFormContext } from 'react-hook-form';

const getInputClass = (hasError?: boolean) => `w-full bg-white border ${hasError ? 'border-red-500 ring-2 ring-red-500/10' : 'border-[#d0d5dd]'} rounded-lg px-3.5 py-2.5 text-base text-[#101828] placeholder-[#687b96] focus:outline-none focus:ring-4 focus:ring-[#0e1680]/5 focus:border-[#0e1680] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] transition-all`;
const labelClass = "block text-[14px] font-semibold text-[#344054] mb-1.5";

const MailIcon = () => (
    <svg fill="none" viewBox="0 0 20 20" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
    </svg>
);

const PhoneIcon = () => (
    <svg fill="none" viewBox="0 0 20 20" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
    </svg>
);

const IconInput = ({
    icon,
    placeholder,
    type = 'text',
    registerProps,
    hasError,
}: {
    icon: React.ReactNode;
    placeholder: string;
    type?: string;
    registerProps: any;
    hasError?: boolean;
}) => (
    <div className={`flex items-center w-full bg-white border ${hasError ? 'border-red-500 ring-2 ring-red-500/10' : 'border-[#d0d5dd]'} rounded-lg focus-within:ring-4 focus-within:ring-[#0e1680]/5 focus-within:border-[#0e1680] overflow-hidden shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] transition-all`}>
        <div className="pl-3.5 pr-2 py-2.5 text-[#687b96] flex items-center justify-center">
            {icon}
        </div>
        <input
            type={type}
            placeholder={placeholder}
            className="flex-1 bg-transparent pl-2 pr-3.5 py-2.5 text-base text-[#101828] placeholder-[#687b96] focus:outline-none"
            {...registerProps}
            {...(placeholder.toLowerCase().includes('number') || placeholder.toLowerCase().includes('id') ? { inputMode: 'numeric' } : {})}
        />
    </div>
);

import { AlertCircle } from 'lucide-react';

export const COEDetailsFields = () => {
    const { register, formState: { errors } } = useFormContext();

    return (
        <div className="flex flex-col gap-4">
            {/* COE Name */}
            <div>
                <label className={labelClass}>COE Name <span className="text-red-500">*</span></label>
                <input
                    {...register('coeName')}
                    className={getInputClass(!!errors.coeName)}
                    placeholder="ABC"
                />
                {errors.coeName && (
                    <span className="text-xs text-red-500 mt-1 flex items-center gap-1">
                        <AlertCircle size={14} /> {(errors.coeName as any).message as string}
                    </span>
                )}
            </div>

            {/* COE Employee ID & Contact Number */}
            <div className="grid grid-cols-2 gap-5">
                <div>
                    <label className={labelClass}>COE Employee ID <span className="text-red-500">*</span></label>
                    <input
                        {...register('coeEmployeeId')}
                        className={getInputClass(!!errors.coeEmployeeId)}
                        placeholder="12345"
                        inputMode="numeric"
                    />
                    {errors.coeEmployeeId && (
                    <span className="text-xs text-red-500 mt-1 flex items-center gap-1">
                        <AlertCircle size={14} /> {(errors.coeEmployeeId as any).message as string}
                    </span>
                )}
                </div>
                <div>
                    <label className={labelClass}>Contact Number <span className="text-red-500">*</span></label>
                    <IconInput
                        icon={<PhoneIcon />}
                        placeholder="9090909090"
                        registerProps={register('coeContactNumber')}
                        hasError={!!errors.coeContactNumber}
                    />
                    {errors.coeContactNumber && (
                    <span className="text-xs text-red-500 mt-1 flex items-center gap-1">
                        <AlertCircle size={14} /> {(errors.coeContactNumber as any).message as string}
                    </span>
                )}
                </div>
            </div>

            {/* COE Email ID */}
            <div>
                <label className={labelClass}>COE Email ID <span className="text-red-500">*</span></label>
                <IconInput
                    icon={<MailIcon />}
                    placeholder="abc@gmail.com"
                    type="email"
                    registerProps={register('coeEmail')}
                    hasError={!!errors.coeEmail}
                />
                {errors.coeEmail && (
                    <span className="text-xs text-red-500 mt-1 flex items-center gap-1">
                        <AlertCircle size={14} /> {(errors.coeEmail as any).message as string}
                    </span>
                )}
            </div>

            {/* Qualification */}
            <div>
                <label className={labelClass}>Qualification <span className="text-red-500">*</span></label>
                <input
                    {...register('coeQualification')}
                    className={getInputClass(!!errors.coeQualification)}
                    placeholder="Graduation"
                />
                {errors.coeQualification && (
                    <span className="text-xs text-red-500 mt-1 flex items-center gap-1">
                        <AlertCircle size={14} /> {(errors.coeQualification as any).message as string}
                    </span>
                )}
            </div>
        </div>
    );
};