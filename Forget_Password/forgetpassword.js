const emailInput = document.getElementById('email');
const verifyBtn = document.getElementById('sendOtpBtn');
const otpInput = document.querySelectorAll('.otp-digit');
const verifyOtpBtn = document.getElementById('verifyOtpBtn');/* 
const sendPasswordBtn = document.getElementById('sendPasswordBtn'); */
const statusText = document.getElementById('status');
const newPasswordSection = document.getElementById('newPasswordSection');

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

// Send OTP
verifyBtn.addEventListener('click', async () => {
    const email = emailInput.value;

    try {
        let response = await fetch('http://localhost:5000/api/auth/forget-password/send-otp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });

        let data = await response.json();
        statusText.textContent = data.message;

        if (response.ok) {
            statusText.style.color = 'green'; // Success message in green
            otpInput.forEach(input => input.disabled = false);
            verifyOtpBtn.classList.add('enabled');
            verifyOtpBtn.disabled = false;
        } else {
            statusText.style.color = 'red'; // Error message in red
        }
    } catch (error) {
        console.error(error);
        statusText.textContent = 'Error sending OTP';
        statusText.style.color = 'red'; // Catch block error in red
    }
});

// Verify OTP
verifyOtpBtn.addEventListener('click', async () => {
    const email = emailInput.value;
    const otp = Array.from(otpInput).map(input => input.value).join('');

    try {
        let response = await fetch('http://localhost:5000/api/auth/forget-password/verify-otp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, otp })
        });

        let data = await response.json();
        statusText.textContent = data.message;

        if (response.ok) {
            newPasswordSection.classList.remove('hidden');
            statusText.style.color = 'green'; // Success message in green
            /* sendPasswordBtn.disabled = false; */
        } else {
            statusText.style.color = 'red'; // Error message in red
        }
    } catch (error) {
        console.error(error);
        statusText.textContent = 'Error verifying OTP';
        statusText.style.color = 'red'; // Error in red for exception
    }
});

/* 
// Send Password
sendPasswordBtn.addEventListener('click', async () => {
    const email = emailInput.value;

    try {
        let response = await fetch('http://localhost:5000/api/auth/forget-password/send-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });

        let data = await response.json();
        statusText.textContent = data.message;

        if (response.ok) {
            statusText.style.color = 'green'; // Success message in green
        } else {
            statusText.style.color = 'red'; // Failure message in red
        }
    } catch (error) {
        console.error(error);
        statusText.textContent = 'Error sending password';
        statusText.style.color = 'red'; // Error message in red
    }
});
 */
