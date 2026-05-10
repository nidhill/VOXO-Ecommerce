const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const loadEnv = require('./config/loadEnv');

// Load environment variables
loadEnv();

// Connect to Database
connectDB();

const app = express();

// ── Security: HTTP headers via helmet ─────────────────────────────────────────
app.use(helmet({
    crossOriginEmbedderPolicy: false, // allow Google OAuth iframes
    contentSecurityPolicy: false,     // CSP handled by Vercel headers
}));

// ── Security: CORS allowlist ──────────────────────────────────────────────────
app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true); // allow requests with no origin (like mobile apps or curl requests)

        const allowedList = [
            'http://localhost:5173',
            'http://localhost:5174',
            'http://localhost:5175',
            'http://localhost:3000',
            'https://wavway.vercel.app',
            process.env.FRONTEND_URL,
        ].filter(Boolean);

        if (allowedList.includes(origin) || origin.startsWith('http://192.168.') || origin.startsWith('http://10.')) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}));

app.use(express.json({ limit: '10kb' })); // limit body size
app.use(cookieParser());

app.use('/uploads', express.static('uploads'));

app.get('/api/health', (req, res) => {
    res.json({
        ok: true,
        mongoReadyState: require('mongoose').connection.readyState,
        timestamp: new Date().toISOString(),
    });
});

// ── Rate limiters ─────────────────────────────────────────────────────────────
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10,
    message: { message: 'Too many attempts. Please try again in 15 minutes.' },
    standardHeaders: true,
    legacyHeaders: false,
});

const apiLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 200,
    message: { message: 'Too many requests. Please slow down.' },
    standardHeaders: true,
    legacyHeaders: false,
});

app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);
app.use('/api/', apiLimiter);

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/products', require('./routes/products'));
app.use('/api/coupons', require('./routes/coupons'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/storage', require('./routes/storage'));
app.use('/api/auth', require('./routes/auth'));

// Optional routes — only load if files exist
try { app.use('/api/settings', require('./routes/settings')); } catch(e) {}
try { app.use('/api/whatsapp', require('./routes/whatsapp')); } catch(e) {}

// ── Global error handler ──────────────────────────────────────────────────────
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({ message: err.message || 'Internal server error' });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
