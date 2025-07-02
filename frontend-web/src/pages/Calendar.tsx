import { formatSelectedDate } from "@/utils/helpers";
import { mockAvailableRooms } from "@/utils/mockData";
import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const CalendarPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const handleDateChange = (value: any) => {
    if (value instanceof Date) {
      setSelectedDate(value);
    }
  };

  const handleBookRoom = (roomId: number) => {
    console.log(`Booking room ${roomId} for ${selectedDate.toDateString()}`);
    // Implement booking logic here
  };

  return (
    <div className="min-h-screen bg-white w-full sm:w-5/6 md:w-4/6 mx-auto p-5 rounded-lg shadow-2xl">
      <div className="w-full max-w-6xl mx-auto px-4">
        {/* Calendar Section */}
        <div className="mt-6">
          <h2 className="font-semibold mb-4 text-lg">Select Date</h2>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <Calendar
              onChange={handleDateChange}
              value={selectedDate}
              className="mx-auto"
              minDate={new Date()}
              tileClassName={({ date, view }: any) => {
                if (view === "month") {
                  // Highlight today
                  if (date.toDateString() === new Date().toDateString()) {
                    return "bg-blue-100 text-blue-600";
                  }
                  // Highlight selected date
                  if (date.toDateString() === selectedDate.toDateString()) {
                    return "bg-blue-600 text-white";
                  }
                }
                return "";
              }}
            />
          </div>
        </div>

        {/* Selected Date Info */}
        <div className="mt-6">
          <h3 className="font-semibold text-lg mb-2">
            Available Rooms for {formatSelectedDate(selectedDate)}
          </h3>
        </div>

        {/* Available Rooms for Selected Date */}
        <div className="mt-4">
          {mockAvailableRooms.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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

      {/* Custom Calendar Styles */}
      <style>{`
        .react-calendar {
          width: 100%;
          max-width: 600px;
          background: white;
          border: none;
          font-family: inherit;
          line-height: 1.125em;
        }
        
        .react-calendar__navigation {
          display: flex;
          height: 44px;
          margin-bottom: 1em;
        }
        
        .react-calendar__navigation button {
          min-width: 44px;
          background: none;
          font-size: 16px;
          color: #1565C0;
          border: none;
          padding: 0.5rem;
          border-radius: 6px;
          transition: background-color 0.2s;
        }
        
        .react-calendar__navigation button:hover {
          background-color: #f3f4f6;
        }
        
        .react-calendar__month-view__weekdays {
          text-align: center;
          text-transform: uppercase;
          font-weight: bold;
          font-size: 0.75em;
          color: #6b7280;
        }
        
        .react-calendar__tile {
          max-width: 100%;
          padding: 10px 6px;
          background: none;
          text-align: center;
          line-height: 16px;
          border: none;
          border-radius: 6px;
          margin: 2px;
          transition: all 0.2s;
        }
        
        .react-calendar__tile:hover {
          background-color: #f3f4f6;
        }
        
        .react-calendar__tile--now {
          background: #dbeafe !important;
          color: #1565C0 !important;
        }
        
        .react-calendar__tile--active {
          background: #1565C0 !important;
          color: white !important;
        }
      `}</style>
    </div>
  );
};

export default CalendarPage;
