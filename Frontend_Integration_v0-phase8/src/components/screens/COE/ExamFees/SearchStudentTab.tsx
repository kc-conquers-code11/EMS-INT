import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { RefreshCw, ArrowLeft, ArrowRight } from 'lucide-react';
import { searchStudentSchema } from '../../../../schemas/COE/examFeesSchema';
import type { SearchStudentFormData } from '../../../../schemas/COE/examFeesSchema';
import type { StudentFeeMapping } from '../../../../types/COE/ExamFees/examFees';
import toast from 'react-hot-toast';

// Seed data matching exactly the screenshot details
const INITIAL_STUDENT_FEES: StudentFeeMapping[] = [
  { id: '1', enrollmentId: 'vu4s2425001', studentName: 'xyz', semester: '6', branch: 'IT', scheme: 'R-2019', examType: 'Regular+ Backlog', amount: 2100, paidAmount: 2100, academicYear: '2025-26', status: 'Pending Verification' },
];

export const SearchStudentTab: React.FC = () => {
  const [students] = useState<StudentFeeMapping[]>(INITIAL_STUDENT_FEES);
  const [filteredStudents, setFilteredStudents] = useState<StudentFeeMapping[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 10;

  const renderPaginationNumbers = () => {
    const pages: (number | string)[] = [1, 2, 3, '...', 8, 9, 10];
    return pages.map((page, i) => {
      if (page === '...') {
        return (
          <span key={`dots-${i}`} className="w-10 h-10 flex items-center justify-center text-[14px] text-[#667085]">
            ...
          </span>
        );
      }
      return (
        <button
          key={page}
          type="button"
          onClick={() => setCurrentPage(page as number)}
          className={`w-10 h-10 flex items-center justify-center rounded-lg text-[14px] font-semibold transition-colors cursor-pointer ${
            currentPage === page
              ? 'bg-[#f0f1fd] text-[#0b0f4d] font-bold'
              : 'text-[#475467] hover:bg-gray-50'
          }`}
        >
          {page}
        </button>
      );
    });
  };

  const { register, handleSubmit, formState: { errors } } = useForm<SearchStudentFormData>({
    resolver: zodResolver(searchStudentSchema),
    defaultValues: {
      enrollmentId: 'vu4s2425001',
      studentName: 'xyz',
      semester: '6',
      branch: 'IT',
      scheme: 'R-2019',
      examType: 'Regular + Backlog',
      academicYear: '2025-26',
    }
  });

  const onSearchSubmit = (data: SearchStudentFormData) => {
    setIsSearching(true);
    setHasSearched(true);
    
    setTimeout(() => {
      // Simulate mapping/searching based on inputted data
      const results = students.filter(s => {
        const matchesEnrollment = !data.enrollmentId || s.enrollmentId.toLowerCase().includes(data.enrollmentId.toLowerCase().trim());
        const matchesName = data.studentName === 'xyz' || !data.studentName || s.studentName.toLowerCase().includes(data.studentName.toLowerCase().trim());
        const matchesAcademicYear = s.academicYear === data.academicYear;
        return matchesEnrollment && matchesName && matchesAcademicYear;
      });

      setFilteredStudents(results);
      setIsSearching(false);
      toast.success('Search completed successfully!');
    }, 500);
  };

  return (
    <div className="flex flex-col gap-8 w-full font-['Instrument_Sans']">
      
      {/* ── Search Form (EXACT alignment with Figma) ── */}
      <form onSubmit={handleSubmit(onSearchSubmit)} className="bg-white border border-[#e4e7ec] rounded-2xl p-8 shadow-xs flex flex-col gap-5">
        
        {/* 1. Enrollment No */}
        <div className="flex flex-col gap-1.5 w-full">
          <label className="text-[14px] font-semibold text-[#344054]">Enrollment No</label>
          <input
            type="text"
            {...register('enrollmentId')}
            className={`w-full px-3.5 py-3 bg-white border ${errors.enrollmentId ? 'border-red-500' : 'border-[#d0d5dd]'} rounded-lg text-[14px] text-[#101828] placeholder-[#98a2b3] focus:outline-none focus:ring-4 focus:ring-[#0e1680]/5 focus:border-[#0e1680] shadow-xs transition-all`}
          />
          {errors.enrollmentId && <span className="text-xs text-red-500">{errors.enrollmentId.message}</span>}
        </div>

        {/* 2. Student Name */}
        <div className="flex flex-col gap-1.5 w-full">
          <label className="text-[14px] font-semibold text-[#344054]">Student Name</label>
          <input
            type="text"
            {...register('studentName')}
            className="w-full px-3.5 py-3 bg-white border border-[#d0d5dd] rounded-lg text-[14px] text-[#101828] placeholder-[#98a2b3] focus:outline-none focus:ring-4 focus:ring-[#0e1680]/5 focus:border-[#0e1680] shadow-xs transition-all"
          />
        </div>

        {/* 3. Semester & Branch (Side-by-side row) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          {/* Semester */}
          <div className="flex flex-col gap-1.5 w-full">
            <label className="text-[14px] font-semibold text-[#344054]">Semester</label>
            <div className="relative">
              <select
                {...register('semester')}
                className="w-full pl-3.5 pr-10 py-3 bg-white border border-[#d0d5dd] rounded-lg text-[14px] text-[#101828] appearance-none focus:outline-none focus:ring-4 focus:ring-[#0e1680]/5 focus:border-[#0e1680] shadow-xs transition-all cursor-pointer"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                  <option key={sem} value={sem.toString()}>{sem}</option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#667085]">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </div>
            </div>
          </div>

          {/* Branch */}
          <div className="flex flex-col gap-1.5 w-full">
            <label className="text-[14px] font-semibold text-[#344054]">Branch</label>
            <input
              type="text"
              {...register('branch')}
              className="w-full px-3.5 py-3 bg-white border border-[#d0d5dd] rounded-lg text-[14px] text-[#101828] placeholder-[#98a2b3] focus:outline-none focus:ring-4 focus:ring-[#0e1680]/5 focus:border-[#0e1680] shadow-xs transition-all"
            />
          </div>
        </div>

        {/* 4. Scheme */}
        <div className="flex flex-col gap-1.5 w-full">
          <label className="text-[14px] font-semibold text-[#344054]">Scheme</label>
          <input
            type="text"
            {...register('scheme')}
            className="w-full px-3.5 py-3 bg-white border border-[#d0d5dd] rounded-lg text-[14px] text-[#101828] placeholder-[#98a2b3] focus:outline-none focus:ring-4 focus:ring-[#0e1680]/5 focus:border-[#0e1680] shadow-xs transition-all"
          />
        </div>

        {/* 5. Exam type */}
        <div className="flex flex-col gap-1.5 w-full">
          <label className="text-[14px] font-semibold text-[#344054]">Exam type</label>
          <div className="relative">
            <select
              {...register('examType')}
              className="w-full pl-3.5 pr-10 py-3 bg-white border border-[#d0d5dd] rounded-lg text-[14px] text-[#101828] appearance-none focus:outline-none focus:ring-4 focus:ring-[#0e1680]/5 focus:border-[#0e1680] shadow-xs transition-all cursor-pointer"
            >
              <option value="Regular + Backlog">Regular + Backlog</option>
              <option value="Regular">Regular</option>
              <option value="Backlog">Backlog</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#667085]">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </div>
          </div>
        </div>

        {/* 6. Academic year */}
        <div className="flex flex-col gap-1.5 w-full">
          <label className="text-[14px] font-semibold text-[#344054]">Academic year</label>
          <div className="relative">
            <select
              {...register('academicYear')}
              className="w-full pl-3.5 pr-10 py-3 bg-white border border-[#d0d5dd] rounded-lg text-[14px] text-[#101828] appearance-none focus:outline-none focus:ring-4 focus:ring-[#0e1680]/5 focus:border-[#0e1680] shadow-xs transition-all cursor-pointer"
            >
              <option value="2025-26">2025-26</option>
              <option value="2024-25">2024-25</option>
              <option value="2023-24">2023-24</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#667085]">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </div>
          </div>
        </div>

        {/* Submit button on bottom right */}
        <div className="flex justify-end mt-4">
          <button
            type="submit"
            disabled={isSearching}
            className="flex items-center gap-2 px-8 py-3 bg-[#0b0f4d] hover:bg-blue-900 text-white text-[14px] font-semibold rounded-lg focus:ring-4 focus:ring-[#0b0f4d]/20 active:bg-blue-950 transition-all shadow-sm disabled:bg-gray-300 disabled:cursor-not-allowed cursor-pointer"
          >
            {isSearching ? <RefreshCw className="animate-spin" size={16} /> : null}
            <span>Search</span>
          </button>
        </div>
      </form>

      {/* ── Search Results List / Table (EXACT layout matching Figma) ── */}
      {hasSearched && (
        <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
          {/* Section title */}
          <h3 className="text-[18px] font-semibold text-[#101828] tracking-tight">
            Searched result
          </h3>

          <div className="bg-white border border-[#e4e7ec] rounded-2xl overflow-hidden shadow-xs">
            {isSearching ? (
              <div className="p-12 flex flex-col items-center justify-center gap-3">
                <RefreshCw className="animate-spin text-[#0b0f4d]" size={36} />
                <span className="text-[#667085] text-sm font-medium">Fetching results...</span>
              </div>
            ) : (
              <div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#f9fafb] border-b border-[#e4e7ec] h-[44px]">
                        <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider w-[150px] text-[#667085]">Enrollment No</th>
                        <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider w-[220px] text-[#667085]">Student name</th>
                        <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider w-[120px] text-[#667085]">Semester</th>
                        <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider w-[200px] text-[#667085]">Exam Type</th>
                        <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider w-[180px] text-[#667085]">Total fees</th>
                        <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider w-[180px] text-[#667085]">Paid Amount</th>
                        <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider text-right w-[200px] text-[#667085]">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f2f4f7]">
                      {filteredStudents.map(student => (
                        <tr key={student.id} className="h-[72px] hover:bg-gray-50/50 transition-colors">
                          <td className="px-8 py-6 text-[15px] font-medium">
                            <span className="text-[14px] text-[#475467] font-mono">{student.enrollmentId}</span>
                          </td>
                          <td className="px-8 py-6 text-[15px] font-medium">
                            <span className="text-[14px] font-semibold text-[#101828]">{student.studentName}</span>
                          </td>
                          <td className="px-8 py-6 text-[15px] font-medium">
                            <span className="text-[14px] text-[#475467]">Sem {student.semester}</span>
                          </td>
                          <td className="px-8 py-6 text-[15px] font-medium">
                            <span className="text-[14px] text-[#475467]">{student.examType}</span>
                          </td>
                          <td className="px-8 py-6 text-[15px] font-medium">
                            <span className="text-[14px] font-semibold text-[#101828]">{student.amount}</span>
                          </td>
                          <td className="px-8 py-6 text-[15px] font-medium">
                            <span className="text-[14px] font-semibold text-[#101828]">{student.paidAmount}</span>
                          </td>
                          <td className="px-8 py-6 text-[15px] font-medium text-right">
                            <span className="text-[14px] font-semibold text-[#12b76a]">
                              Fees confirmed
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* ── Pagination row (EXACT alignment with Figma) ── */}
                <div className="h-[68px] border-t border-[#e4e7ec] px-6 flex items-center justify-between bg-white select-none">
                  {/* Previous button */}
                  <button
                    type="button"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="flex items-center gap-2 px-4 py-2 border border-[#d0d5dd] rounded-lg text-[14px] font-semibold text-[#344054] hover:bg-gray-50 transition-all shadow-xs disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <ArrowLeft size={16} />
                    <span>Previous</span>
                  </button>

                  {/* Page numbers */}
                  <div className="flex items-center gap-1">
                    {renderPaginationNumbers()}
                  </div>

                  {/* Next button */}
                  <button
                    type="button"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-2 px-4 py-2 border border-[#d0d5dd] rounded-lg text-[14px] font-semibold text-[#344054] hover:bg-gray-50 transition-all shadow-xs disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <span>Next</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
