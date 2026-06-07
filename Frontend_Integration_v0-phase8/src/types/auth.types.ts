import type { LoginFormData } from "../schemas/authSchema";

export type LoginCredentials = LoginFormData;

export interface UserScope {
  institution_id: string | null;
  institution_name: string | null;
  depart_id: string | null;
  depart_name?: string | null;
  branch_id: string | null;
  student_id: string | null;
  faculty_id: string | null;
  coe_id: string | null;
  hod_id: string | null;
  level: 'GLOBAL' | 'INSTITUTION' | 'DEPARTMENT' | 'SELF';
  unrestricted: boolean;
}

export interface AuthUser {
  uid: string;
  email?: string;
  role: string;
  expires_at?: string;
  permissions: string[];
  institution_id?: string | null;
  institution_name?: string | null;
  depart_id?: string | null;
  depart_name?: string | null;
  branch_id?: string | null;
  student_id?: string | null;
  faculty_id?: string | null;
  coe_id?: string | null;
  hod_id?: string | null;
  scope?: UserScope | null;
}

export interface LoginApiResponse {
  success: boolean;
  data: {
    token: string;
    expires_at: string;
    role: string;
    uid: string;
    permissions: string[];
    institution_id?: string | null;
    institution_name?: string | null;
    depart_id?: string | null;
    branch_id?: string | null;
    student_id?: string | null;
    faculty_id?: string | null;
    coe_id?: string | null;
    hod_id?: string | null;
    scope?: UserScope | null;
  };
  message: string;
}

export interface ValidateApiResponse {
  success: boolean;
  user: AuthUser;
  message: string;
}

export interface LogoutApiResponse {
  success: boolean;
  message: string;
}

export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export function mapLoginDataToAuthUser(
  data: LoginApiResponse['data'],
  email?: string
): AuthUser {
  return {
    uid: data.uid,
    email,
    role: data.role,
    expires_at: data.expires_at,
    permissions: data.permissions || [],
    institution_id: data.institution_id ?? data.scope?.institution_id ?? null,
    institution_name: data.institution_name ?? data.scope?.institution_name ?? null,
    depart_id: data.depart_id ?? data.scope?.depart_id ?? null,
    depart_name: data.depart_name ?? data.scope?.depart_name ?? null,
    branch_id: data.branch_id ?? data.scope?.branch_id ?? null,
    student_id: data.student_id ?? data.scope?.student_id ?? null,
    faculty_id: data.faculty_id ?? data.scope?.faculty_id ?? null,
    coe_id: data.coe_id ?? data.scope?.coe_id ?? null,
    hod_id: data.hod_id ?? data.scope?.hod_id ?? null,
    scope: data.scope ?? null,
  };
}
