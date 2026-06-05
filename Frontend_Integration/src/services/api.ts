// src/services/api.ts
import type { AxiosResponse } from "axios";
import { axiosInstance as api } from "../utils/axiosInstance";
import type {
  ApiResponse,
  Institution,
  COE,
  CreateInstitutionData,
  CreateCOEData,
} from "../types/institution.types";
import type {
  DepartmentSetupPayload,
  DepartmentSetupResponse,
} from "../types/COE/departmentSetup";

// Institution APIs
export const institutionAPI = {
  getAll: (): Promise<AxiosResponse<ApiResponse<Institution[]>>> =>
    api.get("/institutions"),

  getById: (id: string): Promise<AxiosResponse<ApiResponse<Institution>>> =>
    api.get(`/institutions/${id}`),

  create: (data: CreateInstitutionData): Promise<AxiosResponse<ApiResponse>> =>
    api.post("/institutions", data),

  update: (
    id: string,
    data: Partial<CreateInstitutionData>,
  ): Promise<AxiosResponse<ApiResponse>> =>
    api.put(`/institutions/${id}`, data),

  delete: (id: string): Promise<AxiosResponse<ApiResponse>> =>
    api.delete(`/institutions/${id}`),

  permanentDelete: (id: string): Promise<AxiosResponse<ApiResponse>> =>
    api.delete(`/institutions/${id}/permanent`),
};

// COE APIs
export const coeAPI = {
  getAll: (): Promise<AxiosResponse<ApiResponse<COE[]>>> => api.get("/coe"),

  getById: (id: string): Promise<AxiosResponse<ApiResponse<COE>>> =>
    api.get(`/coe/${id}`),

  getByInstitution: (
    institutionId: string,
  ): Promise<AxiosResponse<ApiResponse<COE[]>>> =>
    api.get(`/coe/institution/${institutionId}`),

  create: (data: CreateCOEData): Promise<AxiosResponse<ApiResponse>> =>
    api.post("/coe", data),

  update: (
    id: string,
    data: Partial<CreateCOEData>,
  ): Promise<AxiosResponse<ApiResponse>> => api.put(`/coe/${id}`, data),

  delete: (id: string): Promise<AxiosResponse<ApiResponse>> =>
    api.delete(`/coe/${id}`),
};

// Auth APIs
export const authAPI = {
  login: (
    email: string,
    password: string,
  ): Promise<
    AxiosResponse<
      ApiResponse<{ accessToken: string; refreshToken: string; user: any }>
    >
  > => api.post("/auth/login", { email, password }),

  logout: (): Promise<AxiosResponse<ApiResponse>> => api.post("/auth/logout"),

  refreshToken: (
    refreshToken: string,
  ): Promise<AxiosResponse<ApiResponse<{ accessToken: string }>>> =>
    api.post("/auth/refresh", { refreshToken }),

  changePassword: (
    oldPassword: string,
    newPassword: string,
  ): Promise<AxiosResponse<ApiResponse>> =>
    api.post("/auth/change-password", { oldPassword, newPassword }),
};

