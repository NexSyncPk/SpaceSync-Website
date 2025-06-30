const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/admin.controller');

router.get('/', AdminController.getAllAdmins);
router.post('/', AdminController.createAdmin);
router.get('/:adminId', AdminController.getAdminById);
router.put('/:adminId', AdminController.updateAdmin);
router.delete('/:adminId', AdminController.deleteAdmin);

// approve or reject reservations
router.post('/:adminId/reservations/:reservationId/approve', AdminController.approveReservation);
router.post('/:adminId/reservations/:reservationId/reject', AdminController.rejectReservation);

module.exports = router;