//src/pages/Institution/InstitutionListPage.tsx
import { useState, useEffect } from 'react';
import { institutionAPI, coeAPI } from '../../services/api';
import { ViewInstitutionModal } from '../../components/modals/Institution/ViewInstitutionModal';
import { EditInstitutionModal } from '../../components/modals/Institution/EditInstitutionModal';
import { InstitutionEditSuccessModal } from '../../components/modals/Institution/InstitutionEditSuccessModal';
import { DeleteInstitutionModal } from '../../components/modals/Institution/DeleteInstitutionModal';
import { DeleteInstitutionSuccessModal } from '../../components/modals/Institution/DeleteInstitutionSuccessModal';

// --- SVG icons with improved styling ---
const SearchIcon = () => (
    <svg className="w-4 h-4 text-[#98a2b3] group-hover:text-[#0e1680] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
);
const FilterIcon = () => (
    <svg className="w-5 h-5 text-[#344054] group-hover:text-[#0e1680] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
    </svg>
);
const DotsVertical = () => (
    <svg className="w-5 h-5 text-[#475467] hover:text-[#0e1680] transition-colors cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
    </svg>
);
const CopyIcon = () => (
    <svg className="w-[15px] h-[15px] text-[#98a2b3] hover:text-[#0e1680] cursor-pointer transition-all duration-200 hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
);
const EyeIcon = () => (
    <svg className="w-5 h-5 text-[#475467] group-hover:text-[#0e1680] transition-all duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
);
const TrashIcon = () => (
    <svg className="w-5 h-5 text-[#475467] group-hover:text-[#dc2626] transition-all duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);
const EditIcon = () => (
    <svg className="w-5 h-5 text-[#475467] group-hover:text-[#059669] transition-all duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
);
const ArrowLeftIcon = () => (
    <svg className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 16l-4-4m0 0l4-4m-4 4h18" />
    </svg>
);
const ArrowRightIcon = () => (
    <svg className="w-5 h-5 group-hover:translate-x-0.5 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
    </svg>
);

// Connected to Backend via useEffect

const columns = [
    { key: 'name', label: 'Institution Name' },
    { key: 'establishment_year', label: 'Established Year', width: 'w-[92px]' },
    { key: 'institution_code', label: 'Institution Code', width: 'w-[168px]' },
    { key: 'coe_email', label: 'COE Email ID', width: 'w-[227px]', copyable: true },
];

export const InstitutionListPage = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [successModalOpen, setSuccessModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [deleteSuccessModalOpen, setDeleteSuccessModalOpen] = useState(false);

    const [institutionsList, setInstitutionsList] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedInstitution, setSelectedInstitution] = useState<any>(null);

    useEffect(() => {
        fetchInstitutions();
    }, []);

const fetchInstitutions = async () => {
    setLoading(true);
    try {
        const [instResponse, coeResponse] = await Promise.all([
            institutionAPI.getAll(),
            coeAPI.getAll().catch(() => ({ data: { success: false, data: [] } }))
        ]);
        
        if (instResponse.data.success && instResponse.data.data) {
            const institutions = instResponse.data.data;
            // Make sure we're getting the COEs array correctly
            const coes = coeResponse?.data?.success ? (coeResponse.data.data || []) : [];
            
            console.log('COEs from API:', coes); // Debug log
            console.log('Institutions:', institutions); // Debug log
            
            const enrichedInstitutions = institutions.map(inst => {
                // Find COE that belongs to this institution
                const coe = coes.find((c: any) => {
                    // Log each comparison to debug
                    console.log(`Comparing COE institution_id: ${c.institution_id} with Institution ID: ${inst.institution_id}`);
                    return c.institution_id === inst.institution_id;
                });
                
                console.log(`Found COE for ${inst.name}:`, coe); // Debug log
                
                return {
                    ...inst,
                    coe: coe || null,
                    coe_email: coe?.email || 'N/A'
                };
            });
            
            setInstitutionsList(enrichedInstitutions);
        }
    } catch (error) {
        console.error("Error fetching institutions:", error);
    } finally {
        setLoading(false);
    }
};

    const filteredInstitutions = institutionsList.filter(
        (inst) => inst.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleCopy = (text: string) => {
        if (!text) return;
        navigator.clipboard.writeText(text);
    };

    const pages = [1]; // Simplified pagination for now

    return (
        <div className="flex flex-col gap-7 w-full animate-fadeIn">
            {/* Page Title with gradient accent */}
            <div className="relative">
                <h1 className="text-[24px] font-semibold bg-gradient-to-r from-[#101828] to-[#344054] bg-clip-text text-transparent leading-[32px]">
                    Institution List
                </h1>
                <div className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-[#0e1680] to-[#1e2a7a] rounded-full mt-1"></div>
            </div>

            {/* Search & Filter bar - enhanced */}
            <div className="flex items-center justify-end gap-3">
                {/* Search Input with animation */}
                <div className="relative w-[211px] group">
                    <input
                        type="text"
                        placeholder="Search institutions..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white border border-[#d0d5dd] rounded-lg px-3 py-2 text-base text-[#101828] placeholder-[#98a2b3] focus:outline-none focus:ring-2 focus:ring-[#0e1680]/20 focus:border-[#0e1680] transition-all duration-200 shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] pr-8 hover:border-[#0e1680]/30"
                    />
                    <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                        <SearchIcon />
                    </div>
                </div>

                {/* Established Year Filter with hover effects */}
                <button className="group flex items-center gap-2 bg-white border border-[#d0d5dd] rounded-lg px-4 py-2.5 text-sm font-semibold text-[#344054] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] hover:bg-[#f9fafb] hover:border-[#0e1680]/30 hover:shadow-md transition-all duration-200">
                    <span>Established Year</span>
                    <FilterIcon />
                </button>
            </div>

            {/* Table Card - enhanced with subtle gradient and hover effects */}
            <div className="bg-white border border-[#eaecf0] rounded-[10px] shadow-[0px_1px_3px_0px_rgba(16,24,40,0.1),0px_1px_2px_0px_rgba(16,24,40,0.06)] overflow-hidden hover:shadow-lg transition-shadow duration-300">
                {/* Card Header with improved design */}
                <div className="flex items-center justify-between px-6 pt-5 pb-4 bg-gradient-to-r from-white to-[#fafbfc]">
                    <div className="flex items-center gap-3">
                        <h2 className="text-lg font-semibold text-[#101828] leading-7">Institutions List</h2>
                        <span className="bg-gradient-to-r from-[#e5e7fb] to-[#f0f1fe] text-[#070b5c] text-xs font-medium px-2.5 py-0.5 rounded-full shadow-sm">
                            {filteredInstitutions.length}
                        </span>
                    </div>
                    <button className="p-1 hover:bg-[#f9fafb] rounded-lg transition-all duration-200 hover:rotate-90">
                        <DotsVertical />
                    </button>
                </div>

                {/* Divider with gradient */}
                <div className="h-px bg-gradient-to-r from-[#eaecf0] via-[#d0d5dd] to-[#eaecf0]" />

                {/* Table with improved styling */}
                <div className="w-full overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gradient-to-r from-[#f9fafb] to-[#f8f9fc] border-b border-[#eaecf0]">
                                {columns.map((col) => (
                                    <th
                                        key={col.label + col.key}
                                        className={`px-1 py-3 text-xs font-semibold text-[#475467] text-center whitespace-nowrap h-[44px] uppercase tracking-wider ${col.width || ''}`}
                                    >
                                        {col.label}
                                    </th>
                                ))}
                                <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider bg-[#f9fafb] h-[44px] w-[120px]" />
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={columns.length + 1} className="px-6 py-10 text-center">
                                        <div className="flex items-center justify-center gap-3">
                                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#0e1680]"></div>
                                            <span className="text-gray-400">Loading institutions...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredInstitutions.length === 0 ? (
                                <tr>
                                    <td colSpan={columns.length + 1} className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center gap-2">
                                            <svg className="w-12 h-12 text-[#d0d5dd]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                            </svg>
                                            <span className="text-gray-400 font-medium">No institutions found.</span>
                                            <p className="text-gray-300 text-sm">Try adjusting your search criteria</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredInstitutions.map((row, index) => (
                                    <tr key={row.institution_id} className="border-b border-[#eaecf0] h-[72px] hover:bg-[#fafbfc] transition-all duration-200 group hover:shadow-inner">
                                        {columns.map((col) => {
                                            const value = col.key === 'coe_email' ? (row.coe?.email || row.coeEmail || row.coe_email || 'N/A') : (row[col.key as keyof typeof row] || 'N/A');
                                            const highlightedKeys = ['name', 'establishment_year', 'institution_code', 'coe_email'];

                                            return (
                                                <td key={col.key} className="px-1 py-4 text-sm text-center whitespace-nowrap">
                                                    {col.copyable && value !== 'N/A' ? (
                                                        <div className="flex items-center justify-center gap-3">
                                                            <span className="text-[#101828] font-medium">{value}</span>
                                                            <button onClick={() => handleCopy(value)} className="shrink-0 transition-all duration-200 hover:scale-110">
                                                                <CopyIcon />
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <span className={`${highlightedKeys.includes(col.key) ? 'text-[#101828] font-medium' : 'text-[#475467]'} font-normal`}>
                                                            {value}
                                                        </span>
                                                    )}
                                                </td>
                                            );
                                        })}
                                        {/* Actions with improved tooltips */}
                                        <td className="px-4 py-4">
                                            <div className="flex items-center justify-center gap-1">
                                                <button 
                                                    onClick={() => { setSelectedInstitution(row); setViewModalOpen(true); }} 
                                                    className="group/btn p-2.5 rounded-lg hover:bg-[#f0f1fe] transition-all duration-200 hover:scale-105 relative"
                                                    title="View Institution"
                                                >
                                                    <EyeIcon />
                                                </button>
                                                <button 
                                                    onClick={() => { setSelectedInstitution(row); setDeleteModalOpen(true); }} 
                                                    className="group/btn p-2.5 rounded-lg hover:bg-[#fee2e2] transition-all duration-200 hover:scale-105 relative"
                                                    title="Delete Institution"
                                                >
                                                    <TrashIcon />
                                                </button>
                                                <button 
                                                    onClick={() => { setSelectedInstitution(row); setEditModalOpen(true); }} 
                                                    className="group/btn p-2.5 rounded-lg hover:bg-[#d1fae5] transition-all duration-200 hover:scale-105 relative"
                                                    title="Edit Institution"
                                                >
                                                    <EditIcon />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination with enhanced styling */}
                <div className="flex items-center justify-between px-6 pt-3 pb-4 border-t border-[#eaecf0] bg-gradient-to-r from-white to-[#fafbfc]">
                    <button className="group flex items-center gap-2 bg-white border border-[#d0d5dd] rounded-lg px-3.5 py-2 text-sm font-semibold text-[#344054] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] hover:bg-[#f9fafb] hover:border-[#0e1680]/30 hover:shadow-md transition-all duration-200">
                        <ArrowLeftIcon />
                        <span>Previous</span>
                    </button>

                    <div className="flex items-center gap-1">
                        {pages.map((page, idx) => (
                            <button
                                key={idx}
                                onClick={() => typeof page === 'number' && setCurrentPage(page)}
                                className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-200
                                    ${currentPage === page
                                        ? 'bg-gradient-to-r from-[#0e1680] to-[#1e2a7a] text-white shadow-md transform scale-105'
                                        : 'text-[#475467] hover:bg-[#f9fafb] hover:scale-105'
                                    }`}
                            >
                                {page}
                            </button>
                        ))}
                    </div>

                    <button className="group flex items-center gap-2 bg-white border border-[#d0d5dd] rounded-lg px-3.5 py-2 text-sm font-semibold text-[#344054] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] hover:bg-[#f9fafb] hover:border-[#0e1680]/30 hover:shadow-md transition-all duration-200">
                        <span>Next</span>
                        <ArrowRightIcon />
                    </button>
                </div>
            </div>
            
            {/* Modals - unchanged */}
            <ViewInstitutionModal isOpen={viewModalOpen} onClose={() => setViewModalOpen(false)} data={selectedInstitution} />
            <EditInstitutionModal
                isOpen={editModalOpen}
                onClose={() => setEditModalOpen(false)}
                data={selectedInstitution}
                onSave={async (data) => {
                    if (selectedInstitution) {
                        await institutionAPI.update(selectedInstitution.institution_id, data);
                        fetchInstitutions();
                        setEditModalOpen(false);
                        setSuccessModalOpen(true);
                    }
                }}
            />
            <InstitutionEditSuccessModal isOpen={successModalOpen} onClose={() => setSuccessModalOpen(false)} />
            <DeleteInstitutionModal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={async () => {
                    if (selectedInstitution) {
                        await institutionAPI.delete(selectedInstitution.institution_id);
                        fetchInstitutions();
                        setDeleteModalOpen(false);
                        setDeleteSuccessModalOpen(true);
                    }
                }}
            />
            <DeleteInstitutionSuccessModal
                isOpen={deleteSuccessModalOpen}
                onClose={() => setDeleteSuccessModalOpen(false)}
            />
            
            <style>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-out;
                }
            `}</style>
        </div>
    );
};