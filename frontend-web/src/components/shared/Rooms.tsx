import React from "react";
import { Room } from "../../types/interfaces.js";
import { Monitor, Users, Presentation, Video, Tv, PenTool } from "lucide-react";

interface RoomProps {
  room: Room;
  onSelect?: (room: Room) => void;
  isSelected?: boolean;
}

const getResourceIcon = (resource: string) => {
  switch (resource.toLowerCase()) {
    case "projector":
      return Presentation;
    case "whiteboard":
      return PenTool;
    case "tv screen":
      return Tv;
    case "video conference":
      return Video;
    default:
      return Monitor;
  }
};

const Rooms: React.FC<RoomProps> = ({ room, onSelect, isSelected = false }) => {
  const handleSelect = (e?: React.MouseEvent | React.KeyboardEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (onSelect) {
      onSelect(room);
    }
  };

  return (
    <div className="w-full bg-white rounded-xl shadow-sm border border-gray-200 mb-4 overflow-hidden">
      {/* Room Image */}
      <div className="w-full h-48 bg-gray-100">
        <img
          src={
            room.image || "https://via.placeholder.com/300x200?text=Room+Image"
          }
          alt={room.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Room Info Section */}
      <div className="p-4">
        {/* Name, Capacity and Select Button Row */}
        <div className="flex justify-between items-start mb-3">
          {/* Left Side - Name and Capacity */}
          <div className="flex-1 mr-3">
            <h3 className="text-lg font-bold text-gray-800 mb-1">
              {room.name}
            </h3>
            <div className="flex items-center">
              <Users size={16} className="text-gray-600" />
              <span className="text-gray-600 ml-1">
                Capacity: {room.capacity} people
              </span>
            </div>
          </div>

          {/* Right Side - Select Button */}
          <button
            type="button"
            onClick={handleSelect}
            className={`px-4 py-2 rounded-lg border-2 transition-colors ${
              isSelected
                ? "bg-blue-50 border-blue-500 text-blue-600"
                : "bg-white border-gray-300 text-gray-600 hover:border-blue-300"
            }`}
          >
            <div className="flex items-center">
              {isSelected && (
                <svg
                  className="w-4 h-4 mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
              <span className="font-medium">
                {isSelected ? "Selected" : "Select"}
              </span>
            </div>
          </button>
        </div>

        {/* Resources Section */}
        <div>
          <p className="text-sm font-semibold text-gray-700 mb-2">
            Available Resources:
          </p>

          {room.resources && room.resources.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {room.resources.map((resource, index) => {
                const IconComponent = getResourceIcon(resource);
                return (
                  <div
                    key={index}
                    className="bg-gray-100 rounded-full px-3 py-1 flex items-center"
                  >
                    <IconComponent size={14} className="text-blue-600 mr-1" />
                    <span className="text-sm text-gray-700">{resource}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-gray-500 italic">
              No special resources available
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Rooms;
