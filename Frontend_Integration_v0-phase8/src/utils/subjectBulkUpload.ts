import * as XLSX from 'xlsx';
import { parseSubjectTypes, serializeSubjectTypes } from './subjectTypeUtils';

export const SUBJECT_BULK_COLUMNS = [
  'Scheme',
  'Subject Name',
  'Subject Code',
  'Subject Type',
  'Semester',
  'Credits',
  'Max Theory',
  'Max Practical',
  'Max Oral',
  'Max TW',
  'Min Pass Theory',
  'Min Pass Practical',
  'Exam Duration',
  'Status',
] as const;

export type SubjectBulkColumn = (typeof SUBJECT_BULK_COLUMNS)[number];

export interface SubjectBulkPayload {
  subject_name: string;
  subject_code: string;
  subject_type: string;
  sem: number;
  credits: number;
  max_theory: number;
  max_practical: number;
  max_oral: number;
  max_tw: number;
  min_pass_theory: number;
  min_pass_practical: number;
  exam_duration_min: number;
  status: boolean;
}

export interface ParsedSubjectBulkGroup {
  scheme_id: string;
  scheme_name: string;
  subjects: SubjectBulkPayload[];
}

const SAMPLE_ROW: string[] = [
  '2024-25 Scheme',
  'Data Structures',
  'CS301',
  'TH, PR',
  '3',
  '4',
  '100',
  '50',
  '0',
  '25',
  '40',
  '20',
  '180',
  'Active',
];

const parseNumber = (value: unknown, field: string, rowNum: number): number => {
  const str = value != null ? String(value).trim() : '';
  if (!str) return 0;
  const num = Number(str);
  if (Number.isNaN(num)) {
    throw new Error(`Row ${rowNum}: "${field}" must be a number. Got "${str}".`);
  }
  return num;
};

const parseStatus = (value: unknown): boolean => {
  const str = String(value ?? '').trim().toLowerCase();
  if (!str || str === 'active' || str === '1' || str === 'true' || str === 'yes') return true;
  if (str === 'inactive' || str === '0' || str === 'false' || str === 'no') return false;
  throw new Error(`Invalid status "${value}". Use Active or Inactive.`);
};

export const downloadSubjectBulkTemplate = (schemeLabel?: string): void => {
  const sampleRow = [...SAMPLE_ROW];
  if (schemeLabel) sampleRow[0] = schemeLabel;
  const ws = XLSX.utils.aoa_to_sheet([SUBJECT_BULK_COLUMNS.slice(), sampleRow]);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Subjects');
  XLSX.writeFile(wb, 'subject_bulk_upload_template.xlsx');
};

export const parseSubjectExcelFile = async (
  file: File,
  schemes: Array<{ id: string; label: string }>
): Promise<ParsedSubjectBulkGroup[]> => {
  const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
  if (!['.xlsx', '.xls'].includes(ext)) {
    throw new Error('Only Excel files (.xlsx, .xls) are allowed.');
  }
  if (file.size > 10 * 1024 * 1024) {
    throw new Error('File size must be under 10 MB.');
  }

  const schemeByName = new Map<string, { id: string; label: string }>();
  for (const scheme of schemes) {
    schemeByName.set(scheme.label.trim().toLowerCase(), scheme);
    schemeByName.set(scheme.id.trim().toLowerCase(), scheme);
  }

  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(new Uint8Array(buffer), { type: 'array' });
  if (!workbook.SheetNames.length) {
    throw new Error('The uploaded file contains no sheets.');
  }

  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(worksheet, {
    defval: '',
    raw: true,
  });

  if (!rows.length) {
    throw new Error('No data rows found. Add subject rows below the header row.');
  }

  const headerKeys = Object.keys(rows[0] || {});
  const headerIndex = new Map<string, string>();
  for (const header of headerKeys) {
    headerIndex.set(header.trim().toLowerCase(), header);
  }

  for (const col of SUBJECT_BULK_COLUMNS) {
    if (!headerIndex.has(col.toLowerCase())) {
      throw new Error(`Missing required column "${col}". Download the template and try again.`);
    }
  }

  const getCell = (row: Record<string, unknown>, col: SubjectBulkColumn) => {
    const key = headerIndex.get(col.toLowerCase())!;
    return row[key];
  };

  const grouped = new Map<string, ParsedSubjectBulkGroup>();

  rows.forEach((row, index) => {
    const rowNum = index + 2;
    const schemeName = String(getCell(row, 'Scheme') ?? '').trim();
    const subjectName = String(getCell(row, 'Subject Name') ?? '').trim();
    const subjectCode = String(getCell(row, 'Subject Code') ?? '').trim();

    if (!schemeName && !subjectName && !subjectCode) return;

    if (!schemeName) throw new Error(`Row ${rowNum}: Scheme is required.`);
    if (!subjectName) throw new Error(`Row ${rowNum}: Subject Name is required.`);
    if (!subjectCode) throw new Error(`Row ${rowNum}: Subject Code is required.`);

    const scheme = schemeByName.get(schemeName.toLowerCase());
    if (!scheme) {
      throw new Error(
        `Row ${rowNum}: Unknown scheme "${schemeName}". Use an exact scheme name from Subject Management.`
      );
    }

    const typeRaw = String(getCell(row, 'Subject Type') ?? '').trim();
    const typeCodes = parseSubjectTypes(typeRaw);
    if (typeCodes.length === 0) {
      throw new Error(`Row ${rowNum}: Subject Type is required (e.g. TH, PR or TH, PR).`);
    }

    const sem = parseNumber(getCell(row, 'Semester'), 'Semester', rowNum);
    if (sem <= 0) throw new Error(`Row ${rowNum}: Semester must be greater than 0.`);

    const credits = parseNumber(getCell(row, 'Credits'), 'Credits', rowNum);
    if (credits <= 0) throw new Error(`Row ${rowNum}: Credits must be greater than 0.`);

    const payload: SubjectBulkPayload = {
      subject_name: subjectName,
      subject_code: subjectCode,
      subject_type: serializeSubjectTypes(typeCodes),
      sem,
      credits,
      max_theory: parseNumber(getCell(row, 'Max Theory'), 'Max Theory', rowNum),
      max_practical: parseNumber(getCell(row, 'Max Practical'), 'Max Practical', rowNum),
      max_oral: parseNumber(getCell(row, 'Max Oral'), 'Max Oral', rowNum),
      max_tw: parseNumber(getCell(row, 'Max TW'), 'Max TW', rowNum),
      min_pass_theory: parseNumber(getCell(row, 'Min Pass Theory'), 'Min Pass Theory', rowNum),
      min_pass_practical: parseNumber(getCell(row, 'Min Pass Practical'), 'Min Pass Practical', rowNum),
      exam_duration_min: parseNumber(getCell(row, 'Exam Duration'), 'Exam Duration', rowNum),
      status: parseStatus(getCell(row, 'Status')),
    };

    if (!grouped.has(scheme.id)) {
      grouped.set(scheme.id, {
        scheme_id: scheme.id,
        scheme_name: scheme.label,
        subjects: [],
      });
    }
    grouped.get(scheme.id)!.subjects.push(payload);
  });

  const result = Array.from(grouped.values());
  if (!result.length) {
    throw new Error('No valid subject rows found in the file.');
  }

  return result;
};
