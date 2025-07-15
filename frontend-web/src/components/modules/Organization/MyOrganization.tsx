import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setOrganization } from "../../../store/slices/organizationSlice";
import { addNotification } from "../../../store/slices/notificationSlice";
import { updateUser } from "../../../store/slices/authSlice";
import { fetchOrganizationByUser } from "@/api/services/userService";
import toast from "react-hot-toast";
import { refreshOrganizationData } from "../../../utils/organizationHelpers";

interface MyOrganizationProps {
  onBack: () => void;
}

const MyOrganization: React.FC<MyOrganizationProps> = ({ onBack }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userOrganization, setUserOrganization] = useState<any>(null);
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.auth.user);
  console.log(user);
  useEffect(() => {
    fetchUserOrganization();
  }, []);

  const fetchUserOrganization = async () => {
    setLoading(true);
    setError("");

    try {
      // Mock API response - replace with actual API call
      const response = await fetchOrganizationByUser(user.organizationId);
      if (response) {
        setUserOrganization(response.data);
        console.log(response.data);
      }
    } catch (err) {
      setError("Failed to fetch organization details. Please try again.");
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinMyOrganization = async () => {
    if (userOrganization) {
      dispatch(setOrganization(userOrganization));

      // Update user's organization ID in auth store
      dispatch(
        updateUser({
          organizationId: userOrganization.id,
        })
      );

      // Add notification for joining
      dispatch(
        addNotification({
          id: Date.now().toString(),
          type: "user_joined",
          message: `You have joined ${userOrganization.name}`,
          timestamp: new Date().toISOString(),
          read: false,
        })
      );

      // Fetch updated organization data with fresh member count
      await refreshOrganizationData(userOrganization.id, dispatch);

      toast.success(`Successfully joined ${userOrganization.name}!`);
    }
  };

  const copyInviteKey = async () => {
    try {
      await navigator.clipboard.writeText(userOrganization.inviteKey);
      toast.success("Invite key copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy invite key");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
              <p className="text-gray-600">Loading your organization...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-2xl">
        <button
          onClick={onBack}
          className="mb-4 flex items-center text-indigo-600 hover:text-indigo-500"
        >
          <svg
            className="w-5 h-5 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back
        </button>

        <h2 className="text-center text-3xl font-extrabold text-gray-900 mb-2">
          My Organization
        </h2>
        <p className="text-center text-sm text-gray-600 mb-8">
          Join your existing organization
        </p>

        <div className="bg-white shadow sm:rounded-lg sm:px-10 px-4 py-8">
          {error && user.organizationId != null ? (
            <div className="text-center">
              <div className="text-red-600 text-sm mb-4">{error}</div>
              <button
                onClick={fetchUserOrganization}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Try Again
              </button>
            </div>
          ) : userOrganization ? (
            <div>
              {/* Organization Card */}
              <div className="border border-gray-200 rounded-lg p-6 mb-6">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center">
                    <div className="w-16 h-16 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-8 h-8 text-indigo-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {userOrganization.name}
                      </h3>
                      <p className="text-gray-500 mt-1 text-sm">
                        Organization ID: {userOrganization.id}
                      </p>
                    </div>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 text-center">
                    Your Organization
                  </span>
                </div>

                {/* Organization Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-blue-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {userOrganization.Users?.length || 0}
                    </div>
                    <div className="text-sm text-blue-600 font-medium">
                      Members
                    </div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {userOrganization.Rooms?.length || 0}
                    </div>
                    <div className="text-sm text-green-600 font-medium">
                      Rooms
                    </div>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4 text-center">
                    <div className="text-lg font-bold text-purple-600">
                      {userOrganization.inviteKey.substring(0, 8)}...
                    </div>
                    <div className="text-sm text-purple-600 font-medium">
                      Invite Key
                    </div>
                  </div>
                </div>

                {/* Organization Details */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500 font-medium">Created:</span>
                    <span className="text-gray-900">
                      {new Date(
                        userOrganization.createdAt
                      ).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500 font-medium">
                      Last Updated:
                    </span>
                    <span className="text-gray-900">
                      {new Date(
                        userOrganization.updatedAt
                      ).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-gray-500 font-medium">
                      Full Invite Key:
                    </span>
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-900 font-mono text-sm">
                        {userOrganization.inviteKey}
                      </span>
                      <button
                        onClick={copyInviteKey}
                        className="p-1 text-gray-400 hover:text-gray-600"
                        title="Copy invite key"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Members Section */}
              {userOrganization.Users && userOrganization.Users.length > 0 && (
                <div className="border border-gray-200 rounded-lg p-6 mb-6 ">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <svg
                      className="w-5 h-5 mr-2 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-2.239"
                      />
                    </svg>
                    Organization Members ({userOrganization.Users.length})
                  </h4>
                  <div className="space-y-3 h-36 overflow-auto">
                    {userOrganization.Users.map((member: any) => (
                      <div
                        key={member.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                            <span className="text-indigo-600 font-medium text-sm">
                              {member.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">
                              {member.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              {member.email}
                            </p>
                          </div>
                        </div>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            member.role === "admin"
                              ? "bg-red-100 text-red-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {member.role}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Rooms Section */}
              {userOrganization.Rooms && userOrganization.Rooms.length > 0 && (
                <div className="border border-gray-200 rounded-lg p-6 mb-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <svg
                      className="w-5 h-5 mr-2 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                    Available Rooms ({userOrganization.Rooms.length})
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 h-40 overflow-auto">
                    {userOrganization.Rooms.map((room: any) => (
                      <div
                        key={room.id}
                        className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-medium text-gray-900">
                            {room.name}
                          </h5>
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <svg
                              className="w-4 h-4 text-green-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                            </svg>
                          </div>
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <svg
                            className="w-4 h-4 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-2.239"
                            />
                          </svg>
                          Capacity: {room.capacity} people
                        </div>
                        <div className="mt-2 text-xs text-gray-400">
                          Room ID: {room.id.substring(0, 8)}...
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* User Info */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h4 className="text-sm font-medium text-gray-900 mb-2">
                  Your Role
                </h4>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">
                      {user?.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {user?.position} • {user?.department}
                    </p>
                  </div>
                </div>
              </div>

              {/* Join Button */}
              <button
                onClick={handleJoinMyOrganization}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Join Organization
              </button>
            </div>
          ) : (
            <div className="text-center">
              <div className="text-gray-500">No organization found</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyOrganization;
