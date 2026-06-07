export interface TimetableSlot {
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
  timeSlot: string; // e.g. "09:00 AM - 10:00 AM"
  subjectCode: string;
  subjectName: string;
  facultyName: string;
  roomNo: string;
}

export interface Timetable {
  id: string;
  timetableNo: string;
  year: string;
  branch: string;
  semester: string;
  scheme: string;
  status: 'active' | 'inactive' | 'draft';
  slots: TimetableSlot[];
  created_at: string;
}

export interface Subject {
  code: string;
  title: string;
  credits: number;
}

export type TimetableFeedbackType = 'add_success' | 'edit_success' | 'delete_confirm' | 'delete_success';
