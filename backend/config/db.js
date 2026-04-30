const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const mongoUri = process.env.MONGO_URI_DIRECT || process.env.MONGO_URI;

        if (!mongoUri) {
            throw new Error('MONGO_URI is not set. Make sure backend/.env is present and loaded.');
        }

        await mongoose.connect(mongoUri, {
            serverSelectionTimeoutMS: 10000,
        });

        console.log('MongoDB Connected...');
    } catch (err) {
        console.error(`MongoDB connection failed: ${err.message}`);

        if (String(err.message).includes('querySrv')) {
            console.error('MongoDB SRV lookup failed. If your network blocks SRV DNS, set MONGO_URI_DIRECT to the standard Atlas connection string.');
        }

        console.log('Proceeding without Database connection...');
    }
};

module.exports = connectDB;
