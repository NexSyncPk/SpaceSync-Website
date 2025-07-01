import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import React, { useState } from "react";
import SafeScreen from "../components/SafeScreen";
import { Ionicons } from "@expo/vector-icons";
import { getStatusColor, getStatusTextColor } from "../helpers";

const pastBookings = [
  {
    id: 1,
    title: "Meeting with John",
    date: "2023-10-01",
    time: "10:00 - 11:00 AM",
    room: "Conference Room A",
    status: "completed",
  },
  {
    id: 2,
    title: "Project Review",
    date: "2023-09-15",
    time: "2:00 - 3:30 PM",
    room: "Meeting Room 2",
    status: "completed",
  },
];

const upcomingBookings = [
  {
    id: 3,
    title: "Team Standup",
    date: "2025-07-05",
    time: "9:00 - 9:30 AM",
    room: "Conference Room A",
    status: "approved",
  },
  {
    id: 4,
    title: "Client Presentation",
    date: "2025-07-08",
    time: "2:00 - 4:00 PM",
    room: "Executive Boardroom",
    status: "pending",
  },
  {
    id: 5,
    title: "Design Review",
    date: "2025-07-10",
    time: "11:00 - 12:00 PM",
    room: "Creative Studio",
    status: "pending",
  },
  {
    id: 6,
    title: "Board Meeting",
    date: "2025-07-15",
    time: "10:00 - 12:00 PM",
    room: "Executive Boardroom",
    status: "approved",
  },
  {
    id: 7,
    title: "Onboarding Session",
    date: "2025-07-15",
    time: "11:00 - 12:00 PM",
    room: "Executive Boardroom",
    status: "approved",
  },
];

const booking = () => {
  const [bookingType, setBookingType] = useState("upcoming");

  const handleModify = (bookingId: number) => {
    console.log(`Modify booking ${bookingId}`);
    // Navigate to modify booking screen or show modal
  };

  const handleDelete = (bookingId: number) => {
    console.log(`Delete booking ${bookingId}`);
    // Show confirmation dialog and delete booking
  };

  const renderBookingCard = (booking: any, showActions: boolean = false) => (
    <View
      key={booking.id}
      className="bg-white shadow-sm rounded-lg m-2 p-4 border border-gray-200"
    >
      <View className="flex-row justify-between items-start">
        {/* Booking Info */}
        <View className="flex-1 mr-3">
          <Text className="text-lg font-semibold text-gray-900">
            {booking.title}
          </Text>
          <Text className="text-sm text-gray-600 mt-1">
            {new Date(booking.date).toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </Text>
          <Text className="text-sm text-gray-600">{booking.time}</Text>
          <Text className="text-sm text-gray-600">Room: {booking.room}</Text>
        </View>

        {/* Status Badge */}
        <View
          className={`px-3 py-1 rounded-full border ${getStatusColor(booking.status)}`}
        >
          <Text
            className={`text-xs font-medium capitalize ${getStatusTextColor(booking.status)}`}
          >
            {booking.status}
          </Text>
        </View>
      </View>

      {/* Action Buttons for Pending Bookings */}
      {showActions && booking.status === "pending" && (
        <View className="flex-row justify-end mt-3 gap-x-2">
          <TouchableOpacity
            onPress={() => handleModify(booking.id)}
            className="flex-row items-center bg-blue-50 border border-blue-200 px-3 py-2 rounded-lg"
          >
            <Ionicons name="create-outline" size={16} color="#1565C0" />
            <Text className="text-blue-700 text-sm font-medium ml-1">
              Modify
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleDelete(booking.id)}
            className="flex-row items-center bg-red-50 border border-red-200 px-3 py-2 rounded-lg"
          >
            <Ionicons name="trash-outline" size={16} color="#DC2626" />
            <Text className="text-red-700 text-sm font-medium ml-1">
              Delete
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <SafeScreen statusBarColor="#1565C0" statusBarStyle="light-content">
      <ScrollView
        className="flex-1 bg-white"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 56 }}
      >
        <View className="w-full h-full">
          {/* Upcoming and Past Button */}
          <View className="w-full h-fit mt-4">
            <Text className="font-semibold mb-2 px-2 text-lg">
              Meeting Type
            </Text>
            <View className="flex-row justify-between gap-x-2 mx-2">
              <TouchableOpacity
                onPress={() => setBookingType("upcoming")}
                className={`w-[49%] h-12 border-slate-200 border-2 ${bookingType === "upcoming" && "bg-secondary"} rounded-lg flex justify-center items-center `}
              >
                <Text
                  className={`${bookingType === "upcoming" && "text-white"} text-lg`}
                >
                  Upcoming
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setBookingType("past")}
                className={`w-[49%] h-12 border-slate-200 border-2 ${bookingType === "past" && "bg-secondary"} rounded-lg flex justify-center items-center `}
              >
                <Text
                  className={`${bookingType === "past" && "text-white"} text-lg`}
                >
                  Past
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          {/* Upcoming Bookings */}
          {bookingType === "upcoming" && (
            <View>
              {upcomingBookings.length > 0 ? (
                upcomingBookings.map((booking) =>
                  renderBookingCard(booking, true)
                )
              ) : (
                <View className="bg-gray-50 rounded-lg m-2 p-6">
                  <Text className="text-gray-500 text-center">
                    No upcoming bookings found
                  </Text>
                </View>
              )}
            </View>
          )}

          {/* Past Bookings */}
          {bookingType === "past" && (
            <View>
              {pastBookings.length > 0 ? (
                pastBookings.map((booking) => renderBookingCard(booking, false))
              ) : (
                <View className="bg-gray-50 rounded-lg m-2 p-6">
                  <Text className="text-gray-500 text-center">
                    No past bookings found
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeScreen>
  );
};

export default booking;
