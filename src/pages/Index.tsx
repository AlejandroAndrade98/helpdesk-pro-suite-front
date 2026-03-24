import React from "react";
import { Navigate } from "react-router-dom";
import { useCurrentUser } from "@/features/users/hooks/useCurrentUser";
import { ROUTES } from "@/constants/routes";
import { UserRole } from "@/types/api";

const IndexPage: React.FC = () => {
  const { data: user, isLoading } = useCurrentUser();

  if (isLoading) return null;

  if (!user) {
    return <Navigate to={ROUTES.login} replace />;
  }

  if (user.role === UserRole.Requester) {
    return <Navigate to={ROUTES.requesterHome} replace />;
  }

  return <Navigate to={ROUTES.dashboard} replace />;
};

export default IndexPage;