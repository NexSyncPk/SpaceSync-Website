import {
  getAllNotifications,
  markNotificationAsRead,
} from "@/api/services/userService";
import socket from "@/utils/socketManager";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  RefreshCw,
  Bell,
  Clock,
  User,
  MapPin,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { markAsRead } from "@/store/slices/notificationSlice";
import { useDispatch } from "react-redux";
import { formatTimeAgo } from "@/utils/helpers";

const RecentActivities = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [newNotificationId, setNewNotificationId] = useState<string | null>(
    null
  );
  const dispatch = useDispatch();
  // Format notification type for display
  const formatNotificationType = (type: string) => {
    return type.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  // Helper function to format time ago
  // const formatTimeAgo = (timestamp: string) => {
  //   if (!timestamp) return "Just now";

  //   const now = new Date();
  //   const time = new Date(timestamp);

  //   // Check if the timestamp is valid
  //   if (isNaN(time.getTime())) {
  //     return "Just now";
  //   }

  //   const diffInMinutes = Math.floor(
  //     (now.getTime() - time.getTime()) / (1000 * 60)
  //   );

  //   if (diffInMinutes < 1) return "Just now";
  //   if (diffInMinutes < 60)
  //     return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`;

  //   const diffInHours = Math.floor(diffInMinutes / 60);
  //   if (diffInHours < 24)
  //     return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;

  //   const diffInDays = Math.floor(diffInHours / 24);
  //   return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
  // };

  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const response = await getAllNotifications();
      //@ts-ignore
      if (response?.notifications && Array.isArray(response.notifications)) {
        //@ts-ignore
        console.log("Notifications: ", response.notifications);
        //@ts-ignore
        setNotifications(response.notifications);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
      toast.error("Failed to fetch notifications");
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    // Handle socket events for real-time updates
    const handleNewNotification = (data: any) => {
      console.log("New notification received:", data);

      // Ensure the notification has proper timestamp format
      const formattedNotification = {
        ...data,
        createdAt: data.createdAt || new Date().toISOString(),
        isRead: false,
        id: data.id || Date.now().toString(),
      };

      // Add new notification to the beginning of the list
      setNotifications((prev) => [formattedNotification, ...prev]);

      // Show toast notification
      toast.success(data.message || "New notification received", {
        duration: 5000,
        position: "top-right",
      });

      // Highlight new notification
      setNewNotificationId(formattedNotification.id);
      setTimeout(() => {
        setNewNotificationId(null);
      }, 3000);
    };

    // Listen to socket events that might create notifications
    socket.on("newReservationRequest", handleNewNotification);
    socket.on("reservationStatusUpdate", handleNewNotification);
    socket.on("reservationUpdated", handleNewNotification);
    socket.on("reservationCancelled", handleNewNotification);
    socket.on("reservationCompleted", handleNewNotification);

    return () => {
      socket.off("newReservationRequest", handleNewNotification);
      socket.off("reservationStatusUpdate", handleNewNotification);
      socket.off("reservationUpdated", handleNewNotification);
      socket.off("reservationCancelled", handleNewNotification);
      socket.off("reservationCompleted", handleNewNotification);
    };
  }, []);

  // Get background gradient for notification type
  const getNotificationGradient = (type: string) => {
    switch (type) {
      case "new_reservation_request":
        return "bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200";
      case "reservation_cancelled":
        return "bg-gradient-to-r from-red-50 to-red-100 border-red-200";
      case "reservation_created":
      case "reservation_approved":
        return "bg-gradient-to-r from-green-50 to-green-100 border-green-200";
      case "reservation_updated":
        return "bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200";
      case "reservation_rejected":
        return "bg-gradient-to-r from-red-50 to-red-100 border-red-200";
      case "user_joined":
        return "bg-gradient-to-r from-indigo-50 to-indigo-100 border-indigo-200";
      case "room_booked":
        return "bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200";
      case "meeting_reminder":
        return "bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200";
      case "general":
        return "bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200";
      default:
        return "bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200";
    }
  };

  // Get icon for notification type with Lucide icons
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "new_reservation_request":
        return <Bell className="w-5 h-5 text-blue-600" />;
      case "reservation_cancelled":
        return <XCircle className="w-5 h-5 text-red-600" />;
      case "reservation_created":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "reservation_updated":
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      case "reservation_approved":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "reservation_rejected":
        return <XCircle className="w-5 h-5 text-red-600" />;
      case "user_joined":
        return <User className="w-5 h-5 text-indigo-600" />;
      case "room_booked":
        return <MapPin className="w-5 h-5 text-purple-600" />;
      case "meeting_reminder":
        return <Clock className="w-5 h-5 text-orange-600" />;
      case "general":
        return <Bell className="w-5 h-5 text-gray-600" />;
      default:
        return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      // First update the UI immediately
      dispatch(markAsRead(id));

      // Then call the API
      await markNotificationAsRead(id);
    } catch (error) {
      console.error("Error marking notification as read:", error);
      // You might want to revert the UI change here if the API call fails
    } finally {
      fetchNotifications();
    }
  };

  return (
    <div className="lg:col-span-2">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-slate-50 to-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Bell className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Activity Center
                </h2>
                <p className="text-sm text-gray-600">
                  Real-time notifications and updates
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1 text-xs text-gray-500 bg-white px-2 py-1 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Live</span>
              </div>
              <button
                onClick={fetchNotifications}
                disabled={isLoading}
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 transition-all duration-200 shadow-sm"
              >
                <RefreshCw
                  size={12}
                  className={`mr-1.5 ${isLoading ? "animate-spin" : ""}`}
                />
                {isLoading ? "Syncing..." : "Refresh"}
              </button>
            </div>
          </div>
        </div>
        <div className="p-6 bg-gray-50 h-96 overflow-auto">
          {notifications.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bell className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No notifications yet
              </h3>
              <p className="text-gray-500 text-sm">
                New activities will appear here when they happen
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {notifications.slice(0, 10).map((notification) => {
                const isNew = newNotificationId === notification.id;

                return (
                  <div
                    key={notification.id}
                    className={`group relative overflow-hidden rounded-xl border-2 transition-all duration-300 cursor-pointer hover:scale-[1.01] min-h-[120px] ${
                      isNew
                        ? "border-blue-400 shadow-lg shadow-blue-100 animate-pulse"
                        : !notification.isRead
                        ? `${getNotificationGradient(
                            notification.type
                          )} shadow-md hover:shadow-lg`
                        : "bg-white border-gray-200 hover:border-gray-300 hover:shadow-md"
                    }`}
                  >
                    <div
                      className="p-5"
                      onClick={() => handleMarkAsRead(notification.id)}
                    >
                      <div className="flex items-start space-x-4">
                        {/* Icon with animation */}
                        <div
                          className={`flex-shrink-0 p-3 rounded-xl ${
                            isNew ? "bg-blue-100 animate-bounce" : "bg-white"
                          } shadow-sm border`}
                        >
                          {getNotificationIcon(notification.type)}
                        </div>

                        <div className="flex-1 min-w-0">
                          {/* Header */}
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <h4
                                className={`text-base font-semibold leading-tight ${
                                  !notification.isRead
                                    ? "text-gray-900"
                                    : "text-gray-700"
                                }`}
                              >
                                {notification.message}
                              </h4>
                              <div className="flex items-center space-x-3 mt-1">
                                <span className="text-xs text-gray-500 flex items-center">
                                  <Clock className="w-3 h-3 mr-1" />
                                  {formatTimeAgo(notification.createdAt)}
                                </span>
                                <span
                                  className={`text-xs px-2 py-1 rounded-full font-medium ${
                                    notification.type ===
                                    "new_reservation_request"
                                      ? "bg-blue-100 text-blue-700"
                                      : notification.type ===
                                        "reservation_cancelled"
                                      ? "bg-red-100 text-red-700"
                                      : notification.type ===
                                        "reservation_created"
                                      ? "bg-green-100 text-green-700"
                                      : notification.type ===
                                        "reservation_updated"
                                      ? "bg-yellow-100 text-yellow-700"
                                      : "bg-gray-100 text-gray-700"
                                  }`}
                                >
                                  {formatNotificationType(notification.type)}
                                </span>
                              </div>
                            </div>

                            {/* Read status indicator */}
                            {!notification.isRead && (
                              <div className="flex items-center space-x-2 ml-3">
                                <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                                <span className="text-xs font-medium text-blue-600">
                                  New
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Quick Info */}
                          {notification.data && (
                            <div className="grid grid-cols-2 gap-3 mb-3">
                              {notification.data.Room && (
                                <div className="flex items-center space-x-2 text-sm text-gray-600">
                                  <MapPin className="w-4 h-4 text-gray-400" />
                                  <span className="truncate">
                                    {notification.data.Room.name}
                                  </span>
                                </div>
                              )}
                              {notification.data.User && (
                                <div className="flex items-center space-x-2 text-sm text-gray-600">
                                  <User className="w-4 h-4 text-gray-400" />
                                  <span className="truncate">
                                    {notification.data.User.name}
                                  </span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {notifications.length > 10 && (
            <div className="mt-6 text-center">
              <div className="inline-flex items-center space-x-2 text-sm text-gray-600 bg-white px-4 py-2 rounded-full border border-gray-200 shadow-sm">
                <Bell className="w-4 h-4" />
                <span>Showing 10 of {notifications.length} notifications</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecentActivities;
