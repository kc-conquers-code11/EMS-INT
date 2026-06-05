import React, { useState } from 'react';
import type { FeedbackModalProps } from '../../../types/COE/department';
import { SuccessIcon, DeleteSuccessIcon } from '../../shared/ModalIcons';
import { X, Pencil, ChevronDown, Calendar, Image } from 'lucide-react';

/**
 * Unified Feedback Modal (Success/Confirmation)
 */
export const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, type, message, onClose, onConfirm }) => {
  if (!isOpen) return null;

  const getConfig = () => {
    switch (type) {
      case 'edit_success':
        return { 
          icon: (
            <div className="w-[120px] h-[120px] flex items-center justify-center">
              <SuccessIcon size={120} />
            </div>
          ), 
          title: message || 'Department edited successfully !!', 
          primaryBtn: 'Back', 
          showSecondary: false 
        };
      case 'delete_confirm':
        return { 
          icon: (
            <div className="w-[120px] h-[120px] flex items-center justify-center">
              <svg width="100" height="100" viewBox="0 0 91.3333 91.3333" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M45.6667 62.3333V45.6667M45.6667 29H45.7083M87.3333 45.6667C87.3333 68.6785 68.6785 87.3333 45.6667 87.3333C22.6548 87.3333 4 68.6785 4 45.6667C4 22.6548 22.6548 4 45.6667 4C68.6785 4 87.3333 22.6548 87.3333 45.6667Z" stroke="#FF4141" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          ), 
          title: message || 'Do you really want to delete this Department?', 
          primaryBtn: 'Delete', 
          secondaryBtn: 'Cancel', 
          showSecondary: true 
        };
      case 'delete_success':
        return { 
          icon: (
            <div className="w-[120px] h-[120px] flex items-center justify-center">
              <DeleteSuccessIcon size={120} />
            </div>
          ), 
          title: message || 'Department deleted successfully !!', 
          primaryBtn: 'Back', 
          showSecondary: false 
        };
    }
  };

  const config = getConfig();

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center font-sans" style={{ background: 'rgba(16,24,40,0.6)', backdropFilter: 'blur(4px)' }}>
      <div className="bg-white flex flex-col items-center justify-center rounded-[20px] shadow-2xl" style={{ width: '510px', height: '442px' }}>
        <div className="flex flex-col items-center gap-[40px] w-full px-8">
          <div className="flex flex-col items-center gap-[10px] w-full">
            {config.icon}
            <h2 className="text-[24px] font-semibold text-black text-center max-w-[444px] leading-[32px]">
              {config.title}
            </h2>
          </div>
          <div className="flex gap-[40px] items-center justify-center w-[212px]">
            {type === 'delete_confirm' ? (
              <>
                <button 
                  onClick={onConfirm} 
                  className="bg-[#0e1680] flex items-center justify-center h-[44px] w-[86px] text-white text-[16px] font-semibold rounded-[8px] hover:bg-blue-900 transition-all shadow-md"
                >
                  {config.primaryBtn}
                </button>
                <button 
                  onClick={onClose} 
                  className="bg-[#0e1680] flex items-center justify-center h-[44px] w-[86px] text-white text-[16px] font-semibold rounded-[8px] hover:bg-blue-900 transition-all shadow-md"
                >
                  {config.secondaryBtn}
                </button>
              </>
            ) : (
              <button 
                onClick={onClose} 
                className="bg-[#0e1680] flex items-center justify-center h-[44px] px-10 text-white text-[16px] font-semibold rounded-[8px] hover:bg-blue-900 transition-all shadow-md min-w-[120px]"
              >
                {config.primaryBtn}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

interface EditDepartmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FieldErrors {
  [key: string]: string;
}

export const EditDepartmentModal: React.FC<EditDepartmentModalProps> = ({ isOpen, onClose }) => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});

  const [form, setForm] = useState({
    departmentName: 'ABC',
    totalFacultyCount: '120',
    totalStudentCount: '800',
    hodName: 'ABC',
    hodEmployeeCode: '2020',
    mobileNo: '2021',
    emailId: '',
    creditSystemType: '',
    totalCreditsRequired: '123',
    gradingSystem: 'Percentage',
    coursesOffered: { undergraduate: true, postgraduate: true, phd: false, xyz1: false, xyz2: false },
    facultyName: 'Information Technology',
    mobileNumber: '9090909090',
    collegeEmailId: 'abc@pvppcoe.ac.in',
    gender: 'Male',
    qualification: '',
    specialization: '',
    designation: '',
    experienceYears: '',
    subjectsAssigned: '',
    joiningDate: '',
  });

  if (!isOpen) return null;

  const validate = (): FieldErrors => {
    const e: FieldErrors = {};
    if (!form.departmentName.trim()) e.departmentName = 'Department Name is required';
    if (!form.totalFacultyCount.trim()) e.totalFacultyCount = 'Total Faculty Count is required';
    if (!form.totalStudentCount.trim()) e.totalStudentCount = 'Total Student Count is required';
    if (!form.hodName.trim()) e.hodName = 'HOD Name is required';
    if (!form.hodEmployeeCode.trim()) e.hodEmployeeCode = 'HOD Employee Code is required';
    if (!form.mobileNo.trim()) e.mobileNo = 'Mobile No is required';
    else if (!/^\d{10}$/.test(form.mobileNo)) e.mobileNo = 'Enter a valid 10-digit mobile number';
    if (!form.emailId.trim()) e.emailId = 'Email ID is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.emailId)) e.emailId = 'Enter a valid email address';
    if (!form.creditSystemType) e.creditSystemType = 'Credit System Type is required';
    if (!form.totalCreditsRequired.trim() || Number(form.totalCreditsRequired) <= 0)
      e.totalCreditsRequired = 'Total Credits must be greater than zero';
    if (!form.gradingSystem) e.gradingSystem = 'Grading System is required';
    if (!form.facultyName.trim()) e.facultyName = 'Faculty Name is required';
    if (!form.mobileNumber.trim()) e.mobileNumber = 'Mobile Number is required';
    else if (!/^\d{10}$/.test(form.mobileNumber)) e.mobileNumber = 'Enter a valid 10-digit mobile number';
    if (!form.collegeEmailId.trim()) e.collegeEmailId = 'College Email ID is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.collegeEmailId)) e.collegeEmailId = 'Enter a valid email address';
    if (!form.gender.trim()) e.gender = 'Gender is required';
    if (!form.qualification) e.qualification = 'Qualification is required';
    if (!form.specialization.trim()) e.specialization = 'Specialization is required';
    if (!form.designation) e.designation = 'Designation is required';
    if (!form.experienceYears) e.experienceYears = 'Experience is required';
    if (!form.subjectsAssigned) e.subjectsAssigned = 'Subjects Assigned is required';
    if (!form.joiningDate) e.joiningDate = 'Joining Date is required';
    return e;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setShowSuccess(true);
  };

  const inputBase = 'w-full px-3.5 py-2.5 border rounded-lg text-sm text-[#687b96] focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]';
  const inputOk = `${inputBase} border-[#d0d5dd]`;
  const inputErr = `${inputBase} border-red-400 bg-red-50`;
  const fi = (field: string) => (errors[field] ? inputErr : inputOk);
  const labelClass = 'block text-sm font-medium text-[#344054] mb-1.5';
  const errClass = 'text-xs text-red-500 mt-1';
  const selectBase = `${inputBase} appearance-none cursor-pointer`;
  const fs = (field: string) => (errors[field] ? `${selectBase} border-red-400 bg-red-50` : `${selectBase} border-[#d0d5dd]`);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm font-sans">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[640px] max-h-[90vh] overflow-y-auto mx-4">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#eaecf0] sticky top-0 bg-white rounded-t-2xl z-10">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-[#171822]">Edit Department Details</h2>
            <Pencil size={16} className="text-[#687b96]" />
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} noValidate>
          <div className="px-6 py-6 space-y-5">

            {/* Row 1 */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Department Name</label>
                <input className={fi('departmentName')} value={form.departmentName} onChange={e => setForm({ ...form, departmentName: e.target.value })} />
                {errors.departmentName && <p className={errClass}>{errors.departmentName}</p>}
              </div>
              <div>
                <label className={labelClass}>Total Faculty Count</label>
                <input type="number" className={fi('totalFacultyCount')} value={form.totalFacultyCount} onChange={e => setForm({ ...form, totalFacultyCount: e.target.value })} />
                {errors.totalFacultyCount && <p className={errClass}>{errors.totalFacultyCount}</p>}
              </div>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Total Student Count</label>
                <input type="number" className={fi('totalStudentCount')} value={form.totalStudentCount} onChange={e => setForm({ ...form, totalStudentCount: e.target.value })} />
                {errors.totalStudentCount && <p className={errClass}>{errors.totalStudentCount}</p>}
              </div>
              <div>
                <label className={labelClass}>HOD Name</label>
                <input className={fi('hodName')} value={form.hodName} onChange={e => setForm({ ...form, hodName: e.target.value })} />
                {errors.hodName && <p className={errClass}>{errors.hodName}</p>}
              </div>
            </div>

            {/* Row 3 */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>HOD Employee Code</label>
                <input className={fi('hodEmployeeCode')} value={form.hodEmployeeCode} onChange={e => setForm({ ...form, hodEmployeeCode: e.target.value })} />
                {errors.hodEmployeeCode && <p className={errClass}>{errors.hodEmployeeCode}</p>}
              </div>
              <div>
                <label className={labelClass}>Mobile No</label>
                <input type="number" className={fi('mobileNo')} value={form.mobileNo} onChange={e => setForm({ ...form, mobileNo: e.target.value })} />
                {errors.mobileNo && <p className={errClass}>{errors.mobileNo}</p>}
              </div>
            </div>

            {/* Row 4 */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Email ID</label>
                <input type="email" className={fi('emailId')} value={form.emailId} onChange={e => setForm({ ...form, emailId: e.target.value })} />
                {errors.emailId && <p className={errClass}>{errors.emailId}</p>}
              </div>
              <div>
                <label className={labelClass}>Credit System Type</label>
                <div className="relative">
                  <select className={fs('creditSystemType')} value={form.creditSystemType} onChange={e => setForm({ ...form, creditSystemType: e.target.value })}>
                    <option value=""></option>
                    <option>Credits</option>
                    <option>Units</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
                {errors.creditSystemType && <p className={errClass}>{errors.creditSystemType}</p>}
              </div>
            </div>

            {/* Row 5 */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Total Credits Required</label>
                <input type="number" name="totalCreditsRequired" className={fi('totalCreditsRequired')} value={form.totalCreditsRequired} onChange={e => setForm({ ...form, totalCreditsRequired: e.target.value })} />
                {errors.totalCreditsRequired && <p className={errClass}>{errors.totalCreditsRequired}</p>}
              </div>
              <div>
                <label className={labelClass}>Grading System</label>
                <div className="relative">
                  <select className={fs('gradingSystem')} value={form.gradingSystem} onChange={e => setForm({ ...form, gradingSystem: e.target.value })}>
                    <option>Percentage</option>
                    <option>GPA</option>
                    <option>CGPA</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
                {errors.gradingSystem && <p className={errClass}>{errors.gradingSystem}</p>}
              </div>
            </div>

            {/* Courses Offered */}
            <div>
              <label className={labelClass}>Courses Offered</label>
              <div className="flex flex-wrap gap-5 mt-1">
                {[
                  { key: 'undergraduate', label: 'Undergraduate' },
                  { key: 'postgraduate', label: 'Postgraduate' },
                  { key: 'phd', label: 'PHD' },
                  { key: 'xyz1', label: 'XYZ' },
                  { key: 'xyz2', label: 'XYZ' },
                ].map(({ key, label }) => (
                  <label key={key} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.coursesOffered[key as keyof typeof form.coursesOffered]}
                      onChange={e => setForm({ ...form, coursesOffered: { ...form.coursesOffered, [key]: e.target.checked } })}
                      className="w-4 h-4 text-blue-600 rounded border-gray-300 accent-[#0e1680]"
                    />
                    <span className="text-sm text-[#344054] font-medium">{label}</span>
                  </label>
                ))}
              </div>
            </div>

            <hr className="border-[#eaecf0]" />

            {/* Faculty Row 1 */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Faculty Name</label>
                <input className={fi('facultyName')} value={form.facultyName} onChange={e => setForm({ ...form, facultyName: e.target.value })} />
                {errors.facultyName && <p className={errClass}>{errors.facultyName}</p>}
              </div>
              <div>
                <label className={labelClass}>Mobile Number</label>
                <input type="number" className={fi('mobileNumber')} value={form.mobileNumber} onChange={e => setForm({ ...form, mobileNumber: e.target.value })} />
                {errors.mobileNumber && <p className={errClass}>{errors.mobileNumber}</p>}
              </div>
            </div>

            {/* Faculty Row 2 */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>College Email ID</label>
                <input type="email" className={fi('collegeEmailId')} value={form.collegeEmailId} onChange={e => setForm({ ...form, collegeEmailId: e.target.value })} />
                {errors.collegeEmailId && <p className={errClass}>{errors.collegeEmailId}</p>}
              </div>
              <div>
                <label className={labelClass}>Gender</label>
                <input className={fi('gender')} value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })} />
                {errors.gender && <p className={errClass}>{errors.gender}</p>}
              </div>
            </div>

            {/* Faculty Row 3 */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Qualification</label>
                <div className="relative">
                  <select className={fs('qualification')} value={form.qualification} onChange={e => setForm({ ...form, qualification: e.target.value })}>
                    <option value=""></option>
                    <option>B.Tech</option><option>M.Tech</option><option>PhD</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
                {errors.qualification && <p className={errClass}>{errors.qualification}</p>}
              </div>
              <div>
                <label className={labelClass}>Specialization</label>
                <input className={fi('specialization')} value={form.specialization} onChange={e => setForm({ ...form, specialization: e.target.value })} />
                {errors.specialization && <p className={errClass}>{errors.specialization}</p>}
              </div>
            </div>

            {/* Faculty Row 4 */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Designation</label>
                <div className="relative">
                  <select className={fs('designation')} value={form.designation} onChange={e => setForm({ ...form, designation: e.target.value })}>
                    <option value=""></option>
                    <option>Professor</option><option>Asst. Professor</option><option>Lecturer</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
                {errors.designation && <p className={errClass}>{errors.designation}</p>}
              </div>
              <div>
                <label className={labelClass}>Experience (Years)</label>
                <div className="relative">
                  <select className={fs('experienceYears')} value={form.experienceYears} onChange={e => setForm({ ...form, experienceYears: e.target.value })}>
                    <option value=""></option>
                    {[1,2,3,4,5,6,7,8,9,10].map(n => <option key={n}>{n}</option>)}
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
                {errors.experienceYears && <p className={errClass}>{errors.experienceYears}</p>}
              </div>
            </div>

            {/* Faculty Row 5 */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Subjects Assigned</label>
                <div className="relative">
                  <select className={fs('subjectsAssigned')} value={form.subjectsAssigned} onChange={e => setForm({ ...form, subjectsAssigned: e.target.value })}>
                    <option value=""></option>
                    <option>Math</option><option>Physics</option><option>CS</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
                {errors.subjectsAssigned && <p className={errClass}>{errors.subjectsAssigned}</p>}
              </div>
              <div>
                <label className={labelClass}>Joining Date</label>
                <div className="relative">
                  <input type="date" className={`${fi('joiningDate')} pr-10`} value={form.joiningDate} onChange={e => setForm({ ...form, joiningDate: e.target.value })} />
                  <Calendar size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
                {errors.joiningDate && <p className={errClass}>{errors.joiningDate}</p>}
              </div>
            </div>

            {/* Upload Photo */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-4 py-2 border border-[#d0d5dd] rounded-lg bg-white cursor-pointer hover:bg-gray-50 transition-colors">
                <Image size={18} className="text-[#687b96]" />
                <span className="text-sm text-[#687b96]">user_photo.pdf</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end px-6 py-4 border-t border-[#eaecf0] sticky bottom-0 bg-white rounded-b-2xl">
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#0e1680] text-white text-sm font-semibold rounded-lg hover:bg-blue-900 transition-colors shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]"
            >
              Submit
            </button>
          </div>
        </form>
      </div>

      <FeedbackModal
        isOpen={showSuccess}
        type="edit_success"
        onClose={() => { setShowSuccess(false); onClose(); }}
      />
    </div>
  );
};
