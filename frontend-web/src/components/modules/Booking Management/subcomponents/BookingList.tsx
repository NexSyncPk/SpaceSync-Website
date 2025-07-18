import React from "react";
import { Calendar } from "lucide-react";
import BookingCard from "./BookingCard";

interface BookingListProps {
  filteredBookings: any[];
  loading: boolean;
  searchTerm: string;
  filterStatus: string;
  updatingBookings: Set<string>;
  onApprove: (bookingId: string) => void;
  onReject: (bookingId: string) => void;
  onComplete: (bookingId: string) => void;
  onView: (booking: any) => void;
}

const BookingList: React.FC<BookingListProps> = ({
  filteredBookings,
  loading,
  searchTerm,
  filterStatus,
  updatingBookings,
  onApprove,
  onReject,
  onComplete,
  onView,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">
          Booking Requests ({filteredBookings.length})
        </h2>
      </div>

      <div className="divide-y divide-gray-200">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading bookings...</p>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="p-8 text-center">
            <Calendar className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No bookings found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || filterStatus !== "all"
                ? "Try adjusting your search or filter criteria."
                : "No booking requests have been submitted yet."}
            </p>
          </div>
        ) : (
          filteredBookings.map((booking: any) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              updatingBookings={updatingBookings}
              onApprove={onApprove}
              onReject={onReject}
              onComplete={onComplete}
              onView={onView}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default BookingList;
