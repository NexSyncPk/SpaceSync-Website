import { useState, useEffect, useCallback, useRef } from "react";
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
  
  // Prevent multiple simultaneous requests
  const isFetchingRef = useRef(false);
  const lastFetchedOrgRef = useRef<string | null>(null);
  
  // Get organization state to trigger refresh when it changes
  const organizationId = useSelector((state: any) => state.auth.user?.organizationId);
  const organizationState = useSelector((state: any) => state.organization.current);

  // Fetch Rooms from API with protection against multiple calls
  const fetchRooms = useCallback(async (force = false) => {
    // Prevent concurrent requests
    if (isFetchingRef.current && !force) {
      console.log("⏳ Room fetch already in progress, skipping...");
      return;
    }

    // Check if we already fetched for this organization
    if (!force && lastFetchedOrgRef.current === organizationId) {
      console.log("🎯 Already fetched rooms for this organization, skipping...");
      return;
    }

    try {
      isFetchingRef.current = true;
      setIsLoading(true);
      setError(null);
      
      console.log("🔄 Fetching rooms from API for org:", organizationId);
      const response = await getAllRooms();
      
      if (response && response.data) {
        console.log("✅ Rooms API Response:", response.data.length, "rooms");
        // Transform server room data to include resources array
        const transformedRooms = response.data.map(transformRoomData);
        setRooms(transformedRooms);
        lastFetchedOrgRef.current = organizationId;
        console.log("📦 Cached rooms for organization:", organizationId);
      } else {
        // If no data, set empty array
        setRooms([]);
        console.log("❌ No rooms data received from API");
      }
    } catch (error) {
      console.log("❌ Error fetching rooms:", error);
      setError("Failed to load rooms. Please try again.");
      setRooms([]);
    } finally {
      setIsLoading(false);
      isFetchingRef.current = false;
    }
  }, [organizationId]);

  // Initial fetch on mount
  useEffect(() => {
    if (organizationId) {
      console.log("🚀 Initial fetch for organization:", organizationId);
      fetchRooms();
    }
  }, [fetchRooms, organizationId]);

  // Only refresh if organization actually changed (not just state updates)
  useEffect(() => {
    if (organizationId && organizationState?.id && organizationId !== lastFetchedOrgRef.current) {
      console.log("🔄 Organization changed from", lastFetchedOrgRef.current, "to", organizationId);
      fetchRooms();
    }
  }, [organizationId, organizationState?.id, fetchRooms]);

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
    refetchRooms: () => fetchRooms(true), // Force refresh option
  };
}