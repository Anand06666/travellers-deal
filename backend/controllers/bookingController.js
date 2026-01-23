const Booking = require('../models/Booking');
const Experience = require('../models/Experience');

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res) => {
    const { experienceId, date, slots, timeSlot } = req.body;

    try {
        const experience = await Experience.findById(experienceId);

        if (!experience) {
            return res.status(404).json({ message: 'Experience not found' });
        }

        const totalPrice = experience.price * slots;

        const booking = new Booking({
            user: req.user._id,
            experience: experienceId,
            date,
            timeSlot,
            slots,
            totalPrice,
            status: 'pending',
            paymentStatus: 'pending',
        });

        const createdBooking = await booking.save();
        res.status(201).json(createdBooking);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get logged in user bookings
// @route   GET /api/bookings/mybookings
// @access  Private
const getMyBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user._id }).populate(
            'experience',
            'title price images itinerary location duration'
        );
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get bookings for vendor experiences
// @route   GET /api/bookings/vendor
// @access  Private/Vendor
const getVendorBookings = async (req, res) => {
    try {
        // Find experiences by this vendor
        const experiences = await Experience.find({ vendor: req.user._id });
        const experienceIds = experiences.map((exp) => exp._id);

        // Find bookings for these experiences
        const bookings = await Booking.find({
            experience: { $in: experienceIds },
        })
            .populate('user', 'name email')
            .populate('experience', 'title');

        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createBooking, getMyBookings, getVendorBookings };
