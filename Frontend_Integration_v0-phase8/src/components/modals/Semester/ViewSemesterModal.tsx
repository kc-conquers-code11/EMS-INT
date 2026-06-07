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
                        <DetailField label="Programme Name" value={semester.programmeName} />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <DetailField label="Branch Name" value={semester.branchName} />
                        <DetailField label="Academic Year" value={semester.academicName} />
                    </div>

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

                    <div className="space-y-1.5">
                        <DetailField label="Status" value={semester.isActive === 'active' ? 'Active' : 'Inactive'} />
                    </div>
                </div>
            </div>
        </div>
    );
};
