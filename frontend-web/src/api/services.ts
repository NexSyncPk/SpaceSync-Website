// API service for SpaceSync application
// This file demonstrates how to use the updated interceptor with Redux

import api from './interceptor';
import { apiEndpoints } from '@/utils/constants';
import type { 
  User, 
  LoginRequest, 
  SignupRequest, 
  AuthResponse 
} from '@/types/interfaces';

// Auth API services - these return data that should be dispatched to Redux
export const authAPI = {
  // Register a new user
  register: async (userData: SignupRequest): Promise<AuthResponse> => {
    const response = await api.post(apiEndpoints.register, userData);
    // Note: Dispatch signupSuccess action with response.data after calling this
    return response.data;
  },

  // Login user
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post(apiEndpoints.login, credentials);
    // Note: Dispatch loginSuccess action with response.data after calling this
    return response.data;
  },

  // Get current user profile
  getProfile: async (): Promise<User> => {
    const response = await api.get(apiEndpoints.profile);
    return response.data;
  },

  // Create organization (for unassigned users)
  createOrganization: async (name: string) => {
    const response = await api.post(apiEndpoints.createOrganization, { name });
    return response.data;
  },

  // Join organization with invite key
  joinOrganization: async (inviteKey: string) => {
    const response = await api.post(apiEndpoints.joinOrganization, { inviteKey });
    return response.data;
  },
};

// Room API services
export const roomAPI = {
  // Get all rooms
  getAllRooms: async () => {
    const response = await api.get(apiEndpoints.getAllRooms);
    return response.data;
  },

  // Create new room (admin only)
  createRoom: async (roomData: {
    name: string;
    capacity: number;
    displayProjector?: boolean;
    displayWhiteboard?: boolean;
    cateringAvailable?: boolean;
    videoConferenceAvailable?: boolean;
  }) => {
    const response = await api.post(apiEndpoints.createRoom, roomData);
    return response.data;
  },

  // Get room by ID
  getRoomById: async (roomId: string) => {
    const response = await api.get(apiEndpoints.getRoomById.replace(':roomId', roomId));
    return response.data;
  },

  // Update room (admin only)
  updateRoom: async (roomId: string, roomData: any) => {
    const response = await api.put(apiEndpoints.updateRoom.replace(':roomId', roomId), roomData);
    return response.data;
  },

  // Delete room (admin only)
  deleteRoom: async (roomId: string) => {
    const response = await api.delete(apiEndpoints.deleteRoom.replace(':roomId', roomId));
    return response.data;
  },

  // Search rooms
  searchRooms: async (filters: {
    capacity?: number;
    displayProjector?: boolean;
    displayWhiteboard?: boolean;
    cateringAvailable?: boolean;
    videoConferenceAvailable?: boolean;
  }) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) {
        params.append(key, value.toString());
      }
    });
    
    const response = await api.get(`${apiEndpoints.searchRooms}?${params.toString()}`);
    return response.data;
  },

  // Get room statuses
  getRoomStatuses: async () => {
    const response = await api.get(apiEndpoints.getRoomStatuses);
    return response.data;
  },

  // Get room availability
  getRoomAvailability: async (roomId: string, startDate: string, endDate: string) => {
    const params = new URLSearchParams({
      startDate,
      endDate,
    });
    
    const response = await api.get(
      `${apiEndpoints.getRoomAvailability.replace(':roomId', roomId)}?${params.toString()}`
    );
    return response.data;
  },
};

