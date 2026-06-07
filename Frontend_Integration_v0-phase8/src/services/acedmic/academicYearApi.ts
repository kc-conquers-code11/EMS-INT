// src/services/api/academicYearApi.ts
import axios from 'axios';

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL?.replace(/'/g, '') || 'http://localhost:5000'}/api/v1`;

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Important for cookies
});

// Add token to requests if using Bearer token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const academicYearAPI = {
  getAll: async (page = 1, limit = 10) => {
    const response = await apiClient.get(`${API_BASE_URL}/academic-years?page=${page}&limit=${limit}`);
    return response.data;
  },
  
  getById: async (id: string) => {
    const response = await apiClient.get(`${API_BASE_URL}/academic-years/${id}`);
    return response.data;
  },
  
  create: async (data: any) => {
    const response = await apiClient.post(`${API_BASE_URL}/academic-years`, data);
    return response.data;
  },
  
  update: async (id: string, data: any) => {
    const response = await apiClient.put(`${API_BASE_URL}/academic-years/${id}`, data);
    return response.data;
  },
  
  delete: async (id: string) => {
    const response = await apiClient.delete(`${API_BASE_URL}/academic-years/${id}`);
    return response.data;
  },
  
  restore: async (id: string) => {
    const response = await apiClient.post(`${API_BASE_URL}/academic-years/${id}/restore`);
    return response.data;
  },
  
  getDeleted: async (page = 1, limit = 10) => {
    const response = await apiClient.get(`${API_BASE_URL}/academic-years/deleted?page=${page}&limit=${limit}`);
    return response.data;
  },
};