import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Phone, Mail, ChevronDown, User, Calendar, Loader2 } from 'lucide-react';
import { departmentAPI, institutionAPI } from '../../../../services/api';
import type { Institution } from '../../../../types/institution.types';
import {
  emptyBasicForm,
  emptyFacultyForm,
  emptyHodForm,
  buildSetupPayload,
  collectFacultyMembers,
  validateBasicForm,
  validateHodForm,
  validateFacultyStep,
  validateFacultyBulkList,
  getApiErrorMessage,
  readProfilePhotoAsBase64,
  type BasicDepartmentForm,
  type HodForm,
  type FacultyForm,
  type FieldErrors,
} from '../../../../types/COE/departmentSetup';
import { FacultyBulkUploadSection } from './FacultyBulkUploadSection';
import { useUserScope } from '../../../../hooks/useUserScope';

interface AddDepartmentDetailsProps {
  onBack: () => void;
  onSuccess?: (message?: string) => void;
}

type TabKey = 'Basic Department Details' | 'Head Details' | 'Faculty details';

const TABS: TabKey[] = ['Basic Department Details', 'Head Details', 'Faculty details'];

export const AddDepartmentDetails: React.FC<AddDepartmentDetailsProps> = ({
  onBack,
  onSuccess,
}) => {
  const [activeTab, setActiveTab] = useState<TabKey>('Basic Department Details');
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [institutionsLoading, setInstitutionsLoading] = useState(true);
  const photoInputRef = useRef<HTMLInputElement>(null);

  const [basic, setBasic] = useState<BasicDepartmentForm>(emptyBasicForm());
  const [head, setHead] = useState<HodForm>(emptyHodForm());
  const [faculty, setFaculty] = useState<FacultyForm>(emptyFacultyForm());
  const [facultyBulkList, setFacultyBulkList] = useState<FacultyForm[]>([]);

  const { institutionId, isUnrestricted } = useUserScope();

  useEffect(() => {
    const loadInstitutions = async () => {
      try {
        const res = await institutionAPI.getAll();
        const list = res.data?.data || [];
        setInstitutions(list);
        const defaultId =
          !isUnrestricted && institutionId
            ? institutionId
            : list.length > 0
              ? list[0].institution_id
              : '';
        if (defaultId && !basic.institutionId) {
          setBasic((prev) => ({
            ...prev,
            institutionId: defaultId,
          }));
        }
      } catch (err) {
        console.error('Failed to load institutions', err);
        setSubmitError('Could not load institutions. Please try again.');
      } finally {
        setInstitutionsLoading(false);
      }
    };
    loadInstitutions();
  }, [institutionId, isUnrestricted]);

  const validateBasic = () => validateBasicForm(basic);
  const validateHead = () => validateHodForm(head);
  const validateFaculty = (): FieldErrors => {
    const bulkErr = validateFacultyBulkList(
      collectFacultyMembers(faculty, facultyBulkList)
    );
    if (bulkErr) return { facultyBulk: bulkErr };
    return validateFacultyStep(faculty, facultyBulkList);
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
      setSubmitError(null);
    } catch (err) {
      setSubmitError(getApiErrorMessage(err, 'Invalid profile photo'));
    }
    e.target.value = '';
  };

  const handleNext = async () => {
    setSubmitError(null);
    let errs: FieldErrors = {};
    if (activeTab === 'Basic Department Details') errs = validateBasic();
    else if (activeTab === 'Head Details') errs = validateHead();
    else if (activeTab === 'Faculty details') errs = validateFaculty();

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});

    const currentIndex = TABS.indexOf(activeTab);
    if (currentIndex < TABS.length - 1) {
      setActiveTab(TABS[currentIndex + 1]);
      return;
    }

    const allErrs = {
      ...validateBasic(),
      ...validateHead(),
      ...validateFaculty(),
    };
    if (Object.keys(allErrs).length > 0) {
      setErrors(allErrs);
      return;
    }

    setLoading(true);
    try {
      const members = collectFacultyMembers(faculty, facultyBulkList);
      const payload = buildSetupPayload(basic, head, members);
      const response = await departmentAPI.createSetup(payload);
      if (!response.data?.success) {
        throw new Error(response.data?.message || 'Failed to create department');
      }
      onSuccess?.(response.data?.message);
    } catch (error) {
      console.error('Failed to create department', error);
      setSubmitError(getApiErrorMessage(error, 'Failed to create department. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  const errClass = 'text-xs text-red-500 mt-1';
  const inputBase =
    'w-full px-3.5 py-2.5 bg-white border rounded-lg shadow-sm focus:ring-1 focus:ring-[#0e1680] focus:border-[#0e1680] outline-none text-base text-[#687b96]';
  const inputOk = `${inputBase} border-[#d0d5dd]`;
  const inputErr = `${inputBase} border-red-400 bg-red-50`;
  const fi = (field: string) => (errors[field] ? inputErr : inputOk);

  return (
    <div className="flex flex-col h-full bg-[#fcfcfd]">
      <div className="flex items-center gap-4 mb-5">
        <button
          type="button"
          onClick={onBack}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 border border-[#d0d5dd] rounded-lg bg-white text-sm font-semibold text-[#344054] hover:bg-gray-50 transition-colors shadow-sm disabled:opacity-50"
        >
          <ArrowLeft size={16} />
          Back
        </button>
        <h1 className="text-[28px] font-semibold text-[#171822] font-sans">Add Department Details</h1>
      </div>

      {submitError && (
        <div className="mb-4 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
          {submitError}
        </div>
      )}

      <div className="flex space-x-2 mb-10 bg-[#f2f3fd] p-1.5 rounded-[10px] w-fit border border-[#e5e7fb]">
        {TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => {
              setErrors({});
              setActiveTab(tab);
            }}
            disabled={loading}
            className={`px-6 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${
              activeTab === tab ? 'bg-[#0e1680] text-white shadow-md' : 'text-[#929292] hover:text-[#171822]'
            }`}
          >
            {tab === 'Faculty details' ? 'Faculty Details' : tab}
          </button>
        ))}
      </div>

      <div className="flex-1">
        {activeTab === 'Basic Department Details' && (
          <div className="space-y-8">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-[#344054]">Institution *</label>
              <div className="relative">
                <select
                  value={basic.institutionId}
                  onChange={(e) =>
                    setBasic({ ...basic, institutionId: e.target.value })
                  }
                  disabled={institutionsLoading || loading}
                  className={`${fi('institutionId')} appearance-none`}
                >
                  <option value="">
                    {institutionsLoading ? 'Loading...' : 'Select institution'}
                  </option>
                  {institutions.map((inst) => (
                    <option key={inst.institution_id} value={inst.institution_id}>
                      {inst.name}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={18}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#687b96] pointer-events-none"
                />
              </div>
              {errors.institutionId && (
                <p className={errClass}>{errors.institutionId}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-[#344054]">Department Name *</label>
              <input
                type="text"
                value={basic.departmentName}
                onChange={(e) =>
                  setBasic({ ...basic, departmentName: e.target.value })
                }
                className={fi('departmentName')}
              />
              {errors.departmentName && (
                <p className={errClass}>{errors.departmentName}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-[#344054]">
                  Total Faculty Count *
                </label>
                <input
                  type="number"
                  min={0}
                  value={basic.totalFacultyCount}
                  onChange={(e) =>
                    setBasic({ ...basic, totalFacultyCount: e.target.value })
                  }
                  className={fi('totalFacultyCount')}
                />
                {errors.totalFacultyCount && (
                  <p className={errClass}>{errors.totalFacultyCount}</p>
                )}
              </div>
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-[#344054]">
                  Total Student Count *
                </label>
                <input
                  type="number"
                  min={0}
                  value={basic.totalStudentCount}
                  onChange={(e) =>
                    setBasic({ ...basic, totalStudentCount: e.target.value })
                  }
                  className={fi('totalStudentCount')}
                />
                {errors.totalStudentCount && (
                  <p className={errClass}>{errors.totalStudentCount}</p>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-medium text-[#344054]">Courses Offered</label>
              <div className="flex flex-wrap gap-8">
                {(
                  [
                    { key: 'undergraduate' as const, label: 'Undergraduate' },
                    { key: 'postgraduate' as const, label: 'Postgraduate' },
                    { key: 'phd' as const, label: 'PHD' },
                    { key: 'diploma' as const, label: 'Diploma' },
                  ] as const
                ).map(({ key, label }) => (
                  <label key={key} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={!!basic.courses[key]}
                      onChange={(e) =>
                        setBasic({
                          ...basic,
                          courses: { ...basic.courses, [key]: e.target.checked },
                        })
                      }
                      className="w-5 h-5 rounded border-gray-300 text-[#0e1680] focus:ring-[#0e1680] cursor-pointer"
                    />
                    <span className="text-sm font-medium text-[#344054] group-hover:text-[#171822]">
                      {label}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Head Details' && (
          <div className="space-y-8">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-[#344054]">HOD Name *</label>
              <input
                type="text"
                value={head.hodName}
                onChange={(e) => setHead({ ...head, hodName: e.target.value })}
                className={fi('hodName')}
              />
              {errors.hodName && <p className={errClass}>{errors.hodName}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-[#344054]">
                HOD Employee Code *
              </label>
              <input
                type="text"
                value={head.hodEmployeeCode}
                onChange={(e) =>
                  setHead({ ...head, hodEmployeeCode: e.target.value })
                }
                className={fi('hodEmployeeCode')}
              />
              {errors.hodEmployeeCode && (
                <p className={errClass}>{errors.hodEmployeeCode}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-[#344054]">Mobile Number *</label>
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 text-[#687b96] pr-2 border-r border-[#d0d5dd]">
                    <Phone size={20} />
                  </div>
                  <input
                    type="tel"
                    maxLength={15}
                    value={head.mobileNumber}
                    onChange={(e) =>
                      setHead({
                        ...head,
                        mobileNumber: e.target.value.replace(/\D/g, ''),
                      })
                    }
                    className={`${fi('hodMobileNumber')} pl-14`}
                  />
                </div>
                {errors.hodMobileNumber && (
                  <p className={errClass}>{errors.hodMobileNumber}</p>
                )}
              </div>
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-[#344054]">Email ID *</label>
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 text-[#687b96] pr-2 border-r border-[#d0d5dd]">
                    <Mail size={20} />
                  </div>
                  <input
                    type="email"
                    value={head.emailId}
                    onChange={(e) => setHead({ ...head, emailId: e.target.value })}
                    className={`${fi('emailId')} pl-14`}
                  />
                </div>
                {errors.emailId && <p className={errClass}>{errors.emailId}</p>}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Faculty details' && (
          <div className="space-y-8">
            <FacultyBulkUploadSection
              facultyList={facultyBulkList}
              onFacultyListChange={setFacultyBulkList}
              disabled={loading}
            />
            {errors.facultyBulk && (
              <p className="text-sm text-red-600 -mt-4">{errors.facultyBulk}</p>
            )}

            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-[#eaecf0]" />
              <span className="text-sm font-medium text-[#667085]">Or add faculty manually</span>
              <div className="flex-1 h-px bg-[#eaecf0]" />
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-[#344054]">
                Faculty Name {facultyBulkList.length === 0 ? '*' : '(optional if bulk uploaded)'}
              </label>
              <input
                type="text"
                value={faculty.facultyName}
                onChange={(e) =>
                  setFaculty({ ...faculty, facultyName: e.target.value })
                }
                className={fi('facultyName')}
              />
              {errors.facultyName && <p className={errClass}>{errors.facultyName}</p>}
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-[#344054]">Mobile Number *</label>
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 text-[#687b96] pr-2 border-r border-[#d0d5dd]">
                    <Phone size={20} />
                  </div>
                  <input
                    type="tel"
                    maxLength={15}
                    value={faculty.mobileNumber}
                    onChange={(e) =>
                      setFaculty({
                        ...faculty,
                        mobileNumber: e.target.value.replace(/\D/g, ''),
                      })
                    }
                    className={`${fi('mobileNumber')} pl-14`}
                  />
                </div>
                {errors.mobileNumber && (
                  <p className={errClass}>{errors.mobileNumber}</p>
                )}
              </div>
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-[#344054]">
                  College Email ID *
                </label>
                <input
                  type="email"
                  value={faculty.collegeEmailId}
                  onChange={(e) =>
                    setFaculty({ ...faculty, collegeEmailId: e.target.value })
                  }
                  className={fi('collegeEmailId')}
                />
                {errors.collegeEmailId && (
                  <p className={errClass}>{errors.collegeEmailId}</p>
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-[#344054]">Personal Email ID</label>
              <input
                type="email"
                value={faculty.personalEmailId}
                onChange={(e) =>
                  setFaculty({ ...faculty, personalEmailId: e.target.value })
                }
                className={fi('personalEmailId')}
              />
              {errors.personalEmailId && (
                <p className={errClass}>{errors.personalEmailId}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-[#344054]">Gender *</label>
              <div className="relative">
                <select
                  value={faculty.gender}
                  onChange={(e) => setFaculty({ ...faculty, gender: e.target.value })}
                  className={`${fi('gender')} appearance-none`}
                >
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                <ChevronDown
                  size={18}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#687b96] pointer-events-none"
                />
              </div>
              {errors.gender && <p className={errClass}>{errors.gender}</p>}
            </div>

            <div className="grid grid-cols-2 gap-x-8 gap-y-6">
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-[#344054]">Qualification *</label>
                <div className="relative">
                  <select
                    value={faculty.qualification}
                    onChange={(e) =>
                      setFaculty({ ...faculty, qualification: e.target.value })
                    }
                    className={`${fi('qualification')} appearance-none`}
                  >
                    <option value="">Select</option>
                    <option value="Ph.D">Ph.D</option>
                    <option value="M.Tech">M.Tech</option>
                    <option value="B.Tech">B.Tech</option>
                  </select>
                  <ChevronDown
                    size={16}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                  />
                </div>
                {errors.qualification && (
                  <p className={errClass}>{errors.qualification}</p>
                )}
              </div>
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-[#344054]">Specialization *</label>
                <input
                  type="text"
                  value={faculty.specialization}
                  onChange={(e) =>
                    setFaculty({ ...faculty, specialization: e.target.value })
                  }
                  className={fi('specialization')}
                />
                {errors.specialization && (
                  <p className={errClass}>{errors.specialization}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-8 gap-y-6">
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-[#344054]">Designation *</label>
                <div className="relative">
                  <select
                    value={faculty.designation}
                    onChange={(e) =>
                      setFaculty({ ...faculty, designation: e.target.value })
                    }
                    className={`${fi('designation')} appearance-none`}
                  >
                    <option value="">Select</option>
                    <option value="Professor">Professor</option>
                    <option value="Associate Professor">Associate Professor</option>
                    <option value="Assistant Professor">Assistant Professor</option>
                  </select>
                  <ChevronDown
                    size={16}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                  />
                </div>
                {errors.designation && (
                  <p className={errClass}>{errors.designation}</p>
                )}
              </div>
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-[#344054]">
                  Experience (Years) *
                </label>
                <div className="relative">
                  <select
                    value={faculty.experienceYears}
                    onChange={(e) =>
                      setFaculty({ ...faculty, experienceYears: e.target.value })
                    }
                    className={`${fi('experienceYears')} appearance-none`}
                  >
                    <option value="">Select</option>
                    {[...Array(20)].map((_, i) => (
                      <option key={i + 1} value={String(i + 1)}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={16}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                  />
                </div>
                {errors.experienceYears && (
                  <p className={errClass}>{errors.experienceYears}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-8 gap-y-6">
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-[#344054]">
                  Subjects Assigned *
                </label>
                <input
                  type="text"
                  value={faculty.subjectsAssigned}
                  onChange={(e) =>
                    setFaculty({ ...faculty, subjectsAssigned: e.target.value })
                  }
                  placeholder="e.g. DBMS, Networks"
                  className={fi('subjectsAssigned')}
                />
                {errors.subjectsAssigned && (
                  <p className={errClass}>{errors.subjectsAssigned}</p>
                )}
              </div>
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-[#344054]">Joining Date *</label>
                <div className="relative">
                  <input
                    type="date"
                    value={faculty.joiningDate}
                    onChange={(e) =>
                      setFaculty({ ...faculty, joiningDate: e.target.value })
                    }
                    className={`${fi('joiningDate')} pr-10`}
                  />
                  <Calendar
                    size={18}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                  />
                </div>
                {errors.joiningDate && (
                  <p className={errClass}>{errors.joiningDate}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4 pt-2">
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
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 border border-[#d0d5dd] rounded-lg bg-white text-sm font-semibold text-[#0e1680] hover:bg-gray-50 transition-colors shadow-sm disabled:opacity-50"
              >
                <div className="p-1 rounded bg-[#f2f3fd] text-[#0e1680]">
                  <User size={14} />
                </div>
                Upload Profile Photo
              </button>
              <span className="text-sm text-[#667085] italic">
                {faculty.profilePhotoName || 'Optional — PNG/JPG, max 2MB'}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="mt-12 flex justify-end">
        <button
          type="button"
          onClick={handleNext}
          disabled={loading}
          className="flex items-center gap-2 px-10 py-3 bg-[#0e1680] text-white text-base font-semibold rounded-lg hover:bg-[#0a1060] transition-all shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              <span>Submitting...</span>
            </>
          ) : (
            <>
              <span>{activeTab === 'Faculty details' ? 'Submit' : 'Next'}</span>
              <ArrowRight size={20} />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
