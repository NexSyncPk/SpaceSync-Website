const express = require("express");
const router = express.Router();
const NotificationRepo = require("../repos/NotificationRepo");
const authMiddleware = require("../middlewares/auth.middleware");

router.get("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const notificationRepo = new NotificationRepo();
    const notifications = await notificationRepo.getNotificationsForUser(
      userId
    );
    res.json({ notifications });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
});

// Mark a single notification as read
router.patch("/:id/read", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const notificationId = req.params.id;
    const notificationRepo = new NotificationRepo();

    const updatedNotification = await notificationRepo.markAsRead(
      notificationId,
      userId
    );

    if (!updatedNotification) {
      return res
        .status(404)
        .json({ error: "Notification not found or not authorized" });
    }

    res.json({
      message: "Notification marked as read",
      notification: updatedNotification,
    });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    res.status(500).json({ error: "Failed to mark notification as read" });
  }
});

// Mark all notifications as read for the user
router.patch("/mark-all-read", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const notificationRepo = new NotificationRepo();

    const updatedCount = await notificationRepo.markAllAsRead(userId);

    res.json({
      message: "All notifications marked as read",
      updatedCount,
    });
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    res.status(500).json({ error: "Failed to mark all notifications as read" });
  }
});

module.exports = router;
