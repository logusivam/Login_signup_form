const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    country: { type: String, required: true },
    birthday: {
        day: { type: Number, required: true },
        month: { type: String, required: true },
        year: { type: Number, required: true },
    },
    aadhaarNumber: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    mobileCode: { type: String, required: true },
    mobileNumber: { type: String, required: true },
    otp: { type: String, required: false },
    otpExpires: { type: Date, required: false },
    password: { type: String, required: true },
});

module.exports = mongoose.model('User', userSchema);
