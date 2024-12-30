const isDev = false;

    function logDebug(message) {
        if (!isDev) {
            console.log = () => {};
            console.warn = () => {};
            console.error = () => {};
        }
    }
    logDebug('Debugging in development mode');
 

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

function clearStatusTextAfterDelay(statusTextElement, delay = 5000) {
    setTimeout(() => {
        statusTextElement.textContent = '';
    }, delay);
}


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

// Validate Password
function validatePassword() {
    const passwordInput = document.getElementById("newPassword");
    const passwordAlert = document.getElementById("passwordAlert");
    const password = passwordInput.value;

    // Define password rules
    const lengthCheck = /.{8,}/; // At least 8 characters
    const uppercaseCheck = /[A-Z]/; // At least one uppercase letter
    const lowercaseCheck = /[a-z]/; // At least one lowercase letter
    const numericCheck = /[0-9]/; // At least one number
    const specialCharCheck = /[!@#\$%^&*]/; // At least one special character (!, @, #, $, %, ^, &, *)
    const disallowedSpecialCharCheck = /[^a-zA-Z0-9!@#\$%^&*]/; // Any disallowed special character

    let alertMessage = "";

    if (!lengthCheck.test(password)) {
        alertMessage += "• Password must be at least 8 characters long.<br>";
    }
    if (!uppercaseCheck.test(password)) {
        alertMessage += "• Password must contain at least one uppercase letter.<br>";
    }
    if (!lowercaseCheck.test(password)) {
        alertMessage += "• Password must contain at least one lowercase letter.<br>";
    }
    if (!numericCheck.test(password)) {
        alertMessage += "• Password must contain at least one numeric value.<br>";
    }
    if (!specialCharCheck.test(password)) {
        alertMessage += "• Password must contain at least one special character (!, @, #, $, %, ^, &, *).<br>";
    }
    if (disallowedSpecialCharCheck.test(password)) {
        alertMessage += "• Password contains disallowed special characters.<br>";
    }

    // Update feedback
    if (alertMessage === "") {
        passwordInput.classList.remove("is-invalid");
        passwordInput.classList.add("is-valid");
        passwordAlert.classList.remove("text-danger");
        passwordAlert.classList.add("text-success");
        passwordAlert.innerHTML = "✔️ Password is strong!";
    } else {
        passwordInput.classList.remove("is-valid");
        passwordInput.classList.add("is-invalid");
        passwordAlert.classList.remove("text-success");
        passwordAlert.classList.add("text-danger");
        passwordAlert.innerHTML = alertMessage;
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
            clearStatusTextAfterDelay(statusText);  // To remove the statusText after 5 sec
        } else {
            statusText.style.color = 'red'; // Error message in red
            clearStatusTextAfterDelay(statusText);
        }
    } catch (error) {
        console.error(error);
        statusText.textContent = 'Error sending OTP';
        statusText.style.color = 'red'; // Catch block error in red
        clearStatusTextAfterDelay(statusText);
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
            verifyBtn.classList.remove('enabled');
            verifyBtn.disabled = true;
            emailInput.disabled = true; 
            emailInput.classList.add('disabled-input');
            otpInput.forEach(input => input.disabled = true);
            verifyOtpBtn.disabled = true; 
            newPasswordSection.classList.remove('hidden');
            verifyOtpBtn.classList.remove('enabled'); 
            statusText.style.color = 'green'; // Success message in green
            clearStatusTextAfterDelay(statusText);
            /* sendPasswordBtn.disabled = false; */
        } else {
            statusText.style.color = 'red'; // Error message in red
            clearStatusTextAfterDelay(statusText);
        }
    } catch (error) {
        console.error(error);
        statusText.textContent = 'Error verifying OTP';
        statusText.style.color = 'red'; // Error in red for exception
        clearStatusTextAfterDelay(statusText);
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

    // Validation Steps
    if (!email) {
        statusText.textContent = 'Please enter your email first.';
        statusText.style.color = 'red';
        emailInput.focus(); 
        return;
    }

    if (!emailInput.disabled) {
        statusText.textContent = 'Please verify your email via OTP first.';
        statusText.style.color = 'red'; 
        return;
    }

    if (!newPassword) {
        statusText.textContent = 'Please enter a new password.';
        statusText.style.color = 'red'; 
        newPasswordInput.focus();
        return;
    }

    submitPasswordBtn.textContent = 'Submitting...';
    submitPasswordBtn.disabled = true;

    try {
        const response = await fetch('http://localhost:5000/api/auth/update-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, newPassword }),
        });
 
        const data = await response.json();
        statusText.textContent = data.message;

        if (response.ok) {
            newPasswordInput.disabled = true;
            submitPasswordBtn.classList.add('disabled');
            submitPasswordBtn.disabled = true;
            statusText.style.color = 'green'; // Success message in green
            clearStatusTextAfterDelay(statusText);

            // Reset the button text 
            setTimeout(() => {
                submitPasswordBtn.textContent = 'Submitted'; 
            }, 2000); // Adjust the delay as needed
        } else {
            statusText.style.color = 'red'; // Error message in red
            clearStatusTextAfterDelay(statusText);
            // Alert specifically if the password is the same
            if (data.message.includes('New password cannot be the same')) {
                statusText.textContent ='Your new password cannot be the same as the old password. Please choose a different password.';
                 
            }

            // Reset the button text 
            setTimeout(() => {
                submitPasswordBtn.textContent = 'Not Submitted'; 
                submitPasswordBtn.disabled = false;
            }, 2000); // Adjust the delay as needed
             
            setTimeout(() => {
                submitPasswordBtn.textContent = 'Submit'; 
                submitPasswordBtn.disabled = false;
            }, 4000);  
            
             
        }  
        
    } catch (error) {
        console.error('Failed to update password:', error); 
        statusText.textContent = 'Failed to update password. Please try again later.';
        statusText.style.color = 'red'; // Error in red for exception
        clearStatusTextAfterDelay(statusText);
        submitPasswordBtn.disabled = false;

        setTimeout(() => {
            submitPasswordBtn.textContent = 'Submit'; 
        }, 3000); // Adjust the delay as needed
    }

});



/* password update for the forget-password page ends */
