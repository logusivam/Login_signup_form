const bcrypt = require('bcrypt');
const User = require('../models/User');
const { generateOTP, sendOTPEmail } = require('../utils/otp');
const jwt = require('jsonwebtoken');

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
        /* const otp = generateOTP();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000); */ // Expires in 10 minutes

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
        /* await sendOTPEmail(email, otp); */

        res.status(201).json({ message: 'Signup successful! OTP sent to email.' });
    } catch (error) {
        console.error('Error during signup:', error.message || error);
        res.status(500).json({ message: 'Error signing up', error: error.message || error });
    }
};

// Login Logic
exports.loginUser = async (req, res) => {
    const { email, password, keepSignedIn } = req.body; // Added keepSignedIn flag

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    try {
        // Check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials.' });
        }

        // Check if the password matches
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({ message: 'Invalid credentials.' });
        }

        // Generate JWT Token
        const token = jwt.sign(
            { id: user._id, email: user.email }, 
            process.env.JWT_SECRET, 
            { expiresIn: keepSignedIn ? '7d' : '1h' } // Token expiry: 7 days if "keep me signed in" is checked
        );

        return res.status(200).json({
            message: 'Login successful',
            token: token, // Return token to client
            user: { 
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};



// Verify OTP Logic
/* exports.verifyOTP = async (req, res) => {
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
}; */
