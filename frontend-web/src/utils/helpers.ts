export const getStatusColor = (status: string) => {
  switch (status) {
    case "approved":
      return "bg-green-100 border-green-200";
    case "pending":
      return "bg-orange-100 border-orange-200";
    case "completed":
      return "bg-blue-100 border-blue-200";
    case "cancelled":
      return "bg-red-100 border-red-200";
    case "updated":
      return "bg-purple-100 border-purple-200";
    case "occupied":
      return "bg-yellow-100 border-yellow-200";
    case "free":
      return "bg-green-100 border-green-200";
    default:
      return "bg-gray-100 border-gray-200";
  }
};

export const getStatusTextColor = (status: string) => {
  switch (status) {
    case "approved":
      return "text-green-700";
    case "pending":
      return "text-orange-700";
    case "completed":
      return "text-blue-700";
    case "cancelled":
      return "text-red-500";
    case "updated":
      return "text-purple-700";
    case "occupied":
      return "text-yellow-700";
    case "free":
      return "text-green-700";
    default:
      return "text-gray-700";
  }
};

export const getPriorityColor = (status: string) => {
  switch (status) {
    case "pending":
      return "border-l-yellow-500";
    case "confirmed":
      return "border-l-green-500";
    case "completed":
      return "border-l-blue-500";
    case "cancelled":
      return "border-l-red-500";
    default:
      return "border-l-gray-500";
  }
};

export const formatSelectedDate = (selectedDate: Date) => {
  return selectedDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// Helper to convert 12-hour time to 24-hour format (for input type="time")
export function convertTo24Hour(timeStr?: string) {
  if (!timeStr) return "";
  // Handles both "2:00 PM" and "14:00" cases
  if (/AM|PM/i.test(timeStr)) {
    const [time, modifier] = timeStr.split(" ");
    let [hours, minutes] = time.split(":");
    if (hours === "12") hours = "00";
    if (modifier.toUpperCase() === "PM" && hours !== "12")
      hours = String(parseInt(hours, 10) + 12);
    return `${hours.padStart(2, "0")}:${minutes}`;
  }
  // Already 24-hour
  return timeStr.length === 5 ? timeStr : "";
}

import { store } from "@/store/store";
import { AlertCircle, CheckCircle, XCircle } from "lucide-react";

// Get token from Redux store
export const getToken = (): string | null => {
  try {
    const state = store.getState();
    return state.auth?.token || null;
  } catch (error) {
    console.error("Error getting token from Redux store:", error);
    return null;
  }
};

// User information helpers
export const getUserFromToken = (token: string) => {
  try {
    // Basic JWT token parsing (for client-side use only)
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Error parsing token:", error);
    return null;
  }
};

export const isTokenExpired = (token: string): boolean => {
  try {
    const payload = getUserFromToken(token);
    if (!payload || !payload.exp) return true;

    const currentTime = Date.now() / 1000;
    return payload.exp < currentTime;
  } catch (error) {
    console.error("Error checking token expiration:", error);
    return true;
  }
};

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const formatTime = (dateString: string) => {
  return new Date(dateString).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const getAmenityBadges = (room: any) => {
  const amenities = [];
  if (room?.displayProjector) amenities.push("Projector");
  if (room?.displayWhiteboard) amenities.push("Whiteboard");
  if (room?.cateringAvailable) amenities.push("Catering");
  if (room?.videoConferenceAvailable) amenities.push("Video Conference");
  return amenities;
};

export const getStatusColor_Admin = (status: string) => {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-600";
    case "confirmed":
      return "bg-green-100 text-green-600";
    case "completed":
      return "bg-blue-100 text-blue-600";
    case "cancelled":
      return "bg-red-100 text-red-600";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

export const getStatusStylesBooking = (status: string) => {
  switch (status.toLowerCase()) {
    case "confirmed":
    case "upcoming":
      return {
        bg: "bg-gradient-to-r from-green-50 to-emerald-50",
        text: "text-green-700",
        border: "border-green-200",
        icon: CheckCircle,
      };
    case "pending":
      return {
        bg: "bg-gradient-to-r from-yellow-50 to-amber-50",
        text: "text-yellow-700",
        border: "border-yellow-200",
        icon: AlertCircle,
      };
    case "cancelled":
      return {
        bg: "bg-gradient-to-r from-red-50 to-rose-50",
        text: "text-red-700",
        border: "border-red-200",
        icon: XCircle,
      };
    case "completed":
      return {
        bg: "bg-gradient-to-r from-blue-50 to-indigo-50",
        text: "text-blue-700",
        border: "border-blue-200",
        icon: CheckCircle,
      };
    default:
      return {
        bg: "bg-gradient-to-r from-gray-50 to-slate-50",
        text: "text-gray-700",
        border: "border-gray-200",
        icon: AlertCircle,
      };
  }
};

// Helper function to format time ago
export const formatTimeAgo = (timestamp: string) => {
  const now = new Date();
  const time = new Date(timestamp);
  const diffInMinutes = Math.floor(
    (now.getTime() - time.getTime()) / (1000 * 60)
  );

  if (diffInMinutes < 1) return "Just now";
  if (diffInMinutes < 60)
    return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24)
    return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;

  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
};

// Get background gradient for notification type
export const getNotificationGradient = (type: string) => {
  switch (type) {
    case "new_reservation_request":
      return "bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200";
    case "reservation_cancelled":
      return "bg-gradient-to-r from-red-50 to-red-100 border-red-200";
    case "reservation_created":
    case "reservation_approved":
      return "bg-gradient-to-r from-green-50 to-green-100 border-green-200";
    case "reservation_updated":
      return "bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200";
    case "reservation_rejected":
      return "bg-gradient-to-r from-red-50 to-red-100 border-red-200";
    case "user_joined":
      return "bg-gradient-to-r from-indigo-50 to-indigo-100 border-indigo-200";
    case "room_booked":
      return "bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200";
    case "meeting_reminder":
      return "bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200";
    case "general":
      return "bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200";
    default:
      return "bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200";
  }
};
