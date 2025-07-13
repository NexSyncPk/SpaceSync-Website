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

  // If user is already authenticated, redirect them away from public pages
  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  // If not authenticated, show the public page (login/signup)
  return <>{children}</>;
};

export default PublicRoute;
