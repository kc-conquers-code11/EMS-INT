//src/components/modals/Exam/ExamModals.tsx
import React from 'react';
import { X, Calendar, Pencil, Download } from 'lucide-react';
import { SuccessIcon, DeleteSuccessIcon } from '../../shared/ModalIcons';


/* --- ExamEventDeleteModal.tsx --- */


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

interface ExamEventDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  exam: ExamEntry | null;
  onSuccess?: () => void;
}

export const ExamEventDeleteModal: React.FC<ExamEventDeleteModalProps> = ({
  isOpen,
  onClose,
  exam,
  onSuccess,
}) => {
  const [deleted, setDeleted] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);

  /* Reset to confirm state each time the modal opens */
  React.useEffect(() => {
    if (isOpen) setDeleted(false);
  }, [isOpen]);

  if (!isOpen || !exam) return null;

  const handleDelete = async () => {
    setIsDeleting(true);
    await new Promise((r) => setTimeout(r, 500));
    setIsDeleting(false);
    setDeleted(true);
    onSuccess?.();
  };

  const handleDone = () => {
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(2, 5, 61, 0.45)', backdropFilter: 'blur(6px)' }}
      onClick={(e) => {
        if (e.target === e.currentTarget && !isDeleting) onClose();
      }}
    >
      <div
        className="bg-white w-full max-w-[320px] rounded-2xl shadow-2xl px-8 py-8 flex flex-col items-center text-center gap-5"
        style={{ animation: 'examDelModalIn 0.22s cubic-bezier(0.34,1.56,0.64,1) both' }}
      >
        {!deleted ? (
          /* ── Confirm state ── */
          <>
            {/* Circle warning icon */}
            <div className="w-14 h-14 rounded-full border-2 border-[#d92d20] flex items-center justify-center">
              <svg
                width="24" height="24" viewBox="0 0 24 24" fill="none"
                stroke="#d92d20" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <circle cx="12" cy="16" r="0.5" fill="#d92d20" strokeWidth="0" />
              </svg>
            </div>

            <p className="text-[15px] font-semibold text-[#101828] leading-snug">
              Do you really want to delete this Exam Event ?
            </p>

            <div className="flex items-center gap-3 w-full">
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 py-2 bg-[#0e1680] text-white text-sm font-semibold rounded-lg hover:bg-[#0b1260] active:scale-[0.97] transition-all shadow-sm disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {isDeleting ? (
                  <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                    <path d="M12 2a10 10 0 0 1 10 10" />
                  </svg>
                ) : null}
                Delete
              </button>
              <button
                type="button"
                onClick={onClose}
                disabled={isDeleting}
                className="flex-1 py-2 border border-[#d0d5dd] text-sm font-semibold text-[#344054] rounded-lg bg-white hover:bg-[#f9fafb] active:scale-[0.97] transition-all shadow-sm disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          /* ── Success state ── */
          <>
            {/* Shared DeleteSuccessIcon from ModalIcons */}
            <DeleteSuccessIcon size={120} />

            <p className="text-[24px] font-semibold text-[#101828] mt-2">
              Exam Event deleted successfully!
            </p>

            <button
              type="button"
              onClick={handleDone}
              className="px-10 py-3 bg-[#0e1680] text-white text-base font-semibold rounded-lg hover:bg-[#0b1260] active:scale-[0.97] transition-all shadow-sm min-w-[120px]"
            >
              Back
            </button>
          </>
        )}
      </div>

      <style>{`
        @keyframes examDelModalIn {
          from { opacity: 0; transform: scale(0.88) translateY(10px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
};

/* --- ExamEventEditModal.tsx --- */


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

interface ExamEventEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  exam: ExamEntry | null;
  onSuccess?: () => void;
}

/* ─── helpers ─── */
const labelClass =
  'block text-[11px] font-semibold text-[#475467] uppercase tracking-wide mb-1';

const inputClass =
  'w-full px-3.5 py-2.5 bg-white border border-[#d0d5dd] rounded-lg text-sm text-[#101828] placeholder-[#98a2b3] focus:outline-none focus:ring-2 focus:ring-[#0e1680]/30 focus:border-[#0e1680] transition-all shadow-sm';

const selectClass =
  'w-full px-3.5 py-2.5 bg-white border border-[#d0d5dd] rounded-lg text-sm text-[#101828] focus:outline-none focus:ring-2 focus:ring-[#0e1680]/30 focus:border-[#0e1680] transition-all shadow-sm appearance-none cursor-pointer';

/* Convert dd-mm-yyyy ➜ yyyy-mm-dd for date inputs */
function toInputDate(dmy: string): string {
  if (!dmy) return '';
  const parts = dmy.split('-');
  if (parts.length !== 3) return dmy;
  return `${parts[2]}-${parts[1]}-${parts[0]}`;
}

/* Convert yyyy-mm-dd ➜ dd-mm-yyyy for display */
function toDisplayDate(ymd: string): string {
  if (!ymd) return '';
  const parts = ymd.split('-');
  if (parts.length !== 3) return ymd;
  return `${parts[2]}-${parts[1]}-${parts[0]}`;
}

export const ExamEventEditModal: React.FC<ExamEventEditModalProps> = ({
  isOpen,
  onClose,
  exam,
  onSuccess,
}) => {
  /* ─── local form state, seeded from the exam row ─── */
  const [examType, setExamType] = React.useState('');
  const [branch, setBranch] = React.useState('');
  const [semester, setSemester] = React.useState('');
  const [courseTitle, setCourseTitle] = React.useState('');
  const [courseCode, setCourseCode] = React.useState('');
  const [date, setDate] = React.useState('');
  const [timeSlot, setTimeSlot] = React.useState('');
  const [academicYear, setAcademicYear] = React.useState('');
  const [termType, setTermType] = React.useState('');
  const [regStart, setRegStart] = React.useState('');
  const [regEnd, setRegEnd] = React.useState('');
  const [resultDate, setResultDate] = React.useState('');

  /* Seed state whenever the exam changes */
  React.useEffect(() => {
    if (exam) {
      setExamType(exam.examType || 'Internal Assessment 1');
      setBranch(exam.branch || '');
      setSemester(exam.semester || '');
      setCourseTitle(exam.title || '');
      setCourseCode(exam.code || '');
      setDate(toInputDate(exam.date));
      setTimeSlot(exam.time || '');
      setAcademicYear('2025-26');
      setTermType('ODD');
      setRegStart(toInputDate('10-05-2025'));
      setRegEnd(toInputDate('25-05-2025'));
      setResultDate(toInputDate('10-06-2025'));
    }
  }, [exam]);

  if (!isOpen || !exam) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Build payload (would call API here)
    const payload = {
      id: exam.id,
      examType,
      branch,
      semester,
      courseTitle,
      courseCode,
      date: toDisplayDate(date),
      timeSlot,
      academicYear,
      termType,
      regStart: toDisplayDate(regStart),
      regEnd: toDisplayDate(regEnd),
      resultDate: toDisplayDate(resultDate),
    };
    console.log('Schedule & Notify payload:', payload);
    onSuccess?.();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(2, 5, 61, 0.45)', backdropFilter: 'blur(6px)' }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="bg-white w-full max-w-[560px] rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        style={{ animation: 'examEditModalIn 0.25s cubic-bezier(0.34,1.56,0.64,1) both' }}
      >
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-7 py-5 border-b border-[#eaecf0] bg-white shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#eef0fd] flex items-center justify-center">
              <svg
                width="18" height="18" viewBox="0 0 24 24" fill="none"
                stroke="#0e1680" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </div>
            <h2 className="text-[17px] font-bold text-[#101828] tracking-tight">
              Schedule Exam Event
            </h2>
            <Pencil size={13} className="text-[#667085] mt-0.5" />
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#667085] hover:bg-[#f2f4f7] transition-colors"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* ── Body ── */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col overflow-y-auto max-h-[calc(100vh-200px)]"
        >
          <div className="px-7 py-6 flex flex-col gap-5">

            {/* Examination Type */}
            <div>
              <label className={labelClass}>Select Examination Type</label>
              <div className="relative">
                <select
                  className={selectClass}
                  value={examType}
                  onChange={(e) => setExamType(e.target.value)}
                >
                  <option value="Internal Assessment 1">Internal Assessment 1</option>
                  <option value="Internal Assessment 2">Internal Assessment 2</option>
                  <option value="Semester End Exam">Semester End Exam</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#667085" strokeWidth="2" strokeLinecap="round"><polyline points="6 9 12 15 18 9"/></svg>
                </div>
              </div>
            </div>

            {/* Branch + Semester */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Select Branch</label>
                <input
                  type="text"
                  className={inputClass}
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  placeholder="e.g. Information Technology"
                />
              </div>
              <div>
                <label className={labelClass}>Select Semester</label>
                <div className="relative">
                  <select
                    className={selectClass}
                    value={semester}
                    onChange={(e) => setSemester(e.target.value)}
                  >
                    <option value="1st">1st</option>
                    <option value="2nd">2nd</option>
                    <option value="3rd">3rd</option>
                    <option value="4th">4th</option>
                    <option value="5th">5th</option>
                    <option value="6th">6th</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#667085" strokeWidth="2" strokeLinecap="round"><polyline points="6 9 12 15 18 9"/></svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Course Title + Course Code */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Course Title</label>
                <input
                  type="text"
                  className={inputClass}
                  value={courseTitle}
                  onChange={(e) => setCourseTitle(e.target.value)}
                  placeholder="e.g. Database"
                />
              </div>
              <div>
                <label className={labelClass}>Course Code</label>
                <input
                  type="text"
                  className={inputClass}
                  value={courseCode}
                  onChange={(e) => setCourseCode(e.target.value)}
                  placeholder="e.g. CO1919"
                />
              </div>
            </div>

            {/* Date + Time Slot */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Date</label>
                <div className="relative">
                  <input
                    type="date"
                    className={`${inputClass} pr-9`}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                  <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                    <Calendar size={15} className="text-[#667085]" />
                  </div>
                </div>
              </div>
              <div>
                <label className={labelClass}>Time Slot</label>
                <div className="relative">
                  <select
                    className={selectClass}
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                  >
                    <option value="">Select time slot</option>
                    <option value="10:00 - 11:00">10:00 - 11:00</option>
                    <option value="11:00 - 12:00">11:00 - 12:00</option>
                    <option value="12:00 - 1:00">12:00 - 1:00</option>
                    <option value="2:00 - 3:00">2:00 - 3:00</option>
                    <option value="3:00 - 4:00">3:00 - 4:00</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#667085" strokeWidth="2" strokeLinecap="round"><polyline points="6 9 12 15 18 9"/></svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Academic Year + Term Type */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Academic Year</label>
                <div className="relative">
                  <select
                    className={selectClass}
                    value={academicYear}
                    onChange={(e) => setAcademicYear(e.target.value)}
                  >
                    <option value="2024-25">2024-25</option>
                    <option value="2025-26">2025-26</option>
                    <option value="2026-27">2026-27</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#667085" strokeWidth="2" strokeLinecap="round"><polyline points="6 9 12 15 18 9"/></svg>
                  </div>
                </div>
              </div>
              <div>
                <label className={labelClass}>Term Type</label>
                <div className="relative">
                  <select
                    className={selectClass}
                    value={termType}
                    onChange={(e) => setTermType(e.target.value)}
                  >
                    <option value="ODD">ODD</option>
                    <option value="EVEN">EVEN</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#667085" strokeWidth="2" strokeLinecap="round"><polyline points="6 9 12 15 18 9"/></svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Registration Start + End Date */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Registration Start Date</label>
                <div className="relative">
                  <input
                    type="date"
                    className={`${inputClass} pr-9`}
                    value={regStart}
                    onChange={(e) => setRegStart(e.target.value)}
                  />
                  <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                    <Calendar size={15} className="text-[#667085]" />
                  </div>
                </div>
              </div>
              <div>
                <label className={labelClass}>Registration End Date</label>
                <div className="relative">
                  <input
                    type="date"
                    className={`${inputClass} pr-9`}
                    value={regEnd}
                    onChange={(e) => setRegEnd(e.target.value)}
                  />
                  <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                    <Calendar size={15} className="text-[#667085]" />
                  </div>
                </div>
              </div>
            </div>

            {/* Expected Result Date */}
            <div>
              <label className={labelClass}>Expected Result Date</label>
              <div className="relative">
                <input
                  type="date"
                  className={`${inputClass} pr-9`}
                  value={resultDate}
                  onChange={(e) => setResultDate(e.target.value)}
                />
                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                  <Calendar size={15} className="text-[#667085]" />
                </div>
              </div>
            </div>
          </div>

          {/* ── Footer ── */}
          <div className="px-7 py-4 border-t border-[#eaecf0] bg-white flex items-center justify-end shrink-0">
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#0e1680] text-white text-sm font-semibold rounded-lg hover:bg-[#0b1260] active:scale-[0.98] transition-all shadow-md flex items-center gap-2"
            >
              Schedule &amp; Notify
            </button>
          </div>
        </form>
      </div>

      <style>{`
        @keyframes examEditModalIn {
          from { opacity: 0; transform: scale(0.92) translateY(14px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
};

/* --- ExamEventViewModal.tsx --- */


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

interface ExamEventViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  exam: ExamEntry | null;
}

interface FieldProps {
  label: string;
  value: string;
}

const ReadOnlyField: React.FC<FieldProps> = ({ label, value }) => (
  <div className="flex flex-col gap-1.5">
    <label className="block text-xs font-medium text-[#475467] uppercase tracking-wide">
      {label}
    </label>
    <div className="w-full px-3.5 py-2.5 bg-[#f9fafb] border border-[#eaecf0] rounded-lg text-sm text-[#101828] font-medium min-h-[40px] flex items-center">
      {value || <span className="text-[#98a2b3]">—</span>}
    </div>
  </div>
);

export const ExamEventViewModal: React.FC<ExamEventViewModalProps> = ({
  isOpen,
  onClose,
  exam,
}) => {
  if (!isOpen || !exam) return null;

  // Derive academic year and term type from dummy context
  const academicYear = '2025-26';
  const termType = 'ODD';
  const regStartDate = '10-05-2025';
  const regEndDate = '25-05-2025';
  const resultExpectedDate = '01-07-2026';

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(2, 5, 61, 0.45)', backdropFilter: 'blur(6px)' }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="bg-white w-full max-w-[560px] rounded-2xl shadow-2xl overflow-hidden"
        style={{
          animation: 'examViewModalIn 0.25s cubic-bezier(0.34,1.56,0.64,1) both',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-7 py-5 border-b border-[#eaecf0] bg-white">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#eef0fd] flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0e1680" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
            </div>
            <h2 className="text-[17px] font-bold text-[#101828] tracking-tight">
              Exam Event Schedule
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#667085] hover:bg-[#f2f4f7] transition-colors"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="px-7 py-6 flex flex-col gap-5 overflow-y-auto max-h-[calc(100vh-180px)]">

          {/* Examination Type */}
          <ReadOnlyField
            label="Select Examination Type"
            value={exam.examType}
          />

          {/* Branch + Semester */}
          <div className="grid grid-cols-2 gap-4">
            <ReadOnlyField label="Select Branch" value={exam.branch} />
            <ReadOnlyField label="Select Semester" value={exam.semester} />
          </div>

          {/* Course Title + Course Code */}
          <div className="grid grid-cols-2 gap-4">
            <ReadOnlyField label="Course Title" value={exam.title} />
            <ReadOnlyField label="Course Code" value={exam.code} />
          </div>

          {/* Date + Time Slot */}
          <div className="grid grid-cols-2 gap-4">
            <ReadOnlyField label="Date" value={exam.date} />
            <ReadOnlyField label="Time Slot" value={exam.time} />
          </div>

          {/* Academic Year + Term Type */}
          <div className="grid grid-cols-2 gap-4">
            <ReadOnlyField label="Academic Year" value={academicYear} />
            <ReadOnlyField label="Term Type" value={termType} />
          </div>

          {/* Registration Start Date + Registration End Date */}
          <div className="grid grid-cols-2 gap-4">
            <ReadOnlyField label="Registration Start Date" value={regStartDate} />
            <ReadOnlyField label="Registration End Date" value={regEndDate} />
          </div>

          {/* Result Expected Date */}
          <ReadOnlyField label="Result Expected Date" value={resultExpectedDate} />
        </div>

        {/* Footer status chip */}
        <div className="px-7 py-4 border-t border-[#eaecf0] bg-[#f9fafb] flex items-center justify-between">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold border ${
              exam.status === 'scheduled'
                ? 'bg-[#effbe7] text-[#095512] border-[#d3f1bf]'
                : 'bg-[#fff4f2] text-[#d92d20] border-[#fecdca]'
            }`}
          >
            {exam.status === 'scheduled' ? '● Scheduled' : '● Pending'}
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#0e1680] text-white text-sm font-semibold rounded-lg hover:bg-[#0b1260] transition-colors shadow-sm"
          >
            Close
          </button>
        </div>
      </div>

      <style>{`
        @keyframes examViewModalIn {
          from { opacity: 0; transform: scale(0.92) translateY(12px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
};

/* --- ExamFeeDeleteModal.tsx --- */


interface FeeRecord {
  id: number;
  examType: string;
  feesAmount: number;
}

interface ExamFeeDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: FeeRecord | null;
  onConfirmDelete: (id: number) => void;
}

export const ExamFeeDeleteModal: React.FC<ExamFeeDeleteModalProps> = ({
  isOpen,
  onClose,
  record,
  onConfirmDelete,
}) => {
  const [isSuccessState, setIsSuccessState] = React.useState(false);

  React.useEffect(() => {
    if (isOpen) {
      setIsSuccessState(false);
    }
  }, [isOpen]);

  if (!isOpen || !record) return null;

  const handleDelete = () => {
    onConfirmDelete(record.id);
    setIsSuccessState(true);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300 font-sans">
      <div className="bg-white w-full max-w-[360px] rounded-[24px] shadow-2xl p-10 flex flex-col items-center text-center animate-in zoom-in-95 duration-300">
        {!isSuccessState ? (
          /* ── State 1: Confirmation ── */
          <>
            {/* Red Circle Info Icon */}
            <div className="mb-6 flex items-center justify-center text-[#f04438]">
              <svg
                width="80"
                height="80"
                viewBox="0 0 80 80"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="4" />
                {/* i icon details */}
                <circle cx="40" cy="27" r="3.5" fill="currentColor" />
                <path
                  d="M40 37V55"
                  stroke="currentColor"
                  strokeWidth="5"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <h3 className="text-[17px] font-bold text-[#101828] mb-8 leading-snug max-w-[260px]">
              Do you really want to delete this Exam Fees Setting?
            </h3>

            <div className="flex items-center gap-3.5 w-full justify-center">
              <button
                onClick={handleDelete}
                className="flex-1 py-2 bg-[#0e1680] text-white text-sm font-semibold rounded-lg hover:bg-[#0b1260] active:scale-[0.97] transition-all shadow-md"
              >
                Delete
              </button>
              <button
                onClick={onClose}
                className="flex-1 py-2 bg-[#0e1680] text-white text-sm font-semibold rounded-lg hover:bg-[#0b1260] active:scale-[0.97] transition-all shadow-md"
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          /* ── State 2: Success ── */
          <>
            {/* Shared DeleteSuccessIcon from ModalIcons */}
            <div className="mb-6 flex items-center justify-center">
              <DeleteSuccessIcon size={120} />
            </div>

            <h3 className="text-[24px] font-semibold text-[#101828] mb-10 leading-snug max-w-[380px]">
              Exam Pattern deleted successfully!
            </h3>

            <button
              onClick={onClose}
              className="px-10 py-3 bg-[#0e1680] text-white text-base font-semibold rounded-lg hover:bg-[#0b1260] active:scale-[0.97] transition-all shadow-md min-w-[120px]"
            >
              Back
            </button>
          </>
        )}
      </div>
    </div>
  );
};

/* --- ExamFeeEditModal.tsx --- */


interface FeeRecord {
  id: number;
  examType: string;
  feesAmount: number;
}

interface ExamFeeEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: FeeRecord | null;
  onSave: (id: number, examType: string, feesAmount: number) => void;
}

export const ExamFeeEditModal: React.FC<ExamFeeEditModalProps> = ({
  isOpen,
  onClose,
  record,
  onSave,
}) => {
  const [examType, setExamType] = React.useState('Backlog');
  const [fees, setFees] = React.useState('388');

  React.useEffect(() => {
    if (record) {
      setExamType(record.examType);
      setFees(record.feesAmount.toString());
    }
  }, [record, isOpen]);

  if (!isOpen || !record) return null;

  const labelClass = 'block text-xs font-semibold text-[#344054] mb-1.5';
  const inputClass =
    'w-full px-3.5 py-2.5 bg-white border border-[#d0d5dd] rounded-lg text-sm text-[#101828] ' +
    'focus:outline-none focus:ring-2 focus:ring-[#0e1680]/30 focus:border-[#0e1680] ' +
    'transition-all shadow-sm appearance-none cursor-pointer';

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(record.id, examType, Number(fees) || 0);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300 font-sans">
      {/* Modal Container */}
      <form 
        onSubmit={handleSave}
        className="bg-white w-full max-w-[480px] rounded-xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-[#eaecf0]">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-[#101828]">Exam Fees Setting</h3>
            <Pencil size={15} className="text-[#667085]" />
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[#667085] hover:text-[#344054] hover:bg-[#f2f4fd] p-1.5 rounded-lg transition-all"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 flex flex-col gap-5 text-left">
          {/* Select Exam Type */}
          <div>
            <label className={labelClass}>Select Exam Type</label>
            <div className="relative">
              <select
                className={inputClass}
                value={examType}
                onChange={(e) => setExamType(e.target.value)}
              >
                <option>Backlog</option>
                <option>Ex-Student</option>
                <option>Regular</option>
                <option>Semester End Exam</option>
                <option>Internal Assessment</option>
              </select>
              <svg
                className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2"
                width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="#667085" strokeWidth="2" strokeLinecap="round"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>
          </div>

          {/* Enter Fees Amount */}
          <div>
            <label className={labelClass}>Enter Fees Amount</label>
            <input
              type="number"
              className="w-full px-3.5 py-2.5 bg-white border border-[#d0d5dd] rounded-lg text-sm text-[#101828] focus:outline-none focus:ring-2 focus:ring-[#0e1680]/30 focus:border-[#0e1680] transition-all shadow-sm"
              value={fees}
              onChange={(e) => setFees(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4.5 border-t border-[#eaecf0] flex justify-end">
          <button
            type="submit"
            className="px-5 py-2 bg-[#0e1680] text-white text-sm font-semibold rounded-lg hover:bg-[#0b1260] active:scale-[0.97] transition-all shadow-md"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

/* --- ExamFeeViewModal.tsx --- */


interface FeeRecord {
  id: number;
  examType: string;
  feesAmount: number;
}

interface ExamFeeViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: FeeRecord | null;
}

export const ExamFeeViewModal: React.FC<ExamFeeViewModalProps> = ({ isOpen, onClose, record }) => {
  if (!isOpen || !record) return null;

  const labelClass = 'block text-xs font-semibold text-[#344054] mb-1.5';
  const disabledInputClass =
    'w-full px-3.5 py-2.5 bg-[#f9fafb] border border-[#d0d5dd] rounded-lg text-sm text-[#475467] ' +
    'cursor-not-allowed shadow-sm appearance-none select-none';

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300 font-sans">
      {/* Modal Container */}
      <div 
        className="bg-white w-full max-w-[480px] rounded-xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-[#eaecf0]">
          <h3 className="text-base font-bold text-[#101828]">Exam Fees Setting</h3>
          <button
            onClick={onClose}
            className="text-[#667085] hover:text-[#344054] hover:bg-[#f2f4fd] p-1.5 rounded-lg transition-all"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 flex flex-col gap-5 text-left">
          {/* Select Exam Type */}
          <div>
            <label className={labelClass}>Select Exam Type</label>
            <div className="relative">
              <select
                className={disabledInputClass}
                disabled
                value={record.examType}
              >
                <option>{record.examType}</option>
              </select>
              <svg
                className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2"
                width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="#98a2b3" strokeWidth="2" strokeLinecap="round"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>
          </div>

          {/* Enter Fees Amount */}
          <div>
            <label className={labelClass}>Enter Fees Amount</label>
            <input
              type="text"
              className={disabledInputClass}
              disabled
              value={record.feesAmount}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

/* --- ExamScheduleViewModal.tsx --- */


interface ExamScheduleViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  branch: string;
  semester: string;
  examType: string;
}

/* ── Dummy schedule data ── */
const TIME_SLOTS = ['10:00 - 11:00 AM', '3:00 - 4:00 AM'];

const SEMESTERS = ['SEM 4', 'SEM 6', 'SEM 8'];

const SCHEDULE_ROWS = [
  { date: '25/05/2026', day: 'Thursday', cells: ['ABC', 'ABC', 'ABC', 'ABC', 'ABC', 'ABC'] },
  { date: '26/05/2026', day: 'Friday',   cells: ['XYZ', 'XYZ', 'XYZ', 'XYZ', 'XYZ', 'XYZ'] },
  { date: '28/05/2026', day: 'Monday',   cells: ['ABC', 'ABC', 'ABC', 'ABC', 'ABC', 'ABC'] },
];

export const ExamScheduleViewModal: React.FC<ExamScheduleViewModalProps> = ({
  isOpen,
  onClose,
  branch,
  examType: _examType,
}) => {
  const [isDownloading, setIsDownloading] = React.useState(false);

  if (!isOpen) return null;

  const handleDownload = async () => {
    setIsDownloading(true);
    await new Promise((r) => setTimeout(r, 900));
    setIsDownloading(false);
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(2, 5, 61, 0.45)', backdropFilter: 'blur(6px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="bg-white w-full max-w-[620px] rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        style={{ animation: 'scheduleViewIn 0.22s cubic-bezier(0.34,1.56,0.64,1) both' }}
      >

        {/* ── Header ── */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#eaecf0]">
          <h2 className="text-[15px] font-bold text-[#101828]">
            Exams - {branch} (Sem VII)
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#667085] hover:bg-[#f2f4f7] transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* ── Table ── */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              {/* Branch header row */}
              <tr>
                {/* Empty Date cell */}
                <th
                  rowSpan={3}
                  className="border border-[#eaecf0] px-4 py-3 text-xs font-semibold text-[#475467] text-left align-middle bg-[#f9fafb] w-[110px]"
                >
                  Date
                </th>
                {/* Branch spanning all semester columns */}
                <th
                  colSpan={SEMESTERS.length * TIME_SLOTS.length}
                  className="border border-[#eaecf0] px-4 py-2.5 text-xs font-semibold text-[#344054] text-center bg-[#f9fafb]"
                >
                  {branch}
                </th>
              </tr>

              {/* Semester sub-headers */}
              <tr>
                {SEMESTERS.map((sem) => (
                  <th
                    key={sem}
                    colSpan={TIME_SLOTS.length}
                    className="border border-[#eaecf0] px-3 py-2 text-xs font-semibold text-[#344054] text-center bg-[#f9fafb]"
                  >
                    {sem}
                  </th>
                ))}
              </tr>

              {/* Time slot headers */}
              <tr>
                {SEMESTERS.flatMap((sem) =>
                  TIME_SLOTS.map((slot) => (
                    <th
                      key={`${sem}-${slot}`}
                      className="border border-[#eaecf0] px-3 py-2 text-[10px] font-medium text-[#667085] text-center bg-[#f9fafb] whitespace-nowrap"
                    >
                      {slot}
                    </th>
                  ))
                )}
              </tr>
            </thead>

            <tbody>
              {SCHEDULE_ROWS.map((row, ri) => (
                <tr key={ri} className={ri % 2 === 0 ? 'bg-white' : 'bg-[#fafafa]'}>
                  {/* Date cell */}
                  <td className="border border-[#eaecf0] px-4 py-3 text-[11px] font-medium text-[#344054] align-top">
                    <span className="block font-semibold text-[#101828]">{row.date}</span>
                    <span className="block text-[#667085]">{row.day}</span>
                  </td>
                  {/* Data cells */}
                  {row.cells.map((cell, ci) => (
                    <td
                      key={ci}
                      className="border border-[#eaecf0] px-3 py-3 text-xs font-semibold text-[#344054] text-center"
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ── Footer ── */}
        <div className="px-6 py-4 border-t border-[#eaecf0] bg-white flex justify-end">
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#0e1680] text-white text-sm font-semibold rounded-lg hover:bg-[#0b1260] active:scale-[0.97] transition-all shadow-md disabled:opacity-70"
          >
            {isDownloading ? (
              <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                <path d="M12 2a10 10 0 0 1 10 10" />
              </svg>
            ) : (
              <Download size={15} />
            )}
            {isDownloading ? 'Downloading…' : 'Download'}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes scheduleViewIn {
          from { opacity: 0; transform: scale(0.93) translateY(12px); }
          to   { opacity: 1; transform: scale(1)    translateY(0); }
        }
      `}</style>
    </div>
  );
};

/* --- RescheduleModal.tsx --- */


interface RescheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  examData: {
    title: string;
    code: string;
    date: string;
    time: string;
    branch: string;
    semester: string;
    examType: string;
  } | null;
}

export const RescheduleModal: React.FC<RescheduleModalProps> = ({ isOpen, onClose, onSuccess, examData }) => {
  if (!isOpen || !examData) return null;

  const labelClass = "block text-sm font-medium text-[#344054] mb-1.5";
  const inputClass = "w-full px-3.5 py-2.5 bg-white border border-[#d0d5dd] rounded-lg text-sm text-[#101828] placeholder-[#687b96] focus:outline-none focus:ring-2 focus:ring-[#0e1680] shadow-sm";
  const readOnlyClass = "w-full px-3.5 py-2.5 bg-[#f9fafb] border border-[#eaecf0] rounded-lg text-sm text-[#667085] cursor-not-allowed shadow-sm";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300 font-sans">
      <div className="bg-white w-full max-w-[640px] rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#eaecf0] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-[#101828]">Reschedule Exam Event</h3>
            <Pencil size={18} className="text-[#475467]" />
          </div>
          <button onClick={onClose} className="text-[#98a2b3] hover:text-[#475467] transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col gap-5">
          {/* Exam Type */}
          <div>
            <label className={labelClass}>Select Examination Type</label>
            <input type="text" readOnly value={examData.examType} className={readOnlyClass} />
          </div>

          {/* Branch & Semester */}
          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>Select Branch</label>
              <input type="text" readOnly value={examData.branch} className={readOnlyClass} />
            </div>
            <div>
              <label className={labelClass}>Select Semester</label>
              <input type="text" readOnly value={examData.semester} className={readOnlyClass} />
            </div>
          </div>

          {/* Course Title & Code */}
          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>Course Title</label>
              <input type="text" readOnly value={examData.title} className={readOnlyClass} />
            </div>
            <div>
              <label className={labelClass}>Course Code</label>
              <input type="text" readOnly value={examData.code} className={readOnlyClass} />
            </div>
          </div>

          {/* Date & Time Slot */}
          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>Date</label>
              <div className="relative">
                <input type="date" className={inputClass} defaultValue="2026-10-05" />
              </div>
            </div>
            <div>
              <label className={labelClass}>Time Slot</label>
              <select className={inputClass} defaultValue={examData.time}>
                <option>10:00 - 11:00</option>
                <option>2:00 - 3:00</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button 
              onClick={onSuccess}
              className="px-8 py-2.5 bg-[#0e1680] text-white text-sm font-semibold rounded-lg hover:bg-blue-900 transition-all shadow-md"
            >
              Reschedule & Notify
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* --- SuccessModal.tsx --- */


interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
}

export const SuccessModal: React.FC<SuccessModalProps> = ({ isOpen, onClose, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300 font-sans">
      <div className="bg-white w-full max-w-[510px] min-h-[424px] rounded-[24px] shadow-2xl px-10 py-12 flex flex-col items-center text-center animate-in zoom-in-95 duration-300">
        
        {/* Shared SuccessIcon from ModalIcons */}
        <div className="mb-6 flex items-center justify-center">
          <SuccessIcon size={120} />
        </div>
        
        <h3 className="text-[24px] font-semibold text-[#101828] mb-10 leading-snug max-w-[380px]">
          {message}
        </h3>

        <button 
          onClick={onClose}
          className="px-10 py-3 bg-[#0e1680] text-white text-base font-semibold rounded-lg hover:bg-[#0b1260] active:scale-[0.97] transition-all shadow-md min-w-[120px]"
        >
          Back
        </button>
      </div>
    </div>
  );
};
