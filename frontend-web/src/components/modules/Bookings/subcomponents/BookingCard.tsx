import ModifyBookingModal from "@/components/modals/ModifyBookingModal";
import { deleteBooking } from "@/store/slices/bookingSlice";
import { Booking } from "@/types/interfaces";
import { getStatusColor, getStatusTextColor } from "@/utils/helpers";
import { mockRooms } from "@/utils/mockData";
import { Edit, Trash2 } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

interface BookingCardProps {
  booking: any;
  showActions?: boolean;
}

const BookingCard: React.FC<BookingCardProps> = ({
  booking,
  showActions = false,
}) => {
  const upcomingBookings = useSelector(
    (state: any) => state.booking.upcomingBookings
  );

  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch();

  const handleModify = (bookingId: number) => {
    const booking = upcomingBookings.find((b: Booking) => b.id === bookingId);
    if (booking) {
      setSelectedBooking(booking);
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBooking(null);
  };

  const handleDelete = (bookingId: number) => {
    console.log(`Delete booking ${bookingId}`);

    // Create a promise-based confirmation toast
    toast(
      (t) => (
        <div className="flex flex-col gap-2">
          <span>Are you sure you want to delete this booking?</span>
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => {
                toast.dismiss(t.id);
              }}
              className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                dispatch(deleteBooking(bookingId));
                toast.dismiss(t.id);
                toast.success("Booking deleted successfully!");
              }}
              className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        </div>
      ),
      {
        duration: Infinity,
        style: {
          maxWidth: "400px",
        },
      }
    );
  };

  const room = mockRooms.find((r: any) => r.id === booking.roomId);
  return (
    <div
      key={booking.id}
      className="bg-white shadow-sm rounded-lg my-3 p-4 border border-gray-200"
    >
      <div className="flex justify-between items-start">
        {/* Booking Info */}
        <div className="flex-1 mr-3">
          <h3 className="text-lg font-semibold text-gray-900">
            {booking.meetingTitle}
          </h3>
          <p>
            <span className="font-medium ">Agenda:</span> {booking.teamAgenda}
          </p>
          <p className="text-gray-600 text-sm ">
            Attendees: {booking.numberOfAttendees}
          </p>
          <p className="text-gray-600 text-sm ">{booking.meetingType}</p>
          <p className="text-sm text-gray-600">
            {booking.startTime} - {booking.endTime}
          </p>
          {booking.requirements && booking.requirements.length > 0 && (
            <div className="mt-2">
              <span className="font-medium">Requirements:</span>
              <ul className="list-disc list-inside text-sm text-gray-600">
                {booking.requirements.map(
                  (requirement: string, index: number) => (
                    <li key={index}>{requirement}</li>
                  )
                )}
              </ul>
            </div>
          )}
          <p className="text-sm text-gray-600">
            Room: {room ? room.name : "Unknown"}
          </p>
        </div>

        {/* Status Badge */}
        <div
          className={`px-3 py-1 rounded-full border ${getStatusColor(
            booking.status
          )}`}
        >
          <span
            className={`text-xs font-medium capitalize ${getStatusTextColor(
              booking.status
            )}`}
          >
            {booking.status}
          </span>
        </div>
      </div>

      {/* Action Buttons for Pending Bookings */}
      {showActions && booking.status === "pending" && (
        <div className="flex justify-end mt-3 gap-x-2">
          <button
            onClick={() => handleModify(booking.id)}
            className="flex items-center bg-blue-50 border border-blue-200 px-3 py-2 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <Edit size={16} className="text-blue-600" />
            <span className="text-blue-700 text-sm font-medium ml-1">
              Modify
            </span>
          </button>

          <button
            onClick={() => handleDelete(booking.id)}
            className="flex items-center bg-red-50 border border-red-200 px-3 py-2 rounded-lg hover:bg-red-100 transition-colors"
          >
            <Trash2 size={16} className="text-red-600" />
            <span className="text-red-700 text-sm font-medium ml-1">
              Delete
            </span>
          </button>
        </div>
      )}
      {/* Modify Booking Modal */}
      <ModifyBookingModal
        booking={selectedBooking}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default BookingCard;