// Department APIs
export const departmentAPI = {
  getAll: (): Promise<AxiosResponse<ApiResponse<any[]>>> =>
    api.get("/departments"),

  getList: (): Promise<AxiosResponse<ApiResponse<any[]>>> =>
    api.get("/departments/depart-list"),

  getDropdown: (): Promise<AxiosResponse<ApiResponse<any[]>>> =>
    api.get("/departments/dropdown"),

  getByInstitution: (id: string): Promise<AxiosResponse<ApiResponse<any[]>>> =>
    api.get(`/departments/institution/${id}`),

  getById: (id: string): Promise<AxiosResponse<ApiResponse<any>>> =>
    api.get(`/departments/${id}`),

  create: (data: any): Promise<AxiosResponse<ApiResponse>> =>
    api.post("/departments", data),

  update: (id: string, data: any): Promise<AxiosResponse<ApiResponse>> =>
    api.put(`/departments/${id}`, data),

  delete: (id: string): Promise<AxiosResponse<ApiResponse>> =>
    api.delete(`/departments/${id}`),

  permanentDelete: (id: string): Promise<AxiosResponse<ApiResponse>> =>
    api.delete(`/departments/${id}/permanent`),

  createSetup: (
    data: DepartmentSetupPayload,
  ): Promise<AxiosResponse<ApiResponse<DepartmentSetupResponse>>> =>
    api.post("/departments/setup", data),

  getSetup: (
    id: string,
  ): Promise<AxiosResponse<ApiResponse<DepartmentSetupResponse>>> =>
    api.get(`/departments/${id}/setup`),

  updateSetup: (
    id: string,
    data: Partial<DepartmentSetupPayload>,
  ): Promise<AxiosResponse<ApiResponse<DepartmentSetupResponse>>> =>
    api.put(`/departments/${id}/setup`, data),

  restore: (id: string): Promise<AxiosResponse<ApiResponse>> =>
    api.patch(`/departments/${id}/restore`),
};

// Semester APIs
export const semesterAPI = {
  getAll: (params?: any): Promise<AxiosResponse<ApiResponse<any[]>>> =>
    api.get("/semesters", { params }),

  getDropdown: (params?: any): Promise<AxiosResponse<ApiResponse<any[]>>> =>
    api.get("/semesters/dropdown", { params }),

  getDeleted: (params?: any): Promise<AxiosResponse<ApiResponse<any[]>>> =>
    api.get("/semesters/deleted", { params }),

  getByProgramme: (programm_id: string, params?: any): Promise<AxiosResponse<ApiResponse<any[]>>> =>
    api.get(`/semesters/programme/${programm_id}`, { params }),

  getByAcademicYear: (academic_id: string, params?: any): Promise<AxiosResponse<ApiResponse<any[]>>> =>
    api.get(`/semesters/academic-year/${academic_id}`, { params }),

  getById: (id: string): Promise<AxiosResponse<ApiResponse<any>>> =>
    api.get(`/semesters/${id}`),

  create: (data: any): Promise<AxiosResponse<ApiResponse>> =>
    api.post("/semesters", data),

  update: (id: string, data: any): Promise<AxiosResponse<ApiResponse>> =>
    api.put(`/semesters/${id}`, data),

  updateStatus: (id: string, data: any): Promise<AxiosResponse<ApiResponse>> =>
    api.patch(`/semesters/${id}/status`, data),

  delete: (id: string): Promise<AxiosResponse<ApiResponse>> =>
    api.delete(`/semesters/${id}`),

  restore: (id: string): Promise<AxiosResponse<ApiResponse>> =>
    api.put(`/semesters/${id}/restore`),

  permanentDelete: (id: string): Promise<AxiosResponse<ApiResponse>> =>
    api.delete(`/semesters/${id}/permanent`),
};

// Student APIs
export const studentAPI = {
  getAll: (params?: any): Promise<AxiosResponse<ApiResponse<any[]>>> =>
    api.get("/admin/students", { params }),

  getDeleted: (params?: any): Promise<AxiosResponse<ApiResponse<any[]>>> =>
    api.get("/admin/students/deleted", { params }),

  getById: (id: string): Promise<AxiosResponse<ApiResponse<any>>> =>
    api.get(`/admin/students/${id}`),

  create: (data: any): Promise<AxiosResponse<ApiResponse>> =>
    api.post("/admin/students", data),

  update: (id: string, data: any): Promise<AxiosResponse<ApiResponse>> =>
    api.put(`/admin/students/${id}`, data),

  delete: (id: string): Promise<AxiosResponse<ApiResponse>> =>
    api.delete(`/admin/students/${id}`),

  check: (id: string): Promise<AxiosResponse<ApiResponse>> =>
    api.get(`/admin/students/${id}/check`),

  restore: (id: string): Promise<AxiosResponse<ApiResponse>> =>
    api.put(`/admin/students/${id}/restore`),

  permanentDelete: (id: string): Promise<AxiosResponse<ApiResponse>> =>
    api.delete(`/admin/students/${id}/permanent`),
};

