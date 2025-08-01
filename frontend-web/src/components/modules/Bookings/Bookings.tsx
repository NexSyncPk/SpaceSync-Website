import React, { useState, useEffect } from "react";
import BookingCard from "./subcomponents/BookingCard";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../store/store";
import { getUserBookings } from "../../../api/services/bookingService";
import {
  setUpcomingBookings,
  setPastBookings,
  setLoading,
  setError,
} from "../../../store/slices/bookingSlice";

import socket from "@/utils/socketManager";

const Bookings: React.FC = () => {
  const dispatch = useDispatch();
  const [bookingType, setBookingType] = useState<"upcoming" | "past">(
    "upcoming"
  );

  // Get booking data from Redux store with safety checks
  const {
    upcomingBookings = [],
    pastBookings = [],
    isLoading,
    error,
  } = useSelector((state: RootState) => state.booking);

  // Fetch bookings on component mount
  useEffect(() => {
    fetchBookings();
  }, [dispatch]);

  // Manual refresh function
  const fetchBookings = async () => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      const result = await getUserBookings();
      console.log(result);

      // Ensure result has the expected structure with fallback arrays
      const upcomingData = Array.isArray(result?.upcoming)
        ? result.upcoming
        : [];
      const pastData = Array.isArray(result?.past) ? result.past : [];

      dispatch(setUpcomingBookings(upcomingData));
      dispatch(setPastBookings(pastData));
    } catch (error: any) {
      console.error("Fetch bookings error:", error);
      const errorMessage =
        error?.response?.data?.message || error?.message || "Unknown error";
      dispatch(setError(`Failed to load bookings: ${errorMessage}`));
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    const handleReservationEvent = () => {
      fetchBookings();
      console.log("Bookings refetched due to socket event");
    };

    // Listen for all reservation-related events that could affect user's bookings
    socket.on("reservationStatusUpdate", handleReservationEvent);
    socket.on("reservationUpdated", handleReservationEvent);
    socket.on("reservationCancelled", handleReservationEvent);
    socket.on("reservationCompleted", handleReservationEvent);

    // Cleanup on unmount
    return () => {
      socket.off("reservationStatusUpdate", handleReservationEvent);
      socket.off("reservationUpdated", handleReservationEvent);
      socket.off("reservationCancelled", handleReservationEvent);
      socket.off("reservationCompleted", handleReservationEvent);
    };
  }, []);

  return (
    <div className="min-h-screen bg-white w-full sm:w-5/6 md:w-4/6 mx-auto p-5 rounded-lg shadow-2xl">
      <div className="w-full max-w-4xl mx-auto px-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {isLoading && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2">Loading bookings...</span>
          </div>
        )}

        <div className="w-full mt-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-lg">Meeting Type</h2>
            <div className="flex gap-2">
              <button
                onClick={fetchBookings}
                disabled={isLoading}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Refreshing..." : "Refresh"}
              </button>
            </div>
          </div>
          <div className="flex gap-x-2 w-full h-fit">
            <button
              onClick={() => setBookingType("upcoming")}
              className={`flex-1  h-12 border-2 border-slate-200 ${
                bookingType === "upcoming"
                  ? "bg-primary text-white"
                  : "bg-white text-gray-700"
              } rounded-lg flex justify-center items-center transition-colors hover:border-blue-300`}
            >
              <span className="text-lg">
                Upcoming (
                {Array.isArray(upcomingBookings) ? upcomingBookings.length : 0})
              </span>
            </button>
            <button
              onClick={() => setBookingType("past")}
              className={`flex-1  h-12 border-2 border-slate-200 ${
                bookingType === "past"
                  ? "bg-primary text-white"
                  : "bg-white text-gray-700"
              } rounded-lg flex justify-center items-center transition-colors hover:border-blue-300`}
            >
              <span className="text-lg">
                Past ({Array.isArray(pastBookings) ? pastBookings.length : 0})
              </span>
            </button>
          </div>
        </div>

        {/* Upcoming Bookings */}
        {bookingType === "upcoming" && (
          <div className="mt-6">
            {Array.isArray(upcomingBookings) && upcomingBookings.length > 0 ? (
              upcomingBookings.map((booking: any) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  showActions={true}
                />
              ))
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
            {Array.isArray(pastBookings) && pastBookings.length > 0 ? (
              pastBookings.map((booking: any) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  showActions={false}
                />
              ))
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
    </div>
  );
};

export default Bookings;
