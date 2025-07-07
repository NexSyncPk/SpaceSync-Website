import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  ResponsiveContainer,
} from "recharts";
import {
  Calendar,
  TrendingUp,
  Users,
  Clock,
  //   MapPin,
  Download,
  //   Filter,
  //   Calendar as CalendarIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const Analytics: React.FC = () => {
  const [dateRange, setDateRange] = useState("7d");
  //   const [filterType, setFilterType] = useState("all");

  // Mock analytics data
  const roomUsageData = [
    { name: "Conference Room A", bookings: 45, utilization: 85 },
    { name: "Meeting Room B", bookings: 32, utilization: 68 },
    { name: "Creative Studio", bookings: 28, utilization: 62 },
    { name: "Executive Boardroom", bookings: 15, utilization: 42 },
    { name: "Team Room C", bookings: 22, utilization: 55 },
    { name: "Training Room", bookings: 18, utilization: 48 },
  ];

  const weeklyBookingsData = [
    { day: "Mon", bookings: 12, completed: 10 },
    { day: "Tue", bookings: 15, completed: 13 },
    { day: "Wed", bookings: 18, completed: 16 },
    { day: "Thu", bookings: 14, completed: 12 },
    { day: "Fri", bookings: 20, completed: 18 },
    { day: "Sat", bookings: 8, completed: 7 },
    { day: "Sun", bookings: 5, completed: 4 },
  ];

  const bookingStatusData = [
    { name: "Completed", value: 68, color: "#10B981" },
    { name: "Approved", value: 22, color: "#3B82F6" },
    { name: "Pending", value: 8, color: "#F59E0B" },
    { name: "Cancelled", value: 2, color: "#EF4444" },
  ];

  const departmentUsageData = [
    { department: "Engineering", bookings: 35, avgDuration: 90 },
    { department: "Marketing", bookings: 28, avgDuration: 75 },
    { department: "Sales", bookings: 24, avgDuration: 60 },
    { department: "HR", bookings: 18, avgDuration: 85 },
    { department: "Finance", bookings: 15, avgDuration: 70 },
    { department: "Operations", bookings: 12, avgDuration: 55 },
  ];

  const peakHoursData = [
    { hour: "8:00", bookings: 2 },
    { hour: "9:00", bookings: 8 },
    { hour: "10:00", bookings: 15 },
    { hour: "11:00", bookings: 18 },
    { hour: "12:00", bookings: 12 },
    { hour: "13:00", bookings: 10 },
    { hour: "14:00", bookings: 16 },
    { hour: "15:00", bookings: 14 },
    { hour: "16:00", bookings: 11 },
    { hour: "17:00", bookings: 8 },
    { hour: "18:00", bookings: 4 },
  ];

  const stats = [
    {
      label: "Total Bookings",
      value: "324",
      change: "+12%",
      icon: Calendar,
      color: "bg-blue-500",
    },
    {
      label: "Avg. Utilization",
      value: "73%",
      change: "+5%",
      icon: TrendingUp,
      color: "bg-green-500",
    },
    {
      label: "Active Users",
      value: "156",
      change: "+8%",
      icon: Users,
      color: "bg-purple-500",
    },
    {
      label: "Avg. Duration",
      value: "1.2h",
      change: "-3%",
      icon: Clock,
      color: "bg-orange-500",
    },
  ];

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
            <p className="text-gray-600 mt-1">
              Room usage insights and booking analytics
            </p>
          </div>
          <div className="flex gap-3">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
            <Button className="flex items-center gap-2">
              <Download size={16} />
              Export Report
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
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
                <p
                  className={`text-sm mt-1 ${
                    stat.change.startsWith("+")
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {stat.change}
                </p>
              </div>
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Room Usage Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Room Usage</h3>
            <select className="px-3 py-1 border border-gray-300 rounded text-sm">
              <option>All Rooms</option>
              <option>Conference Rooms</option>
              <option>Meeting Rooms</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={roomUsageData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                fontSize={12}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis />
              <Tooltip />
              <Bar dataKey="bookings" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Booking Status Pie Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Booking Status
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={bookingStatusData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}%`}
              >
                {bookingStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Weekly Trend */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          Weekly Booking Trend
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={weeklyBookingsData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="bookings"
              stroke="#3B82F6"
              strokeWidth={3}
              name="Total Bookings"
            />
            <Line
              type="monotone"
              dataKey="completed"
              stroke="#10B981"
              strokeWidth={3}
              name="Completed"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Department Usage & Peak Hours */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Department Usage */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Usage by Department
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={departmentUsageData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="department" type="category" width={80} />
              <Tooltip />
              <Bar dataKey="bookings" fill="#8B5CF6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Peak Hours */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Peak Hours
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={peakHoursData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="bookings" fill="#F59E0B" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Insights Section */}
      <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          Key Insights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center mb-2">
              <TrendingUp className="h-5 w-5 text-blue-600 mr-2" />
              <h4 className="font-medium text-blue-900">Most Popular Room</h4>
            </div>
            <p className="text-sm text-blue-800">
              Conference Room A has the highest utilization rate at 85%
            </p>
          </div>

          <div className="p-4 bg-green-50 rounded-lg">
            <div className="flex items-center mb-2">
              <Clock className="h-5 w-5 text-green-600 mr-2" />
              <h4 className="font-medium text-green-900">Peak Time</h4>
            </div>
            <p className="text-sm text-green-800">
              11:00 AM is the busiest hour with 18 average bookings
            </p>
          </div>

          <div className="p-4 bg-purple-50 rounded-lg">
            <div className="flex items-center mb-2">
              <Users className="h-5 w-5 text-purple-600 mr-2" />
              <h4 className="font-medium text-purple-900">Top Department</h4>
            </div>
            <p className="text-sm text-purple-800">
              Engineering team leads with 35 bookings this period
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
