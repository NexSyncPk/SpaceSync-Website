import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Notification {
  id: string;
  userId?: string;
  type:
    | "user_joined"
    | "meeting_reminder"
    | "room_booked"
    | "general"
    | "reservation_cancelled"
    | "reservation_created"
    | "reservation_updated";
  message: string;
  timestamp: string;
  read: boolean;
  data?: any; // For additional notification data from backend
  isRead?: boolean; // Backend uses isRead instead of read
  createdAt?: string; // Backend timestamp format
  updatedAt?: string;
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
}

const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
};

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<Notification>) => {
      state.notifications.unshift(action.payload);
      if (!action.payload.read && !action.payload.isRead) {
        state.unreadCount += 1;
      }
    },
    setNotifications: (state, action: PayloadAction<Notification[]>) => {
      state.notifications = action.payload.map((notification) => ({
        ...notification,
        read: notification.read || notification.isRead || false,
        timestamp:
          notification.timestamp ||
          notification.createdAt ||
          new Date().toISOString(),
      }));
      state.unreadCount = state.notifications.filter((n) => !n.read).length;
    },
    markAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find(
        (n) => n.id === action.payload
      );
      if (notification && !notification.read) {
        notification.read = true;
        notification.isRead = true;
        state.unreadCount -= 1;
      }
    },
    markAllAsRead: (state) => {
      state.notifications.forEach((notification) => {
        notification.read = true;
        notification.isRead = true;
      });
      state.unreadCount = 0;
    },
    clearNotifications: (state) => {
      state.notifications = [];
      state.unreadCount = 0;
    },
  },
});

export const {
  addNotification,
  setNotifications,
  markAsRead,
  markAllAsRead,
  clearNotifications,
} = notificationSlice.actions;
export default notificationSlice.reducer;
