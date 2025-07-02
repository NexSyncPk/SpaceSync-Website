import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Calendar, BookOpen, User, LogOut } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/slices/authSlice.js";
import toast from "react-hot-toast";

const Header: React.FC = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.auth.user);
  const isAuthenticated = useSelector(
    (state: any) => state.auth.isAuthenticated
  );

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out successfully!");
  };

  // Don't show header on login/signup pages
  if (location.pathname === "/login" || location.pathname === "/signup") {
    return null;
  }

  // Don't show header if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  const navItems = [
    { path: "/", icon: Home, label: "Book Meeting" },
    { path: "/bookings", icon: BookOpen, label: "My Bookings" },
    { path: "/calendar", icon: Calendar, label: "Calendar" },
    { path: "/profile", icon: User, label: "Profile" },
  ];

  return (
    <header className="bg-primary text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-xl font-bold">SpaceSync</h1>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navItems.map(({ path, icon: Icon, label }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === path
                    ? "bg-blue-700 text-white"
                    : "text-blue-100 hover:bg-blue-600 hover:text-white"
                }`}
              >
                <Icon size={18} />
                <span>{label}</span>
              </Link>
            ))}
          </nav>

          {/* User Info & Logout */}
          <div className="flex items-center space-x-4">
            <span className="text-sm text-blue-100">
              Welcome, {user?.name || "User"}
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-blue-100 hover:bg-blue-600 hover:text-white transition-colors"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button className="text-white hover:text-blue-200">
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile navigation */}
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map(({ path, icon: Icon, label }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  location.pathname === path
                    ? "bg-blue-700 text-white"
                    : "text-blue-100 hover:bg-blue-600 hover:text-white"
                }`}
              >
                <Icon size={18} />
                <span>{label}</span>
              </Link>
            ))}
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-blue-100 hover:bg-blue-600 hover:text-white transition-colors w-full text-left"
            >
              <LogOut size={18} />
              <span>Logout ({user?.name})</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
