import { Calendar, TrendingUp, CheckCircle, AlertCircle } from "lucide-react";

interface BookingStatsProps {
  stats?: {
    totalBookings: number;
    activeBookings: number;
    pendingBookings: number;
    completedBookings: number;
    totalRooms: number;
    totalUsers: number;
    utilizationRate: number;
    todaysBookings: number;
  };
  loading?: boolean;
}

const BookingStats: React.FC<BookingStatsProps> = ({ stats, loading }) => {
  const quickStats = [
    {
      label: "Total Bookings",
      value: loading ? "..." : stats?.totalBookings || 0,
      icon: Calendar,
      color: "bg-blue-500",
    },
    {
      label: "Active Bookings",
      value: loading ? "..." : stats?.activeBookings || 0,
      icon: CheckCircle,
      color: "bg-green-500",
    },
    {
      label: "Pending Approval",
      value: loading ? "..." : stats?.pendingBookings || 0,
      icon: AlertCircle,
      color: "bg-yellow-500",
    },
    {
      label: "Room Utilization",
      value: loading ? "..." : `${stats?.utilizationRate || 0}%`,
      icon: TrendingUp,
      color: "bg-purple-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {quickStats.map((stat, index) => (
        <div
          key={index}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {stat.value}
              </p>
            </div>
            <div className={`p-3 rounded-lg ${stat.color}`}>
              <stat.icon className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BookingStats;
