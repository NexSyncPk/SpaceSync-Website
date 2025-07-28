import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

import {
  Monitor,
  PenTool,
  Video,
  CheckCircle,
  Utensils,
  X,
  Users,
} from "lucide-react";
import { useReqAndRoom } from "@/hooks/useReqAndRoom";
import Rooms from "@/components/shared/Rooms";
import { User } from "@/types/interfaces";
import {
  createReservation,
  getOrganizationMemebers,
} from "@/api/services/index";
// import { useDispatch, useSelector } from "../store/hooks.js";
// import { setSelectedRoom } from "../store/slices/bookingSlice.js";

// Zod validation schema
const meetingSchema = z
  .object({
    title: z.string().min(1, "Meeting title is required"),
    // name: z.string().min(1, "Name is required"),
    // department: z.string().min(1, "Department is required"),
    teamAgenda: z.string().min(1, "Team agenda is required"),
    meetingDate: z.string().min(1, "Meeting date is required"),
    startTime: z.string().min(1, "Start time is required"),
    endTime: z.string().min(1, "End time is required"),
    internalAttendees: z
      .array(
        z.object({
          id: z.string(),
          name: z.string(),
          email: z.string(),
          department: z.string(),
        })
      )
      .min(1, "At least one member must be selected")
      .max(20, "Maximum 20 members can be selected"),
  })
  .refine(
    (data) => {
      const start = new Date(`${data.meetingDate}T${data.startTime}:00`);
      const end = new Date(`${data.meetingDate}T${data.endTime}:00`);
      return end > start;
    },
    {
      message: "End time must be after start time",
      path: ["endTime"],
    }
  )
  .refine(
    (data) => {
      const meetingDate = new Date(data.meetingDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Reset time to start of day for comparison
      return meetingDate >= today;
    },
    {
      message: "Meeting date cannot be in the past",
      path: ["meetingDate"],
    }
  );

type MeetingFormData = z.infer<typeof meetingSchema>;

const mockRequirements = [
  {
    iconComponent: Monitor,
    resource: "Projector",
    backendKey: "displayProjector",
  },
  {
    iconComponent: PenTool,
    resource: "Whiteboard",
    backendKey: "displayWhiteboard",
  },
  {
    iconComponent: Utensils,
    resource: "Catering",
    backendKey: "cateringAvailable",
  },
  {
    iconComponent: Video,
    resource: "Video Conference",
    backendKey: "videoConferenceAvailable",
  },
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
    <div
      onClick={(e) => {
        e.preventDefault();
        onPress();
      }}
      className="w-full cursor-pointer"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onPress();
        }
      }}
    >
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
    </div>
  );
};

