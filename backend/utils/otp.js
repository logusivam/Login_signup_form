 const nodemailer = require('nodemailer');
const crypto = require('crypto');
const dotenv = require('dotenv');
dotenv.config();

// Generate OTP
/* const generateOTP = () => {
    return crypto.randomInt(100000, 999999).toString(); // 6-digit OTP
}; */

// Send OTP Email
const sendOTPEmail = async (email, otp) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Your OTP for Account Verification',
        text: `Your OTP for email verification is: ${otp}. It will expire in 5 minutes.`,
    };

    await transporter.sendMail(mailOptions);
};

module.exports = { generateOTP, sendOTPEmail };


/*  directly sending maails code
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

module.exports = { sendOtpEmail };
 */