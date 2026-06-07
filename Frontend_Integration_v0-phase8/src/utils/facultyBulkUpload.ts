import * as XLSX from 'xlsx';
import type { FacultyForm } from '../types/COE/departmentSetup';
import { emptyFacultyForm, validateFacultyForm } from '../types/COE/departmentSetup';

export const FACULTY_BULK_COLUMNS = [
  'Faculty Name',
  'Mobile Number',
  'College Email ID',
  'Personal Email ID',
  'Gender',
  'Qualification',
  'Specialization',
  'Designation',
  'Experience (Years)',
  'Subjects Assigned',
  'Joining Date',
] as const;

const HEADER_ALIASES: Record<string, keyof FacultyForm | 'joiningDate'> = {
  'faculty name': 'facultyName',
  name: 'facultyName',
  'mobile number': 'mobileNumber',
  mobile: 'mobileNumber',
  contact: 'mobileNumber',
  'college email id': 'collegeEmailId',
  'college email': 'collegeEmailId',
  email: 'collegeEmailId',
  'personal email id': 'personalEmailId',
  'personal email': 'personalEmailId',
  gender: 'gender',
  qualification: 'qualification',
  specialization: 'specialization',
  designation: 'designation',
  'experience (years)': 'experienceYears',
  experience: 'experienceYears',
  'experience years': 'experienceYears',
  'subjects assigned': 'subjectsAssigned',
  subjects: 'subjectsAssigned',
  'joining date': 'joiningDate',
  'date of joining': 'joiningDate',
};

const normalizeGender = (value: string): string => {
  const v = value.trim().toLowerCase();
  if (v === 'm' || v === 'male') return 'Male';
  if (v === 'f' || v === 'female') return 'Female';
  if (v === 'other' || v === 'o') return 'Other';
  return value.trim();
};

const parseJoiningDate = (value: unknown): string => {
  if (value == null || value === '') return '';
  if (typeof value === 'number') {
    const parsed = XLSX.SSF.parse_date_code(value);
    if (parsed) {
      const y = parsed.y;
      const m = String(parsed.m).padStart(2, '0');
      const d = String(parsed.d).padStart(2, '0');
      return `${y}-${m}-${d}`;
    }
  }
  const str = String(value).trim();
  if (/^\d{4}-\d{2}-\d{2}/.test(str)) return str.slice(0, 10);
  const d = new Date(str);
  if (!Number.isNaN(d.getTime())) return d.toISOString().slice(0, 10);
  return str;
};

const cell = (row: Record<string, unknown>, header: string): string => {
  const val = row[header];
  if (val == null) return '';
  return String(val).trim();
};

export const downloadFacultyBulkTemplate = (): void => {
  const sample: string[] = [
    'John Smith',
    '9876543210',
    'john.smith@college.ac.in',
    'john@gmail.com',
    'Male',
    'M.Tech',
    'Computer Networks',
    'Assistant Professor',
    '5',
    'DBMS, Networks',
    '2024-06-01',
  ];
  const ws = XLSX.utils.aoa_to_sheet([FACULTY_BULK_COLUMNS.slice(), sample]);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Faculty');
  XLSX.writeFile(wb, 'faculty_bulk_upload_template.xlsx');
};

export const parseFacultyExcelFile = async (file: File): Promise<FacultyForm[]> => {
  const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
  if (!['.xlsx', '.xls'].includes(ext)) {
    throw new Error('Only Excel files (.xlsx, .xls) are allowed.');
  }
  if (file.size > 10 * 1024 * 1024) {
    throw new Error('File size must be under 10 MB.');
  }

  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(new Uint8Array(buffer), { type: 'array' });
  if (!workbook.SheetNames.length) {
    throw new Error('The file contains no sheets.');
  }

  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, {
    defval: '',
    raw: true,
  });

  if (!rows.length) {
    throw new Error('No data rows found. Add faculty rows below the header row.');
  }

  const headerKeys = Object.keys(rows[0] || {});
  const headerMap = new Map<string, string>();
  for (const h of headerKeys) {
    const norm = h.trim().toLowerCase();
    const field = HEADER_ALIASES[norm];
    if (field) headerMap.set(field, h);
  }

  const requiredFields: (keyof FacultyForm)[] = [
    'facultyName',
    'mobileNumber',
    'collegeEmailId',
    'gender',
    'qualification',
    'specialization',
    'designation',
    'experienceYears',
    'subjectsAssigned',
    'joiningDate',
  ];

  const missing = requiredFields.filter((f) => !headerMap.has(f));
  if (missing.length) {
    throw new Error(
      `Missing required columns. Download the template. Could not find: ${missing.join(', ')}`
    );
  }

  const parsed: FacultyForm[] = [];

  rows.forEach((row, index) => {
    const get = (field: keyof FacultyForm | 'joiningDate') =>
      cell(row, headerMap.get(field) || '');

    const facultyName = get('facultyName');
    const mobile = get('mobileNumber').replace(/\D/g, '');
    const collegeEmail = get('collegeEmailId');

    if (!facultyName && !collegeEmail && !mobile) return;

    const entry: FacultyForm = {
      ...emptyFacultyForm(),
      facultyName,
      mobileNumber: mobile,
      collegeEmailId: collegeEmail,
      personalEmailId: get('personalEmailId'),
      gender: normalizeGender(get('gender')),
      qualification: get('qualification'),
      specialization: get('specialization'),
      designation: get('designation'),
      experienceYears: String(get('experienceYears')).replace(/\D/g, '') || get('experienceYears'),
      subjectsAssigned: get('subjectsAssigned'),
      joiningDate: parseJoiningDate(row[headerMap.get('joiningDate') || '']),
    };

    const rowErrors = validateFacultyForm(entry);
    if (Object.keys(rowErrors).length > 0) {
      const first = Object.values(rowErrors)[0];
      throw new Error(`Row ${index + 2}: ${first}`);
    }

    parsed.push(entry);
  });

  if (!parsed.length) {
    throw new Error('No valid faculty rows found in the file.');
  }

  const emails = new Set<string>();
  for (let i = 0; i < parsed.length; i++) {
    const key = parsed[i].collegeEmailId.toLowerCase();
    if (emails.has(key)) {
      throw new Error(`Duplicate college email in row ${i + 2}: ${parsed[i].collegeEmailId}`);
    }
    emails.add(key);
  }

  return parsed;
};
