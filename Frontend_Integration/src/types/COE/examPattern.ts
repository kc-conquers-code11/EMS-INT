// src/types/COE/examPattern.ts
export interface ExamPatternData {
  pattern_id: string;
  programm_id: string;
  pattern_name: string;
  grading_type: string;
  grace_marks_allowed: number;
  grace_marks_max: number;
  atkt_rule: string;
  rounding_rule: string;
  passing_criteria: string;
  detention_criteria: string;
  status?: boolean;
  created_at?: string;
  updated_at?: string;
  deletedAt?: string | null;
  programme_name?: string;
  programme_code?: string;
}

export type ExamPatternModalType = "view" | "edit" | "edit-marking" | "delete-confirm" | "delete-success" | "edit-success" | "add-success" | "bulk-upload" | null;