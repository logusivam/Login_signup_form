const emailInput = document.getElementById('email');
const verifyBtn = document.getElementById('verify-btn');
const otpInputs = document.querySelectorAll('.otp-digit');

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
otpInputs.forEach((input, index) => {
    input.addEventListener('input', (e) => {
        if (e.target.value && index < otpInputs.length - 1) {
            otpInputs[index + 1].focus();
        }
    });

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' && !e.target.value && index > 0) {
            otpInputs[index - 1].focus();
        }
    });
});
