const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const mongoose = require('mongoose');
const AdminUser = require('../models/AdminUser');

const ADMIN_EMAIL    = 'wavwayofficial@gmail.com';
const ADMIN_PASSWORD = 'admin@wavway';
const ADMIN_NAME     = 'Wavway Admin';

(async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        const existing = await AdminUser.findOne({ email: ADMIN_EMAIL });
        if (existing) {
            // Update password if already exists
            existing.password = ADMIN_PASSWORD; // pre-save hook will hash it
            await existing.save();
            console.log(`✅ Admin user updated: ${ADMIN_EMAIL}`);
        } else {
            await AdminUser.create({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD, name: ADMIN_NAME });
            console.log(`✅ Admin user created: ${ADMIN_EMAIL}`);
        }

        await mongoose.disconnect();
        console.log('Done.');
        process.exit(0);
    } catch (err) {
        console.error('❌ Error:', err.message);
        process.exit(1);
    }
})();
