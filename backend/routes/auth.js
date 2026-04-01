const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const { OAuth2Client } = require('google-auth-library');
const { sendWelcomeEmail, sendPasswordResetEmail } = require('../services/emailService');

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

// Register
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;
        if (!name || !email || !password) return res.status(400).json({ message: 'Please fill all fields' });

        const exists = await User.findOne({ email });
        if (exists) return res.status(400).json({ message: 'Email already registered' });

        const user = await User.create({ name, email, password, phone });
        // Send welcome email (non-blocking)
        sendWelcomeEmail({ name: user.name, email: user.email }).catch(console.error);
        res.status(201).json({ token: signToken(user._id), user: { id: user._id, name: user.name, email: user.email, phone: user.phone } });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ message: 'Please fill all fields' });

        const user = await User.findOne({ email });
        if (!user || !(await user.matchPassword(password)))
            return res.status(401).json({ message: 'Invalid email or password' });

        res.json({ token: signToken(user._id), user: { id: user._id, name: user.name, email: user.email, phone: user.phone } });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Google OAuth
router.post('/google', async (req, res) => {
    try {
        const { credential } = req.body;
        const ticket = await googleClient.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const { name, email, picture, sub } = ticket.getPayload();

        let user = await User.findOne({ email });
        const isNew = !user;
        if (!user) {
            user = new User({ name, email, password: sub + process.env.JWT_SECRET, avatar: picture });
            await user.save();
        }
        if (isNew) sendWelcomeEmail({ name: user.name, email: user.email }).catch(console.error);
        res.json({ token: signToken(user._id), user: { id: user._id, name: user.name, email: user.email, avatar: user.avatar } });
    } catch (err) {
        res.status(401).json({ message: 'Google authentication failed' });
    }
});

// Get me
router.get('/me', protect, async (req, res) => {
    res.json({ id: req.user._id, name: req.user.name, email: req.user.email, phone: req.user.phone });
});

// Forgot password — send reset email
router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ message: 'Email is required' });

        const user = await User.findOne({ email });
        // Always respond 200 to prevent email enumeration
        if (!user) return res.json({ message: 'If that email exists, a reset link has been sent.' });

        const rawToken = crypto.randomBytes(32).toString('hex');
        user.resetPasswordToken = crypto.createHash('sha256').update(rawToken).digest('hex');
        user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 minutes
        await user.save({ validateBeforeSave: false });

        sendPasswordResetEmail({ name: user.name, email: user.email, resetToken: rawToken }).catch(console.error);
        res.json({ message: 'If that email exists, a reset link has been sent.' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Reset password
router.put('/reset-password/:token', async (req, res) => {
    try {
        const { password } = req.body;
        if (!password || password.length < 6)
            return res.status(400).json({ message: 'Password must be at least 6 characters' });

        const hashed = crypto.createHash('sha256').update(req.params.token).digest('hex');
        const user = await User.findOne({
            resetPasswordToken: hashed,
            resetPasswordExpire: { $gt: Date.now() },
        });
        if (!user) return res.status(400).json({ message: 'Reset link is invalid or has expired' });

        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        res.json({ token: signToken(user._id), user: { id: user._id, name: user.name, email: user.email } });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
