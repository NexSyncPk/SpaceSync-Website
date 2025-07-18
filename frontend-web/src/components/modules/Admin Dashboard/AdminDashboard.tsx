import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

import {
  BookingStats,
  QuickActions,
  RecentActivities,
  SystemSummary,
} from "./subcomponents";
import {
  getAllBookings,
  getAllRooms,
  getOrganizationMemebers,
} from "@/api/services/userService";

const AdminDashboard: React.FC = () => {
  const user = useSelector((state: any) => state.auth.user);
  const organization = useSelector((state: any) => state.organization.current);
  const [loading, setLoading] = useState(false);
  const [allBookings, setAllBookings] = useState<any[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);

  const fetchMetrics = async () => {
    setLoading(true);
    try {
      const [reservationsResponse, roomsResponse, organizationMembersResponse] =
        await Promise.all([
          getAllBookings(),
          getAllRooms(),
          getOrganizationMemebers(organization.id),
        ]);

      // Handle reservations response
      if (
        reservationsResponse &&
        typeof reservationsResponse === "object" &&
        "data" in reservationsResponse
      ) {
        setAllBookings(
          reservationsResponse.data?.reservations ||
            reservationsResponse.data ||
            []
        );
      } else {
        setAllBookings([]);
      }

      // Handle rooms response
      if (
        roomsResponse &&
        typeof roomsResponse === "object" &&
        "data" in roomsResponse
      ) {
        setRooms(roomsResponse.data || []);
      } else {
        setRooms([]);
      }

      // Handle organization members response
      if (
        organizationMembersResponse &&
        typeof organizationMembersResponse === "object" &&
        "data" in organizationMembersResponse
      ) {
        setUsers(organizationMembersResponse.data || []);
      } else {
        setUsers([]);
      }

      console.log(
        "Reservations:",
        reservationsResponse,
        "Rooms:",
        roomsResponse,
        "Users:",
        organizationMembersResponse
      );
    } catch (error) {
      console.error("Error fetching metrics:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  // Dashboard stats
  const [stats, setStats] = useState({
    totalBookings: 0,
    activeBookings: 0,
    pendingBookings: 0,
    completedBookings: 0,
    totalRooms: 0,
    totalUsers: 0,
    utilizationRate: 0,
    todaysBookings: 0,
    avgUtilization: 0,
  });

  // Calculate comprehensive stats whenever data changes
  useEffect(() => {
    if (allBookings.length > 0 || rooms.length > 0 || users.length > 0) {
      const totalBookings = allBookings.length;

      // Calculate active bookings (ongoing or future approved/confirmed)
      const now = new Date();
      const activeBookings = allBookings.filter((booking: any) => {
        const endTime = new Date(booking.endTime);
        return (
          endTime > now &&
          (booking.status === "confirmed" || booking.status === "approved")
        );
      }).length;

      // Calculate pending bookings
      const pendingBookings = allBookings.filter(
        (booking: any) =>
          booking.status === "pending" || booking.status === "requested"
      ).length;

      // Calculate completed bookings
      const completedBookings = allBookings.filter(
        (booking: any) => booking.status === "completed"
      ).length;

      // Calculate today's bookings
      const today = new Date();
      const startOfDay = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
      );
      const endOfDay = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() + 1
      );

      const todaysBookings = allBookings.filter((booking: any) => {
        const bookingDate = new Date(booking.startTime);
        return bookingDate >= startOfDay && bookingDate < endOfDay;
      }).length;

      // Calculate room utilization rate (simple logic - percentage of rooms that have bookings)
      const totalRooms = rooms.length;
      const totalUsers = users.length;

      // Simple utilization: How many rooms have at least one booking
      const roomsWithBookings = new Set(
        allBookings
          .filter(
            (booking: any) =>
              booking.status === "confirmed" || booking.status === "approved"
          )
          .map((booking: any) => booking.roomId)
      ).size;

      // Calculate utilization as percentage of rooms being used
      const utilizationRate =
        totalRooms > 0 ? Math.round((roomsWithBookings / totalRooms) * 100) : 0;

      // Average utilization per room (same as overall for simple calculation)
      const avgUtilization = utilizationRate;

      setStats({
        totalBookings,
        activeBookings,
        pendingBookings,
        completedBookings,
        totalRooms,
        totalUsers,
        utilizationRate,
        todaysBookings,
        avgUtilization,
      });
    }
  }, [allBookings, rooms, users]);

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
          {loading && (
            <div className="flex items-center text-sm text-gray-500">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 mr-2"></div>
              Loading dashboard data...
            </div>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <BookingStats stats={stats} loading={loading} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activities */}
        <RecentActivities />

        {/* Quick Actions & Summary */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <QuickActions />

          {/* System Summary */}
          <SystemSummary stats={stats} loading={loading} />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
