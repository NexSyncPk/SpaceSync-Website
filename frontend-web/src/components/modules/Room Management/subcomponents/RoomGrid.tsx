import React from "react";
import RoomCard from "./RoomCard";

interface Room {
  id: string;
  name: string;
  capacity: number;
  displayProjector: boolean;
  displayWhiteboard: boolean;
  cateringAvailable: boolean;
  videoConferenceAvailable: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  organizationId: string;
  Organization: {
    id: string;
    name: string;
  };
}

interface RoomGridProps {
  rooms: Room[];
  filteredRooms: Room[];
  isLoading: boolean;
  onEdit: (room: Room) => void;
  onDelete: (roomId: string) => void;
  onToggleStatus: (roomId: string) => void;
  getAmenitiesFromRoom: (room: Room) => string[];
}

const RoomGrid: React.FC<RoomGridProps> = ({
  rooms,
  filteredRooms,
  isLoading,
  onEdit,
  onDelete,
  onToggleStatus,
  getAmenitiesFromRoom,
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading rooms...</span>
      </div>
    );
  }

  if (filteredRooms.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No rooms found matching your criteria.</p>
      </div>
    );
  }

  return (
    <>
      <div>
        <h1 className="font-bold text-lg mb-4">
          Total Rooms ({rooms?.length || 0})
        </h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredRooms.map((room) => (
          <RoomCard
            key={room.id}
            room={room}
            onEdit={onEdit}
            onDelete={onDelete}
            onToggleStatus={onToggleStatus}
            getAmenitiesFromRoom={getAmenitiesFromRoom}
          />
        ))}
      </div>
    </>
  );
};

export default RoomGrid;
