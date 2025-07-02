import { Room, Booking } from "../types/interfaces.js";

export const mockRooms: Room[] = [
  {
    id: 1,
    name: "Conference Room A",
    capacity: 12,
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=500&h=300&fit=crop",
    resources: ["Projector", "Whiteboard", "Video Conference"]
  },
  {
    id: 2,
    name: "Executive Boardroom",
    capacity: 8,
    image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=500&h=300&fit=crop",
    resources: ["TV Screen", "Video Conference"]
  },
  {
    id: 3,
    name: "Creative Studio",
    capacity: 6,
    image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=500&h=300&fit=crop",
    resources: ["Whiteboard", "Projector"]
  },
  {
    id: 4,
    name: "Small Meeting Room",
    capacity: 4,
    image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=500&h=300&fit=crop",
    resources: ["TV Screen"]
  }
];

export const pastBookings: Booking[] = [
  {
    id: 1,
    title: "Meeting with John",
    date: "2023-10-01",
    time: "10:00 - 11:00 AM",
    room: "Conference Room A",
    status: "completed",
  },
  {
    id: 2,
    title: "Project Review",
    date: "2023-09-15",
    time: "2:00 - 3:30 PM",
    room: "Meeting Room 2",
    status: "completed",
  },
];

export const upcomingBookings: Booking[] = [
  {
    id: 3,
    title: "Team Standup",
    date: "2025-07-05",
    time: "9:00 - 9:30 AM",
    room: "Conference Room A",
    status: "approved",
  },
  {
    id: 4,
    title: "Client Presentation",
    date: "2025-07-08",
    time: "2:00 - 4:00 PM",
    room: "Executive Boardroom",
    status: "pending",
  },
  {
    id: 5,
    title: "Design Review",
    date: "2025-07-10",
    time: "11:00 - 12:00 PM",
    room: "Creative Studio",
    status: "pending",
  },
  {
    id: 6,
    title: "Board Meeting",
    date: "2025-07-15",
    time: "10:00 - 12:00 PM",
    room: "Executive Boardroom",
    status: "approved",
  },
  {
    id: 7,
    title: "Onboarding Session",
    date: "2025-07-15",
    time: "11:00 - 12:00 PM",
    room: "Executive Boardroom",
    status: "approved",
  },
];


// Mock data for available rooms - replace with API call later
export const mockAvailableRooms: Room[] = [
  {
    id: 1,
    name: "Conference Room A",
    time: "10:00 - 11:00 AM",
    capacity: 12,
    image:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=200&h=200&fit=crop",
    status: "available",
    resources: ["Projector", "Whiteboard", "Video Conference"],
  },
  {
    id: 2,
    name: "Executive Boardroom",
    time: "2:00 - 3:30 PM",
    capacity: 8,
    image:
      "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=200&fit=crop",
    status: "available",
    resources: ["TV Screen", "Video Conference"],
  },
  {
    id: 3,
    name: "Creative Studio",
    time: "4:00 - 5:00 PM",
    capacity: 6,
    image:
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=200&h=200&fit=crop",
    status: "available",
    resources: ["Whiteboard", "Projector"],
  },
];