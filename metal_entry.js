// File: metal_entry.js - For metal_entry.html (Insert Only)

const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyiPPZzBG30vvj6uazWojDcS1RJGj6HN6haX4odvSWy6dxbLHcHojYjQhxSm_QP1UlMTQ/exec'; // <-- PASTE URL HERE

// --- DOM Elements ---
const form = document.getElementById('metalForm');
// No recordIdInput needed
const userNameInput = document.getElementById('b1');
const metalNameInput = document.getElementById('b2');
const priceInput = document.getElementById('b3');
const cityInput = document.getElementById('b4');
const submitButton = document.getElementById('submitButton');
const statusMessage = document.getElementById('statusMessage');
// No tableBody needed

// --- Functions --- (Include only showStatus, resetForm, handleFormSubmit (create only))

function showStatus(message, isError = false) { /* ... */
    statusMessage.textContent = message; statusMessage.className = isError ? 'status-message error' : 'status-message success';
    setTimeout(() => { statusMessage.textContent = ''; statusMessage.className = 'status-message'; }, 5000); }
function resetForm() { /* ... */
    form.reset(); submitButton.disabled = false; /* No need to reset button text */ }

async function handleFormSubmit(event) { // Handles CREATE only
    event.preventDefault();
    const action = 'create'; // Action is always create
    // No recordId needed in formData
    const formData = { action: action, userName: userNameInput.value.trim(), metalName: metalNameInput.value.trim(), price: priceInput.value, city: cityInput.value.trim() };
    if (!formData.userName || !formData.metalName || formData.price === '' || !formData.city) { showStatus("Please fill in all fields.", true); return; }
    submitButton.disabled = true; showStatus("Adding record...", false);
    try { const encodedData = new URLSearchParams(formData).toString();
        const response = await fetch(SCRIPT_URL, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: encodedData });
        const result = await response.json(); if (result.status === 'success') { showStatus(result.message, false); resetForm(); /* No table refresh needed */ }
        else { throw new Error(result.message || `Failed to add record.`); }
    } catch (error) { console.error(`Error during ${action}:`, error); showStatus(`Error: ${error.message}`, true); submitButton.disabled = false; }
}

// --- Event Listeners ---
form.addEventListener('submit', handleFormSubmit);
console.log("Entry script loaded.");
// No initial data fetch needed