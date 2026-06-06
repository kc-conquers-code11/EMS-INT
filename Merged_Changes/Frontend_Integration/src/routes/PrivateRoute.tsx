//src/routes/PrivateRoute.tsx
import { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { getAuthUser, saveAuthUser } from '../localStorage/localAuthStorage';
import { validateApi } from '../services/auth/authApiService';
import type { AuthUser } from '../types/auth.types';
import {
  COE_HOME,
  FACULTY_HOME,
  HOD_HOME,
  isFacultyPath,
  isFacultyRole,
  isHodRole,
  isStudentPath,
  isStudentRole,
  STUDENT_HOME,
  SUPER_ADMIN_HOME,
} from '../utils/roleRoutes';

export const PrivateRoute = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const location = useLocation();

  useEffect(() => {
    const verifyAuth = async () => {
      setIsLoading(true);
      try {
        const response = await validateApi();
        if (response.success && response.user) {
          await saveAuthUser(response.user);
          setIsAuthenticated(true);
          setUser(response.user);
          return;
        }
      } catch {
        // Fall back to locally stored session
      }

      const authUser = await getAuthUser();
      if (authUser) {
        setIsAuthenticated(true);
        setUser(authUser);
      } else {
        setIsAuthenticated(false);
      }
    };

    verifyAuth()
      .catch(() => setIsAuthenticated(false))
      .finally(() => setIsLoading(false));
  }, [location.pathname]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="text-lg font-medium text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (isStudentRole(user?.role)) {
    return <Navigate to={STUDENT_HOME} replace />;
  }

  if (isFacultyRole(user?.role)) {
    return <Navigate to={FACULTY_HOME} replace />;
  }

  if (isHodRole(user?.role)) {
    return <Navigate to={HOD_HOME} replace />;
  }

  if (isStudentPath(location.pathname) || isFacultyPath(location.pathname)) {
    return <Navigate to={user?.role === 'COE' ? COE_HOME : SUPER_ADMIN_HOME} replace />;
  }

  if (
    (location.pathname === '/institution-list' || location.pathname === '/add-institution') &&
    user?.role !== 'SuperAdmin'
  ) {
    return <Navigate to={COE_HOME} replace />;
  }

  if (
    user?.role === 'SuperAdmin' &&
    location.pathname !== '/institution-list' &&
    location.pathname !== '/add-institution'
  ) {
    return <Navigate to={SUPER_ADMIN_HOME} replace />;
  }

  if (
    user?.role === 'COE' &&
    (location.pathname === '/institution-list' || location.pathname === '/add-institution')
  ) {
    return <Navigate to={COE_HOME} replace />;
  }

  return <Outlet />;
};
