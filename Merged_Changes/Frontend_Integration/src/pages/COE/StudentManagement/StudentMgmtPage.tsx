import React, { useState, useEffect } from 'react';
import { Search, Filter, Download } from 'lucide-react';
import { StudentTable } from '../../../components/screens/COE/StudentManagement/StudentTable';
import type { Student } from '../../../types/COE/student';
import { studentAPI } from '../../../services/api';

export const StudentMgmtPage: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    yop: '',
    semester: '',
    branch: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const fetchStudents = async () => {
    setIsLoading(true);
    try {
      const response = await studentAPI.getAll();
      if (response.data.success) {
        const fetchedStudents = Array.isArray(response.data.data) ? response.data.data : response.data.data.rows;
        const formattedStudents = (fetchedStudents || []).map((student: any) => ({
          id: student.student_id || student.id || student.sid,
          studentId: student.enrollment_number || student.prn || 'N/A', // Update these based on actual DB schema for student
          branch: student.branch_id || 'N/A', // Update as needed
          semester: student.current_semester || 'N/A',
          yop: student.year_of_passing || 'N/A',
          studentName: student.first_name ? `${student.first_name} ${student.last_name || ''}`.trim() : 'N/A',
        }));
        setStudents(formattedStudents);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleUpdateStudent = async (updatedStudent: Student) => {
    try {
      const payload = {
        enrollment_number: updatedStudent.studentId,
        year_of_passing: updatedStudent.yop,
        current_semester: updatedStudent.semester,
        // add other fields
      };
      const response = await studentAPI.update(updatedStudent.id, payload);
      if (response.data.success) {
        fetchStudents();
      }
    } catch (error) {
      console.error('Error updating student:', error);
      alert('Failed to update student');
    }
  };

  const handleDeleteStudent = async (id: string) => {
    try {
      const response = await studentAPI.delete(id);
      if (response.data.success) {
        fetchStudents();
      }
    } catch (error) {
      console.error('Error deleting student:', error);
      alert('Failed to delete student');
    }
  };

  const handleExportToExcel = () => {
    const headers = ['Student ID', 'Branch', 'Current Semester', 'Year of Passing'];
    const rows = filteredStudents.map(s => [s.studentId, s.branch, s.semester, s.yop]);
    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `students_export_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Get unique values for filters
  const uniqueYOPs = Array.from(new Set(students.map(s => s.yop))).sort();
  const uniqueSemesters = Array.from(new Set(students.map(s => s.semester))).sort();
  const uniqueBranches = Array.from(new Set(students.map(s => s.branch))).sort();

  // Filtering Logic
  const filteredStudents = students.filter(student => {
    const matchesSearch = student.studentId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesYOP = !filters.yop || student.yop === filters.yop;
    const matchesSemester = !filters.semester || student.semester === filters.semester;
    const matchesBranch = !filters.branch || student.branch === filters.branch;

    return matchesSearch && matchesYOP && matchesSemester && matchesBranch;
  });

  return (
    <div className="flex flex-col min-h-full font-sans p-6 pb-12">
      <div className="flex flex-col gap-8 mb-4 w-full">
        <div className="flex flex-col gap-[28px] items-start w-full">
          <h1 className="text-[28px] font-semibold text-[#171822] leading-[42px]">
            Student Management
          </h1>

          <div className="flex gap-[12px] items-start justify-end w-full">
            {/* Search */}
            <div className="relative w-[211px]">
              <input
                type="text"
                placeholder="Search Student ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-3.5 pr-10 py-2 bg-white border border-[#d0d5dd] rounded-lg text-base text-[#101828] placeholder-[#687b96] focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all"
              />
              <Search size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#687b96]" />
            </div>

            {/* YOP Filter */}
            <div className="relative">
              <select
                value={filters.yop}
                onChange={(e) => setFilters({ ...filters, yop: e.target.value })}
                className="pl-4 pr-10 py-2 bg-white border border-[#d0d5dd] rounded-lg text-sm font-semibold text-[#344054] hover:bg-gray-50 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer appearance-none"
              >
                <option value="">YOP</option>
                {uniqueYOPs.map(yop => <option key={yop} value={yop}>{yop}</option>)}
              </select>
              <Filter size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#344054] pointer-events-none" />
            </div>

            {/* Semester Filter */}
            <div className="relative">
              <select
                value={filters.semester}
                onChange={(e) => setFilters({ ...filters, semester: e.target.value })}
                className="pl-4 pr-10 py-2 bg-white border border-[#d0d5dd] rounded-lg text-sm font-semibold text-[#344054] hover:bg-gray-50 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer appearance-none"
              >
                <option value="">Current Semester</option>
                {uniqueSemesters.map(sem => <option key={sem} value={sem}>{sem}</option>)}
              </select>
              <Filter size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#344054] pointer-events-none" />
            </div>

            {/* Branch Filter */}
            <div className="relative">
              <select
                value={filters.branch}
                onChange={(e) => setFilters({ ...filters, branch: e.target.value })}
                className="pl-4 pr-10 py-2 bg-white border border-[#d0d5dd] rounded-lg text-sm font-semibold text-[#344054] hover:bg-gray-50 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer appearance-none"
              >
                <option value="">Branch</option>
                {uniqueBranches.map(branch => <option key={branch} value={branch}>{branch}</option>)}
              </select>
              <Filter size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#344054] pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Export Button */}
        <div className="flex justify-end w-full">
          <button
            onClick={handleExportToExcel}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#0e1680] text-white text-sm font-semibold rounded-lg hover:bg-blue-900 transition-colors shadow-sm"
          >
            <Download size={18} />
            <span>Export to Excel</span>
          </button>
        </div>
      </div>

      {/* Table Section */}
      <StudentTable
        students={filteredStudents}
        onUpdateStudent={handleUpdateStudent}
        onDeleteStudent={handleDeleteStudent}
      />
    </div>
  );
};
