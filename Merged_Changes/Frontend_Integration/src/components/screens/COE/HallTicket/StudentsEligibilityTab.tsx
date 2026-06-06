import React, { useEffect, useState } from 'react';
import { ChevronDown, Search, Filter, ChevronLeft, ChevronRight, MoreVertical } from 'lucide-react';
import { StudentDetailsModal, type StudentEligibility } from './StudentDetailsModal';
import { hallTicketAPI } from '../../../../services/hallTicket/hallTicketApi';
import { branchAPI, semesterAPI } from '../../../../services/api';

export const StudentsEligibilityTab: React.FC = () => {
  const [examEvents, setExamEvents] = useState<{ event_id: string; event_name: string }[]>([]);
  const [examEvent, setExamEvent] = useState('');
  const [eligibilityStatus, setEligibilityStatus] = useState('');
  const [branch, setBranch] = useState('');
  const [semester, setSemester] = useState('');
  const [branchOptions, setBranchOptions] = useState<any[]>([]);
  const [semesterOptions, setSemesterOptions] = useState<any[]>([]);
  const [searched, setSearched] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [students, setStudents] = useState<StudentEligibility[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<StudentEligibility | null>(null);

  useEffect(() => {
    hallTicketAPI.getExamEvents().then(setExamEvents).catch(() => setExamEvents([]));
  }, []);

  useEffect(() => {
    setBranch('');
    setSemester('');
    const fetchBranchesForEvent = async () => {
      if (!examEvent) {
        setBranchOptions([]);
        return;
      }
      try {
        const opts = await hallTicketAPI.getEligibilityFilterOptions(examEvent);
        const fromEvent = opts.branches?.length
          ? opts.branches
          : [];
        if (fromEvent.length) {
          setBranchOptions(fromEvent);
          return;
        }
        const branchRes = await branchAPI.getDropdown();
        if (branchRes.data.success) setBranchOptions(branchRes.data.data || []);
      } catch (err) {
        console.error('Failed to fetch branches', err);
        setBranchOptions([]);
      }
    };
    fetchBranchesForEvent();
  }, [examEvent]);

  useEffect(() => {
    setSemester('');
    const fetchSemesters = async () => {
      if (!branch) {
        setSemesterOptions([]);
        return;
      }
      try {
        const semRes = await semesterAPI.getDropdown({ branch_id: branch });
        if (semRes.data.success) setSemesterOptions(semRes.data.data || []);
      } catch (err) {
        console.error('Failed to fetch semesters', err);
        setSemesterOptions([]);
      }
    };
    fetchSemesters();
  }, [branch]);

  const handleSearch = async () => {
    if (!examEvent) {
      setError('Please select an exam event');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const rows = await hallTicketAPI.getStudentsEligibility({
        examEventId: examEvent,
        eligibilityStatus: eligibilityStatus || undefined,
        branchId: branch || undefined,
        semesterId: semester || undefined,
      });
      setStudents(
        rows.map((row) => ({
          enrollmentNo: row.enrollment_no,
          studentName: row.student_name,
          registrationStatus: row.registration_status,
          feesStatus: row.fees_status,
          approval: row.approval,
          eligibility: row.eligibility,
          reason: row.reason,
          examRegId: row.exam_reg_id,
          onHold: row.on_hold,
        }))
      );
      setSearched(true);
      setCurrentPage(1);
    } catch {
      setError('Failed to load student eligibility');
      setStudents([]);
      setSearched(true);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setExamEvent('');
    setEligibilityStatus('');
    setBranch('');
    setSemester('');
    setSearched(false);
    setSearchQuery('');
  };

  const filteredStudents = students.filter(s =>
    s.enrollmentNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.studentName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRemoveHold = async (examRegId: string) => {
    if (!examRegId) return;
    setLoading(true);
    setError(null);
    try {
      await hallTicketAPI.setStudentHold(examRegId, false);
      await handleSearch();
    } catch (err: unknown) {
      const apiMessage = (err as { response?: { data?: { message?: string; errors?: { message: string }[] } } })
        ?.response?.data;
      const detail =
        apiMessage?.errors?.[0]?.message ||
        (typeof apiMessage?.message === 'string' ? apiMessage.message : null);
      setError(detail || 'Failed to remove hold');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-[15px]">
      {error && (
        <p className="text-sm text-red-600 font-medium" role="alert">
          {error}
        </p>
      )}

      {/* Exam Event */}
      <div className="flex flex-col gap-[6px]">
        <label className="text-[14px] font-medium text-[#344054] leading-[20px]">
          Exam Event
        </label>
        <div className="flex items-center bg-white border border-[#d0d5dd] rounded-[8px] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] overflow-hidden">
          <div className="flex-1 px-[14px] py-[10px]">
            <select
              id="eligibility-exam-event"
              value={examEvent}
              onChange={(e) => setExamEvent(e.target.value)}
              className="w-full text-[16px] leading-[24px] text-[#687b96] bg-transparent outline-none appearance-none cursor-pointer font-['Instrument_Sans']"
            >
              <option value="">Select exam event</option>
              {examEvents.map((evt) => (
                <option key={evt.event_id} value={evt.event_id}>
                  {evt.event_name}
                </option>
              ))}
            </select>
          </div>
          <div className="px-[14px] py-[10px] flex items-center justify-center">
            <ChevronDown size={20} className="text-[#687b96]" />
          </div>
        </div>
      </div>

      {/* Eligibility Status */}
      <div className="flex flex-col gap-[6px]">
        <label className="text-[14px] font-medium text-[#344054] leading-[20px]">
          Eligibility status
        </label>
        <div className="flex items-center bg-white border border-[#d0d5dd] rounded-[8px] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] overflow-hidden">
          <div className="flex-1 px-[14px] py-[10px]">
            <select
              id="eligibility-status"
              value={eligibilityStatus}
              onChange={(e) => setEligibilityStatus(e.target.value)}
              className="w-full text-[16px] leading-[24px] text-[#687b96] bg-transparent outline-none appearance-none cursor-pointer font-['Instrument_Sans']"
            >
              <option value="">All</option>
              <option value="eligible">Eligible</option>
              <option value="not-eligible">Not Eligible</option>
            </select>
          </div>
          <div className="px-[14px] py-[10px] flex items-center justify-center">
            <ChevronDown size={20} className="text-[#687b96]" />
          </div>
        </div>
      </div>

      {/* Branch */}
      <div className="flex flex-col gap-[6px]">
        <label className="text-[14px] font-medium text-[#344054] leading-[20px]">
          Branch
        </label>
        <div className="flex items-center bg-white border border-[#d0d5dd] rounded-[8px] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] overflow-hidden">
          <div className="flex-1 px-[14px] py-[10px]">
            <select
              id="eligibility-branch"
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              className="w-full text-[16px] leading-[24px] text-[#687b96] bg-transparent outline-none appearance-none cursor-pointer font-['Instrument_Sans']"
            >
              <option value="">All Branches</option>
              {branchOptions.map((b) => (
                <option key={b.branch_id} value={b.branch_id}>
                  {b.branch_name || b.label}
                </option>
              ))}
            </select>
          </div>
          <div className="px-[14px] py-[10px] flex items-center justify-center pointer-events-none">
            <ChevronDown size={20} className="text-[#687b96]" />
          </div>
        </div>
      </div>

      {/* Semester */}
      <div className="flex flex-col gap-[6px]">
        <label className="text-[14px] font-medium text-[#344054] leading-[20px]">
          Semester
        </label>
        <div className="flex items-center bg-white border border-[#d0d5dd] rounded-[8px] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] overflow-hidden">
          <div className="flex-1 px-[14px] py-[10px]">
            <select
              id="eligibility-semester"
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              className="w-full text-[16px] leading-[24px] text-[#687b96] bg-transparent outline-none appearance-none cursor-pointer font-['Instrument_Sans']"
            >
              <option value="">All Semesters</option>
              {semesterOptions.map((s) => (
                <option key={s.semester_id} value={s.semester_id}>
                  {s.term_type
                    ? `Semester ${s.semester_number} (${s.term_type})`
                    : `Semester ${s.semester_number}`}
                </option>
              ))}
            </select>
          </div>
          <div className="px-[14px] py-[10px] flex items-center justify-center pointer-events-none">
            <ChevronDown size={20} className="text-[#687b96]" />
          </div>
        </div>
      </div>

      {/* ── Action Buttons ── */}
      <div className="flex items-center gap-[12px] mt-2">
        <button
          id="eligibility-search"
          onClick={handleSearch}
          disabled={loading}
          className="bg-[#0e1680] text-white font-semibold text-[16px] leading-[24px] px-[18px] py-[10px] rounded-[8px] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] hover:bg-[#0c1260] transition-colors cursor-pointer font-['Instrument_Sans'] disabled:opacity-60"
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
        <button
          id="eligibility-reset"
          onClick={handleReset}
          className="bg-[#0e1680] text-white font-semibold text-[16px] leading-[24px] px-[18px] py-[10px] rounded-[8px] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] hover:bg-[#0c1260] transition-colors cursor-pointer font-['Instrument_Sans']"
        >
          Reset
        </button>
      </div>

      {/* ── Results Section (shown after search) ── */}
      {searched && (
        <div className="flex flex-col items-end gap-4 mt-4">

          {/* ── Filter Row: Search + Filter Buttons ── */}
          <div className="flex items-center gap-3 justify-end w-full">
            {/* Search Input */}
            <div className="flex items-center gap-2 bg-white border border-[#d0d5dd] rounded-[8px] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] px-3 py-2 w-[211px]">
              <input
                id="eligibility-table-search"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search"
                className="flex-1 text-[16px] leading-[24px] text-[#101828] placeholder:text-[#687b96] bg-transparent outline-none font-['Instrument_Sans']"
              />
              <Search size={16} className="text-[#687b96]" />
            </div>

            {/* Filter Buttons */}
            {['Scheme', 'Term', 'Semester No'].map(filter => (
              <button
                key={filter}
                className="flex items-center gap-2 bg-white border border-[#d0d5dd] rounded-[8px] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] px-4 py-[10px] text-[14px] font-semibold text-[#344054] leading-[20px] hover:bg-gray-50 transition-colors cursor-pointer font-['Instrument_Sans']"
              >
                {filter}
                <Filter size={20} className="text-[#344054]" />
              </button>
            ))}
          </div>

          {/* ── Card Header: Student Eligibility List ── */}
          <div className="bg-white w-full flex flex-col">
            <div className="flex items-start justify-between pt-5 px-6">
              <div className="flex items-center gap-2">
                <h2 className="text-[18px] font-semibold text-[#101828] leading-[28px] font-['Instrument_Sans']">
                  Student Eligibility List
                </h2>
                <span className="bg-[#e5e7fb] text-[#070b5c] text-[12px] font-medium leading-[18px] px-2 py-[2px] rounded-full font-['Instrument_Sans']">
                  {filteredStudents.length}
                </span>
              </div>
              <button className="p-1 hover:bg-gray-50 rounded transition-colors cursor-pointer">
                <MoreVertical size={20} className="text-[#667085]" />
              </button>
            </div>
            <div className="h-px bg-[#eaecf0] mt-5" />
          </div>

          {/* ── Data Table ── */}
          <div className="w-full bg-white border border-[#eaecf0] rounded-[6px] overflow-x-auto">
            <table className="w-full text-left border-collapse font-['Instrument_Sans']">
              <thead>
                <tr className="bg-[#f9fafb]">
                  <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider text-[#49505b] leading-[18px] whitespace-nowrap border-b border-[#eaecf0]">Enrollment No</th>
                  <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider leading-[18px] whitespace-nowrap border-b border-[#eaecf0] text-[#667085]">Student Name</th>
                  <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider leading-[18px] whitespace-nowrap border-b border-[#eaecf0] text-[#667085]">Registration status</th>
                  <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider leading-[18px] whitespace-nowrap border-b border-[#eaecf0] text-[#667085]">Fees status</th>
                  <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider leading-[18px] whitespace-nowrap border-b border-[#eaecf0] text-[#667085]">Approval</th>
                  <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider leading-[18px] whitespace-nowrap border-b border-[#eaecf0] text-[#667085]">Eligibility</th>
                  <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider leading-[18px] whitespace-nowrap border-b border-[#eaecf0] text-[#667085]">Reason</th>
                  <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider leading-[18px] whitespace-nowrap border-b border-[#eaecf0] text-[#667085]">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) => (
                  <tr key={student.enrollmentNo} className="border-b border-[#eaecf0] last:border-0">
                    <td className="px-8 py-6 text-[15px] font-medium text-[#475467] leading-[20px] whitespace-nowrap">{student.enrollmentNo}</td>
                    <td className="px-8 py-6 text-[15px] font-medium text-[#687b96] leading-[24px] whitespace-nowrap">{student.studentName}</td>
                    <td className="px-8 py-6 text-[15px] font-medium text-[#687b96] leading-[24px] whitespace-nowrap">{student.registrationStatus}</td>
                    <td className="px-8 py-6 text-[15px] font-medium text-[#687b96] leading-[24px] whitespace-nowrap">{student.feesStatus}</td>
                    <td className="px-8 py-6 text-[15px] font-medium text-[#687b96] leading-[24px] whitespace-nowrap">{student.approval}</td>
                    <td className="px-8 py-6 text-[15px] font-medium text-[#475467] leading-[18px] whitespace-nowrap">{student.eligibility}</td>
                    <td className="px-8 py-6 text-[15px] font-medium text-[#687b96] leading-[24px] whitespace-nowrap">{student.reason}</td>
                    <td className="px-8 py-6 text-[15px] font-medium whitespace-nowrap">
                      {!student.onHold ? (
                        <button 
                          onClick={() => setSelectedStudent(student)}
                          className="bg-[#0e1680] text-white font-semibold text-[16px] leading-[24px] px-[18px] py-[10px] rounded-[8px] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] hover:bg-[#0c1260] transition-colors cursor-pointer font-['Instrument_Sans']"
                        >
                          View
                        </button>
                      ) : (
                        <button 
                          onClick={() => student.examRegId && handleRemoveHold(student.examRegId)}
                          disabled={loading || !student.examRegId}
                          className="bg-[#0e1680] text-white font-semibold text-[16px] leading-[24px] px-[18px] py-[10px] rounded-[8px] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] hover:bg-[#0c1260] transition-colors cursor-pointer font-['Instrument_Sans'] disabled:opacity-60"
                        >
                          Remove Hold
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ── Pagination ── */}
          <div className="w-full border border-[#d9d9d9]">
            <div className="flex items-center justify-between border border-[#eaecf0] rounded-b-[12px] px-6 pt-3 pb-4">
              {/* Previous */}
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                className="flex items-center gap-2 bg-white border border-[#d0d5dd] rounded-[8px] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] px-[14px] py-2 text-[14px] font-semibold text-[#344054] leading-[20px] hover:bg-gray-50 transition-colors cursor-pointer font-['Instrument_Sans']"
              >
                <ChevronLeft size={20} className="text-[#344054]" />
                Previous
              </button>

              {/* Page Numbers */}
              <div className="flex items-center gap-[2px]">
                {[1, 2, 3, '...', 8, 9, 10].map((page, i) => (
                  <button
                    key={i}
                    onClick={() => typeof page === 'number' && setCurrentPage(page)}
                    className={`w-10 h-10 flex items-center justify-center rounded-[8px] text-[14px] font-medium leading-[20px] transition-colors cursor-pointer font-['Instrument_Sans'] ${
                      currentPage === page
                        ? 'bg-[#f9fafb] text-[#1d2939]'
                        : 'text-[#475467] hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              {/* Next */}
              <button
                onClick={() => setCurrentPage(p => Math.min(10, p + 1))}
                className="flex items-center gap-2 bg-white border border-[#d0d5dd] rounded-[8px] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] px-[14px] py-2 text-[14px] font-semibold text-[#344054] leading-[20px] hover:bg-gray-50 transition-colors cursor-pointer font-['Instrument_Sans']"
              >
                Next
                <ChevronRight size={20} className="text-[#344054]" />
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedStudent && (
        <StudentDetailsModal
          student={selectedStudent}
          onClose={() => setSelectedStudent(null)}
          onSave={() => setSelectedStudent(null)}
        />
      )}
    </div>
  );
};
