export type StudentFeedbackType = 'add_success' | 'edit_success' | 'delete_confirm' | 'delete_success';

export interface Student {
  id: string;
  studentId: string;
  branch: string;
  semester: string;
  yop: string;
}
