// new 13.51  13-05-2025


// File: metal_entry_script.js

// --- Configuration ---
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbw27yZv7a1-b83l2eSqBhtFAwrlRvQkbi7rhxTJpqnXbPOLULyEeiRToO46Aoy_SP3j/exec'; // <-- PASTE YOUR DEPLOYED URL HERE

// --- DOM Elements ---
const form = document.getElementById('metalForm');
const userNameInput = document.getElementById('userName');
const phoneInput = document.getElementById('phoneInput');
const cityInput = document.getElementById('cityInput');
const metalEntriesContainer = document.getElementById('metalEntriesContainer');
const addMetalPairButton = document.getElementById('addMetalPairButton');
const submitButton = document.getElementById('submitButton');
const statusMessage = document.getElementById('statusMessage');

let metalEntryCounter = 0;

// --- Functions ---

/**
 * Displays a status message to the user.
 * @param {string} message The message to display.
 * @param {string} type Can be 'processing', 'success', 'error', or 'log'.
 * @param {boolean} [append=false] True to append to existing message, false to overwrite.
 */
function showStatus(message, type = 'log', append = false) {
    const newContent = document.createElement('div');
    newContent.textContent = message;

    if (!append) {
        statusMessage.innerHTML = ''; // Clear previous messages
    }
    statusMessage.appendChild(newContent);

    if (!append || type === 'processing' || type === 'success' || type === 'error') {
        statusMessage.className = 'status-message'; // Reset base class
        if (type === 'processing' || type === 'success' || type === 'error') {
            statusMessage.classList.add(type);
        }
    }
    statusMessage.style.opacity = '1';

    if (append && type === 'log') {
        setTimeout(() => {
            if (statusMessage.contains(newContent)) {
                newContent.remove();
                if (statusMessage.children.length === 0 && !statusMessage.classList.contains('processing') && !statusMessage.classList.contains('success') && !statusMessage.classList.contains('error')) {
                    statusMessage.style.opacity = '0';
                }
            }
        }, 8000);
    } else if (!append && (type !== 'processing' && type !== 'success' && type !== 'error') ) {
         setTimeout(() => {
            if (statusMessage.firstChild === newContent && statusMessage.children.length === 1) { // Ensure it's the only message
                statusMessage.innerHTML = '';
                statusMessage.className = 'status-message';
                statusMessage.style.opacity = '0';
            }
        }, 5000);
    }
}


function addMetalPair() {
    metalEntryCounter++;
    const entryId = metalEntryCounter;

    const pairDiv = document.createElement('div');
    pairDiv.className = 'metal-entry-pair';
    pairDiv.setAttribute('data-entry-id', entryId);

    const nameGroup = document.createElement('div');
    nameGroup.className = 'input-group';
    const nameLabel = document.createElement('label');
    nameLabel.setAttribute('for', `metalName_${entryId}`);
    nameLabel.textContent = `Metal Name ${entryId}:`;
    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.id = `metalName_${entryId}`;
    nameInput.name = `metalName_${entryId}`;
    nameInput.placeholder = 'e.g., Copper, SS 316';
    nameInput.required = true;
    nameGroup.appendChild(nameLabel);
    nameGroup.appendChild(nameInput);

    const priceGroup = document.createElement('div');
    priceGroup.className = 'input-group';
    const priceLabel = document.createElement('label');
    priceLabel.setAttribute('for', `metalPrice_${entryId}`);
    priceLabel.textContent = `Price Rs. ${entryId}:`;
    const priceInput = document.createElement('input');
    priceInput.type = 'number';
    priceInput.id = `metalPrice_${entryId}`;
    priceInput.name = `metalPrice_${entryId}`;
    priceInput.placeholder = 'Enter price (e.g., 500)';
    priceInput.required = true;
    priceInput.step = 'any';
    priceGroup.appendChild(priceLabel);
    priceGroup.appendChild(priceInput);

    const removeButtonContainer = document.createElement('div');
    removeButtonContainer.className = 'input-group remove-button-container';
    
    const removeButton = document.createElement('button');
    removeButton.type = 'button';
    removeButton.textContent = 'Remove';
    removeButton.className = 'control-button remove-metal-button';
    removeButton.addEventListener('click', function() {
        pairDiv.remove();
        if (metalEntriesContainer.children.length === 0) {
             metalEntryCounter = 0;
        }
    });
    removeButtonContainer.appendChild(removeButton);

    pairDiv.appendChild(nameGroup);
    pairDiv.appendChild(priceGroup);
    pairDiv.appendChild(removeButtonContainer);

    metalEntriesContainer.appendChild(pairDiv);
}

