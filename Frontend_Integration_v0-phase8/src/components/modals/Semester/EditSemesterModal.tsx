import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { semesterSchema, type SemesterFormData } from '../../../schemas/COE/semesterSchema';
import { programmeAPI, branchAPI, academicYearAPI, schemeAPI } from '../../../services/api';

interface EditSemesterModalProps {
    isOpen: boolean;
    onClose: () => void;
    semester: any;
    onUpdate: (data: any) => void;
}

export const EditSemesterModal = ({ isOpen, onClose, semester, onUpdate }: EditSemesterModalProps) => {
    const [programmes, setProgrammes] = useState<any[]>([]);
    const [branches, setBranches] = useState<any[]>([]);
    const [academicYears, setAcademicYears] = useState<any[]>([]);
    const [schemes, setSchemes] = useState<any[]>([]);

    const {
        register,
        handleSubmit,
        reset,
        watch,
        setValue,
        formState: { errors },
    } = useForm<SemesterFormData>({
        resolver: zodResolver(semesterSchema),
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
        } else {
            setValue('semesterName', '');
        }
    }, [semesterNumber, setValue]);

    useEffect(() => {
        if (semester) {
            reset(semester);
        }
    }, [semester, reset]);

    if (!isOpen || !semester) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-[24px] w-full max-w-[800px] shadow-2xl animate-in fade-in zoom-in duration-300 overflow-hidden">
                {/* Header */}
                <div className="px-8 py-6 border-b border-[#eaecf0] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <h3 className="text-xl font-bold text-[#101828]">Semester under Scheme Details</h3>
                        <svg className="w-5 h-5 text-[#667085]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-[#667085]"
                    >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit(onUpdate)} className="p-8 space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-[#344054]">Scheme Name</label>
                            <select
                                {...register('schemeId')}
                                className="w-full bg-white border border-[#d0d5dd] rounded-lg px-3.5 py-2.5 text-[#101828] text-sm focus:outline-none focus:ring-2 focus:ring-[#0e1680]/20"
                            >
                                <option value="">Select Scheme</option>
                                {schemes.map(s => <option key={s.scheme_id} value={s.scheme_id}>{s.scheme_name}</option>)}
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-[#344054]">Programme Name</label>
                            <select
                                {...register('programmeId')}
                                className="w-full bg-white border border-[#d0d5dd] rounded-lg px-3.5 py-2.5 text-[#101828] text-sm focus:outline-none focus:ring-2 focus:ring-[#0e1680]/20"
                            >
                                <option value="">Select Programme</option>
                                {programmes.map(p => <option key={p.programm_id} value={p.programm_id}>{p.programme_name}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-[#344054]">Branch Name</label>
                            <select
                                {...register('branchId')}
                                className="w-full bg-white border border-[#d0d5dd] rounded-lg px-3.5 py-2.5 text-[#101828] text-sm focus:outline-none focus:ring-2 focus:ring-[#0e1680]/20"
                            >
                                <option value="">Select Branch</option>
                                {branches.map(b => <option key={b.branch_id} value={b.branch_id}>{b.branch_name}</option>)}
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-[#344054]">Academic Year</label>
                            <select
                                {...register('academicId')}
                                className="w-full bg-white border border-[#d0d5dd] rounded-lg px-3.5 py-2.5 text-[#101828] text-sm focus:outline-none focus:ring-2 focus:ring-[#0e1680]/20"
                            >
                                <option value="">Select Academic Year</option>
                                {academicYears.map(ay => <option key={ay.academic_id} value={ay.academic_id}>{ay.academic_name}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-[#344054]">Semester Number</label>
                            <select
                                {...register('semesterNumber')}
                                className="w-full bg-white border border-[#d0d5dd] rounded-lg px-3.5 py-2.5 text-[#101828] text-sm focus:outline-none focus:ring-2 focus:ring-[#0e1680]/20"
                            >
                                <option value="">Select Semester</option>
                                {[1, 2, 3, 4, 5, 6, 7, 8].map(num => <option key={num} value={num}>{num}</option>)}
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-[#344054]">Semester Name(Ordinal)</label>
                            <input
                                {...register('semesterName')}
                                readOnly
                                className="w-full bg-gray-50 border border-[#d0d5dd] rounded-lg px-3.5 py-2.5 text-[#667085] text-sm focus:outline-none focus:ring-2 focus:ring-[#0e1680]/20 cursor-not-allowed"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-[#344054]">Total Subjects</label>
                            <input
                                type="number"
                                {...register('totalSubjects')}
                                className="w-full bg-white border border-[#d0d5dd] rounded-lg px-3.5 py-2.5 text-[#101828] text-sm focus:outline-none focus:ring-2 focus:ring-[#0e1680]/20"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-[#344054]">Total Credits</label>
                            <input
                                type="number"
                                {...register('totalCredits')}
                                className="w-full bg-white border border-[#d0d5dd] rounded-lg px-3.5 py-2.5 text-[#101828] text-sm focus:outline-none focus:ring-2 focus:ring-[#0e1680]/20"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-[#344054]">Academic Months (start - end)</label>
                            <div className="grid grid-cols-2 gap-2">
                                <input
                                    type="date"
                                    {...register('startDate')}
                                    className="w-full bg-white border border-[#d0d5dd] rounded-lg px-3.5 py-2.5 text-[#101828] text-sm focus:outline-none focus:ring-2 focus:ring-[#0e1680]/20"
                                />
                                <input
                                    type="date"
                                    {...register('endDate')}
                                    className="w-full bg-white border border-[#d0d5dd] rounded-lg px-3.5 py-2.5 text-[#101828] text-sm focus:outline-none focus:ring-2 focus:ring-[#0e1680]/20"
                                />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-[#344054]">Term Type</label>
                            <select
                                {...register('term_type')}
                                className="w-full bg-white border border-[#d0d5dd] rounded-lg px-3.5 py-2.5 text-[#101828] text-sm focus:outline-none focus:ring-2 focus:ring-[#0e1680]/20 appearance-none"
                            >
                                <option value="">Select Term</option>
                                <option value="odd">Odd Term</option>
                                <option value="even">Even Term</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-sm font-medium text-[#344054]">Status</label>
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    {...register('isActive')}
                                    value="active"
                                    id="editStatusActive"
                                    className="w-4 h-4 text-[#0e1680] border-[#d0d5dd] focus:ring-[#0e1680]"
                                />
                                <label htmlFor="editStatusActive" className="text-sm text-[#344054]">Active</label>
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    {...register('isActive')}
                                    value="inactive"
                                    id="editStatusInactive"
                                    className="w-4 h-4 text-[#0e1680] border-[#d0d5dd] focus:ring-[#0e1680]"
                                />
                                <label htmlFor="editStatusInactive" className="text-sm text-[#344054]">Not Active</label>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            className="bg-[#0e1680] text-white px-10 py-3 rounded-xl font-semibold hover:bg-[#0a1060] transition-colors shadow-lg"
                        >
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
