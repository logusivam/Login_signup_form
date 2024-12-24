const emailInput = document.getElementById('email');
const verifyBtn = document.getElementById('sendOtpBtn');
const otpInput = document.querySelectorAll('.otp-digit');
const verifyOtpBtn = document.getElementById('verifyOtpBtn');
const sendPasswordBtn = document.getElementById('sendPasswordBtn');
const statusText = document.getElementById('status');

// Enable Verify Button if the Email is Valid
emailInput.addEventListener('input', () => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailPattern.test(emailInput.value)) {
        verifyBtn.classList.add('enabled');
        verifyBtn.disabled = false;
    } else {
        verifyBtn.classList.remove('enabled');
        verifyBtn.disabled = true;
    }
});

// Move focus to the next OTP input field
otpInput.forEach((input, index) => {
    input.addEventListener('input', (e) => {
        if (e.target.value && index < otpInput.length - 1) {
            otpInput[index + 1].focus();
        }
    });

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' && !e.target.value && index > 0) {
            otpInput[index - 1].focus();
        }
    });
});
