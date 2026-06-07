import React from 'react';
import { SuccessIcon, DeleteSuccessIcon } from '../../shared/ModalIcons';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { branchSchema } from '../../../schemas/branchSchema';
import type { z } from 'zod';

/* --- BranchSuccessModal --- */

interface BranchSuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const BranchSuccessModal: React.FC<BranchSuccessModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
            <div className="bg-white w-[510px] rounded-[20px] p-10 flex flex-col items-center gap-7 shadow-xl animate-in fade-in zoom-in duration-300">
                {/* Success Icon */}
                <div className="w-[120px] h-[120px] flex items-center justify-center mb-2">
                    <SuccessIcon size={120} />
                </div>

                <div className="text-center">
                    <h2 className="text-[24px] font-semibold text-black leading-8">
                        Branch Added successfully !
                    </h2>
                </div>

                <div className="w-full flex justify-center">
                    <button
                        onClick={onClose}
                        className="bg-[#0e1680] hover:bg-[#0a106e] text-white px-8 py-2.5 rounded-lg font-semibold text-base transition-colors shadow-sm min-w-[100px]"
                    >
                        Back
                    </button>
                </div>
            </div>
        </div>
    );
};

/* --- DeleteBranchModal --- */

interface DeleteBranchModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    branchName: string;
}

export const DeleteBranchModal: React.FC<DeleteBranchModalProps> = ({ isOpen, onClose, onConfirm, branchName: _branchName }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
            <div className="bg-white w-[400px] p-8 rounded-[24px] shadow-xl animate-in fade-in zoom-in duration-200 text-center">
                {/* Warning Icon */}
                <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 bg-[#fee4e2] rounded-full flex items-center justify-center">
                        <div className="w-12 h-12 bg-[#f04438] rounded-full flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Message */}
                <h2 className="text-xl font-bold text-[#101828] mb-8">
                    Do you really want to delete this Branch?
                </h2>

                {/* Actions */}
                <div className="flex gap-3">
                    <button
                        onClick={onConfirm}
                        className="flex-1 py-2.5 bg-[#0e1680] text-white rounded-lg font-semibold hover:bg-[#0a0f5a] transition-colors shadow-sm"
                    >
                        Delete
                    </button>
                    <button
                        onClick={onClose}
                        className="flex-1 py-2.5 bg-[#0e1680] text-white rounded-lg font-semibold hover:bg-[#0a0f5a] transition-colors shadow-sm"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

/* --- DeleteBranchSuccessModal --- */

interface DeleteBranchSuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const DeleteBranchSuccessModal: React.FC<DeleteBranchSuccessModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
            <div className="bg-white w-[400px] p-8 rounded-[24px] shadow-xl animate-in fade-in zoom-in duration-200 text-center">
                {/* Success Icon */}
                <div className="flex justify-center mb-6">
                    <DeleteSuccessIcon size={120} />
                </div>

                {/* Message */}
                <h2 className="text-xl font-bold text-[#101828] mb-8">
                    Branch deleted successfully!
                </h2>

                {/* Back Button */}
                <button
                    onClick={onClose}
                    className="w-full py-3 bg-[#0e1680] text-white rounded-lg font-semibold hover:bg-[#0a0f5a] transition-colors shadow-lg"
                >
                    Back
                </button>
            </div>
        </div>
    );
};

/* --- EditBranchModal --- */

interface EditBranchModalProps {
    isOpen: boolean;
    onClose: () => void;
    branch: any | null;
    onUpdate: (data: any) => void;
}

