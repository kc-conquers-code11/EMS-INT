import { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { getAuthUser } from '../localStorage/localAuthStorage';
import type { AuthUser } from '../types/auth.types';
import {
  FACULTY_HOME,
  FACULTY_LOGIN,
  HOD_HOME,
  homePathForRole,
  isFacultyPath,
  isFacultyRole,
  isHodRole,
} from '../utils/roleRoutes';

export const FacultyRoute = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<AuthUser | null>(null);
  const location = useLocation();

  useEffect(() => {
    const load = async () => {
      try {
        const authUser = await getAuthUser();
        setUser(authUser);
      } finally {
        setIsLoading(false);
      }
    };
    load();
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

  if (!isFacultyRole(user.role)) {
    if (isHodRole(user.role)) {
      return <Navigate to={HOD_HOME} replace />;
    }
    return <Navigate to={homePathForRole(user.role)} replace />;
  }

  if (!isFacultyPath(location.pathname)) {
    return <Navigate to={FACULTY_HOME} replace />;
  }

  return <Outlet />;
};
