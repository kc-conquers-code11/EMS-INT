import { useFormContext, useFieldArray } from 'react-hook-form';

const getInputClass = (hasError?: boolean) => `w-full bg-white border ${hasError ? 'border-red-500 ring-1 ring-red-500' : 'border-[#d0d5dd]'} rounded-lg px-3.5 py-2.5 text-base text-[#687b96] placeholder-[#687b96] focus:outline-none focus:ring-1 focus:ring-[#0e1680] focus:border-[#0e1680] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]`;
const labelClass = "block text-sm font-medium text-[#344054] mb-1.5";

const CheckboxItem = ({ label, name }: { label: string; name: string }) => {
    const { register, watch } = useFormContext();
    const isChecked = watch(name);

    return (
        <label className="flex items-center gap-2.5 cursor-pointer group">
            <div className="relative w-5 h-5">
                <input
                    type="checkbox"
                    {...register(name)}
                    className="peer absolute inset-0 opacity-0 cursor-pointer z-10"
                />
                {/* Custom box */}
                <div className="absolute inset-0 rounded-[4px] border border-[#0a106e] bg-[#e5e7fb] flex items-center justify-center transition-all peer-focus-visible:ring-2 peer-focus-visible:ring-[#0e1680] peer-focus-visible:ring-offset-1">
                    {/* checkmark SVG */}
                    <svg
                        className={`w-3 h-3 text-[#0a106e] transition-opacity ${isChecked ? 'opacity-100' : 'opacity-0'}`}
                        viewBox="0 0 12 12"
                        fill="none"
                    >
                        <path d="M2 6.5L4.5 9L10 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
            </div>
            <span className="text-sm font-semibold text-[#344054]">{label}</span>
        </label>
    );
};

