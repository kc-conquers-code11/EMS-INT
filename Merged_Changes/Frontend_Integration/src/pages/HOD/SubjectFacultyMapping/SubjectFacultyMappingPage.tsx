import { useCallback, useEffect, useMemo, useState } from 'react';
import { Pencil, Search, Loader2, AlertCircle } from 'lucide-react';
import { TabNavigation } from '../../../components/screens/TabNavigation';
import { FeedbackModal } from '../../../components/modals/FeedbackModal';
import { facultySubjectMappingAPI } from '../../../services/facultySubjectMappingApi';
import { getApiErrorMessage } from '../../../types/COE/departmentSetup';
import { useUserScope } from '../../../hooks/useUserScope';
import type {
  FacultyAllocationPanel,
  FacultyLookup,
  SemesterLookup,
  SubjectFacultyMappingRow,
} from '../../../types/HOD/facultySubjectMapping';

const ITEMS_PER_PAGE = 10;

type AssignmentKey = string;

const assignmentKey = (subjectId: string, semesterId: string): AssignmentKey =>
  `${subjectId}:${semesterId}`;

export default function SubjectFacultyMappingPage() {
  const { departId, departName, institutionName, scope } = useUserScope();

  const [activeTab, setActiveTab] = useState<'view' | 'add'>('view');
  const [rows, setRows] = useState<SubjectFacultyMappingRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [listError, setListError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [semesterFilter, setSemesterFilter] = useState('');
  const [facultyFilter, setFacultyFilter] = useState('');
  const [semesters, setSemesters] = useState<SemesterLookup[]>([]);
  const [facultyOptions, setFacultyOptions] = useState<FacultyLookup[]>([]);
  const [lookupError, setLookupError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [selectedFacultyId, setSelectedFacultyId] = useState('');
  const [allocationPanel, setAllocationPanel] = useState<FacultyAllocationPanel | null>(null);
  const [panelLoading, setPanelLoading] = useState(false);
  const [selectedAssignments, setSelectedAssignments] = useState<Set<AssignmentKey>>(new Set());
  const [facultyRole, setFacultyRole] = useState('Primary');
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [successOpen, setSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const fetchList = useCallback(async () => {
    setLoading(true);
    setListError(null);
    try {
      const res = await facultySubjectMappingAPI.list({
        q: searchQuery || undefined,
        semester_id: semesterFilter || undefined,
        faculty_id: facultyFilter || undefined,
        page: currentPage,
        limit: ITEMS_PER_PAGE,
      });
      if (res.data?.success) {
        setRows((res.data.data as SubjectFacultyMappingRow[]) || []);
        const total = res.data.pagination?.total || 0;
        setTotalPages(Math.max(1, Math.ceil(total / ITEMS_PER_PAGE)));
      } else {
        setRows([]);
        setListError(res.data?.message || 'Failed to load mappings.');
      }
    } catch (err) {
      setRows([]);
      setListError(getApiErrorMessage(err, 'Failed to load mappings.'));
    } finally {
      setLoading(false);
    }
  }, [searchQuery, semesterFilter, facultyFilter, currentPage]);

  const fetchLookups = useCallback(async () => {
    setLookupError(null);
    try {
      const [facRes, semRes] = await Promise.all([
        facultySubjectMappingAPI.lookupFaculty(),
        facultySubjectMappingAPI.lookupSemesters(),
      ]);
      if (facRes.data?.success) {
        setFacultyOptions((facRes.data.data as FacultyLookup[]) || []);
      }
      if (semRes.data?.success) {
        setSemesters((semRes.data.data as SemesterLookup[]) || []);
      }
    } catch (err) {
      setLookupError(getApiErrorMessage(err, 'Failed to load faculty or semester options.'));
    }
  }, []);

  const loadAllocationPanel = useCallback(async (facultyId: string) => {
    if (!facultyId) {
      setAllocationPanel(null);
      setSelectedAssignments(new Set());
      return;
    }

    setPanelLoading(true);
    setFormError(null);
    try {
      const res = await facultySubjectMappingAPI.getFacultyAllocationPanel(facultyId);
      if (res.data?.success && res.data.data) {
        const panel = res.data.data;
        setAllocationPanel(panel);
        const assigned = new Set<AssignmentKey>();
        panel.semesters.forEach((sem) => {
          sem.subjects.forEach((sub) => {
            if (sub.is_assigned_to_self) {
              assigned.add(assignmentKey(sub.subject_id, sem.semester_id));
            }
          });
        });
        setSelectedAssignments(assigned);
      } else {
        setAllocationPanel(null);
        setSelectedAssignments(new Set());
        setFormError(res.data?.message || 'Failed to load subject allocation panel.');
      }
    } catch (err) {
      setAllocationPanel(null);
      setSelectedAssignments(new Set());
      setFormError(getApiErrorMessage(err, 'Failed to load subject allocation panel.'));
    } finally {
      setPanelLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  useEffect(() => {
    fetchLookups();
  }, [fetchLookups]);

  useEffect(() => {
    loadAllocationPanel(selectedFacultyId);
  }, [selectedFacultyId, loadAllocationPanel]);

  const semesterOptions = useMemo(
    () =>
      semesters.map((s) => ({
        id: s.semester_id,
        label: s.label || `Sem ${s.semester_number} - ${s.term_type}`,
        number: s.semester_number,
      })),
    [semesters]
  );

  const toggleSubject = (subjectId: string, semesterId: string, isBlocked: boolean) => {
    if (isBlocked) return;
    const key = assignmentKey(subjectId, semesterId);
    setSelectedAssignments((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!selectedFacultyId) {
      setFormError('Please select a faculty member.');
      return;
    }

    const assignments = Array.from(selectedAssignments).map((key) => {
      const [subject_id, semester_id] = key.split(':');
      return { subject_id, semester_id };
    });

    setSubmitting(true);
    try {
      const res = await facultySubjectMappingAPI.upsertFacultyMappings(selectedFacultyId, {
        faculty_role: facultyRole,
        assignments,
      });
      if (res.data?.success) {
        setSuccessMessage('Faculty subject assignments saved successfully.');
        setSuccessOpen(true);
        if (res.data.data) {
          setAllocationPanel(res.data.data);
        }
        fetchList();
      }
    } catch (err) {
      setFormError(getApiErrorMessage(err, 'Failed to save assignments.'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditFromTable = (row: SubjectFacultyMappingRow) => {
    setActiveTab('add');
    setSelectedFacultyId(row.faculty_id);
    setFacultyRole(row.faculty_role || 'Primary');
  };

  const departmentLabel = departName || scope?.depart_name || (departId ? 'Your department' : null);

  const inputClass =
    'w-full px-4 py-3 border border-[#d0d5dd] rounded-lg text-[#101828] text-[15px] focus:outline-none focus:ring-4 focus:ring-[#0e1680]/5 disabled:bg-gray-50 disabled:text-gray-500';

  return (
    <div className="flex flex-col w-full pb-20">
      <div className="flex flex-col gap-6 mb-8 px-2">
        <div>
          <h1 className="text-[28px] font-semibold text-[#171822] tracking-tight">
            Subject-Faculty Mapping
          </h1>
          {(departmentLabel || institutionName) && (
            <p className="text-sm text-[#667085] mt-1">
              {departmentLabel}
              {departmentLabel && institutionName ? ' · ' : ''}
              {institutionName}
            </p>
          )}
        </div>
        <TabNavigation
          activeTab={activeTab}
          onTabChange={setActiveTab}
          addLabel="Assign Subjects"
        />
      </div>

      {lookupError && (
        <div className="mx-2 mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 flex items-center gap-2">
          <AlertCircle size={16} /> {lookupError}
        </div>
      )}

      {activeTab === 'add' ? (
        <form
          onSubmit={handleSave}
          className="bg-white p-10 rounded-2xl shadow-[0px_12px_16px_0px_rgba(16,24,40,0.08)] border border-gray-100 mx-2 space-y-8"
        >
          {formError && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 flex items-center gap-2">
              <AlertCircle size={16} /> {formError}
            </div>
          )}

          <div>
            <label className="block text-[15px] font-medium text-[#344054] mb-3">
              Select Faculty *
            </label>
            <div className="border border-[#eaecf0] rounded-lg divide-y max-h-56 overflow-y-auto">
              {facultyOptions.length === 0 ? (
                <p className="p-4 text-sm text-gray-500">No faculty found in your department.</p>
              ) : (
                facultyOptions.map((f) => (
                  <label
                    key={f.faculty_id}
                    className={`flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 ${
                      selectedFacultyId === f.faculty_id ? 'bg-[#0e1680]/5' : ''
                    }`}
                  >
                    <input
                      type="radio"
                      name="faculty"
                      checked={selectedFacultyId === f.faculty_id}
                      onChange={() => setSelectedFacultyId(f.faculty_id)}
                      className="w-4 h-4 accent-[#0e1680]"
                    />
                    <span className="text-sm text-[#344054]">
                      {f.name}{' '}
                      <span className="text-[#98a2b3]">
                        ({f.college_email || f.email || 'no email'})
                      </span>
                    </span>
                  </label>
                ))
              )}
            </div>
          </div>

          {selectedFacultyId && (
            <div>
              <label className="block text-[15px] font-medium text-[#344054] mb-3">
                Assign Subjects
                {allocationPanel && (
                  <span className="font-normal text-[#667085] ml-2">
                    for {allocationPanel.faculty_name}
                  </span>
                )}
              </label>

              {panelLoading ? (
                <div className="py-12 text-center text-gray-500">
                  <Loader2 className="inline animate-spin mr-2" size={18} />
                  Loading subjects...
                </div>
              ) : !allocationPanel || allocationPanel.semesters.length === 0 ? (
                <p className="text-sm text-[#667085] py-4">
                  No subjects are available for your department semesters. Ask the COE to assign
                  subjects to semesters.
                </p>
              ) : (
                <div className="space-y-6 border border-[#eaecf0] rounded-lg p-4 max-h-[420px] overflow-y-auto">
                  {allocationPanel.semesters.map((sem) => (
                    <div key={sem.semester_id}>
                      <h4 className="text-sm font-semibold text-[#344054] mb-2 pb-1 border-b border-[#eaecf0]">
                        {sem.label || `Semester ${sem.semester_number}`}
                      </h4>
                      <div className="space-y-1">
                        {sem.subjects.map((sub) => {
                          const key = assignmentKey(sub.subject_id, sem.semester_id);
                          const checked = selectedAssignments.has(key);
                          return (
                            <label
                              key={key}
                              className={`flex items-start gap-3 px-2 py-2 rounded-lg ${
                                sub.is_blocked
                                  ? 'opacity-60 cursor-not-allowed bg-gray-50'
                                  : 'hover:bg-gray-50 cursor-pointer'
                              }`}
                              title={
                                sub.is_blocked
                                  ? `${sub.subject_name} is already assigned to ${sub.assigned_faculty_name}`
                                  : undefined
                              }
                            >
                              <input
                                type="checkbox"
                                checked={checked}
                                disabled={sub.is_blocked}
                                onChange={() =>
                                  toggleSubject(sub.subject_id, sem.semester_id, sub.is_blocked)
                                }
                                className="w-4 h-4 mt-0.5 accent-[#0e1680] disabled:cursor-not-allowed"
                              />
                              <span className="text-sm text-[#344054]">
                                {sub.subject_code} — {sub.subject_name}
                                {sub.is_blocked && (
                                  <span className="block text-xs text-amber-700 mt-0.5">
                                    Assigned to {sub.assigned_faculty_name}
                                  </span>
                                )}
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {selectedFacultyId && (
            <div className="max-w-xs">
              <label className="block text-[15px] font-medium text-[#344054] mb-2">
                Faculty Role
              </label>
              <input
                type="text"
                value={facultyRole}
                onChange={(e) => setFacultyRole(e.target.value)}
                placeholder="Primary"
                className={inputClass}
              />
            </div>
          )}

          <button
            type="submit"
            disabled={submitting || !selectedFacultyId || panelLoading}
            className="px-6 py-3 bg-[#0e1680] text-white rounded-lg font-semibold hover:bg-blue-900 disabled:opacity-60 flex items-center gap-2"
          >
            {submitting && <Loader2 size={16} className="animate-spin" />}
            Save Assignments
          </button>
        </form>
      ) : (
        <div className="mx-2 space-y-4">
          {listError && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 flex items-center gap-2">
              <AlertCircle size={16} /> {listError}
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3 justify-between">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search faculty, subject, or code..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-9 pr-4 py-2 border border-[#eaecf0] rounded-lg text-sm w-[280px]"
              />
            </div>
            <div className="flex gap-3 flex-wrap">
              <select
                value={facultyFilter}
                onChange={(e) => {
                  setFacultyFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-3 py-2 border border-[#eaecf0] rounded-lg text-sm"
              >
                <option value="">All faculty</option>
                {facultyOptions.map((f) => (
                  <option key={f.faculty_id} value={f.faculty_id}>
                    {f.name}
                  </option>
                ))}
              </select>
              <select
                value={semesterFilter}
                onChange={(e) => {
                  setSemesterFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-3 py-2 border border-[#eaecf0] rounded-lg text-sm"
              >
                <option value="">All semesters</option>
                {semesterOptions.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="bg-white border border-[#eaecf0] rounded-lg overflow-hidden">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[#f9fafb]">
                  {['Faculty', 'Semester', 'Subject', 'Status', 'Actions'].map((h) => (
                    <th
                      key={h}
                      className="px-6 py-4 text-left text-[12px] font-medium text-[#475467] uppercase border-b border-[#eaecf0]"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#eaecf0]">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-gray-500">
                      <Loader2 className="inline animate-spin mr-2" size={18} />
                      Loading mappings...
                    </td>
                  </tr>
                ) : rows.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-gray-500">
                      No faculty-subject mappings found.
                    </td>
                  </tr>
                ) : (
                  rows.map((row) => (
                    <tr key={row.mapping_id} className="hover:bg-gray-50/50">
                      <td className="px-6 py-4 text-[14px] text-[#101828]">{row.faculty_name}</td>
                      <td className="px-6 py-4 text-[14px] text-[#475467]">
                        {row.semester_number ?? row.semester_label}
                      </td>
                      <td className="px-6 py-4 text-[14px] text-[#475467]">
                        {row.subject_code} — {row.subject_name}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700">
                          {row.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          type="button"
                          onClick={() => handleEditFromTable(row)}
                          className="p-2 rounded-lg hover:bg-gray-100 text-[#475467]"
                          title="Edit assignments"
                        >
                          <Pencil size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-[#eaecf0]">
                <button
                  type="button"
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                  className="px-3 py-1.5 border rounded-lg text-sm disabled:opacity-40"
                >
                  Previous
                </button>
                <span className="text-sm text-[#475467]">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  type="button"
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                  className="px-3 py-1.5 border rounded-lg text-sm disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <FeedbackModal
        isOpen={successOpen}
        type="success"
        onClose={() => setSuccessOpen(false)}
        title={successMessage}
      />
    </div>
  );
}
