const express = require("express");
const router = express.Router();
const NotificationRepo = require("../repos/NotificationRepo");
const authMiddleware = require("../middlewares/auth.middleware");

router.get("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const notificationRepo = new NotificationRepo();
    const notifications = await notificationRepo.getNotificationsForUser(userId);
    res.json({ notifications });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
});

module.exports = router;