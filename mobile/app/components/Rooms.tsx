import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { Room } from "@/assets/interfaces/interfaces";
import { Ionicons } from "@expo/vector-icons";

interface RoomProps {
  room: Room;
  onSelect?: (room: Room) => void;
  isSelected?: boolean;
}

const Rooms = ({ room, onSelect, isSelected = false }: RoomProps) => {
  const handleSelect = () => {
    if (onSelect) {
      onSelect(room);
    }
  };

  return (
    <View className="w-full bg-white rounded-xl shadow-sm border border-gray-200 mb-4 overflow-hidden">
      {/* Room Image */}
      <View className="w-full h-48 bg-gray-100">
        <Image
          source={{
            uri:
              room.image ||
              "https://via.placeholder.com/300x200?text=Room+Image",
          }}
          className="w-full h-full"
          resizeMode="cover"
        />
      </View>

      {/* Room Info Section */}
      <View className="p-4">
        {/* Name, Capacity and Select Button Row */}
        <View className="flex-row justify-between items-start mb-3">
          {/* Left Side - Name and Capacity */}
          <View className="flex-1 mr-3">
            <Text className="text-lg font-bold text-gray-800 mb-1">
              {room.name}
            </Text>
            <View className="flex-row items-center">
              <Ionicons name="people-outline" size={16} color="#666" />
              <Text className="text-gray-600 ml-1">
                Capacity: {room.capacity} people
              </Text>
            </View>
          </View>

          {/* Right Side - Select Button */}
          <TouchableOpacity
            onPress={handleSelect}
            className={`px-4 py-2 rounded-lg border-2 ${
              isSelected
                ? "bg-blue-50 border-blue-500"
                : "bg-white border-gray-300"
            }`}
          >
            <View className="flex-row items-center">
              {isSelected && (
                <Ionicons name="checkmark" size={16} color="#1565C0" />
              )}
              <Text
                className={`ml-1 font-medium ${
                  isSelected ? "text-blue-600" : "text-gray-600"
                }`}
              >
                {isSelected ? "Selected" : "Select"}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Resources Section */}
        <View>
          <Text className="text-sm font-semibold text-gray-700 mb-2">
            Available Resources:
          </Text>

          {room.resources && room.resources.length > 0 ? (
            <View className="flex-row flex-wrap">
              {room.resources.map((resource, index) => (
                <View
                  key={index}
                  className="bg-gray-100 rounded-full px-3 py-1 mr-2 mb-2 flex-row items-center"
                >
                  <Ionicons
                    name={getResourceIcon(resource)}
                    size={14}
                    color="#1565C0"
                  />
                  <Text className="text-sm text-gray-700 ml-1">{resource}</Text>
                </View>
              ))}
            </View>
          ) : (
            <Text className="text-sm text-gray-500 italic">
              No special resources available
            </Text>
          )}
        </View>
      </View>
    </View>
  );
};

// Helper function to get appropriate icon for each resource
const getResourceIcon = (resource: string): any => {
  const resourceLower = resource.toLowerCase();

  if (resourceLower.includes("projector")) return "share-social-outline";
  if (resourceLower.includes("whiteboard")) return "create-outline";
  if (resourceLower.includes("tv") || resourceLower.includes("screen"))
    return "tv-outline";
  if (resourceLower.includes("video") || resourceLower.includes("conference"))
    return "videocam-outline";

  return "checkmark-circle-outline"; // Default icon
};

export default Rooms;
