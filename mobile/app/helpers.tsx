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
