import React from "react";
import {
  Calendar,
  Clock,
  Users,
  MapPin,
  Eye,
  Check,
  X,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  formatDate,
  formatTime,
  getAmenityBadges,
  getPriorityColor,
  getStatusColor_Admin,
} from "@/utils/helpers";

interface BookingCardProps {
  booking: any;
  updatingBookings: Set<string>;
  onApprove: (bookingId: string) => void;
  onReject: (bookingId: string) => void;
  onComplete: (bookingId: string) => void;
  onView: (booking: any) => void;
}

const BookingCard: React.FC<BookingCardProps> = ({
  booking,
  updatingBookings,
  onApprove,
  onReject,
  onComplete,
  onView,
}) => {
  return (
    <div
      className={`p-6 border-l-4 ${getPriorityColor(
        booking.status
      )} hover:bg-gray-50 ${
        updatingBookings.has(booking.id) ? "opacity-75 bg-gray-50" : ""
      } transition-all duration-200`}
    >
      <div className="flex items-center justify-between relative">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-medium text-gray-900">
              {booking.title}
            </h3>
            <span
              className={`absolute right-0 px-2 py-1 text-xs font-medium rounded-full ${getStatusColor_Admin(
                booking.status
              )}`}
            >
              {booking.status}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
            <div className="flex items-center">
              <Users size={14} className="mr-2" />
              {booking.User?.name || "Unknown"} •{" "}
              {booking.User?.department || "N/A"}
            </div>
            <div className="flex items-center">
              <MapPin size={14} className="mr-2" />
              {booking.Room?.name || `Room ${booking.roomId}`}
            </div>
            <div className="flex items-center">
              <Calendar size={14} className="mr-2" />
              {formatDate(booking.startTime)}
            </div>
            <div className="flex items-center">
              <Clock size={14} className="mr-2" />
              {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
            </div>
            <div className="flex items-center">
              <Users size={14} className="mr-2" />
              Capacity: {booking.Room?.capacity || "N/A"}
            </div>
          </div>

          <div className="mt-2">
            <p className="text-sm text-gray-600">
              <strong>Agenda:</strong> {booking.agenda}
            </p>
            {booking.internalAttendees &&
              booking.internalAttendees.length > 0 && (
                <p className="text-sm text-gray-600 mt-1">
                  <strong>Internal Attendees:</strong>{" "}
                  {booking.internalAttendees.length} members
                </p>
              )}
            {booking.externalAttendees &&
              booking.externalAttendees.length > 0 && (
                <p className="text-sm text-gray-600 mt-1">
                  <strong>External Attendees:</strong>{" "}
                  {booking.externalAttendees.length} guests
                </p>
              )}
            {getAmenityBadges(booking.Room).length > 0 && (
              <div className="mt-2">
                <p className="text-sm text-gray-600 mb-1">
                  <strong>Room Amenities:</strong>
                </p>
                <div className="flex flex-wrap gap-1">
                  {getAmenityBadges(booking.Room).map(
                    (amenity: string, index: number) => (
                      <span
                        key={index}
                        className="px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded"
                      >
                        {amenity}
                      </span>
                    )
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 ml-4 max-sm:flex-col">
          <Button
            size="sm"
            variant="outline"
            className="w-28"
            onClick={() => onView(booking)}
          >
            <Eye size={14} className="mr-1" />
            View
          </Button>

          {booking.status === "pending" && (
            <>
              <Button
                size="sm"
                onClick={() => onApprove(booking.id)}
                className="bg-green-600 hover:bg-green-700 w-28"
                disabled={updatingBookings.has(booking.id)}
              >
                {updatingBookings.has(booking.id) ? (
                  <Loader2 size={14} className="mr-1 animate-spin" />
                ) : (
                  <Check size={14} className="mr-1" />
                )}
                Confirm
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onReject(booking.id)}
                className="text-red-600 hover:text-red-700 w-28"
                disabled={updatingBookings.has(booking.id)}
              >
                {updatingBookings.has(booking.id) ? (
                  <Loader2 size={14} className="mr-1 animate-spin" />
                ) : (
                  <X size={14} className="mr-1" />
                )}
                Cancel
              </Button>
            </>
          )}

          {booking.status === "confirmed" && (
            <Button
              size="sm"
              onClick={() => onComplete(booking.id)}
              className="bg-blue-600 hover:bg-blue-700 w-28"
              disabled={updatingBookings.has(booking.id)}
            >
              {updatingBookings.has(booking.id) ? (
                <Loader2 size={14} className="mr-1 animate-spin" />
              ) : (
                <Check size={14} className="mr-1" />
              )}
              Complete
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingCard;
