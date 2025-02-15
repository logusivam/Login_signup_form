/* /* login-form starts 
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const message = document.getElementById('message');

    // Example validation
    if (email === "admin@example.com" && password === "password123") {
        message.style.color = "green";
        message.textContent = "Login successful!";
    } else {
        message.style.color = "red";
        message.textContent = "Invalid email or password.";
    }
}); */

const isDev = false; 

    function logDebug(message) {
        if (!isDev) {
            console.log = () => {};
            console.warn = () => {};
            console.error = () => {};
        }
    }
    logDebug('Debugging in development mode');

const togglePassword = document.getElementById("togglePassword");
const passwordInput = document.getElementById("password");
const beamEffect = document.getElementById("beamEffect");
const eyeIcon = document.getElementById("eyeIcon");

togglePassword.addEventListener("click", () => {
    const isPassword = passwordInput.getAttribute("type") === "password";

    // Toggle password visibility
    passwordInput.setAttribute("type", isPassword ? "text" : "password");

    // Toggle eye icon (open/close)
    eyeIcon.classList.toggle("fa-eye");
    eyeIcon.classList.toggle("fa-eye-slash");

    // Toggle beam effect visibility
    if (isPassword) {
        beamEffect.style.width = "calc(100% - 35px)"; /* Expand beam */
        beamEffect.style.visibility = "visible";
        passwordInput.classList.add("focus-light"); /* Add glowing effect */
        setTimeout(() => {
            passwordInput.classList.add("show-text"); /* Gradually reveal text */
        }, 200); // Sync delay with beam expansion
    } else {
        beamEffect.style.width = "0"; /* Collapse beam */
        beamEffect.style.visibility = "hidden";
        passwordInput.classList.remove("focus-light");
        passwordInput.classList.remove("show-text"); /* Hide text */
    }
});

// Function to detect Caps Lock and show alert
function handleCapsLock(event, inputId, alertId) {
    let capsLockAlert = document.getElementById(alertId);

    // Safeguard: Ensure capsLockAlert exists
    if (!capsLockAlert) {
        console.error(`Alert element with ID "${alertId}" not found.`);
        return;
    }

    // Safeguard: Check if event.getModifierState exists
    if (typeof event.getModifierState === "function") {
        // Check if Caps Lock is on or off
        if (event.getModifierState("CapsLock")) {
            capsLockAlert.textContent = "Caps Lock is ON";
            capsLockAlert.classList.add("visible");
        } else {
            capsLockAlert.textContent = "Caps Lock is OFF";
            capsLockAlert.classList.remove("visible");
        }
    } else {
        console.warn("getModifierState is not supported in this browser.");
    }
}

// Add event listeners to email and password fields
document.getElementById("email").addEventListener("keydown", function(event) {
    handleCapsLock(event, "email", "emailCapsLockAlert");
});

document.getElementById("password").addEventListener("keydown", function(event) {
    handleCapsLock(event, "password", "passwordCapsLockAlert");
});


const loginForm = document.getElementById('loginForm');

loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const keepSignedIn = document.getElementById('keepSignedIn').checked;     // Check "Keep Me Signed In"
    const messageElement = document.getElementById('message'); // Get the message element
    const apiUrl = process.env.API_URL;



    try {
        const response = await fetch(`${apiUrl}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password, keepSignedIn }),
        });

        const result = await response.json();

        if (response.ok) {
             // Success: display green message
             messageElement.textContent = result.message;
             messageElement.style.color = 'green'; // Success color

            // Store the JWT token
            if (keepSignedIn) {
                localStorage.setItem('token', result.token); // Store in localStorage for persistent login
            } else {
                sessionStorage.setItem('token', result.token); // Store in sessionStorage for temporary login
            }

            // Redirect to another page on successful login
            window.location.href = 'https://github.com/logusivam';
        } else {
            // Failure: display red message
            messageElement.textContent = result.message;
            messageElement.style.color = 'red'; // Failure color
        }
    } catch (error) {
        console.error('Error:', error);
        messageElement.textContent = 'Something went wrong. Please try again.';
        messageElement.style.color = 'red'; // Failure color
    }
});

//secure token automatically
const token = localStorage.getItem('token') || sessionStorage.getItem('token');
const apiUrl = process.env.API_URL;

if (token) {
    fetch(`${apiUrl}/api/auth/protected`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));
}
//to check auto-login
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');

    if (token) {
        console.log('User is already logged in');
        window.location.href = 'https://github.com/logusivam'; // Redirect or perform any action
    }
});

/* login-form ends */
 

