import React, { useState } from "react";
import {
  Users,
  Search,
  UserPlus,
  Edit,
  Trash2,
  Shield,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import DeleteConfirmModal from "@/components/ui/DeleteConfirmModal";

// User validation schema
const userSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone is required"),
  department: z.string().min(1, "Department is required"),
  position: z.string().min(1, "Position is required"),
  role: z.enum(["user", "admin"]),
});

type UserFormData = z.infer<typeof userSchema>;

// User interface
interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  role: "user" | "admin";
  isActive: boolean;
  joinDate: string;
  bookingCount: number;
  lastLogin: string;
}

// Mock user data
const mockUsers: User[] = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@company.com",
    phone: "03123456789",
    department: "Engineering",
    position: "Software Engineer",
    role: "user",
    isActive: true,
    joinDate: "2024-01-15",
    bookingCount: 15,
    lastLogin: "2024-07-07T10:30:00Z",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane.smith@company.com",
    phone: "03187654321",
    department: "Marketing",
    position: "Marketing Manager",
    role: "user",
    isActive: true,
    joinDate: "2024-02-20",
    bookingCount: 8,
    lastLogin: "2024-07-06T14:15:00Z",
  },
  {
    id: 3,
    name: "Mike Johnson",
    email: "mike.johnson@company.com",
    phone: "03191234567",
    department: "HR",
    position: "HR Director",
    role: "admin",
    isActive: true,
    joinDate: "2023-11-10",
    bookingCount: 25,
    lastLogin: "2024-07-07T09:00:00Z",
  },
  {
    id: 4,
    name: "Sarah Wilson",
    email: "sarah.wilson@company.com",
    phone: "03176543210",
    department: "Sales",
    position: "Sales Representative",
    role: "user",
    isActive: false,
    joinDate: "2024-03-05",
    bookingCount: 3,
    lastLogin: "2024-06-30T16:45:00Z",
  },
];

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState(mockUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      role: "user",
    },
  });

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.department.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = filterRole === "all" || user.role === filterRole;
    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "active" && user.isActive) ||
      (filterStatus === "inactive" && !user.isActive);

    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleAddUser = (data: UserFormData) => {
    const newUser: User = {
      id: users.length + 1,
      ...data,
      isActive: true,
      joinDate: new Date().toISOString().split("T")[0],
      bookingCount: 0,
      lastLogin: new Date().toISOString(),
    };
    setUsers([...users, newUser]);
    toast.success("User added successfully!");
    setIsAddModalOpen(false);
    reset();
  };

  const handleEditUser = (data: UserFormData) => {
    if (selectedUser) {
      const updatedUser: User = {
        ...selectedUser,
        ...data,
      };
      setUsers(
        users.map((user) => (user.id === selectedUser.id ? updatedUser : user))
      );
      toast.success("User updated successfully!");
      setIsEditModalOpen(false);
      setSelectedUser(null);
      reset();
    }
  };

  const handleDeleteUser = (userId: number) => {
    const user = users.find((u) => u.id === userId);
    if (user) {
      setUserToDelete(user);
      setIsDeleteModalOpen(true);
    }
  };

  const confirmDeleteUser = async () => {
    if (!userToDelete) return;

    setIsDeleting(true);
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setUsers(users.filter((user) => user.id !== userToDelete.id));
      toast.success("User deleted successfully!");
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
    } catch (error) {
      toast.error("Failed to delete user. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleStatus = (userId: number) => {
    setUsers(
      users.map((user) =>
        user.id === userId ? { ...user, isActive: !user.isActive } : user
      )
    );
    toast.success("User status updated!");
  };

  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setValue("name", user.name);
    setValue("email", user.email);
    setValue("phone", user.phone);
    setValue("department", user.department);
    setValue("position", user.position);
    setValue("role", user.role);
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
        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2"
        >
          <UserPlus size={16} />
          Add New User
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{users.length}</p>
            </div>
            <Users className="h-6 w-6 text-blue-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Users</p>
              <p className="text-2xl font-bold text-gray-900">
                {users.filter((u) => u.isActive).length}
              </p>
            </div>
            <Calendar className="h-6 w-6 text-green-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
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
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total Bookings
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {users.reduce((sum, u) => sum + u.bookingCount, 0)}
              </p>
            </div>
            <Calendar className="h-6 w-6 text-orange-600" />
          </div>
        </div>
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
            <option value="user">User</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
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
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="text-left p-4 font-medium">User</th>
                <th className="text-left p-4 font-medium">Contact</th>
                <th className="text-left p-4 font-medium">Department</th>
                <th className="text-left p-4 font-medium">Role</th>
                <th className="text-left p-4 font-medium">Status</th>
                <th className="text-left p-4 font-medium">Last Login</th>
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
                          {user.bookingCount} bookings
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
                    <div className="text-sm text-gray-500">{user.position}</div>
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
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        user.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {user.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="text-sm">
                      {new Date(user.lastLogin).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(user.lastLogin).toLocaleTimeString()}
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
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleStatus(user.id)}
                      >
                        {user.isActive ? "Deactivate" : "Activate"}
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
        </div>
        {filteredUsers.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No users found matching your criteria.
          </div>
        )}
      </div>

      {/* Add User Modal */}
      <Dialog
        open={isAddModalOpen}
        onOpenChange={(open) => {
          if (!open) {
            reset();
          }
          setIsAddModalOpen(open);
        }}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(handleAddUser)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  {...register("name")}
                  placeholder="Enter full name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  {...register("email")}
                  placeholder="Enter email address"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  {...register("phone")}
                  placeholder="Enter phone number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.phone && (
                  <p className="text-sm text-red-500">{errors.phone.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Department
                </label>
                <input
                  {...register("department")}
                  placeholder="Enter department"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.department && (
                  <p className="text-sm text-red-500">
                    {errors.department.message}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Position
                </label>
                <input
                  {...register("position")}
                  placeholder="Enter position"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.position && (
                  <p className="text-sm text-red-500">
                    {errors.position.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <select
                  {...register("role")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
                {errors.role && (
                  <p className="text-sm text-red-500">{errors.role.message}</p>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  reset();
                  setIsAddModalOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Adding..." : "Add User"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit User Modal */}
      <Dialog
        open={isEditModalOpen}
        onOpenChange={(open) => {
          if (!open) {
            reset();
            setSelectedUser(null);
          }
          setIsEditModalOpen(open);
        }}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(handleEditUser)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  {...register("name")}
                  placeholder="Enter full name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  {...register("email")}
                  placeholder="Enter email address"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  {...register("phone")}
                  placeholder="Enter phone number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.phone && (
                  <p className="text-sm text-red-500">{errors.phone.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Department
                </label>
                <input
                  {...register("department")}
                  placeholder="Enter department"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.department && (
                  <p className="text-sm text-red-500">
                    {errors.department.message}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Position
                </label>
                <input
                  {...register("position")}
                  placeholder="Enter position"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.position && (
                  <p className="text-sm text-red-500">
                    {errors.position.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <select
                  {...register("role")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
                {errors.role && (
                  <p className="text-sm text-red-500">{errors.role.message}</p>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  reset();
                  setSelectedUser(null);
                  setIsEditModalOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Updating..." : "Update User"}
              </Button>
            </DialogFooter>
          </form>
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
