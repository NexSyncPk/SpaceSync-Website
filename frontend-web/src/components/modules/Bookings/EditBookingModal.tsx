import React, { useState } from "react";
import { Reservation, updateReservation } from "../../../api/services/bookingService";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { updateBooking } from "../../../store/slices/bookingSlice";

interface EditBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Reservation;
}


const EditBookingModal: React.FC<EditBookingModalProps> = ({ isOpen, onClose, booking }) => {
  const [form, setForm] = useState({
    title: booking.title || "",
    agenda: booking.agenda || "",
    startTime: booking.startTime || "",
    endTime: booking.endTime || "",
  });
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateReservation(booking.id, form);
      toast.success("Booking updated successfully!");
      // Update Redux store with correct shape
      dispatch(updateBooking({ id: booking.id, updates: form }));
      onClose();
    } catch (error: any) {
      toast.error(error?.message || "Failed to update booking");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
          onClick={onClose}
          disabled={loading}
        >
          ×
        </button>
        <h2 className="text-lg font-semibold mb-4">Edit Booking</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Agenda</label>
            <textarea
              name="agenda"
              value={form.agenda}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              rows={2}
            />
          </div>
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Start Time</label>
              <input
                type="datetime-local"
                name="startTime"
                value={form.startTime.slice(0, 16)}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">End Time</label>
              <input
                type="datetime-local"
                name="endTime"
                value={form.endTime.slice(0, 16)}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBookingModal;
