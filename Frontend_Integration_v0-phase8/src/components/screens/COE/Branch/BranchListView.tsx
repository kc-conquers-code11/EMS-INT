import React, { useEffect, useState } from 'react';
import { ViewBranchModal } from '../../../modals/Branch/ViewBranchModal';
import { EditBranchModal } from '../../../modals/Branch/EditBranchModal';
import { EditBranchSuccessModal } from '../../../modals/Branch/EditBranchSuccessModal';
import { DeleteBranchModal } from '../../../modals/Branch/DeleteBranchModal';
import { DeleteBranchSuccessModal } from '../../../modals/Branch/DeleteBranchSuccessModal';
import { getProgrammeDropdown } from '../../../../services/programme/programmeApiService';

const ActionButton = ({ icon, onClick, color = "#687b96" }: { icon: React.ReactNode; onClick?: () => void; color?: string }) => (
    <button 
        onClick={onClick}
        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        style={{ color }}
    >
        {icon}
    </button>
);

export const BranchListView = ({ 
    branches = [], 
    onUpdateBranch,
    onDeleteBranch
}: { 
    branches?: any[], 
    onUpdateBranch?: (updatedBranch: any) => void,
    onDeleteBranch?: (branchId: string) => void
}) => {
    const [selectedBranch, setSelectedBranch] = useState<any>(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isEditSuccessModalOpen, setIsEditSuccessModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeleteSuccessModalOpen, setIsDeleteSuccessModalOpen] = useState(false);

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedProgramme, setSelectedProgramme] = useState('');
    const [programmes, setProgrammes] = useState<any[]>([]);

    useEffect(() => {
        getProgrammeDropdown()
            .then(r => setProgrammes(Array.isArray(r) ? r : (r?.data ?? [])))
            .catch(err => console.error('Failed to load programmes', err));
    }, []);

    const safeBranches = Array.isArray(branches) ? branches : [];

    // Get unique programmes for the filter dropdown
    const uniqueProgrammes = Array.from(new Set(safeBranches.map(b => b.programm_id))).filter(Boolean);

    const displayBranches = safeBranches.filter(branch => {
        const matchesSearch = 
            branch.branch_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            branch.branch_code?.toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesProgramme = selectedProgramme === '' || branch.programm_id === selectedProgramme;

        return matchesSearch && matchesProgramme;
    });

    const handleViewClick = (branch: any) => {
        setSelectedBranch(branch);
        setIsViewModalOpen(true);
    };

    const handleEditClick = (branch: any) => {
        setSelectedBranch(branch);
        setIsEditModalOpen(true);
    };

    const handleDeleteClick = (branch: any) => {
        setSelectedBranch(branch);
        setIsDeleteModalOpen(true);
    };

    const getProgrammeName = (id: string) => {
        const prog = programmes.find(p => p.programm_id === id);
        return prog ? prog.programme_name : id;
    };

    return (
        <div className="space-y-4">
            <ViewBranchModal 
                isOpen={isViewModalOpen} 
                onClose={() => setIsViewModalOpen(false)} 
                branch={selectedBranch}
            />
            <EditBranchModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                branch={selectedBranch}
                onUpdate={(data) => {
                    onUpdateBranch?.(data);
                    setIsEditModalOpen(false);
                    setIsEditSuccessModalOpen(true);
                }}
            />
            <EditBranchSuccessModal 
                isOpen={isEditSuccessModalOpen} 
                onClose={() => setIsEditSuccessModalOpen(false)} 
            />
            <DeleteBranchModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                branchName={selectedBranch?.branch_name || ''}
                onConfirm={() => {
                    onDeleteBranch?.(selectedBranch?.branch_id);
                    setIsDeleteModalOpen(false);
                    setIsDeleteSuccessModalOpen(true);
                }}
            />
            <DeleteBranchSuccessModal 
                isOpen={isDeleteSuccessModalOpen} 
                onClose={() => setIsDeleteSuccessModalOpen(false)} 
            />
            {/* Search and Filter */}
            <div className="flex justify-end gap-3 mb-6">
                <div className="relative w-[211px]">
                    <input
                        type="text"
                        placeholder="Search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-3 pr-10 py-2 border border-[#d0d5dd] rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#0e1680] shadow-sm"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <svg className="w-4 h-4 text-[#687b96]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>
                <div className="relative">
                    <select 
                        value={selectedProgramme}
                        onChange={(e) => setSelectedProgramme(e.target.value)}
                        className="appearance-none flex items-center gap-2 px-4 py-2 border border-[#d0d5dd] rounded-lg text-sm font-semibold text-[#344054] hover:bg-gray-50 shadow-sm transition-colors cursor-pointer pr-10 bg-white"
                    >
                        <option value="">All Programmes</option>
                        {uniqueProgrammes.map(prog => (
                            <option key={prog as string} value={prog as string}>{getProgrammeName(prog as string)}</option>
                        ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <svg className="w-4 h-4 text-[#344054]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="border border-[#eaecf0] rounded-xl overflow-hidden bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-[#f9fafb] border-b border-[#eaecf0]">
                            <tr>
                                <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider text-xs text-[#667085]">Branch Name</th>
                                <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider text-xs text-[#667085]">Established Year</th>
                                <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider text-xs text-[#667085]">Programme</th>
                                <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider text-xs text-[#667085]">
                                    <div className="flex items-center gap-1">
                                        Status
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                        </svg>
                                    </div>
                                </th>
                                <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider text-xs text-right text-[#667085]">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#eaecf0]">
                            {displayBranches.map((branch) => (
                                <tr key={branch.branch_id || branch.id} className="hover:bg-gray-50 transition-colors h-[72px]">
                                    <td className="px-8 py-6 text-[15px] font-medium whitespace-nowrap text-sm text-[#475467]">{branch.branch_name}</td>
                                    <td className="px-8 py-6 text-[15px] font-medium whitespace-nowrap text-sm text-[#475467]">{branch.established_year || '-'}</td>
                                    <td className="px-8 py-6 text-[15px] font-medium whitespace-nowrap text-sm text-[#475467]">{getProgrammeName(branch.programm_id)}</td>
                                    <td className="px-8 py-6 text-[15px] font-medium whitespace-nowrap">
                                        <span className={`px-2.5 py-0.5 rounded-full text-sm font-medium ${
                                            branch.status === true || branch.status === 1 || branch.status === '1'
                                            ? 'bg-[#effbe7] text-[#095512]' 
                                            : 'bg-[rgba(255,0,0,0.1)] text-[#c00000]'
                                        }`}>
                                            {branch.status === true || branch.status === 1 || branch.status === '1' ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-[15px] font-medium whitespace-nowrap text-right">
                                        <div className="flex justify-end gap-1">
                                            <ActionButton 
                                                onClick={() => handleViewClick(branch)}
                                                icon={
                                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                    </svg>
                                                } 
                                            />
                                            <ActionButton 
                                                onClick={() => handleDeleteClick(branch)}
                                                icon={
                                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                } 
                                            />
                                            <ActionButton 
                                                onClick={() => handleEditClick(branch)}
                                                icon={
                                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                } 
                                            />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
