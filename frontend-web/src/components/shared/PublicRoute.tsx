import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

interface PublicRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

const PublicRoute: React.FC<PublicRouteProps> = ({
  children,
  redirectTo = "/",
}) => {
  const isAuthenticated = useSelector(
    (state: any) => state.auth.isAuthenticated
  );
  const isLoading = useSelector((state: any) => state.auth.isLoading);
  const hasSelectedOrganization = useSelector(
    (state: any) => state.organization.hasSelectedOrganization
  );

  // Defensive: If loading, show loading spinner
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // If authenticated but no organization selected, redirect to organization setup
  if (isAuthenticated && !hasSelectedOrganization) {
    return <Navigate to="/organization-setup" replace />;
  }

  // If authenticated and has organization, redirect to main app
  if (isAuthenticated && hasSelectedOrganization) {
    return <Navigate to={redirectTo} replace />;
  }

  // Only show children if not authenticated
  return <>{children}</>;
};

export default PublicRoute;
