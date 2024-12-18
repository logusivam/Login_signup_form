const express = require('express');
const { signup, verifyOTP } = require('../controllers/authController');
const router = express.Router();
//const User = require('../models/User');  Import User model

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
 

router.post('/signup', signup);
/* router.post('/verify-otp', verifyOTP); */

module.exports = router;
