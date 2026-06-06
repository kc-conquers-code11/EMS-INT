import React, { useState, useEffect } from 'react';
import { X, Search, Eye, Pencil, ChevronDown, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Department } from '../../../../types/COE/department';
import { departmentAPI } from '../../../../services/api';
import {
  getApiErrorMessage,
  mapSetupResponseToForms,
  type CoursesOffered,
  type FacultyForm,
  type HodForm,
  type BasicDepartmentForm,
} from '../../../../types/COE/departmentSetup';

interface ViewDepartmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  department?: Department;
}

const COURSE_OPTIONS = [
  { key: 'undergraduate', label: 'Undergraduate' },
  { key: 'postgraduate', label: 'Postgraduate' },
  { key: 'phd', label: 'Ph.D.' },
  { key: 'xyz1', label: 'Diploma' },
  { key: 'xyz2', label: 'Certificate' }
];

export const ViewDepartmentModal: React.FC<ViewDepartmentModalProps> = ({ isOpen, onClose, department }) => {
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFaculty, setSelectedFaculty] = useState<any | null>(null);
  const [isFacultyViewOpen, setIsFacultyViewOpen] = useState(false);
  const [isFacultyEditOpen, setIsFacultyEditOpen] = useState(false);
  const [isHodPhotoOpen, setIsHodPhotoOpen] = useState(false);
  const [setupData, setSetupData] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ITEMS_PER_PAGE = 5;

  useEffect(() => {
    if (isOpen && department?.id) {
      const loadSetup = async () => {
        setLoading(true);
        setError(null);
        try {
          const res = await departmentAPI.getSetup(department.id);
          if (res.data?.success && res.data.data) {
            setSetupData(res.data.data);
          } else {
            setSetupData(null);
          }
        } catch (err) {
          console.error('Failed to load department setup', err);
          setError('Failed to load department setup');
          setSetupData(null);
        } finally {
          setLoading(false);
        }
      };
      loadSetup();
    } else {
      setSetupData(null);
      setError(null);
      setSearch('');
      setCurrentPage(1);
    }
  }, [isOpen, department?.id]);

  if (!isOpen) return null;

  // Use department values if available, otherwise fallback to setupData or default values
  const hodName = setupData?.hod?.name || department?.hod || 'N/A';
  const hodEmployeeCode = setupData?.hod?.employee_id || 'N/A';
  const mobileNo = setupData?.hod?.phone_number || department?.mobile || 'N/A';
  const emailId = setupData?.hod?.email || department?.email || 'N/A';
  const departmentName = setupData?.department?.depart_name || department?.name || 'N/A';
  const totalFacultyCount = setupData?.department?.total_faculties || department?.facultyCount || 0;
  const gradingSystem = 'Percentage';

  const dbCourses = setupData?.department?.courses_offered;
  const coursesOffered: Record<string, boolean> = {
    undergraduate: typeof dbCourses?.undergraduate === 'boolean' ? dbCourses.undergraduate : true,
    postgraduate: typeof dbCourses?.postgraduate === 'boolean' ? dbCourses.postgraduate : true,
    phd: typeof dbCourses?.phd === 'boolean' ? dbCourses.phd : false,
    xyz1: typeof dbCourses?.diploma === 'boolean' ? dbCourses.diploma : false,
    xyz2: false
  };

  const facultyList = setupData?.faculty_members
    ? setupData.faculty_members.map((f: any) => ({
        name: f.name || 'N/A',
        email: f.college_email || f.email || 'N/A',
        subjects: f.subjects_assigned || 'N/A',
        mobileNumber: f.contact || f.mobile_number || 'N/A',
        gender: f.gender || 'N/A',
        personalEmailId: f.personal_email || 'N/A',
        qualification: f.qualification || 'N/A',
        specialization: f.specialization || 'N/A',
        designation: f.designation || 'N/A',
        experienceYears: f.experience_years ? String(f.experience_years) : '0',
        subjectsAssigned: f.subjects_assigned || 'N/A',
        joiningDate: f.joining_date ? String(f.joining_date).slice(0, 10) : 'N/A',
      }))
    : [];

  const filteredFaculty = facultyList.filter((f: any) =>
    f.name.toLowerCase().includes(search.toLowerCase()) ||
    f.email.toLowerCase().includes(search.toLowerCase()) ||
    f.subjects.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredFaculty.length / ITEMS_PER_PAGE);
  const paginatedFaculty = filteredFaculty.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleExport = () => {
    const data = filteredFaculty.map((f: { name: any; email: any; subjects: any; }) => ({
      'Faculty Name': f.name,
      'College Email ID': f.email,
      'Subjects Assigned': f.subjects
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Faculty Details');
    XLSX.writeFile(workbook, `${departmentName}_Faculty_Details.xlsx`);
  };

  const inputBase = 'w-full px-3.5 py-2.5 border border-[#d0d5dd] rounded-lg text-sm text-[#687b96] bg-[#f9fafb] cursor-not-allowed outline-none shadow-sm';
  const labelClass = 'block text-sm font-medium text-[#344054] mb-1.5';
  const valClass = 'w-full px-3.5 py-2.5 border border-[#eaecf0] rounded-lg text-sm text-[#101828] bg-white shadow-sm';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm font-sans">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[680px] max-h-[90vh] overflow-y-auto mx-4 flex flex-col">
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#eaecf0] sticky top-0 bg-white rounded-t-2xl z-10">
          <h2 className="text-lg font-semibold text-[#171822]">View Department Details</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-6 py-6 space-y-8 overflow-y-auto">
          {loading && (
            <div className="flex items-center justify-center gap-2 py-12 text-[#475467]">
              <Loader2 size={20} className="animate-spin" />
              <span className="text-sm">Loading department details...</span>
            </div>
          )}

          {error && !loading && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {!loading && !error && (
            <>
              <section>
                <h3 className="text-[15px] font-semibold text-[#101828] mb-4">HOD Details</h3>

                <div className="flex items-center justify-between mb-5">
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 border border-gray-200">
                    <img
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(hodName)}&background=random`}
                      alt="HOD"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className={labelClass}>HOD Name</label>
                    <div className={valClass}>{hodName}</div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>HOD Employee Code</label>
                      <div className={valClass}>{hodEmployeeCode}</div>
                    </div>
                    <div>
                      <label className={labelClass}>Mobile No</label>
                      <div className={valClass}>{mobileNo}</div>
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>Email ID</label>
                    <div className={valClass}>{emailId}</div>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-[15px] font-semibold text-[#101828] mb-4">Department Details</h3>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className={labelClass}>Department Name</label>
                    <div className={valClass}>{departmentName}</div>
                  </div>
                  <div>
                    <label className={labelClass}>Total Faculty Count</label>
                    <div className={valClass}>{totalFacultyCount}</div>
                  </div>
                </div>
                <div className="mb-4">
                  <label className={labelClass}>Grading System</label>
                  <div className="relative">
                    <select className={`${inputBase} appearance-none`} value={gradingSystem} disabled>
                      <option>Percentage</option>
                      <option>GPA</option>
                      <option>CGPA</option>
                    </select>
                    <ChevronDown size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Courses Offered</label>
                  <div className="flex flex-wrap gap-5 mt-2">
                    {COURSE_OPTIONS.map(({ key, label }) => (
                      <label
                        key={key}
                        className="flex items-center gap-2 cursor-default pointer-events-none"
                      >
                        <input
                          type="checkbox"
                          checked={!!coursesOffered[key]}
                          readOnly
                          className="w-4 h-4 text-[#0e1680] rounded border-gray-300 accent-[#0e1680]"
                        />
                        <span className="text-[13px] text-[#344054] font-medium">{label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-[15px] font-semibold text-[#101828] mb-4">Faculty Details</h3>

                <div className="flex items-center justify-end gap-3 mb-4">
                  <div className="relative">
                    <Search
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="text"
                      placeholder="Search"
                      value={search}
                      onChange={(e) => {
                        setSearch(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="pl-9 pr-4 py-2 border border-[#eaecf0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-[200px]"
                    />
                  </div>
                </div>

                {/* Table */}
                <div className="bg-white border border-[#eaecf0] rounded-xl overflow-hidden shadow-sm">
                  <table className="w-full border-collapse text-left text-sm">
                    <thead>
                      <tr className="bg-[#f9fafb] border-b border-[#eaecf0]">
                        <th className="px-6 py-4 font-semibold text-[#344054]">Faculty Name</th>
                        <th className="px-6 py-4 font-semibold text-[#344054]">College Email ID</th>
                        <th className="px-6 py-4 font-semibold text-[#344054]">Subjects Assigned</th>
                        <th className="px-6 py-4 font-semibold text-[#344054] text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#eaecf0]">
                      {paginatedFaculty.length > 0 ? (
                        paginatedFaculty.map((item: any, idx: number) => (
                          <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                            <td className="px-6 py-4 font-medium text-[#171822]">{item.name}</td>
                            <td className="px-6 py-4 text-[#475467]">{item.email}</td>
                            <td className="px-6 py-4 text-[#475467]">{item.subjects}</td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => { setSelectedFaculty(item); setIsFacultyViewOpen(true); }}
                                  className="p-1.5 text-gray-400 hover:text-gray-700 transition-colors rounded cursor-pointer"
                                >
                                  <Eye size={16} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => { setSelectedFaculty(item); setIsFacultyEditOpen(true); }}
                                  className="p-1.5 text-gray-400 hover:text-gray-700 transition-colors rounded cursor-pointer"
                                >
                                  <Pencil size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="px-6 py-8 text-center text-gray-400">
                            No faculty found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {totalPages > 1 && (
                  <div className="flex items-center justify-between px-4 py-3 border-t border-[#eaecf0] bg-white mt-4 rounded-xl border">
                    <button
                      type="button"
                      disabled={currentPage <= 1}
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      className="flex items-center gap-2 px-3 py-1.5 border border-[#d0d5dd] rounded-lg text-[13px] font-medium text-[#344054] hover:bg-gray-50 disabled:opacity-40"
                    >
                      <ChevronLeft size={16} /> Previous
                    </button>
                    <span className="text-[13px] text-[#475467]">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      type="button"
                      disabled={currentPage >= totalPages}
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      className="flex items-center gap-2 px-3 py-1.5 border border-[#d0d5dd] rounded-lg text-[13px] font-medium text-[#344054] hover:bg-gray-50 disabled:opacity-40"
                    >
                      Next <ChevronRight size={16} />
                    </button>
                  </div>
                )}
              </section>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
