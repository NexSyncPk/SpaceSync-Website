import ProtectedRoute from "@/components/shared/ProtectedRoute";
import { Route, Routes as AppRoutes } from "react-router-dom";
import HomeView from "@/views/HomeView";
import BookingView from "@/views/BookingView";
import CalendarView from "@/views/CalendarView";
import LoginView from "@/views/LoginView";
import SignupView from "@/views/SignupView";
import ProfileView from "@/views/ProfileView";

const Routes = () => {
  return (
    <AppRoutes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginView />} />
      <Route path="/signup" element={<SignupView />} />

      {/* Protected Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <HomeView />
          </ProtectedRoute>
        }
      />
      <Route
        path="/bookings"
        element={
          <ProtectedRoute>
            <BookingView />
          </ProtectedRoute>
        }
      />
      <Route
        path="/calendar"
        element={
          <ProtectedRoute>
            <CalendarView />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfileView />
          </ProtectedRoute>
        }
      />
    </AppRoutes>
  );
};

export default Routes;
