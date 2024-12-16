
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