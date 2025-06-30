const express = require("express");
const router = express.Router();
const organizationRoutes = require("./organization.route.js");
const userRoutes = require("./user.route.js");
const adminRoutes = require("./admin.route.js")
const externalAttendeeRoutes = require("./externalAttendees.route.js");

router.use("/organization", organizationRoutes);
router.use("/user", userRoutes);
router.use("/admin", adminRoutes);
router.use("/external-attendees", externalAttendeeRoutes);

module.exports = router;