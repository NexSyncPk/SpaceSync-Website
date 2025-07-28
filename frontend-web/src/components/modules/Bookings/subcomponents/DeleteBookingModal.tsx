import React from "react";

interface DeleteBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
}

const DeleteBookingModal: React.FC<DeleteBookingModalProps> = ({ isOpen, onClose, onConfirm, loading }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-sm p-6 relative max-h-[90vh] overflow-y-auto">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
          onClick={onClose}
          disabled={loading}
        >
          ×
        </button>
        <h2 className="text-lg font-semibold mb-4">Delete Reservation</h2>
        <p className="mb-6 text-gray-700">Are you sure you want to delete this reservation? This action cannot be undone.</p>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="button"
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteBookingModal;
