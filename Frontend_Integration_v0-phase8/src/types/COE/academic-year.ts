

export interface AcademicYearData {
  academic_id?: string;
  academic_name: string;
  startDate: string;
  endDate: string;
  start_date?: string;
  end_date?: string;
  is_admission: number;
  current_ay: number;
  created_at?: string;
  updatedAt?: string;
  deletedAt?: string;
}

export type AcademicYearModalType =
  | "view"
  | "edit"
  | "delete-confirm"
  | "edit-success"
  | "delete-success"
  | "add-success"
  | "current-year-conflict"
  | "action-cancelled"
  | null;