const CreateMeetingForm: React.FC = () => {
  const [orgMembers, setOrgMembers] = useState<User[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [showMemberDropdown, setShowMemberDropdown] = useState(false);
  const [internalAttendees, setInternalAttendees] = useState<User[]>([]);

  // Get organization info from Redux
  const organization = useSelector((state: any) => state.organization.current);
  const currentUser = useSelector((state: any) => state.auth.user);

  // Form with Zod validation
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<MeetingFormData>({
    resolver: zodResolver(meetingSchema),
    defaultValues: {
      title: "",
      // name: "",
      // department: "",
      teamAgenda: "",
      meetingDate: "",
      startTime: "",
      endTime: "",
      internalAttendees: [],
    },
  });

  // Use the custom hook for requirements and room selection logic
  const {
    requirements,
    filteredRooms,
    selectedRoom,
    isLoading,
    error,
    handleRequirementToggle,
    handleRoomSelect,
    handleAttendeesChange,
    setRequirements,
    setSelectedRoom,
  } = useReqAndRoom([], internalAttendees.length || 1);

  // Update attendee count when selected members change
  useEffect(() => {
    const attendeeCount = internalAttendees.length || 1;
    handleAttendeesChange(attendeeCount);
  }, [internalAttendees.length, handleAttendeesChange]);

  // Fetch organization members when component mounts
  useEffect(() => {
    const fetchMembers = async () => {
      if (!organization?.id) {
        return;
      }

      setLoadingMembers(true);
      try {
        const response = await getOrganizationMemebers(organization.id);
        if (response && response.data) {
          setOrgMembers(response.data);
        }
      } catch (error) {
        console.error("Error fetching organization members:", error);
      } finally {
        setLoadingMembers(false);
      }
    };

    fetchMembers();
  }, [organization?.id]);

  // Convert User to form format
  const convertUserToFormFormat = (user: User) => ({
    id: String(user.id),
    name: user.name,
    email: user.email,
    department: user.department,
  });

  // Update form when selected members change
  useEffect(() => {
    const formattedMembers = internalAttendees.map(convertUserToFormFormat);
    setValue("internalAttendees", formattedMembers);
  }, [internalAttendees, setValue]);

  // Handle member selection
  const handleMemberSelect = (member: User) => {
    const isAlreadySelected = internalAttendees.some((m) => m.id === member.id);

    if (isAlreadySelected) {
      setInternalAttendees((prev) => prev.filter((m) => m.id !== member.id));
    } else {
      if (internalAttendees.length >= 20) {
        toast.error("Maximum 20 members can be selected");
        return;
      }
      setInternalAttendees((prev) => [...prev, member]);
    }
  };

  // Remove selected member
  const removeMember = (memberId: string | number) => {
    setInternalAttendees((prev) => prev.filter((m) => m.id !== memberId));
  };
  // Convert frontend requirements to backend amenity keys
  const mapRequirementsToAmenities = (requirements: string[]): string[] => {
    const requirementMap: { [key: string]: string } = {
      Projector: "displayProjector",
      Whiteboard: "displayWhiteboard",
      Catering: "cateringAvailable",
      "Video Conference": "videoConferenceAvailable",
    };

    return requirements.map((req) => requirementMap[req]).filter(Boolean);
  };

  // Submit handler - Zod handles validation
  const onSubmit = async (data: MeetingFormData) => {
    if (!selectedRoom) {
      toast.error("Please select a room");
      return;
    }

    if (internalAttendees.length === 0) {
      toast.error("Please select at least one member");
      return;
    }

    // Convert time strings to ISO date strings using the selected date
    const startDateTime = new Date(
      `${data.meetingDate}T${data.startTime}:00`
    ).toISOString();
    const endDateTime = new Date(
      `${data.meetingDate}T${data.endTime}:00`
    ).toISOString();

    // Here you would typically send the data to your API
    const meetingData = {
      roomId: selectedRoom.id,
      title: data.title,
      agenda: data.teamAgenda,
      startTime: startDateTime,
      endTime: endDateTime,
      internalAttendees: internalAttendees.map((member) => String(member.id)),
      requiredAmenities: mapRequirementsToAmenities(requirements),
    };

    try {
      await createReservation(meetingData);

      // Reset all form states after successful submission
      reset(); // Reset form fields
      setInternalAttendees([]); // Clear selected members
      setShowMemberDropdown(false); // Close dropdown
      setRequirements([]); // Clear selected requirements
      setSelectedRoom(null); // Clear selected room

      // Show success message
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
      {/* Meeting Title */}
      <div>
        <label className="block font-semibold mb-2">Meeting Title *</label>
        <input
          type="text"
          {...register("title")}
          placeholder="Enter meeting title"
          className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 focus:border-blue-500 focus:outline-none transition-colors"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
        )}
      </div>

      {/* Meeting Date */}
      <div>
        <label className="block font-semibold mb-2">Meeting Date *</label>
        <input
          type="date"
          {...register("meetingDate")}
          min={new Date().toISOString().split("T")[0]} // Prevent selecting past dates
          className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 focus:border-blue-500 focus:outline-none transition-colors"
        />
        {errors.meetingDate && (
          <p className="mt-1 text-sm text-red-600">
            {errors.meetingDate.message}
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

      {/* Select Members */}
      <div>
        <label className="block font-semibold mb-3">
          Select Members ({internalAttendees.length} selected) *
        </label>

        {/* Selected Members Display */}
        {internalAttendees.length > 0 && (
          <div className="mb-4">
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-blue-600 font-medium mb-2">
                Selected Members ({internalAttendees.length}):
              </p>
              <div className="flex flex-wrap gap-2">
                {internalAttendees.map((member) => (
                  <div
                    key={member.id}
                    className="bg-blue-100 border border-blue-300 rounded-lg px-3 py-1 flex items-center gap-2"
                  >
                    <span className="text-blue-700 text-sm">
                      {member.name} ({member.department})
                    </span>
                    <button
                      type="button"
                      onClick={() => removeMember(member.id)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Member Selection Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowMemberDropdown(!showMemberDropdown)}
            className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 text-left focus:border-blue-500 focus:outline-none transition-colors flex items-center justify-between"
          >
            <span className="flex items-center gap-2">
              <Users size={20} />
              {internalAttendees.length > 0
                ? `${internalAttendees.length} member(s) selected`
                : "Select organization members"}
            </span>
            <div
              className={`transform transition-transform ${
                showMemberDropdown ? "rotate-180" : ""
              }`}
            >
              ▼
            </div>
          </button>

          {showMemberDropdown && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {loadingMembers ? (
                <div className="p-4 text-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Loading members...</p>
                </div>
              ) : orgMembers.length > 0 ? (
                <div className="py-2">
                  {orgMembers.map((member) => {
                    const isSelected = internalAttendees.some(
                      (m) => m.id === member.id
                    );
                    const isCurrentUser = currentUser?.id === member.id;

                    return (
                      <button
                        key={member.id}
                        type="button"
                        onClick={() => handleMemberSelect(member)}
                        className={`w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center justify-between ${
                          isSelected ? "bg-blue-50 text-blue-700" : ""
                        }`}
                      >
                        <div>
                          <p className="font-medium">
                            {member.name} {isCurrentUser && "(You)"}
                          </p>
                          <p className="text-sm text-gray-600">
                            {member.department} • {member.email}
                          </p>
                        </div>
                        {isSelected && (
                          <CheckCircle size={16} className="text-blue-600" />
                        )}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="p-4 text-center text-gray-500">
                  No organization members found
                </div>
              )}
            </div>
          )}
        </div>

        {errors.internalAttendees && (
          <p className="mt-1 text-sm text-red-600">
            {errors.internalAttendees.message}
          </p>
        )}
      </div>

      {/* Meeting Requirements */}
      <div>
        <label className="block font-semibold mb-3">Meeting Requirements</label>
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

      <div className="grid grid-cols-1 md:grid-cols-2 md:gap-6"></div>

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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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
            {requirements.length !== 0 ? (
              <>
                <p className="text-gray-500 mb-2">
                  No rooms available with the selected requirements and capacity
                </p>
                <p className="text-sm text-gray-400">
                  Try reducing requirements or attendee count
                </p>
              </>
            ) : (
              <p className="text-gray-500 mb-2">
                There is no Rooms in this organization till now.
              </p>
            )}
          </div>
        )}
      </div>

      {/* Submit Button */}
      <div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white rounded-lg py-4 text-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Creating Request..." : "Create Meeting Request"}
        </button>
      </div>
    </form>
  );
};

export default CreateMeetingForm;
