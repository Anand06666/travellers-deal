const express = require('express');
const router = express.Router();
const { registerUser, loginUser, googleLogin, facebookLogin } = require('../controllers/authController');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/google', googleLogin);
router.post('/facebook', facebookLogin);

module.exports = router;
