const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    try {
        const { name, email, password, role, vendorDetails } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({
            name,
            email,
            password,
            role: role || 'traveler',
            vendorDetails: role === 'vendor' ? vendorDetails : undefined,
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const { OAuth2Client } = require('google-auth-library');
const axios = require('axios');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// @desc    Google Login
// @route   POST /api/auth/google
// @access  Public
const googleLogin = async (req, res) => {
    try {
        const { token } = req.body;
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const { name, email, picture } = ticket.getPayload();

        let user = await User.findOne({ email });

        if (user) {
            // If user exists, update provider if needed or just login
            // Note: We are not merging accounts for security without verification, 
            // but for simplicity here we assume email ownership is enough from Google.
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            // Create new user
            const randomPassword = Math.random().toString(36).slice(-8);
            user = await User.create({
                name,
                email,
                password: randomPassword,
                provider: 'google',
                isVerified: true // Google emails are verified
            });

            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        }

    } catch (error) {
        res.status(400).json({ message: 'Google Login Failed: ' + error.message });
    }
};

// @desc    Facebook Login
// @route   POST /api/auth/facebook
// @access  Public
const facebookLogin = async (req, res) => {
    try {
        const { accessToken, userID } = req.body;
        const url = `https://graph.facebook.com/v2.11/${userID}/?fields=id,name,email,picture&access_token=${accessToken}`;

        const { data } = await axios.get(url);
        const { email, name } = data;

        if (!email) {
            return res.status(400).json({ message: 'Facebook account does not have an email.' });
        }

        let user = await User.findOne({ email });

        if (user) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            const randomPassword = Math.random().toString(36).slice(-8);
            user = await User.create({
                name,
                email,
                password: randomPassword,
                provider: 'facebook',
                isVerified: true
            });

            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        }

    } catch (error) {
        res.status(400).json({ message: 'Facebook Login Failed: ' + error.message });
    }
};

module.exports = { registerUser, loginUser, googleLogin, facebookLogin };
