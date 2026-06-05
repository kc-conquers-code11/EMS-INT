// DB Schema for marks_entry table
export interface MarksEntrySchema {
  entry_id?: number;
  reg_subj_id: number;
  faculty_id: number;
  component: string;
  marks_obtained: number | null; // null represents 'NA' or missing
  max_marks: number;
  is_locked: 0 | 1;
  locked_at?: string | null;
  locked_by?: number | null;
  created_at?: string;
  updated_at?: string;
}
