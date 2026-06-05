//src/routes/PublicRoute.tsx
import { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { getAuthUser } from '../localStorage/localAuthStorage';
import type { AuthUser } from '../types/auth.types';
import { homePathForRole } from '../utils/roleRoutes';

export const PublicRoute = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<AuthUser | null>(null);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authUser = await getAuthUser();
        setUser(authUser);
      } catch (error) {
        console.error('Error checking auth in PublicRoute:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="text-lg font-medium text-gray-500">Loading...</div>
      </div>
    );
  }

  if (user) {
    return <Navigate to={homePathForRole(user.role)} state={{ from: location }} replace />;
  }

  return <Outlet />;
};
