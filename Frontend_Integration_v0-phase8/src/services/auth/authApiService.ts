import { axiosInstance } from '../../utils/axiosInstance';
import type { LoginCredentials, LoginApiResponse, LogoutApiResponse, ValidateApiResponse } from '../../types/auth.types';

const AUTH_ENDPOINTS = {
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  VALIDATE: '/auth/validate',
} as const;

export const loginApi = async (credentials: LoginCredentials): Promise<LoginApiResponse> => {
  const response = await axiosInstance.post<LoginApiResponse>(AUTH_ENDPOINTS.LOGIN, credentials);
  return response.data;
};

export const logoutApi = async (): Promise<LogoutApiResponse> => {
  try {
    const response = await axiosInstance.post<LogoutApiResponse>(AUTH_ENDPOINTS.LOGOUT);
    return response.data;
  } catch (error: any) {
    console.error('Error in logoutApi:', error);
    throw error;
  }
};

export const validateApi = async (): Promise<ValidateApiResponse> => {
  try {
    const response = await axiosInstance.get<ValidateApiResponse>(AUTH_ENDPOINTS.VALIDATE);
    return response.data;
  } catch (error: any) {
    console.error('Error in validateApi:', error);
    throw error;
  }
};
