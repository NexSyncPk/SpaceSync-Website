import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { updateUser } from "../../store/slices/authSlice";
import { signupSchema } from "@/schema/validationSchemas";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";

const profileEditSchema = (signupSchema._def.schema as z.ZodObject<any>).omit({
  password: true,
  confirmPassword: true,
});
type ProfileEditFormData = z.infer<typeof profileEditSchema>;

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
}) => {
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.auth.user);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProfileEditFormData>({
    resolver: zodResolver(profileEditSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      department: user?.department || "",
      position: user?.position || "",
    },
  });

  React.useEffect(() => {
    if (user) {
      reset({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        department: user.department || "",
        position: user.position || "",
      });
    }
  }, [user, reset]);

  const onSubmit = async (data: ProfileEditFormData) => {
    console.log("Submitting profile data:", data);
    try {
      console.log(data);
      dispatch(updateUser(data));
      toast.success("Profile updated successfully!");
      onClose();
    } catch (error) {
      toast.error("Failed to update profile. Please try again.");
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md w-full p-0 overflow-hidden rounded-2xl shadow-2xl max-sm:w-11/12">
        <DialogHeader className="px-6 pt-8 pb-2">
          <DialogTitle className="text-2xl font-bold text-gray-800">
            Edit Profile
          </DialogTitle>
          <DialogDescription className="text-gray-500">
            Update your profile information below.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5 px-6 pb-8 pt-2 max-h-[70vh] overflow-y-auto"
        >
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              Name
            </label>
            <input
              id="name"
              type="text"
              {...register("name")}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-600">
                {String(errors.name.message)}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              {...register("email")}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-600">
                {String(errors.email.message)}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              Phone
            </label>
            <input
              id="phone"
              type="text"
              {...register("phone")}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.phone && (
              <p className="mt-1 text-xs text-red-600">
                {String(errors.phone.message)}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="department"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              Department
            </label>
            <input
              id="department"
              type="text"
              {...register("department")}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.department && (
              <p className="mt-1 text-xs text-red-600">
                {String(errors.department.message)}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="position"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              Position
            </label>
            <input
              id="position"
              type="text"
              {...register("position")}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.position && (
              <p className="mt-1 text-xs text-red-600">
                {String(errors.position.message)}
              </p>
            )}
          </div>
          <DialogFooter className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
              className="rounded-lg px-6 py-2 border-gray-300"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg px-6 py-2"
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileModal;
