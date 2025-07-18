import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { UseFormReturn } from "react-hook-form";

interface RoomFormData {
  name: string;
  capacity: number;
  displayProjector?: boolean;
  displayWhiteboard?: boolean;
  cateringAvailable?: boolean;
  videoConferenceAvailable?: boolean;
}

interface RoomFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: RoomFormData) => void;
  form: UseFormReturn<RoomFormData>;
  title: string;
  submitText: string;
  isSubmitting: boolean;
}

const RoomFormModal: React.FC<RoomFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  form,
  title,
  submitText,
  isSubmitting,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = form;

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md max-sm: w-11/12 max-sm:rounded-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Room Name
            </label>
            <input
              {...register("name")}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter room name"
            />
            {errors.name && (
              <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Capacity
            </label>
            <input
              type="number"
              {...register("capacity", { valueAsNumber: true })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter capacity"
            />
            {errors.capacity && (
              <p className="text-red-600 text-sm mt-1">
                {errors.capacity.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Amenities
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  {...register("displayProjector")}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Projector</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  {...register("displayWhiteboard")}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Whiteboard</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  {...register("cateringAvailable")}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Catering</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  {...register("videoConferenceAvailable")}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Video Conference
                </span>
              </label>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? `${submitText.split(" ")[0]}...` : submitText}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RoomFormModal;
