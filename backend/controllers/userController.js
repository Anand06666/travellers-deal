const User = require('../models/User');

// @desc    Get user wishlist
// @route   GET /api/users/wishlist
// @access  Private
const getWishlist = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('wishlist');
        res.json(user.wishlist);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add to wishlist
// @route   POST /api/users/wishlist/:id
// @access  Private
const addToWishlist = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const experienceId = req.params.id;

        if (user.wishlist.includes(experienceId)) {
            return res.status(400).json({ message: 'Experience already in wishlist' });
        }

        user.wishlist.push(experienceId);
        await user.save();
        res.json(user.wishlist);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Remove from wishlist
// @route   DELETE /api/users/wishlist/:id
// @access  Private
const removeFromWishlist = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const experienceId = req.params.id;

        user.wishlist = user.wishlist.filter(id => id.toString() !== experienceId);
        await user.save();
        res.json(user.wishlist);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getWishlist,
    addToWishlist,
    removeFromWishlist,
};
