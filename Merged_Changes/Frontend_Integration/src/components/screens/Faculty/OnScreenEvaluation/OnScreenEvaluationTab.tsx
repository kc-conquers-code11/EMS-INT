import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Lock, Unlock, Search, Filter } from 'lucide-react';
import { DualMarksEvaluationModal } from './DualMarksEvaluationModal';
import { MarksEvaluationModal } from './MarksEvaluationModal';

// Set this to 'SINGLE' or 'DUAL' to toggle the modal type
const evaluationMode: 'SINGLE' | 'DUAL' = 'DUAL';

interface EvaluationRecord {
  id: string;
  courseTitle: string;
  courseCode: string;
  semester: number;
  noOfStudents: number;
  status: 'Pending' | 'Complete';
}

interface StudentEvaluationRecord {
  id: string;
  seatNo: string;
  studentName: string;
  semester: number;
  courseCode?: string;
  courseTitle?: string;
}

const initialMockData: EvaluationRecord[] = [
  { id: '1', courseTitle: 'Operating System', courseCode: 'CO1919', semester: 8, noOfStudents: 120, status: 'Pending' },
  { id: '2', courseTitle: 'Networking', courseCode: 'CO1918', semester: 7, noOfStudents: 120, status: 'Complete' },
  { id: '3', courseTitle: 'Database Systems', courseCode: 'CO1920', semester: 8, noOfStudents: 70, status: 'Pending' },
  { id: '4', courseTitle: 'Machine Learning', courseCode: 'CO1921', semester: 8, noOfStudents: 60, status: 'Pending' },
  { id: '5', courseTitle: 'Data Structures', courseCode: 'CO1915', semester: 6, noOfStudents: 150, status: 'Complete' },
  { id: '6', courseTitle: 'Algorithms', courseCode: 'CO1916', semester: 6, noOfStudents: 150, status: 'Pending' },
];

const mockStudentsData: StudentEvaluationRecord[] = [
  { id: '1', seatNo: '499303', studentName: 'Abc', semester: 8 },
  { id: '2', seatNo: '499304', studentName: 'Xyz', semester: 7 },
  { id: '3', seatNo: '499305', studentName: 'Lmn', semester: 8 },
  { id: '4', seatNo: '499306', studentName: 'Pqr', semester: 8 },
  { id: '5', seatNo: '499307', studentName: 'Def', semester: 7 },
  { id: '6', seatNo: '499308', studentName: 'Ghi', semester: 8 },
];

