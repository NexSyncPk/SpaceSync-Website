import ProtectedRoute from "@/components/shared/ProtectedRoute";
import AdminLayout from "@/components/shared/AdminLayout";
import UserLayout from "../components/shared/UserLayout";
import { Route, Routes as AppRoutes } from "react-router-dom";
import HomeView from "@/views/HomeView";
import BookingView from "@/views/BookingView";
import CalendarView from "@/views/CalendarView";
import LoginView from "@/views/LoginView";
import SignupView from "@/views/SignupView";
import ProfileView from "@/views/ProfileView";
import AdminDashboard from "@/views/AdminDashboard";
import RoomManagementView from "@/views/RoomManagementView";
import BookingManagementView from "@/views/BookingManagementView";
import UserManagementView from "@/views/UserManagementView";

const Routes = () => {
  return (
    <AppRoutes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginView />} />
      <Route path="/signup" element={<SignupView />} />

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

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <AdminDashboard />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <AdminDashboard />
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
