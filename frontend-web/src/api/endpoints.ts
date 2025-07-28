// SpaceSync API Endpoints
// Based on the backend server routes structure

// Base API configuration
export const API_BASE_URL = "/api";

// Health Check
export const HEALTH = "/health";

// ==================== USER ROUTES ====================
// Authentication endpoints
export const USER_REGISTER = "/user/register";
export const USER_LOGIN = "/user/login";

// User profile and management
export const USER_PROFILE = "/user/profile";
export const USER_CURRENT_PROFILE = "/user/current";
export const USER_BY_ID = (userId: string) => `/user/${userId}`;
export const USER_UPDATE = (userId: string) => `/user/${userId}`;

// Organization management for users
export const USER_CREATE_ORGANIZATION = "/user/organization";
export const USER_JOIN_ORGANIZATION = "/user/organization/join";

// ==================== ORGANIZATION ROUTES ====================
// Public organization endpoints
export const ORGANIZATION_VALIDATE_INVITE = "/organization/validate-invite";

// Organization CRUD
export const ORGANIZATIONS = "/organization";
export const ORGANIZATION_BY_ID = (orgId: string) => `/organization/${orgId}`;
export const ORGANIZATION_UPDATE = (orgId: string) => `/organization/${orgId}`;
export const ORGANIZATION_DELETE = (orgId: string) => `/organization/${orgId}`;

// Organization statistics and data
export const ORGANIZATION_STATS = (orgId: string) =>
  `/organization/${orgId}/stats`;
export const ORGANIZATION_USERS = (orgId: string) =>
  `/organization/${orgId}/users`;

// Organization invite management
export const ORGANIZATION_INVITE_KEY = (orgId: string) =>
  `/organization/${orgId}/invite-key`;
export const ORGANIZATION_REGENERATE_INVITE = (orgId: string) =>
  `/organization/${orgId}/regenerate-invite`;

// ==================== ROOM ROUTES ====================
// Room CRUD operations
export const ROOMS = "/rooms";
export const ROOM_BY_ID = (roomId: string) => `/rooms/${roomId}`;
export const ROOM_UPDATE = (roomId: string) => `/rooms/${roomId}`;
export const ROOM_DELETE = (roomId: string) => `/rooms/${roomId}`;
export const ACTIVE_ROOMS = "/rooms?isActive=true";
export const CREATE_ROOM = "/rooms";
export const DELETE_ROOM = (roomId: string) => `/rooms/${roomId}`;

// Room search and filtering
export const ROOMS_SEARCH = "/rooms/search";
export const ROOMS_STATUSES = "/rooms/statuses";

// Room availability and statistics
export const ROOM_AVAILABILITY = (roomId: string) =>
  `/rooms/${roomId}/availability`;
export const ROOM_STATS = (roomId: string) => `/rooms/${roomId}/stats`;
export const ROOM_STATUS = (roomId: string) => `/rooms/${roomId}/status`;

// Organization-specific room routes
export const ORG_ROOMS = (orgId: string) => `/organization/${orgId}/rooms`;
export const ORG_ROOM_BY_ID = (orgId: string, roomId: string) =>
  `/organization/${orgId}/rooms/${roomId}`;

// ==================== RESERVATION ROUTES ====================
// Reservation CRUD operations
export const RESERVATIONS = "/reservations";
export const RESERVATION_BY_ID = (reservationId: string) =>
  `/reservations/${reservationId}`;
export const RESERVATION_UPDATE = (reservationId: string) =>
  `/reservations/${reservationId}`;
export const RESERVATION_DELETE = (reservationId: string) =>
  `/reservations/${reservationId}`;

// Reservation queries
export const RESERVATIONS_MY = "/reservations/my";
export const RESERVATIONS_UPCOMING = "/reservations/upcoming";

// Reservation status management
export const RESERVATION_STATUS_UPDATE = (reservationId: string) =>
  `/reservations/${reservationId}/status`;

// Room-specific reservations
export const ROOM_RESERVATIONS = (roomId: string) =>
  `/rooms/${roomId}/reservations`;

// ==================== ADMIN ROUTES ====================
// User management (admin only)
export const ADMIN_USERS = "/admin/users";
export const ADMIN_USER_PROMOTE = (userId: string) =>
  `/admin/users/${userId}/promote`;
export const ADMIN_USER_DEMOTE = (userId: string) =>
  `/admin/users/${userId}/demote`;