function resetForm() {
    userNameInput.value = '';
    phoneInput.value = '';
    cityInput.value = '';
    
    metalEntriesContainer.innerHTML = '';
    metalEntryCounter = 0;
    addMetalPair(); 
    
    submitButton.disabled = false;
    submitButton.textContent = 'Submit All Prices';
    submitButton.classList.remove('submit-success', 'submit-processing');
    
    statusMessage.innerHTML = '';
    statusMessage.className = 'status-message';
    statusMessage.style.opacity = '0';
}

async function handleFormSubmit(event) {
    event.preventDefault();

    submitButton.classList.remove('submit-success', 'submit-processing');
    submitButton.disabled = false; 
    submitButton.textContent = 'Submit All Prices';
    statusMessage.className = 'status-message';
    statusMessage.style.opacity = '0';

    const commonUserName = userNameInput.value.trim();
    const commonPhone = phoneInput.value.trim();
    const commonCity = cityInput.value.trim();

    if (!commonUserName || !commonPhone || !commonCity) {
        showStatus("Please fill in Name, Mobile no., and City.", 'error');
        return;
    }

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(commonPhone)) {
        showStatus("Please enter a valid 10-digit phone number.", 'error');
        return;
    }

    const metalPairs = metalEntriesContainer.querySelectorAll('.metal-entry-pair');
    if (metalPairs.length === 0) {
        showStatus("Please add at least one metal entry.", 'error');
        return;
    }

    submitButton.disabled = true;
    submitButton.textContent = 'Processing entries...';
    submitButton.classList.add('submit-processing');

    showStatus("Processing entries...", 'processing', false);

    let allSubmissionsAttempted = 0;
    let successfulEntries = 0;
    let failedEntries = 0;
    let batchLogMessages = []; // Still used to track errors for the failure case

    for (let i = 0; i < metalPairs.length; i++) {
        const pair = metalPairs[i];
        const metalNameInput = pair.querySelector('input[type="text"]');
        const priceInput = pair.querySelector('input[type="number"]');

        const metalName = metalNameInput.value.trim();
        const price = priceInput.value;

        if (!metalName || price === '') {
            // Log internally for failure case, but don't showStatus yet
            batchLogMessages.push({ text: `Entry ${i + 1} (Skipped): Metal Name and Price are required.`, type: 'error' });
            failedEntries++;
            continue;
        }
        
        allSubmissionsAttempted++;
        const formData = {
            action: 'create',
            userName: commonUserName,
            phoneName: commonPhone,
            metalName: metalName,
            price: price,
            city: commonCity
        };

        try {
            const encodedData = new URLSearchParams(formData).toString();
            const response = await fetch(SCRIPT_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: encodedData,
            });

            const resultText = await response.text();
            let result;
            try {
                result = JSON.parse(resultText);
            } catch (e) {
                console.error("Failed to parse JSON response:", resultText);
                throw new Error("Script error: Non-JSON response. Check Apps Script logs.");
            }

            if (result.status === 'success') {
                // Don't log to batchLogMessages if overall success message is simplified
                // batchLogMessages.push({ text: `SUCCESS: ${metalName} added. ${result.message ? '(' + result.message + ')' : ''}`, type: 'log' });
                successfulEntries++;
            } else {
                batchLogMessages.push({ text: `ERROR adding ${metalName}: ${result.message || 'Failed to add record.'}`, type: 'error' });
                failedEntries++;
            }
        } catch (error) {
            console.error(`Network/Script Error submitting ${metalName}:`, error);
            batchLogMessages.push({ text: `NETWORK/SCRIPT ERROR for ${metalName}: ${error.message}`, type: 'error' });
            failedEntries++;
        }
    } // End of loop

    submitButton.classList.remove('submit-processing');
    statusMessage.innerHTML = ''; // Clear "Processing entries..."

    if (failedEntries === 0 && allSubmissionsAttempted > 0) {
        // ALL ENTRIES WERE SUCCESSFULLY SUBMITTED
        showStatus("Successfully submitted", 'success', false); // Display only this message

        submitButton.classList.add('submit-success');
        submitButton.textContent = 'All Submitted!';
        // Button is already disabled
        setTimeout(resetForm, 4000); 

    } else {
        // THERE WERE FAILURES OR NO VALID ATTEMPTS
        statusMessage.className = 'status-message error'; // Set overall status to error

        // Display collected error log messages
        batchLogMessages.forEach(log => {
            if (log.type === 'error') { // Only display errors if that's the intent for the failure case
                showStatus(log.text, 'log', true); // 'log' type here means it's an appended line within the error box
            }
        });
        
        let finalSummaryMessage = `Submission Failed. Attempted: ${allSubmissionsAttempted}. Successful: ${successfulEntries}. Failed: ${failedEntries}.`;
        const summaryDiv = document.createElement('div');
        summaryDiv.style.fontWeight = 'bold';
        summaryDiv.style.marginTop = '10px';
        summaryDiv.textContent = finalSummaryMessage;
        statusMessage.appendChild(summaryDiv);

        submitButton.disabled = false;
        submitButton.textContent = 'Submit All Prices';
    }
}

