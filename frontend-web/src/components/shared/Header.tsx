import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Calendar,
  BookOpen,
  User,
  LogOut,
  BarChart3,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../store/slices/authSlice.js";
import toast from "react-hot-toast";

const Header: React.FC = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.auth.user);
  const organization = useSelector((state: any) => state.organization.current);
  const isAuthenticated = useSelector(
    (state: any) => state.auth.isAuthenticated
  );
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Check if user is admin
  const isAdmin = organization?.role === "admin";

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out successfully!");
    setMobileMenuOpen(false);
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

  // Add dashboard option for admin users
  if (isAdmin) {
    navItems.splice(1, 0, {
      path: "/admin/dashboard",
      icon: BarChart3,
      label: "Dashboard",
    });
  }

  return (
    <header className="bg-primary text-white shadow-lg w-full">
      <div className=" mx-auto px-4">
        <div className="flex items-center justify-between h-16 ">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-xl font-bold">MRMS</h1>
          </div>

          {/* Navigation (Desktop) */}
          <nav className="hidden lg:flex space-x-5">
            {navItems.map(({ path, icon: Icon, label }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center space-x-2 px-3 py-2 text-sm font-medium transition-colors ${
                  location.pathname === path
                    ? "border-b-2 py-5 text-white"
                    : "text-blue-100 hover:bg-blue-600 hover:text-white"
                }`}
              >
                <Icon size={18} />
                <span>{label}</span>
              </Link>
            ))}
          </nav>

          {/* User Info & Logout (Desktop) */}
          <div className="hidden lg:flex items-center space-x-4">
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-blue-100 hover:bg-blue-600 hover:text-white transition-colors"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center">
            <button
              className="text-white hover:text-blue-200 focus:outline-none"
              aria-label="Toggle menu"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
            >
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

        {/* Mobile navigation (show/hide) */}
        {mobileMenuOpen && (
          <div className="md:hidden animate-fade-in-down">
            <div className="pt-2 pb-3 space-y-1 bg-primary rounded-b-lg shadow-lg">
              {navItems.map(({ path, icon: Icon, label }) => (
                <Link
                  key={path}
                  to={path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center space-x-2 py-2 text-base font-medium transition-colors max-md:w-fit  ${
                    location.pathname === path
                      ? "border-b-2  text-white"
                      : "text-blue-100 hover:bg-blue-600 hover:text-white"
                  }`}
                >
                  <Icon size={18} />
                  <span>{label}</span>
                </Link>
              ))}
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2  py-2 rounded-md text-base font-medium text-blue-100 hover:bg-blue-600 hover:text-white transition-colors w-full text-left"
              >
                <LogOut size={18} />
                <span>Logout ({user?.name})</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
