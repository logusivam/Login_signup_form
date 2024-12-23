const express = require('express');
const { signup, loginUser, sendOtp, verifyOtp } = require('../controllers/authController'); 
const router = express.Router();
const OTP = require('../models/User'); // OTP schema
const verifyToken = require('../utils/authMiddleware');
const { sendOtpEmail } = require('../utils/otp');
 //const User = require('../models/User'); Import User model

// Route to handle user signup
/* router.post('/signup', async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            country,
            birthday,
            aadhaar,
            email,
            password,
            mobile,
            countryCode,
            verificationMethod 
        } = req.body;

        // Validate required fields
        if (!firstName || !lastName || !email || !password || !mobile) {
            return res.status(400).json({ message: 'Please fill all required fields.' });
        }

        // Create a new user object
        const newUser = new User({
            firstName,
            lastName,
            country,
            birthday,
            aadhaar,
            email,
            password,
            mobile,
            countryCode,
            verificationMethod 
        });

        // Save the user to MongoDB
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully!' });
    } catch (error) {
        console.error('Error saving user:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
}); */

// Generate OTP and send to email by simple mail without any library
/* router.post('/send-otp', async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Email is required.' });
    }

    try {
        // Generate 4-digit OTP
        const otp = Math.floor(1000 + Math.random() * 9000).toString();

        // Set OTP expiration to 5 minutes
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

        // Store OTP in DB (replace existing OTP for the email)
        await OTP.findOneAndUpdate(
            { email },
            { otp, expiresAt },
            { upsert: true, new: true }
        );

        // Send OTP via email
        await sendOtpEmail(email, otp);

        return res.status(200).json({ message: 'OTP sent successfully.' });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ message: 'Failed to send OTP. Try again.' });
    }
});

// Verify OTP
router.post('/verify-otp', async (req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        return res.status(400).json({ message: 'Email and OTP are required.' });
    }

    try {
        const otpRecord = await OTP.findOne({ email });

        if (!otpRecord || otpRecord.otp !== otp) {
            return res.status(400).json({ message: 'Invalid OTP.' });
        }

        // Check expiration
        if (otpRecord.expiresAt < new Date()) {
            return res.status(400).json({ message: 'OTP expired.' });
        }

        // Delete OTP record after verification
        await OTP.deleteOne({ email });

        return res.status(200).json({ message: 'OTP verified successfully.' });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ message: 'OTP verification failed.' });
    }
}); */



router.post('/signup', signup);
router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);

// login route 
router.post('/login', loginUser);
// Example of a protected route
router.get('/protected', verifyToken, (req, res) => {
    res.status(200).json({ message: 'You have accessed a protected route!', user: req.user });
});
module.exports = router;
