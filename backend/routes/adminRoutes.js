const express = require('express');
const router = express.Router();
const {
    getAdminStats,
    getAllVendors,
    getVendorDetails,
    updateVendorStatus,
    getAllExperiences,
    verifyExperience,
    getAllBookings
} = require('../controllers/adminController');

const { protect, admin } = require('../middleware/authMiddleware');

router.get('/stats', protect, admin, getAdminStats);
router.get('/vendors', protect, admin, getAllVendors);
router.get('/vendors/:id', protect, admin, getVendorDetails);
router.put('/vendors/:id/status', protect, admin, updateVendorStatus);
router.get('/experiences', protect, admin, getAllExperiences);
router.put('/experiences/:id/verify', protect, admin, verifyExperience);
router.get('/bookings', protect, admin, getAllBookings);

module.exports = router;
