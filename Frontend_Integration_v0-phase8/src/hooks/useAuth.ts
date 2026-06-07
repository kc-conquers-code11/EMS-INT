//src/hooks/useAuth.ts
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { AppDispatch, RootState } from '../app/store';
import { loginThunk, logoutThunk, clearAuthError } from '../features/auth/authSlice';
import type { LoginCredentials } from '../types/auth.types';
import { authAPI } from '../services/api';

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { user, isAuthenticated, isLoading, error } = useSelector(
    (state: RootState) => state.auth
  );

  const login = async (credentials: LoginCredentials) => {
    try {
      const resultAction = await dispatch(loginThunk(credentials));
      if (loginThunk.fulfilled.match(resultAction)) {
        const loggedInUser = resultAction.payload;
        // FIX: Redirect based on user role correctly
        if (loggedInUser.role === 'SuperAdmin') {
          navigate('/institution-list');
        } else if (loggedInUser.role === 'COE') {
          navigate('/semester');
        } else if (loggedInUser.role === 'Faculty') {
          navigate('/faculty/question-paper');
        } else if (loggedInUser.role === 'HOD') {
          navigate('/hod/subject-faculty-mapping');
        } else if (loggedInUser.role === 'Student') {
          navigate('/student/exam-registration');
        } else {
          navigate('/login');
        }
      }
    } catch (err) {
      console.error('Login dispatch error:', err);
    }
  };

  const logout = async (redirectTo: string = '/login') => {
    try {
      await dispatch(logoutThunk());
      navigate(redirectTo);
    } catch (err) {
      console.error('Logout error:', err);
      navigate(redirectTo);
    }
  };

  const dismissError = () => {
    dispatch(clearAuthError());
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    dismissError,
  };
};