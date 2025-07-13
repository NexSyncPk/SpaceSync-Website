import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Organization from "../modules/Organization/Organization";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const isAuthenticated = useSelector(
    (state: any) => state.auth.isAuthenticated
  );

  const token = useSelector((state: any) => state.auth.token);

  const hasSelectedOrganization = useSelector(
    (state: any) => state.organization.hasSelectedOrganization
  );

  // Check if we're still loading authentication state
  const isLoading = useSelector((state: any) => state.auth.loading);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // If not authenticated (no token), redirect to login
  if (!isAuthenticated || !token) {
    return <Navigate to="/login" replace />;
  }

  // If authenticated but no organization selected, show organization selection
  if (!hasSelectedOrganization) {
    return <Organization />;
  }

  // User is authenticated and has selected organization
  return <>{children}</>;
};

export default ProtectedRoute;
