export interface Room {
  id: string;
  name: string;
  capacity: number;
  time?: string;
  status?: 'available' | 'booked';
  image?: string;
  displayProjector: boolean;
  displayWhiteboard: boolean;
  cateringAvailable: boolean;
  videoConferenceAvailable: boolean;
  createdAt: string;
  updatedAt: string;
  organizationId: string;
  Organization: {
    id: string;
    name: string;
  };
  // Computed property for backward compatibility
  resources?: string[];
}

export interface Booking {
  id: number;
  meetingTitle: string;
  name: string;
  department: string;
  teamAgenda: string;
  startTime: string;
  endTime: string;
  numberOfAttendees: number;
  meetingType: 'internal' | 'external';
  requirements: string[];
  roomId: string; // Changed from number to string
  status: 'pending' | 'approved' | 'completed' | 'cancelled';
  createdBy?: string; // Make this optional since mock data doesn't include it
}

// Authentication interfaces
export interface User {
  id: string | number;
  name: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  role?: 'admin' | 'user' | 'manager';
  createdAt?: string;
  updatedAt?: string;
  organizationId: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  canCreateOrganization: boolean | null;
  canJoinOrganization: boolean | null;
}

// Form data interfaces
export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  name: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  message: string;
}

// Meeting Request Form interface
export interface MeetingRequestData {
  meetingTitle: string;
  name: string;
  department: string;
  teamAgenda: string;
  startTime: string;
  endTime: string;
  numberOfAttendees: number;
  meetingType: 'internal' | 'external';
  requirements: string[];
  roomId: string; // Changed from number to string
  status?: 'pending' | 'approved' | 'completed' | 'cancelled';
}
