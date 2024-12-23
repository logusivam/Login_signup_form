 const nodemailer = require('nodemailer');
const crypto = require('crypto');
const dotenv = require('dotenv');
dotenv.config();

// Generate Secure OTP
const generateSecureOtp = () => {
    return crypto.randomInt(1000, 9999).toString(); // Generates a 4-digit OTP securely
};

// Hash OTP with SHA256
const hashOtp = (otp) => {
    return crypto.createHash('sha256').update(otp).digest('hex');
};

 // directly sending maails code
// Email utility to send OTP
const sendOtpEmail = async (email, otp) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail', // Use your email provider (example: Gmail)
        auth: {
            user: process.env.EMAIL_USER, // Email address
            pass: process.env.EMAIL_PASS, // Email app password or credentials
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Your OTP for Verification',
        text: `Your OTP for email verification is: ${otp}. It will expire in 5 minutes.`,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`OTP sent successfully to ${email}`);
    } catch (error) {
        console.error('Error sending OTP:', error);
        throw error;
    }
};

module.exports = {  generateSecureOtp, hashOtp,  sendOtpEmail };