// Reservation API services
export const reservationAPI = {
  // Get all reservations
  getAllReservations: async (filters?: {
    roomId?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
  }) => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
    }
    
    const url = filters ? `${apiEndpoints.getAllReservations}?${params.toString()}` : apiEndpoints.getAllReservations;
    const response = await api.get(url);
    return response.data;
  },

  // Create new reservation
  createReservation: async (reservationData: {
    agenda: string;
    startTime: string;
    endTime: string;
    roomId: string;
    internalAttendees?: string[];
  }) => {
    const response = await api.post(apiEndpoints.createReservation, reservationData);
    return response.data;
  },

  // Get current user's reservations
  getMyReservations: async (status?: string) => {
    const url = status 
      ? `${apiEndpoints.getMyReservations}?status=${status}`
      : apiEndpoints.getMyReservations;
    
    const response = await api.get(url);
    return response.data;
  },

  // Get upcoming reservations
  getUpcomingReservations: async (limit = 10) => {
    const response = await api.get(`${apiEndpoints.getUpcomingReservations}?limit=${limit}`);
    return response.data;
  },

  // Get reservation by ID
  getReservationById: async (reservationId: string) => {
    const response = await api.get(apiEndpoints.getReservationById.replace(':reservationId', reservationId));
    return response.data;
  },

  // Update reservation
  updateReservation: async (reservationId: string, reservationData: any) => {
    const response = await api.put(
      apiEndpoints.updateReservation.replace(':reservationId', reservationId),
      reservationData
    );
    return response.data;
  },

  // Cancel/delete reservation
  deleteReservation: async (reservationId: string) => {
    const response = await api.delete(apiEndpoints.deleteReservation.replace(':reservationId', reservationId));
    return response.data;
  },

  // Update reservation status (admin only)
  updateReservationStatus: async (reservationId: string, status: string) => {
    const response = await api.patch(
      apiEndpoints.updateReservationStatus.replace(':reservationId', reservationId),
      { status }
    );
    return response.data;
  },
};

// Admin API services
export const adminAPI = {
  // Get all users in organization
  getAllUsers: async () => {
    const response = await api.get(apiEndpoints.getAllUsers);
    return response.data;
  },

  // Promote user to admin
  promoteUser: async (userId: string) => {
    const response = await api.put(apiEndpoints.promoteUser.replace(':userId', userId));
    return response.data;
  },

  // Demote admin to employee
  demoteUser: async (userId: string) => {
    const response = await api.put(apiEndpoints.demoteUser.replace(':userId', userId));
    return response.data;
  },

  // Remove user from organization
  removeUser: async (userId: string) => {
    const response = await api.delete(apiEndpoints.removeUser.replace(':userId', userId));
    return response.data;
  },

  // Get user statistics
  getUserStats: async () => {
    const response = await api.get(apiEndpoints.getUserStats);
    return response.data;
  },

  // Get admin dashboard data
  getAdminDashboard: async () => {
    const response = await api.get(apiEndpoints.getAdminDashboard);
    return response.data;
  },

  // Get pending reservations
  getPendingReservations: async () => {
    const response = await api.get(apiEndpoints.getPendingReservations);
    return response.data;
  },
};

// Organization API services
export const organizationAPI = {
  // Validate invite key
  validateInvite: async (inviteKey: string) => {
    const response = await api.post(apiEndpoints.validateInvite, { inviteKey });
    return response.data;
  },

  // Get organizations
  getOrganizations: async () => {
    const response = await api.get(apiEndpoints.getOrganizations);
    return response.data;
  },

  // Get organization statistics
  getOrganizationStats: async (orgId: string) => {
    const response = await api.get(apiEndpoints.getOrganizationStats.replace(':orgId', orgId));
    return response.data;
  },

  // Get organization users
  getOrganizationUsers: async (orgId: string, role?: string) => {
    const url = role 
      ? `${apiEndpoints.getOrganizationUsers.replace(':orgId', orgId)}?role=${role}`
      : apiEndpoints.getOrganizationUsers.replace(':orgId', orgId);
    
    const response = await api.get(url);
    return response.data;
  },
};

// Export all API services
export {
  authAPI as auth,
  roomAPI as rooms,
  reservationAPI as reservations,
  adminAPI as admin,
  organizationAPI as organizations,
};

// Default export for convenience
export default {
  auth: authAPI,
  rooms: roomAPI,
  reservations: reservationAPI,
  admin: adminAPI,
  organizations: organizationAPI,
};
