import { axiosInstance } from '../../utils/axiosInstance';
import type { BranchFormData } from '../../schemas/branchSchema';

const BRANCH_ENDPOINTS = {
  GET_ALL: '/branch',
  GET_BY_ID: (id: string) => `/branch/${id}`,
  CREATE: '/branch',
  UPDATE: (id: string) => `/branch/${id}`,
  DELETE: (id: string) => `/branch/${id}`,
  GET_DROPDOWN: '/branch/dropdown',
} as const;

export const getBranches = async (): Promise<any> => {
  try {
    const response = await axiosInstance.get(BRANCH_ENDPOINTS.GET_ALL);
    return response.data;
  } catch (error: any) {
    console.error('Error in getBranches:', error);
    throw error;
  }
};

export const getBranchById = async (id: string): Promise<any> => {
  try {
    const response = await axiosInstance.get(BRANCH_ENDPOINTS.GET_BY_ID(id));
    return response.data;
  } catch (error: any) {
    console.error(`Error in getBranchById (${id}):`, error);
    throw error;
  }
};

export const createBranch = async (data: BranchFormData): Promise<any> => {
  try {
    const response = await axiosInstance.post(BRANCH_ENDPOINTS.CREATE, data);
    return response.data;
  } catch (error: any) {
    console.error('Error in createBranch:', error);
    throw error;
  }
};

export const updateBranch = async (id: string, data: BranchFormData): Promise<any> => {
  try {
    const response = await axiosInstance.put(BRANCH_ENDPOINTS.UPDATE(id), data);
    return response.data;
  } catch (error: any) {
    console.error(`Error in updateBranch (${id}):`, error);
    throw error;
  }
};

export const deleteBranch = async (id: string): Promise<any> => {
  try {
    const response = await axiosInstance.delete(BRANCH_ENDPOINTS.DELETE(id));
    return response.data;
  } catch (error: any) {
    console.error(`Error in deleteBranch (${id}):`, error);
    throw error;
  }
};

export const getBranchDropdown = async (): Promise<any> => {
  try {
    const response = await axiosInstance.get(BRANCH_ENDPOINTS.GET_DROPDOWN);
    return response.data;
  } catch (error: any) {
    console.error('Error in getBranchDropdown:', error);
    throw error;
  }
};
