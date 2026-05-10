const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const OtpSchema = new mongoose.Schema({
    email: { type: String, required: true, lowercase: true, trim: true },
    otpHash: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, expires: 600 }, // auto-delete after 10 min
});

OtpSchema.index({ email: 1 });

OtpSchema.statics.createOtp = async function (email) {
    const otp = String(Math.floor(100000 + Math.random() * 900000)); // 6-digit
    const otpHash = await bcrypt.hash(otp, 10);
    await this.deleteMany({ email }); // remove any previous OTP for this email
    await this.create({ email, otpHash });
    return otp;
};

OtpSchema.statics.verifyOtp = async function (email, otp) {
    const doc = await this.findOne({ email });
    if (!doc) return false;
    const match = await bcrypt.compare(otp, doc.otpHash);
    if (match) await doc.deleteOne();
    return match;
};

module.exports = mongoose.model('Otp', OtpSchema);
