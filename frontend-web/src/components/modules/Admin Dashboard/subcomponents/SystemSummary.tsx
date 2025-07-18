interface SystemSummaryProps {
  stats?: {
    totalBookings: number;
    activeBookings: number;
    pendingBookings: number;
    completedBookings: number;
    totalRooms: number;
    totalUsers: number;
    utilizationRate: number;
    todaysBookings: number;
    avgUtilization: number;
  };
  loading?: boolean;
}

const SystemSummary: React.FC<SystemSummaryProps> = ({ stats, loading }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        System Summary
      </h3>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Total Rooms</span>
          <span className="font-medium">
            {loading ? "..." : stats?.totalRooms || 0}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Total Users</span>
          <span className="font-medium">
            {loading ? "..." : stats?.totalUsers || 0}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Today's Bookings</span>
          <span className="font-medium">
            {loading ? "..." : stats?.todaysBookings || 0}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Completed Bookings</span>
          <span className="font-medium">
            {loading ? "..." : stats?.completedBookings || 0}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Average Utilization</span>
          <span className="font-medium">
            {loading ? "..." : `${stats?.avgUtilization || 0}%`}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SystemSummary;
