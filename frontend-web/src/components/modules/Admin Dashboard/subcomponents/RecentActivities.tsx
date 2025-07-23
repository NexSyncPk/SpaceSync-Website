import { Button } from "@/components/ui/button";
import { getStatusColor } from "@/utils/helpers";
import socket from "@/utils/socketManager";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const RecentActivities = () => {
  const initialActivities = [
    {
      id: 1,
      action: "New booking request",
      user: "John Doe",
      room: "Conference Room A",
      time: "2 hours ago",
      status: "pending",
    },
    // {
    //   id: 2,
    //   action: "Booking approved",
    //   user: "Jane Smith",
    //   room: "Meeting Room B",
    //   time: "4 hours ago",
    //   status: "approved",
    // },
    // {
    //   id: 3,
    //   action: "Booking completed",
    //   user: "Mike Johnson",
    //   room: "Creative Studio",
    //   time: "6 hours ago",
    //   status: "completed",
    // },
    // {
    //   id: 4,
    //   action: "Room maintenance",
    //   user: "Admin",
    //   room: "Conference Room C",
    //   time: "1 day ago",
    //   status: "maintenance",
    // },
  ];

  const [recentActivities, setRecentActivities] = useState(initialActivities);
  const [newActivityId, setNewActivityId] = useState<number | null>(null);

  // Helper function to format time ago
  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor(
      (now.getTime() - time.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60)
      return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24)
      return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
  };

  useEffect(() => {
    // Helper function to create activity from socket data
    const createActivity = (data: any, actionType: string) => {
      const activityId = Date.now() + Math.random(); // Ensure unique ID
      let action, user, room, status;

      switch (actionType) {
        case "newReservationRequest":
          action = "New booking request";
          user = data.reservation?.User?.name || "Unknown User";
          room = data.reservation?.Room?.name || "Unknown Room";
          status = data.reservation?.status || "pending";
          break;

        case "reservationStatusUpdate":
          action = `Booking ${data.reservation?.status}`;
          user = data.reservation?.User?.name || "Unknown User";
          room = data.reservation?.Room?.name || "Unknown Room";
          status = data.reservation?.status || "updated";
          break;

        case "reservationUpdated":
          action = "Booking updated";
          user = data.reservation?.User?.name || "Unknown User";
          room = data.reservation?.Room?.name || "Unknown Room";
          status = "updated";
          break;

        case "reservationCancelled":
          action = "Booking cancelled";
          user = data.reservation?.User?.name || "Unknown User";
          room = data.reservation?.Room?.name || "Unknown Room";
          status = "cancelled";
          break;

        case "reservationCompleted":
          action = "Booking completed";
          user = data.reservation?.User?.name || "Unknown User";
          room = data.reservation?.Room?.name || "Unknown Room";
          status = "completed";
          break;

        case "roomUpdated":
          action = "Room updated";
          user = "Admin";
          room = data.room?.name || "Unknown Room";
          status = "updated";
          break;

        case "roomStatusUpdate":
          action = `Room ${data.status}`;
          user = "System";
          room = `Room ID: ${data.roomId}`;
          status = data.status;
          break;

        default:
          action = "Activity";
          user = "Unknown";
          room = "Unknown";
          status = "unknown";
      }

      return {
        id: activityId,
        action,
        user,
        room,
        time: formatTimeAgo(data.timestamp),
        status,
      };
    };

    // Generic handler for all socket events
    const handleSocketEvent = (data: any, eventType: string) => {
      console.log(`${eventType} received:`, data);

      const newActivity = createActivity(data, eventType);

      // Add new activity to the beginning of the list
      setRecentActivities((prev) => [newActivity, ...prev.slice(0, 9)]); // Keep only 10 most recent

      // Show appropriate toast notification
      let toastMessage;
      switch (eventType) {
        case "newReservationRequest":
          toastMessage = `New booking request from ${newActivity.user} for ${newActivity.room}`;
          break;
        case "reservationStatusUpdate":
          toastMessage = `Booking ${data.reservation?.status} for ${newActivity.room}`;
          break;
        case "reservationUpdated":
          toastMessage = `Booking updated for ${newActivity.room}`;
          break;
        case "reservationCancelled":
          toastMessage = `Booking cancelled for ${newActivity.room}`;
          break;
        case "reservationCompleted":
          toastMessage = `Booking completed for ${newActivity.room}`;
          break;
        case "roomUpdated":
          toastMessage = `Room "${newActivity.room}" has been updated`;
          break;
        case "roomStatusUpdate":
          toastMessage = `Room is now ${data.status}`;
          break;
        default:
          toastMessage = data.message || "New activity";
      }

      toast.success(toastMessage, {
        duration: 7000,
        position: "top-right",
      });

      // Set the new activity ID for highlighting
      setNewActivityId(newActivity.id);

      // Remove highlight after 3 seconds
      setTimeout(() => {
        setNewActivityId(null);
      }, 3000);
    };

    // Listen to all socket events
    socket.on("newReservationRequest", (data) =>
      handleSocketEvent(data, "newReservationRequest")
    );
    socket.on("reservationStatusUpdate", (data) =>
      handleSocketEvent(data, "reservationStatusUpdate")
    );
    socket.on("reservationUpdated", (data) =>
      handleSocketEvent(data, "reservationUpdated")
    );
    socket.on("reservationCancelled", (data) =>
      handleSocketEvent(data, "reservationCancelled")
    );
    socket.on("reservationCompleted", (data) =>
      handleSocketEvent(data, "reservationCompleted")
    );
    socket.on("roomUpdated", (data) => handleSocketEvent(data, "roomUpdated"));
    socket.on("roomStatusUpdate", (data) =>
      handleSocketEvent(data, "roomStatusUpdate")
    );

    return () => {
      // Clean up all listeners
      socket.off("newReservationRequest");
      socket.off("reservationStatusUpdate");
      socket.off("reservationUpdated");
      socket.off("reservationCancelled");
      socket.off("reservationCompleted");
      socket.off("roomUpdated");
      socket.off("roomStatusUpdate");
    };
  }, []);

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
                className={`flex items-center justify-between p-4 rounded-lg transition-all duration-500 ${
                  newActivityId === activity.id
                    ? "bg-blue-50 border-2 border-blue-200 shadow-md"
                    : "bg-gray-50"
                }`}
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