export const OnScreenEvaluationTab: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [records] = useState<EvaluationRecord[]>(initialMockData);
  
  const [studentPage, setStudentPage] = useState(1);
  const [studentSearch, setStudentSearch] = useState('');

  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [evaluatingStudent, setEvaluatingStudent] = useState<StudentEvaluationRecord | null>(null);

  const PAGE_SIZE = 5;

  // Main table processing
  const filteredRecords = records.filter(r => 
    r.courseTitle.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.courseCode.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const totalPages = Math.max(1, Math.ceil(filteredRecords.length / PAGE_SIZE));
  const displayedRecords = filteredRecords.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  // Student table processing
  const filteredStudents = mockStudentsData.filter(s =>
    s.studentName.toLowerCase().includes(studentSearch.toLowerCase()) ||
    s.seatNo.includes(studentSearch)
  );
  const studentTotalPages = Math.max(1, Math.ceil(filteredStudents.length / PAGE_SIZE));
  const studentDisplayed = filteredStudents.slice((studentPage - 1) * PAGE_SIZE, studentPage * PAGE_SIZE);

  if (selectedCourseId) {
    const selectedRecord = records.find(r => r.id === selectedCourseId);
    return (
      <div className="flex flex-col gap-4">
        {/* Filters */}
        <div className="flex items-center justify-end gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#667085]" size={16} />
            <input 
              type="text"
              placeholder="Search"
              value={studentSearch}
              onChange={(e) => { setStudentSearch(e.target.value); setStudentPage(1); }}
              className="pl-9 pr-4 py-2 bg-white border border-[#d0d5dd] rounded-lg text-sm outline-none focus:border-[#0e1680] focus:ring-1 focus:ring-[#0e1680] w-[240px]"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-[#d0d5dd] rounded-lg text-sm text-[#344054] hover:bg-gray-50 transition-colors">
            Semester <Filter size={16} />
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-[#d0d5dd] rounded-lg text-sm text-[#344054] hover:bg-gray-50 transition-colors">
            Year <Filter size={16} />
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-[#d0d5dd] rounded-lg text-sm text-[#344054] hover:bg-gray-50 transition-colors">
            Status <Filter size={16} />
          </button>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex justify-end">
            <p className="text-[13px] font-medium text-[#475467]">File Format : .pdf & .excel</p>
          </div>
          
          <div className="bg-white border border-[#eaecf0] rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#f9fafb]">
                    <th className="px-6 py-4 text-[12px] font-bold text-[#667085] uppercase tracking-wider border-b border-[#eaecf0] text-center">Sr no.</th>
                    <th className="px-6 py-4 text-[12px] font-bold text-[#667085] uppercase tracking-wider border-b border-[#eaecf0] text-center">Seat No</th>
                    <th className="px-6 py-4 text-[12px] font-bold text-[#667085] uppercase tracking-wider border-b border-[#eaecf0] text-center">Student Name</th>
                    <th className="px-6 py-4 text-[12px] font-bold text-[#667085] uppercase tracking-wider border-b border-[#eaecf0] text-center">Semester</th>
                    <th className="px-6 py-4 text-[12px] font-bold text-[#667085] uppercase tracking-wider border-b border-[#eaecf0] text-center">Evaluation of Marks</th>
                  </tr>
                </thead>
                <tbody>
                  {studentDisplayed.map((record, index) => (
                    <tr key={record.id} className="hover:bg-gray-50 transition-colors border-b border-[#eaecf0]">
                      <td className="px-6 py-4 text-[14px] text-[#475467] font-medium text-center">{(studentPage - 1) * PAGE_SIZE + index + 1}</td>
                      <td className="px-6 py-4 text-[14px] text-[#475467] font-medium text-center">{record.seatNo}</td>
                      <td className="px-6 py-4 text-[14px] text-[#475467] font-medium text-center">{record.studentName}</td>
                      <td className="px-6 py-4 text-[14px] text-[#0E1680] font-medium text-center">{record.semester}</td>
                      <td className="px-6 py-4 flex items-center justify-center">
                        <button 
                          onClick={() => setEvaluatingStudent({
                            ...record, 
                            courseCode: selectedRecord?.courseCode, 
                            courseTitle: selectedRecord?.courseTitle
                          })}
                          className="w-[140px] px-4 py-2 bg-[#0E1680] text-white text-[13px] font-medium rounded-lg hover:bg-[#0E1680]/90 transition-colors shadow-sm text-center"
                        >
                          Evaluate Marks
                        </button>
                      </td>
                    </tr>
                  ))}
                  {studentDisplayed.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-[#667085] font-medium">
                        No records found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-[#eaecf0]">
              <div className="flex gap-2">
                <button 
                  onClick={() => setSelectedCourseId(null)}
                  className="flex items-center gap-2 px-3.5 py-2 bg-white border border-[#d0d5dd] rounded-lg text-sm font-semibold text-[#344054] hover:bg-gray-50 transition-colors shadow-sm"
                >
                  Back to Courses
                </button>
                <button 
                  onClick={() => setStudentPage(p => Math.max(1, p - 1))}
                  disabled={studentPage === 1}
                  className="flex items-center gap-2 px-3.5 py-2 bg-white border border-[#d0d5dd] rounded-lg text-sm font-semibold text-[#344054] hover:bg-gray-50 transition-colors shadow-sm disabled:opacity-50"
                >
                  <ChevronLeft size={20} />
                  Previous
                </button>
              </div>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: studentTotalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setStudentPage(page)}
                    className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                      page === studentPage 
                        ? 'bg-[#f9fafb] text-[#1d2939]' 
                        : 'text-[#475467] hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button 
                onClick={() => setStudentPage(p => Math.min(studentTotalPages, p + 1))}
                disabled={studentPage >= studentTotalPages}
                className="flex items-center gap-2 px-3.5 py-2 bg-white border border-[#d0d5dd] rounded-lg text-sm font-semibold text-[#344054] hover:bg-gray-50 transition-colors shadow-sm disabled:opacity-50"
              >
                Next
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>

        {evaluatingStudent && (
          evaluationMode === 'DUAL' ? (
            <DualMarksEvaluationModal
              isOpen={true}
              onClose={() => setEvaluatingStudent(null)}
              seatNo={evaluatingStudent.seatNo}
              studentName={evaluatingStudent.studentName}
              courseCode={evaluatingStudent.courseCode || ''}
              courseTitle={evaluatingStudent.courseTitle || ''}
            />
          ) : (
            <MarksEvaluationModal
              isOpen={true}
              onClose={() => setEvaluatingStudent(null)}
              seatNo={evaluatingStudent.seatNo}
              studentName={evaluatingStudent.studentName}
              courseCode={evaluatingStudent.courseCode || ''}
              courseTitle={evaluatingStudent.courseTitle || ''}
            />
          )
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-end gap-3 mt-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#667085]" size={16} />
          <input 
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="pl-9 pr-4 py-2 bg-white border border-[#d0d5dd] rounded-lg text-sm outline-none focus:border-[#0e1680] focus:ring-1 focus:ring-[#0e1680] w-[240px]"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-[#d0d5dd] rounded-lg text-sm text-[#344054] hover:bg-gray-50 transition-colors">
          Semester <Filter size={16} />
        </button>
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-[#d0d5dd] rounded-lg text-sm text-[#344054] hover:bg-gray-50 transition-colors">
          Year <Filter size={16} />
        </button>
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-[#d0d5dd] rounded-lg text-sm text-[#344054] hover:bg-gray-50 transition-colors">
          Status <Filter size={16} />
        </button>
      </div>
      
      <div className="bg-white border border-[#eaecf0] rounded-xl overflow-hidden shadow-sm mt-2">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f9fafb]">
                <th className="px-6 py-4 text-[12px] font-bold text-[#667085] uppercase tracking-wider border-b border-[#eaecf0]">Sr no.</th>
                <th className="px-6 py-4 text-[12px] font-bold text-[#667085] uppercase tracking-wider border-b border-[#eaecf0]">Course Title</th>
                <th className="px-6 py-4 text-[12px] font-bold text-[#667085] uppercase tracking-wider border-b border-[#eaecf0]">Course Code</th>
                <th className="px-6 py-4 text-[12px] font-bold text-[#667085] uppercase tracking-wider border-b border-[#eaecf0] text-center">Semester</th>
                <th className="px-6 py-4 text-[12px] font-bold text-[#667085] uppercase tracking-wider border-b border-[#eaecf0] text-center">No of Students</th>
                <th className="px-6 py-4 text-[12px] font-bold text-[#667085] uppercase tracking-wider border-b border-[#eaecf0] text-center">Status</th>
                <th className="px-6 py-4 text-[12px] font-bold text-[#667085] uppercase tracking-wider border-b border-[#eaecf0] text-center">Action</th>
                <th className="px-6 py-4 text-[12px] font-bold text-[#667085] uppercase tracking-wider border-b border-[#eaecf0] text-center">Evaluation</th>
              </tr>
            </thead>
            <tbody>
              {displayedRecords.map((record, index) => (
                <tr key={record.id} className="hover:bg-gray-50 transition-colors border-b border-[#eaecf0]">
                  <td className="px-6 py-4 text-[14px] text-[#475467] font-medium">{(currentPage - 1) * PAGE_SIZE + index + 1}</td>
                  <td className="px-6 py-4 text-[14px] text-[#475467] font-medium">{record.courseTitle}</td>
                  <td className="px-6 py-4 text-[14px] text-[#0E1680] font-medium">{record.courseCode}</td>
                  <td className="px-6 py-4 text-[14px] text-[#475467] font-medium text-center">{record.semester}</td>
                  <td className="px-6 py-4 text-[14px] text-[#475467] font-medium text-center">{record.noOfStudents}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[12px] font-semibold ${
                      record.status === 'Pending' 
                        ? 'bg-[#FFEDD5] text-[#C2410C]' 
                        : 'bg-[#DCFCE7] text-[#15803D]'
                    }`}>
                      {record.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {record.status === 'Pending' ? (
                      <Lock size={18} className="mx-auto text-[#d0d5dd]" />
                    ) : (
                      <Unlock size={18} className="mx-auto text-[#667085]" />
                    )}
                  </td>
                  <td className="px-6 py-4 flex items-center justify-center">
                    {record.status === 'Pending' ? (
                      <button 
                        onClick={() => setSelectedCourseId(record.id)}
                        className="w-[120px] px-4 py-2 bg-[#0E1680] text-white text-[13px] font-medium rounded-lg hover:bg-[#0E1680]/90 transition-colors shadow-sm"
                      >
                        Evaluate
                      </button>
                    ) : (
                      <button 
                        onClick={() => setSelectedCourseId(record.id)}
                        className="w-[120px] px-4 py-2 bg-[#A5B4FC] text-white text-[13px] font-medium rounded-lg hover:bg-[#A5B4FC]/90 transition-colors shadow-sm"
                      >
                        Evaluate
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {displayedRecords.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-[#667085] font-medium">
                    No records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[#eaecf0]">
          <button 
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="flex items-center gap-2 px-3.5 py-2 bg-white border border-[#d0d5dd] rounded-lg text-sm font-semibold text-[#344054] hover:bg-gray-50 transition-colors shadow-sm disabled:opacity-50"
          >
            <ChevronLeft size={20} />
            Previous
          </button>
          
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                  page === currentPage 
                    ? 'bg-[#f9fafb] text-[#1d2939]' 
                    : 'text-[#475467] hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}
          </div>

          <button 
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage >= totalPages}
            className="flex items-center gap-2 px-3.5 py-2 bg-white border border-[#d0d5dd] rounded-lg text-sm font-semibold text-[#344054] hover:bg-gray-50 transition-colors shadow-sm disabled:opacity-50"
          >
            Next
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};
