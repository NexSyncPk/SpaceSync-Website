import { meetingRequestSchema } from "@/schema/validationSchemas.js";
import { Room, Booking, MeetingRequestData } from "../types/interfaces.js";
import { z } from "zod";

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

export const pastBookings: z.infer<typeof meetingRequestSchema>[] = [
  {
    id: 1,
    meetingTitle: "Meeting with John",
    name: "Alice Johnson",
    department: "Engineering",
    teamAgenda: "Discuss project progress",
    startTime: "10:00",
    endTime: "11:00",
    numberOfAttendees: 5,
    meetingType: "internal",
    requirements: ["Projector"],
    roomId: 1,
    status: "completed",
  },
  {
    id: 2,
    meetingTitle: "Project Review",
    name: "Bob Smith",
    department: "Product",
    teamAgenda: "Review quarterly milestones and future planning",
    startTime: "14:00",
    endTime: "15:30",
    numberOfAttendees: 8,
    meetingType: "external",
    requirements: ["TV Screen", "Video Conference"],
    roomId: 2,
    status: "completed",
  },
  {
    id: 3,
    meetingTitle: "Design Sync",
    name: "Carol Lee",
    department: "Design",
    teamAgenda: "Sync on new branding assets",
    startTime: "09:00",
    endTime: "10:00",
    numberOfAttendees: 4,
    meetingType: "internal",
    requirements: ["Whiteboard"],
    roomId: 3,
    status: "completed",
  },
  {
    id: 4,
    meetingTitle: "Client Demo",
    name: "David Kim",
    department: "Sales",
    teamAgenda: "Demo new features to client",
    startTime: "16:00",
    endTime: "17:00",
    numberOfAttendees: 6,
    meetingType: "external",
    requirements: ["Projector", "Video Conference"],
    roomId: 1,
    status: "cancelled",
  },
];

export const upcomingBookings: z.infer<typeof meetingRequestSchema>[] = [
  {
    id: 5,
    meetingTitle: "Team Standup",
    name: "Clara Green",
    department: "Development",
    teamAgenda: "Daily team updates and blockers discussion",
    startTime: "09:00",
    endTime: "09:30",
    numberOfAttendees: 10,
    meetingType: "internal",
    requirements: ["Projector", "Whiteboard"],
    roomId: 1,
    status: "pending",
  },
  {
    id: 6,
    meetingTitle: "Client Presentation",
    name: "Daniel Kim",
    department: "Sales",
    teamAgenda: "Present new feature roadmap to the client",
    startTime: "14:00",
    endTime: "16:00",
    numberOfAttendees: 6,
    meetingType: "external",
    requirements: ["TV Screen"],
    roomId: 2,
    status: "pending",
  },
  {
    id: 7,
    meetingTitle: "Design Review",
    name: "Eva Brown",
    department: "Design",
    teamAgenda: "Finalize UI/UX elements for launch",
    startTime: "11:00",
    endTime: "12:00",
    numberOfAttendees: 4,
    meetingType: "internal",
    requirements: ["Whiteboard"],
    roomId: 3,
    status: "approved",
  },
  {
    id: 8,
    meetingTitle: "Board Meeting",
    name: "Frank Lee",
    department: "Executive",
    teamAgenda: "Quarterly performance review and planning",
    startTime: "10:00",
    endTime: "12:00",
    numberOfAttendees: 12,
    meetingType: "internal",
    requirements: ["Projector", "Video Conference"],
    roomId: 1,
    status: "pending",
  },
  {
    id: 9,
    meetingTitle: "Onboarding Session",
    name: "Grace Miller",
    department: "HR",
    teamAgenda: "Welcome new team members and introduce policies",
    startTime: "11:00",
    endTime: "12:00",
    numberOfAttendees: 3,
    meetingType: "internal",
    requirements: ["Whiteboard"],
    roomId: 3,
    status: "pending",
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