const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    country: { type: String },
    birthday: { type: String },
    aadhaar: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    mobile: { type: String, required: true },
    countryCode: { type: String },
    verificationMethod: { type: String },/* 
    receiveAnnounceEmails: { type: Boolean, default: false },
    receiveRecommEmails: { type: Boolean, default: false }, */
}, { timestamps: true });

const userSchema1 = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});



 module.exports = mongoose.model('User', userSchema);

/*const otpSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    otp: { type: String, required: true },
    expiresAt: { type: Date, required: true },
});

const OTP = mongoose.model('OTP', otpSchema);

module.exports = OTP; */
