import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Calendar,
  Clock,
  Users,
  MapPin,
  Search,
  Eye,
  Check,
  X,
} from "lucide-react";

import toast from "react-hot-toast";
import { updateBooking } from "@/store/slices/bookingSlice";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const BookingManagement: React.FC = () => {
  const dispatch = useDispatch();
  const { upcomingBookings, pastBookings } = useSelector(
    (state: any) => state.booking
  );
  const allBookings = [...(upcomingBookings || []), ...(pastBookings || [])];
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const filteredBookings = (allBookings || []).filter((booking: any) => {
    const matchesSearch =
      booking.meetingTitle?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
      booking.name?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
      booking.department?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "all" || booking.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const handleApproveBooking = (bookingId: number) => {
    dispatch(
      updateBooking({
        id: bookingId,
        updates: { status: "approved" },
      })
    );
    toast.success("Booking approved successfully!");
  };

  const handleRejectBooking = (bookingId: number) => {
    dispatch(
      updateBooking({
        id: bookingId,
        updates: { status: "cancelled" },
      })
    );
    toast.success("Booking rejected successfully!");
  };

  const handleCompleteBooking = (bookingId: number) => {
    dispatch(
      updateBooking({
        id: bookingId,
        updates: { status: "completed" },
      })
    );
    toast.success("Booking marked as completed!");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-600";
      case "approved":
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
      case "approved":
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
              <p className="text-sm font-medium text-gray-600">Approved</p>
              <p className="text-2xl font-bold text-gray-900">
                {allBookings.filter((b: any) => b.status === "approved").length}
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
              <option value="approved">Approved</option>
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
          {filteredBookings.map((booking: any) => (
            <div
              key={booking.id}
              className={`p-6 border-l-4 ${getPriorityColor(
                booking.status
              )} hover:bg-gray-50`}
            >
              <div className="flex items-center justify-between relative">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-medium text-gray-900">
                      {booking.meetingTitle}
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
                      {booking.name || "Unknown"} •{" "}
                      {booking.department || "N/A"}
                    </div>
                    <div className="flex items-center">
                      <MapPin size={14} className="mr-2" />
                      Room {booking.roomId}
                    </div>
                    <div className="flex items-center">
                      <Calendar size={14} className="mr-2" />
                      {formatDate(booking.date)}
                    </div>
                    <div className="flex items-center">
                      <Clock size={14} className="mr-2" />
                      {booking.startTime} - {booking.endTime}
                    </div>
                  </div>

                  <div className="mt-2">
                    <p className="text-sm text-gray-600">
                      <strong>Agenda:</strong> {booking.teamAgenda}
                    </p>
                    {booking.requirements &&
                      booking.requirements.length > 0 && (
                        <p className="text-sm text-gray-600 mt-1">
                          <strong>Requirements:</strong>{" "}
                          {booking.requirements.join(", ")}
                        </p>
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
                      >
                        <Check size={14} className="mr-1" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRejectBooking(booking.id)}
                        className="text-red-600 hover:text-red-700 w-28"
                      >
                        <X size={14} className="mr-1" />
                        Reject
                      </Button>
                    </>
                  )}

                  {booking.status === "approved" && (
                    <Button
                      size="sm"
                      onClick={() => handleCompleteBooking(booking.id)}
                      className="bg-blue-600 hover:bg-blue-700 w-28"
                    >
                      <Check size={14} className="mr-1" />
                      Complete
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
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
                    {selectedBooking.meetingTitle}
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
                    {selectedBooking.name || "Unknown"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Department
                  </label>
                  <p className="text-sm text-gray-900">
                    {selectedBooking.department || "N/A"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Date
                  </label>
                  <p className="text-sm text-gray-900">
                    {formatDate(selectedBooking.date)}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Time
                  </label>
                  <p className="text-sm text-gray-900">
                    {selectedBooking.startTime} - {selectedBooking.endTime}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Room
                  </label>
                  <p className="text-sm text-gray-900">
                    Room {selectedBooking.roomId}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Attendees
                  </label>
                  <p className="text-sm text-gray-900">
                    {selectedBooking.numberOfAttendees} people
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Agenda
                </label>
                <p className="text-sm text-gray-900">
                  {selectedBooking.teamAgenda}
                </p>
              </div>

              {selectedBooking.requirements &&
                selectedBooking.requirements.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Requirements
                    </label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedBooking.requirements.map(
                        (req: string, index: number) => (
                          <span
                            key={index}
                            className="px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded"
                          >
                            {req}
                          </span>
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
                >
                  Approve
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    handleRejectBooking(selectedBooking.id);
                    setSelectedBooking(null);
                    setIsViewModalOpen(false);
                  }}
                  className="text-red-600 hover:text-red-700"
                >
                  Reject
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
