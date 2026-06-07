import React, { useState, useEffect, useRef } from 'react';
import { X, Pencil, ChevronDown, Calendar, Image, Loader2 } from 'lucide-react';
import { FeedbackModal } from './DepartmentModals';
import type { Department } from '../../../../types/COE/department';
import { departmentAPI } from '../../../../services/api';
import {
  buildSetupPayload,
  collectFacultyMembers,
  mapSetupResponseToForms,
  validateBasicForm,
  validateHodForm,
  validateFacultyStep,
  validateFacultyBulkList,
  getApiErrorMessage,
  readProfilePhotoAsBase64,
  emptyBasicForm,
  emptyHodForm,
  emptyFacultyForm,
  type BasicDepartmentForm,
  type HodForm,
  type FacultyForm,
  type FieldErrors,
} from '../../../../types/COE/departmentSetup';
import { FacultyBulkUploadSection } from './FacultyBulkUploadSection';

interface EditDepartmentModalProps {
  isOpen: boolean;
  onClose: (success?: boolean) => void;
  department?: Department;
}

export const EditDepartmentModal: React.FC<EditDepartmentModalProps> = ({
  isOpen,
  onClose,
  department,
}) => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const photoInputRef = useRef<HTMLInputElement>(null);

  const [basic, setBasic] = useState<BasicDepartmentForm>(emptyBasicForm());
  const [head, setHead] = useState<HodForm>(emptyHodForm());
  const [faculty, setFaculty] = useState<FacultyForm>(emptyFacultyForm());
  const [facultyBulkList, setFacultyBulkList] = useState<FacultyForm[]>([]);

  useEffect(() => {
    if (!isOpen || !department?.id) return;

    const loadSetup = async () => {
      setFetching(true);
      setSubmitError(null);
      try {
        const res = await departmentAPI.getSetup(department.id);
        if (!res.data?.success || !res.data.data) {
          throw new Error(res.data?.message || 'Failed to load department');
        }
        const mapped = mapSetupResponseToForms(res.data.data);
        setBasic(mapped.basic);
        setHead(mapped.head);
        setFacultyBulkList(mapped.facultyList);
        setFaculty(emptyFacultyForm());
      } catch (err) {
        console.error('Failed to load department setup', err);
        setSubmitError(
          getApiErrorMessage(err, 'Failed to load department details.')
        );
      } finally {
        setFetching(false);
      }
    };

    loadSetup();
  }, [isOpen, department?.id]);

  if (!isOpen) return null;

  const validate = (): FieldErrors => {
    const bulkErr = validateFacultyBulkList(
      collectFacultyMembers(faculty, facultyBulkList)
    );
    const errs: FieldErrors = {
      ...validateBasicForm(basic),
      ...validateHodForm(head),
      ...validateFacultyStep(faculty, facultyBulkList),
    };
    if (bulkErr) errs.facultyBulk = bulkErr;
    return errs;
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const { base64, name } = await readProfilePhotoAsBase64(file);
      setFaculty((prev) => ({
        ...prev,
        profilePhoto: base64,
        profilePhotoName: name,
      }));
    } catch (err) {
      setSubmitError(getApiErrorMessage(err, 'Invalid profile photo'));
    }
    e.target.value = '';
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setSubmitError(null);

    if (!department?.id) return;

    setLoading(true);
    try {
      const members = collectFacultyMembers(faculty, facultyBulkList);
      const payload = buildSetupPayload(basic, head, members);
      const res = await departmentAPI.updateSetup(department.id, payload);
      if (!res.data?.success) {
        throw new Error(res.data?.message || 'Failed to update department');
      }
      setSuccessMessage(
        res.data?.message ||
          'Department updated successfully. Credential emails were sent to any new accounts.'
      );
      setShowSuccess(true);
    } catch (err) {
      console.error('Failed to update department', err);
      setSubmitError(getApiErrorMessage(err, 'Failed to update department.'));
    } finally {
      setLoading(false);
    }
  };

  const inputBase =
    'w-full px-3.5 py-2.5 border rounded-lg text-sm text-[#687b96] focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]';
  const inputOk = `${inputBase} border-[#d0d5dd]`;
  const inputErr = `${inputBase} border-red-400 bg-red-50`;
  const fi = (field: string) => (errors[field] ? inputErr : inputOk);
  const labelClass = 'block text-sm font-medium text-[#344054] mb-1.5';
  const errClass = 'text-xs text-red-500 mt-1';
  const selectBase = `${inputBase} appearance-none cursor-pointer`;
  const fs = (field: string) =>
    errors[field] ? `${selectBase} border-red-400 bg-red-50` : `${selectBase} border-[#d0d5dd]`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm font-sans">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[640px] max-h-[90vh] overflow-y-auto mx-4">
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#eaecf0] sticky top-0 bg-white rounded-t-2xl z-10">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-[#171822]">Edit Department Details</h2>
            <Pencil size={16} className="text-[#687b96]" />
          </div>
          <button
            type="button"
            onClick={() => onClose()}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {submitError && (
          <div className="mx-6 mt-4 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
            {submitError}
          </div>
        )}

        {fetching ? (
          <div className="flex items-center justify-center gap-2 py-20 text-[#687b96]">
            <Loader2 className="animate-spin" size={24} />
            <span>Loading department details...</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            <div className="px-6 py-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Department Name *</label>
                  <input
                    className={fi('departmentName')}
                    value={basic.departmentName}
                    onChange={(e) =>
                      setBasic({ ...basic, departmentName: e.target.value })
                    }
                  />
                  {errors.departmentName && (
                    <p className={errClass}>{errors.departmentName}</p>
                  )}
                </div>
                <div>
                  <label className={labelClass}>Total Faculty Count *</label>
                  <input
                    type="number"
                    min={0}
                    className={fi('totalFacultyCount')}
                    value={basic.totalFacultyCount}
                    onChange={(e) =>
                      setBasic({ ...basic, totalFacultyCount: e.target.value })
                    }
                  />
                  {errors.totalFacultyCount && (
                    <p className={errClass}>{errors.totalFacultyCount}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Total Student Count *</label>
                  <input
                    type="number"
                    min={0}
                    className={fi('totalStudentCount')}
                    value={basic.totalStudentCount}
                    onChange={(e) =>
                      setBasic({ ...basic, totalStudentCount: e.target.value })
                    }
                  />
                  {errors.totalStudentCount && (
                    <p className={errClass}>{errors.totalStudentCount}</p>
                  )}
                </div>
                <div>
                  <label className={labelClass}>HOD Name *</label>
                  <input
                    className={fi('hodName')}
                    value={head.hodName}
                    onChange={(e) => setHead({ ...head, hodName: e.target.value })}
                  />
                  {errors.hodName && <p className={errClass}>{errors.hodName}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>HOD Employee Code *</label>
                  <input
                    className={fi('hodEmployeeCode')}
                    value={head.hodEmployeeCode}
                    onChange={(e) =>
                      setHead({ ...head, hodEmployeeCode: e.target.value })
                    }
                  />
                  {errors.hodEmployeeCode && (
                    <p className={errClass}>{errors.hodEmployeeCode}</p>
                  )}
                </div>
                <div>
                  <label className={labelClass}>Mobile No *</label>
                  <input
                    type="tel"
                    className={fi('hodMobileNumber')}
                    value={head.mobileNumber}
                    onChange={(e) =>
                      setHead({
                        ...head,
                        mobileNumber: e.target.value.replace(/\D/g, ''),
                      })
                    }
                  />
                  {errors.hodMobileNumber && (
                    <p className={errClass}>{errors.hodMobileNumber}</p>
                  )}
                </div>
              </div>

              <div>
                <label className={labelClass}>Email ID *</label>
                <input
                  type="email"
                  className={fi('emailId')}
                  value={head.emailId}
                  onChange={(e) => setHead({ ...head, emailId: e.target.value })}
                />
                {errors.emailId && <p className={errClass}>{errors.emailId}</p>}
              </div>

              <div>
                <label className={labelClass}>Courses Offered</label>
                <div className="flex flex-wrap gap-5 mt-1">
                  {(
                    [
                      { key: 'undergraduate' as const, label: 'Undergraduate' },
                      { key: 'postgraduate' as const, label: 'Postgraduate' },
                      { key: 'phd' as const, label: 'PHD' },
                      { key: 'diploma' as const, label: 'Diploma' },
                    ] as const
                  ).map(({ key, label }) => (
                    <label key={key} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={!!basic.courses[key]}
                        onChange={(e) =>
                          setBasic({
                            ...basic,
                            courses: { ...basic.courses, [key]: e.target.checked },
                          })
                        }
                        className="w-4 h-4 text-blue-600 rounded border-gray-300 accent-[#0e1680]"
                      />
                      <span className="text-sm text-[#344054] font-medium">{label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <hr className="border-[#eaecf0]" />

              <FacultyBulkUploadSection
                facultyList={facultyBulkList}
                onFacultyListChange={setFacultyBulkList}
                disabled={loading}
              />
              {errors.facultyBulk && (
                <p className="text-sm text-red-600">{errors.facultyBulk}</p>
              )}

              <p className="text-sm font-medium text-[#667085]">Add or edit one faculty manually</p>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>
                    Faculty Name {facultyBulkList.length === 0 ? '*' : '(optional)'}
                  </label>
                  <input
                    className={fi('facultyName')}
                    value={faculty.facultyName}
                    onChange={(e) =>
                      setFaculty({ ...faculty, facultyName: e.target.value })
                    }
                  />
                  {errors.facultyName && (
                    <p className={errClass}>{errors.facultyName}</p>
                  )}
                </div>
                <div>
                  <label className={labelClass}>Mobile Number *</label>
                  <input
                    type="tel"
                    className={fi('mobileNumber')}
                    value={faculty.mobileNumber}
                    onChange={(e) =>
                      setFaculty({
                        ...faculty,
                        mobileNumber: e.target.value.replace(/\D/g, ''),
                      })
                    }
                  />
                  {errors.mobileNumber && (
                    <p className={errClass}>{errors.mobileNumber}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>College Email ID *</label>
                  <input
                    type="email"
                    className={fi('collegeEmailId')}
                    value={faculty.collegeEmailId}
                    onChange={(e) =>
                      setFaculty({ ...faculty, collegeEmailId: e.target.value })
                    }
                  />
                  {errors.collegeEmailId && (
                    <p className={errClass}>{errors.collegeEmailId}</p>
                  )}
                </div>
                <div>
                  <label className={labelClass}>Personal Email</label>
                  <input
                    type="email"
                    className={fi('personalEmailId')}
                    value={faculty.personalEmailId}
                    onChange={(e) =>
                      setFaculty({ ...faculty, personalEmailId: e.target.value })
                    }
                  />
                  {errors.personalEmailId && (
                    <p className={errClass}>{errors.personalEmailId}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Gender *</label>
                  <div className="relative">
                    <select
                      className={fs('gender')}
                      value={faculty.gender}
                      onChange={(e) =>
                        setFaculty({ ...faculty, gender: e.target.value })
                      }
                    >
                      <option value="">Select</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                    <ChevronDown
                      size={14}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                    />
                  </div>
                  {errors.gender && <p className={errClass}>{errors.gender}</p>}
                </div>
                <div>
                  <label className={labelClass}>Qualification *</label>
                  <div className="relative">
                    <select
                      className={fs('qualification')}
                      value={faculty.qualification}
                      onChange={(e) =>
                        setFaculty({ ...faculty, qualification: e.target.value })
                      }
                    >
                      <option value="">Select</option>
                      <option value="B.Tech">B.Tech</option>
                      <option value="M.Tech">M.Tech</option>
                      <option value="Ph.D">Ph.D</option>
                    </select>
                    <ChevronDown
                      size={14}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                    />
                  </div>
                  {errors.qualification && (
                    <p className={errClass}>{errors.qualification}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Specialization *</label>
                  <input
                    className={fi('specialization')}
                    value={faculty.specialization}
                    onChange={(e) =>
                      setFaculty({ ...faculty, specialization: e.target.value })
                    }
                  />
                  {errors.specialization && (
                    <p className={errClass}>{errors.specialization}</p>
                  )}
                </div>
                <div>
                  <label className={labelClass}>Designation *</label>
                  <div className="relative">
                    <select
                      className={fs('designation')}
                      value={faculty.designation}
                      onChange={(e) =>
                        setFaculty({ ...faculty, designation: e.target.value })
                      }
                    >
                      <option value="">Select</option>
                      <option value="Professor">Professor</option>
                      <option value="Associate Professor">Associate Professor</option>
                      <option value="Assistant Professor">Assistant Professor</option>
                    </select>
                    <ChevronDown
                      size={14}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                    />
                  </div>
                  {errors.designation && (
                    <p className={errClass}>{errors.designation}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Experience (Years) *</label>
                  <div className="relative">
                    <select
                      className={fs('experienceYears')}
                      value={faculty.experienceYears}
                      onChange={(e) =>
                        setFaculty({ ...faculty, experienceYears: e.target.value })
                      }
                    >
                      <option value="">Select</option>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                        <option key={n} value={String(n)}>
                          {n}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={14}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                    />
                  </div>
                  {errors.experienceYears && (
                    <p className={errClass}>{errors.experienceYears}</p>
                  )}
                </div>
                <div>
                  <label className={labelClass}>Subjects Assigned *</label>
                  <input
                    className={fi('subjectsAssigned')}
                    value={faculty.subjectsAssigned}
                    onChange={(e) =>
                      setFaculty({ ...faculty, subjectsAssigned: e.target.value })
                    }
                  />
                  {errors.subjectsAssigned && (
                    <p className={errClass}>{errors.subjectsAssigned}</p>
                  )}
                </div>
              </div>

              <div>
                <label className={labelClass}>Joining Date *</label>
                <div className="relative">
                  <input
                    type="date"
                    className={`${fi('joiningDate')} pr-10`}
                    value={faculty.joiningDate}
                    onChange={(e) =>
                      setFaculty({ ...faculty, joiningDate: e.target.value })
                    }
                  />
                  <Calendar
                    size={14}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                  />
                </div>
                {errors.joiningDate && (
                  <p className={errClass}>{errors.joiningDate}</p>
                )}
              </div>

              <div className="flex items-center gap-3">
                <input
                  ref={photoInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoUpload}
                />
                <button
                  type="button"
                  onClick={() => photoInputRef.current?.click()}
                  className="flex items-center gap-2 px-4 py-2 border border-[#d0d5dd] rounded-lg bg-white cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <Image size={18} className="text-[#687b96]" />
                  <span className="text-sm text-[#687b96]">Upload Profile Photo</span>
                </button>
                <span className="text-sm text-[#667085] italic">
                  {faculty.profilePhotoName || 'Optional'}
                </span>
              </div>
            </div>

            <div className="flex justify-end px-6 py-4 border-t border-[#eaecf0] sticky bottom-0 bg-white rounded-b-2xl">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-6 py-2.5 bg-[#0e1680] text-white text-sm font-semibold rounded-lg hover:bg-blue-900 transition-colors disabled:opacity-60"
              >
                {loading && <Loader2 size={16} className="animate-spin" />}
                {loading ? 'Saving...' : 'Save'}
              </button>
            </div>
          </form>
        )}
      </div>

      <FeedbackModal
        isOpen={showSuccess}
        type="edit_success"
        message={successMessage || 'Department updated successfully!'}
        onClose={() => {
          setShowSuccess(false);
          onClose(true);
        }}
      />
    </div>
  );
};
