import { axiosInstance } from '../utils/axiosInstance';
import type { AxiosResponse } from 'axios';
import type {
  FacultyAllocationPanel,
  FacultyAssignmentPayload,
} from '../types/HOD/facultySubjectMapping';

interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  pagination?: { page: number; limit: number; total: number };
}

export const facultySubjectMappingAPI = {
  list: (params?: {
    q?: string;
    semester_id?: string;
    faculty_id?: string;
    subject_id?: string;
    page?: number;
    limit?: number;
  }): Promise<AxiosResponse<ApiResponse>> =>
    axiosInstance.get('/faculty-subject-mappings', { params }),

  getFacultyAllocationPanel: (
    facultyId: string
  ): Promise<AxiosResponse<ApiResponse<FacultyAllocationPanel>>> =>
    axiosInstance.get(`/faculty-subject-mappings/faculty/${facultyId}/allocation-panel`),

  upsertFacultyMappings: (
    facultyId: string,
    data: {
      faculty_role?: string | null;
      assignments: FacultyAssignmentPayload[];
    }
  ): Promise<AxiosResponse<ApiResponse<FacultyAllocationPanel>>> =>
    axiosInstance.put(`/faculty-subject-mappings/faculty/${facultyId}/mappings`, {
      faculty_id: facultyId,
      ...data,
    }),

  lookupFaculty: (): Promise<AxiosResponse<ApiResponse>> =>
    axiosInstance.get('/faculty-subject-mappings/lookup/faculty'),

  lookupSemesters: (): Promise<AxiosResponse<ApiResponse>> =>
    axiosInstance.get('/faculty-subject-mappings/lookup/semesters'),

  remove: (mappingId: string): Promise<AxiosResponse<ApiResponse>> =>
    axiosInstance.delete(`/faculty-subject-mappings/${mappingId}`),

  mySubjects: (): Promise<AxiosResponse<ApiResponse>> =>
    axiosInstance.get('/faculty-subject-mappings/my-subjects'),
};
