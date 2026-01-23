const express = require('express');
const router = express.Router();
const {
    getWishlist,
    addToWishlist,
    removeFromWishlist,
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.get('/wishlist', protect, getWishlist);
router.post('/wishlist/:id', protect, addToWishlist);
router.delete('/wishlist/:id', protect, removeFromWishlist);

module.exports = router;
