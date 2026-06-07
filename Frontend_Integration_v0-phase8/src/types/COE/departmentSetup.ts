export interface CoursesOffered {
  undergraduate?: boolean;
  postgraduate?: boolean;
  phd?: boolean;
  diploma?: boolean;
  [key: string]: boolean | undefined;
}

export interface DepartmentSetupPayload {
  institution_id: string;
  department: {
    depart_name: string;
    depart_code?: string | null;
    total_faculties: number;
    total_students: number;
    courses_offered?: CoursesOffered;
  };
  hod: {
    hod_id?: string;
    name: string;
    employee_code: string;
    mobile_number: string;
    email: string;
  };
  faculty_members: Array<{
    faculty_id?: string;
    name: string;
    mobile_number: string;
    college_email: string;
    personal_email?: string | null;
    gender: 'Male' | 'Female' | 'Other';
    qualification: string;
    specialization: string;
    designation: string;
    experience_years: number;
    subjects_assigned: string;
    joining_date: string;
    profile_photo?: string | null;
    branch_id?: string;
  }>;
}

export interface DepartmentSetupResponse {
  department: Record<string, unknown>;
  hod: Record<string, unknown> | null;
  faculty_members: Array<Record<string, unknown>>;
}

export interface BasicDepartmentForm {
  institutionId: string;
  departmentName: string;
  totalFacultyCount: string;
  totalStudentCount: string;
  courses: CoursesOffered;
}

export interface HodForm {
  hodId?: string;
  hodName: string;
  hodEmployeeCode: string;
  mobileNumber: string;
  emailId: string;
}

export interface FacultyForm {
  facultyId?: string;
  facultyName: string;
  mobileNumber: string;
  collegeEmailId: string;
  personalEmailId: string;
  gender: string;
  qualification: string;
  specialization: string;
  designation: string;
  experienceYears: string;
  subjectsAssigned: string;
  joiningDate: string;
  profilePhoto: string | null;
  profilePhotoName: string;
}

export const emptyBasicForm = (): BasicDepartmentForm => ({
  institutionId: '',
  departmentName: '',
  totalFacultyCount: '',
  totalStudentCount: '',
  courses: {
    undergraduate: false,
    postgraduate: false,
    phd: false,
    diploma: false,
  },
});

export const emptyHodForm = (): HodForm => ({
  hodName: '',
  hodEmployeeCode: '',
  mobileNumber: '',
  emailId: '',
});

export const emptyFacultyForm = (): FacultyForm => ({
  facultyName: '',
  mobileNumber: '',
  collegeEmailId: '',
  personalEmailId: '',
  gender: '',
  qualification: '',
  specialization: '',
  designation: '',
  experienceYears: '',
  subjectsAssigned: '',
  joiningDate: '',
  profilePhoto: null,
  profilePhotoName: '',
});

export type FieldErrors = Record<string, string>;

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const mobileRegex = /^\d{10}$/;

export const sanitizeCourses = (courses: CoursesOffered): CoursesOffered => ({
  undergraduate: !!courses.undergraduate,
  postgraduate: !!courses.postgraduate,
  phd: !!courses.phd,
  diploma: !!courses.diploma,
});

export const validateBasicForm = (basic: BasicDepartmentForm): FieldErrors => {
  const e: FieldErrors = {};
  if (!basic.institutionId.trim()) e.institutionId = 'Institution is required';
  if (!basic.departmentName.trim()) e.departmentName = 'Department Name is required';
  if (!basic.totalFacultyCount.trim()) e.totalFacultyCount = 'Total Faculty Count is required';
  else if (Number(basic.totalFacultyCount) < 0) e.totalFacultyCount = 'Enter a valid count';
  if (!basic.totalStudentCount.trim()) e.totalStudentCount = 'Total Student Count is required';
  else if (Number(basic.totalStudentCount) < 0) e.totalStudentCount = 'Enter a valid count';
  return e;
};

