import { useState, useEffect } from "react";
import { mockRooms } from "../utils/mockData";

export function useReqAndRoom(initialRequirements: string[] = [], initialAttendees: number = 1, initialRoomId?: number) {
  const [requirements, setRequirements] = useState<string[]>(initialRequirements);
  const [numberOfAttendees, setNumberOfAttendees] = useState<number>(initialAttendees);
  const [filteredRooms, setFilteredRooms] = useState(mockRooms);
  const [selectedRoom, setSelectedRoom] = useState(
    initialRoomId ? mockRooms.find((room) => room.id === initialRoomId) || null : null
  );

  // Room filtering logic
  useEffect(() => {
    let filtered = mockRooms.filter((room) => room.capacity >= numberOfAttendees);
    if (requirements.length > 0) {
      filtered = filtered.filter((room) =>
        requirements.every((req) => room.resources.includes(req))
      );
    }
    setFilteredRooms(filtered);
    if (selectedRoom && !filtered.some((room) => room.id === selectedRoom.id)) {
      setSelectedRoom(null);
    }
    // eslint-disable-next-line
  }, [requirements, numberOfAttendees]);

  // Requirement toggle
  const handleRequirementToggle = (requirement: string) => {
    setRequirements((prev) =>
      prev.includes(requirement)
        ? prev.filter((req) => req !== requirement)
        : [...prev, requirement]
    );
  };

  // Attendees change
  const handleAttendeesChange = (newCount: number) => {
    if (newCount >= 1) {
      setNumberOfAttendees(newCount);
    }
  };

  // Room select
  const handleRoomSelect = (room: any) => {
    setSelectedRoom(selectedRoom?.id === room.id ? null : room);
  };

  return {
    requirements,
    setRequirements,
    numberOfAttendees,
    setNumberOfAttendees,
    filteredRooms,
    selectedRoom,
    setSelectedRoom,
    handleRequirementToggle,
    handleAttendeesChange,
    handleRoomSelect,
  };
}
