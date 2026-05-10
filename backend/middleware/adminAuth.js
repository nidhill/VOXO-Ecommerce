const jwt = require('jsonwebtoken');

const adminAuth = (req, res, next) => {
    // Method 1: x-admin-key header (direct API access / local dev)
    const key = req.headers['x-admin-key'];
    if (key && key === process.env.ADMIN_SECRET) {
        return next();
    }

    // Method 2: cookie-based JWT (production via Vercel proxy)
    const token = req.cookies?.adminToken;
    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            if (decoded.role === 'admin') {
                req.adminId = decoded.id;
                return next();
            }
        } catch {
            // token invalid or expired — fall through to deny
        }
    }

    return res.status(401).json({ message: 'Admin access denied' });
};

module.exports = { adminAuth };
