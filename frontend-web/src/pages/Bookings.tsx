import React, { useState } from "react";
import toast from "react-hot-toast";
import { Edit, Trash2 } from "lucide-react";
import { getStatusColor, getStatusTextColor } from "../utils/helpers.js";
import { useDispatch, useSelector } from "../store/hooks.js";
import { deleteBooking } from "../store/slices/bookingSlice.js";
import ModifyBookingModal from "../components/modals/ModifyBookingModal.js";
import { Booking } from "../types/interfaces";

const Bookings: React.FC = () => {
  const [bookingType, setBookingType] = useState<"upcoming" | "past">(
    "upcoming"
  );
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch();

  // Use simple Redux selectors to get data from store
  const upcomingBookings = useSelector(
    (state: any) => state.booking.upcomingBookings
  );
  const pastBookings = useSelector((state: any) => state.booking.pastBookings);

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

  const renderBookingCard = (booking: any, showActions: boolean = false) => (
    <div
      key={booking.id}
      className="bg-white shadow-sm rounded-lg my-3 p-4 border border-gray-200"
    >
      <div className="flex justify-between items-start">
        {/* Booking Info */}
        <div className="flex-1 mr-3">
          <h3 className="text-lg font-semibold text-gray-900">
            {booking.title}
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            {new Date(booking.date).toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
          <p className="text-sm text-gray-600">{booking.time}</p>
          <p className="text-sm text-gray-600">Room: {booking.room}</p>
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
    </div>
  );

  return (
    <div className="min-h-screen bg-white w-full sm:w-5/6 md:w-4/6 mx-auto p-5 rounded-lg shadow-2xl">
      <div className="w-full max-w-4xl mx-auto px-4">
        {/* Upcoming and Past Button */}
        <div className="w-full mt-4">
          <h2 className="font-semibold mb-4 text-lg">Meeting Type</h2>
          <div className="flex gap-x-2 w-full h-fit">
            <button
              onClick={() => setBookingType("upcoming")}
              className={`flex-1  h-12 border-2 border-slate-200 ${
                bookingType === "upcoming"
                  ? "bg-primary text-white"
                  : "bg-white text-gray-700"
              } rounded-lg flex justify-center items-center transition-colors hover:border-blue-300`}
            >
              <span className="text-lg">Upcoming</span>
            </button>
            <button
              onClick={() => setBookingType("past")}
              className={`flex-1  h-12 border-2 border-slate-200 ${
                bookingType === "past"
                  ? "bg-primary text-white"
                  : "bg-white text-gray-700"
              } rounded-lg flex justify-center items-center transition-colors hover:border-blue-300`}
            >
              <span className="text-lg">Past</span>
            </button>
          </div>
        </div>

        {/* Upcoming Bookings */}
        {bookingType === "upcoming" && (
          <div className="mt-6">
            {upcomingBookings.length > 0 ? (
              upcomingBookings.map((booking: any) =>
                renderBookingCard(booking, true)
              )
            ) : (
              <div className="bg-gray-50 rounded-lg m-2 p-6">
                <p className="text-gray-500 text-center">
                  No upcoming bookings found
                </p>
              </div>
            )}
          </div>
        )}

        {/* Past Bookings */}
        {bookingType === "past" && (
          <div className="mt-6">
            {pastBookings.length > 0 ? (
              pastBookings.map((booking: any) =>
                renderBookingCard(booking, false)
              )
            ) : (
              <div className="bg-gray-50 rounded-lg m-2 p-6">
                <p className="text-gray-500 text-center">
                  No past bookings found
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modify Booking Modal */}
      <ModifyBookingModal
        booking={selectedBooking}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default Bookings;
