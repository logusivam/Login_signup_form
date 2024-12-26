const express = require('express');
const { signup, loginUser, sendOtp, verifyOtp,  resendOtp
        } = require('../controllers/authController'); 
const { sendForgetPasswordOtp, verifyForgetPasswordOtp, updatePassword, sendPassword } = require('../controllers/authController'); 
const router = express.Router();
const verifyToken = require('../utils/authMiddleware');

//sign-up page 
router.post('/signup', signup);
router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);
router.post('/resend-otp', resendOtp);

// login route 
router.post('/login', loginUser);
// Example of a protected route
router.get('/protected', verifyToken, (req, res) => {
    res.status(200).json({ message: 'You have accessed a protected route!', user: req.user });
});



// Forget Password Routes

router.post('/forget-password/send-otp', sendForgetPasswordOtp); 

router.post('/forget-password/verify-otp', verifyForgetPasswordOtp);

// Update Password Route
router.post('/update-password', updatePassword);
/* 
router.post('/forget-password/send-password', sendPassword); */

module.exports = router;
