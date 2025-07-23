import { formatSelectedDate } from "@/utils/helpers";
import React, { useEffect, useState } from "react";
import "react-calendar/dist/Calendar.css";
import { Meetings, ReactCalendar } from "./subcomponents";
import { getAllReservations } from "@/api/services/bookingService";
import socket from "@/utils/socketManager";

const Calendar: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [allBookings, setAllBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  console.log(selectedDate);
  const fetchReservations = async () => {
    try {
      setLoading(true);
      const response = await getAllReservations();
      console.log("AAAAAAAAAAAAAA", response);
      if (response?.data) {
        // Handle both paginated and non-paginated responses
        const reservations = response.data.reservations || response.data;
        setAllBookings(reservations);
        console.log("Fetched reservations:", reservations);
      } else {
        setAllBookings([]);
      }
    } catch (error) {
      console.error("Error fetching reservations:", error);
      // toast.error("Failed to fetch reservations");
      setAllBookings([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter meetings for the selected date (fix timezone issue)
  const getMeetingsForSelectedDate = () => {
    // Create date strings in local timezone to avoid UTC conversion issues
    const selectedYear = selectedDate.getFullYear();
    const selectedMonth = String(selectedDate.getMonth() + 1).padStart(2, "0");
    const selectedDay = String(selectedDate.getDate()).padStart(2, "0");
    const selectedDateString = `${selectedYear}-${selectedMonth}-${selectedDay}`;

    return allBookings.filter((meeting) => {
      const meetingDate = new Date(meeting.startTime);
      const meetingYear = meetingDate.getFullYear();
      const meetingMonth = String(meetingDate.getMonth() + 1).padStart(2, "0");
      const meetingDay = String(meetingDate.getDate()).padStart(2, "0");
      const meetingDateString = `${meetingYear}-${meetingMonth}-${meetingDay}`;

      return meetingDateString === selectedDateString;
    });
  };

  const meetingsForSelectedDate = getMeetingsForSelectedDate();

  useEffect(() => {
    fetchReservations();
  }, []);

  useEffect(() => {
    const handleReservationEvent = () => {
      fetchReservations();
      console.log("Calendar refreshed due to socket event");
    };

    // Listen for all reservation-related events to update calendar dots
    socket.on("newReservationRequest", handleReservationEvent);
    socket.on("reservationStatusUpdate", handleReservationEvent);
    socket.on("reservationUpdated", handleReservationEvent);
    socket.on("reservationCancelled", handleReservationEvent);
    socket.on("reservationCompleted", handleReservationEvent);

    // Cleanup on unmount
    return () => {
      socket.off("newReservationRequest", handleReservationEvent);
      socket.off("reservationStatusUpdate", handleReservationEvent);
      socket.off("reservationUpdated", handleReservationEvent);
      socket.off("reservationCancelled", handleReservationEvent);
      socket.off("reservationCompleted", handleReservationEvent);
    };
  }, []);

  return (
    <div className="min-h-screen bg-white w-full sm:w-5/6 md:w-5/6 lg:w-4/6 mx-auto p-5 rounded-lg shadow-2xl">
      <div className="w-full max-w-6xl mx-auto px-4">
        {/* Calendar Section */}
        <ReactCalendar
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          reservations={allBookings}
        />
        {/* Selected Date Info */}
        <div className="mt-6">
          <h3 className="font-semibold text-lg mb-2">
            Meetings for {formatSelectedDate(selectedDate)}
          </h3>
          <div className="text-sm text-gray-600 mb-4">
            {loading
              ? "Loading..."
              : `${meetingsForSelectedDate.length} meeting${
                  meetingsForSelectedDate.length !== 1 ? "s" : ""
                } found`}
          </div>
        </div>
        {/* Available Rooms for Selected Date */}
        <div className="mt-4">
          <Meetings
            meetings={meetingsForSelectedDate}
            loading={loading}
            selectedDate={selectedDate}
          />
        </div>
      </div>
    </div>
  );
};

export default Calendar;
