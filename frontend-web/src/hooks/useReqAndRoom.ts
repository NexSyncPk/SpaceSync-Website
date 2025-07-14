import { useState, useEffect } from "react";
import { mockRooms, transformRoomData } from "../utils/mockData";
import { getAllRooms } from "../api/services/index";
import { Room } from "../types/interfaces";

export function useReqAndRoom(initialRequirements: string[] = [], initialAttendees: number = 1, initialRoomId?: string) {
  const [requirements, setRequirements] = useState<string[]>(initialRequirements);
  const [numberOfAttendees, setNumberOfAttendees] = useState<number>(initialAttendees);
  const [rooms, setRooms] = useState<Room[]>(mockRooms);
  const [filteredRooms, setFilteredRooms] = useState<Room[]>(mockRooms);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(
    initialRoomId ? mockRooms.find((room) => room.id === initialRoomId) || null : null
  );
  const [isLoading, setIsLoading] = useState(false);

  // Fetch Rooms from API
  const fetchRooms = async () => {
    try {
      setIsLoading(true);
      const response = await getAllRooms();
      if (response && response.data) {
        console.log("API Response:", response.data);
        // Transform server room data to include resources array
        const transformedRooms = response.data.map(transformRoomData);
        setRooms(transformedRooms);
        console.log("Transformed rooms:", transformedRooms);
      }
    } catch (error) {
      console.log("Error fetching rooms:", error);
      // Fallback to mock data
      setRooms(mockRooms);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  // Room filtering logic
  useEffect(() => {
    let filtered = rooms.filter((room) => room.capacity >= numberOfAttendees);
    if (requirements.length > 0) {
      filtered = filtered.filter((room) =>
        requirements.every((req) => room.resources?.includes(req))
      );
    }
    setFilteredRooms(filtered);
    
    // Reset selected room if it's no longer in filtered results
    if (selectedRoom && !filtered.some((room) => room.id === selectedRoom.id)) {
      setSelectedRoom(null);
    }
  }, [requirements, numberOfAttendees, rooms, selectedRoom]);

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
  const handleRoomSelect = (room: Room) => {
    setSelectedRoom(selectedRoom?.id === room.id ? null : room);
  };

  return {
    requirements,
    setRequirements,
    numberOfAttendees,
    setNumberOfAttendees,
    rooms,
    filteredRooms,
    selectedRoom,
    setSelectedRoom,
    isLoading,
    handleRequirementToggle,
    handleAttendeesChange,
    handleRoomSelect,
    refetchRooms: fetchRooms,
  };
}
