const express = require('express');
const router = express.Router();
const {
    createBooking,
    getMyBookings,
    getVendorBookings,
    updateBookingStatus,
} = require('../controllers/bookingController');
const { protect, vendor } = require('../middleware/authMiddleware');

router.post('/', protect, createBooking);
router.get('/mybookings', protect, getMyBookings);
router.get('/vendor', protect, vendor, getVendorBookings);
router.put('/:id/status', protect, vendor, updateBookingStatus);

module.exports = router;
