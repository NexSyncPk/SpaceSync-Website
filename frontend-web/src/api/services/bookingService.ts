import api from "../interceptor";
import {
  RESERVATIONS,
  RESERVATION_BY_ID,
  RESERVATION_UPDATE,
  RESERVATION_DELETE,
  RESERVATIONS_MY,
  RESERVATIONS_UPCOMING,
} from "../endpoints";

export interface CreateReservationData {
  roomId: string;
  title: string;
  agenda: string;
  startTime: string; // ISO date string
  endTime: string; // ISO date string
  internalAttendees?: string[]; // Array of user IDs
  requiredAmenities?: string[]; // Array of amenity strings
}

export interface UpdateReservationData {
  title?: string;
  agenda?: string;
  startTime?: string;
  endTime?: string;
  internalAttendees?: string[];
}

export interface ReservationFilters {
  roomId?: string;
  status?: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  startDate?: string;
  endDate?: string;
  limit?: number;
}

export interface Reservation {
  id: string;
  roomId: string;
  userId: string;
  title: string;
  agenda: string;
  startTime: string;
  endTime: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  internalAttendees?: string[];
  requiredAmenities?: string[];
  room?: {
    id: string;
    name: string;
    capacity: number;
    displayProjector: boolean;
    displayWhiteboard: boolean;
    cateringAvailable: boolean;
    videoConferenceAvailable: boolean;
  };
  user?: {
    id: string;
    firstName?: string;
    lastName?: string;
    name?: string; // Support for single name field from backend
    email: string;
    phone?: string;
    department?: string;
  };
  createdAt: string;
  updatedAt: string;
}

// ==================== BOOKING/RESERVATION API FUNCTIONS ====================

/**
 * Create a new reservation
 */
export const createReservation = async (data: CreateReservationData) => {
  console.log("🔄 Creating reservation:", data);
  const response = await api.post(RESERVATIONS, data);
  console.log("✅ Reservation created:", response.data);
  return response;
};

/**
 * Get all reservations with optional filters
 */
export const getAllReservations = async (filters?: ReservationFilters) => {
  console.log("🔄 Fetching all reservations with filters:", filters);
  const params = new URLSearchParams();
  
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });
  }
  
  const url = params.toString() ? `${RESERVATIONS}?${params.toString()}` : RESERVATIONS;
  const response = await api.get(url);
  console.log("✅ All reservations fetched:", response.data);
  return response;
};

/**
 * Get current user's reservations
 */
export const getMyReservations = async (status?: string) => {
  console.log("🔄 Fetching my reservations with status:", status);
  const url = status ? `${RESERVATIONS_MY}?status=${status}` : RESERVATIONS_MY;
  const response = await api.get(url);
  console.log("✅ My reservations fetched:", response.data);
  return response;
};

/**
 * Get upcoming reservations
 */
export const getUpcomingReservations = async (limit?: number) => {
  console.log("🔄 Fetching upcoming reservations with limit:", limit);
  const url = limit ? `${RESERVATIONS_UPCOMING}?limit=${limit}` : RESERVATIONS_UPCOMING;
  const response = await api.get(url);
  console.log("✅ Upcoming reservations fetched:", response.data);
  return response;
};

/**
 * Get reservation by ID
 */
export const getReservationById = async (reservationId: string) => {
  console.log("🔄 Fetching reservation by ID:", reservationId);
  const response = await api.get(RESERVATION_BY_ID(reservationId));
  console.log("✅ Reservation fetched:", response.data);
  return response;
};

/**
 * Update an existing reservation
 */
export const updateReservation = async (reservationId: string, data: UpdateReservationData) => {
  console.log("🔄 Updating reservation:", reservationId, data);
  const response = await api.put(RESERVATION_UPDATE(reservationId), data);
  console.log("✅ Reservation updated:", response.data);
  return response;
};

/**
 * Cancel/Delete a reservation
 */
export const cancelReservation = async (reservationId: string) => {
  console.log("🔄 Cancelling reservation:", reservationId);
  const response = await api.delete(RESERVATION_DELETE(reservationId));
  console.log("✅ Reservation cancelled:", response.data);
  return response;
};

/**
 * Update reservation status (Admin only)
 */
export const updateReservationStatus = async (reservationId: string, status: string) => {
  console.log("🔄 Updating reservation status:", reservationId, status);
  const response = await api.patch(`/reservations/${reservationId}/status`, { status });
  console.log("✅ Reservation status updated:", response.data);
  return response;
};

/**
 * Complete a reservation (Admin only)
 */
export const completeReservation = async (reservationId: string) => {
  console.log("🔄 Completing reservation:", reservationId);
  const response = await api.patch(`/reservations/${reservationId}/complete`);
  console.log("✅ Reservation completed:", response.data);
  return response;
};

/**
 * Check for room conflicts before booking
 */
export const checkRoomAvailability = async (
  roomId: string,
  startTime: string,
  endTime: string,
  excludeReservationId?: string
) => {
  try {
    // Get all reservations for the room on the same date
    const response = await getAllReservations({
      roomId,
      startDate: startTime.split('T')[0],
      endDate: endTime.split('T')[0]
    });
    const reservations = response.data?.data || response.data || [];
    const requestStart = new Date(startTime);
    const requestEnd = new Date(endTime);
    // Find conflicting reservations
    const conflicts = reservations.filter((reservation: Reservation) => {
      if (excludeReservationId && reservation.id === excludeReservationId) {
        return false; // Exclude current reservation when updating
      }
      if (reservation.status === 'cancelled') {
        return false; // Ignore cancelled reservations
      }
      const reservationStart = new Date(reservation.startTime);
      const reservationEnd = new Date(reservation.endTime);
      // Check for time overlap
      return (requestStart < reservationEnd && requestEnd > reservationStart);
    });
    return { available: conflicts.length === 0, conflicts };
  } catch (error) {
    console.error('❌ Error checking room availability:', error);
    throw error;
  }
};

/**
 * Get upcoming and past reservations for current user
 */
export const getUserBookings = async () => {
  try {
    const allReservations = await getMyReservations();
    if (!allReservations.data) {
      return { upcoming: [], past: [] };
    }
    const now = new Date();
    let reservations = allReservations.data;
    reservations = reservations.map((reservation: any) => {
      const user = reservation.User || reservation.user || {};
      return {
        ...reservation,
        room: reservation.Room || reservation.room,
        user: {
          ...user,
          firstName: user.firstName || user.name?.split(' ')[0] || user.name || '',
          lastName: user.lastName || user.name?.split(' ').slice(1).join(' ') || '',
          id: user.id,
          email: user.email
        }
      };
    });
    const upcoming = reservations.filter((reservation: Reservation) => {
      if (!reservation.endTime) return false;
      const endTime = new Date(reservation.endTime);
      return endTime > now && reservation.status !== 'cancelled';
    });
    const past = reservations.filter((reservation: Reservation) => {
      if (!reservation.endTime) return false;
      const endTime = new Date(reservation.endTime);
      return endTime <= now || reservation.status === 'cancelled' || reservation.status === 'completed';
    });
    return { upcoming, past };
  } catch (error) {
    throw error;
  }
};
