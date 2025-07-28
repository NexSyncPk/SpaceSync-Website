import React, { useState, useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  Building,
  Settings,
  Users,
  Shield,
  RefreshCw,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import EditProfileModal from "@/components/modals/EditProfileModal";
import NotificationBell from "@/components/shared/NotificationBell";
import {
  fetchOrganizationByUser,
  getAllNotifications,
} from "@/api/services/userService";
import socket from "@/utils/socketManager";
import { setOrganization } from "@/store/slices/organizationSlice";
import { setNotifications } from "@/store/slices/notificationSlice";
import toast from "react-hot-toast";

const Profile: React.FC = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const user = useSelector((state: any) => state.auth.user);
  const organization = useSelector((state: any) => state.organization.current);
  const dispatch = useDispatch();

  const refreshOrganizationData = async () => {
    if (!user?.organizationId) {
      console.log("❌ No organizationId found for user");
      return;
    }

    setIsRefreshing(true);
    try {
      console.log(
        "🔄 Refreshing organization data for orgId:",
        user.organizationId
      );
      const response = await fetchOrganizationByUser(user.organizationId);
      if (response && response.data) {
        dispatch(setOrganization(response.data));
      }
    } catch (error) {
      console.error("❌ Error refreshing organization data:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (user?.organizationId) {
      refreshOrganizationData();
    }
  }, [user?.organizationId, user?.id]);

  useEffect(() => {
    // Handle socket events for real-time updates
    const handleNewNotification = (data: any) => {
      console.log("New notification received:", data);

      // Show toast notification
      toast.success(data.message || "New notification received", {
        duration: 5000,
        position: "top-right",
      });

      fetchNotifications();
    };

    // Listen to socket events that might create notifications
    socket.on("reservationStatusUpdate", handleNewNotification);
    socket.on("reservationCompleted", handleNewNotification);

    return () => {
      socket.off("reservationStatusUpdate", handleNewNotification);
      socket.off("reservationCompleted", handleNewNotification);
    };
  }, []);

  const joinDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
      })
    : "N/A";

  const userInfo = {
    name: user?.name || "Current User",
    email: user?.email || "user@example.com",
    phone: user?.phone || "N/A",
    department: user?.department || "N/A",
    position: user?.position || "N/A",
    joinDate: joinDate,
    role: user?.role || "member",
    organization: organization?.name || "N/A",
  };

  const fetchNotifications = async () => {
    try {
      const response = await getAllNotifications();
      console.log("Full response: ", response);

      // The backend returns notifications directly as response.notifications
      let notificationsArray = null;
      // @ts-ignore
      if (response?.notifications && Array.isArray(response.notifications)) {
        // @ts-ignore
        notificationsArray = response.notifications;
      }

      console.log("Notifications array: ", notificationsArray);

      if (notificationsArray && notificationsArray.length > 0) {
        // Transform backend notifications to match our frontend format
        const transformedNotifications = notificationsArray.map(
          (notification: any) => ({
            id: notification.id,
            userId: notification.userId,
            type: notification.type,
            message: notification.message,
            data: notification.data,
            read: notification.isRead,
            isRead: notification.isRead,
            timestamp: notification.createdAt,
            createdAt: notification.createdAt,
            updatedAt: notification.updatedAt,
          })
        );

        console.log("Transformed notifications: ", transformedNotifications);

        // Dispatch notifications to Redux store
        dispatch(setNotifications(transformedNotifications));
      } else {
        console.log("No notifications found or empty array");
        // Dispatch empty array to clear any existing notifications
        dispatch(setNotifications([]));
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <div className="min-h-fit bg-white w-full sm:w-5/6 md:w-4/6 mx-auto p-5 rounded-lg shadow-2xl">
      <div className="w-full max-w-4xl mx-auto px-4">
        <div className="mt-6">
          <h2 className="font-semibold mb-6 text-lg">Profile</h2>

          {/* Profile Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
                    <User size={40} className="text-blue-600" />
                  </div>
                  <div className="ml-6 text-white">
                    <h3 className="text-2xl font-bold">{userInfo.name}</h3>
                    <p className="text-blue-100">{userInfo.position}</p>
                    <p className="text-blue-100">{userInfo.department}</p>
                  </div>
                </div>
                {/* Role Badge */}
                <div className="flex items-center space-x-3">
                  <NotificationBell />
                  <div className="flex items-center bg-white bg-opacity-20 px-3 py-1 rounded-full">
                    {userInfo.role === "admin" ? (
                      <Shield size={16} className="text-yellow-300 mr-2" />
                    ) : (
                      <Users size={16} className="text-blue-200 mr-2" />
                    )}
                    <span className="text-white text-sm font-medium capitalize">
                      {userInfo.role}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Information */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Contact Information */}
                <div>
                  <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
                    <Mail size={20} className="mr-2 text-blue-600" />
                    Contact Information
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <Mail size={16} className="text-gray-400 mr-3" />
                      <span className="text-gray-600">{userInfo.email}</span>
                    </div>
                    <div className="flex items-center">
                      <Phone size={16} className="text-gray-400 mr-3" />
                      <span className="text-gray-600">{userInfo.phone}</span>
                    </div>
                  </div>
                </div>

                {/* Work Information */}
                <div>
                  <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
                    <Building size={20} className="mr-2 text-blue-600" />
                    Work Information
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <Building size={16} className="text-gray-400 mr-3" />
                      <span className="text-gray-600">
                        {userInfo.organization}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Users size={16} className="text-gray-400 mr-3" />
                      <span className="text-gray-600">
                        {userInfo.department}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <User size={16} className="text-gray-400 mr-3" />
                      <span className="text-gray-600">{userInfo.position}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-400 mr-3">📅</span>
                      <span className="text-gray-600">
                        Joined {userInfo.joinDate}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {organization && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-800">
                      Organization Details
                    </h4>
                    <button
                      onClick={refreshOrganizationData}
                      disabled={isRefreshing}
                      className="inline-flex items-center px-3 py-1 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                    >
                      <RefreshCw
                        size={14}
                        className={`mr-1 ${isRefreshing ? "animate-spin" : ""}`}
                      />
                      {isRefreshing ? "Refreshing..." : "Refresh"}
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Name:</span>
                      <p className="text-gray-700">
                        {organization?.name || "N/A"}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500">Description:</span>
                      <p className="text-gray-700">
                        {organization.description || "N/A"}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500">Member Count:</span>
                      <p className="text-gray-700 font-semibold">
                        {organization?.Users?.length || 0}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex flex-wrap gap-3">
                  <button
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    onClick={() => setIsEditModalOpen(true)}
                  >
                    <Settings size={16} className="mr-2" />
                    Edit Profile
                  </button>

                  <EditProfileModal
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Recent Notifications */}
          {/* {notifications.length > 0 && (
            <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-gray-800 flex items-center">
                  🔔 Recent Notifications
                </h4>
                <button
                  onClick={fetchNotifications}
                  disabled={isRefreshingNotifications}
                  className="inline-flex items-center px-3 py-1 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  <RefreshCw
                    size={14}
                    className={`mr-1 ${
                      isRefreshingNotifications ? "animate-spin" : ""
                    }`}
                  />
                  {isRefreshingNotifications ? "Refreshing..." : "Refresh"}
                </button>
              </div>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {notifications.slice(0, 5).map((notification: any) => (
                  <div
                    key={notification.id}
                    className={`flex items-start space-x-3 p-3 rounded-lg border ${
                      !notification.read && !notification.isRead
                        ? "bg-blue-50 border-blue-200"
                        : "bg-gray-50 border-gray-200"
                    }`}
                  >
                    <div className="text-lg mt-0.5">
                      {notification.type === "reservation_cancelled"
                        ? "❌"
                        : notification.type === "reservation_created"
                        ? "✅"
                        : notification.type === "reservation_updated"
                        ? "✏️"
                        : "🔔"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm ${
                          !notification.read && !notification.isRead
                            ? "font-medium text-gray-900"
                            : "text-gray-700"
                        }`}
                      >
                        {notification.message}
                      </p>
                      {notification.data &&
                        notification.type === "reservation_cancelled" && (
                          <div className="mt-1 text-xs text-gray-500">
                            <p>
                              <strong>Room:</strong>{" "}
                              {notification.data.Room?.name || "N/A"}
                            </p>
                            <p>
                              <strong>Title:</strong>{" "}
                              {notification.data.title || "N/A"}
                            </p>
                            {notification.data.startTime && (
                              <p>
                                <strong>Date:</strong>{" "}
                                {new Date(
                                  notification.data.startTime
                                ).toLocaleString()}
                              </p>
                            )}
                          </div>
                        )}
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-xs text-gray-400">
                          {new Date(
                            notification.createdAt || notification.timestamp
                          ).toLocaleString()}
                        </p>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${
                            notification.type === "reservation_cancelled"
                              ? "bg-red-100 text-red-700"
                              : notification.type === "reservation_created"
                              ? "bg-green-100 text-green-700"
                              : notification.type === "reservation_updated"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {notification.type
                            .replace(/_/g, " ")
                            .replace(/\b\w/g, (l: string) => l.toUpperCase())}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {notifications.length > 5 && (
                <p className="text-xs text-gray-500 text-center mt-3">
                  Showing 5 of {notifications.length} notifications. Check the
                  notification bell for more.
                </p>
              )}
            </div>
          )} */}
        </div>
      </div>
    </div>
  );
};

export default Profile;
