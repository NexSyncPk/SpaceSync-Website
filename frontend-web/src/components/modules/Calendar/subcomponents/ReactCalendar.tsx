import Calendar from "react-calendar";
import { Reservation } from "../../../../api/services/bookingService";

interface ReactCalendarProps {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  reservations?: Reservation[]; // Array of reservation/meeting data
}

const ReactCalendar = ({
  selectedDate,
  setSelectedDate,
  reservations = [], // Default to empty array
}: ReactCalendarProps) => {
  const handleDateChange = (value: any) => {
    if (value instanceof Date) {
      setSelectedDate(value);
    }
  };

  // Function to check if a date has meetings
  const hasReservationsOnDate = (date: Date) => {
    const dateString = date.toDateString();
    return reservations.some((reservation) => {
      const reservationDate = new Date(reservation.startTime);
      return reservationDate.toDateString() === dateString;
    });
  };

  // Function to count meetings on a date
  const getReservationCountForDate = (date: Date) => {
    const dateString = date.toDateString();
    return reservations.filter((reservation) => {
      const reservationDate = new Date(reservation.startTime);
      return reservationDate.toDateString() === dateString;
    }).length;
  };
  return (
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
              const classes = [];

              // Highlight today
              if (date.toDateString() === new Date().toDateString()) {
                classes.push("bg-blue-100 text-blue-600");
              }

              // Highlight selected date
              if (date.toDateString() === selectedDate.toDateString()) {
                classes.push("bg-blue-600 text-white");
              }

              // Add class for dates with meetings
              if (hasReservationsOnDate(date)) {
                classes.push("has-meetings");
              }

              return classes.join(" ");
            }
            return "";
          }}
          tileContent={({ date, view }: any) => {
            if (view === "month" && hasReservationsOnDate(date)) {
              const count = getReservationCountForDate(date);
              return (
                <div className="meeting-indicator">
                  <div className="meeting-dots">
                    {count <= 3 ? (
                      // Show individual dots for 1-3 meetings
                      Array.from({ length: count }).map((_, index) => (
                        <div key={index} className="meeting-dot"></div>
                      ))
                    ) : (
                      // Show "+3" indicator for more than 3 meetings
                      <div className="meeting-count">+{count}</div>
                    )}
                  </div>
                </div>
              );
            }
            return null;
          }}
        />
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
        
        /* Meeting indicator styles */
        .has-meetings {
          position: relative;
        }
        
        .meeting-indicator {
          position: absolute;
          bottom: 2px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
        }
        
        .meeting-dots {
          display: flex;
          gap: 2px;
          align-items: center;
        }
        
        .meeting-dot {
          width: 4px;
          height: 4px;
          background-color: #ef4444;
          border-radius: 50%;
          opacity: 0.8;
        }
        
        .meeting-count {
          font-size: 10px;
          font-weight: bold;
          color: #ef4444;
          background-color: rgba(239, 68, 68, 0.1);
          padding: 1px 3px;
          border-radius: 4px;
          min-width: 16px;
          text-align: center;
        }
        
        /* Adjust tile content positioning */
        .react-calendar__tile {
          position: relative;
          min-height: 40px;
        }
      `}</style>
    </div>
  );
};

export default ReactCalendar;
