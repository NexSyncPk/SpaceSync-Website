export const getStatusColor = (status: string) => {
  switch (status) {
    case "approved":
      return "bg-green-100 border-green-200";
    case "pending":
      return "bg-orange-100 border-orange-200";
    case "completed":
      return "bg-blue-100 border-blue-200";
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
    default:
      return "text-gray-700";
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