import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { updateBooking } from "../../store/slices/bookingSlice";
import { Booking } from "../../types/interfaces";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";

// Validation schema for booking modification
const modifyBookingSchema = z.object({
  title: z.string().min(1, "Title is required"),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  room: z.string().min(1, "Room is required"),
});

type ModifyBookingFormData = z.infer<typeof modifyBookingSchema>;

interface ModifyBookingModalProps {
  booking: Booking | null;
  isOpen: boolean;
  onClose: () => void;
}

const ModifyBookingModal: React.FC<ModifyBookingModalProps> = ({
  booking,
  isOpen,
  onClose,
}) => {
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ModifyBookingFormData>({
    resolver: zodResolver(modifyBookingSchema),
    defaultValues: booking
      ? {
          title: booking.title,
          date: booking.date,
          time: booking.time,
          room: booking.room,
        }
      : undefined,
  });

  // Reset form when booking changes
  React.useEffect(() => {
    if (booking) {
      reset({
        title: booking.title,
        date: booking.date,
        time: booking.time,
        room: booking.room,
      });
    }
  }, [booking, reset]);

  const onSubmit = async (data: ModifyBookingFormData) => {
    if (!booking) return;

    try {
      // Dispatch update action
      dispatch(
        updateBooking({
          id: booking.id,
          updates: {
            title: data.title,
            date: data.date,
            time: data.time,
            room: data.room,
          },
        })
      );

      toast.success("Booking updated successfully!");
      onClose();
    } catch (error) {
      toast.error("Failed to update booking. Please try again.");
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  if (!booking) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Modify Booking</DialogTitle>
          <DialogDescription>
            Update your booking details below. Click save when you're done.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-4">
            {/* Title Field */}
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Meeting Title
              </label>
              <input
                id="title"
                type="text"
                {...register("title")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter meeting title"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* Date Field */}
            <div>
              <label
                htmlFor="date"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Date
              </label>
              <input
                id="date"
                type="date"
                {...register("date")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.date && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.date.message}
                </p>
              )}
            </div>

            {/* Time Field */}
            <div>
              <label
                htmlFor="time"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Time
              </label>
              <input
                id="time"
                type="time"
                {...register("time")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.time && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.time.message}
                </p>
              )}
            </div>

            {/* Room Field */}
            <div>
              <label
                htmlFor="room"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Room
              </label>
              <select
                id="room"
                {...register("room")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select a room</option>
                <option value="Conference Room A">Conference Room A</option>
                <option value="Conference Room B">Conference Room B</option>
                <option value="Meeting Room 1">Meeting Room 1</option>
                <option value="Meeting Room 2">Meeting Room 2</option>
                <option value="Board Room">Board Room</option>
                <option value="Training Room">Training Room</option>
              </select>
              {errors.room && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.room.message}
                </p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ModifyBookingModal;
