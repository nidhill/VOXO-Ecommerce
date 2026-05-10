const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const AdminUser = require('../models/AdminUser');
const Otp = require('../models/Otp');
const { sendOtpEmail } = require('../services/emailService');

const isProd = process.env.NODE_ENV === 'production';
const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    path: '/',
};

const signAdminToken = (id) =>
    jwt.sign({ id, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '8h' });

// ── POST /api/admin-auth/login ────────────────────────────────────────────────
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password)
            return res.status(400).json({ message: 'Email and password are required' });

        const admin = await AdminUser.findOne({ email: email.toLowerCase().trim() });
        if (!admin || !(await admin.matchPassword(password)))
            return res.status(401).json({ message: 'Invalid email or password' });

        const token = signAdminToken(admin._id);
        res.cookie('adminToken', token, { ...COOKIE_OPTIONS, maxAge: 8 * 60 * 60 * 1000 });
        res.json({ success: true, admin: { id: admin._id, email: admin.email, name: admin.name } });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ── POST /api/admin-auth/verify-token ─────────────────────────────────────────
router.post('/verify-token', (req, res) => {
    try {
        const token = req.cookies?.adminToken;
        if (!token) return res.status(401).json({ valid: false });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== 'admin') return res.status(401).json({ valid: false });

        res.json({ valid: true });
    } catch {
        res.status(401).json({ valid: false });
    }
});

// ── POST /api/admin-auth/logout ───────────────────────────────────────────────
router.post('/logout', (req, res) => {
    res.clearCookie('adminToken', COOKIE_OPTIONS).json({ success: true });
});

// ── Middleware: require admin JWT ─────────────────────────────────────────────
const requireAdminJwt = (req, res, next) => {
    try {
        const token = req.cookies?.adminToken;
        if (!token) return res.status(401).json({ message: 'Not authenticated' });
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
        req.adminId = decoded.id;
        next();
    } catch {
        res.status(401).json({ message: 'Session expired. Please log in again.' });
    }
};

// ── POST /api/admin-auth/send-otp  (forgot password – outside) ───────────────
router.post('/send-otp', async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ message: 'Email is required' });

        const admin = await AdminUser.findOne({ email: email.toLowerCase().trim() });
        // Don't reveal if admin exists or not
        if (!admin) return res.json({ message: 'If that email is registered, an OTP has been sent.' });

        const otp = await Otp.createOtp(`admin:${email.toLowerCase().trim()}`);
        await sendOtpEmail({ name: admin.name || 'Admin', email: admin.email, otp });

        res.json({ message: 'If that email is registered, an OTP has been sent.' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ── POST /api/admin-auth/reset-password  (forgot password – outside) ─────────
router.post('/reset-password', async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;
        if (!email || !otp || !newPassword)
            return res.status(400).json({ message: 'Email, OTP and new password are required' });

        if (newPassword.length < 8)
            return res.status(400).json({ message: 'Password must be at least 8 characters' });

        const valid = await Otp.verifyOtp(`admin:${email.toLowerCase().trim()}`, otp);
        if (!valid) return res.status(400).json({ message: 'Invalid or expired OTP' });

        const admin = await AdminUser.findOne({ email: email.toLowerCase().trim() });
        if (!admin) return res.status(404).json({ message: 'Admin not found' });

        admin.password = newPassword; // pre-save hook will hash
        await admin.save();

        res.json({ success: true, message: 'Password reset successfully. Please log in.' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ── POST /api/admin-auth/send-change-otp  (inside dashboard – change password) 
router.post('/send-change-otp', requireAdminJwt, async (req, res) => {
    try {
        const admin = await AdminUser.findById(req.adminId);
        if (!admin) return res.status(404).json({ message: 'Admin not found' });

        const otp = await Otp.createOtp(`admin-change:${admin.email}`);
        await sendOtpEmail({ name: admin.name || 'Admin', email: admin.email, otp });

        res.json({ message: 'OTP sent to your registered email.' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ── POST /api/admin-auth/change-password  (inside dashboard) ──────────────────
router.post('/change-password', requireAdminJwt, async (req, res) => {
    try {
        const { currentPassword, otp, newPassword } = req.body;
        if (!currentPassword || !otp || !newPassword)
            return res.status(400).json({ message: 'All fields are required' });

        if (newPassword.length < 8)
            return res.status(400).json({ message: 'New password must be at least 8 characters' });

        const admin = await AdminUser.findById(req.adminId);
        if (!admin) return res.status(404).json({ message: 'Admin not found' });

        // 1. Verify current password
        const passOk = await admin.matchPassword(currentPassword);
        if (!passOk) return res.status(401).json({ message: 'Current password is incorrect' });

        // 2. Verify OTP
        const valid = await Otp.verifyOtp(`admin-change:${admin.email}`, otp);
        if (!valid) return res.status(400).json({ message: 'Invalid or expired OTP' });

        // 3. Update
        admin.password = newPassword;
        await admin.save();

        // 4. Rotate cookie
        const token = signAdminToken(admin._id);
        res.cookie('adminToken', token, { ...COOKIE_OPTIONS, maxAge: 8 * 60 * 60 * 1000 });

        res.json({ success: true, message: 'Password changed successfully.' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
