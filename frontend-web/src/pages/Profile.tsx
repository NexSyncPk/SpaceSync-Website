import React from "react";
import { User, Mail, Phone, Building, Settings } from "lucide-react";
import { useSelector } from "react-redux";

const Profile: React.FC = () => {
  const user = useSelector((state: any) => state.auth.user);

  // Format join date from createdAt
  const joinDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
      })
    : "N/A";

  // Fallback data if user is not available
  const userInfo = {
    name: user?.name || "Unknown User",
    email: user?.email || "N/A",
    phone: user?.phone || "N/A",
    department: user?.department || "N/A",
    position: user?.position || "N/A",
    joinDate: joinDate,
  };

  return (
    <div className="min-h-screen bg-white w-full sm:w-5/6 md:w-4/6 mx-auto p-5 rounded-lg shadow-2xl">
      <div className="w-full max-w-4xl mx-auto px-4">
        <div className="mt-6">
          <h2 className="font-semibold mb-6 text-lg">Profile</h2>

          {/* Profile Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-8">
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

              {/* Action Buttons */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex flex-wrap gap-3">
                  <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <Settings size={16} className="mr-2" />
                    Edit Profile
                  </button>
                  <button className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                    <Mail size={16} className="mr-2" />
                    Change Email
                  </button>
                  <button className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                    <span className="mr-2">🔐</span>
                    Change Password
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
