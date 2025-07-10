import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import OrganizationSelection from "../modules/Organization/OrganizationSelections";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const isAuthenticated = useSelector(
    (state: any) => state.auth.isAuthenticated
  );

  const hasSelectedOrganization = useSelector(
    (state: any) => state.organization.hasSelectedOrganization
  );

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!hasSelectedOrganization) {
    return <OrganizationSelection />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
