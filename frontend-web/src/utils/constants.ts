// Route constants for the application
export const routes = {
  // Public routes
  login: '/login',
  signup: '/signup',
  
  // Protected user routes
  home: '/',
  dashboard: '/',
  bookings: '/bookings',
  calendar: '/calendar',
  profile: '/profile',
  
  // Admin routes
  admin: '/admin',
  adminDashboard: '/admin/dashboard',
  adminRooms: '/admin/rooms',
  adminBookings: '/admin/bookings',
  adminUsers: '/admin/users',
} as const;

// API endpoints
export const apiEndpoints = {
  // Auth endpoints
  register: '/user/register',
  login: '/user/login',
  profile: '/user/profile',
  
  // User endpoints
  createOrganization: '/user/organization',
  joinOrganization: '/user/organization/join',
  
  // Organization endpoints
  validateInvite: '/organization/validate-invite',
  getOrganizations: '/organization',
  getOrganizationStats: '/organization/:orgId/stats',
  getOrganizationUsers: '/organization/:orgId/users',
  
  // Room endpoints
  getAllRooms: '/rooms',
  createRoom: '/rooms',
  getRoomById: '/rooms/:roomId',
  updateRoom: '/rooms/:roomId',
  deleteRoom: '/rooms/:roomId',
  searchRooms: '/rooms/search',
  getRoomStatuses: '/rooms/statuses',
  getRoomAvailability: '/rooms/:roomId/availability',
  
  // Reservation endpoints
  getAllReservations: '/reservations',
  createReservation: '/reservations',
  getMyReservations: '/reservations/my',
  getUpcomingReservations: '/reservations/upcoming',
  getReservationById: '/reservations/:reservationId',
  updateReservation: '/reservations/:reservationId',
  deleteReservation: '/reservations/:reservationId',
  updateReservationStatus: '/reservations/:reservationId/status',
  
  // Admin endpoints
  getAllUsers: '/admin/users',
  promoteUser: '/admin/users/:userId/promote',
  demoteUser: '/admin/users/:userId/demote',
  removeUser: '/admin/users/:userId',
  getUserStats: '/admin/users/stats',
  getAdminDashboard: '/admin/dashboard',
  getPendingReservations: '/admin/reservations/pending',
} as const;

// Response status codes
export const statusCodes = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  VALIDATION_ERROR: 422,
  INTERNAL_SERVER_ERROR: 500,
} as const;

// User roles
export const userRoles = {
  ADMIN: 'admin',
  EMPLOYEE: 'employee', 
  UNASSIGNED: 'unassigned',
} as const;

// Room amenities
export const roomAmenities = {
  PROJECTOR: 'displayProjector',
  WHITEBOARD: 'displayWhiteboard',
  CATERING: 'cateringAvailable',
  VIDEO_CONFERENCE: 'videoConferenceAvailable',
} as const;

// Reservation statuses
export const reservationStatuses = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
} as const;
