import { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { getAuthUser, saveAuthUser } from '../localStorage/localAuthStorage';
import { validateApi } from '../services/auth/authApiService';
import type { AuthUser } from '../types/auth.types';
import {
  HOD_HOME,
  FACULTY_LOGIN,
  homePathForRole,
  isHodPath,
  isHodRole,
} from '../utils/roleRoutes';

export const HodRoute = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<AuthUser | null>(null);
  const location = useLocation();

  useEffect(() => {
    const verifyAuth = async () => {
      setIsLoading(true);
      try {
        const response = await validateApi();
        if (response.success && response.user) {
          await saveAuthUser(response.user);
          setUser(response.user);
          return;
        }
      } catch {
        // fallback
      }
      const authUser = await getAuthUser();
      setUser(authUser);
    };

    verifyAuth()
      .catch(() => setUser(null))
      .finally(() => setIsLoading(false));
  }, [location.pathname]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="text-lg font-medium text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to={FACULTY_LOGIN} state={{ from: location }} replace />;
  }

  if (!isHodRole(user.role)) {
    return <Navigate to={homePathForRole(user.role)} replace />;
  }

  if (!isHodPath(location.pathname)) {
    return <Navigate to={HOD_HOME} replace />;
  }

  return <Outlet />;
};
