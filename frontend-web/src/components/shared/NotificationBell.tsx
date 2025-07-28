import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  markAsRead,
  markAllAsRead,
} from "../../store/slices/notificationSlice";
import {
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "@/api/services/userService";

const NotificationBell: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const notificationState = useSelector((state: any) => state.notification);
  const { notifications = [], unreadCount = 0 } = notificationState || {};
  const dispatch = useDispatch();

  const handleMarkAsRead = async (id: string) => {
    try {
      // First update the UI immediately
      dispatch(markAsRead(id));

      // Then call the API
      await markNotificationAsRead(id);
    } catch (error) {
      console.error("Error marking notification as read:", error);
      // You might want to revert the UI change here if the API call fails
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      // First update the UI immediately
      dispatch(markAllAsRead());

      // Then call the API
      await markAllNotificationsAsRead();
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      // You might want to revert the UI change here if the API call fails
    }
  };

  // Get icon for notification type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "user_joined":
        return "👥";
      case "room_booked":
        return "🏢";
      case "meeting_reminder":
        return "⏰";
      case "reservation_cancelled":
        return "❌";
      case "reservation_created":
        return "✅";
      case "reservation_updated":
        return "✏️";
      case "general":
        return "📢";
      default:
        return "🔔";
    }
  };

  // Get relative time
  const getRelativeTime = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor(
      (now.getTime() - time.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    }
  };

  // Get color class for notification type
  const getNotificationColorClass = (type: string) => {
    switch (type) {
      case "user_joined":
        return "bg-green-100 text-green-700";
      case "room_booked":
        return "bg-blue-100 text-blue-700";
      case "meeting_reminder":
        return "bg-orange-100 text-orange-700";
      case "reservation_cancelled":
        return "bg-red-100 text-red-700";
      case "reservation_created":
        return "bg-green-100 text-green-700";
      case "reservation_updated":
        return "bg-yellow-100 text-yellow-700";
      case "general":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // Enhanced notification message with data
  const getEnhancedMessage = (notification: any) => {
    if (notification.data && notification.type === "reservation_cancelled") {
      const roomName = notification.data.Room?.name || "Unknown Room";
      const title = notification.data.title || "Meeting";
      const startTime = notification.data.startTime
        ? new Date(notification.data.startTime).toLocaleDateString()
        : "";

      return (
        <div>
          <p className="font-medium">{notification.message}</p>
          <p className="text-xs text-gray-500 mt-1">
            Title: {title} • Room: {roomName}
            {startTime && ` • Date: ${startTime}`}
          </p>
        </div>
      );
    }
    return <p>{notification.message}</p>;
  };

  // Format notification type for display
  const formatNotificationType = (type: string) => {
    return type.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-white hover:text-gray-200 focus:border-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
          <div className="px-4 py-3 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-900">
                Notifications
              </h3>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="text-xs text-indigo-600 hover:text-indigo-500"
                >
                  Mark all as read
                </button>
              )}
            </div>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-4 py-3 text-sm text-gray-500 text-center">
                No notifications yet
              </div>
            ) : (
              notifications.map((notification: any) => (
                <div
                  key={notification.id}
                  className={`px-4 py-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                    !notification.read
                      ? "bg-blue-50 border-l-4 border-l-blue-500"
                      : ""
                  }`}
                  onClick={() => handleMarkAsRead(notification.id)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-start space-x-3 flex-1">
                      <div className="text-lg mt-0.5">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div
                          className={`text-sm ${
                            !notification.read
                              ? "font-medium text-gray-900"
                              : "text-gray-700"
                          }`}
                        >
                          {getEnhancedMessage(notification)}
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <p className="text-xs text-gray-500">
                            {getRelativeTime(notification.timestamp)}
                          </p>
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full ${getNotificationColorClass(
                              notification.type
                            )}`}
                          >
                            {formatNotificationType(notification.type)}
                          </span>
                        </div>
                      </div>
                    </div>
                    {!notification.read && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 ml-2 flex-shrink-0"></div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
