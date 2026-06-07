export interface SubjectFacultyMappingRow {
  mapping_id: string;
  faculty_id: string;
  faculty_name: string;
  faculty_email?: string | null;
  semester_id: string;
  semester_number: number;
  semester_label: string;
  subject_id: string;
  subject_name: string;
  subject_code: string;
  faculty_role?: string | null;
  status: 'Active';
}

export interface FacultyLookup {
  faculty_id: string;
  name: string;
  college_email?: string | null;
  email?: string | null;
  depart_name?: string;
}

export interface SubjectLookup {
  subject_id: string;
  subject_name: string;
  subject_code: string;
  depart_name?: string;
}

export interface AllocationSubject {
  subject_id: string;
  subject_name: string;
  subject_code: string;
  mapping_id?: string | null;
  assigned_faculty_id?: string | null;
  assigned_faculty_name?: string | null;
  is_assigned_to_self: boolean;
  is_blocked: boolean;
}

export interface AllocationSemesterGroup {
  semester_id: string;
  semester_number: number;
  label: string;
  subjects: AllocationSubject[];
}

export interface FacultyAllocationPanel {
  faculty_id: string;
  faculty_name: string;
  semesters: AllocationSemesterGroup[];
}

export interface FacultyAssignmentPayload {
  subject_id: string;
  semester_id: string;
}

export interface SemesterLookup {
  semester_id: string;
  semester_number: number;
  term_type: string;
  programme_id?: string;
  programme_name?: string;
  branch_name?: string;
  label?: string;
}
