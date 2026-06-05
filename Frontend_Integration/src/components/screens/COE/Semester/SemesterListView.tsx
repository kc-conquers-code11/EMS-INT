import React, { useState, useMemo } from 'react';
import { ViewSemesterModal } from '../../../modals/Semester/ViewSemesterModal';
import { EditSemesterModal } from '../../../modals/Semester/EditSemesterModal';
import { SemesterEditSuccessModal } from '../../../modals/Semester/SemesterEditSuccessModal';
import { DeleteSemesterModal } from '../../../modals/Semester/DeleteSemesterModal';
import { SemesterDeleteSuccessModal } from '../../../modals/Semester/SemesterDeleteSuccessModal';

interface SemesterListViewProps {
    semesters: any[];
    onDelete?: (id: string) => void;
    onEdit?: (data: any) => void;
    currentPage?: number;
    totalPages?: number;
    onPageChange?: (page: number) => void;
}

export const SemesterListView = ({ semesters, onDelete, onEdit, currentPage = 1, totalPages = 1, onPageChange }: SemesterListViewProps) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [schemeFilter, setSchemeFilter] = useState('');
    const [termFilter, setTermFilter] = useState('');
    const [semNoFilter, setSemNoFilter] = useState('');
    
    // Modal States
    const [viewingSemester, setViewingSemester] = useState<any>(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [editingSemester, setEditingSemester] = useState<any>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [showEditSuccessModal, setShowEditSuccessModal] = useState(false);
    const [deletingSemesterId, setDeletingSemesterId] = useState<string | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [showDeleteSuccessModal, setShowDeleteSuccessModal] = useState(false);

    const handleView = (semester: any) => {
        setViewingSemester(semester);
        setIsViewModalOpen(true);
    };

    const handleEditClick = (semester: any) => {
        setEditingSemester(semester);
        setIsEditModalOpen(true);
    };

    const handleUpdate = (updatedData: any) => {
        onEdit?.({ ...editingSemester, ...updatedData });
        setIsEditModalOpen(false);
        setShowEditSuccessModal(true);
    };

    const handleDeleteClick = (id: string) => {
        setDeletingSemesterId(id);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = () => {
        if (deletingSemesterId) {
            onDelete?.(deletingSemesterId);
            setIsDeleteModalOpen(false);
            setDeletingSemesterId(null);
            setShowDeleteSuccessModal(true);
        }
    };

    const filteredSemesters = useMemo(() => {
        return semesters.filter(sem => {
            const matchesSearch = sem.semesterName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                sem.programmeName?.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesScheme = !schemeFilter || sem.schemeName === schemeFilter;
            const matchesTerm = !termFilter || sem.term_type === termFilter;
            const matchesSemNo = !semNoFilter || sem.semesterNumber === semNoFilter;

            return matchesSearch && matchesScheme && matchesTerm && matchesSemNo;
        });
    }, [semesters, searchQuery, schemeFilter, termFilter, semNoFilter]);

    console.log(filteredSemesters);

    return (
        <div className="flex flex-col gap-6">
            {/* Search and Filters */}
            <div className="flex items-center justify-end gap-3">
                {/* Search Bar */}
                <div className="relative w-[320px]">
                    <input
                        type="text"
                        placeholder="Search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white border border-[#d0d5dd] rounded-lg pl-4 pr-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0e1680]/20"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <svg className="w-4 h-4 text-[#667085]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex items-center gap-2">
                    <FilterDropdown 
                        label="Scheme" 
                        value={schemeFilter} 
                        onChange={setSchemeFilter}
                        options={Array.from(new Set(semesters.map(s => s.schemeName))).filter(Boolean)}
                    />
                    <FilterDropdown 
                        label="Term" 
                        value={termFilter} 
                        onChange={setTermFilter}
                        options={['Odd Term', 'Even Term']}
                    />
                    <FilterDropdown 
                        label="Semester No" 
                        value={semNoFilter} 
                        onChange={setSemNoFilter}
                        options={['1', '2', '3', '4', '5', '6', '7', '8']}
                    />
                </div>
            </div>

            {/* Table */}
            <div className="border border-[#eaecf0] rounded-xl overflow-hidden bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-[#f9fafb] border-b border-[#eaecf0]">
                            <tr>
                                <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider text-[#667085]">Scheme Name</th>
                                <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider text-[#667085]">Semester No</th>
                                <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider text-[#667085]">Semester Name</th>
                                <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider text-[#667085]">Term Type</th>
                                <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider text-[#667085]">Total Subjects</th>
                                <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider text-[#667085] text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#eaecf0]">
                            {filteredSemesters.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-8 py-6 text-[15px] font-medium text-center text-gray-400">
                                        No semesters found.
                                    </td>
                                </tr>
                            ) : (
                                filteredSemesters.map((sem) => (
                                    <tr key={sem.id} className="hover:bg-gray-50 transition-colors h-[72px]">
                                        <td className="px-8 py-6 text-[15px] font-medium whitespace-nowrap text-sm text-[#475467]">{sem.schemeName}</td>
                                        <td className="px-8 py-6 text-[15px] font-medium whitespace-nowrap text-sm text-[#475467]">{sem.semesterNumber}</td>
                                        <td className="px-8 py-6 text-[15px] font-medium whitespace-nowrap text-sm text-[#475467]">{sem.semesterName}</td>
                                        <td className="px-8 py-6 text-[15px] font-medium whitespace-nowrap text-sm text-[#475467]">{sem.term_type}</td>
                                        <td className="px-8 py-6 text-[15px] font-medium whitespace-nowrap text-sm text-[#475467]">{sem.totalSubjects}</td>
                                        <td className="px-8 py-6 text-[15px] font-medium whitespace-nowrap text-right">
                                            <div className="flex justify-end gap-1">
                                                <button 
                                                    onClick={() => handleView(sem)}
                                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-[#687b96]"
                                                >
                                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                    </svg>
                                                </button>
                                                <button 
                                                    onClick={() => handleDeleteClick(sem.id)}
                                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-[#687b96]"
                                                >
                                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                                <button 
                                                    onClick={() => handleEditClick(sem)}
                                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-[#687b96]"
                                                >
                                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between px-6 py-4 bg-white border-t border-[#eaecf0] rounded-b-xl">
                    <button
                        onClick={() => onPageChange?.(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-4 py-2 text-sm font-medium text-[#344054] bg-white border border-[#d0d5dd] rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Previous
                    </button>
                    <span className="text-sm text-[#667085]">
                        Page <span className="font-medium text-[#344054]">{currentPage}</span> of <span className="font-medium text-[#344054]">{totalPages}</span>
                    </span>
                    <button
                        onClick={() => onPageChange?.(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 text-sm font-medium text-[#344054] bg-white border border-[#d0d5dd] rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Next
                    </button>
                </div>
            )}

            {/* Modals */}
            <ViewSemesterModal 
                isOpen={isViewModalOpen}
                onClose={() => setIsViewModalOpen(false)}
                semester={viewingSemester}
            />
            <EditSemesterModal 
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                semester={editingSemester}
                onUpdate={handleUpdate}
            />
            <SemesterEditSuccessModal 
                isOpen={showEditSuccessModal}
                onClose={() => setShowEditSuccessModal(false)}
            />
            <DeleteSemesterModal 
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
            />
            <SemesterDeleteSuccessModal 
                isOpen={showDeleteSuccessModal}
                onClose={() => setShowDeleteSuccessModal(false)}
            />
        </div>
    );
};

const FilterDropdown = ({ label, value, onChange, options }: { label: string, value: string, onChange: (v: string) => void, options: string[] }) => (
    <div className="relative group">
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="appearance-none bg-white border border-[#d0d5dd] rounded-lg pl-3 pr-10 py-2 text-sm font-medium text-[#344054] focus:outline-none focus:ring-2 focus:ring-[#0e1680]/20 min-w-[120px]"
        >
            <option value="">{label}</option>
            {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <svg className="w-4 h-4 text-[#667085]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
        </div>
    </div>
);
