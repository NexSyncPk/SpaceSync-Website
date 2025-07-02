export interface Room {
  id: number ;
  name: string;
  capacity: number;
    time?: string;
    status?: 'available' | 'booked' ;
  image: string;
  resources: string[];
}

export interface Booking {
  id: number;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  time: string; // Keep for backward compatibility
  room: string;
  status: 'pending' | 'approved' | 'completed' | 'cancelled';
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
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
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
  selectedRoom: Room | null;
}
