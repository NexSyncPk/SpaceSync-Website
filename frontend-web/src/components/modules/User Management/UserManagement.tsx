import React, { useEffect, useState } from "react";
import { Users, Search, Edit, Trash2, Shield, Copy, Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import toast from "react-hot-toast";
import DeleteConfirmModal from "@/components/ui/DeleteConfirmModal";
import { useSelector } from "react-redux";
import {
  deleteUserFromOrg,
  demoteToEmployee,
  getOrganizationMemebers,
  promoteToAdmin,
} from "@/api/services/userService";

// User interface based on backend structure
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

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPromoting, setIsPromoting] = useState(false);
  const [isDemoting, setIsDemoting] = useState(false);

  const user = useSelector((state: any) => state.auth.user);
  const organization = useSelector((state: any) => state.organization.current);

  // Get invite key from Redux state
  const inviteKey = user?.Organization?.inviteKey || "";

  // Copy invite key to clipboard
  const copyInviteKey = async () => {
    try {
      await navigator.clipboard.writeText(inviteKey);
      toast.success("Invite key copied to clipboard!");
    } catch (error) {
      console.error("Error copying to clipboard:", error);
      toast.error("Failed to copy invite key");
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.department.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = filterRole === "all" || user.role === filterRole;

    return matchesSearch && matchesRole;
  });

  const fetchOrgUsers = async () => {
    try {
      setLoading(true);
      const response = await getOrganizationMemebers(organization?.id);
      if (response && typeof response === "object" && "data" in response) {
        // Handle the response structure based on your API
        const userData =
          response.data?.data?.users || response.data?.data || response.data;
        setUsers(Array.isArray(userData) ? userData : []);
        console.log("Fetched users:", userData);
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to fetch users");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (organization?.id) {
      fetchOrgUsers();
    }
  }, [organization?.id]);

  const handlePromoteToAdmin = async (userId: string) => {
    setIsPromoting(true);
    try {
      // TODO: Replace with actual API call to promote user to admin
      await promoteToAdmin(userId);
      toast.success("User promoted to admin successfully!");
      fetchOrgUsers();
      setIsEditModalOpen(false);
      setSelectedUser(null);
    } catch (error) {
      console.error("Error promoting user:", error);
      // Backend will handle if user is already admin
      toast.error("Failed to promote user");
    } finally {
      setIsPromoting(false);
    }
  };

  const handleDemoteToEmployee = async (userId: string) => {
    setIsDemoting(true);
    try {
      // TODO: Replace with actual API call to demote user to employee
      await demoteToEmployee(userId);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("User demoted to employee successfully!");
      fetchOrgUsers();
      setIsEditModalOpen(false);
      setSelectedUser(null);
    } catch (error) {
      console.error("Error demoting user:", error);
      // Backend will handle if user is already employee
      toast.error("Failed to demote user");
    } finally {
      setIsDemoting(false);
    }
  };

  const handleDeleteUser = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    console.log(user);
    if (user) {
      setUserToDelete(user);
      setIsDeleteModalOpen(true);
    }
  };

  const confirmDeleteUser = async () => {
    if (!userToDelete) return;

    setIsDeleting(true);

    console.log(userToDelete?.id);
    try {
      // TODO: Replace with actual API call
      await deleteUserFromOrg(userToDelete.id);
      toast.success("User deleted successfully!");
      fetchOrgUsers();
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  // Remove the toggle status function since we don't have isActive field

  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-1">
            Manage user accounts and permissions
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 place-items-center ">
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
              <p className="text-2xl font-bold text-gray-900">
                {users.filter((u) => u.role === "admin").length}
              </p>
            </div>
            <Shield className="h-6 w-6 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Invite Key Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Key className="h-5 w-5 text-blue-600" />
              Organization Invite Key
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Share this key with new users to join your organization
            </p>
          </div>
        </div>

        {inviteKey ? (
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border">
            <div className="flex-1 font-mono text-sm bg-white p-3 rounded border border-gray-200 text-gray-700">
              {inviteKey}
            </div>
            <Button
              onClick={copyInviteKey}
              variant="outline"
              size="sm"
              className="flex items-center gap-2 whitespace-nowrap"
            >
              <Copy size={16} />
              Copy
            </Button>
          </div>
        ) : (
          <div className="p-4 bg-gray-50 rounded-lg border border-dashed border-gray-300 text-center">
            <p className="text-gray-500 text-sm">
              No invite key available for this organization
            </p>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                placeholder="Search users by name, email, or department..."
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSearchTerm(e.target.value)
                }
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="employee">Employee</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Users ({filteredUsers.length})
          </h2>
        </div>
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading users...</p>
          </div>
        ) : (
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
                {filteredUsers.map((user) => (
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
                      <div className="text-sm text-gray-900">
                        {user.department}
                      </div>
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
                          onClick={() => openEditModal(user)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredUsers.length === 0 && !loading && (
              <div className="text-center py-8 text-gray-500">
                No users found matching your criteria.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Edit User Modal */}
      <Dialog
        open={isEditModalOpen}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedUser(null);
          }
          setIsEditModalOpen(open);
        }}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>User Role Management</DialogTitle>
          </DialogHeader>

          {/* Display user information */}
          <div className="bg-gray-50 p-4 rounded-lg border">
            <h4 className="font-medium text-gray-900 mb-3">User Information</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Name:</span>
                <p className="font-medium">{selectedUser?.name}</p>
              </div>
              <div>
                <span className="text-gray-600">Email:</span>
                <p className="font-medium">{selectedUser?.email}</p>
              </div>
              <div>
                <span className="text-gray-600">Phone:</span>
                <p className="font-medium">{selectedUser?.phone}</p>
              </div>
              <div>
                <span className="text-gray-600">Department:</span>
                <p className="font-medium">{selectedUser?.department}</p>
              </div>
              <div>
                <span className="text-gray-600">Position:</span>
                <p className="font-medium">{selectedUser?.position}</p>
              </div>
              <div>
                <span className="text-gray-600">Current Role:</span>
                <p
                  className={`font-medium ${
                    selectedUser?.role === "admin"
                      ? "text-purple-600"
                      : "text-gray-700"
                  }`}
                >
                  {selectedUser?.role === "admin" && (
                    <Shield className="w-3 h-3 inline mr-1" />
                  )}
                  {selectedUser?.role
                    ? selectedUser.role.charAt(0).toUpperCase() +
                      selectedUser.role.slice(1)
                    : ""}
                </p>
              </div>
            </div>
          </div>

          {/* Role Action Buttons */}
          <div className="space-y-3">
            <p className="text-sm text-gray-600">
              Choose an action to change this user's role:
            </p>

            {selectedUser?.role === "employee" ? (
              <Button
                onClick={() =>
                  selectedUser && handlePromoteToAdmin(selectedUser.id)
                }
                disabled={isPromoting}
                className="w-full flex items-center justify-center gap-2"
              >
                <Shield size={16} />
                {isPromoting ? "Promoting..." : "Promote to Admin"}
              </Button>
            ) : (
              <Button
                onClick={() =>
                  selectedUser && handleDemoteToEmployee(selectedUser.id)
                }
                disabled={isDemoting}
                variant="destructive"
                className="w-full flex items-center justify-center gap-2"
              >
                <Users size={16} />
                {isDemoting ? "Demoting..." : "Demote to Employee"}
              </Button>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setSelectedUser(null);
                setIsEditModalOpen(false);
              }}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setUserToDelete(null);
        }}
        onConfirm={confirmDeleteUser}
        title="Delete User"
        description="Are you sure you want to delete this user? This action cannot be undone and will remove all their data and booking history."
        itemName={userToDelete?.name}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default UserManagement;
