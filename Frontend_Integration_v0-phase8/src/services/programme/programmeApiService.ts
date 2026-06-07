import { axiosInstance } from '../../utils/axiosInstance';
import type { ProgrammeFormValues } from '../../schemas/COE/programmeSchema';

const PROGRAMME_ENDPOINTS = {
  GET_ALL: '/programme',
  GET_BY_ID: (id: string) => `/programme/${id}`,
  CREATE: '/programme',
  UPDATE: (id: string) => `/programme/${id}`,
  DELETE: (id: string) => `/programme/${id}`,
  GET_DROPDOWN: '/programme/dropdown',
} as const;

export const getProgrammes = async (): Promise<any> => {
  try {
    const response = await axiosInstance.get(PROGRAMME_ENDPOINTS.GET_ALL);
    return response.data;
  } catch (error: any) {
    console.error('Error in getProgrammes:', error);
    throw error;
  }
};

export const getProgrammeById = async (id: string): Promise<any> => {
  try {
    const response = await axiosInstance.get(PROGRAMME_ENDPOINTS.GET_BY_ID(id));
    return response.data;
  } catch (error: any) {
    console.error(`Error in getProgrammeById (${id}):`, error);
    throw error;
  }
};

export const createProgramme = async (data: ProgrammeFormValues): Promise<any> => {
  try {
    const response = await axiosInstance.post(PROGRAMME_ENDPOINTS.CREATE, data);
    return response.data;
  } catch (error: any) {
    console.error('Error in createProgramme:', error);
    throw error;
  }
};

export const updateProgramme = async (id: string, data: ProgrammeFormValues): Promise<any> => {
  try {
    const response = await axiosInstance.put(PROGRAMME_ENDPOINTS.UPDATE(id), data);
    return response.data;
  } catch (error: any) {
    console.error(`Error in updateProgramme (${id}):`, error);
    throw error;
  }
};

export const deleteProgramme = async (id: string): Promise<any> => {
  try {
    const response = await axiosInstance.delete(PROGRAMME_ENDPOINTS.DELETE(id));
    return response.data;
  } catch (error: any) {
    console.error(`Error in deleteProgramme (${id}):`, error);
    throw error;
  }
};

export const getProgrammeDropdown = async (): Promise<any> => {
  try {
    const response = await axiosInstance.get(PROGRAMME_ENDPOINTS.GET_DROPDOWN);
    return response.data;
  } catch (error: any) {
    console.error('Error in getProgrammeDropdown:', error);
    throw error;
  }
};
