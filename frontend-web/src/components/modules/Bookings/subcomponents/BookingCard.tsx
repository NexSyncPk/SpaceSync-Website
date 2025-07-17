import React, { useState } from "react";
import { Reservation, cancelReservation } from "../../../../api/services/bookingService";
import { deleteBooking } from "../../../../store/slices/bookingSlice";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import EditBookingModal from "./../EditBookingModal";
import DeleteBookingModal from "../DeleteBookingModal";

const getStatusStyles = (status: string) => {
  switch (status.toLowerCase()) {
    case 'confirmed':
      return 'bg-green-100 text-green-800';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    case 'completed':
      return 'bg-blue-100 text-blue-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

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
    setDeleteLoading(true);
    try {
      await cancelReservation(bookingId);
      dispatch(deleteBooking(bookingId));
      toast.success("Booking deleted successfully!");
      setIsDeleteModalOpen(false);
    } catch (error: any) {
      toast.error(error?.message || "Failed to delete booking");
    } finally {
      setDeleteLoading(false);
    }
  } 

  const handleEdit = () => {
    setIsEditModalOpen(true);
  };

  const formatTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDate = (dateTime: string) => {
    return new Date(dateTime).toLocaleDateString();
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {booking.title || 'Untitled Meeting'}
          </h3>
          <p className="text-sm text-gray-600 mb-2">
            Room: {booking.room?.name || 'Unknown Room'}
          </p>
        </div>
        <div className="flex flex-col items-end">
          <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusStyles(booking.status)}`}>
            {booking.status?.charAt(0).toUpperCase() + booking.status?.slice(1)}
          </span>
        </div>
      </div>

      <div className="space-y-2 text-sm text-gray-600">
        <div className="flex justify-between">
          <span>Date:</span>
          <span className="font-medium">{formatDate(booking.startTime)}</span>
        </div>
        <div className="flex justify-between">
          <span>Time:</span>
          <span className="font-medium">
            {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
          </span>
        </div>
        {booking.agenda && (
          <div className="flex justify-between">
            <span>Agenda:</span>
            <span className="font-medium text-right max-w-48 truncate">
              {booking.agenda}
            </span>
          </div>
        )}
        <div className="flex justify-between">
          <span>Organizer:</span>
          <span className="font-medium">
            {booking.user?.firstName} {booking.user?.lastName}
          </span>
        </div>
        {booking.internalAttendees && booking.internalAttendees.length > 0 && (
          <div className="flex justify-between">
            <span>Attendees:</span>
            <span className="font-medium">{booking.internalAttendees.length}</span>
          </div>
        )}
      </div>

      {showActions && (
        <div className="flex justify-end space-x-2 mt-4 pt-3 border-t border-gray-100">
          <button
            onClick={handleEdit}
            className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Edit
          </button>
          <button
            onClick={() => setIsDeleteModalOpen(true)}
            className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            Delete
          </button>
        </div>
      )}

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
    </div>
  );
};

export default BookingCard;