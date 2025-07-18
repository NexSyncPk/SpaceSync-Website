import React from "react";
import { Users, Building, Edit, Trash2, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";

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

interface RoomCardProps {
  room: Room;
  onEdit: (room: Room) => void;
  onDelete: (roomId: string) => void;
  onToggleStatus: (roomId: string) => void;
  getAmenitiesFromRoom: (room: Room) => string[];
}

const RoomCard: React.FC<RoomCardProps> = ({
  room,
  onEdit,
  onDelete,
  onToggleStatus,
  getAmenitiesFromRoom,
}) => {
  const amenities = getAmenitiesFromRoom(room);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{room.name}</h3>
            <div className="flex items-center text-sm text-gray-600 mt-1">
              <Building size={14} className="mr-1" />
              {room.Organization.name}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`px-2 py-1 text-xs font-medium rounded-full ${
                room.isActive
                  ? "bg-green-100 text-green-600"
                  : "bg-red-100 text-red-600"
              }`}
            >
              {room.isActive ? "Active" : "Inactive"}
            </span>
            <div className="relative">
              <button className="p-1 text-gray-400 hover:text-gray-600">
                <MoreVertical size={16} />
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-600">
              <Users size={14} className="mr-1" />
              Capacity: {room.capacity}
            </div>
            <span className="text-sm text-gray-600">
              Created: {new Date(room.createdAt).toLocaleDateString()}
            </span>
          </div>

          <div className="flex flex-wrap gap-1">
            {amenities.length > 0 ? (
              <>
                {amenities.slice(0, 3).map((amenity, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded"
                  >
                    {amenity}
                  </span>
                ))}
                {amenities.length > 3 && (
                  <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded ">
                    +{amenities.length - 3} more
                  </span>
                )}
              </>
            ) : (
              <span className="px-2 py-1 text-xs bg-gray-100 text-gray-500 rounded">
                No amenities
              </span>
            )}
          </div>
        </div>

        <div className="flex gap-2 mt-4 pt-4 border-t border-gray-200">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onEdit(room)}
            className="flex-1"
          >
            <Edit size={14} className="mr-1" />
            Edit
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onToggleStatus(room.id)}
            className="flex-1"
          >
            {room.isActive ? "Deactivate" : "Activate"}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onDelete(room.id)}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 size={14} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RoomCard;
