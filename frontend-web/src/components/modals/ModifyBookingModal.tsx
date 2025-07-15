import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { mockRooms } from "../../utils/mockData";
import { useReqAndRoom } from "../../hooks/useReqAndRoom";
import Rooms from "../shared/Rooms";
import { Monitor, PenTool, Tv, Video, CheckCircle } from "lucide-react";

import { z } from "zod";

import { meetingRequestBaseShape } from "../../schema/validationSchemas";
import { convertTo24Hour } from "@/utils/helpers";

// Create a version of meetingRequestSchema with name/department optional for modification, requirements required
const modifyMeetingRequestSchema = z.object({
  ...meetingRequestBaseShape,
  name: meetingRequestBaseShape.name.optional(),
  department: meetingRequestBaseShape.department.optional(),
  requirements: z.array(z.string()),
  status: z.enum(["pending", "approved", "completed", "cancelled"]),
});
type ModifyBookingFormData = z.infer<typeof modifyMeetingRequestSchema>;

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
  const mockRequirements = [
    { iconComponent: Monitor, resource: "Projector" },
    { iconComponent: PenTool, resource: "Whiteboard" },
    { iconComponent: Tv, resource: "TV Screen" },
    { iconComponent: Video, resource: "Video conference" },
  ];

  // Use the custom hook for requirements, attendees, and room selection logic
  const {
    requirements,
    setRequirements,
    numberOfAttendees,
    setNumberOfAttendees,
    filteredRooms,
    selectedRoom,
    setSelectedRoom,
    isLoading,
    error,
    handleRequirementToggle,
    handleAttendeesChange,
    handleRoomSelect,
  } = useReqAndRoom(
    booking?.requirements || [],
    booking?.numberOfAttendees || 1,
    booking?.roomId
  );

  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ModifyBookingFormData>({
    resolver: zodResolver(modifyMeetingRequestSchema),
    defaultValues: booking
      ? {
          meetingTitle: booking.meetingTitle,
          teamAgenda: booking.teamAgenda,
          numberOfAttendees: booking.numberOfAttendees,
          meetingType: booking.meetingType,
          requirements: booking.requirements || [],
          roomId: booking.roomId,
          startTime: convertTo24Hour(booking.startTime) || "",
          endTime: convertTo24Hour(booking.endTime) || "",
          status: booking.status || "pending",
          // name/department left blank for modification
        }
      : undefined,
  });

  // Reset form when booking changes

  // Reset form and states when booking changes
  React.useEffect(() => {
    if (booking) {
      reset({
        meetingTitle: booking.meetingTitle,
        teamAgenda: booking.teamAgenda,
        numberOfAttendees: booking.numberOfAttendees,
        meetingType: booking.meetingType,
        requirements: booking.requirements || [],
        roomId: booking.roomId,
        startTime: convertTo24Hour(booking.startTime) || "",
        endTime: convertTo24Hour(booking.endTime) || "",
        status: booking.status || "pending",
        // name/department left blank for modification
      });
      setRequirements(booking.requirements || []);
      setNumberOfAttendees(booking.numberOfAttendees || 1);
      setSelectedRoom(
        mockRooms.find((room) => room.id === booking.roomId) || null
      );
    }
  }, [booking, reset, setRequirements, setNumberOfAttendees, setSelectedRoom]);

  // Sync numberOfAttendees with react-hook-form
  React.useEffect(() => {
    setValue("numberOfAttendees", numberOfAttendees);
  }, [numberOfAttendees, setValue]);

  const onSubmit = async (data: ModifyBookingFormData) => {
    console.log(data);
    if (!booking) return;
    if (!selectedRoom) {
      toast.error("Please select a room");
      return;
    }
    try {
      dispatch(
        updateBooking({
          id: booking.id,
          updates: {
            meetingTitle: data.meetingTitle,
            teamAgenda: data.teamAgenda,
            numberOfAttendees: data.numberOfAttendees,
            meetingType: data.meetingType,
            requirements: requirements,
            roomId: selectedRoom.id,
            startTime: data.startTime,
            endTime: data.endTime,
            status: booking.status || "pending",
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
      <DialogContent className="max-w-lg w-full p-0 overflow-visible rounded-2xl shadow-2xl max-sm:w-11/12">
        <DialogHeader className="px-8 pt-8 pb-2">
          <DialogTitle className="text-2xl font-bold text-gray-800">
            Modify Booking
          </DialogTitle>
          <DialogDescription className="text-gray-500">
            Update your booking details below. Click save when you're done.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6 px-8 pb-8 pt-2 max-h-[70vh] overflow-y-auto"
        >
          {/* Meeting Title Field */}
          <div>
            <label
              htmlFor="meetingTitle"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              Meeting Title
            </label>
            <input
              id="meetingTitle"
              type="text"
              {...register("meetingTitle")}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              placeholder="Enter meeting title"
            />
            {errors.meetingTitle && (
              <p className="mt-1 text-xs text-red-600">
                {errors.meetingTitle.message}
              </p>
            )}
          </div>

          <div className="flex gap-4">
            {/* Start Time Field */}
            <div className="flex-1">
              <label
                htmlFor="startTime"
                className="block text-sm font-semibold text-gray-700 mb-1"
              >
                Start Time
              </label>
              <input
                id="startTime"
                type="time"
                {...register("startTime")}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              />
              {errors.startTime && (
                <p className="mt-1 text-xs text-red-600">
                  {String(errors.startTime.message)}
                </p>
              )}
            </div>
            {/* End Time Field */}
            <div className="flex-1">
              <label
                htmlFor="endTime"
                className="block text-sm font-semibold text-gray-700 mb-1"
              >
                End Time
              </label>
              <input
                id="endTime"
                type="time"
                {...register("endTime")}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              />
              {errors.endTime && (
                <p className="mt-1 text-xs text-red-600">
                  {String(errors.endTime.message)}
                </p>
              )}
            </div>
          </div>

          {/* Number of Attendees Field */}
          <div>
            <label
              htmlFor="numberOfAttendees"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              Number of Attendees
            </label>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => handleAttendeesChange(numberOfAttendees - 1)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={numberOfAttendees <= 1}
              >
                -
              </button>
              <span className="text-xl font-medium min-w-[2rem] text-center">
                {numberOfAttendees}
              </span>
              <button
                type="button"
                onClick={() => handleAttendeesChange(numberOfAttendees + 1)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
              >
                +
              </button>
            </div>
            {errors.numberOfAttendees && (
              <p className="mt-1 text-xs text-red-600">
                {errors.numberOfAttendees.message}
              </p>
            )}
          </div>

          {/* Agenda Field */}
          <div>
            <label
              htmlFor="teamAgenda"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              Agenda
            </label>
            <input
              id="teamAgenda"
              type="text"
              {...register("teamAgenda")}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              placeholder="Enter agenda"
            />
            {errors.teamAgenda && (
              <p className="mt-1 text-xs text-red-600">
                {errors.teamAgenda.message}
              </p>
            )}
          </div>

          {/* Meeting Type Field */}
          <div>
            <label
              htmlFor="meetingType"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              Meeting Type
            </label>
            <select
              id="meetingType"
              {...register("meetingType")}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              <option value="">Select meeting type</option>
              <option value="internal">Internal</option>
              <option value="external">External</option>
            </select>
            {errors.meetingType && (
              <p className="mt-1 text-xs text-red-600">
                {errors.meetingType.message}
              </p>
            )}
          </div>

          {/* Meeting Requirements */}
          <div>
            <label className="block font-semibold mb-3">
              Meeting Requirements
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {mockRequirements.map(({ iconComponent, resource }) => (
                <div
                  key={resource}
                  onClick={() => handleRequirementToggle(resource)}
                  className="w-full cursor-pointer"
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleRequirementToggle(resource);
                    }
                  }}
                >
                  <div
                    className={`border-2 flex flex-col h-20 items-center justify-center gap-y-1 rounded-lg px-2 relative transition-all ${
                      requirements.includes(resource)
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-300 bg-white hover:border-blue-300"
                    }`}
                  >
                    {requirements.includes(resource) && (
                      <div className="absolute top-1 right-1">
                        <CheckCircle size={16} className="text-blue-600" />
                      </div>
                    )}
                    {React.createElement(iconComponent, {
                      size: 24,
                      className: requirements.includes(resource)
                        ? "text-blue-600"
                        : "text-gray-600",
                    })}
                    <span
                      className={`text-xs text-center leading-tight ${
                        requirements.includes(resource)
                          ? "text-blue-600 font-medium"
                          : "text-gray-600"
                      }`}
                    >
                      {resource}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            {/* Selected Requirements Display */}
            {requirements.length > 0 && (
              <div className="mt-4">
                <p className="text-blue-600 font-medium mb-2">
                  Selected Requirements ({requirements.length}):
                </p>
                <div className="bg-blue-50 p-3 rounded-lg">
                  {requirements.map((req, idx) => (
                    <p key={idx} className="text-blue-700">
                      • {req}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Room Selection Section */}
          <div>
            <h2 className="font-semibold text-lg mb-3">
              Select a Room ({filteredRooms.length} available) *
            </h2>
            {selectedRoom && (
              <div className="bg-green-50 border border-green-200 p-3 rounded-lg mb-4">
                <p className="text-green-700 font-medium">
                  ✓ Selected: {selectedRoom.name}
                </p>
              </div>
            )}
            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-gray-600">Loading rooms...</span>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
                <p className="text-red-600 mb-2">{error}</p>
                <p className="text-sm text-red-400">
                  Please check your connection and ensure you have joined an
                  organization
                </p>
              </div>
            ) : filteredRooms.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {filteredRooms.map((room) => (
                  <Rooms
                    key={room.id}
                    room={room}
                    onSelect={handleRoomSelect}
                    isSelected={selectedRoom?.id === room.id}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <p className="text-gray-500 mb-2">
                  No rooms available with the selected requirements and capacity
                </p>
                <p className="text-sm text-gray-400">
                  Try reducing requirements or attendee count
                </p>
              </div>
            )}
          </div>

          {/* Room Field (hidden, handled by card selection) */}
          {/* No direct room field in schema; selectedRoom is handled in state and on submit */}

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

export default ModifyBookingModal;
