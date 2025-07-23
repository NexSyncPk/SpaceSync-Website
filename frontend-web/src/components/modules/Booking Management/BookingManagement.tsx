import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  getAllReservations,
  updateReservationStatus,
} from "@/api/services/bookingService";
import {
  BookingStatsCards,
  BookingFilters,
  BookingList,
  BookingViewModal,
} from "./subcomponents";
import socket from "@/utils/socketManager";

const BookingManagement: React.FC = () => {
  const [allBookings, setAllBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingBookings, setUpdatingBookings] = useState<Set<string>>(
    new Set()
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const filteredBookings = (allBookings || []).filter((booking: any) => {
    const matchesSearch =
      booking.title?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
      booking.User?.name?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
      booking.User?.department
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      booking.Room?.name?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
      booking.agenda?.toLowerCase()?.includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "all" || booking.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const fetchReservations = async () => {
    try {
      setLoading(true);
      const response = await getAllReservations();
      console.log(response);
      if (response?.data) {
        // Handle both paginated and non-paginated responses
        const reservations = response.data.reservations || response.data.data;
        setAllBookings(Array.isArray(reservations) ? reservations : []);
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

  useEffect(() => {
    fetchReservations();
  }, []);

  useEffect(() => {
    const handleNewReservationRequest = () => {
      fetchReservations();
      console.log("Fetched");
    };

    // Listen for the event
    socket.on("newReservationRequest", handleNewReservationRequest);
    socket.on("reservationUpdated", handleNewReservationRequest);

    // Cleanup on unmount
    return () => {
      socket.off("newReservationRequest", handleNewReservationRequest);
    };
  }, []);

  const handleApproveBooking = async (bookingId: string) => {
    try {
      // Add booking ID to updating set
      setUpdatingBookings((prev) => new Set(prev).add(bookingId));

      // TODO: Replace with actual API call when endpoint is available
      await updateReservationStatus(bookingId, "confirmed");

      fetchReservations();

      toast.success("Booking confirmed successfully!");
    } catch (error) {
      console.error("Error confirming booking:", error);
      toast.error("Failed to confirm booking");
    } finally {
      // Remove booking ID from updating set
      setUpdatingBookings((prev) => {
        const newSet = new Set(prev);
        newSet.delete(bookingId);
        return newSet;
      });
    }
  };

  const handleRejectBooking = async (bookingId: string) => {
    try {
      // Add booking ID to updating set
      setUpdatingBookings((prev) => new Set(prev).add(bookingId));

      // TODO: Replace with actual API call when endpoint is available
      await updateReservationStatus(bookingId, "cancelled");

      fetchReservations();

      toast.success("Booking cancelled successfully!");
    } catch (error) {
      console.error("Error cancelling booking:", error);
      toast.error("Failed to cancel booking");
    } finally {
      // Remove booking ID from updating set
      setUpdatingBookings((prev) => {
        const newSet = new Set(prev);
        newSet.delete(bookingId);
        return newSet;
      });
    }
  };

  const handleCompleteBooking = async (bookingId: string) => {
    try {
      // Add booking ID to updating set
      setUpdatingBookings((prev) => new Set(prev).add(bookingId));

      // TODO: Replace with actual API call when endpoint is available
      await updateReservationStatus(bookingId, "completed");

      fetchReservations();

      toast.success("Booking marked as completed!");
    } catch (error) {
      console.error("Error completing booking:", error);
      toast.error("Failed to complete booking");
    } finally {
      // Remove booking ID from updating set
      setUpdatingBookings((prev) => {
        const newSet = new Set(prev);
        newSet.delete(bookingId);
        return newSet;
      });
    }
  };

  const openViewModal = (booking: any) => {
    setSelectedBooking(booking);
    setIsViewModalOpen(true);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Booking Management
            </h1>
            <p className="text-gray-600 mt-1">
              Manage meeting room bookings and requests
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <BookingStatsCards allBookings={allBookings} />

      {/* Filters */}
      <BookingFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
      />

      {/* Bookings List */}
      <BookingList
        filteredBookings={filteredBookings}
        loading={loading}
        searchTerm={searchTerm}
        filterStatus={filterStatus}
        updatingBookings={updatingBookings}
        onApprove={handleApproveBooking}
        onReject={handleRejectBooking}
        onComplete={handleCompleteBooking}
        onView={openViewModal}
      />

      {/* View Booking Modal */}
      <BookingViewModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setSelectedBooking(null);
          setIsViewModalOpen(false);
        }}
        booking={selectedBooking}
        updatingBookings={updatingBookings}
        onApprove={handleApproveBooking}
        onReject={handleRejectBooking}
      />
    </div>
  );
};

export default BookingManagement;