export const BasicDetailsFields = () => {
    const { register, control, formState: { errors } } = useFormContext();

    const { fields: courseFields, append: appendCourse, remove: removeCourse } = useFieldArray({
        control,
        name: "courses.other"
    });

    const { fields: accreditationFields, append: appendAccreditation, remove: removeAccreditation } = useFieldArray({
        control,
        name: "accreditation.other"
    });

    return (
        <div className="space-y-6">
            {/* Institution Name */}
            <div>
                <label className={labelClass}>Institution Name</label>
                <input
                    type="text"
                    {...register('institutionName')}
                    placeholder="ABC Institution Of Technology"
                    className={getInputClass(!!errors.institutionName)}
                />
                {errors.institutionName && (
                    <span className="text-xs text-red-500 mt-1 flex items-center gap-1">
                        <svg className="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        {(errors.institutionName as any).message as string}
                    </span>
                )}
            </div>

            <div className="grid grid-cols-2 gap-5">
                {/* Institution Code/ID */}
                <div>
                    <label className={labelClass}>Institution Code/ID</label>
                    <input
                        type="text"
                        inputMode="numeric"
                        {...register('institutionCode')}
                        placeholder="356"
                        className={getInputClass(!!errors.institutionCode)}
                    />
                    {errors.institutionCode && (
                    <span className="text-xs text-red-500 mt-1 flex items-center gap-1">
                        <svg className="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        {(errors.institutionCode as any).message as string}
                    </span>
                )}
                </div>

                {/* Institution Type */}
                <div>
                    <label className={labelClass}>Institution Type</label>
                    <select
                        {...register('institutionType')}
                        className={getInputClass(!!errors.institutionType)}
                    >
                        <option value="Autonomous">Autonomous</option>
                        <option value="Private">Private</option>
                        <option value="Government">Government</option>
                    </select>
                </div>
            </div>

            {/* Affiliated University */}
            <div>
                <label className={labelClass}>Affiliated University</label>
                <input
                    type="text"
                    {...register('affiliatedUniversity')}
                    placeholder="University of Mumbai"
                    className={getInputClass(!!errors.affiliatedUniversity)}
                />
                {errors.affiliatedUniversity && (
                    <span className="text-xs text-red-500 mt-1 flex items-center gap-1">
                        <svg className="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        {(errors.affiliatedUniversity as any).message as string}
                    </span>
                )}
            </div>

            {/* Courses Offered */}
            <div>
                <label className={labelClass}>Courses Offered</label>
                <div className="flex flex-wrap items-center gap-[30px] mt-1">
                    <CheckboxItem label="Postgraduate" name="courses.postgraduate" />
                    <CheckboxItem label="Undergraduate" name="courses.undergraduate" />
                    <CheckboxItem label="PHD" name="courses.phd" />
                    
                    {courseFields.map((field, index) => (
                        <div key={field.id} className="relative group">
                            <input
                                type="text"
                                {...register(`courses.other.${index}.value`)}
                                placeholder="Other course"
                                className="pl-2 pr-8 py-1 text-sm border border-[#d0d5dd] rounded-md focus:ring-1 focus:ring-[#0e1680] outline-none"
                                autoFocus
                            />
                            <button
                                type="button"
                                onClick={() => removeCourse(index)}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-[#98a2b3] hover:text-red-500 transition-colors"
                            >
                                <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5">
                                    <path d="M4.646 4.646a.5.5 0 01.708 0L8 7.293l2.646-2.647a.5.5 0 01.708.708L8.707 8l2.647 2.646a.5.5 0 01-.708.708L8 8.707l-2.646 2.647a.5.5 0 01-.708-.708L7.293 8 4.646 5.354a.5.5 0 010-.708z" />
                                </svg>
                            </button>
                        </div>
                    ))}

                    <button 
                        type="button" 
                        onClick={() => appendCourse({ value: "" })}
                        className="w-4 h-4 text-[#98a2b3] hover:text-[#0e1680] transition-colors"
                    >
                        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="8" cy="8" r="7" />
                            <line x1="8" y1="5" x2="8" y2="11" />
                            <line x1="5" y1="8" x2="11" y2="8" />
                        </svg>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-5">
                {/* Establishment Year */}
                <div>
                    <label className={labelClass}>Establishment Year</label>
                    <input
                        type="text"
                        inputMode="numeric"
                        {...register('establishmentYear')}
                        placeholder="2002"
                        className={getInputClass(!!errors.establishmentYear)}
                    />
                    {errors.establishmentYear && (
                    <span className="text-xs text-red-500 mt-1 flex items-center gap-1">
                        <svg className="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        {(errors.establishmentYear as any).message as string}
                    </span>
                )}
                </div>

                {/* Logo URL */}
                <div>
                    <label className={labelClass}>Logo URL</label>
                    <input
                        type="text"
                        {...register('logoUrl')}
                        placeholder="https://example.com/logo.png"
                        className={getInputClass(!!errors.logoUrl)}
                    />
                    {errors.logoUrl && (
                    <span className="text-xs text-red-500 mt-1 flex items-center gap-1">
                        <svg className="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        {(errors.logoUrl as any).message as string}
                    </span>
                )}
                </div>
            </div>

            {/* Accreditation */}
            <div>
                <label className={labelClass}>Accrediation</label>
                <div className="flex flex-wrap items-center gap-[30px] mt-1">
                    <CheckboxItem label="NBA" name="accreditation.nba" />
                    <CheckboxItem label="NAAC" name="accreditation.naac" />
                    <CheckboxItem label="AICTE" name="accreditation.aicte" />
                    
                    {accreditationFields.map((field, index) => (
                        <div key={field.id} className="relative group">
                            <input
                                type="text"
                                {...register(`accreditation.other.${index}.value`)}
                                placeholder="Other accreditation"
                                className="pl-2 pr-8 py-1 text-sm border border-[#d0d5dd] rounded-md focus:ring-1 focus:ring-[#0e1680] outline-none"
                                autoFocus
                            />
                            <button
                                type="button"
                                onClick={() => removeAccreditation(index)}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-[#98a2b3] hover:text-red-500 transition-colors"
                            >
                                <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5">
                                    <path d="M4.646 4.646a.5.5 0 01.708 0L8 7.293l2.646-2.647a.5.5 0 01.708.708L8.707 8l2.647 2.646a.5.5 0 01-.708.708L8 8.707l-2.646 2.647a.5.5 0 01-.708-.708L7.293 8 4.646 5.354a.5.5 0 010-.708z" />
                                </svg>
                            </button>
                        </div>
                    ))}

                    <button 
                        type="button" 
                        onClick={() => appendAccreditation({ value: "" })}
                        className="w-4 h-4 text-[#98a2b3] hover:text-[#0e1680] transition-colors"
                    >
                        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="8" cy="8" r="7" />
                            <line x1="8" y1="5" x2="8" y2="11" />
                            <line x1="5" y1="8" x2="11" y2="8" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};