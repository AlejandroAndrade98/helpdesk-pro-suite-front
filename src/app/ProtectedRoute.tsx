import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useCurrentUser } from '@/features/users/hooks/useCurrentUser';
import { ROUTES } from '@/constants/routes';
import { UserRole } from '@/types/api';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const { data: currentUser, isLoading: isUserLoading } = useCurrentUser();
  const location = useLocation();

  if (isLoading || isUserLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.login} state={{ from: location }} replace />;
  }

  if (allowedRoles && currentUser && !allowedRoles.includes(currentUser.role)) {
    if (currentUser.role === UserRole.Requester) {
      return <Navigate to={ROUTES.requesterHome} replace />;
    }

    return <Navigate to={ROUTES.dashboard} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;