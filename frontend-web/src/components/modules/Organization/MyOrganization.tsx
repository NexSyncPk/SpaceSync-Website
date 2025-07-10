import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setOrganization } from "../../../store/slices/organizationSlice";
import { addNotification } from "../../../store/slices/notificationSlice";

interface MyOrganizationProps {
  onBack: () => void;
}

const MyOrganization: React.FC<MyOrganizationProps> = ({ onBack }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userOrganization, setUserOrganization] = useState<any>(null);
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.auth.user);

  useEffect(() => {
    fetchUserOrganization();
  }, []);

  const fetchUserOrganization = async () => {
    setLoading(true);
    setError("");

    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`/api/users/${user.id}/organization`, {
      //   headers: {
      //     'Authorization': `Bearer ${token}`,
      //     'Content-Type': 'application/json',
      //   },
      // });
      // const data = await response.json();

      // Mock API response - replace with actual API call
      setTimeout(() => {
        if (user?.department) {
          // Simulate finding user's organization based on their department/email domain
          const mockOrganization = {
            id: "user-org-1",
            name: user.department + " Organization",
            description: `Official organization for ${user.department} department`,
            industry: "Technology",
            memberCount: 50,
            role: "member" as const,
            joinedAt: user.createdAt || new Date().toISOString(),
            address: "123 Business St, City, State 12345",
            phone: "+1 (555) 123-4567",
            email: `info@${user.department
              .toLowerCase()
              .replace(/\s+/g, "")}.com`,
            members: [user],
          };
          setUserOrganization(mockOrganization);
        } else {
          setError(
            "No organization found for your account. Please contact your administrator."
          );
        }
        setLoading(false);
      }, 1000);
    } catch (err) {
      setError("Failed to fetch organization details. Please try again.");
      setLoading(false);
    }
  };

  const handleJoinMyOrganization = () => {
    if (userOrganization) {
      dispatch(setOrganization(userOrganization));

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
          {error ? (
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
                <div className="flex items-start justify-between mb-4">
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
                      <p className="text-gray-500 mt-1">
                        {userOrganization.description}
                      </p>
                    </div>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Your Organization
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Industry:</span>
                    <p className="text-gray-900">{userOrganization.industry}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Members:</span>
                    <p className="text-gray-900">
                      {userOrganization.memberCount}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500">Email:</span>
                    <p className="text-gray-900">{userOrganization.email}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Phone:</span>
                    <p className="text-gray-900">{userOrganization.phone}</p>
                  </div>
                  {userOrganization.address && (
                    <div className="md:col-span-2">
                      <span className="text-gray-500">Address:</span>
                      <p className="text-gray-900">
                        {userOrganization.address}
                      </p>
                    </div>
                  )}
                </div>
              </div>

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
                Join My Organization
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