export const validateHodForm = (head: HodForm): FieldErrors => {
  const e: FieldErrors = {};
  if (!head.hodName.trim()) e.hodName = 'HOD Name is required';
  if (!head.hodEmployeeCode.trim()) e.hodEmployeeCode = 'HOD Employee Code is required';
  if (!head.mobileNumber.trim()) e.hodMobileNumber = 'Mobile Number is required';
  else if (!mobileRegex.test(head.mobileNumber)) {
    e.hodMobileNumber = 'Enter a valid 10-digit mobile number';
  }
  if (!head.emailId.trim()) e.emailId = 'Email ID is required';
  else if (!emailRegex.test(head.emailId)) e.emailId = 'Enter a valid email address';
  return e;
};

export const validateFacultyForm = (faculty: FacultyForm): FieldErrors => {
  const e: FieldErrors = {};
  if (!faculty.facultyName.trim()) e.facultyName = 'Faculty Name is required';
  if (!faculty.mobileNumber.trim()) e.mobileNumber = 'Mobile Number is required';
  else if (!mobileRegex.test(faculty.mobileNumber)) e.mobileNumber = 'Enter a valid 10-digit mobile number';
  if (!faculty.collegeEmailId.trim()) e.collegeEmailId = 'College Email ID is required';
  else if (!emailRegex.test(faculty.collegeEmailId)) e.collegeEmailId = 'Enter a valid email address';
  if (faculty.personalEmailId.trim() && !emailRegex.test(faculty.personalEmailId)) {
    e.personalEmailId = 'Enter a valid personal email address';
  }
  if (!faculty.gender) e.gender = 'Gender is required';
  if (!faculty.qualification) e.qualification = 'Qualification is required';
  if (!faculty.specialization.trim()) e.specialization = 'Specialization is required';
  if (!faculty.designation) e.designation = 'Designation is required';
  if (!faculty.experienceYears) e.experienceYears = 'Experience is required';
  if (!faculty.subjectsAssigned) e.subjectsAssigned = 'Subjects Assigned is required';
  if (!faculty.joiningDate) e.joiningDate = 'Joining Date is required';
  return e;
};

export const readProfilePhotoAsBase64 = (
  file: File
): Promise<{ base64: string; name: string }> =>
  new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('Please upload an image file (PNG, JPG, etc.)'));
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      reject(new Error('Profile photo must be under 2MB'));
      return;
    }
    const reader = new FileReader();
    reader.onload = () =>
      resolve({ base64: reader.result as string, name: file.name });
    reader.onerror = () => reject(new Error('Failed to read profile photo'));
    reader.readAsDataURL(file);
  });

export const facultyFormToMember = (faculty: FacultyForm) => ({
  ...(faculty.facultyId ? { faculty_id: faculty.facultyId } : {}),
  name: faculty.facultyName.trim(),
  mobile_number: faculty.mobileNumber.trim(),
  college_email: faculty.collegeEmailId.trim(),
  personal_email: faculty.personalEmailId.trim() || null,
  gender: faculty.gender as 'Male' | 'Female' | 'Other',
  qualification: faculty.qualification,
  specialization: faculty.specialization.trim(),
  designation: faculty.designation,
  experience_years: Number(faculty.experienceYears),
  subjects_assigned: faculty.subjectsAssigned,
  joining_date: faculty.joiningDate,
  profile_photo: faculty.profilePhoto,
});

/** Merge manual form (if filled) with bulk-uploaded rows; dedupe by college email. */
export const collectFacultyMembers = (
  manual: FacultyForm,
  bulkList: FacultyForm[]
): FacultyForm[] => {
  const byEmail = new Map<string, FacultyForm>();
  for (const row of bulkList) {
    if (row.collegeEmailId.trim()) {
      byEmail.set(row.collegeEmailId.trim().toLowerCase(), row);
    }
  }
  if (manual.facultyName.trim() && manual.collegeEmailId.trim()) {
    byEmail.set(manual.collegeEmailId.trim().toLowerCase(), manual);
  }
  return Array.from(byEmail.values());
};

export const validateFacultyStep = (
  manual: FacultyForm,
  bulkList: FacultyForm[]
): FieldErrors => {
  if (bulkList.length > 0) return {};
  return validateFacultyForm(manual);
};

