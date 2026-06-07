import React, { useEffect, useState } from 'react';
import { getProgrammeDropdown } from '../../../services/programme/programmeApiService';
import { getDepartmentDropdown } from '../../../services/department/departmentApiService';

interface ViewBranchModalProps {
    isOpen: boolean;
    onClose: () => void;
    branch: any | null;
}

export const ViewBranchModal: React.FC<ViewBranchModalProps> = ({ isOpen, onClose, branch }) => {
    const [programmes, setProgrammes] = useState<any[]>([]);
    const [departments, setDepartments] = useState<any[]>([]);

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

    const labelClass = "text-sm font-medium text-[#475467] mb-1.5 block";
    const inputClass = "w-full px-3 py-2.5 bg-white border border-[#d0d5dd] rounded-lg text-[#667085] text-base focus:outline-none cursor-default";

    const getProgrammeName = (id: string) => {
        const prog = programmes.find(p => p.programm_id === id);
        return prog ? prog.programme_name : id;
    };

    const getDepartmentName = (id: string) => {
        const dept = departments.find(d => d.depart_id === id);
        return dept ? dept.depart_name : id;
    };

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
                            <div className={inputClass}>{branch.branch_name || '-'}</div>
                        </div>
                        <div>
                            <label className={labelClass}>Branch Code</label>
                            <div className={inputClass}>{branch.branch_code || '-'}</div>
                        </div>
                    </div>

                    {/* Department and Programme */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>Department</label>
                            <div className={inputClass}>{getDepartmentName(branch.depart_id) || '-'}</div>
                        </div>
                        <div>
                            <label className={labelClass}>Programme</label>
                            <div className={inputClass}>{getProgrammeName(branch.programm_id) || '-'}</div>
                        </div>
                    </div>

                    {/* Intake Capacity */}
                    <div>
                        <label className={labelClass}>Intake capacity</label>
                        <div className={inputClass}>{branch.total_intake || '-'}</div>
                    </div>

                    {/* Status */}
                    <div>
                        <label className={labelClass}>Status</label>
                        <div className={inputClass}>
                            <span className={`px-2.5 py-0.5 rounded-full text-sm font-medium ${
                                branch.status === true 
                                ? 'bg-[#effbe7] text-[#095512]' 
                                : 'bg-[rgba(255,0,0,0.1)] text-[#c00000]'
                            }`}>
                                {branch.status ? 'Active' : 'Inactive'}
                            </span>
                        </div>
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
