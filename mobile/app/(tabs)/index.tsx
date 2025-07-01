import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import React, { useState } from "react";
import SafeScreen from "../components/SafeScreen";
import { Ionicons } from "@expo/vector-icons";
import Rooms from "../components/Rooms";
import { mockRooms } from "../../assets/data/mockData";
import { Room } from "../../assets/interfaces/interfaces";

const mockRequiremnts: {
  iconName: React.ComponentProps<typeof Ionicons>["name"];
  resource: string;
}[] = [
  { iconName: "share-social-outline", resource: "Projector" },
  { iconName: "create-outline", resource: "Whiteboard" },
  { iconName: "tv-outline", resource: "TV Screen" },
  { iconName: "videocam-outline", resource: "Video conference" },
];

type MeetingRequirementsViewProps = {
  iconName: React.ComponentProps<typeof Ionicons>["name"];
  resource: string;
  isSelected: boolean;
  onPress: () => void;
};

const MeetingRequirementsView = ({
  iconName,
  resource,
  isSelected,
  onPress,
}: MeetingRequirementsViewProps) => {
  return (
    <TouchableOpacity onPress={onPress} className="flex">
      <View
        className={`border-2 flex flex-col h-16 items-center justify-center gap-y-1 rounded-lg px-2 relative ${
          isSelected
            ? "border-secondary bg-blue-50"
            : "border-gray-300 bg-white"
        }`}
      >
        {/* Checkmark in top-right corner */}
        {isSelected && (
          <View className="absolute top-1 right-1">
            <Ionicons name="checkmark-circle" size={16} color="#1565C0" />
          </View>
        )}

        {/* Icon */}
        <Ionicons
          name={iconName}
          size={20}
          color={isSelected ? "#1565C0" : "#666"}
        />

        {/* Text */}
        <Text
          className={`text-center text-sm leading-3 ${
            isSelected ? "text-secondary font-medium" : "text-gray-700"
          }`}
          numberOfLines={2}
        >
          {resource}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const index = () => {
  const [noOfAttendess, setNoAttendees] = useState<number>(1);
  const [selectedRequirements, setSelectedRequirements] = useState<string[]>(
    []
  );
  const [meetingType, setMeetingType] = useState<string>("internal");
  const [name, setName] = useState<string>("");
  const [department, setDepartment] = useState<string>("");
  const [teamAgenda, setTeamAgenda] = useState<string>("");
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  const toggleRequirement = (requirement: string) => {
    setSelectedRequirements((prev) => {
      if (prev.includes(requirement)) {
        // Remove if already selected
        return prev.filter((req) => req !== requirement);
      } else {
        // Add if not selected
        return [...prev, requirement];
      }
    });
  };

  const handleSubmit = () => {
    const meetingData = {
      numberOfAttendees: noOfAttendess,
      requirements: selectedRequirements,
      meetingType,
      name,
      department,
      teamAgenda,
      selectedRoom: selectedRoom,
    };
    console.log("Meeting Data:", meetingData);
    // Here you can submit the data to your API or handle it as needed
  };

  return (
    <SafeScreen statusBarColor="text-secondary" statusBarStyle="light-content">
      <View className="w-full h-full flex bg-white">
        {/* <Text>index</Text> */}
        <ScrollView
          className="w-full h-full"
          contentContainerStyle={{ padding: 0, paddingBottom: 50 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="w-full h-fit p-4">
            {/* No Of Attendes */}
            <Text className="text-secondary font-semibold text-lg">
              New Meeting Request
            </Text>
            <View>
              <Text className="font-semibold mt-2">Number of Attendees</Text>
              <View className="w-full h-fit flex-row items-center gap-x-3 my-2">
                <Ionicons
                  name="remove-circle-outline"
                  size={30}
                  color={"#1565C0"}
                  onPress={() => {
                    if (noOfAttendess > 1) {
                      setNoAttendees((prev) => prev - 1);
                    } else {
                      return;
                    }
                  }}
                />
                <Text>{noOfAttendess}</Text>
                <Ionicons
                  name="add-circle-outline"
                  size={30}
                  color={"#1565C0"}
                  onPress={() => setNoAttendees((prev) => prev + 1)}
                />
              </View>
            </View>

            {/* Meeting Requirements */}
            <View className="w-full">
              <Text className="font-semibold">Meeting Requirements</Text>
              <View
                style={{
                  flexDirection: "row",
                  flexWrap: "wrap",
                  width: "100%",
                  margin: 2,
                }}
              >
                {mockRequiremnts.map((req, idx) => (
                  <View key={idx} style={{ width: "48%", margin: "1%" }}>
                    <MeetingRequirementsView
                      iconName={req.iconName}
                      resource={req.resource}
                      isSelected={selectedRequirements.includes(req.resource)}
                      onPress={() => toggleRequirement(req.resource)}
                    />
                  </View>
                ))}
              </View>
            </View>

            {/* Selected Requirements Display */}
            {selectedRequirements.length > 0 && (
              <View className="w-full my-4">
                <Text className="text-secondary font-medium mb-2">
                  Selected Requirements ({selectedRequirements.length}):
                </Text>
                <View className="bg-blue-50 p-3 rounded-lg">
                  {selectedRequirements.map((req, idx) => (
                    <Text key={idx} className="text-secondary">
                      • {req}
                    </Text>
                  ))}
                </View>
              </View>
            )}

            {/* Meeting Type */}
            <View className="w-full my-2">
              <Text className="font-semibold mb-2">Meeting Type</Text>
              <View className="flex-row justify-between gap-x-2">
                <TouchableOpacity
                  onPress={() => setMeetingType("internal")}
                  className={`w-1/2 h-12 border-slate-200 border-2 ${meetingType === "internal" && "bg-secondary"} rounded-lg flex justify-center items-center `}
                >
                  <Text
                    className={`${meetingType === "internal" && "text-white"} text-lg`}
                  >
                    Internal
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setMeetingType("external")}
                  className={`w-1/2 h-12 border-slate-200 border-2 ${meetingType === "external" && "bg-secondary"} rounded-lg flex justify-center items-center `}
                >
                  <Text
                    className={`${meetingType === "external" && "text-white"} text-lg`}
                  >
                    External
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Name Input */}
            <View className="w-full my-2">
              <Text className="font-semibold mb-2">Name</Text>
              <View className="border-2 border-slate-200 rounded-lg px-3 py-2">
                <TextInput
                  placeholder="Enter your name"
                  value={name}
                  onChangeText={setName}
                  className="text-base"
                />
              </View>
            </View>

            {/* Department Input */}
            <View className="w-full my-2">
              <Text className="font-semibold mb-2">Department</Text>
              <View className="border-2 border-slate-200 rounded-lg px-3 py-2">
                <TextInput
                  placeholder="Enter department"
                  value={department}
                  onChangeText={setDepartment}
                  className="text-base"
                />
              </View>
            </View>

            {/* Team Agenda Input */}
            <View className="w-full my-2">
              <Text className="font-semibold mb-2">Team Agenda</Text>
              <View className="border-2 border-slate-200 rounded-lg px-3 py-2">
                <TextInput
                  placeholder="Enter team agenda"
                  value={teamAgenda}
                  onChangeText={setTeamAgenda}
                  className="text-base"
                  multiline
                />
              </View>
            </View>

            {/* Available Rooms Section */}
            <View className="w-full my-2">
              <Text className="font-semibold text-lg mb-3">
                Select a Room ({mockRooms.length} available)
              </Text>
              {selectedRoom && (
                <View className="bg-green-50 p-3 rounded-lg mb-3">
                  <Text className="text-green-700 font-medium">
                    ✓ Selected: {selectedRoom.name}
                  </Text>
                </View>
              )}
              {mockRooms.map((room) => (
                <Rooms
                  key={room.id}
                  room={room}
                  onSelect={(room) => setSelectedRoom(room)}
                  isSelected={selectedRoom?.id === room.id}
                />
              ))}
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              onPress={handleSubmit}
              className="w-full bg-secondary rounded-lg p-4 "
            >
              <Text className="text-white text-center font-semibold text-lg">
                Create Meeting Request
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </SafeScreen>
  );
};

export default index;
