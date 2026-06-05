import { axiosInstance } from '../../utils/axiosInstance';

const DEPARTMENT_ENDPOINTS = {
  GET_DROPDOWN: '/departments/dropdown',
} as const;

export const getDepartmentDropdown = async (): Promise<any> => {
  try {
    const response = await axiosInstance.get(DEPARTMENT_ENDPOINTS.GET_DROPDOWN);
    return response.data;
  } catch (error: any) {
    console.error('Error in getDepartmentDropdown:', error);
    throw error;
  }
};
