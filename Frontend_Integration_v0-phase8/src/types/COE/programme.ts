
export interface Programme {
  programm_id: string;
  institution_id: string;
  depart_id: string;
  programme_name: string;
  programme_code?: string | null;
  degree_type?: string | null;
  duration_years?: number | null;
  total_semesters?: number | null;
  approved_intake?: number | null;
  status: boolean;
}

export type ProgrammeModalMode = "view" | "edit" | "add" | null;

export type ProgrammeStatusModal =
  | "delete-confirm"
  | "edit-success"
  | "delete-success"
  | "add-success"
  | null;
