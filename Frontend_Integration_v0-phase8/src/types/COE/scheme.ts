export type SchemeViewType = 'table' | 'add';
export type SchemeFeedbackType = 'add_success' | 'edit_success' | 'delete_confirm' | 'delete_success';

export interface Scheme {
  scheme_id: string;
  programm_id: string;
  scheme_name: string;
  scheme_year: number;
  description?: string;
  status: 'active' | 'inactive' | 'draft';
  scheme_code: string;
  scheme_type: string;
  regulation: string;
  applicable_from_year: string;
  total_semesters: number;
  credit_system_type: string;
  total_credits: number;
  grading_system: string;
  branches: string[];
  programme_details?: {
    programm_id: string;
    programme_name: string;
    programme_code: string;
    degree_type: string;
  };
}

export interface SchemeTableProps {
  schemes: Scheme[];
  onAddNew: () => void;
  onEditClick: (scheme: Scheme) => void;
  onDeleteClick: (scheme: Scheme) => void;
}
