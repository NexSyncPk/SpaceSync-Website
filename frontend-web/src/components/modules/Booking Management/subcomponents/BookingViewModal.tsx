import React from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  formatDate,
  formatTime,
  getAmenityBadges,
  getStatusColor_Admin,
} from "@/utils/helpers";

interface BookingViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: any;
  updatingBookings: Set<string>;
  onApprove: (bookingId: string) => void;
  onReject: (bookingId: string) => void;
}

const BookingViewModal: React.FC<BookingViewModalProps> = ({
  isOpen,
  onClose,
  booking,
  updatingBookings,
  onApprove,
  onReject,
}) => {
  const handleClose = () => {
    onClose();
  };

  const handleApprove = () => {
    onApprove(booking.id);
    handleClose();
  };

  const handleReject = () => {
    onReject(booking.id);
    handleClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg max-sm: w-11/12 rounded-lg">
        <DialogHeader>
          <DialogTitle>Booking Details</DialogTitle>
        </DialogHeader>

        {booking && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Meeting Title
                </label>
                <p className="text-sm text-gray-900">{booking.title}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <span
                  className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getStatusColor_Admin(
                    booking.status
                  )}`}
                >
                  {booking.status}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Organizer
                </label>
                <p className="text-sm text-gray-900">
                  {booking.User?.name || "Unknown"}
                </p>
                <p className="text-xs text-gray-500">{booking.User?.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Department
                </label>
                <p className="text-sm text-gray-900">
                  {booking.User?.department || "N/A"}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Date
                </label>
                <p className="text-sm text-gray-900">
                  {formatDate(booking.startTime)}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Time
                </label>
                <p className="text-sm text-gray-900">
                  {formatTime(booking.startTime)} -{" "}
                  {formatTime(booking.endTime)}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Room
                </label>
                <p className="text-sm text-gray-900">
                  {booking.Room?.name || `Room ${booking.roomId}`}
                </p>
                <p className="text-xs text-gray-500">
                  Capacity: {booking.Room?.capacity || "N/A"}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Attendees
                </label>
                <div className="text-sm text-gray-900">
                  {booking.internalAttendees?.length > 0 && (
                    <p>Internal: {booking.internalAttendees.length}</p>
                  )}
                  {booking.externalAttendees?.length > 0 && (
                    <p>External: {booking.externalAttendees.length}</p>
                  )}
                  {!booking.internalAttendees?.length &&
                    !booking.externalAttendees?.length && <p>No attendees</p>}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Agenda
              </label>
              <p className="text-sm text-gray-900">{booking.agenda}</p>
            </div>

            {getAmenityBadges(booking.Room).length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Room Amenities
                </label>
                <div className="flex flex-wrap gap-1 mt-1">
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

            {booking.externalAttendees?.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  External Attendees
                </label>
                <div className="space-y-2 mt-1">
                  {booking.externalAttendees.map(
                    (attendee: any, index: number) => (
                      <div
                        key={index}
                        className="text-sm text-gray-900 bg-gray-50 p-2 rounded"
                      >
                        <p className="font-medium">{attendee.name}</p>
                        <p className="text-xs text-gray-500">
                          {attendee.email}
                        </p>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        <DialogFooter>
          <Button type="button" variant="outline" onClick={handleClose}>
            Close
          </Button>
          {booking?.status === "pending" && (
            <div className="flex gap-2">
              <Button
                onClick={handleApprove}
                className="bg-green-600 hover:bg-green-700"
                disabled={updatingBookings.has(booking.id)}
              >
                {updatingBookings.has(booking.id) ? (
                  <Loader2 size={14} className="mr-1 animate-spin" />
                ) : null}
                Confirm
              </Button>
              <Button
                variant="outline"
                onClick={handleReject}
                className="text-red-600 hover:text-red-700"
                disabled={updatingBookings.has(booking.id)}
              >
                {updatingBookings.has(booking.id) ? (
                  <Loader2 size={14} className="mr-1 animate-spin" />
                ) : null}
                Cancel
              </Button>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BookingViewModal;
