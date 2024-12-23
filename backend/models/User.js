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

// Method to compare passwords
userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};



 module.exports = mongoose.model('User', userSchema);

const otpSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    otp: { type: String, required: true }, // Hashed OTP
    expiresAt: { type: Date, required: true },
});

const OTP = mongoose.model('OTP', otpSchema);

module.exports = OTP;
