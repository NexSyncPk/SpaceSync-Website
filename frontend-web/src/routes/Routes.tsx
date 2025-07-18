import ProtectedRoute from "@/components/shared/ProtectedRoute";
import PublicRoute from "@/components/shared/PublicRoute";
import AdminLayout from "@/components/shared/AdminLayout";
import UserLayout from "../components/shared/UserLayout";
import { Route, Routes as AppRoutes } from "react-router-dom";
import HomeView from "@/views/HomeView";
import BookingView from "@/views/BookingView";
import LoginView from "@/views/LoginView";
import SignupView from "@/views/SignupView";
import ProfileView from "@/views/ProfileView";
import RoomManagementView from "@/views/RoomManagementView";
import BookingManagementView from "@/views/BookingManagementView";
import UserManagementView from "@/views/UserManagementView";
import Organization from "@/components/modules/Organization/Organization";
import AdminDashboardView from "@/views/AdminDashboardView";
import CalendarView from "@/views/CalendarView";

const Routes = () => {
  return (
    <AppRoutes>
      {/* Public Routes - Redirect authenticated users */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginView />
          </PublicRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <PublicRoute>
            <SignupView />
          </PublicRoute>
        }
      />

      {/* Organization Setup Route - for authenticated users without organization */}
      <Route path="/organization-setup" element={<Organization />} />

      {/* Protected User Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <UserLayout>
              <HomeView />
            </UserLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/bookings"
        element={
          <ProtectedRoute>
            <UserLayout>
              <BookingView />
            </UserLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/calendar"
        element={
          <ProtectedRoute>
            <UserLayout>
              <CalendarView />
            </UserLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <UserLayout>
              <ProfileView />
            </UserLayout>
          </ProtectedRoute>
        }
      />
      {/* <Route
        path="/organization"
        element={
          <ProtectedRoute>
            <UserLayout>
              <OrganizationView />
            </UserLayout>
          </ProtectedRoute>
        }
      /> */}

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <AdminDashboardView />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <AdminDashboardView />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/rooms"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <RoomManagementView />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/bookings"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <BookingManagementView />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <UserManagementView />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
    </AppRoutes>
  );
};

export default Routes;
