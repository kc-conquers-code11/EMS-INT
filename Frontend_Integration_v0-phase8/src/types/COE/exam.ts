export interface ExamEvent {
  event_id: number;
  institution_id?: number;
  academic_id?: number;
  semester_id?: number;
  event_name: string;
  exam_type?: string;
  reg_start?: string;
  reg_end?: string;
  fee_regular?: number;
  fee_backlog?: number;
  pattern_id?: number;
  is_published?: boolean;
  status: 'draft' | 'published' | 'completed' | string;
  created_by?: number;
  created_at?: string;
  updated_at?: string;
  course_code?: string;
  date?: string;
  time_slot?: string;
  total_students?: number;
}

export type ExamFeedbackType = 'add_success' | 'edit_success' | 'delete_confirm' | 'delete_success';
