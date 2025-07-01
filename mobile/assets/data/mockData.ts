import { Room } from "../interfaces/interfaces";

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
