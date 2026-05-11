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

        // Migration: drop old unique index on name if it exists (replaced by name+gender compound)
        try {
            const db = mongoose.connection.db;
            const categoryCol = db.collection('categories');
            const indexes = await categoryCol.indexes();
            const oldIndex = indexes.find(i => i.name === 'name_1' && i.unique);
            if (oldIndex) {
                await categoryCol.dropIndex('name_1');
                console.log('Dropped old name_1 unique index on categories');
            }
            // Set gender='Both' for any categories missing it
            await categoryCol.updateMany(
                { gender: { $exists: false } },
                { $set: { gender: 'Both' } }
            );
        } catch (migrationErr) {
            console.warn('Category index migration skipped:', migrationErr.message);
        }
    } catch (err) {
        console.error(`MongoDB connection failed: ${err.message}`);

        if (String(err.message).includes('querySrv')) {
            console.error('MongoDB SRV lookup failed. If your network blocks SRV DNS, set MONGO_URI_DIRECT to the standard Atlas connection string.');
        }

        console.log('Proceeding without Database connection...');
    }
};

module.exports = connectDB;
