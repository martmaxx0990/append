// Countdown Timer
function startCountdown(endDate) {
    const daysSpan = document.getElementById("days");
    const hoursSpan = document.getElementById("hours");
    const minutesSpan = document.getElementById("minutes");
    const secondsSpan = document.getElementById("seconds");

    function updateTimer() {
        const now = new Date().getTime();
        const distance = endDate - now;

        if (distance < 0) {
            clearInterval(timerInterval);
            // Optionally hide the banner if it exists
            const promoBanner = document.querySelector(".promo-banner");
            if (promoBanner) promoBanner.style.display = "none";
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Ensure elements exist before updating
        if (daysSpan) daysSpan.textContent = String(days).padStart(2, "0");
        if (hoursSpan) hoursSpan.textContent = String(hours).padStart(2, "0");
        if (minutesSpan) minutesSpan.textContent = String(minutes).padStart(2, "0");
        if (secondsSpan) secondsSpan.textContent = String(seconds).padStart(2, "0");
    }

    // Check if timer elements exist before starting
    if (daysSpan && hoursSpan && minutesSpan && secondsSpan) {
        const timerInterval = setInterval(updateTimer, 1000);
        updateTimer(); // Initial call
    } else {
        console.warn("Countdown timer elements not found.");
    }
}

// Set countdown end date (adjust as needed) - Only if promo banner exists
if (document.querySelector(".promo-banner")) {
    const countdownEndDate = new Date().getTime() + (1 * 24 * 60 * 60 * 1000) + (17 * 60 * 60 * 1000) + (26 * 60 * 1000) + (34 * 1000);
    startCountdown(countdownEndDate);
}

// Email Form Elements
const emailForm = document.getElementById("email-form");
const emailInput = emailForm ? emailForm.querySelector("input[type=\"email\"]") : null;

// Other CTA Buttons
const signupButton = document.getElementById("signup-button");
const stepsSignupButton = document.getElementById("steps-signup-button"); // Check if this exists

// Function to redirect to TotalVPN
function redirectToTotalVPN() {
    console.log("Redirecting to TotalVPN...");
    window.location.href = "https://url.totalvpn.com/680761271f458/click"; // Corrected URL
}

// Function to send email data to backend (fire and forget)
function sendEmailToServer(email) {
    console.log(`Sending email ${email} to server in background...`);
    fetch("/api/subscribe", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email }),
    })
    .then(response => response.json().then(data => ({ status: response.status, body: data })))
    .then(({ status, body }) => {
        if (status === 200 || status === 409) {
            console.log(`Server response for ${email}: ${body.message}`);
        } else {
            console.error(`Server error for ${email}: ${status} - ${body.message || 'Unknown error'}`);
        }
    })
    .catch(error => {
        console.error(`Fetch error sending ${email} to server:`, error);
    });
}

// Event Listeners

// Email Form Submission Handler - UPDATED FOR IMMEDIATE REDIRECT
if (emailForm && emailInput) {
    emailForm.addEventListener("submit", function(event) {
        event.preventDefault(); // Prevent actual form submission
        const email = emailInput.value;
        
        // Basic client-side validation
        if (!email || !email.includes('@') || !email.includes('.')) {
            alert("Veuillez entrer une adresse email valide.");
            return; // Stop if invalid
        }

        // Disable button (optional, as redirect is immediate)
        const submitButton = emailForm.querySelector("button[type=\"submit\"]");
        if (submitButton) {
             submitButton.disabled = true;
             submitButton.textContent = "Redirection...";
        }

        // Send email to server in the background (fire and forget)
        sendEmailToServer(email);

        // --- IMMEDIATE REDIRECT --- 
        redirectToTotalVPN(); 
        // The code below this might not execute if redirect is fast enough
    });
} else {
    console.error("Email form or input not found.");
}


// Optional: Scroll to form on other CTA clicks
function scrollToEmailForm() {
    if (emailForm) {
        emailForm.scrollIntoView({ behavior: "smooth", block: "center" });
        if (emailInput) emailInput.focus();
    } else {
        console.error("Cannot scroll to email form: form not found.");
    }
}

if (signupButton) {
    signupButton.addEventListener("click", scrollToEmailForm);
}
// Check if stepsSignupButton exists before adding listener
if (stepsSignupButton) {
    stepsSignupButton.addEventListener("click", scrollToEmailForm);
}

// Modal logic is removed/commented out as it's not used with immediate redirect

