import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { mockRooms } from "../utils/mockData.js";
import { Room } from "../types/interfaces.js";
import Rooms from "../components/Rooms.js";
import {
  Monitor,
  PenTool,
  Tv,
  Video,
  CheckCircle,
  Plus,
  Minus,
} from "lucide-react";
import { useDispatch, useSelector } from "../store/hooks.js";
import { setSelectedRoom } from "../store/slices/bookingSlice.js";

// Zod validation schema
const meetingSchema = z
  .object({
    meetingTitle: z.string().min(1, "Meeting title is required"),
    name: z.string().min(1, "Name is required"),
    department: z.string().min(1, "Department is required"),
    teamAgenda: z.string().min(1, "Team agenda is required"),
    startTime: z.string().min(1, "Start time is required"),
    endTime: z.string().min(1, "End time is required"),
    numberOfAttendees: z.number().min(1, "At least 1 attendee required"),
    meetingType: z.enum(["internal", "external"]),
  })
  .refine(
    (data) => {
      const start = new Date(`1970-01-01T${data.startTime}:00`);
      const end = new Date(`1970-01-01T${data.endTime}:00`);
      return end > start;
    },
    {
      message: "End time must be after start time",
      path: ["endTime"],
    }
  );

type MeetingFormData = z.infer<typeof meetingSchema>;

const mockRequirements = [
  { iconComponent: Monitor, resource: "Projector" },
  { iconComponent: PenTool, resource: "Whiteboard" },
  { iconComponent: Tv, resource: "TV Screen" },
  { iconComponent: Video, resource: "Video conference" },
];

interface MeetingRequirementsViewProps {
  iconComponent: React.ComponentType<any>;
  resource: string;
  isSelected: boolean;
  onPress: () => void;
}

const MeetingRequirementsView: React.FC<MeetingRequirementsViewProps> = ({
  iconComponent: Icon,
  resource,
  isSelected,
  onPress,
}) => {
  return (
    <button onClick={onPress} className="w-full">
      <div
        className={`border-2 flex flex-col h-20 items-center justify-center gap-y-1 rounded-lg px-2 relative transition-all ${
          isSelected
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 bg-white hover:border-blue-300"
        }`}
      >
        {/* Checkmark in top-right corner */}
        {isSelected && (
          <div className="absolute top-1 right-1">
            <CheckCircle size={16} className="text-blue-600" />
          </div>
        )}
        <Icon
          size={24}
          className={isSelected ? "text-blue-600" : "text-gray-600"}
        />
        <span
          className={`text-xs text-center leading-tight ${
            isSelected ? "text-blue-600 font-medium" : "text-gray-600"
          }`}
        >
          {resource}
        </span>
      </div>
    </button>
  );
};

