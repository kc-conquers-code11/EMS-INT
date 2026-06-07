import { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { getAuthUser } from '../localStorage/localAuthStorage';
import type { AuthUser } from '../types/auth.types';
import {
  homePathForRole,
  isStudentPath,
  isStudentRole,
  STUDENT_HOME,
  STUDENT_LOGIN,
} from '../utils/roleRoutes';

export const StudentRoute = () => {
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
    return <Navigate to={STUDENT_LOGIN} state={{ from: location }} replace />;
  }

  if (!isStudentRole(user.role)) {
    return <Navigate to={homePathForRole(user.role)} replace />;
  }

  if (!isStudentPath(location.pathname)) {
    return <Navigate to={STUDENT_HOME} replace />;
  }

  return <Outlet />;
};
