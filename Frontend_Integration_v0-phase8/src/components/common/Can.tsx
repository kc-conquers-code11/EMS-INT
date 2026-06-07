import React from 'react';
import { useHasPermission } from '../../hooks/useHasPermission';

interface CanProps {
  permission: string | string[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const Can: React.FC<CanProps> = ({ permission, children, fallback = null }) => {
  const hasPermission = useHasPermission();
  const isAllowed = hasPermission(permission);

  return isAllowed ? <>{children}</> : <>{fallback}</>;
};
