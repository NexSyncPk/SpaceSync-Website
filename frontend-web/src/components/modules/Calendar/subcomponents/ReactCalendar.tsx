import Calendar from "react-calendar";

interface ReactCalendarProps {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
}

const ReactCalendar = ({
  selectedDate,
  setSelectedDate,
}: ReactCalendarProps) => {
  const handleDateChange = (value: any) => {
    if (value instanceof Date) {
      setSelectedDate(value);
    }
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

export default ReactCalendar;
