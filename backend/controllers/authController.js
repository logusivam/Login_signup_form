const bcrypt = require('bcrypt');
const User = require('../models/User');
const { generateOTP, sendOTPEmail } = require('../utils/otp');

// Signup Logic
exports.signup = async (req, res) => {
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

    try {
        // Check if all required fields are present
        if (!firstName || !lastName || !email || !password || !mobile) {
            return res.status(400).json({ message: 'Please provide all required fields.' });
        }

        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'User already exists' });

        // Generate OTP
        const otp = generateOTP();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // Expires in 10 minutes

        // Hash Password with bcrypt
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create User
        const user = new User({
            firstName,
            lastName,
            country,
            birthday,
            aadhaar,
            email, 
            password: hashedPassword,  // Save hashed password
            mobile,
            countryCode,
            verificationMethod,
            /* otp,
            otpExpires, */
        });

        await user.save();

        // Send OTP to email
        await sendOTPEmail(email, otp);

        res.status(201).json({ message: 'Signup successful! OTP sent to email.' });
    } catch (error) {
        console.error('Error during signup:', error.message || error);
        res.status(500).json({ message: 'Error signing up', error: error.message || error });
    }
};


// Verify OTP Logic
exports.verifyOTP = async (req, res) => {
    const { email, enteredOTP } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) return res.status(400).json({ message: 'User not found' });
        if (user.otp !== enteredOTP || user.otpExpires < new Date()) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        // OTP Verified: Clear OTP fields
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        res.status(200).json({ message: 'OTP verified successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Error verifying OTP', error });
    }
};
