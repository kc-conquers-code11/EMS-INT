import axios from 'axios';
import { clearAuthUser } from '../localStorage/localAuthStorage';
import { FACULTY_LOGIN, STUDENT_LOGIN } from './roleRoutes';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
const API_VERSION = import.meta.env.VITE_API_VERSION || 'v1';

export const axiosInstance = axios.create({
  baseURL: `${apiBaseUrl}/api/${API_VERSION}`,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

const AUTH_EXCLUDED_PATHS = ['/auth/login', '/auth/logout', '/auth/validate', '/auth/refresh'];

const isAuthExcludedRequest = (url?: string) =>
  Boolean(url && AUTH_EXCLUDED_PATHS.some((path) => url.includes(path)));

const isOnLoginPage = () => {
  const path = window.location.pathname;
  return path === STUDENT_LOGIN || path === FACULTY_LOGIN || path.startsWith('/signup');
};

const loginPathForCurrentRoute = () => {
  const path = window.location.pathname;
  if (path.startsWith('/hod') || path.startsWith('/faculty')) {
    return FACULTY_LOGIN;
  }
  return STUDENT_LOGIN;
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status;
    const requestUrl = error.config?.url as string | undefined;

    if (status === 401 && !isAuthExcludedRequest(requestUrl)) {
      await clearAuthUser();

      if (!isOnLoginPage()) {
        window.location.href = loginPathForCurrentRoute();
      }
    }

    return Promise.reject(error);
  }
);
