import React from "react";
import { Users, Shield } from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  role: "employee" | "admin";
  createdAt: string;
  updatedAt: string;
  organizationId: string;
}

interface UserStatsCardsProps {
  users: User[];
}

const UserStatsCards: React.FC<UserStatsCardsProps> = ({ users }) => {
  const adminCount = users.filter((u) => u.role === "admin").length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 place-items-center">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 w-9/12">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Users</p>
            <p className="text-2xl font-bold text-gray-900">{users.length}</p>
          </div>
          <Users className="h-6 w-6 text-blue-600" />
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 w-9/12">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Admins</p>
            <p className="text-2xl font-bold text-gray-900">{adminCount}</p>
          </div>
          <Shield className="h-6 w-6 text-purple-600" />
        </div>
      </div>
    </div>
  );
};

export default UserStatsCards;
