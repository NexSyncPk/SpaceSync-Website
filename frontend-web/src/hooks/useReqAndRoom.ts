import { useState, useEffect } from "react";
import { transformRoomData } from "../utils/mockData";
import { getAllRooms } from "../api/services/index";
import { Room } from "../types/interfaces";
import { useSelector } from "react-redux";

export function useReqAndRoom(initialRequirements: string[] = [], initialAttendees: number = 1, initialRoomId?: string) {
  const [requirements, setRequirements] = useState<string[]>(initialRequirements);
  const [numberOfAttendees, setNumberOfAttendees] = useState<number>(initialAttendees);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [filteredRooms, setFilteredRooms] = useState<Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Get organization state to trigger refresh when it changes
  const organizationId = useSelector((state: any) => state.auth.user?.organizationId);
  const organizationState = useSelector((state: any) => state.organization.current);

  // Fetch Rooms from API
  const fetchRooms = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getAllRooms();
      if (response && response.data) {
        console.log("API Response:", response.data);
        // Transform server room data to include resources array
        const transformedRooms = response.data.map(transformRoomData);
        setRooms(transformedRooms);
        console.log("Transformed rooms:", transformedRooms);
      } else {
        // If no data, set empty array
        setRooms([]);
        console.log("No rooms data received from API");
      }
    } catch (error) {
      console.log("Error fetching rooms:", error);
      setError("Failed to load rooms. Please try again.");
      // Do not fallback to mock data - show empty array
      setRooms([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  // Refresh rooms when organization changes (user joins/creates organization)
  useEffect(() => {
    if (organizationId && organizationState) {
      console.log("Organization changed, refreshing rooms...");
      fetchRooms();
    }
  }, [organizationId, organizationState?.id]);

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
    error,
    handleRequirementToggle,
    handleAttendeesChange,
    handleRoomSelect,
    refetchRooms: fetchRooms,
  };
}
