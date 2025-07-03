import { formatSelectedDate } from "@/utils/helpers";
import { mockAvailableRooms } from "@/utils/mockData";
import React, { useState } from "react";
import "react-calendar/dist/Calendar.css";
import ReactCalendar from "./subcomponents/ReactCalendar";

const CalendarPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const handleBookRoom = (roomId: number) => {
    console.log(`Booking room ${roomId} for ${selectedDate.toDateString()}`);
    // Implement booking logic here
  };

  return (
    <div className="min-h-screen bg-white w-full sm:w-5/6 md:w-4/6 mx-auto p-5 rounded-lg shadow-2xl">
      <div className="w-full max-w-6xl mx-auto px-4">
        {/* Calendar Section */}
        <ReactCalendar
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
        />
        {/* Selected Date Info */}
        <div className="mt-6">
          <h3 className="font-semibold text-lg mb-2">
            Available Rooms for {formatSelectedDate(selectedDate)}
          </h3>
        </div>
        {/* Available Rooms for Selected Date */}
        <div className="mt-4">
          {mockAvailableRooms.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2  gap-4">
              {mockAvailableRooms.map((room) => (
                <div
                  key={room.id}
                  className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                >
                  <img
                    src={room.image}
                    alt={room.name}
                    className="w-full h-32 object-cover"
                  />
                  <div className="p-4">
                    <h4 className="font-semibold text-gray-800 mb-1">
                      {room.name}
                    </h4>
                    <p className="text-sm text-gray-600 mb-1">
                      Available: {room.time}
                    </p>
                    <p className="text-sm text-gray-600 mb-3">
                      Capacity: {room.capacity} people
                    </p>
                    <button
                      onClick={() => handleBookRoom(room.id)}
                      className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <p className="text-gray-500">
                No rooms available for the selected date
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;
