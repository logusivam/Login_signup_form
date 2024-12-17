//Aadhaar validation
const aadhaarInput = document.getElementById("aadhaar");

aadhaarInput.addEventListener("input", function (e) {
    let value = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
    let formattedValue = "";

    // Loop to group digits into sets of 4
    for (let i = 0; i < value.length; i++) {
        if (i > 0 && i % 4 === 0) {
            formattedValue += " "; // Add space after every 4 digits
        }
        formattedValue += value[i];
    }

    // Update the input value with formatted string
    e.target.value = formattedValue.trim();
});

//aadhaar verify button
function enableVerifyButton() {
    const aadhaarInput = document.getElementById('aadhaar');
    const verifyButton = document.getElementById('verifyAadhaar');

    // Regular expression to check if Aadhaar number is in the format XXXX XXXX XXXX
    const aadhaarPattern = /^\d{4} \d{4} \d{4}$/;

    // Enable the button if Aadhaar number is correctly entered, else disable it
    if (aadhaarPattern.test(aadhaarInput.value)) {
        verifyButton.disabled = false;  // Enable button
        verifyButton.style.cursor = "pointer";  // Show pointer cursor when button is enabled
    } else {
        verifyButton.disabled = true;   // Disable button
        verifyButton.style.cursor = "not-allowed";  // Show disabled cursor
    }
}

//validate password
function validatePassword() {
    const passwordInput = document.getElementById("password");
    const passwordAlert = document.getElementById("passwordAlert");
    const password = passwordInput.value;

    // Define regular expressions for the password rules
    const lengthCheck = /.{8,}/;  // At least 8 characters
    const uppercaseCheck = /[A-Z]/;  // At least one uppercase
    const lowercaseCheck = /[a-z]/;  // At least one lowercase
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

    // Rule 4: Special character check
    if (!specialCharCheck.test(password)) {
        alertMessage += "• Password must contain at least one special character (!, @, #, $, %, ^, &, *).<br>";
    }

    // Rule 5: Disallowed special characters check
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

// check the password match
function checkPasswordsMatch() {
    const passwordInput = document.getElementById("password");
    const confirmPasswordInput = document.getElementById("confirmPassword");
    const confirmPasswordAlert = document.getElementById("confirmPasswordAlert");

    if (confirmPasswordInput.value === "") {
        confirmPasswordAlert.innerHTML = ""; // Clear message when confirm password is empty
        confirmPasswordInput.classList.remove("is-valid", "is-invalid");
        return;
    }

    // Check if passwords match
    if (passwordInput.value === confirmPasswordInput.value) {
        confirmPasswordAlert.innerHTML = "Passwords match!";
        confirmPasswordAlert.classList.remove("text-danger");
        confirmPasswordAlert.classList.add("text-success");
        confirmPasswordInput.classList.remove("is-invalid");
        confirmPasswordInput.classList.add("is-valid");
    } else {
        confirmPasswordAlert.innerHTML = "Passwords do not match!";
        confirmPasswordAlert.classList.remove("text-success");
        confirmPasswordAlert.classList.add("text-danger");
        confirmPasswordInput.classList.remove("is-valid");
        confirmPasswordInput.classList.add("is-invalid");
    }
}

// Password Field
const togglePassword = document.getElementById("togglePassword");
const passwordInput = document.getElementById("password");
const beamEffect = document.getElementById("beamEffect");
const eyeIcon = document.getElementById("eyeIcon");

// Confirm Password Field
const toggleConfirmPassword = document.getElementById("toggleConfirmPassword");
const confirmPasswordInput = document.getElementById("confirmPassword");
const confirmBeamEffect = document.getElementById("confirmBeamEffect");
const confirmEyeIcon = document.getElementById("confirmEyeIcon");

// Function to toggle visibility and beam effect
function togglePasswordVisibility(inputField, beam, eye) {
    const isPassword = inputField.getAttribute("type") === "password";

    // Toggle password visibility
    inputField.setAttribute("type", isPassword ? "text" : "password");

    // Toggle eye icon
    eye.classList.toggle("fa-eye");
    eye.classList.toggle("fa-eye-slash");

    // Toggle beam effect visibility
    if (isPassword) {
        beam.style.width = "calc(100% - 35px)"; /* Expand beam */
        beam.style.visibility = "visible";
        inputField.classList.add("focus-light"); /* Add glowing effect */
        setTimeout(() => {
            inputField.classList.add("show-text"); /* Gradually reveal text */
        }, 500);
    } else {
        beam.style.width = "0"; /* Collapse beam */
        beam.style.visibility = "hidden";
        inputField.classList.remove("focus-light");
        inputField.classList.remove("show-text"); /* Hide text */

        setTimeout(() => {
            inputField.classList.remove("show-text"); /* Hide text */
        }, 100); // Small delay before hiding
    }
}

// Event listeners for Password Field
togglePassword.addEventListener("click", () => {
    togglePasswordVisibility(passwordInput, beamEffect, eyeIcon);
});

// Event listeners for Confirm Password Field
toggleConfirmPassword.addEventListener("click", () => {
    togglePasswordVisibility(confirmPasswordInput, confirmBeamEffect, confirmEyeIcon);
});

// Function to detect Caps Lock and show alert
function handleCapsLock(event, inputId, alertId) {
    let capsLockAlert = document.getElementById(alertId);

    // Check if Caps Lock is on or off
    if (event.getModifierState("CapsLock")) {
        capsLockAlert.textContent = "Caps Lock is ON";
        capsLockAlert.classList.add("visible");
    } else {
        capsLockAlert.textContent = "Caps Lock is OFF";
        capsLockAlert.classList.remove("visible");
    }
}

// Add event listeners to email and password fields
document.getElementById("email").addEventListener("keydown", function(event) {
    handleCapsLock(event, "email", "emailCapsLockAlert");
});

// Add event listeners to passowrd and confirmpassword fields
document.getElementById("confirmPassword").addEventListener("keydown", function(event) {
    handleCapsLock(event, "confirmPassword", "confirmPasswordCapsLockAlert");
});

document.getElementById("password").addEventListener("keydown", function(event) {
    handleCapsLock(event, "password", "passwordCapsLockAlert");
});



document.getElementById('verifyText').addEventListener('change', function() {
    alert("You have selected Text Message for OTP verification.");
});

document.getElementById('verifyCall').addEventListener('change', function() {
    alert("You have selected Phone Call for OTP verification.");
});

// mobile number usage
// Initialize Bootstrap tooltips
var tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
var tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));