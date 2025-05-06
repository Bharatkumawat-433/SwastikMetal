// // File: metal_entry.js - For metal_entry.html (Insert Only)

// const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyiPPZzBG30vvj6uazWojDcS1RJGj6HN6haX4odvSWy6dxbLHcHojYjQhxSm_QP1UlMTQ/exec'; // <-- PASTE URL HERE

// // --- DOM Elements ---
// const form = document.getElementById('metalForm');
// // No recordIdInput needed
// const userNameInput = document.getElementById('b1');
// const metalNameInput = document.getElementById('b2');
// const priceInput = document.getElementById('b3');
// const cityInput = document.getElementById('b4');
// const submitButton = document.getElementById('submitButton');
// const statusMessage = document.getElementById('statusMessage');
// // No tableBody needed

// // --- Functions --- (Include only showStatus, resetForm, handleFormSubmit (create only))

// function showStatus(message, isError = false) { /* ... */
//     statusMessage.textContent = message; statusMessage.className = isError ? 'status-message error' : 'status-message success';
//     setTimeout(() => { statusMessage.textContent = ''; statusMessage.className = 'status-message'; }, 5000); }
// function resetForm() { /* ... */
//     form.reset(); submitButton.disabled = false; /* No need to reset button text */ }

// async function handleFormSubmit(event) { // Handles CREATE only
//     event.preventDefault();
//     const action = 'create'; // Action is always create
//     // No recordId needed in formData
//     const formData = { action: action, userName: userNameInput.value.trim(), metalName: metalNameInput.value.trim(), price: priceInput.value, city: cityInput.value.trim() };
//     if (!formData.userName || !formData.metalName || formData.price === '' || !formData.city) { showStatus("Please fill in all fields.", true); return; }
//     submitButton.disabled = true; showStatus("Adding record...", false);
//     try { const encodedData = new URLSearchParams(formData).toString();
//         const response = await fetch(SCRIPT_URL, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: encodedData });
//         const result = await response.json(); if (result.status === 'success') { showStatus(result.message, false); resetForm(); /* No table refresh needed */ }
//         else { throw new Error(result.message || `Failed to add record.`); }
//     } catch (error) { console.error(`Error during ${action}:`, error); showStatus(`Error: ${error.message}`, true); submitButton.disabled = false; }
// }

// // --- Event Listeners ---
// form.addEventListener('submit', handleFormSubmit);
// console.log("Entry script loaded.");
// // No initial data fetch needed



// 17.51  05/05 new 

// File: metal_entry.js - For metal_entry.html (Insert Only - Updated with Phone Name)

// --- Configuration ---
// Replace with your actual Google Apps Script Web App URL
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbw27yZv7a1-b83l2eSqBhtFAwrlRvQkbi7rhxTJpqnXbPOLULyEeiRToO46Aoy_SP3j/exec'; // <-- PASTE YOUR DEPLOYED URL HERE

// --- DOM Elements ---
const form = document.getElementById('metalForm');
const userNameInput = document.getElementById('b1');
const metalNameInput = document.getElementById('b2');
const phoneNameInput = document.getElementById('phoneNameInput'); // <-- ADDED: Get the new input
const priceInput = document.getElementById('b3');
const cityInput = document.getElementById('b4');
const submitButton = document.getElementById('submitButton');
const statusMessage = document.getElementById('statusMessage');
// No tableBody needed for entry-only form

// --- Functions ---

/**
 * Displays a status message to the user.
 * @param {string} message The message to display.
 * @param {boolean} [isError=false] True if the message indicates an error.
 */
function showStatus(message, isError = false) {
    statusMessage.textContent = message;
    statusMessage.className = isError ? 'status-message error' : 'status-message success';
    // Clear message after 5 seconds
    setTimeout(() => {
        statusMessage.textContent = '';
        statusMessage.className = 'status-message';
    }, 5000);
}

/**
 * Resets the form fields and enables the submit button.
 */
function resetForm() {
    form.reset();
    submitButton.disabled = false;
    // No need to reset button text for entry-only
}

/**
 * Handles the form submission (Create action only).
 * Sends the form data to the Google Apps Script.
 * @param {Event} event The form submission event.
 */
async function handleFormSubmit(event) {
    event.preventDefault(); // Prevent default form submission

    const action = 'create'; // Action is always create for this form

    // Gather form data including the new phoneName field
    const formData = {
        action: action,
        userName: userNameInput.value.trim(),
        metalName: metalNameInput.value.trim(),
        phoneName: phoneNameInput.value.trim(), // <-- ADDED: Get phone name value
        price: priceInput.value, // Keep as is, validation might happen server-side or add parseFloat if needed
        city: cityInput.value.trim()
    };

    // Basic client-side validation (ensure fields are not empty)
    if (!formData.userName || !formData.metalName || !formData.phoneName || formData.price === '' || !formData.city) { // <-- ADDED: phoneName validation
        showStatus("Please fill in all fields.", true);
        return; // Stop submission if validation fails
    }

    const phoneRegex = /^\d{10}$/; // Regular expression for exactly 10 digits
    if (!phoneRegex.test(formData.phoneName)) {
        showStatus("Please enter a valid 10-digit phone number.", true);
        return; // Stop submission
    }

    submitButton.disabled = true; // Disable button during submission
    showStatus("Adding record...", false); // Show pending status

    try {
        // Encode data for x-www-form-urlencoded format
        const encodedData = new URLSearchParams(formData).toString();

        // Send data to the Google Apps Script
        const response = await fetch(SCRIPT_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: encodedData,
        });

        const result = await response.json(); // Parse the JSON response from the script

        if (result.status === 'success') {
            showStatus(result.message, false); // Show success message
            resetForm(); // Clear the form
            // No table refresh needed for entry-only form
        } else {
            // Throw an error if the script indicated failure
            throw new Error(result.message || `Failed to add record.`);
        }
    } catch (error) {
        console.error(`Error during ${action}:`, error);
        showStatus(`Error: ${error.message}`, true); // Show error message
        submitButton.disabled = false; // Re-enable button on error
    }
}

// --- Event Listeners ---
form.addEventListener('submit', handleFormSubmit); // Attach submit handler to the form

console.log("Entry script loaded (with Phone Name).");
// No initial data fetch needed for entry-only form

 