// --- Event Listeners ---
form.addEventListener('submit', handleFormSubmit);
addMetalPairButton.addEventListener('click', addMetalPair);

// --- Initial Setup ---
document.addEventListener('DOMContentLoaded', () => {
    addMetalPair();
    console.log("Multiple metal entry script (metal_entry_script.js) loaded with simplified success message.");
});






















// // 17.51  05/05 new 

// // File: metal_entry.js - For metal_entry.html (Insert Only - Updated with Phone Name)

// // --- Configuration ---
// // Replace with your actual Google Apps Script Web App URL
// const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbw27yZv7a1-b83l2eSqBhtFAwrlRvQkbi7rhxTJpqnXbPOLULyEeiRToO46Aoy_SP3j/exec'; // <-- PASTE YOUR DEPLOYED URL HERE

// // --- DOM Elements ---
// const form = document.getElementById('metalForm');
// const userNameInput = document.getElementById('b1');
// const metalNameInput = document.getElementById('b2');
// const phoneNameInput = document.getElementById('phoneNameInput'); // <-- ADDED: Get the new input
// const priceInput = document.getElementById('b3');
// const cityInput = document.getElementById('b4');
// const submitButton = document.getElementById('submitButton');
// const statusMessage = document.getElementById('statusMessage');
// // No tableBody needed for entry-only form

// // --- Functions ---

// /**
//  * Displays a status message to the user.
//  * @param {string} message The message to display.
//  * @param {boolean} [isError=false] True if the message indicates an error.
//  */
// function showStatus(message, isError = false) {
//     statusMessage.textContent = message;
//     statusMessage.className = isError ? 'status-message error' : 'status-message success';
//     // Clear message after 5 seconds
//     setTimeout(() => {
//         statusMessage.textContent = '';
//         statusMessage.className = 'status-message';
//     }, 5000);
// }

// /**
//  * Resets the form fields and enables the submit button.
//  */
// function resetForm() {
//     form.reset();
//     submitButton.disabled = false;
//     // No need to reset button text for entry-only
// }

// /**
//  * Handles the form submission (Create action only).
//  * Sends the form data to the Google Apps Script.
//  * @param {Event} event The form submission event.
//  */
// async function handleFormSubmit(event) {
//     event.preventDefault(); // Prevent default form submission

//     const action = 'create'; // Action is always create for this form

//     // Gather form data including the new phoneName field
//     const formData = {
//         action: action,
//         userName: userNameInput.value.trim(),
//         metalName: metalNameInput.value.trim(),
//         phoneName: phoneNameInput.value.trim(), // <-- ADDED: Get phone name value
//         price: priceInput.value, // Keep as is, validation might happen server-side or add parseFloat if needed
//         city: cityInput.value.trim()
//     };

//     // Basic client-side validation (ensure fields are not empty)
//     if (!formData.userName || !formData.metalName || !formData.phoneName || formData.price === '' || !formData.city) { // <-- ADDED: phoneName validation
//         showStatus("Please fill in all fields.", true);
//         return; // Stop submission if validation fails
//     }

//     const phoneRegex = /^\d{10}$/; // Regular expression for exactly 10 digits
//     if (!phoneRegex.test(formData.phoneName)) {
//         showStatus("Please enter a valid 10-digit phone number.", true);
//         return; // Stop submission
//     }

//     submitButton.disabled = true; // Disable button during submission
//     showStatus("Adding record...", false); // Show pending status

//     try {
//         // Encode data for x-www-form-urlencoded format
//         const encodedData = new URLSearchParams(formData).toString();

//         // Send data to the Google Apps Script
//         const response = await fetch(SCRIPT_URL, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/x-www-form-urlencoded',
//             },
//             body: encodedData,
//         });

//         const result = await response.json(); // Parse the JSON response from the script

//         if (result.status === 'success') {
//             showStatus(result.message, false); // Show success message
//             resetForm(); // Clear the form
//             // No table refresh needed for entry-only form
//         } else {
//             // Throw an error if the script indicated failure
//             throw new Error(result.message || `Failed to add record.`);
//         }
//     } catch (error) {
//         console.error(`Error during ${action}:`, error);
//         showStatus(`Error: ${error.message}`, true); // Show error message
//         submitButton.disabled = false; // Re-enable button on error
//     }
// }

// // --- Event Listeners ---
// form.addEventListener('submit', handleFormSubmit); // Attach submit handler to the form

// console.log("Entry script loaded (with Phone Name).");
// // No initial data fetch needed for entry-only form

 

