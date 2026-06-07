// This file has been auto-fixed to resolve merge conflicts and JSX errors.
import React, { useState } from 'react';
import { 
  Eye, Trash2, Edit2, ChevronLeft, ChevronRight, MoreVertical 
} from 'lucide-react';
import type { Student, StudentFeedbackType } from '../../../../types/COE/student';
import { EditStudentModal } from './EditStudentModal';
import { StudentFeedbackModal } from './StudentModals';

interface StudentTableProps {
  students: Student[];
  onUpdateStudent?: (student: Student) => void;
  onDeleteStudent?: (id: string) => void;
}

export const StudentTable: React.FC<StudentTableProps> = ({ students, onUpdateStudent, onDeleteStudent }) => {
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  // Feedback Modal State
  const [feedbackConfig, setFeedbackConfig] = useState<{
    isOpen: boolean;
    type: StudentFeedbackType;
    studentId?: string;
  }>({
    isOpen: false,
    type: 'add_success'
  });

  const handleEditClick = (student: Student) => {
    setEditingStudent(student);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (student: Student) => {
    setFeedbackConfig({
      isOpen: true,
      type: 'delete_confirm',
      studentId: student.id
    });
  };

  const handleConfirmDelete = () => {
    if (feedbackConfig.studentId) {
      onDeleteStudent?.(feedbackConfig.studentId);
      setFeedbackConfig({
        isOpen: true,
        type: 'delete_success'
      });
    }
  };

  const handleSaveEdit = (updated: Student) => {
    onUpdateStudent?.(updated);
    setIsEditModalOpen(false);
    setFeedbackConfig({
      isOpen: true,
      type: 'edit_success'
    });
  };

  // Pagination Logic
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const totalPages = Math.ceil(students.length / pageSize);
  
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedStudents = students.slice(startIndex, startIndex + pageSize);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage, '...', totalPages);
      }
    }
    return pages;
  };

  // Reset to page 1 if current page is out of bounds (e.g. after filtering)
  React.useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [students.length, totalPages]);
  return (
    <>
      <div className="bg-white border border-[#eaecf0] rounded-xl shadow-[0px_1px_3px_0px_rgba(16,24,40,0.1)] overflow-hidden">
      {/* Table Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-[#eaecf0]">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-[#101828]">Student List</h2>
          <span className="px-2 py-0.5 bg-[#e5e7fb] text-[#070b5c] text-xs font-medium rounded-full">
            {students.length} student
          </span>
        </div>
        <button className="text-[#667085] hover:text-[#101828]">
          <MoreVertical size={20} />
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#f9fafb]">
              <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider text-xs border-b border-[#eaecf0] text-[#667085]">Student ID</th>
              <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider text-xs border-b border-[#eaecf0] text-[#667085]">Branch</th>
              <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider text-xs text-[#49505b] border-b border-[#eaecf0]">Current Semester</th>
              <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider text-xs border-b border-[#eaecf0] text-[#667085]">
                <div className="flex items-center gap-1">
                  YOP
                  <ChevronRight size={14} className="rotate-90" />
                </div>
              </th>
              <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider text-xs border-b border-[#eaecf0] text-right text-[#667085]">Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedStudents.map((student) => (
              <tr key={student.id} className="hover:bg-gray-50 transition-colors border-b border-[#eaecf0]">
                <td className="px-8 py-6 text-[15px] font-medium text-sm text-[#475467]">{student.studentId}</td>
                <td className="px-8 py-6 text-[15px] font-medium text-sm text-[#475467]">{student.branch}</td>
                <td className="px-8 py-6 text-[15px] font-medium text-sm text-[#475467]">{student.semester}</td>
                <td className="px-8 py-6 text-[15px] font-medium text-sm text-[#475467]">{student.yop}</td>
                <td className="px-8 py-6 text-[15px] font-medium text-sm text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button className="p-2 text-[#667085] hover:bg-gray-100 rounded-lg transition-colors">
                      <Eye size={18} />
                    </button>
                    <button 
                      onClick={() => handleDeleteClick(student)}
                      className="p-2 text-[#667085] hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                    <button 
                      onClick={() => handleEditClick(student)}
                      className="p-2 text-[#667085] hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Edit2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-6 py-4 border-t border-[#eaecf0]">
        <button 
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex items-center gap-2 px-3.5 py-2 bg-white border border-[#d0d5dd] rounded-lg text-sm font-semibold text-[#344054] hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
        >
          <ChevronLeft size={20} />
          Previous
        </button>
        
        <div className="flex items-center gap-0.5">
          {getPageNumbers().map((page, idx) => (
            <button
              key={idx}
              onClick={() => typeof page === 'number' && handlePageChange(page)}
              disabled={typeof page !== 'number'}
              className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                page === currentPage 
                  ? 'bg-[#f9fafb] text-[#1d2939]' 
                  : 'text-[#475467] hover:bg-gray-50'
              } ${typeof page !== 'number' ? 'cursor-default' : ''}`}
            >
              {page}
            </button>
          ))}
        </div>

        <button 
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex items-center gap-2 px-3.5 py-2 bg-white border border-[#d0d5dd] rounded-lg text-sm font-semibold text-[#344054] hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
        >
          Next
          <ChevronRight size={20} />
        </button>
      </div>
      </div>

      <EditStudentModal 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        student={editingStudent}
        onSave={handleSaveEdit}
      />

      <StudentFeedbackModal
        isOpen={feedbackConfig.isOpen}
        type={feedbackConfig.type}
        onClose={() => setFeedbackConfig(prev => ({ ...prev, isOpen: false }))}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
};
