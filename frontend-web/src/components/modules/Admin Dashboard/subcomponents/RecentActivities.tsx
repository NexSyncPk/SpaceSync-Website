import { Button } from "@/components/ui/button";
import { getStatusColor } from "@/utils/helpers";

const RecentActivities = () => {
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
  return (
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
                  <span className="text-sm text-gray-500">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecentActivities;
