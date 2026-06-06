import { useFormContext } from 'react-hook-form';
import { AlertCircle } from 'lucide-react';

const getInputClass = (hasError?: boolean) => `w-full bg-white border ${hasError ? 'border-red-500 ring-2 ring-red-500/10' : 'border-[#d0d5dd]'} rounded-lg px-3.5 py-2.5 text-base text-[#101828] placeholder-[#687b96] focus:outline-none focus:ring-4 focus:ring-[#0e1680]/5 focus:border-[#0e1680] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] transition-all`;
const labelClass = "block text-[14px] font-semibold text-[#344054] mb-1.5";

// Chevron icon for dropdowns
const ChevronDown = () => (
    <svg className="w-4 h-4 text-[#687b96] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
    </svg>
);

// Icon-prefixed input: icon shown in a left cell, then text input fills rest
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
            {...(placeholder.toLowerCase().includes('phone') || placeholder.toLowerCase().includes('pincode') ? { inputMode: 'numeric' } : {})}
        />
    </div>
);

// Dropdown field (select with custom chevron)
const SelectField = ({ registerProps, children, hasError }: { registerProps: any; children: React.ReactNode, hasError?: boolean }) => (
    <div className="relative">
        <select
            className={`${getInputClass(hasError)} appearance-none pr-9 cursor-pointer`}
            {...registerProps}
        >
            {children}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
            <ChevronDown />
        </div>
    </div>
);

// SVG icons
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

const LinkIcon = () => (
    <svg fill="none" viewBox="0 0 20 20" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" />
    </svg>
);

export const ContactDetailsFields = () => {
    const { register, formState: { errors } } = useFormContext();

    return (
        <div className="flex flex-col gap-4">
            {/* Road */}
            <div>
                <label className={labelClass}>Road <span className="text-red-500">*</span></label>
                <input
                    {...register('road')}
                    className={getInputClass(!!errors.road)}
                    placeholder="Enter road/street name"
                />
                {errors.road && (
                    <span className="text-xs text-red-500 mt-1 flex items-center gap-1">
                        <AlertCircle size={14} /> {(errors.road as any).message as string}
                    </span>
                )}
            </div>

            {/* City & State */}
            <div className="grid grid-cols-2 gap-5">
                <div>
                    <label className={labelClass}>State <span className="text-red-500">*</span></label>
                    <SelectField registerProps={register('state')} hasError={!!errors.state}>
                        <option value="" disabled>Select State</option>
                        <option value="Maharashtra">Maharashtra</option>
                        <option value="Karnataka">Karnataka</option>
                        <option value="Gujarat">Gujarat</option>
                    </SelectField>
                    {errors.state && (
                        <span className="text-xs text-red-500 mt-1 flex items-center gap-1">
                            <AlertCircle size={14} /> {(errors.state as any).message as string}
                        </span>
                    )}
                </div>
                 <div>
                    <label className={labelClass}>City <span className="text-red-500">*</span></label>
                    <SelectField registerProps={register('city')} hasError={!!errors.city}>
                        <option value="" disabled>Select City</option>
                        <option value="Mumbai Suburban">Mumbai Suburban</option>
                        <option value="Pune">Pune</option>
                        <option value="Nagpur">Nagpur</option>
                    </SelectField>
                    {errors.city && (
                        <span className="text-xs text-red-500 mt-1 flex items-center gap-1">
                            <AlertCircle size={14} /> {(errors.city as any).message as string}
                        </span>
                    )}
                </div>
            </div>

            {/* Pincode & Official Email ID */}
            <div className="grid grid-cols-2 gap-[30px]">
                <div>
                    <label className={labelClass}>Pincode <span className="text-red-500">*</span></label>
                    <input
                        {...register('pincode')}
                        className={getInputClass(!!errors.pincode)}
                        placeholder="400067"
                        inputMode="numeric"
                    />
                    {errors.pincode && (
                    <span className="text-xs text-red-500 mt-1 flex items-center gap-1">
                        <AlertCircle size={14} /> {(errors.pincode as any).message as string}
                    </span>
                )}
                </div>
                <div>
                    <label className={labelClass}>Official Email ID <span className="text-red-500">*</span></label>
                    <IconInput
                        icon={<MailIcon />}
                        placeholder="xyz@gmail.com"
                        type="email"
                        registerProps={register('officialEmail')}
                        hasError={!!errors.officialEmail}
                    />
                    {errors.officialEmail && (
                        <span className="text-xs text-red-500 mt-1 flex items-center gap-1">
                            <AlertCircle size={14} /> {(errors.officialEmail as any).message as string}
                        </span>
                    )}
                </div>
            </div>

            {/* Website URL & Phone Number */}
            <div className="grid grid-cols-2 gap-5">
                <div>
                    <label className={labelClass}>Website URL <span className="text-red-500">*</span></label>
                    <IconInput
                        icon={<LinkIcon />}
                        placeholder="https://example.com"
                        type="url"
                        registerProps={register('websiteUrl')}
                        hasError={!!errors.websiteUrl}
                    />
                    {errors.websiteUrl && (
                    <span className="text-xs text-red-500 mt-1 flex items-center gap-1">
                        <AlertCircle size={14} /> {(errors.websiteUrl as any).message as string}
                    </span>
                )}
                </div>
                <div>
                    <label className={labelClass}>Phone Number <span className="text-red-500">*</span></label>
                    <IconInput
                        icon={<PhoneIcon />}
                        placeholder="9090909090"
                        registerProps={register('phoneNumber')}
                        hasError={!!errors.phoneNumber}
                    />
                    {errors.phoneNumber && (
                    <span className="text-xs text-red-500 mt-1 flex items-center gap-1">
                        <AlertCircle size={14} /> {(errors.phoneNumber as any).message as string}
                    </span>
                )}
                </div>
            </div>

            {/* Alternate Phone Number */}
            <div>
                <label className={labelClass}>Alternate Phone Number</label>
                <IconInput
                    icon={<PhoneIcon />}
                    placeholder="9090909090"
                    registerProps={register('alternatePhoneNumber')}
                    hasError={!!errors.alternatePhoneNumber}
                />
                {errors.alternatePhoneNumber && (
                    <span className="text-xs text-red-500 mt-1 flex items-center gap-1">
                        <AlertCircle size={14} /> {(errors.alternatePhoneNumber as any).message as string}
                    </span>
                )}
            </div>
        </div>
    );
};