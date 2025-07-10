import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  Calendar,
  Users,
  MapPin,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  BarChart3,
  Settings,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { useNavigate } from "react-router-dom";

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const user = useSelector((state: any) => state.auth.user);
  const bookings = useSelector((state: any) => state.booking.bookings);

  // Dashboard stats
  const [stats, setStats] = useState({
    totalBookings: 0,
    activeBookings: 0,
    pendingBookings: 0,
    completedBookings: 0,
    totalRooms: 8, // Mock data
    totalUsers: 156, // Mock data
    utilizationRate: 0,
  });

  useEffect(() => {
    if (bookings) {
      const totalBookings = bookings.length;
      const activeBookings = bookings.filter(
        (b: any) => b.status === "approved"
      ).length;
      const pendingBookings = bookings.filter(
        (b: any) => b.status === "pending"
      ).length;
      const completedBookings = bookings.filter(
        (b: any) => b.status === "completed"
      ).length;
      const utilizationRate =
        totalBookings > 0
          ? Math.round((activeBookings / totalBookings) * 100)
          : 0;

      setStats({
        totalBookings,
        activeBookings,
        pendingBookings,
        completedBookings,
        totalRooms: 8,
        totalUsers: 156,
        utilizationRate,
      });
    }
  }, [bookings]);

  const quickStats = [
    {
      label: "Total Bookings",
      value: stats.totalBookings.toString(),
      icon: Calendar,
      color: "bg-blue-500",
      change: "+12%",
    },
    {
      label: "Active Bookings",
      value: stats.activeBookings.toString(),
      icon: CheckCircle,
      color: "bg-green-500",
      change: "+8%",
    },
    {
      label: "Pending Approval",
      value: stats.pendingBookings.toString(),
      icon: AlertCircle,
      color: "bg-yellow-500",
      change: "+3%",
    },
    {
      label: "Room Utilization",
      value: `${stats.utilizationRate}%`,
      icon: TrendingUp,
      color: "bg-purple-500",
      change: "+5%",
    },
  ];

  const recentActivities = [
    {
      id: 1,
      action: "New booking request",
      user: "John Doe",
      room: "Conference Room A",
      time: "2 hours ago",
      status: "pending",
    },
    {
      id: 2,
      action: "Booking approved",
      user: "Jane Smith",
      room: "Meeting Room B",
      time: "4 hours ago",
      status: "approved",
    },
    {
      id: 3,
      action: "Booking completed",
      user: "Mike Johnson",
      room: "Creative Studio",
      time: "6 hours ago",
      status: "completed",
    },
    {
      id: 4,
      action: "Room maintenance",
      user: "Admin",
      room: "Conference Room C",
      time: "1 day ago",
      status: "maintenance",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "text-yellow-600 bg-yellow-100";
      case "approved":
        return "text-green-600 bg-green-100";
      case "completed":
        return "text-blue-600 bg-blue-100";
      case "maintenance":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Admin Dashboard 👋
            </h1>
            <p className="text-gray-600 mt-1">
              Welcome back, {user?.name || "Admin"}! Here's your meeting room
              overview
            </p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {quickStats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {stat.label}
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {stat.value}
                </p>
                <p className="text-sm text-green-600 mt-1">{stat.change}</p>
              </div>
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activities */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  Recent Activities
                </h2>
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {activity.action}
                        </p>
                        <p className="text-sm text-gray-600">
                          {activity.user} • {activity.room}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                          activity.status
                        )}`}
                      >
                        {activity.status}
                      </span>
                      <span className="text-sm text-gray-500">
                        {activity.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions & Summary */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Quick Actions
            </h3>
            <div className="space-y-3">
              <Button
                onClick={() => navigate("/admin/rooms/new")}
                className="w-full justify-start"
                variant="outline"
              >
                <MapPin size={16} className="mr-2" />
                Add New Room
              </Button>
              <Button
                onClick={() => navigate("/admin/users")}
                className="w-full justify-start"
                variant="outline"
              >
                <Users size={16} className="mr-2" />
                Manage Users
              </Button>
              <Button
                onClick={() => navigate("/admin/analytics")}
                className="w-full justify-start"
                variant="outline"
              >
                <BarChart3 size={16} className="mr-2" />
                View Analytics
              </Button>
              <Button
                onClick={() => navigate("/admin/settings")}
                className="w-full justify-start"
                variant="outline"
              >
                <Settings size={16} className="mr-2" />
                System Settings
              </Button>
            </div>
          </div>

          {/* System Summary */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              System Summary
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Rooms</span>
                <span className="font-medium">{stats.totalRooms}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Users</span>
                <span className="font-medium">{stats.totalUsers}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Today's Bookings</span>
                <span className="font-medium">{stats.activeBookings}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Avg. Utilization</span>
                <span className="font-medium">{stats.utilizationRate}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
