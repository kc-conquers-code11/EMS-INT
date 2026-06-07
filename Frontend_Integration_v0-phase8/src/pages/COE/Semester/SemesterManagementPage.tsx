import { useState, useEffect } from 'react';
import { SemesterForm } from '../../../components/screens/COE/Semester/SemesterForm';
import { SemesterListView } from '../../../components/screens/COE/Semester/SemesterListView';
import type { SemesterFormData } from '../../../schemas/COE/semesterSchema';
import { SemesterSuccessModal } from '../../../components/modals/Semester/SemesterSuccessModal';
import { semesterAPI } from '../../../services/api';

export const SemesterManagementPage = () => {
    const [activeTab, setActiveTab] = useState(1); // 1: Add, 2: View
    const [semesters, setSemesters] = useState<any[]>([]);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 10;

    const fetchSemesters = async () => {
        setIsLoading(true);
        try {
            const response = await semesterAPI.getAll({ page: currentPage, limit });
            if (response.data.success) {
                const fetchedSemesters = Array.isArray(response.data.data) ? response.data.data : [];
                const formattedSemesters = (fetchedSemesters || []).map((sem: any) => ({
                    id: sem.semester_id,
                    programmeId: sem.programme_id,
                    academicId: sem.academic_id,
                    branchId: sem.branch_id,
                    schemeId: sem.scheme_id,
                    programmeName: sem.programme_name || 'N/A',
                    academicName: sem.academic_name || 'N/A',
                    semesterNumber: String(sem.semester_number),
                    semesterName: sem.semester_name || `${sem.semester_number} Semester`,
                    term_type: sem.term_type,
                    startDate: sem.start_date || '',
                    endDate: sem.end_date || '',
                    isActive: sem.is_active ? 'active' : 'inactive',
                    schemeName: sem.scheme_name || 'N/A',
                    branchName: sem.branch_name || 'N/A',
                    totalSubjects: sem.total_subjects ? String(sem.total_subjects) : 'N/A',
                    totalCredits: sem.total_credits ? String(sem.total_credits) : 'N/A',
                }));
                setSemesters(formattedSemesters);
                setTotalPages(response.data.totalPages || 1);
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to fetch semesters');
            console.error('Error fetching semesters:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (activeTab === 2) {
            fetchSemesters();
        }
    }, [activeTab, currentPage]);

    const handleAddSemester = async (data: SemesterFormData) => {
        try {
            const payload = {
                programme_id: data.programmeId,
                academic_id: data.academicId,
                branch_id: data.branchId || null,
                scheme_id: data.schemeId || null,
                semester_number: parseInt(data.semesterNumber, 10),
                term_type: data.term_type,
                start_date: data.startDate || null,
                end_date: data.endDate || null,
                total_subjects: data.totalSubjects ? parseInt(data.totalSubjects, 10) : null,
                total_credits: data.totalCredits ? parseInt(data.totalCredits, 10) : null,
                is_active: data.isActive === 'active'
            };

            const response = await semesterAPI.create(payload);
            if (response.data.success) {
                setShowSuccessModal(true);
            }
        } catch (err: any) {
            console.error('Error adding semester:', err);
            alert(err.response?.data?.message || 'Failed to add semester');
        }
    };

    const handleCloseSuccess = () => {
        setShowSuccessModal(false);
        setActiveTab(2); // Switch to View tab after closing
    };

    const handleEditSemester = async (updatedData: any) => {
        try {
            const payload = {
                programme_id: updatedData.programmeId,
                academic_id: updatedData.academicId,
                branch_id: updatedData.branchId || null,
                scheme_id: updatedData.schemeId || null,
                semester_number: parseInt(updatedData.semesterNumber, 10),
                term_type: updatedData.term_type,
                start_date: updatedData.startDate || null,
                end_date: updatedData.endDate || null,
                total_subjects: updatedData.totalSubjects ? parseInt(updatedData.totalSubjects, 10) : null,
                total_credits: updatedData.totalCredits ? parseInt(updatedData.totalCredits, 10) : null,
                is_active: updatedData.isActive === 'active'
            };
            const response = await semesterAPI.update(updatedData.id, payload);
            if (response.data.success) {
                fetchSemesters();
            }
        } catch (err: any) {
            console.error('Error updating semester:', err);
            alert(err.response?.data?.message || 'Failed to update semester');
        }
    };

    const handleDeleteSemester = async (id: string) => {
        try {
            const response = await semesterAPI.delete(id);
            if (response.data.success) {
                fetchSemesters();
            }
        } catch (err: any) {
            console.error('Error deleting semester:', err);
            alert(err.response?.data?.message || 'Failed to delete semester');
        }
    };

    return (
        <div className="flex flex-col gap-10">
            {/* Header Section */}
            <div className="flex flex-col gap-7">
                <h1 className="text-[28px] font-semibold text-[#171822]">Semester Details</h1>
                
                {/* Custom Tabs */}
                <div className="bg-[#f2f3fd] border border-[#e5e7fb] p-1.5 rounded-[10px] flex gap-2 w-fit shadow-sm">
                    <button
                        onClick={() => setActiveTab(1)}
                        className={`px-6 py-2.5 rounded-[6px] text-base font-semibold transition-all duration-200 ${
                            activeTab === 1
                                ? 'bg-[#0e1680] text-white shadow-md'
                                : 'text-[#98a2b3] hover:text-[#687b96] hover:bg-white/50'
                        }`}
                    >
                        Add Semester details
                    </button>
                    <button
                        onClick={() => setActiveTab(2)}
                        className={`px-6 py-2.5 rounded-[6px] text-base font-semibold transition-all duration-200 ${
                            activeTab === 2
                                ? 'bg-[#0e1680] text-white shadow-md'
                                : 'text-[#98a2b3] hover:text-[#687b96] hover:bg-white/50'
                        }`}
                    >
                        View
                    </button>
                </div>
            </div>

            {/* Content Section */}
            <div className="bg-white rounded-xl">
                {activeTab === 1 ? (
                    <SemesterForm onSubmit={handleAddSemester} />
                ) : (
                    <SemesterListView 
                        semesters={semesters} 
                        onDelete={handleDeleteSemester} 
                        onEdit={handleEditSemester} 
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                )}
            </div>

            {/* Success Modal */}
            <SemesterSuccessModal 
                isOpen={showSuccessModal} 
                onClose={handleCloseSuccess} 
            />
        </div>
    );
};
