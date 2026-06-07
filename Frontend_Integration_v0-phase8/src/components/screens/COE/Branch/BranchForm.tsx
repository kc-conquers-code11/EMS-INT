import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { getProgrammeDropdown } from '../../../../services/programme/programmeApiService';
import { getDepartmentDropdown } from '../../../../services/department/departmentApiService';

const inputClass = "w-full bg-white border border-[#d0d5dd] rounded-lg px-3.5 py-2.5 text-base text-[#687b96] placeholder-[#687b96] focus:outline-none focus:ring-1 focus:ring-[#0e1680] focus:border-[#0e1680] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]";
const labelClass = "block text-sm font-medium text-[#344054] mb-1.5";

export const BranchForm = () => {
    const { register, formState: { errors }, watch, setValue } = useFormContext();
    const [programmes, setProgrammes] = useState<any[] | null>([]);
    const [departments, setDepartments] = useState<any[] | null>([]);
    
    const [isDeptOpen, setIsDeptOpen] = useState(false);
    const [isProgOpen, setIsProgOpen] = useState(false);

    useEffect(() => {
        getProgrammeDropdown()
            .then(r => {
                const list = Array.isArray(r) ? r : (r?.data ?? []);
                setProgrammes(list);
            })
            .catch(err => {
                console.error('Failed to load programmes', err);
                setProgrammes([]); // fallback to empty array, never undefined
            });

        getDepartmentDropdown()
            .then(r => {
                const list = Array.isArray(r) ? r : (r?.data ?? []);
                setDepartments(list);
            })
            .catch(err => {
                console.error('Failed to load departments', err);
                setDepartments([]);
            });
    }, []);

    return (
        <div className="space-y-6 max-w-4xl">
            {/* Branch Name */}
            <div>
                <label className={labelClass}>Enter Branch name</label>
                <input
                    type="text"
                    {...register('branch_name')}
                    placeholder="Information Technology"
                    className={inputClass}
                />
                {errors.branch_name && <p className="text-red-500 text-xs mt-1">{(errors.branch_name as any).message}</p>}
            </div>

            {/* Department Name */}
            <div className="relative">
                <label className={labelClass}>Enter Department Name</label>
                <div 
                    className="relative outline-none"
                    tabIndex={0}
                    onBlur={(e) => {
                        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                            setIsDeptOpen(false);
                        }
                    }}
                >
                    <div 
                        className={`${inputClass} cursor-pointer flex justify-between items-center`}
                        onClick={() => setIsDeptOpen(!isDeptOpen)}
                    >
                        <span className={watch('depart_id') ? 'text-[#344054]' : 'text-[#687b96]'}>
                            {departments?.find(d => d.depart_id === watch('depart_id'))?.depart_name || 'Select Department'}
                        </span>
                        <svg className={`w-5 h-5 text-[#667085] transition-transform ${isDeptOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                    {isDeptOpen && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-[#d0d5dd] rounded-lg shadow-lg max-h-72 overflow-y-auto">
                            <ul className="py-1">
                                <li 
                                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm text-[#475467]"
                                    onClick={() => {
                                        setValue('depart_id', '', { shouldValidate: true });
                                        setIsDeptOpen(false);
                                    }}
                                >
                                    Select Department
                                </li>
                                {departments?.map(d => (
                                    <li 
                                        key={d.depart_id}
                                        className={`px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm ${watch('depart_id') === d.depart_id ? 'bg-blue-50 text-blue-700 font-medium' : 'text-[#475467]'}`}
                                        onClick={() => {
                                            setValue('depart_id', d.depart_id, { shouldValidate: true });
                                            setIsDeptOpen(false);
                                        }}
                                    >
                                        {d.depart_name}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
                <input type="hidden" {...register('depart_id')} />
                {errors.depart_id && <p className="text-red-500 text-xs mt-1">{(errors.depart_id as any).message}</p>}
            </div>

            {/* Branch/Department Code/ID and Established Year */}
            <div className="grid grid-cols-2 gap-5">
                <div>
                    <label className={labelClass}>Branch/Department Code/ID</label>
                    <input
                        type="text"
                        {...register('branch_code')}
                        placeholder="123"
                        className={inputClass}
                    />
                    {errors.branch_code && <p className="text-red-500 text-xs mt-1">{(errors.branch_code as any).message}</p>}
                </div>
                <div>
                    <label className={labelClass}>Established Year</label>
                    <input
                        type="text"
                        {...register('established_year')}
                        placeholder="2004"
                        maxLength={4}
                        onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                            e.target.value = e.target.value.replace(/[^0-9]/g, '');
                        }}
                        className={inputClass}
                    />
                    {errors.established_year && <p className="text-red-500 text-xs mt-1">{(errors.established_year as any).message}</p>}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-5">
                {/* Programme */}
                <div className="relative">
                    <label className={labelClass}>Enter Programme</label>
                    <div 
                        className="relative outline-none"
                        tabIndex={0}
                        onBlur={(e) => {
                            if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                                setIsProgOpen(false);
                            }
                        }}
                    >
                        <div 
                            className={`${inputClass} cursor-pointer flex justify-between items-center`}
                            onClick={() => setIsProgOpen(!isProgOpen)}
                        >
                            <span className={watch('programm_id') ? 'text-[#344054]' : 'text-[#687b96]'}>
                                {programmes?.find(p => p.programm_id === watch('programm_id'))?.programme_name || 'Select Programme'}
                            </span>
                            <svg className={`w-5 h-5 text-[#667085] transition-transform ${isProgOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                        {isProgOpen && (
                            <div className="absolute z-10 w-full mt-1 bg-white border border-[#d0d5dd] rounded-lg shadow-lg max-h-72 overflow-y-auto">
                                <ul className="py-1">
                                    <li 
                                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm text-[#475467]"
                                        onClick={() => {
                                            setValue('programm_id', '', { shouldValidate: true });
                                            setIsProgOpen(false);
                                        }}
                                    >
                                        Select Programme
                                    </li>
                                    {programmes?.map(p => (
                                        <li 
                                            key={p.programm_id}
                                            className={`px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm ${watch('programm_id') === p.programm_id ? 'bg-blue-50 text-blue-700 font-medium' : 'text-[#475467]'}`}
                                            onClick={() => {
                                                setValue('programm_id', p.programm_id, { shouldValidate: true });
                                                setIsProgOpen(false);
                                            }}
                                        >
                                            {p.programme_name}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                    <input type="hidden" {...register('programm_id')} />
                    {errors.programm_id && <p className="text-red-500 text-xs mt-1">{(errors.programm_id as any).message}</p>}
                </div>

                {/* Intake Capacity */}
                <div>
                    <label className={labelClass}>Intake capacity</label>
                    <input
                        type="text"
                        {...register('total_intake')}
                        placeholder="180"
                        onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                            e.target.value = e.target.value.replace(/[^0-9]/g, '');
                        }}
                        className={inputClass}
                    />
                    {errors.total_intake && <p className="text-red-500 text-xs mt-1">{(errors.total_intake as any).message}</p>}
                </div>
            </div>

            {/* Status */}
            <div>
                <label className={labelClass}>Status</label>
                <div className="relative">
                    <select
                        {...register('status', { setValueAs: v => v === 'true' })}
                        className={`${inputClass} appearance-none cursor-pointer`}
                    >
                        <option value="true">Active</option>
                        <option value="false">Inactive</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none">
                        <svg className="w-5 h-5 text-[#667085]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>
            </div>

            <div className="pt-6 flex justify-end">
                <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#0e1680] hover:bg-[#0a106e] text-white rounded-lg font-semibold text-base transition-colors shadow-sm"
                >
                    Add Branch
                </button>
            </div>
        </div>
    );
};
