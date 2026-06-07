import { useEffect } from 'react';
import { SuccessIcon, DeleteSuccessIcon } from '../../shared/ModalIcons';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { semesterSchema, type SemesterFormData } from '../../../schemas/COE/semesterSchema';

/* --- DeleteSemesterModal --- */

interface DeleteSemesterModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export const DeleteSemesterModal = ({ isOpen, onClose, onConfirm }: DeleteSemesterModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-[24px] p-10 flex flex-col items-center max-w-[400px] w-full shadow-2xl animate-in fade-in zoom-in duration-300">
                {/* Warning Icon */}
                <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                        <svg className="w-10 h-10 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                </div>

                {/* Text Content */}
                <h3 className="text-[20px] font-bold text-[#101828] mb-8 text-center px-4 leading-relaxed">
                    Do you really want to delete this Semester?
                </h3>

                {/* Buttons */}
                <div className="flex gap-4 w-full justify-center">
                    <button
                        onClick={onConfirm}
                        className="flex-1 max-w-[120px] bg-[#0e1680] text-white py-3 rounded-xl font-semibold hover:bg-red-700 transition-colors shadow-lg"
                    >
                        Delete
                    </button>
                    <button
                        onClick={onClose}
                        className="flex-1 max-w-[120px] bg-[#0e1680] text-white py-3 rounded-xl font-semibold hover:bg-gray-700 transition-colors shadow-lg"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

/* --- EditSemesterModal --- */

interface EditSemesterModalProps {
    isOpen: boolean;
    onClose: () => void;
    semester: any;
    onUpdate: (data: any) => void;
}

export const EditSemesterModal = ({ isOpen, onClose, semester, onUpdate }: EditSemesterModalProps) => {
    const {
        register,
        handleSubmit,
        reset,
    } = useForm<SemesterFormData>({
        resolver: zodResolver(semesterSchema),
    });

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
                            <input
                                {...register('schemeId')}
                                className="w-full bg-white border border-[#d0d5dd] rounded-lg px-3.5 py-2.5 text-[#101828] text-sm focus:outline-none focus:ring-2 focus:ring-[#0e1680]/20"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-[#344054]">Programme Name</label>
                            <input
                                {...register('programmeId')}
                                className="w-full bg-white border border-[#d0d5dd] rounded-lg px-3.5 py-2.5 text-[#101828] text-sm focus:outline-none focus:ring-2 focus:ring-[#0e1680]/20"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-[#344054]">Branch Name</label>
                        <input
                            {...register('branchId')}
                            className="w-full bg-white border border-[#d0d5dd] rounded-lg px-3.5 py-2.5 text-[#101828] text-sm focus:outline-none focus:ring-2 focus:ring-[#0e1680]/20"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-[#344054]">Semester Number</label>
                            <input
                                {...register('semesterNumber')}
                                className="w-full bg-white border border-[#d0d5dd] rounded-lg px-3.5 py-2.5 text-[#101828] text-sm focus:outline-none focus:ring-2 focus:ring-[#0e1680]/20"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-[#344054]">Semester Name(Ordinal)</label>
                            <input
                                {...register('semesterName')}
                                className="w-full bg-white border border-[#d0d5dd] rounded-lg px-3.5 py-2.5 text-[#101828] text-sm focus:outline-none focus:ring-2 focus:ring-[#0e1680]/20"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-[#344054]">Total Subjects</label>
                            <input
                                {...register('totalSubjects')}
                                className="w-full bg-white border border-[#d0d5dd] rounded-lg px-3.5 py-2.5 text-[#101828] text-sm focus:outline-none focus:ring-2 focus:ring-[#0e1680]/20"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-[#344054]">Total Credits</label>
                            <input
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
                                <option value="odd">Odd Term</option>
                                <option value="even">Even Term</option>
                            </select>
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

/* --- SemesterDeleteSuccessModal --- */

interface SemesterDeleteSuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const SemesterDeleteSuccessModal = ({ isOpen, onClose }: SemesterDeleteSuccessModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-[24px] p-10 flex flex-col items-center max-w-[400px] w-full shadow-2xl animate-in fade-in zoom-in duration-300">
                {/* Trash Icon */}
                <div className="w-[120px] h-[120px] flex items-center justify-center mb-4">
                    <DeleteSuccessIcon size={120} />
                </div>

                {/* Text Content */}
                <h3 className="text-[20px] font-bold text-[#101828] mb-8 text-center px-4 leading-relaxed">
                    Semester deleted successfully !!
                </h3>

                {/* Back Button */}
                <button
                    onClick={onClose}
                    className="w-full max-w-[120px] bg-[#0e1680] text-white py-3 rounded-xl font-semibold hover:bg-[#0a1060] transition-colors shadow-lg"
                >
                    Back
                </button>
            </div>
        </div>
    );
};

/* --- SemesterEditSuccessModal --- */

interface SemesterEditSuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const SemesterEditSuccessModal = ({ isOpen, onClose }: SemesterEditSuccessModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-[24px] p-10 flex flex-col items-center max-w-[400px] w-full shadow-2xl animate-in fade-in zoom-in duration-300">
                {/* Success Icon */}
                <div className="w-[120px] h-[120px] flex items-center justify-center mb-4">
                    <SuccessIcon size={120} />
                </div>

                {/* Text Content */}
                <h3 className="text-[20px] font-bold text-[#101828] mb-8 text-center px-4 leading-relaxed">
                    Semester under Scheme edited successfully !!
                </h3>

                {/* Back Button */}
                <button
                    onClick={onClose}
                    className="w-full max-w-[120px] bg-[#0e1680] text-white py-3 rounded-xl font-semibold hover:bg-[#0a1060] transition-colors shadow-lg"
                >
                    Back
                </button>
            </div>
        </div>
    );
};

/* --- SemesterSuccessModal --- */

interface SemesterSuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const SemesterSuccessModal = ({ isOpen, onClose }: SemesterSuccessModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-[24px] p-10 flex flex-col items-center max-w-[400px] w-full shadow-2xl animate-in fade-in zoom-in duration-300">
                {/* Success Icon */}
                <div className="w-[120px] h-[120px] flex items-center justify-center mb-4">
                    <SuccessIcon size={120} />
                </div>

                {/* Text Content */}
                <h3 className="text-[22px] font-bold text-[#101828] mb-8 text-center">
                    Semester added successfully !!
                </h3>

                {/* Back Button */}
                <button
                    onClick={onClose}
                    className="w-full max-w-[120px] bg-[#0e1680] text-white py-3 rounded-xl font-semibold hover:bg-[#0a1060] transition-colors shadow-lg"
                >
                    Back
                </button>
            </div>
        </div>
    );
};

/* --- ViewSemesterModal --- */

interface ViewSemesterModalProps {
    isOpen: boolean;
    onClose: () => void;
    semester: any;
}

export const ViewSemesterModal = ({ isOpen, onClose, semester }: ViewSemesterModalProps) => {
    if (!isOpen || !semester) return null;

    const DetailField = ({ label, value }: { label: string; value: any }) => (
        <div className="space-y-1.5">
            <label className="text-sm font-medium text-[#344054]">{label}</label>
            <div className="w-full bg-white border border-[#d0d5dd] rounded-lg px-3.5 py-2.5 text-[#101828] text-sm">
                {value || '-'}
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-[24px] w-full max-w-[800px] shadow-2xl animate-in fade-in zoom-in duration-300 overflow-hidden">
                {/* Header */}
                <div className="px-8 py-6 border-b border-[#eaecf0] flex items-center justify-between">
                    <h3 className="text-xl font-bold text-[#101828]">Department Details</h3>
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
                <div className="p-8 space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                        <DetailField label="Scheme Name" value={semester.schemeName} />
                        <DetailField label="Programme Name" value={semester.programmeId} />
                    </div>

                    <DetailField label="Branch Name" value={semester.branchName || 'Computer Science'} />

                    <div className="grid grid-cols-2 gap-6">
                        <DetailField label="Semester Number" value={semester.semesterNumber} />
                        <DetailField label="Semester Name(Ordinal)" value={semester.semesterName} />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <DetailField label="Total Subjects" value={semester.totalSubjects} />
                        <DetailField label="Total Credits" value={semester.totalCredits} />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <DetailField label="Academic Months" value={`${semester.startDate} to ${semester.endDate}`} />
                        <DetailField label="Term Type" value={semester.term_type} />
                    </div>
                </div>
            </div>
        </div>
    );
};
