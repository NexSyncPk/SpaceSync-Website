const express = require("express");
const router = express.Router();
const OrganizationController = require("../controllers/organization.controller");
const roomRoutes = require("./room.route");

router.get("/", OrganizationController.getAllOrganizations);
router.post("/", OrganizationController.createOrganization);
router.get("/:orgId", OrganizationController.getOrganizationById);
router.put("/:orgId", OrganizationController.updateOrganization);
router.delete("/:orgId", OrganizationController.deleteOrganization);

router.use("/:orgId/rooms", roomRoutes);

module.exports = router;