// Scheme APIs
export const schemeAPI = {
  getAll: (params?: any): Promise<AxiosResponse<ApiResponse<any[]>>> =>
    api.get("/schemes", { params }),

  getDropdown: (params?: any): Promise<AxiosResponse<ApiResponse<any[]>>> =>
    api.get("/schemes/dropdown", { params }),

  getDeleted: (params?: any): Promise<AxiosResponse<ApiResponse<any[]>>> =>
    api.get("/schemes/deleted", { params }),

  getById: (id: string): Promise<AxiosResponse<ApiResponse<any>>> =>
    api.get(`/schemes/${id}`),

  create: (data: any): Promise<AxiosResponse<ApiResponse>> =>
    api.post("/schemes", data),

  update: (id: string, data: any): Promise<AxiosResponse<ApiResponse>> =>
    api.put(`/schemes/${id}`, data),

  delete: (id: string): Promise<AxiosResponse<ApiResponse>> =>
    api.delete(`/schemes/${id}`),

  restore: (id: string): Promise<AxiosResponse<ApiResponse>> =>
    api.post(`/schemes/${id}/restore`),
};

// Programme APIs
export const programmeAPI = {
  getAll: (params?: any): Promise<AxiosResponse<ApiResponse<any[]>>> =>
    api.get("/programme", { params }),

  getDropdown: (params?: any): Promise<AxiosResponse<ApiResponse<any[]>>> =>
    api.get("/programme/dropdown", { params }),
};

// Branch APIs
export const branchAPI = {
  getAll: (params?: any): Promise<AxiosResponse<ApiResponse<any[]>>> =>
    api.get("/branch", { params }),

  getDropdown: (params?: any): Promise<AxiosResponse<ApiResponse<any[]>>> =>
    api.get("/branch/dropdown", { params }),
};

// Academic Year APIs
export const academicYearAPI = {
  getAll: (params?: any): Promise<AxiosResponse<ApiResponse<any[]>>> =>
    api.get("/academic-years", { params }),

  getDropdown: (params?: any): Promise<AxiosResponse<ApiResponse<any[]>>> =>
    api.get("/academic-years/dropdown", { params }),
};

// Add this to your existing api.ts file after the other API definitions

// Exam Pattern APIs
export const examPatternAPI = {
  getAll: (): Promise<AxiosResponse<ApiResponse<any[]>>> =>
    api.get("/exam-patterns"),  // Match your backend route (no 's' at the end)
  
  getById: (id: string): Promise<AxiosResponse<ApiResponse<any>>> =>
    api.get(`/exam-patterns/${id}`),
  
  getByProgramme: (programmeId: string): Promise<AxiosResponse<ApiResponse<any[]>>> =>
    api.get(`/exam-patterns/programme/${programmeId}`),
  
  getDropdown: (programmeId?: string): Promise<AxiosResponse<ApiResponse<any[]>>> =>
    api.get("/exam-patterns/dropdown", { params: { programm_id: programmeId } }),
  
  getDeleted: (): Promise<AxiosResponse<ApiResponse<any[]>>> =>
    api.get("/exam-patterns/deleted"),
  
  create: (data: any): Promise<AxiosResponse<ApiResponse>> =>
    api.post("/exam-patterns", data),
  
  update: (id: string, data: any): Promise<AxiosResponse<ApiResponse>> =>
    api.put(`/exam-patterns/${id}`, data),
  
  softDelete: (id: string): Promise<AxiosResponse<ApiResponse>> =>
    api.delete(`/exam-patterns/${id}`),
  
  restore: (id: string): Promise<AxiosResponse<ApiResponse>> =>
    api.put(`/exam-patterns/${id}/restore`),
  
  permanentDelete: (id: string): Promise<AxiosResponse<ApiResponse>> =>
    api.delete(`/exam-patterns/${id}/permanent`),
};

export default api;