export const ADMIN_USER_REMOVE = (userId: string) => `/admin/users/${userId}`;
export const ADMIN_USER_UPDATE_PROFILE = (userId: string) =>
  `/admin/users/${userId}/profile`;

// Admin statistics and analytics
export const ADMIN_USER_STATS = "/admin/users/stats";
export const ADMIN_DASHBOARD = "/admin/dashboard";

// Admin reservation management
export const ADMIN_RESERVATIONS_PENDING = "/admin/reservations/pending";

// ==================== EXTERNAL ATTENDEES ROUTES ====================
// External attendee management
export const EXTERNAL_ATTENDEES = "/external-attendees";
export const EXTERNAL_ATTENDEE_BY_ID = (attendeeId: string) =>
  `/external-attendees/${attendeeId}`;
export const EXTERNAL_ATTENDEE_UPDATE = (attendeeId: string) =>
  `/external-attendees/${attendeeId}`;
export const EXTERNAL_ATTENDEE_DELETE = (attendeeId: string) =>
  `/external-attendees/${attendeeId}`;

// Reservation-specific external attendees
export const RESERVATION_ATTENDEES = (reservationId: string) =>
  `/reservations/${reservationId}/attendees`;
export const RESERVATION_ATTENDEE_BY_ID = (
  reservationId: string,
  attendeeId: string
) => `/reservations/${reservationId}/attendees/${attendeeId}`;

// Notificaiton
export const GET_NOTIFICATIONS = "/notifications";
export const MARK_NOTIFICATION_READ = (notificationId: string) =>
  `/notifications/${notificationId}/read`;
export const MARK_ALL_NOTIFICATIONS_READ = "/notifications/mark-all-read";

// ==================== HELPER FUNCTIONS ====================
// Utility functions for building URLs with query parameters
export const buildUrl = (
  endpoint: string,
  params?: Record<string, string | number | boolean>
) => {
  if (!params) return endpoint;

  const queryString = Object.entries(params)
    .filter(([_, value]) => value !== undefined && value !== null)
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
    )
    .join("&");

  return queryString ? `${endpoint}?${queryString}` : endpoint;
};

// Common query parameter builders
export const withPagination = (page?: number, limit?: number) => ({
  ...(page && { page }),
  ...(limit && { limit }),
});

export const withDateRange = (startDate?: string, endDate?: string) => ({
  ...(startDate && { startDate }),
  ...(endDate && { endDate }),
});

export const withFilters = (filters: Record<string, any>) => {
  return Object.entries(filters).reduce((acc, [key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      acc[key] = value;
    }
    return acc;
  }, {} as Record<string, any>);
};

// ==================== EXAMPLE USAGE ====================
// Examples of how to use these endpoints:

// Simple endpoint usage:
// const response = await api.get(USER_PROFILE);

// With path parameters:
// const response = await api.get(ROOM_BY_ID('room-uuid-123'));

// With query parameters:
// const url = buildUrl(ROOMS_SEARCH, { capacity: 10, displayProjector: true });
// const response = await api.get(url);

// With date filters:
// const url = buildUrl(RESERVATIONS, withDateRange('2025-07-01', '2025-07-31'));
// const response = await api.get(url);

// With pagination:
// const url = buildUrl(ADMIN_USERS, withPagination(1, 20));
// const response = await api.get(url);

export default {
  // Re-export all endpoints as default export for convenience
  USER_REGISTER,
  USER_LOGIN,
  USER_PROFILE,
  USER_BY_ID,
  USER_CREATE_ORGANIZATION,
  USER_JOIN_ORGANIZATION,

  ORGANIZATION_VALIDATE_INVITE,
  ORGANIZATIONS,
  ORGANIZATION_BY_ID,
  ORGANIZATION_STATS,
  ORGANIZATION_USERS,

  ROOMS,
  ROOM_BY_ID,
  ROOMS_SEARCH,
  ROOMS_STATUSES,
  ROOM_AVAILABILITY,

  RESERVATIONS,
  RESERVATION_BY_ID,
  RESERVATIONS_MY,
  RESERVATIONS_UPCOMING,

  ADMIN_USERS,
  ADMIN_USER_PROMOTE,
  ADMIN_USER_DEMOTE,
  ADMIN_DASHBOARD,

  buildUrl,
  withPagination,
  withDateRange,
  withFilters,
};
