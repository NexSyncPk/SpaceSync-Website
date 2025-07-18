import React from "react";
import { Shield, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

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

interface UserTableProps {
  users: User[];
  loading: boolean;
  onEdit: (user: User) => void;
  onDelete: (userId: string) => void;
}

const UserTable: React.FC<UserTableProps> = ({
  users,
  loading,
  onEdit,
  onDelete,
}) => {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Users</h2>
        </div>
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">
          Users ({users.length})
        </h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="text-left p-4 font-medium">User</th>
              <th className="text-left p-4 font-medium">Contact</th>
              <th className="text-left p-4 font-medium">Department</th>
              <th className="text-left p-4 font-medium">Role</th>
              <th className="text-left p-4 font-medium">Joined</th>
              <th className="text-left p-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b hover:bg-gray-50">
                <td className="p-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-sm font-medium text-blue-600">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {user.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {user.position}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <div className="text-sm text-gray-900">{user.email}</div>
                  <div className="text-sm text-gray-500">{user.phone}</div>
                </td>
                <td className="p-4">
                  <div className="text-sm text-gray-900">{user.department}</div>
                </td>
                <td className="p-4">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      user.role === "admin"
                        ? "bg-purple-100 text-purple-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {user.role === "admin" && (
                      <Shield className="w-3 h-3 mr-1" />
                    )}
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </span>
                </td>
                <td className="p-4">
                  <div className="text-sm">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(user.createdAt).toLocaleTimeString()}
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(user)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onDelete(user.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && !loading && (
          <div className="text-center py-8 text-gray-500">
            No users found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
};

export default UserTable;
