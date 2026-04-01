const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Middleware
<<<<<<< HEAD
app.use(cors());
=======
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000'], // Allow both frontend and admin
    credentials: true
}));
>>>>>>> 2fcbeb1 (Initial clean commit — WAVWAY e-commerce project)
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/products', require('./routes/products'));
app.use('/api/coupons', require('./routes/coupons'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/orders', require('./routes/orders'));
<<<<<<< HEAD
=======
app.use('/api/storage', require('./routes/storage'));
app.use('/api/auth', require('./routes/auth'));
>>>>>>> 2fcbeb1 (Initial clean commit — WAVWAY e-commerce project)

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
