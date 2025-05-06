// File: metal_admin.js - For metal_admin.html (Full CRUD)

const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbw27yZv7a1-b83l2eSqBhtFAwrlRvQkbi7rhxTJpqnXbPOLULyEeiRToO46Aoy_SP3j/exec'; // <-- PASTE URL HERE

// --- DOM Elements ---
const form = document.getElementById('metalForm');
const recordIdInput = document.getElementById('recordId'); // Needed for Admin
const userNameInput = document.getElementById('b1');
const phoneNameInput = document.getElementById('phoneNameInput');
const metalNameInput = document.getElementById('b2');
const priceInput = document.getElementById('b3');
const cityInput = document.getElementById('b4');
const submitButton = document.getElementById('submitButton');
const tableBody = document.getElementById('metalTableBody');
const statusMessage = document.getElementById('statusMessage');

// --- Functions --- (Include ALL functions: showStatus, resetForm, renderTable (with actions), fetchAndDisplayData, handleFormSubmit, handleEdit, handleDelete)

function showStatus(message, isError = false) { /* ... */
    statusMessage.textContent = message; statusMessage.className = isError ? 'status-message error' : 'status-message success';
    setTimeout(() => { statusMessage.textContent = ''; statusMessage.className = 'status-message'; }, 5000); }
function resetForm() { /* ... */
    form.reset(); recordIdInput.value = ''; submitButton.textContent = 'Submit'; submitButton.disabled = false; }

function renderTable(data) { // Renders table WITH Action buttons
    tableBody.innerHTML = '';
    if (!data || data.length === 0) { tableBody.innerHTML = '<tr><td colspan="5" style="text-align:center;">No records found.</td></tr>'; return; } // Colspan=5
    data.forEach(record => {
        const row = tableBody.insertRow();
        row.insertCell().textContent = record.userName; row.insertCell().textContent = record.phoneName; row.insertCell().textContent = record.metalName;
        row.insertCell().textContent = record.price; row.insertCell().textContent = record.city;
        const actionsCell = row.insertCell(); actionsCell.style.textAlign = 'center'; // Actions Cell
        // Edit Button
        const editButton = document.createElement('button'); editButton.textContent = 'Edit'; editButton.classList.add('edit');
        editButton.dataset.id = record.recordId; editButton.addEventListener('click', handleEdit); actionsCell.appendChild(editButton);
        // Delete Button
        const deleteButton = document.createElement('button'); deleteButton.textContent = 'Delete'; deleteButton.classList.add('delete');
        deleteButton.dataset.id = record.recordId; deleteButton.addEventListener('click', handleDelete); actionsCell.appendChild(deleteButton);
    });
}

async function fetchAndDisplayData() { /* ... */
    showStatus("Loading data...", false); try { const response = await fetch(SCRIPT_URL); if (!response.ok) throw new Error(`Network error: ${response.statusText}`);
    const result = await response.json(); if (result.status === 'success') { renderTable(result.data); showStatus("Data loaded.", false); }
    else { throw new Error(result.message || "Failed to load data."); } } catch (error) { console.error('Error fetching data:', error);
    showStatus(`Error loading data: ${error.message}`, true); tableBody.innerHTML = `<tr><td colspan="5" style="text-align:center;">Error loading data.</td></tr>`; } } // Colspan=5

async function handleFormSubmit(event) { // Handles CREATE and UPDATE
    event.preventDefault();
    const recordId = recordIdInput.value; // Check hidden input
    const action = recordId ? 'update' : 'create';
    const formData = { action: action, recordId: recordId, userName: userNameInput.value.trim(), metalName: metalNameInput.value.trim(), price: priceInput.value, city: cityInput.value.trim() };
    // if (!formData.userName || !formData.metalName || formData.price === '' || !formData.city) { showStatus("Please fill in all fields.", true); return; }
    if (!formData.userName || !formData.metalName || !formData.phoneName || formData.price === '' || !formData.city) { // <-- ADDED: phoneName validation
        showStatus("Please fill in all fields.", true);
        return; // Stop submission if validation fails
    }
    submitButton.disabled = true; showStatus(action === 'create' ? "Adding record..." : "Updating record...", false);
    try { const encodedData = new URLSearchParams(formData).toString();
        const response = await fetch(SCRIPT_URL, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: encodedData });
        const result = await response.json(); if (result.status === 'success') { showStatus(result.message, false); resetForm(); fetchAndDisplayData(); }
        else { throw new Error(result.message || `Failed to ${action} record.`); }
    } catch (error) { console.error(`Error during ${action}:`, error); showStatus(`Error: ${error.message}`, true); submitButton.disabled = false; }
}

function handleEdit(event) { // Populates form for editing
    const button = event.target; const row = button.closest('tr'); const recordId = button.dataset.id;
    const userName = row.cells[0].textContent; const phoneName = row.cells[1].textContent ;const metalName = row.cells[2].textContent;
    const price = row.cells[3].textContent; const city = row.cells[4].textContent;
    recordIdInput.value = recordId; userNameInput.value = userName; phoneNameInput.value =phoneName ;metalNameInput.value = metalName;
    priceInput.value = price; cityInput.value = city; submitButton.textContent = 'Update';
    window.scrollTo({ top: 0, behavior: 'smooth' }); userNameInput.focus();
}

async function handleDelete(event) { // Handles deletion
    const button = event.target; const recordId = button.dataset.id; if (!recordId) return;
    if (!confirm(`Are you sure you want to delete this record?`)) return;
    showStatus("Deleting record...", false); button.disabled = true; const editButton = button.parentElement.querySelector('.edit'); if (editButton) editButton.disabled = true;
    const data = { action: 'delete', recordId: recordId };
    try { const encodedData = new URLSearchParams(data).toString();
        const response = await fetch(SCRIPT_URL, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: encodedData });
        const result = await response.json(); if (result.status === 'success') { showStatus(result.message, false); fetchAndDisplayData(); }
        else { throw new Error(result.message || "Failed to delete record."); }
    } catch (error) { console.error('Error deleting record:', error); showStatus(`Error: ${error.message}`, true); button.disabled = false; if (editButton) editButton.disabled = false; }
}

// --- Event Listeners ---
form.addEventListener('submit', handleFormSubmit);
document.addEventListener('DOMContentLoaded', fetchAndDisplayData);
console.log("Admin script loaded.");