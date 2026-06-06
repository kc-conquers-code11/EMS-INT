import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { branchSchema, type BranchFormData } from '../../../schemas/COE/branchSchema';
import { getProgrammeDropdown } from '../../../services/programme/programmeApiService';
import { getDepartmentDropdown } from '../../../services/department/departmentApiService';
import { updateBranch } from '../../../services/branch/branchApiService';

interface EditBranchModalProps {
    isOpen: boolean;
    onClose: () => void;
    branch: any | null;
    onUpdate: (data: any) => void;
}

export const EditBranchModal: React.FC<EditBranchModalProps> = ({ isOpen, onClose, branch, onUpdate }) => {
    const [programmes, setProgrammes] = useState<any[]>([]);
    const [departments, setDepartments] = useState<any[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<BranchFormData>({
        resolver: zodResolver(branchSchema),
        defaultValues: branch || {}
    });

    useEffect(() => {
        if (branch) {
            reset({
                programm_id: branch.programm_id,
                depart_id: branch.depart_id,
                branch_name: branch.branch_name,
                branch_code: branch.branch_code,
                total_intake: branch.total_intake,
                accreditation_status: branch.accreditation_status,
                established_year: branch.established_year,
                status: branch.status === 1 || branch.status === true || branch.status === '1',
            });
        }
    }, [branch, reset]);

    useEffect(() => {
        if (isOpen) {
            getProgrammeDropdown()
                .then(r => setProgrammes(Array.isArray(r) ? r : (r?.data ?? [])))
                .catch(err => console.error('Failed to load programmes', err));

            getDepartmentDropdown()
                .then(r => setDepartments(Array.isArray(r) ? r : (r?.data ?? [])))
                .catch(err => console.error('Failed to load departments', err));
        }
    }, [isOpen]);

    if (!isOpen || !branch) return null;

    const onSubmit = async (data: BranchFormData) => {
        if (!branch.branch_id) {
            setSubmitError('Branch ID is missing.');
            return;
        }
        setIsSubmitting(true);
        setSubmitError(null);
        try {
            const payload = {
                ...branch,
                ...data,
            };
            if ('status' in payload) {
                payload.status = payload.status === 1 || payload.status === true || payload.status === '1';
            }
            await updateBranch(branch.branch_id, payload);
            onUpdate(payload);
        } catch (err: any) {
            console.error('Failed to update branch', err);
            setSubmitError(err?.response?.data?.message || err?.message || 'Failed to update branch.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const labelClass = "text-sm font-medium text-[#344054] mb-1.5 block";
    const inputClass = "w-full px-3 py-2 border border-[#d0d5dd] rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#0e1680] shadow-sm placeholder:text-[#667085] bg-white";
    const errorClass = "text-red-500 text-xs mt-1";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
            <div className="bg-white w-[600px] rounded-[12px] shadow-xl animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-[#eaecf0]">
                    <div className="flex items-center gap-2">
                        <h2 className="text-lg font-semibold text-[#101828]">Edit Branch Details</h2>
                        <svg className="w-5 h-5 text-[#667085]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <svg className="w-5 h-5 text-[#667085]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="p-6 space-y-4">
                        {/* Branch Name and Code */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className={labelClass}>Branch name</label>
                                <input
                                    {...register('branch_name')}
                                    className={inputClass}
                                    placeholder="Enter branch name"
                                />
                                {errors.branch_name && <p className={errorClass}>{errors.branch_name.message}</p>}
                            </div>
                            <div>
                                <label className={labelClass}>Branch Code</label>
                                <input
                                    {...register('branch_code')}
                                    className={inputClass}
                                    placeholder="Enter branch code"
                                />
                                {errors.branch_code && <p className={errorClass}>{errors.branch_code.message}</p>}
                            </div>
                        </div>

                        {/* Department and Programme */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className={labelClass}>Department</label>
                                <select
                                    {...register('depart_id')}
                                    className={inputClass}
                                >
                                    <option value="">Select Department</option>
                                    {departments.map(d => (
                                        <option key={d.depart_id} value={d.depart_id}>{d.depart_name}</option>
                                    ))}
                                </select>
                                {errors.depart_id && <p className={errorClass}>{errors.depart_id.message}</p>}
                            </div>
                            <div>
                                <label className={labelClass}>Programme</label>
                                <select
                                    {...register('programm_id')}
                                    className={inputClass}
                                >
                                    <option value="">Select Programme</option>
                                    {programmes.map(p => (
                                        <option key={p.programm_id} value={p.programm_id}>{p.programme_name}</option>
                                    ))}
                                </select>
                                {errors.programm_id && <p className={errorClass}>{errors.programm_id.message}</p>}
                            </div>
                        </div>

                        {/* Established Year and Intake Capacity */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className={labelClass}>Established Year</label>
                                <input
                                    {...register('established_year')}
                                    className={inputClass}
                                    placeholder="Enter year (e.g. 2004)"
                                    maxLength={4}
                                    onInput={(e: any) => {
                                        e.target.value = e.target.value.replace(/[^0-9]/g, '');
                                    }}
                                />
                                {errors.established_year && <p className={errorClass}>{errors.established_year.message}</p>}
                            </div>
                            <div>
                                <label className={labelClass}>Intake capacity</label>
                                <input
                                    {...register('total_intake', { valueAsNumber: true })}
                                    className={inputClass}
                                    placeholder="Enter intake capacity"
                                    type="number"
                                />
                                {errors.total_intake && <p className={errorClass}>{errors.total_intake.message}</p>}
                            </div>
                            {/* Status */}
                            <div>
                                <label className={labelClass}>Status</label>
                                <select
                                    {...register('status', { setValueAs: v => String(v) === 'true' })}
                                    className={`${inputClass} appearance-none bg-no-repeat bg-[right_0.75rem_center] bg-[length:16px_16px]`}
                                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23667085'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")` }}
                                >
                                    <option value="true">Active</option>
                                    <option value="false">Inactive</option>
                                </select>
                                {errors.status && <p className={errorClass}>{errors.status.message}</p>}
                            </div>
                        </div>
                    </div>
                    
                    {/* Submit Error */}
                    {submitError && (
                        <div className="px-6 py-2">
                            <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                                {submitError}
                            </div>
                        </div>
                    )}

                    {/* Footer */}
                    <div className="px-6 py-4 border-t border-[#eaecf0] flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="cursor-pointer px-4 py-2 bg-white border border-[#d0d5dd] rounded-lg text-sm font-semibold text-[#344054] hover:bg-gray-50 transition-colors shadow-sm disabled:opacity-50"
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="cursor-pointer px-6 py-2 bg-[#0e1680] text-white rounded-lg text-sm font-semibold hover:bg-[#0a0f5a] transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? 'Saving...' : 'Submit'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
