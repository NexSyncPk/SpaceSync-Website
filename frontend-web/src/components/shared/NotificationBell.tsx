import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  markAsRead,
  markAllAsRead,
  addNotification,
} from "../../store/slices/notificationSlice";

const NotificationBell: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const notificationState = useSelector((state: any) => state.notification);
  const { notifications = [], unreadCount = 0 } = notificationState || {};
  const { current: organization } = useSelector(
    (state: any) => state.organization
  );
  const dispatch = useDispatch();

  // Add sample notifications for demonstration
  useEffect(() => {
    // Only add notifications if there are none and user is admin
    if (notifications.length === 0 && organization?.role === "admin") {
      const sampleNotifications = [
        {
          id: Date.now().toString() + "1",
          type: "user_joined" as const,
          message: "John Smith has joined the organization",
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
          read: false,
        },
        {
          id: Date.now().toString() + "2",
          type: "room_booked" as const,
          message: "Conference Room A has been booked for tomorrow at 2:00 PM",
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
          read: false,
        },
        {
          id: Date.now().toString() + "3",
          type: "meeting_reminder" as const,
          message:
            "Meeting reminder: Team standup in Conference Room B starts in 30 minutes",
          timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
          read: true,
        },
        {
          id: Date.now().toString() + "4",
          type: "user_joined" as const,
          message: "Sarah Johnson has joined the organization",
          timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
          read: false,
        },
        {
          id: Date.now().toString() + "5",
          type: "room_booked" as const,
          message: "Creative Studio has been booked for Friday at 10:00 AM",
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
          read: true,
        },
        {
          id: Date.now().toString() + "6",
          type: "general" as const,
          message: "New room cleaning schedule has been implemented",
          timestamp: new Date(
            Date.now() - 2 * 24 * 60 * 60 * 1000
          ).toISOString(), // 2 days ago
          read: true,
        },
        {
          id: Date.now().toString() + "7",
          type: "user_joined" as const,
          message: "Mike Davis has joined the organization",
          timestamp: new Date(
            Date.now() - 3 * 24 * 60 * 60 * 1000
          ).toISOString(), // 3 days ago
          read: false,
        },
        {
          id: Date.now().toString() + "8",
          type: "room_booked" as const,
          message: "Training Room has been booked for next week",
          timestamp: new Date(
            Date.now() - 4 * 24 * 60 * 60 * 1000
          ).toISOString(), // 4 days ago
          read: true,
        },
      ];

      // Add notifications one by one
      sampleNotifications.forEach((notification) => {
        dispatch(addNotification(notification));
      });
    }
  }, [dispatch, notifications.length, organization?.role]);

  const handleMarkAsRead = (id: string) => {
    dispatch(markAsRead(id));
  };

  const handleMarkAllAsRead = () => {
    dispatch(markAllAsRead());
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

  // Only show notifications for admins
  if (organization?.role !== "admin") {
    return null;
  }

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
                        <p
                          className={`text-sm ${
                            !notification.read
                              ? "font-medium text-gray-900"
                              : "text-gray-700"
                          }`}
                        >
                          {notification.message}
                        </p>
                        <div className="flex items-center justify-between mt-1">
                          <p className="text-xs text-gray-500">
                            {getRelativeTime(notification.timestamp)}
                          </p>
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full ${
                              notification.type === "user_joined"
                                ? "bg-green-100 text-green-700"
                                : notification.type === "room_booked"
                                ? "bg-blue-100 text-blue-700"
                                : notification.type === "meeting_reminder"
                                ? "bg-orange-100 text-orange-700"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {notification.type.replace("_", " ")}
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
