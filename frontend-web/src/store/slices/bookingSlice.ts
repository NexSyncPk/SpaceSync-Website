import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Reservation } from "../../api/services/bookingService";

interface BookingState {
  upcomingBookings: Reservation[];
  pastBookings: Reservation[];
  allBookings: Reservation[];
  selectedBooking: Reservation | null;
  isLoading: boolean;
  error: string | null;
  lastFetched: number | null;
}

const initialState: BookingState = {
  upcomingBookings: [],
  pastBookings: [],
  allBookings: [],
  selectedBooking: null,
  isLoading: false,
  error: null,
  lastFetched: null,
};

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    // Loading states
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    // Booking data management
    setUpcomingBookings: (state, action: PayloadAction<Reservation[]>) => {
      state.upcomingBookings = Array.isArray(action.payload)
        ? action.payload
        : [];
      state.lastFetched = Date.now();
    },
    setPastBookings: (state, action: PayloadAction<Reservation[]>) => {
      state.pastBookings = Array.isArray(action.payload) ? action.payload : [];
      state.lastFetched = Date.now();
    },
    setAllBookings: (state, action: PayloadAction<Reservation[]>) => {
      state.allBookings = action.payload;

      // Automatically separate into upcoming and past
      const now = new Date();
      state.upcomingBookings = action.payload.filter((booking) => {
        const endTime = new Date(booking.endTime);
        return endTime > now && booking.status !== "cancelled";
      });
      state.pastBookings = action.payload.filter((booking) => {
        const endTime = new Date(booking.endTime);
        return (
          endTime <= now ||
          booking.status === "cancelled" ||
          booking.status === "completed"
        );
      });

      state.lastFetched = Date.now();
    },

    // Individual booking operations
    addBooking: (state, action: PayloadAction<Reservation>) => {
      const newBooking = action.payload;
      state.allBookings.push(newBooking);

      // Add to appropriate list based on timing
      const endTime = new Date(newBooking.endTime);
      const now = new Date();

      if (endTime > now && newBooking.status !== "cancelled") {
        state.upcomingBookings.push(newBooking);
      } else {
        state.pastBookings.push(newBooking);
      }
    },

    updateBooking: (
      state,
      action: PayloadAction<{ id: string; updates: Partial<Reservation> }>
    ) => {
      const { id, updates } = action.payload;

      // Defensive: ensure arrays are always defined
      if (!Array.isArray(state.allBookings)) state.allBookings = [];
      if (!Array.isArray(state.upcomingBookings)) state.upcomingBookings = [];
      if (!Array.isArray(state.pastBookings)) state.pastBookings = [];

      // Update in all bookings
      const allIndex = state.allBookings.findIndex(
        (booking) => booking.id === id
      );
      if (allIndex !== -1) {
        state.allBookings[allIndex] = {
          ...state.allBookings[allIndex],
          ...updates,
        };
      }

      // Update in upcoming bookings
      const upcomingIndex = state.upcomingBookings.findIndex(
        (booking) => booking.id === id
      );
      if (upcomingIndex !== -1) {
        state.upcomingBookings[upcomingIndex] = {
          ...state.upcomingBookings[upcomingIndex],
          ...updates,
        };
      }

      // Update in past bookings
      const pastIndex = state.pastBookings.findIndex(
        (booking) => booking.id === id
      );
      if (pastIndex !== -1) {
        state.pastBookings[pastIndex] = {
          ...state.pastBookings[pastIndex],
          ...updates,
        };
      }
    },

    deleteBooking: (state, action: PayloadAction<string>) => {
      const id = action.payload;

      // Defensive: ensure arrays are always defined before filtering
      if (!Array.isArray(state.allBookings)) state.allBookings = [];
      if (!Array.isArray(state.upcomingBookings)) state.upcomingBookings = [];
      if (!Array.isArray(state.pastBookings)) state.pastBookings = [];

      state.allBookings = state.allBookings.filter(
        (booking) => booking.id !== id
      );
      state.upcomingBookings = state.upcomingBookings.filter(
        (booking) => booking.id !== id
      );
      state.pastBookings = state.pastBookings.filter(
        (booking) => booking.id !== id
      );
    },

    // Selection management
    setSelectedBooking: (state, action: PayloadAction<Reservation | null>) => {
      state.selectedBooking = action.payload;
    },
    clearSelectedBooking: (state) => {
      state.selectedBooking = null;
    },

    // Clear all data
    clearBookings: (state) => {
      state.upcomingBookings = [];
      state.pastBookings = [];
      state.allBookings = [];
      state.selectedBooking = null;
      state.lastFetched = null;
      state.error = null;
    },
  },
});

export const {
  setLoading,
  setError,
  setUpcomingBookings,
  setPastBookings,
  setAllBookings,
  addBooking,
  updateBooking,
  deleteBooking,
  setSelectedBooking,
  clearSelectedBooking,
  clearBookings,
} = bookingSlice.actions;

export default bookingSlice.reducer;
