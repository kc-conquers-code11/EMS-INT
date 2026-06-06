import * as React from 'react';
import { Calendar, Users, GraduationCap, Search, Filter, Eye, Trash2, Pencil, Plus, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';

interface StatCardProps {
  icon: React.ReactNode;
  value: string;
  label: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, value, label }) => (
  <div className="flex-1 bg-[#f2f4fd] p-6 rounded-xl flex flex-col items-center gap-2">
    <div className="text-[#0e1680]">{icon}</div>
    <span className="text-[24px] font-bold text-[#101828]">{value}</span>
    <span className="text-sm text-[#667085] text-center">{label}</span>
  </div>
);

import { RescheduleModal, SuccessModal, ExamEventViewModal, ExamEventEditModal, ExamEventDeleteModal } from '../../../modals/Exam/ExamModals';

interface ExamEntry {
  id: number;
  title: string;
  code: string;
  date: string;
  time: string;
  students: number;
  status: 'pending' | 'scheduled';
  branch: string;
  semester: string;
  examType: string;
}

const DUMMY_EXAMS: ExamEntry[] = [
  { id: 1, title: 'FCOM', code: 'CO1919', date: '10-05-2025', time: '10:00 - 11:00', students: 170, status: 'pending', branch: 'Information Technology', semester: '2nd', examType: 'Internal Assessment 1' },
  { id: 2, title: 'ADMT', code: 'CO1920', date: '13-05-2025', time: '2:00 - 3:00', students: 200, status: 'scheduled', branch: 'Information Technology', semester: '2nd', examType: 'Internal Assessment 1' },
  { id: 3, title: 'CNN', code: 'CO1911', date: '12-05-2025', time: '10:00 - 11:00', students: 150, status: 'scheduled', branch: 'Information Technology', semester: '2nd', examType: 'Internal Assessment 1' },
  { id: 4, title: 'Web X', code: 'CO2900', date: '10-05-2025', time: '10:00 - 11:00', students: 150, status: 'pending', branch: 'Information Technology', semester: '2nd', examType: 'Internal Assessment 1' },
];

