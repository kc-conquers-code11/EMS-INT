import React, { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { semesterSchema, type SemesterFormData } from '../../../../schemas/COE/semesterSchema';
import { programmeAPI, branchAPI, academicYearAPI, schemeAPI } from '../../../../services/api';

interface SemesterFormProps {
    onSubmit: (data: SemesterFormData) => void;
    initialData?: Partial<SemesterFormData>;
}

export const SemesterForm = ({ onSubmit, initialData }: SemesterFormProps) => {
    const [programmes, setProgrammes] = useState<any[]>([]);
    const [branches, setBranches] = useState<any[]>([]);
    const [academicYears, setAcademicYears] = useState<any[]>([]);
    const [schemes, setSchemes] = useState<any[]>([]);

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm<SemesterFormData>({
        resolver: zodResolver(semesterSchema),
        defaultValues: initialData || {
            programmeId: '',
            academicId: '',
            branchId: '',
            schemeId: '',
            semesterNumber: '',
            term_type: '',
            totalSubjects: '',
            totalCredits: '',
            isActive: 'active',
        }
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [progRes, branchRes, acaRes, schemeRes] = await Promise.all([
                    programmeAPI.getDropdown(),
                    branchAPI.getDropdown(),
                    academicYearAPI.getDropdown(),
                    schemeAPI.getDropdown()
                ]);
                setProgrammes(progRes.data.data || []);
                setBranches(branchRes.data.data || []);
                setAcademicYears(acaRes.data.data || []);
                setSchemes(schemeRes.data.data || []);
            } catch (error) {
                console.error("Failed to fetch dropdown data", error);
            }
        };
        fetchData();
    }, []);

    const semesterNumber = watch('semesterNumber');

    useEffect(() => {
        if (semesterNumber) {
            const num = parseInt(semesterNumber, 10);
            let suffix = 'th';
            if (num === 1) suffix = 'st';
            else if (num === 2) suffix = 'nd';
            else if (num === 3) suffix = 'rd';
            setValue('semesterName', `${num}${suffix} Semester`, { shouldValidate: true });

            const termType = num % 2 === 0 ? 'even' : 'odd';
            setValue('term_type', termType);
        } else {
            setValue('semesterName', '');
            setValue('term_type', '');
        }
    }, [semesterNumber, setValue]);

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-[1053px]">
            {/* Scheme Name & Academic Year */}
            <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-[#344054]">Scheme Name</label>
                    <div className="relative">
                        <select
                            {...register('schemeId')}
                            className={`w-full bg-white border ${errors.schemeId ? 'border-red-500 ring-2 ring-red-500/10' : 'border-[#d0d5dd]'} rounded-lg px-3.5 py-2.5 text-[#101828] focus:outline-none focus:ring-2 focus:ring-[#0e1680]/20 appearance-none`}
                        >
                            <option value="">Select Scheme</option>
                            {schemes.map(s => (
                                <option key={s.scheme_id} value={s.scheme_id}>{s.scheme_name}</option>
                            ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none">
                            <svg className="w-5 h-5 text-[#667085]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>
                </div>
                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-[#344054]">Academic Year</label>
                    <div className="relative">
                        <select
                            {...register('academicId')}
                            className={`w-full bg-white border ${errors.academicId ? 'border-red-500 ring-2 ring-red-500/10' : 'border-[#d0d5dd]'} rounded-lg px-3.5 py-2.5 text-[#101828] focus:outline-none focus:ring-2 focus:ring-[#0e1680]/20 appearance-none`}
                        >
                            <option value="">Select Academic Year</option>
                            {academicYears.map(ay => (
                                <option key={ay.academic_id} value={ay.academic_id}>{ay.academic_name}</option>
                            ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none">
                            <svg className="w-5 h-5 text-[#667085]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>
                    {errors.academicId && (
                        <span className="text-xs text-red-500 mt-1 flex items-center gap-1">
                            <AlertCircle size={12} />
                            {errors.academicId.message}
                        </span>
                    )}
                </div>
            </div>

            {/* Programme & Branch */}
            <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-[#344054]">Programme Name</label>
                    <div className="relative">
                        <select
                            {...register('programmeId')}
                            className={`w-full bg-white border ${errors.programmeId ? 'border-red-500 ring-2 ring-red-500/10' : 'border-[#d0d5dd]'} rounded-lg px-3.5 py-2.5 text-[#101828] focus:outline-none focus:ring-2 focus:ring-[#0e1680]/20 appearance-none`}
                        >
                            <option value="">Select Programme</option>
                            {programmes.map(p => (
                                <option key={p.programm_id} value={p.programm_id}>{p.programme_name}</option>
                            ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none">
                            <svg className="w-5 h-5 text-[#667085]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>
                    {errors.programmeId && (
                        <span className="text-xs text-red-500 mt-1 flex items-center gap-1">
                            <AlertCircle size={12} />
                            {errors.programmeId.message}
                        </span>
                    )}
                </div>
                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-[#344054]">Branch Name</label>
                    <div className="relative">
                        <select
                            {...register('branchId')}
                            className={`w-full bg-white border ${errors.branchId ? 'border-red-500 ring-2 ring-red-500/10' : 'border-[#d0d5dd]'} rounded-lg px-3.5 py-2.5 text-[#101828] focus:outline-none focus:ring-2 focus:ring-[#0e1680]/20 appearance-none`}
                        >
                            <option value="">Select Branch</option>
                            {branches.map(b => (
                                <option key={b.branch_id} value={b.branch_id}>{b.branch_name}</option>
                            ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none">
                            <svg className="w-5 h-5 text-[#667085]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Semester Number & Name */}
            <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-[#344054]">Semester Number</label>
                    <div className="relative">
                        <select
                            {...register('semesterNumber')}
                            className={`w-full bg-white border ${errors.semesterNumber ? 'border-red-500 ring-2 ring-red-500/10' : 'border-[#d0d5dd]'} rounded-lg px-3.5 py-2.5 text-[#101828] focus:outline-none focus:ring-2 focus:ring-[#0e1680]/20 appearance-none`}
                        >
                            <option value="">Select Semester</option>
                            {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                                <option key={num} value={num}>{num}</option>
                            ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none">
                            <svg className="w-5 h-5 text-[#667085]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>
                    {errors.semesterNumber && (
                        <span className="text-xs text-red-500 mt-1 flex items-center gap-1">
                            <AlertCircle size={12} />
                            {errors.semesterNumber.message}
                        </span>
                    )}
                </div>
                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-[#344054]">Semester Name ( Ordinal )</label>
                    <input
                        {...register('semesterName')}
                        readOnly
                        placeholder="1st Semester"
                        className={`w-full bg-gray-50 border ${errors.semesterName ? 'border-red-500 ring-2 ring-red-500/10' : 'border-[#d0d5dd]'} rounded-lg px-3.5 py-2.5 text-[#667085] focus:outline-none focus:ring-2 focus:ring-[#0e1680]/20 cursor-not-allowed`}
                    />
                    {errors.semesterName && (
                        <span className="text-xs text-red-500 mt-1 flex items-center gap-1">
                            <AlertCircle size={12} />
                            {errors.semesterName.message}
                        </span>
                    )}
                </div>
            </div>

            {/* Start & End Date */}
            <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-[#344054]">Start Date</label>
                    <div className="relative">
                        <input
                            type="date"
                            {...register('startDate')}
                            className={`w-full bg-white border ${errors.startDate ? 'border-red-500 ring-2 ring-red-500/10' : 'border-[#d0d5dd]'} rounded-lg px-3.5 py-2.5 text-[#101828] focus:outline-none focus:ring-2 focus:ring-[#0e1680]/20`}
                        />
                    </div>
                    {errors.startDate && (
                        <span className="text-xs text-red-500 mt-1 flex items-center gap-1">
                            <AlertCircle size={12} />
                            {errors.startDate.message}
                        </span>
                    )}
                </div>
                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-[#344054]">End Date</label>
                    <div className="relative">
                        <input
                            type="date"
                            {...register('endDate')}
                            className={`w-full bg-white border ${errors.endDate ? 'border-red-500 ring-2 ring-red-500/10' : 'border-[#d0d5dd]'} rounded-lg px-3.5 py-2.5 text-[#101828] focus:outline-none focus:ring-2 focus:ring-[#0e1680]/20`}
                        />
                    </div>
                    {errors.endDate && (
                        <span className="text-xs text-red-500 mt-1 flex items-center gap-1">
                            <AlertCircle size={12} />
                            {errors.endDate.message}
                        </span>
                    )}
                </div>
            </div>

            {/* Term Type */}
            <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#344054]">Term Type</label>
                <div className="relative">
                    <select
                        {...register('term_type')}
                        className={`w-full bg-white border ${errors.term_type ? 'border-red-500 ring-2 ring-red-500/10' : 'border-[#d0d5dd]'} rounded-lg px-3.5 py-2.5 text-[#101828] focus:outline-none focus:ring-2 focus:ring-[#0e1680]/20 appearance-none`}
                    >
                        <option value="">Select Term Type</option>
                        <option value="odd">Odd Term</option>
                        <option value="even">Even Term</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none">
                        <svg className="w-5 h-5 text-[#667085]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>
                {errors.term_type && (
                    <span className="text-xs text-red-500 mt-1 flex items-center gap-1">
                        <AlertCircle size={12} />
                        {errors.term_type.message}
                    </span>
                )}
            </div>

            {/* Total Subjects & Credits */}
            <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-[#344054]">Total Subjects</label>
                    <input
                        type="number"
                        {...register('totalSubjects')}
                        placeholder="5"
                        className={`w-full bg-white border ${errors.totalSubjects ? 'border-red-500 ring-2 ring-red-500/10' : 'border-[#d0d5dd]'} rounded-lg px-3.5 py-2.5 text-[#101828] focus:outline-none focus:ring-2 focus:ring-[#0e1680]/20`}
                    />
                    {errors.totalSubjects && (
                        <span className="text-xs text-red-500 mt-1 flex items-center gap-1">
                            <AlertCircle size={12} />
                            {errors.totalSubjects.message}
                        </span>
                    )}
                </div>
                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-[#344054]">Total Credits</label>
                    <input
                        type="number"
                        {...register('totalCredits')}
                        placeholder="134"
                        className={`w-full bg-white border ${errors.totalCredits ? 'border-red-500 ring-2 ring-red-500/10' : 'border-[#d0d5dd]'} rounded-lg px-3.5 py-2.5 text-[#101828] focus:outline-none focus:ring-2 focus:ring-[#0e1680]/20`}
                    />
                    {errors.totalCredits && (
                        <span className="text-xs text-red-500 mt-1 flex items-center gap-1">
                            <AlertCircle size={12} />
                            {errors.totalCredits.message}
                        </span>
                    )}
                </div>
            </div>

            {/* Status (isActive) */}
            <div className="space-y-3">
                <label className="text-sm font-medium text-[#344054]">Status</label>
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <input
                            type="radio"
                            {...register('isActive')}
                            value="active"
                            id="statusActive"
                            className="w-4 h-4 text-[#0e1680] border-[#d0d5dd] focus:ring-[#0e1680]"
                        />
                        <label htmlFor="statusActive" className="text-sm text-[#344054]">Active</label>
                    </div>
                    <div className="flex items-center gap-2">
                        <input
                            type="radio"
                            {...register('isActive')}
                            value="inactive"
                            id="statusInactive"
                            className="w-4 h-4 text-[#0e1680] border-[#d0d5dd] focus:ring-[#0e1680]"
                        />
                        <label htmlFor="statusInactive" className="text-sm text-[#344054]">Not Active</label>
                    </div>
                </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-4">
                <button
                    type="submit"
                    className="bg-[#0e1680] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#0a1060] transition-colors shadow-sm"
                >
                    Add Semester
                </button>
            </div>
        </form>
    );
};