export const validateFacultyBulkList = (list: FacultyForm[]): string | null => {
  if (list.length === 0) {
    return 'Upload an Excel file with faculty details or fill the form below.';
  }
  const emails = new Set<string>();
  for (let i = 0; i < list.length; i++) {
    const rowErrs = validateFacultyForm(list[i]);
    if (Object.keys(rowErrs).length > 0) {
      return `Row ${i + 1}: ${Object.values(rowErrs)[0]}`;
    }
    const key = list[i].collegeEmailId.toLowerCase();
    if (emails.has(key)) {
      return `Duplicate college email: ${list[i].collegeEmailId}`;
    }
    emails.add(key);
  }
  return null;
};

export const mapMemberToFacultyForm = (
  member: Record<string, unknown>
): FacultyForm => ({
  facultyId: member.faculty_id ? String(member.faculty_id) : undefined,
  facultyName: String(member.name || ''),
  mobileNumber: String(member.contact || ''),
  collegeEmailId: String(member.college_email || member.email || ''),
  personalEmailId: String(member.personal_email || ''),
  gender: String(member.gender || ''),
  qualification: String(member.qualification || ''),
  specialization: String(member.specialization || ''),
  designation: String(member.designation || ''),
  experienceYears: String(member.experience_years ?? ''),
  subjectsAssigned: String(member.subjects_assigned || ''),
  joiningDate: member.joining_date
    ? String(member.joining_date).slice(0, 10)
    : '',
  profilePhoto: member.profile_photo ? String(member.profile_photo) : null,
  profilePhotoName: member.profile_photo ? 'Uploaded photo' : '',
});

export const buildSetupPayload = (
  basic: BasicDepartmentForm,
  head: HodForm,
  facultyMembers: FacultyForm[]
): DepartmentSetupPayload => {
  const courses = sanitizeCourses(basic.courses);
  return {
    institution_id: basic.institutionId,
    department: {
      depart_name: basic.departmentName.trim(),
      total_faculties: Number(basic.totalFacultyCount),
      total_students: Number(basic.totalStudentCount),
      courses_offered: courses,
    },
    hod: {
      ...(head.hodId ? { hod_id: head.hodId } : {}),
      name: head.hodName.trim(),
      employee_code: head.hodEmployeeCode.trim(),
      mobile_number: head.mobileNumber.trim(),
      email: head.emailId.trim(),
    },
    faculty_members: facultyMembers.map(facultyFormToMember),
  };
};

export const mapSetupResponseToForms = (data: DepartmentSetupResponse) => {
  const dept = data.department as Record<string, unknown>;
  const hod = data.hod as Record<string, unknown> | null;
  const members = (data.faculty_members || []) as Record<string, unknown>[];
  const facultyList = members.map(mapMemberToFacultyForm);
  const firstFaculty = facultyList[0];

  const basic: BasicDepartmentForm = {
    institutionId: String(dept.institution_id || ''),
    departmentName: String(dept.depart_name || ''),
    totalFacultyCount: String(dept.total_faculties ?? ''),
    totalStudentCount: String(dept.total_students ?? ''),
    courses: (dept.courses_offered as CoursesOffered) || emptyBasicForm().courses,
  };

  const head: HodForm = {
    hodId: hod?.hod_id ? String(hod.hod_id) : undefined,
    hodName: String(hod?.name || ''),
    hodEmployeeCode: String(hod?.employee_id || ''),
    mobileNumber: String(hod?.phone_number || ''),
    emailId: String(hod?.email || ''),
  };

  const faculty: FacultyForm = firstFaculty || emptyFacultyForm();

  return { basic, head, faculty, facultyList };
};

export const getApiErrorMessage = (error: unknown, fallback: string): string => {
  const err = error as {
    response?: {
      data?: {
        message?: string;
        errors?: Array<{ message?: string; field?: string }>;
      };
    };
    message?: string;
  };
  const data = err.response?.data;
  if (data?.errors?.length) {
    return data.errors
      .map((e) => e.message || e.field)
      .filter(Boolean)
      .join(', ');
  }
  return data?.message || err.message || fallback;
};
