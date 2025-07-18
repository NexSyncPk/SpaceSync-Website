import React from "react";
import { Shield, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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

interface UserEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onPromoteToAdmin: (userId: string) => void;
  onDemoteToEmployee: (userId: string) => void;
  isPromoting: boolean;
  isDemoting: boolean;
}

const UserEditModal: React.FC<UserEditModalProps> = ({
  isOpen,
  onClose,
  user,
  onPromoteToAdmin,
  onDemoteToEmployee,
  isPromoting,
  isDemoting,
}) => {
  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
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
              <p className="font-medium">{user.name}</p>
            </div>
            <div>
              <span className="text-gray-600">Email:</span>
              <p className="font-medium">{user.email}</p>
            </div>
            <div>
              <span className="text-gray-600">Phone:</span>
              <p className="font-medium">{user.phone}</p>
            </div>
            <div>
              <span className="text-gray-600">Department:</span>
              <p className="font-medium">{user.department}</p>
            </div>
            <div>
              <span className="text-gray-600">Position:</span>
              <p className="font-medium">{user.position}</p>
            </div>
            <div>
              <span className="text-gray-600">Current Role:</span>
              <p
                className={`font-medium ${
                  user.role === "admin" ? "text-purple-600" : "text-gray-700"
                }`}
              >
                {user.role === "admin" && (
                  <Shield className="w-3 h-3 inline mr-1" />
                )}
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </p>
            </div>
          </div>
        </div>

        {/* Role Action Buttons */}
        <div className="space-y-3">
          <p className="text-sm text-gray-600">
            Choose an action to change this user's role:
          </p>

          {user.role === "employee" ? (
            <Button
              onClick={() => onPromoteToAdmin(user.id)}
              disabled={isPromoting}
              className="w-full flex items-center justify-center gap-2"
            >
              <Shield size={16} />
              {isPromoting ? "Promoting..." : "Promote to Admin"}
            </Button>
          ) : (
            <Button
              onClick={() => onDemoteToEmployee(user.id)}
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
          <Button type="button" variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UserEditModal;
