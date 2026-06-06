export interface SubjectData {
  id?: number;
  scheme_id:          string;
  name:               string;
  code:               string;
  type:               string;
  semester:           string;
  credits:            string;
  max_theory:         string;
  max_practical:      string;
  max_oral:           string;
  max_tw:             string;
  min_pass_theory:    string;
  min_pass_practical: string;
  exam_duration_min:  string;
  status:             string;
}

export type SubjectModalType =
  | "view"
  | "edit"
  | "delete-confirm"
  | "edit-success"
  | "delete-success"
  | "bulk-upload"
  | "bulk-upload-success"
  | "add-success"
  | null;