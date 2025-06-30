const express = require("express");
const router = express.Router();
const UserController = require("../controllers/user.controller");

router.get("/", UserController.getAllUsers);
router.post("/", UserController.createUser);
router.get("/:userId", UserController.getUserById);
router.put("/:userId", UserController.updateUser);
router.delete("/:userId", UserController.deleteUser);

router.get("/:userId/organizations", UserController.getUserOrganizations);
router.get("/:userId/reservations", UserController.getUserReservations);

module.exports = router;