export const EditBranchModal: React.FC<EditBranchModalProps> = ({ isOpen, onClose, branch, onUpdate }) => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<z.input<typeof branchSchema>>({
        resolver: zodResolver(branchSchema),
        defaultValues: branch || {}
    });

    React.useEffect(() => {
        if (branch) {
            reset(branch);
        }
    }, [branch, reset]);

    if (!isOpen || !branch) return null;

    const onSubmit = (data: z.input<typeof branchSchema>) => {
        onUpdate({ ...branch, ...data });
        onClose();
    };

    const labelClass = "text-sm font-medium text-[#344054] mb-1.5 block";
    const inputClass = "w-full px-3 py-2 border border-[#d0d5dd] rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#0e1680] shadow-sm placeholder:text-[#667085]";
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
                                    {...register('branchName')}
                                    className={inputClass}
                                    placeholder="Enter branch name"
                                />
                                {errors.branchName && <p className={errorClass}>{errors.branchName.message}</p>}
                            </div>
                            <div>
                                <label className={labelClass}>Branch Code</label>
                                <input 
                                    {...register('branchCode')}
                                    className={inputClass}
                                    placeholder="Enter branch code"
                                />
                                {errors.branchCode && <p className={errorClass}>{errors.branchCode.message}</p>}
                            </div>
                        </div>

                        {/* Department and Programme */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className={labelClass}>Department</label>
                                <input 
                                    {...register('departmentName')}
                                    className={inputClass}
                                    placeholder="Enter department name"
                                />
                                {errors.departmentName && <p className={errorClass}>{errors.departmentName.message}</p>}
                            </div>
                            <div>
                                <label className={labelClass}>Programme</label>
                                <input 
                                    {...register('programme')}
                                    className={inputClass}
                                    placeholder="Enter programme"
                                />
                                {errors.programme && <p className={errorClass}>{errors.programme.message}</p>}
                            </div>
                        </div>

                        {/* Established Year and Intake Capacity */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className={labelClass}>Established Year</label>
                                <input 
                                    {...register('establishedYear')}
                                    className={inputClass}
                                    placeholder="Enter year (e.g. 2004)"
                                    maxLength={4}
                                    onInput={(e: any) => {
                                        e.target.value = e.target.value.replace(/[^0-9]/g, '');
                                    }}
                                />
                                {errors.establishedYear && <p className={errorClass}>{errors.establishedYear.message}</p>}
                            </div>
                            <div>
                                <label className={labelClass}>Intake capacity</label>
                                <input 
                                    {...register('intakeCapacity')}
                                    className={inputClass}
                                    placeholder="Enter intake capacity"
                                    onInput={(e: any) => {
                                        e.target.value = e.target.value.replace(/[^0-9]/g, '');
                                    }}
                                />
                                {errors.intakeCapacity && <p className={errorClass}>{errors.intakeCapacity.message}</p>}
                            </div>
                        </div>

                        {/* Status */}
                        <div>
                            <label className={labelClass}>Status</label>
                            <select 
                                {...register('status')}
                                className={`${inputClass} appearance-none bg-no-repeat bg-[right_0.75rem_center] bg-[length:16px_16px]`}
                                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23667085'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")` }}
                            >
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </select>
                            {errors.status && <p className={errorClass}>{errors.status.message}</p>}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="px-6 py-4 border-t border-[#eaecf0] flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-white border border-[#d0d5dd] rounded-lg text-sm font-semibold text-[#344054] hover:bg-gray-50 transition-colors shadow-sm"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-[#0e1680] text-white rounded-lg text-sm font-semibold hover:bg-[#0a0f5a] transition-colors shadow-sm"
                        >
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

/* --- EditBranchSuccessModal --- */

interface EditBranchSuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const EditBranchSuccessModal: React.FC<EditBranchSuccessModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
            <div className="bg-white w-[400px] p-8 rounded-[24px] shadow-xl animate-in fade-in zoom-in duration-200 text-center">
                {/* Success Icon */}
                <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 bg-[#effbe7] rounded-full flex items-center justify-center">
                        <div className="w-12 h-12 bg-[#32d583] rounded-full flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Message */}
                <h2 className="text-xl font-bold text-[#101828] mb-8">
                    Branch edited successfully !!
                </h2>

                {/* Back Button */}
                <button
                    onClick={onClose}
                    className="w-full py-3 bg-[#0e1680] text-white rounded-lg font-semibold hover:bg-[#0a0f5a] transition-colors shadow-lg"
                >
                    Back
                </button>
            </div>
        </div>
    );
};

/* --- ViewBranchModal --- */

interface ViewBranchModalProps {
    isOpen: boolean;
    onClose: () => void;
    branch: {
        branchName: string;
        branchCode: string;
        departmentName: string;
        programme: string;
        intakeCapacity: string;
        status: string;
    } | null;
}

export const ViewBranchModal: React.FC<ViewBranchModalProps> = ({ isOpen, onClose, branch }) => {
    if (!isOpen || !branch) return null;

    const labelClass = "text-sm font-medium text-[#475467] mb-1.5 block";
    const inputClass = "w-full px-3 py-2.5 bg-white border border-[#d0d5dd] rounded-lg text-[#667085] text-base focus:outline-none cursor-default";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
            <div className="bg-white w-[600px] rounded-[12px] shadow-xl animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-[#eaecf0]">
                    <h2 className="text-lg font-semibold text-[#101828]">Branch Details</h2>
                    <button 
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <svg className="w-5 h-5 text-[#667085]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-5">
                    {/* Branch Name and Code */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>Branch name</label>
                            <div className={inputClass}>{branch.branchName}</div>
                        </div>
                        <div>
                            <label className={labelClass}>Branch Code</label>
                            <div className={inputClass}>{branch.branchCode}</div>
                        </div>
                    </div>

                    {/* Department and Programme */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>Department</label>
                            <div className={inputClass}>{branch.departmentName}</div>
                        </div>
                        <div>
                            <label className={labelClass}>Programme</label>
                            <div className={inputClass}>{branch.programme}</div>
                        </div>
                    </div>

                    {/* Intake Capacity */}
                    <div>
                        <label className={labelClass}>Intake capacity</label>
                        <div className={inputClass}>{branch.intakeCapacity}</div>
                    </div>

                    {/* Status */}
                    <div>
                        <label className={labelClass}>Status</label>
                        <div className={inputClass}>{branch.status}</div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-[#eaecf0] flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-white border border-[#d0d5dd] rounded-lg text-sm font-semibold text-[#344054] hover:bg-gray-50 transition-colors shadow-sm"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};
