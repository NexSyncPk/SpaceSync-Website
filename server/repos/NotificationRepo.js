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

  async markAsRead(notificationId) {
    return await Notification.update({ isRead: true }, { where: { id: notificationId } });
  }
}

module.exports = NotificationRepo;
