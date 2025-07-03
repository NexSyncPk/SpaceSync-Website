import React, { useState } from "react";
import BookingCard from "./subcomponents/BookingCard.js";
import { useSelector } from "react-redux";

const Bookings: React.FC = () => {
  const [bookingType, setBookingType] = useState<"upcoming" | "past">(
    "upcoming"
  );

  // Use simple Redux selectors to get data from store
  const upcomingBookings = useSelector(
    (state: any) => state.booking.upcomingBookings
  );
  const pastBookings = useSelector((state: any) => state.booking.pastBookings);
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
            {pastBookings.length > 0 ? (
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
