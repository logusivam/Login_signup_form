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

document.getElementById("password").addEventListener("keydown", function(event) {
    handleCapsLock(event, "password", "passwordCapsLockAlert");
});


const loginForm = document.getElementById('loginForm');

        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const result = await response.json();

            if (response.ok) {
                document.getElementById('message').textContent = result.message;
                // Redirect to another page on successful login
                window.location.href = 'https://github.com/logusivam';
            } else {
                document.getElementById('message').textContent = result.message;
            }
        });
/* login-form ends */
 

