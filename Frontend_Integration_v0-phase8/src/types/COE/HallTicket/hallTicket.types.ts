export type HallTicketStatus = 'enabled' | 'disabled';
export type LateExamRequired = 'yes' | 'no';

export type HallTicketPublishJobStatus =
  | 'scheduled'
  | 'active'
  | 'completed'
  | 'failed'
  | 'not_found';

export interface HallTicketPublishStatus {
  status: HallTicketPublishJobStatus;
  scheduled_at: string | null;
  published_at: string | null;
  is_published: boolean;
}

export interface HallTicketSettings {
  id: string;
  exam_event_id: string;
  hall_ticket_status: HallTicketStatus;
  release_date: string;
  download_last_date: string;
  late_exam_required: LateExamRequired;
  instructions?: string[];
  is_enabled?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface HallTicketSettingsPayload {
  exam_event_id: string;
  hall_ticket_status: HallTicketStatus;
  release_date: string;
  download_last_date: string;
  late_exam_required: LateExamRequired;
  instructions?: string[];
}

export interface StudentEligibilityRow {
  student_id: string;
  exam_reg_id: string;
  enrollment_no: string;
  student_name: string;
  registration_status: string;
  fees_status: string;
  approval: string;
  eligibility: 'Eligible' | 'Not Eligible';
  reason: string;
  on_hold: boolean;
  can_generate?: boolean;
  can_download?: boolean;
  branch: string;
  department: string;
  semester: string;
}

export interface StudentHallTicketView {
  student_id: string;
  event_id: string;
  event_name: string;
  exam_reg_id: string;
  published: boolean;
  on_hold: boolean;
  reason: string;
  can_download: boolean;
  has_ticket_record?: boolean;
  download_last_date?: string | null;
  within_download_window?: boolean;
  message: string | null;
  hall_ticket: {
    enrollmentId: string;
    studentName: string;
    branch: string;
    semester: string;
    examEvent: string;
    seatNumber: string;
    subjects: Array<{
      srNo: number;
      courseCode: string;
      courseName: string;
      date: string;
      time: string;
    }>;
  } | null;
}

export interface HallTicketSubjectRow {
  sr_no: number;
  course_code: string;
  course_name: string;
  date: string;
  time: string;
}

export interface GeneratedHallTicketPayload {
  student_id: string;
  enrollment_id: string;
  student_name: string;
  branch: string;
  semester: string;
  exam_event: string;
  seat_number: string;
  subjects: HallTicketSubjectRow[];
  late_exam_required: LateExamRequired;
  include_principal_signature?: boolean;
  pdf?: {
    ticket_id: string;
    file_name: string;
    pdf_url: string;
    existing?: boolean;
  } | null;
}

export interface BulkHallTicketResult {
  student_id: string;
  exam_reg_id?: string;
  student_name?: string;
  enrollment_no?: string;
  ticket_id?: string;
  file_name?: string;
  file_path?: string;
  pdf_url?: string;
  branch_code?: string;
  branch_name?: string;
  success: boolean;
  error?: string;
}

export interface GenerateHallTicketRequest {
  student_id?: string;
  exam_event_id: string;
  format?: 'pdf' | 'html';
  include_principal_signature?: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}
