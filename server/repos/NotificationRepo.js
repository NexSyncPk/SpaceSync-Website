const BaseRepo = require("./BaseRepo");
const { Notification } = require("../models");

class NotificationRepo extends BaseRepo {
  constructor() {
    super(Notification);
  }

  async createNotification({ userId, type, message, data }) {
    return await Notification.create({ userId, type, message, data });
  }

  async getNotificationsForUser(userId, { unreadOnly = false } = {}) {
    const where = { userId };
    if (unreadOnly) where.isRead = false;
    return await Notification.findAll({
      where,
      order: [["createdAt", "DESC"]],
    });
  }

  async markAsRead(notificationId, userId) {
    const result = await Notification.update(
      { isRead: true },
      {
        where: {
          id: notificationId,
          userId: userId, // Ensure user can only mark their own notifications as read
        },
      }
    );

    // Return the updated notification if successful
    if (result[0] > 0) {
      return await Notification.findOne({
        where: { id: notificationId, userId: userId },
      });
    }
    return null;
  }

  async markAllAsRead(userId) {
    const result = await Notification.update(
      { isRead: true },
      {
        where: {
          userId: userId,
          isRead: false, // Only update unread notifications
        },
      }
    );

    return result[0]; // Return the count of updated notifications
  }
}

module.exports = NotificationRepo;
