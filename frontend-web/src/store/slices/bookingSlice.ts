import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Booking, Room } from '../../types/interfaces.js';
import { pastBookings, upcomingBookings } from '../../utils/mockData.js';

interface BookingState {
  upcomingBookings: Booking[];
  pastBookings: Booking[];
  selectedRoom: Room | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: BookingState = {
  upcomingBookings: upcomingBookings,
  pastBookings: pastBookings,
  selectedRoom: null,
  isLoading: false,
  error: null,
};

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    // Booking management
    setUpcomingBookings: (state, action: PayloadAction<Booking[]>) => {
      state.upcomingBookings = action.payload;
    },
    setPastBookings: (state, action: PayloadAction<Booking[]>) => {
      state.pastBookings = action.payload;
    },
    addBooking: (state, action: PayloadAction<Booking>) => {
      state.upcomingBookings.push(action.payload);
    },
    updateBooking: (state, action: PayloadAction<{ id: number; updates: Partial<Booking> }>) => {
      const { id, updates } = action.payload;
      const index = state.upcomingBookings.findIndex(booking => booking.id === id);
      if (index !== -1) {
        state.upcomingBookings[index] = { ...state.upcomingBookings[index], ...updates };
      }
    },
    deleteBooking: (state, action: PayloadAction<number>) => {
      state.upcomingBookings = state.upcomingBookings.filter(
        (booking) => booking.id !== action.payload
      );
    },
    moveBookingToPast: (state, action: PayloadAction<number>) => {
      const bookingIndex = state.upcomingBookings.findIndex(
        booking => booking.id === action.payload
      );
      if (bookingIndex !== -1) {
        const booking = state.upcomingBookings[bookingIndex];
        state.upcomingBookings.splice(bookingIndex, 1);
        state.pastBookings.unshift({ ...booking, status: 'completed' });
      }
    },
    
    // Room selection
    setSelectedRoom: (state, action: PayloadAction<Room | null>) => {
      state.selectedRoom = action.payload;
    },
    clearSelectedRoom: (state) => {
      state.selectedRoom = null;
    },
    
    // Loading and error states
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

// Export actions - simple and clean
export const { 
  setUpcomingBookings, 
  setPastBookings, 
  addBooking,
  updateBooking,
  deleteBooking,
  moveBookingToPast,
  setSelectedRoom,
  clearSelectedRoom,
  setLoading,
  setError,
  clearError
} = bookingSlice.actions;

export default bookingSlice.reducer;
