import React, { useState } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  User,
  CheckCircle,
  AlertCircle,
  XCircle,
  Monitor,
  Presentation,
  Coffee,
  Video,
  ChevronDown,
  ChevronUp,
  Mail,
  Phone,
  Building,
  PlayCircle,
  PauseCircle,
} from "lucide-react";
import { Meeting } from "@/types/interfaces";

interface MeetingsProps {
  meetings: Meeting[];
  loading: boolean;
  selectedDate: Date;
}

const Meetings: React.FC<MeetingsProps> = ({
  meetings,
  loading,
  selectedDate,
}) => {
  const [expandedMeetings, setExpandedMeetings] = useState<Set<string>>(
    new Set()
  );

  const Attendees = [
    { name: "Arham Hasan", position: "Software Developer" },
    { name: "Shayan Jaffri", position: "Assistant Comissioner (Latifabad)" },
    { name: "Muneer Khatri", position: "Assistant Comissioner (Landhi)" },
    { name: "Syed Ibad Ali", position: "Jekan Shikre of Rafah e aam" },
  ];

  const toggleExpanded = (meetingId: string) => {
    setExpandedMeetings((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(meetingId)) {
        newSet.delete(meetingId);
      } else {
        newSet.add(meetingId);
      }
      return newSet;
    });
  };

  const getRealTimeStatus = (
    startTime: string,
    endTime: string,
    originalStatus: string
  ) => {
    const now = new Date();
    const start = new Date(startTime);
    const end = new Date(endTime);

    // If meeting is cancelled or pending, return original status
    if (originalStatus === "cancelled" || originalStatus === "pending") {
      return originalStatus;
    }

    // Real-time status based on current time
    if (now < start) {
      return "upcoming";
    } else if (now >= start && now <= end) {
      return "in-progress";
    } else if (now > end) {
      return "completed";
    }
    return originalStatus;
  };
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDuration = (startTime: string, endTime: string) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const durationMs = end.getTime() - start.getTime();
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
      case "upcoming":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "in-progress":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      case "completed":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
      case "upcoming":
        return <CheckCircle className="h-4 w-4" />;
      case "in-progress":
        return <PlayCircle className="h-4 w-4" />;
      case "pending":
        return <AlertCircle className="h-4 w-4" />;
      case "cancelled":
        return <XCircle className="h-4 w-4" />;
      case "completed":
        return <PauseCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white border border-gray-200 rounded-lg p-6 animate-pulse"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="h-6 bg-gray-200 rounded w-1/3"></div>
              <div className="h-6 bg-gray-200 rounded w-20"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (meetings.length === 0) {
    return (
      <div className="text-center py-12">
        <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No meetings scheduled
        </h3>
        <p className="text-gray-500">
          No meetings found for{" "}
          {selectedDate.toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {meetings.map((meeting) => {
        const realTimeStatus = getRealTimeStatus(
          meeting.startTime,
          meeting.endTime,
          meeting.status
        );
        const isExpanded = expandedMeetings.has(meeting.id);

        return (
          <div
            key={meeting.id}
            className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            {/* Header */}
            <div className="p-6 pb-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {meeting.title}
                    </h3>
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                        realTimeStatus
                      )}`}
                    >
                      {getStatusIcon(realTimeStatus)}
                      {realTimeStatus.charAt(0).toUpperCase() +
                        realTimeStatus.slice(1).replace("-", " ")}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">{meeting.agenda}</p>
                </div>
                <button
                  onClick={() => toggleExpanded(meeting.id)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  )}
                </button>
              </div>

              {/* Basic Meeting Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Time & Duration */}
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="h-4 w-4" />
                  <span>
                    {formatTime(meeting.startTime)} -{" "}
                    {formatTime(meeting.endTime)}
                    <span className="text-gray-400 ml-2">
                      ({formatDuration(meeting.startTime, meeting.endTime)})
                    </span>
                  </span>
                </div>

                {/* Room */}
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span>{meeting.Room.name}</span>
                  <span className="text-gray-400">
                    (Capacity: {meeting.Room.capacity})
                  </span>
                </div>

                {/* Organizer */}
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <User className="h-4 w-4" />
                  <span>{meeting.User.name}</span>
                  <span className="text-gray-400">
                    ({meeting.User.department})
                  </span>
                </div>

                {/* Attendees */}
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Users className="h-4 w-4" />
                  <span>
                    {meeting.internalAttendees?.length} attendee
                    {meeting.internalAttendees?.length !== 1 ? "s" : ""}
                  </span>
                </div>
              </div>
            </div>

            {/* Expanded Details */}
            {isExpanded && (
              <div className="px-6 pb-6 pt-0 border-t border-gray-100">
                <div className="pt-4 space-y-4">
                  {/* Organizer Details */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">
                      Organizer Details
                    </h4>
                    <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <User className="h-4 w-4" />
                        <span className="font-medium">{meeting.User.name}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Building className="h-4 w-4" />
                        <span>{meeting.User.department}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="h-4 w-4" />
                        <a
                          href={`mailto:${meeting.User.email}`}
                          className="text-blue-600 hover:underline"
                        >
                          {meeting.User.email}
                        </a>
                      </div>
                      {meeting.User.phone && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone className="h-4 w-4" />
                          <a
                            href={`tel:${meeting.User.phone}`}
                            className="text-blue-600 hover:underline"
                          >
                            {meeting.User.phone}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Room Features */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">
                      Room Features
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {meeting.Room.displayProjector && (
                        <div className="flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs">
                          <Monitor className="h-3 w-3" />
                          <span>Projector</span>
                        </div>
                      )}
                      {meeting.Room.displayWhiteboard && (
                        <div className="flex items-center gap-1 bg-green-50 text-green-700 px-2 py-1 rounded-full text-xs">
                          <Presentation className="h-3 w-3" />
                          <span>Whiteboard</span>
                        </div>
                      )}
                      {meeting.Room.cateringAvailable && (
                        <div className="flex items-center gap-1 bg-orange-50 text-orange-700 px-2 py-1 rounded-full text-xs">
                          <Coffee className="h-3 w-3" />
                          <span>Catering</span>
                        </div>
                      )}
                      {meeting.Room.videoConferenceAvailable && (
                        <div className="flex items-center gap-1 bg-purple-50 text-purple-700 px-2 py-1 rounded-full text-xs">
                          <Video className="h-3 w-3" />
                          <span>Video Conference</span>
                        </div>
                      )}
                      {!meeting.Room.displayProjector &&
                        !meeting.Room.displayWhiteboard &&
                        !meeting.Room.cateringAvailable &&
                        !meeting.Room.videoConferenceAvailable && (
                          <span className="text-xs text-gray-500">
                            No special features
                          </span>
                        )}
                    </div>
                  </div>

                  {/* Attendees List */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">
                      Attendees ({Attendees.length})
                    </h4>
                    <div className="bg-gray-50 rounded-lg p-3 ">
                      {Attendees.map((att, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between mb-2 p-2 rounded hover:bg-blue-100 transition-colors cursor-pointer  max-md:flex-col border-b-2"
                        >
                          <div>
                            <span className="font-medium text-gray-800 mr-2">
                              {index + 1}
                              {")"}
                            </span>
                            <span className="font-medium text-gray-800 ">
                              {att.name}
                            </span>
                          </div>
                          <span className="text-gray-500 max-sm:text-center">
                            {att.position}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Meetings;