export const AddExamEvent: React.FC = () => {
  const [isRescheduleOpen, setIsRescheduleOpen] = React.useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = React.useState(false);
  const [isViewOpen, setIsViewOpen] = React.useState(false);
  const [isEditOpen, setIsEditOpen] = React.useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);
  const [successMessage, setSuccessMessage] = React.useState("");
  const [selectedExam, setSelectedExam] = React.useState<ExamEntry | null>(null);
  const [viewExam, setViewExam] = React.useState<ExamEntry | null>(null);
  const [editExam, setEditExam] = React.useState<ExamEntry | null>(null);
  const [deleteExam, setDeleteExam] = React.useState<ExamEntry | null>(null);

  const [addedExams, setAddedExams] = React.useState<ExamEntry[]>(DUMMY_EXAMS);
  const [newExams, setNewExams] = React.useState([{
    date: '',
    time: '',
    title: '',
    code: ''
  }]);
  const [collisionError, setCollisionError] = React.useState('');

  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCourseTitle, setSelectedCourseTitle] = React.useState('');
  const [selectedCourseCode, setSelectedCourseCode] = React.useState('');
  const [selectedDate, setSelectedDate] = React.useState('');
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 5;

  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCourseTitle, selectedCourseCode, selectedDate, addedExams]);

  const filteredExams = addedExams.filter(exam => {
    const matchesSearch = searchQuery === '' || 
      exam.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      exam.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTitle = selectedCourseTitle === '' || exam.title === selectedCourseTitle;
    const matchesCode = selectedCourseCode === '' || exam.code === selectedCourseCode;
    const matchesDate = selectedDate === '' || exam.date === selectedDate;
    return matchesSearch && matchesTitle && matchesCode && matchesDate;
  });

  const totalPages = Math.ceil(filteredExams.length / itemsPerPage);
  const paginatedExams = filteredExams.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getPageNumbers = () => {
    if (totalPages === 0) return [];
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (currentPage <= 4) return [1, 2, 3, 4, 5, '...', totalPages];
    if (currentPage >= totalPages - 3) return [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
  };

  const pages = getPageNumbers();
  const isEmpty = paginatedExams.length === 0;

  const courseTitles = Array.from(new Set(addedExams.map(e => e.title).filter(Boolean)));
  const courseCodes = Array.from(new Set(addedExams.map(e => e.code).filter(Boolean)));
  const dates = Array.from(new Set(addedExams.map(e => e.date).filter(Boolean)));

  const handleAddField = () => {
    setNewExams([...newExams, { date: '', time: '', title: '', code: '' }]);
  };

  const handleFieldChange = (index: number, field: string, value: string) => {
    const updated = [...newExams];
    updated[index] = { ...updated[index], [field]: value };
    setNewExams(updated);
    setCollisionError('');
  };

  const handleAddAllExams = () => {
    let hasError = false;
    for (const exam of newExams) {
      if (!exam.date || !exam.time || !exam.title || !exam.code) {
        setCollisionError('Please fill all fields for all exams');
        hasError = true;
        break;
      }
      const isCollision = addedExams.some(
        (e) => e.date === toDisplayDate(exam.date) && e.time === exam.time
      );
      if (isCollision) {
        setCollisionError(`An exam is already scheduled on ${exam.date} at ${exam.time}.`);
        hasError = true;
        break;
      }
    }

    if (hasError) return;

    let nextId = addedExams.length > 0 ? Math.max(...addedExams.map(e => e.id)) + 1 : 1;
    const newEntries: ExamEntry[] = newExams.map(exam => ({
      id: nextId++,
      title: exam.title,
      code: exam.code,
      date: toDisplayDate(exam.date),
      time: exam.time,
      students: 0,
      status: 'pending',
      branch: 'Information Technology',
      semester: '2nd',
      examType: 'Internal Assessment 1'
    }));

    setAddedExams([...addedExams, ...newEntries]);
    setNewExams([{ date: '', time: '', title: '', code: '' }]);
    setCollisionError('');
    handleAddAllSuccess();
  };

  const toDisplayDate = (ymd: string): string => {
    if (!ymd) return '';
    const parts = ymd.split('-');
    if (parts.length !== 3) return ymd;
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  };

  const handleRescheduleClick = (exam: ExamEntry) => {
    setSelectedExam(exam);
    setIsRescheduleOpen(true);
  };

  const handleViewClick = (exam: ExamEntry) => {
    setViewExam(exam);
    setIsViewOpen(true);
  };

  const handleEditClick = (exam: ExamEntry) => {
    setEditExam(exam);
    setIsEditOpen(true);
  };

  const handleEditSuccess = () => {
    setSuccessMessage("Exam Event Scheduled & Notified successfully!");
    setIsSuccessOpen(true);
  };

  const handleDeleteClick = (exam: ExamEntry) => {
    setDeleteExam(exam);
    setIsDeleteOpen(true);
  };


  const handleDeleteSuccess = () => {
    if (deleteExam) {
      setAddedExams(addedExams.filter(e => e.id !== deleteExam.id));
    }
  };

  const handleRescheduleSuccess = () => {
    setIsRescheduleOpen(false);
    setSuccessMessage("Exam Event Rescheduled & Notified successfully!");
    setIsSuccessOpen(true);
  };

  const handleAddAllSuccess = () => {
    setSuccessMessage("Exams Added successfully!");
    setIsSuccessOpen(true);
  };

  const labelClass = "block text-sm font-medium text-[#344054] mb-1.5";
  const inputClass = "w-full px-3.5 py-2.5 bg-white border border-[#d0d5dd] rounded-lg text-sm text-[#101828] placeholder-[#687b96] focus:outline-none focus:ring-2 focus:ring-[#0e1680] shadow-sm";

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-500">
      {/* Stats Cards */}
      <div className="flex gap-5 w-full">
        <StatCard icon={<Calendar size={28} />} value="165" label="Total Exam Events" />
        <StatCard icon={<Users size={28} />} value="32" label="Active Exam Event" />
        <StatCard icon={<GraduationCap size={28} />} value="122" label="Total exam Conducted" />
        <StatCard icon={<GraduationCap size={28} />} value="50" label="Pending Exam Events" />
      </div>

      {/* Main Form Section */}
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-2 gap-5">
          <div>
            <label className={labelClass}>Select Branch</label>
            <select className={inputClass} defaultValue="Information Technology">
              <option>Information Technology</option>
              <option>Computer Science</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Select Semester</label>
            <select className={inputClass} defaultValue="2nd">
              <option>1st</option>
              <option>2nd</option>
              <option>3rd</option>
            </select>
          </div>
        </div>

        {/* Add Exams Box */}
        <div className="flex flex-col gap-3">
          <div className="bg-[#f2f4fd] p-6 rounded-xl border border-[#e5e7fb] flex flex-col gap-4">
            <h4 className="text-sm font-semibold text-[#344054]">Add Exams</h4>

          <div className="flex flex-col gap-4">
            {newExams.map((exam, index) => (
              <div key={index} className="grid grid-cols-2 gap-4 relative">
                <input
                  type="date"
                  className={inputClass}
                  value={exam.date}
                  onChange={(e) => handleFieldChange(index, 'date', e.target.value)}
                />
                <select
                  className={inputClass}
                  value={exam.time}
                  onChange={(e) => handleFieldChange(index, 'time', e.target.value)}
                >
                  <option value="" disabled>Select Time Slot</option>
                  <option>10:00 - 11:00</option>
                  <option>2:00 - 3:00</option>
                </select>
                <select
                  className={inputClass}
                  value={exam.title}
                  onChange={(e) => handleFieldChange(index, 'title', e.target.value)}
                >
                  <option value="" disabled>Select Course Title</option>
                  <option>FCOM</option>
                  <option>ADMT</option>
                </select>
                <select
                  className={inputClass}
                  value={exam.code}
                  onChange={(e) => handleFieldChange(index, 'code', e.target.value)}
                >
                  <option value="" disabled>Select Course Code</option>
                  <option>CO1919</option>
                  <option>CO1920</option>
                </select>
              </div>
            ))}
          </div>

          {collisionError && (
            <p className="text-xs font-semibold text-red-500 mt-1">{collisionError}</p>
          )}
          </div>
          
          <div className="flex justify-end">
            <button
              onClick={handleAddField}
              className="w-8 h-8 bg-white border border-[#d0d5dd] rounded-full flex items-center justify-center text-[#687b96] shadow-sm hover:bg-gray-50 transition-colors"
            >
              <Plus size={18} />
            </button>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleAddAllExams}
            className="px-6 py-2.5 bg-[#0e1680] text-white text-sm font-semibold rounded-lg hover:bg-blue-900 transition-all shadow-md"
          >
            Add All Exams
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="flex flex-col gap-4 mt-4">
        <div className="flex justify-end gap-3 flex-wrap">
          <div className="relative w-[240px]">
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-3 pr-8 py-2 bg-white border border-[#d0d5dd] rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#0e1680] shadow-sm"
            />
            <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none">
              <Search size={16} className="text-[#687b96]" />
            </div>
          </div>
          
          <div className="relative flex items-center">
            <select
              value={selectedCourseTitle}
              onChange={(e) => setSelectedCourseTitle(e.target.value)}
              className="appearance-none bg-white border border-[#d0d5dd] rounded-lg px-3 py-2 pr-8 text-sm font-semibold text-[#344054] hover:bg-gray-50 shadow-sm transition-colors cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#0e1680]"
            >
              <option value="">Course Title</option>
              {courseTitles.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <Filter size={14} className="absolute right-2.5 text-[#344054] pointer-events-none" />
          </div>

          <div className="relative flex items-center">
            <select
              value={selectedCourseCode}
              onChange={(e) => setSelectedCourseCode(e.target.value)}
              className="appearance-none bg-white border border-[#d0d5dd] rounded-lg px-3 py-2 pr-8 text-sm font-semibold text-[#344054] hover:bg-gray-50 shadow-sm transition-colors cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#0e1680]"
            >
              <option value="">Course Code</option>
              {courseCodes.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <Filter size={14} className="absolute right-2.5 text-[#344054] pointer-events-none" />
          </div>

          <div className="relative flex items-center">
            <select
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="appearance-none bg-white border border-[#d0d5dd] rounded-lg px-3 py-2 pr-8 text-sm font-semibold text-[#344054] hover:bg-gray-50 shadow-sm transition-colors cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#0e1680]"
            >
              <option value="">Date</option>
              {dates.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            <Filter size={14} className="absolute right-2.5 text-[#344054] pointer-events-none" />
          </div>
        </div>

        <div className="bg-white border border-[#eaecf0] rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#f9fafb] border-b border-[#eaecf0]">
              <tr>
                <th className="px-4 py-3 text-[10px] font-medium text-[#475467] uppercase tracking-wider text-center">Course Title</th>
                <th className="px-4 py-3 text-[10px] font-medium text-[#475467] uppercase tracking-wider text-center">Course Code</th>
                <th className="px-4 py-3 text-[10px] font-medium text-[#475467] uppercase tracking-wider text-center">Date</th>
                <th className="px-4 py-3 text-[10px] font-medium text-[#475467] uppercase tracking-wider text-center">Time Slot</th>
                <th className="px-4 py-3 text-[10px] font-medium text-[#475467] uppercase tracking-wider text-center">Total Student</th>
                <th className="px-4 py-3 text-[10px] font-medium text-[#475467] uppercase tracking-wider text-center">Action</th>
                <th className="px-4 py-3 text-[10px] font-medium text-[#475467] uppercase tracking-wider text-center">Reschedule</th>
                <th className="px-4 py-3 text-[10px] font-medium text-[#475467] uppercase tracking-wider text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eaecf0]">
              {isEmpty ? (
                <tr>
                  <td colSpan={8} className="h-[200px] text-center">
                    <span className="text-[16px] font-medium text-[#98a2b3]">No Data Found</span>
                  </td>
                </tr>
              ) : (
                paginatedExams.map((exam) => (
                  <tr key={exam.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-4 whitespace-nowrap text-xs font-medium text-[#475467] text-center">{exam.title}</td>
                  <td className="px-4 py-4 text-sm text-[#475467] text-center">{exam.code}</td>
                  <td className="px-4 py-4 text-sm text-[#475467] text-center">{exam.date}</td>
                  <td className="px-4 py-4 text-sm text-[#475467] text-center">{exam.time}</td>
                  <td className="px-4 py-4 text-sm text-[#475467] text-center">{exam.students}</td>
                  <td className="px-4 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button onClick={() => handleViewClick(exam)} className="text-[#98a2b3] hover:text-[#0e1680] transition-colors" title="View Details"><Eye size={18} /></button>
                      <button onClick={() => handleDeleteClick(exam)} className="text-[#98a2b3] hover:text-[#d92d20] transition-colors" title="Delete Event"><Trash2 size={18} /></button>
                      <button onClick={() => handleEditClick(exam)} className="text-[#98a2b3] hover:text-[#0e1680] transition-colors" title="Edit & Schedule"><Pencil size={18} /></button>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <button
                      onClick={() => handleRescheduleClick(exam)}
                      className="text-[#0e1680] text-sm font-medium flex items-center gap-1 justify-center mx-auto hover:underline"
                    >
                      Reschedule
                      <ExternalLink size={14} />
                    </button>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${exam.status === 'scheduled' ? 'bg-[#effbe7] text-[#095512] border border-[#d3f1bf]' : 'bg-[#fff4f2] text-[#d92d20] border border-[#fecdca]'
                      }`}>
                      {exam.status === 'scheduled' ? '• scheduled' : '• pending'}
                    </span>
                  </td>
                </tr>
              ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Section */}
        <div className="px-6 py-4 flex items-center justify-between border-t border-[#eaecf0] bg-white rounded-b-xl border">
          <button
            type="button"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={isEmpty || currentPage === 1}
            className="flex items-center gap-2 px-4 py-2 border border-[#d0d5dd] rounded-lg text-sm font-semibold text-[#344054] hover:bg-gray-50 transition-colors shadow-sm disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white"
          >
            <ChevronLeft size={20} />
            Previous
          </button>

          <div className="flex items-center gap-2">
            {pages.map((page, i) => (
              <button
                key={i}
                type="button"
                onClick={() => typeof page === 'number' && setCurrentPage(page)}
                disabled={isEmpty || page === '...'}
                className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                  page === currentPage
                    ? 'bg-[#f9fafb] text-[#101828] font-semibold border border-[#eaecf0]'
                    : 'text-[#667085] hover:bg-gray-50'
                } disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent`}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={isEmpty || currentPage === totalPages}
            className="flex items-center gap-2 px-4 py-2 border border-[#d0d5dd] rounded-lg text-sm font-semibold text-[#344054] hover:bg-gray-50 transition-colors shadow-sm disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white"
          >
            Next
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <ExamEventViewModal
        isOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        exam={viewExam}
      />

      <ExamEventEditModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        exam={editExam}
        onSuccess={handleEditSuccess}
      />

      <ExamEventDeleteModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        exam={deleteExam}
        onSuccess={handleDeleteSuccess}
      />

      <RescheduleModal
        isOpen={isRescheduleOpen}
        onClose={() => setIsRescheduleOpen(false)}
        onSuccess={handleRescheduleSuccess}
        examData={selectedExam}
      />

      <SuccessModal
        isOpen={isSuccessOpen}
        onClose={() => setIsSuccessOpen(false)}
        message={successMessage}
      />
    </div>
  );
};
