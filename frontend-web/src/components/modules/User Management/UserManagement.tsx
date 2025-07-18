import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import DeleteConfirmModal from "@/components/ui/DeleteConfirmModal";
import { useSelector } from "react-redux";
import {
  deleteUserFromOrg,
  demoteToEmployee,
  getOrganizationMemebers,
  promoteToAdmin,
} from "@/api/services/userService";
import {
  UserStatsCards,
  InviteKeySection,
  UserFilters,
  UserTable,
  UserEditModal,
} from "./subcomponents";
import { User } from "@/types/interfaces";

// User interface based on backend structure

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
      <UserStatsCards users={users} />

      {/* Invite Key Section */}
      <InviteKeySection inviteKey={inviteKey} />

      {/* Filters */}
      <UserFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterRole={filterRole}
        setFilterRole={setFilterRole}
      />

      {/* Users Table */}
      <UserTable
        users={filteredUsers}
        loading={loading}
        onEdit={openEditModal}
        onDelete={handleDeleteUser}
      />

      {/* Edit User Modal */}
      <UserEditModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setSelectedUser(null);
          setIsEditModalOpen(false);
        }}
        user={selectedUser}
        onPromoteToAdmin={handlePromoteToAdmin}
        onDemoteToEmployee={handleDemoteToEmployee}
        isPromoting={isPromoting}
        isDemoting={isDemoting}
      />

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
