const bcrypt = require('bcrypt');
const User = require('../models/User');
const { generateSecureOtp, hashOtp,  sendOtpEmail } = require('../utils/otp');
const jwt = require('jsonwebtoken');
const Otp = require('../models/Otp'); // OTP schema 

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
            return res.status(400).json({ message: 'User not registered.' });
        }

        // Check if the password matches
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({ message: 'Password doesn\'t match.' });
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

/* otp verification for the sign-up page starts */
// Send OTP
exports.sendOtp = async (req, res) => {
    const { email } = req.body;
    
    try {
        const otp = generateSecureOtp();
        const hashedOtp = hashOtp(otp);
        
        await Otp.findOneAndUpdate(
            { email },
            { otp: hashedOtp, expiresAt: Date.now() + 5 * 60 * 1000 }, // Expires in 5 minutes
            { upsert: true, new: true }
        );
        
        await sendOtpEmail(email, otp); // Send OTP via email utility
        
        res.status(200).json({ message: 'OTP sent successfully!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to send OTP.' });
    }
};

// Verify OTP
exports.verifyOtp = async (req, res) => {
    const { email, otp } = req.body;
    
    try {
        const record = await Otp.findOne({ email });
        
        if (!record) {
            return res.status(400).json({ message: 'OTP not found.' });
        }
        
        const hashedOtp = hashOtp(otp);
        if (hashedOtp !== record.otp) {
            return res.status(400).json({ message: 'Invalid OTP.' });
        }
        
        if (Date.now() > record.expiresAt) {
            return res.status(400).json({ message: 'OTP expired.' });
        }
        
        await Otp.deleteOne({ email }); // Remove OTP after successful verification
        
        res.status(200).json({ message: 'OTP verified successfully!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to verify OTP.' });
    }
};

// Resend OTP
exports.resendOtp = async (req, res) => {
    const { email } = req.body;

    try {
        const otp = generateSecureOtp();
        const hashedOtp = hashOtp(otp);
        
        await Otp.findOneAndUpdate(
            { email },
            { otp: hashedOtp, expiresAt: Date.now() + 5 * 60 * 1000 }, // OTP expires in 5 minutes
            { upsert: true, new: true }
        );
        
        await sendOtpEmail(email, otp); // Send OTP via email utility
        
        res.status(200).json({ message: 'OTP resent successfully!' });
    } catch (error) {
        console.error('Error resending OTP:', error.message || error);
        res.status(500).json({ message: 'Failed to resend OTP.', error: error.message });
    }
};
/* otp verification for the sign-up page ends */


/* otp verification for the forget-password page starts */
// Step 1: Verify Email and Send OTP
exports.sendForgetPasswordOtp = async (req, res) => { 
    console.log('Request Body:', req.body); // Debug log
    const { email } = req.body;
    
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'Email not found' });
        }
        
        const otp = generateSecureOtp();
        const hashedOtp = hashOtp(otp);

        await Otp.findOneAndUpdate(
            { email },
            { otp: hashedOtp, expiresAt: Date.now() + 5 * 60 * 1000 },
            { upsert: true, new: true }
        );
        
        await sendOtpEmail(email, otp); // Send plain OTP via email
        
        res.status(200).json({ message: 'OTP sent to your email.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to send OTP for password reset.' });
    }
};

// Step 2: Verify OTP
exports.verifyForgetPasswordOtp = async (req, res) => {
    const { email, otp } = req.body;

    try {
        const record = await Otp.findOne({ email });
        if (!record) {
            return res.status(400).json({ message: 'OTP not found.' });
        }

        const hashedOtp = hashOtp(otp);
        if (hashedOtp !== record.otp) {
            return res.status(400).json({ message: 'Invalid OTP.' });
        }

        if (Date.now() > record.expiresAt) {
            return res.status(400).json({ message: 'OTP expired.' });
        }

        await Otp.deleteOne({ email }); // Clear OTP record

        res.status(200).json({ message: 'OTP verified successfully!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to verify OTP.' });
    }
};
/* otp verification for the forget-password page ends */

/* 
// Step 3: Send Password via Email
exports.sendPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        await sendOtpEmail(email, `Your password is: ${user.password}`);

        res.status(200).json({ message: 'Password sent to your email.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to send password.' });
    }
};
 */

/* update password for the forget-password page starts*/
// Update Password After Verification
exports.updatePassword = async (req, res) => {
    const { email, newPassword } = req.body;

    try {
        // Check if email and newPassword are provided
        if (!email || !newPassword) {
            return res.status(400).json({ message: 'Email and new password are required.' });
        }
        
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        
        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        
        // Update user's password
        user.password = hashedPassword;
        await user.save();
        
        res.status(200).json({ message: 'Password updated successfully.' });
    } catch (error) {
        console.error('Error updating password:', error);
        res.status(500).json({ message: 'Failed to update password.' });
    }
};

/* update password for the forget-password page ends*/
