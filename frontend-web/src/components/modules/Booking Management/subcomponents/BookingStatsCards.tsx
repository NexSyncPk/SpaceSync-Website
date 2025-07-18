import React from "react";
import { Calendar, Clock, Users, Check } from "lucide-react";

interface BookingStatsCardsProps {
  allBookings: any[];
}

const BookingStatsCards: React.FC<BookingStatsCardsProps> = ({
  allBookings,
}) => {
  const pendingCount = allBookings.filter(
    (b: any) => b.status === "pending"
  ).length;
  const confirmedCount = allBookings.filter(
    (b: any) => b.status === "confirmed"
  ).length;
  const completedCount = allBookings.filter(
    (b: any) => b.status === "completed"
  ).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Bookings</p>
            <p className="text-2xl font-bold text-gray-900">
              {allBookings.length}
            </p>
          </div>
          <div className="p-3 rounded-lg bg-blue-100">
            <Calendar className="h-6 w-6 text-blue-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">
              Pending Approval
            </p>
            <p className="text-2xl font-bold text-gray-900">{pendingCount}</p>
          </div>
          <div className="p-3 rounded-lg bg-yellow-100">
            <Clock className="h-6 w-6 text-yellow-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Confirmed</p>
            <p className="text-2xl font-bold text-gray-900">{confirmedCount}</p>
          </div>
          <div className="p-3 rounded-lg bg-green-100">
            <Check className="h-6 w-6 text-green-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Completed</p>
            <p className="text-2xl font-bold text-gray-900">{completedCount}</p>
          </div>
          <div className="p-3 rounded-lg bg-blue-100">
            <Users className="h-6 w-6 text-blue-600" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingStatsCards;
