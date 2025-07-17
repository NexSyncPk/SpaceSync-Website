import React, { useEffect, useState } from "react";
import {
  Calendar,
  Clock,
  Users,
  MapPin,
  Search,
  Eye,
  Check,
  X,
  Loader2,
} from "lucide-react";

import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  getAllReservations,
  updateReservationStatus,
} from "@/api/services/bookingService";

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
      toast.error("Failed to fetch reservations");
      setAllBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const handleApproveBooking = async (bookingId: string) => {
    try {
      // Add booking ID to updating set
      setUpdatingBookings((prev) => new Set(prev).add(bookingId));

      // TODO: Replace with actual API call when endpoint is available
      await updateReservationStatus(bookingId, "confirmed");

      // For now, update local state
      setAllBookings((prev) =>
        prev.map((booking) =>
          booking.id === bookingId
            ? { ...booking, status: "confirmed" }
            : booking
        )
      );

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

      // For now, update local state
      setAllBookings((prev) =>
        prev.map((booking) =>
          booking.id === bookingId
            ? { ...booking, status: "cancelled" }
            : booking
        )
      );

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

      // For now, update local state
      setAllBookings((prev) =>
        prev.map((booking) =>
          booking.id === bookingId
            ? { ...booking, status: "completed" }
            : booking
        )
      );

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-600";
      case "confirmed":
        return "bg-green-100 text-green-600";
      case "completed":
        return "bg-blue-100 text-blue-600";
      case "cancelled":
        return "bg-red-100 text-red-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getPriorityColor = (status: string) => {
    switch (status) {
      case "pending":
        return "border-l-yellow-500";
      case "confirmed":
        return "border-l-green-500";
      case "completed":
        return "border-l-blue-500";
      case "cancelled":
        return "border-l-red-500";
      default:
        return "border-l-gray-500";
    }
  };

  const openViewModal = (booking: any) => {
    setSelectedBooking(booking);
    setIsViewModalOpen(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getAmenityBadges = (room: any) => {
    const amenities = [];
    if (room?.displayProjector) amenities.push("Projector");
    if (room?.displayWhiteboard) amenities.push("Whiteboard");
    if (room?.cateringAvailable) amenities.push("Catering");
    if (room?.videoConferenceAvailable) amenities.push("Video Conference");
    return amenities;
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total Bookings
              </p>
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
              <p className="text-2xl font-bold text-gray-900">
                {allBookings.filter((b: any) => b.status === "pending").length}
              </p>
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
              <p className="text-2xl font-bold text-gray-900">
                {
                  allBookings.filter((b: any) => b.status === "confirmed")
                    .length
                }
              </p>
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
              <p className="text-2xl font-bold text-gray-900">
                {
                  allBookings.filter((b: any) => b.status === "completed")
                    .length
                }
              </p>
            </div>
            <div className="p-3 rounded-lg bg-blue-100">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search bookings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bookings List */}
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
              <div
                key={booking.id}
                className={`p-6 border-l-4 ${getPriorityColor(
                  booking.status
                )} hover:bg-gray-50 ${
                  updatingBookings.has(booking.id)
                    ? "opacity-75 bg-gray-50"
                    : ""
                } transition-all duration-200`}
              >
                <div className="flex items-center justify-between relative">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-medium text-gray-900">
                        {booking.title}
                      </h3>
                      <span
                        className={` absolute right-0 px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                          booking.status
                        )}`}
                      >
                        {booking.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Users size={14} className="mr-2" />
                        {booking.User?.name || "Unknown"} •{" "}
                        {booking.User?.department || "N/A"}
                      </div>
                      <div className="flex items-center">
                        <MapPin size={14} className="mr-2" />
                        {booking.Room?.name || `Room ${booking.roomId}`}
                      </div>
                      <div className="flex items-center">
                        <Calendar size={14} className="mr-2" />
                        {formatDate(booking.startTime)}
                      </div>
                      <div className="flex items-center">
                        <Clock size={14} className="mr-2" />
                        {formatTime(booking.startTime)} -{" "}
                        {formatTime(booking.endTime)}
                      </div>
                      <div className="flex items-center">
                        <Users size={14} className="mr-2" />
                        Capacity: {booking.Room?.capacity || "N/A"}
                      </div>
                    </div>

                    <div className="mt-2">
                      <p className="text-sm text-gray-600">
                        <strong>Agenda:</strong> {booking.agenda}
                      </p>
                      {booking.internalAttendees &&
                        booking.internalAttendees.length > 0 && (
                          <p className="text-sm text-gray-600 mt-1">
                            <strong>Internal Attendees:</strong>{" "}
                            {booking.internalAttendees.length} members
                          </p>
                        )}
                      {booking.externalAttendees &&
                        booking.externalAttendees.length > 0 && (
                          <p className="text-sm text-gray-600 mt-1">
                            <strong>External Attendees:</strong>{" "}
                            {booking.externalAttendees.length} guests
                          </p>
                        )}
                      {getAmenityBadges(booking.Room).length > 0 && (
                        <div className="mt-2">
                          <p className="text-sm text-gray-600 mb-1">
                            <strong>Room Amenities:</strong>
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {getAmenityBadges(booking.Room).map(
                              (amenity: string, index: number) => (
                                <span
                                  key={index}
                                  className="px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded"
                                >
                                  {amenity}
                                </span>
                              )
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4 max-sm:flex-col">
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-28"
                      onClick={() => openViewModal(booking)}
                    >
                      <Eye size={14} className="mr-1" />
                      View
                    </Button>

                    {booking.status === "pending" && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => handleApproveBooking(booking.id)}
                          className="bg-green-600 hover:bg-green-700 w-28"
                          disabled={updatingBookings.has(booking.id)}
                        >
                          {updatingBookings.has(booking.id) ? (
                            <Loader2 size={14} className="mr-1 animate-spin" />
                          ) : (
                            <Check size={14} className="mr-1" />
                          )}
                          Confirm
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRejectBooking(booking.id)}
                          className="text-red-600 hover:text-red-700 w-28"
                          disabled={updatingBookings.has(booking.id)}
                        >
                          {updatingBookings.has(booking.id) ? (
                            <Loader2 size={14} className="mr-1 animate-spin" />
                          ) : (
                            <X size={14} className="mr-1" />
                          )}
                          Cancel
                        </Button>
                      </>
                    )}

                    {booking.status === "confirmed" && (
                      <Button
                        size="sm"
                        onClick={() => handleCompleteBooking(booking.id)}
                        className="bg-blue-600 hover:bg-blue-700 w-28"
                        disabled={updatingBookings.has(booking.id)}
                      >
                        {updatingBookings.has(booking.id) ? (
                          <Loader2 size={14} className="mr-1 animate-spin" />
                        ) : (
                          <Check size={14} className="mr-1" />
                        )}
                        Complete
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* View Booking Modal */}
      <Dialog
        open={isViewModalOpen}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedBooking(null);
          }
          setIsViewModalOpen(open);
        }}
      >
        <DialogContent className="max-w-lg max-sm: w-11/12 rounded-lg">
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
          </DialogHeader>

          {selectedBooking && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Meeting Title
                  </label>
                  <p className="text-sm text-gray-900">
                    {selectedBooking.title}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <span
                    className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                      selectedBooking.status
                    )}`}
                  >
                    {selectedBooking.status}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Organizer
                  </label>
                  <p className="text-sm text-gray-900">
                    {selectedBooking.User?.name || "Unknown"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {selectedBooking.User?.email}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Department
                  </label>
                  <p className="text-sm text-gray-900">
                    {selectedBooking.User?.department || "N/A"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Date
                  </label>
                  <p className="text-sm text-gray-900">
                    {formatDate(selectedBooking.startTime)}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Time
                  </label>
                  <p className="text-sm text-gray-900">
                    {formatTime(selectedBooking.startTime)} -{" "}
                    {formatTime(selectedBooking.endTime)}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Room
                  </label>
                  <p className="text-sm text-gray-900">
                    {selectedBooking.Room?.name ||
                      `Room ${selectedBooking.roomId}`}
                  </p>
                  <p className="text-xs text-gray-500">
                    Capacity: {selectedBooking.Room?.capacity || "N/A"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Attendees
                  </label>
                  <div className="text-sm text-gray-900">
                    {selectedBooking.internalAttendees?.length > 0 && (
                      <p>
                        Internal: {selectedBooking.internalAttendees.length}
                      </p>
                    )}
                    {selectedBooking.externalAttendees?.length > 0 && (
                      <p>
                        External: {selectedBooking.externalAttendees.length}
                      </p>
                    )}
                    {!selectedBooking.internalAttendees?.length &&
                      !selectedBooking.externalAttendees?.length && (
                        <p>No attendees</p>
                      )}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Agenda
                </label>
                <p className="text-sm text-gray-900">
                  {selectedBooking.agenda}
                </p>
              </div>

              {getAmenityBadges(selectedBooking.Room).length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Room Amenities
                  </label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {getAmenityBadges(selectedBooking.Room).map(
                      (amenity: string, index: number) => (
                        <span
                          key={index}
                          className="px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded"
                        >
                          {amenity}
                        </span>
                      )
                    )}
                  </div>
                </div>
              )}

              {selectedBooking.externalAttendees?.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    External Attendees
                  </label>
                  <div className="space-y-2 mt-1">
                    {selectedBooking.externalAttendees.map(
                      (attendee: any, index: number) => (
                        <div
                          key={index}
                          className="text-sm text-gray-900 bg-gray-50 p-2 rounded"
                        >
                          <p className="font-medium">{attendee.name}</p>
                          <p className="text-xs text-gray-500">
                            {attendee.email}
                          </p>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setSelectedBooking(null);
                setIsViewModalOpen(false);
              }}
            >
              Close
            </Button>
            {selectedBooking?.status === "pending" && (
              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    handleApproveBooking(selectedBooking.id);
                    setSelectedBooking(null);
                    setIsViewModalOpen(false);
                  }}
                  className="bg-green-600 hover:bg-green-700"
                  disabled={updatingBookings.has(selectedBooking.id)}
                >
                  {updatingBookings.has(selectedBooking.id) ? (
                    <Loader2 size={14} className="mr-1 animate-spin" />
                  ) : null}
                  Confirm
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    handleRejectBooking(selectedBooking.id);
                    setSelectedBooking(null);
                    setIsViewModalOpen(false);
                  }}
                  className="text-red-600 hover:text-red-700"
                  disabled={updatingBookings.has(selectedBooking.id)}
                >
                  {updatingBookings.has(selectedBooking.id) ? (
                    <Loader2 size={14} className="mr-1 animate-spin" />
                  ) : null}
                  Cancel
                </Button>
              </div>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BookingManagement;