const Home: React.FC = () => {
  // Form with Zod validation
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<MeetingFormData>({
    resolver: zodResolver(meetingSchema),
    mode: "onSubmit", // Only validate on submit, not on change/blur
    defaultValues: {
      meetingTitle: "",
      name: "",
      department: "",
      teamAgenda: "",
      startTime: "",
      endTime: "",
      numberOfAttendees: 1,
      meetingType: "internal",
    },
  });

  // Local state instead of watch
  const [numberOfAttendees, setNumberOfAttendees] = useState(1);
  const [meetingType, setMeetingType] = useState<"internal" | "external">(
    "internal"
  );

  // Local state
  const [requirements, setRequirements] = useState<string[]>([]);
  const [filteredRooms, setFilteredRooms] = useState<Room[]>(mockRooms);

  const dispatch = useDispatch();
  const selectedRoom = useSelector((state: any) => state.booking.selectedRoom);

  // Clear initial room selection
  React.useEffect(() => {
    dispatch(setSelectedRoom(null));
  }, [dispatch]);

  const handleRequirementToggle = (requirement: string) => {
    const newRequirements = requirements.includes(requirement)
      ? requirements.filter((req) => req !== requirement)
      : [...requirements, requirement];

    setRequirements(newRequirements);
    filterRooms(newRequirements, numberOfAttendees);
  };

  const filterRooms = (requirementsList: string[], attendees: number) => {
    let filtered = mockRooms.filter((room) => room.capacity >= attendees);

    if (requirementsList.length > 0) {
      filtered = filtered.filter((room) =>
        requirementsList.every((req) => room.resources.includes(req))
      );
    }

    setFilteredRooms(filtered);
  };

  const handleAttendeesChange = (newCount: number) => {
    if (newCount >= 1) {
      setNumberOfAttendees(newCount);
      setValue("numberOfAttendees", newCount);
      filterRooms(requirements, newCount);
    }
  };

  const handleRoomSelect = (room: Room) => {
    const newSelectedRoom = selectedRoom?.id === room.id ? null : room;
    dispatch(setSelectedRoom(newSelectedRoom));
  };

  // Simple submit handler - Zod handles validation
  const onSubmit = (data: MeetingFormData) => {
    if (!selectedRoom) {
      toast.error("Please select a room");
      return;
    }

    const meetingData = {
      ...data,
      requirements,
      selectedRoom,
    };

    console.log("Meeting Data:", meetingData);

    toast.success(
      `Meeting "${data.meetingTitle}" created successfully!\nRoom: ${selectedRoom.name}\nTime: ${data.startTime} - ${data.endTime}`,
      { duration: 4000 }
    );
  };

  return (
    <div className="min-h-screen bg-white w-full md:w-4/6 mx-auto p-4 rounded-lg shadow-2xl">
      <div className="w-full max-w-4xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-semibold text-blue-600 mb-6">
          New Meeting Request
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Meeting Title */}
          <div>
            <label className="block font-semibold mb-2">Meeting Title *</label>
            <input
              type="text"
              {...register("meetingTitle")}
              placeholder="Enter meeting title"
              className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 focus:border-blue-500 focus:outline-none transition-colors"
            />
            {errors.meetingTitle && (
              <p className="mt-1 text-sm text-red-600">
                {errors.meetingTitle.message}
              </p>
            )}
          </div>

          {/* Time Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-2">Start Time *</label>
              <input
                type="time"
                {...register("startTime")}
                className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 focus:border-blue-500 focus:outline-none transition-colors"
              />
              {errors.startTime && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.startTime.message}
                </p>
              )}
            </div>
            <div>
              <label className="block font-semibold mb-2">End Time *</label>
              <input
                type="time"
                {...register("endTime")}
                className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 focus:border-blue-500 focus:outline-none transition-colors"
              />
              {errors.endTime && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.endTime.message}
                </p>
              )}
            </div>
          </div>

          {/* Number of Attendees */}
          <div>
            <label className="block font-semibold mb-3">
              Number of Attendees *
            </label>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => handleAttendeesChange(numberOfAttendees - 1)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={numberOfAttendees <= 1}
              >
                <Minus size={24} />
              </button>
              <span className="text-xl font-medium min-w-[2rem] text-center">
                {numberOfAttendees}
              </span>
              <button
                type="button"
                onClick={() => handleAttendeesChange(numberOfAttendees + 1)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
              >
                <Plus size={24} />
              </button>
            </div>
            {errors.numberOfAttendees && (
              <p className="mt-1 text-sm text-red-600">
                {errors.numberOfAttendees.message}
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
                <MeetingRequirementsView
                  key={resource}
                  iconComponent={iconComponent}
                  resource={resource}
                  isSelected={requirements.includes(resource)}
                  onPress={() => handleRequirementToggle(resource)}
                />
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

          {/* Meeting Type */}
          <div>
            <label className="block font-semibold mb-3">Meeting Type *</label>{" "}
            <div className="flex gap-3 flex-col md:flex-row h-fit">
              <button
                type="button"
                onClick={() => {
                  setMeetingType("internal");
                  setValue("meetingType", "internal");
                }}
                className={`flex-1 h-12 border-2 rounded-lg transition-colors py-2 ${
                  meetingType === "internal"
                    ? "bg-blue-600 border-blue-600 text-white"
                    : "border-gray-300 text-gray-700 hover:border-blue-300"
                }`}
              >
                Internal
              </button>
              <button
                type="button"
                onClick={() => {
                  setMeetingType("external");
                  setValue("meetingType", "external");
                }}
                className={`flex-1 h-12 border-2 rounded-lg transition-colors py-2 ${
                  meetingType === "external"
                    ? "bg-blue-600 border-blue-600 text-white"
                    : "border-gray-300 text-gray-700 hover:border-blue-300"
                }`}
              >
                External
              </button>
            </div>
            {errors.meetingType && (
              <p className="mt-1 text-sm text-red-600">
                {errors.meetingType.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 md:gap-6">
            {/* Name Input */}
            <div>
              <label className="block font-semibold mb-2">Name *</label>
              <input
                type="text"
                {...register("name")}
                placeholder="Enter your name"
                className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 focus:border-blue-500 focus:outline-none transition-colors"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Department Input */}
            <div>
              <label className="block font-semibold mb-2">Department *</label>
              <input
                type="text"
                {...register("department")}
                placeholder="Enter department"
                className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 focus:border-blue-500 focus:outline-none transition-colors"
              />
              {errors.department && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.department.message}
                </p>
              )}
            </div>
          </div>

          {/* Team Agenda Input */}
          <div>
            <label className="block font-semibold mb-2">Team Agenda *</label>
            <textarea
              {...register("teamAgenda")}
              placeholder="Enter team agenda"
              rows={3}
              className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 focus:border-blue-500 focus:outline-none transition-colors resize-vertical"
            />
            {errors.teamAgenda && (
              <p className="mt-1 text-sm text-red-600">
                {errors.teamAgenda.message}
              </p>
            )}
          </div>

          {/* Available Rooms Section */}
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

            {filteredRooms.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white rounded-lg py-4 text-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Creating Request..." : "Create Meeting Request"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Home;
