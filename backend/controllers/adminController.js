const User = require('../models/User');
const Experience = require('../models/Experience');
const Booking = require('../models/Booking');

// @desc    Get Admin Dashboard Stats
// @route   GET /api/admin/stats
// @access  Private/Admin
const getAdminStats = async (req, res) => {
    try {
        const userCount = await User.countDocuments();
        const experienceCount = await Experience.countDocuments();
        const bookingCount = await Booking.countDocuments();

        // Calculate Total Revenue from confirmed bookings
        const bookings = await Booking.find({ paymentStatus: 'paid' });
        const totalRevenue = bookings.reduce((acc, item) => acc + item.totalPrice, 0);

        res.json({
            userCount,
            experienceCount,
            bookingCount,
            totalRevenue,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all vendors (filtered by verification status)
// @route   GET /api/admin/vendors
// @access  Private/Admin
const getAllVendors = async (req, res) => {
    try {
        const { status } = req.query; // 'pending' or 'verified'

        let query = { role: 'vendor' };

        if (status === 'pending') {
            query.isVerified = false;
        } else if (status === 'verified') {
            query.isVerified = true;
        }

        const vendors = await User.find(query).select('-password');
        res.json(vendors);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get vendor details with stats
// @route   GET /api/admin/vendors/:id
// @access  Private/Admin
const getVendorDetails = async (req, res) => {
    try {
        const vendor = await User.findById(req.params.id).select('-password');

        if (!vendor) {
            return res.status(404).json({ message: 'Vendor not found' });
        }

        // Get Experience Stats
        const experiences = await Experience.find({ vendor: req.params.id });

        // Get Booking Stats
        // Find all bookings for experiences owned by this vendor
        const experienceIds = experiences.map(exp => exp._id);
        const bookings = await Booking.find({ experience: { $in: experienceIds } });

        const totalRevenue = bookings
            .filter(b => b.paymentStatus === 'paid')
            .reduce((acc, b) => acc + b.totalPrice, 0);

        const totalBookings = bookings.length;
        // Total users served (unique users who booked)
        const uniqueCustomers = new Set(bookings.map(b => b.user.toString())).size;

        res.json({
            vendor,
            stats: {
                totalExperiences: experiences.length,
                totalBookings,
                totalRevenue,
                totalCustomers: uniqueCustomers
            },
            experiences
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update vendor verification or activation status
// @route   PUT /api/admin/vendors/:id/status
// @access  Private/Admin
const updateVendorStatus = async (req, res) => {
    try {
        const { isVerified, isActive } = req.body;
        const vendor = await User.findById(req.params.id);

        if (!vendor) {
            return res.status(404).json({ message: 'Vendor not found' });
        }

        if (typeof isVerified !== 'undefined') {
            vendor.isVerified = isVerified;
        }

        if (typeof isActive !== 'undefined') {
            vendor.isActive = isActive;
        }

        const updatedVendor = await vendor.save();
        res.json(updatedVendor);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



// @desc    Get all experiences (with status filter)
// @route   GET /api/admin/experiences
// @access  Private/Admin
const getAllExperiences = async (req, res) => {
    try {
        const { status } = req.query;

        let query = {};
        if (status) {
            query.status = status;
        }

        const experiences = await Experience.find(query)
            .populate('vendor', 'name email')
            .sort({ createdAt: -1 });

        res.json(experiences);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Verify/Reject Experience
// @route   PUT /api/admin/experiences/:id/verify
// @access  Private/Admin
const verifyExperience = async (req, res) => {
    try {
        const { status } = req.body; // 'approved' or 'rejected'
        const experience = await Experience.findById(req.params.id);

        if (!experience) {
            return res.status(404).json({ message: 'Experience not found' });
        }

        if (status) {
            experience.status = status;
            experience.isActive = status === 'approved'; // Auto-activate if approved
        }

        const updatedExperience = await experience.save();
        res.json(updatedExperience);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



// @desc    Get all bookings (Global Oversight)
// @route   GET /api/admin/bookings
// @access  Private/Admin
const getAllBookings = async (req, res) => {
    try {
        const { status, paymentStatus } = req.query;

        let query = {};
        if (status) {
            query.status = status;
        }
        if (paymentStatus) {
            query.paymentStatus = paymentStatus;
        }

        const bookings = await Booking.find(query)
            .populate('user', 'name email')
            .populate({
                path: 'experience',
                select: 'title vendor',
                populate: { path: 'vendor', select: 'name email' }
            })
            .sort({ createdAt: -1 });

        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAdminStats,
    getAllVendors,
    getVendorDetails,
    updateVendorStatus,
    getAllExperiences,
    verifyExperience,
    getAllBookings
};
