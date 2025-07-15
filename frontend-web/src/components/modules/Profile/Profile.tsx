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
import { fetchOrganizationByUser } from "@/api/services/userService";
import { setOrganization } from "@/store/slices/organizationSlice";

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
      console.log("🔄 Refreshing organization data for orgId:", user.organizationId);
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
                  {userInfo.role === "admin" && <NotificationBell />}
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
                        className={`mr-1 ${isRefreshing ? 'animate-spin' : ''}`} 
                      />
                      {isRefreshing ? 'Refreshing...' : 'Refresh'}
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
                    {/* <div>
                      <span className="text-gray-500">Joined:</span>
                      <p className="text-gray-700">
                        {organization.joinedAt
                          ? new Date(organization.joinedAt).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )
                          : "N/A"}
                      </p>
                    </div> */}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
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

          {/* Recent Activity */}
          {/* <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h4 className="font-semibold text-gray-800 mb-4">
              Recent Activity
            </h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Booked Conference Room A</span>
                <span className="text-sm text-gray-400">2 hours ago</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">
                  Updated profile information
                </span>
                <span className="text-sm text-gray-400">1 day ago</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-gray-600">
                  Cancelled meeting in Creative Studio
                </span>
                <span className="text-sm text-gray-400">3 days ago</span>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default Profile;
