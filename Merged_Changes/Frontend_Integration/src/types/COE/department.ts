export type ViewType = 'table' | 'add';
export type FeedbackType =
  | 'edit_success'
  | 'delete_confirm'
  | 'delete_success'
  | 'add_success';

export interface Department {
  id: string;
  name: string;
  hod: string;
  facultyCount: number;
  studentCount: number;
  mobile: string;
  email: string;
}

export interface FeedbackModalProps {
  isOpen: boolean;
  type: FeedbackType;
  message?: string;
  onClose: () => void;
  onConfirm?: () => void;
}

export interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  department?: Department;
}

export interface DepartmentTableProps {
  departments: Department[];
  onAddNew: () => void;
  onEditClick: (dept: Department) => void;
  onDeleteClick: (dept: Department) => void;
}

