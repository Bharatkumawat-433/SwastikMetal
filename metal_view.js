// File: metal_view.js - For metal_view.html (View Only)

const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbw27yZv7a1-b83l2eSqBhtFAwrlRvQkbi7rhxTJpqnXbPOLULyEeiRToO46Aoy_SP3j/exec'; // <-- PASTE URL HERE

// --- DOM Elements ---
// No form elements needed
const tableBody = document.getElementById('metalTableBody');
const statusMessage = document.getElementById('statusMessage');

// --- Functions --- (Include only showStatus, renderTable (no actions), fetchAndDisplayData)

function showStatus(message, isError = false) { /* ... */
    statusMessage.textContent = message; statusMessage.className = isError ? 'status-message error' : 'status-message success';
    setTimeout(() => { statusMessage.textContent = ''; statusMessage.className = 'status-message'; }, 5000); }

function renderTable(data) { // Renders table WITHOUT Action buttons
    tableBody.innerHTML = '';
    if (!data || data.length === 0) { tableBody.innerHTML = '<tr><td colspan="4" style="text-align:center;">No records found.</td></tr>'; return; } // Colspan=4
    data.forEach(record => {
        const row = tableBody.insertRow();
        row.insertCell().textContent = record.userName;
        row.insertCell().textContent = record.phoneName;
        row.insertCell().textContent = record.metalName;
        row.insertCell().textContent = record.price;
        row.insertCell().textContent = record.city;
        // No Actions Cell here
    });
}

async function fetchAndDisplayData() { /* ... */
    showStatus("Loading data...", false); try { const response = await fetch(SCRIPT_URL); if (!response.ok) throw new Error(`Network error: ${response.statusText}`);
    const result = await response.json(); if (result.status === 'success') { renderTable(result.data); showStatus("Data loaded.", false); }
    else { throw new Error(result.message || "Failed to load data."); } } catch (error) { console.error('Error fetching data:', error);
    showStatus(`Error loading data: ${error.message}`, true); tableBody.innerHTML = `<tr><td colspan="4" style="text-align:center;">Error loading data.</td></tr>`; } } // Colspan=4

// --- Initial Load ---
document.addEventListener('DOMContentLoaded', fetchAndDisplayData);
console.log("View script loaded.");