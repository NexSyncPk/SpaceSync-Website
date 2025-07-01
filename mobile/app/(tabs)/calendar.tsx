import { View, Text, ScrollView, Image, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { Calendar, Agenda } from "react-native-calendars";
import SafeScreen from "../components/SafeScreen";

// Mock data for available rooms - replace with API call later
const mockAvailableRooms = [
  {
    id: 1,
    name: "Conference Room A",
    time: "10:00 - 11:00 AM",
    capacity: 12,
    image:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=200&h=200&fit=crop",
    status: "available",
  },
  {
    id: 2,
    name: "Executive Boardroom",
    time: "2:00 - 3:30 PM",
    capacity: 8,
    image:
      "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=200&fit=crop",
    status: "available",
  },
  {
    id: 3,
    name: "Creative Studio",
    time: "4:00 - 5:00 PM",
    capacity: 6,
    image:
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=200&h=200&fit=crop",
    status: "available",
  },
];

const calendar = () => {
  const [selectedDate, setSelectedDate] = useState<string>("");

  // Get current date in YYYY-MM-DD format
  const getCurrentDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const currentDate = getCurrentDate();

  // Create marked dates object with current date highlighted
  const getMarkedDates = () => {
    const marked: any = {
      [currentDate]: {
        marked: true,
        dotColor: "#1565C0",
        customStyles: {
          container: {
            backgroundColor: "#E3F2FD",
            borderRadius: 16,
          },
          text: {
            color: "#1565C0",
            fontWeight: "bold",
          },
        },
      },
    };

    // Add selected date if different from current date
    if (selectedDate && selectedDate !== currentDate) {
      marked[selectedDate] = {
        selected: true,
        selectedColor: "#1565C0",
      };
    }

    return marked;
  };
  return (
    <SafeScreen statusBarColor="#1565C0" statusBarStyle="light-content">
      <ScrollView
        className="flex-1 bg-white"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 36 }}
      >
        {/* Current Date Display */}
        <View className="mx-4 mt-4 mb-3 bg-blue-50 p-3 rounded-lg">
          <Text className="text-secondary font-semibold text-center">
            Today:{" "}
            {new Date(currentDate).toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </Text>
          {selectedDate && selectedDate !== currentDate && (
            <Text className="text-gray-600 text-center mt-1">
              Selected:{" "}
              {new Date(selectedDate).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </Text>
          )}
        </View>

        {/* Calendar */}
        <View className="mx-4 mb-4">
          <Calendar
            current={currentDate}
            onDayPress={(day: any) => {
              console.log("selected day", day);
              setSelectedDate(day.dateString);
            }}
            markedDates={getMarkedDates()}
            markingType={"custom"}
            style={{
              borderWidth: 1,
              borderColor: "#e0e0e0",
              borderRadius: 10,
            }}
            theme={{
              backgroundColor: "#ffffff",
              calendarBackground: "#ffffff",
              textSectionTitleColor: "#b6c1cd",
              selectedDayBackgroundColor: "#1565C0",
              selectedDayTextColor: "#ffffff",
              todayTextColor: "#1565C0",
              dayTextColor: "#2d4150",
              textDisabledColor: "#d9e1e8",
              dotColor: "#1565C0",
              selectedDotColor: "#ffffff",
              arrowColor: "#1565C0",
              disabledArrowColor: "#d9e1e8",
              monthTextColor: "#1565C0",
              indicatorColor: "#1565C0",
              textDayFontWeight: "300",
              textMonthFontWeight: "bold",
              textDayHeaderFontWeight: "300",
              textDayFontSize: 16,
              textMonthFontSize: 18,
              textDayHeaderFontSize: 13,
            }}
          />
        </View>

        {/* Available Rooms Section */}
        <View className="mx-4 mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-3">
            Available Rooms ({mockAvailableRooms.length})
          </Text>

          {mockAvailableRooms.map((room) => (
            <TouchableOpacity
              key={room.id}
              className="flex-row items-center bg-white border border-gray-200 rounded-lg p-3 mb-3 shadow-sm"
              onPress={() => console.log(`Selected room: ${room.name}`)}
            >
              {/* Room Image */}
              <View className="w-16 h-16 rounded-lg overflow-hidden bg-gray-200 mr-3">
                <Image
                  source={{ uri: room.image }}
                  style={{ width: "100%", height: "100%", resizeMode: "cover" }}
                />
              </View>

              {/* Room Info */}
              <View className="flex-1">
                <Text className="text-base font-semibold text-gray-900">
                  {room.name}
                </Text>
                <Text className="text-sm text-gray-600 mt-1">{room.time}</Text>
                <Text className="text-xs text-gray-500 mt-1">
                  Capacity: {room.capacity} people
                </Text>
              </View>

              {/* Status Badge */}
              <View className="bg-green-100 px-2 py-1 rounded-full">
                <Text className="text-green-700 text-xs font-medium capitalize">
                  {room.status}
                </Text>
              </View>
            </TouchableOpacity>
          ))}

          {/* No rooms message (if empty) */}
          {mockAvailableRooms.length === 0 && (
            <View className="bg-gray-50 p-4 rounded-lg">
              <Text className="text-gray-500 text-center">
                No rooms available for the selected date
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeScreen>
  );
};

export default calendar;
