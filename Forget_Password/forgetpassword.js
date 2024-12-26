const emailInput = document.getElementById('email');
const verifyBtn = document.getElementById('sendOtpBtn');
const otpInput = document.querySelectorAll('.otp-digit');
const verifyOtpBtn = document.getElementById('verifyOtpBtn');/* 
const sendPasswordBtn = document.getElementById('sendPasswordBtn'); */
const statusText = document.getElementById('status');
const newPasswordSection = document.getElementById('newPasswordSection');
const submitPasswordBtn = document.getElementById('submitPasswordBtn');
const newPasswordInput = document.getElementById('newPassword');
const togglePassword = document.getElementById('togglePassword');

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

//password toggle
togglePassword.addEventListener('click', () => {
    const type = newPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    newPasswordInput.setAttribute('type', type);

    // Toggle eye icon
    togglePassword.textContent = type === 'password' ? '👁️' : '🙈';
});

//validate password
function validatePassword() {
    const passwordInput = document.getElementById("newPassword");
    const passwordAlert = document.getElementById("passwordAlert");
    const password = passwordInput.value;

    // Define regular expressions for the password rules
    const lengthCheck = /.{8,}/;  // At least 8 characters
    const uppercaseCheck = /[A-Z]/;  // At least one uppercase
    const lowercaseCheck = /[a-z]/;  // At least one lowercase
    const numericCheck = /[0-9]/; // At least one numeric value
    const allowedSpecialCharCheck = /[^\w\d!@#\$%^&*]/;  // Excluded special characters
    const specialCharCheck = /[!@#\$%^&*]/;  // Only allowed special characters
    
    let alertMessage = "";

    // Rule 1: Length check
    if (!lengthCheck.test(password)) {
        alertMessage += "• Password must be at least 8 characters long.<br>";
    }

    // Rule 2: Uppercase letter check
    if (!uppercaseCheck.test(password)) {
        alertMessage += "• Password must contain at least one uppercase letter.<br>";
    }

    // Rule 3: Lowercase letter check
    if (!lowercaseCheck.test(password)) {
        alertMessage += "• Password must contain at least one lowercase letter.<br>";
    }

    // Rule 4: Numeric value check
    if (!numericCheck.test(password)) {
        alertMessage += "• Password must contain at least one numeric value.<br>";
    }

    // Rule 5: Special character check
    if (!specialCharCheck.test(password)) {
        alertMessage += "• Password must contain at least one special character (!, @, #, $, %, ^, &, *).<br>";
    }

    // Rule 6: Disallowed special characters check
    if (allowedSpecialCharCheck.test(password)) {
        alertMessage += "• Password contains disallowed special characters.<br>";
    }

    // Update the alert message below the input field
    passwordAlert.innerHTML = alertMessage;

    // Change border color for visual feedback
    if (alertMessage === "") {
        passwordInput.classList.remove("is-invalid");
        passwordInput.classList.add("is-valid");
        passwordAlert.classList.remove("text-danger");
        passwordAlert.classList.add("text-success");
        passwordAlert.innerHTML = "Password is strong!";
    } else {
        passwordInput.classList.remove("is-valid");
        passwordInput.classList.add("is-invalid");
        passwordAlert.classList.remove("text-success");
        passwordAlert.classList.add("text-danger");
    }
}

// Caps Lock Detection
function handleCapsLock(event, inputId, alertId) {
    let capsLockAlert = document.getElementById(alertId);

    if (!capsLockAlert) {
        console.error(`Alert element with ID "${alertId}" not found.`);
        return;
    }

    if (typeof event.getModifierState === "function") {
        if (event.getModifierState("CapsLock")) {
            capsLockAlert.textContent = "Caps Lock is ON";
            capsLockAlert.classList.add("visible");
        } else {
            capsLockAlert.textContent = "";
            capsLockAlert.classList.remove("visible");
        }
    } else {
        console.warn("getModifierState is not supported in this browser.");
    }
}

/* otp verification for the forget-password page starts */
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
            otpInput.forEach(input => input.disabled = true);
            verifyOtpBtn.classList.remove('enabled');
            verifyOtpBtn.disabled = true;
        } else {
            statusText.style.color = 'red'; // Error message in red
        }
    } catch (error) {
        console.error(error);
        statusText.textContent = 'Error verifying OTP';
        statusText.style.color = 'red'; // Error in red for exception
    }
});
/* otp verification for the forget-password page ends */

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

/* password update for the forget-password page starts */
submitPasswordBtn.addEventListener('click', async () => {
    const email = emailInput.value.trim();
    const newPassword = newPasswordInput.value.trim();

    if (!email || !newPassword) {
        alert('Please enter both email and new password.');
        return;
    }

    try {
        const response = await fetch('http://localhost:5000/api/auth/update-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, newPassword }),
        });

        const data = await response.json();
        if (response.ok) {
            alert(data.message);
        } else {
            alert(`Error: ${data.message}`);
        }
    } catch (error) {
        console.error('Failed to update password:', error);
        alert('Failed to update password. Please try again later.');
    }
});

/* password update for the forget-password page ends */
