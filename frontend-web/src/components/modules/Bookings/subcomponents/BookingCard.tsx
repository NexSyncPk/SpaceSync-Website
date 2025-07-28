import React, { useState } from "react";
import {
  Reservation,
  cancelReservation,
} from "../../../../api/services/bookingService";
import { deleteBooking } from "../../../../store/slices/bookingSlice";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import EditBookingModal from "./EditBookingModal";
import DeleteBookingModal from "./DeleteBookingModal";
import {
  formatDate,
  formatTime,
  getStatusStylesBooking,
} from "@/utils/helpers";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  User,
  FileText,
  Edit3,
  Trash2,
} from "lucide-react";

interface BookingCardProps {
  booking: Reservation;
  showActions?: boolean;
}

const BookingCard: React.FC<BookingCardProps> = ({
  booking,
  showActions = false,
}) => {
  const dispatch = useDispatch();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleDelete = async (bookingId: string) => {
    if (!bookingId) {
      toast.error("Invalid booking ID");
      return;
    }

    setDeleteLoading(true);
    try {
      await cancelReservation(bookingId);
      dispatch(deleteBooking(bookingId));
      toast.success("Booking deleted successfully!");
      setIsDeleteModalOpen(false);
    } catch (error: any) {
      console.error("Delete booking error:", error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to delete booking";
      toast.error(errorMessage);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditModalOpen(true);
  };

  const statusConfig = getStatusStylesBooking(booking.status);
  const StatusIcon = statusConfig.icon;

  return (
    <>
      <div className="group relative bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
        {/* Status Gradient Header */}
        <div
          className={`h-2 ${statusConfig.bg
            .replace("from-", "from-")
            .replace("to-", "to-")
            .replace("50", "200")}`}
        />

        {/* Main Content */}
        <div className="p-6">
          {/* Header Section */}
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1 pr-4">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-5 w-5 text-blue-500" />
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {booking.title || "Untitled Meeting"}
                </h3>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="h-4 w-4" />
                <span className="text-sm font-medium">
                  {booking.room?.name || "Unknown Room"}
                </span>
              </div>
            </div>

            {/* Status Badge */}
            <div
              className={`flex items-center gap-2 px-3 py-2 rounded-full ${statusConfig.bg} ${statusConfig.border} border-2`}
            >
              <StatusIcon className={`h-4 w-4 ${statusConfig.text}`} />
              <span className={`text-sm font-semibold ${statusConfig.text}`}>
                {booking.status.charAt(0).toUpperCase() +
                  booking.status.slice(1).replace("-", " ")}
              </span>
            </div>
          </div>

          {/* Meeting Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Date & Time */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Calendar className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">
                    Date
                  </p>
                  <p className="font-semibold text-gray-900">
                    {formatDate(booking.startTime)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Clock className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">
                    Time
                  </p>
                  <p className="font-semibold text-gray-900">
                    {formatTime(booking.startTime)} -{" "}
                    {formatTime(booking.endTime)}
                  </p>
                </div>
              </div>
            </div>

            {/* Organizer & Attendees */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <User className="h-5 w-5 text-purple-500" />
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">
                    Organizer
                  </p>
                  <p className="font-semibold text-gray-900">
                    {booking.user?.firstName} {booking.user?.lastName}
                  </p>
                </div>
              </div>

              {booking.internalAttendees &&
                booking.internalAttendees.length > 0 && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Users className="h-5 w-5 text-orange-500" />
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">
                        Attendees
                      </p>
                      <p className="font-semibold text-gray-900">
                        {booking.internalAttendees.length} participant
                        {booking.internalAttendees.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                )}
            </div>
          </div>

          {/* Agenda Section */}
          {booking.agenda && (
            <div className="mb-4">
              <div className="flex items-start gap-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                <FileText className="h-5 w-5 text-blue-500 mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs text-blue-600 uppercase tracking-wide font-medium mb-1">
                    Agenda
                  </p>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {booking.agenda}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          {showActions && (
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              {booking.status !== "cancelled" &&
                booking.status !== "confirmed" && (
                  <button
                    onClick={handleEdit}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                  >
                    <Edit3 className="h-4 w-4" />
                    <span className="font-medium">Edit</span>
                  </button>
                )}
              <button
                onClick={() => setIsDeleteModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
              >
                <Trash2 className="h-4 w-4" />
                <span className="font-medium">Delete</span>
              </button>
            </div>
          )}
        </div>

        {/* Subtle Corner Decoration */}
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-transparent via-transparent to-gray-50 opacity-50 pointer-events-none" />
      </div>

      {/* Edit Booking Modal */}
      {isEditModalOpen && (
        <EditBookingModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          booking={booking}
        />
      )}
      {/* Delete Booking Modal */}
      {isDeleteModalOpen && (
        <DeleteBookingModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={() => handleDelete(booking.id)}
          loading={deleteLoading}
        />
      )}
    </>
  );
};

export default BookingCard;
