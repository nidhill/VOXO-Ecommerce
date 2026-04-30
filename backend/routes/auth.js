const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema } = require('../validators/authSchema');
const { sendWelcomeEmail, sendPasswordResetEmail } = require('../services/emailService');

let googleClient = null;

const getGoogleClient = () => {
    if (!process.env.GOOGLE_CLIENT_ID) {
        return null;
    }

    if (googleClient) {
        return googleClient;
    }

    try {
        const { OAuth2Client } = require('google-auth-library');
        googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
        return googleClient;
    } catch (error) {
        console.error(`Google auth disabled: ${error.message}`);
        return null;
    }
};

const isProd = process.env.NODE_ENV === 'production';

const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax', // 'none' required for cross-origin on prod (Render→Vercel)
    path: '/',
};

const signAccess  = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '15m' });
const signRefresh = (id) => jwt.sign({ id }, process.env.REFRESH_TOKEN_SECRET || process.env.JWT_SECRET, { expiresIn: '7d' });

const sendTokens = (res, userId) => {
    res.cookie('token',        signAccess(userId),  { ...COOKIE_OPTIONS, maxAge: 15 * 60 * 1000 });
    res.cookie('refreshToken', signRefresh(userId), { ...COOKIE_OPTIONS, path: '/api/auth/refresh', maxAge: 7 * 24 * 60 * 60 * 1000 });
};

// ── Register ─────────────────────────────────────────────────────────────────
router.post('/register', validate(registerSchema), async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;

        const exists = await User.findOne({ email });
        if (exists) return res.status(400).json({ message: 'Email already registered' });

        const user = await User.create({ name, email, password, phone });
        sendWelcomeEmail({ name: user.name, email: user.email }).catch(console.error);

        sendTokens(res, user._id);
        res.status(201).json({ user: { id: user._id, name: user.name, email: user.email, phone: user.phone } });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ── Login ─────────────────────────────────────────────────────────────────────
router.post('/login', validate(loginSchema), async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user || !(await user.matchPassword(password)))
            return res.status(401).json({ message: 'Invalid email or password' });

        sendTokens(res, user._id);
        res.json({ user: { id: user._id, name: user.name, email: user.email, phone: user.phone } });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ── Google OAuth ──────────────────────────────────────────────────────────────
router.post('/google', async (req, res) => {
    try {
        const { credential } = req.body;
        const googleClient = getGoogleClient();

        if (!googleClient) {
            return res.status(503).json({ message: 'Google login is not available right now' });
        }

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

        sendTokens(res, user._id);
        res.json({ user: { id: user._id, name: user.name, email: user.email, avatar: user.avatar } });
    } catch (err) {
        res.status(401).json({ message: 'Google authentication failed' });
    }
});

// ── Get current user ──────────────────────────────────────────────────────────
router.get('/me', protect, async (req, res) => {
    res.json({ id: req.user._id, name: req.user.name, email: req.user.email, phone: req.user.phone });
});

// ── Refresh access token ──────────────────────────────────────────────────────
router.post('/refresh', async (req, res) => {
    const token = req.cookies?.refreshToken;
    if (!token) return res.status(401).json({ message: 'No refresh token' });

    try {
        const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET || process.env.JWT_SECRET);
        const newAccess = signAccess(decoded.id);
        res.cookie('token', newAccess, { ...COOKIE_OPTIONS, maxAge: 15 * 60 * 1000 });
        res.json({ success: true });
    } catch {
        res.clearCookie('token').clearCookie('refreshToken').status(401).json({ message: 'Session expired. Please log in again.' });
    }
});

// ── Logout ────────────────────────────────────────────────────────────────────
router.post('/logout', (req, res) => {
    res.clearCookie('token', COOKIE_OPTIONS)
       .clearCookie('refreshToken', { ...COOKIE_OPTIONS, path: '/api/auth/refresh' })
       .json({ success: true });
});

// ── Forgot password ───────────────────────────────────────────────────────────
router.post('/forgot-password', validate(forgotPasswordSchema), async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.json({ message: 'If that email exists, a reset link has been sent.' });

        const rawToken = crypto.randomBytes(32).toString('hex');
        user.resetPasswordToken = crypto.createHash('sha256').update(rawToken).digest('hex');
        user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
        await user.save({ validateBeforeSave: false });

        sendPasswordResetEmail({ name: user.name, email: user.email, resetToken: rawToken }).catch(console.error);
        res.json({ message: 'If that email exists, a reset link has been sent.' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ── Reset password ────────────────────────────────────────────────────────────
router.put('/reset-password/:token', validate(resetPasswordSchema), async (req, res) => {
    try {
        const { password } = req.body;

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

        sendTokens(res, user._id);
        res.json({ user: { id: user._id, name: user.name, email: user.email } });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
