// // File: script.js
// // Location: TRAIL/login all file/script.js

// // --- Configuration ---
// // IMPORTANT: Replace this with your actual Google Apps Script Web App URL
// const googleScriptURL = 'https://script.google.com/macros/s/AKfycbyLi_ySkYuN8mY2v2x_laBteryQ6bHfMRETdlOVqIJYyNS19GNrnChjIdMg3PFIuzd3/exec'; // <-- PASTE YOUR DEPLOYED URL HERE

// // --- Element Selection ---
// const signInForm = document.getElementById('signIn'); // The sign-in container div
// const signUpForm = document.getElementById('signup'); // The sign-up container div
// const signInBtn = document.getElementById('signInButton'); // Button to switch to Sign In view
// const signUpBtn = document.getElementById('signUpButton'); // Button to switch to Sign Up view
// const actualSignInForm = document.getElementById('signInForm'); // The <form> element for sign in
// const actualSignUpForm = document.getElementById('signupForm'); // The <form> element for sign up
// const signupStatus = document.getElementById('signup-status'); // <p> tag for signup messages
// const signinStatus = document.getElementById('signin-status'); // <p> tag for signin messages
// const signupSubmitBtn = actualSignUpForm.querySelector('input[type="submit"]'); // Signup submit button
// const signinSubmitBtn = actualSignInForm.querySelector('input[type="submit"]'); // Signin submit button

// // --- Functions ---

// // Function to show the Sign Up form and hide Sign In
// function showSignUp() {
//     signInForm.style.display = 'none';
//     signUpForm.style.display = 'block'; // Or 'flex' if needed for layout
//     clearStatusMessages();
// }

// // Function to show the Sign In form and hide Sign Up
// function showSignIn() {
//     signUpForm.style.display = 'none';
//     signInForm.style.display = 'block'; // Or 'flex'
//     clearStatusMessages();
// }

// // Function to clear status messages from both forms
// function clearStatusMessages() {
//     signupStatus.textContent = '';
//     signupStatus.className = 'status-message'; // Reset class
//     signinStatus.textContent = '';
//     signinStatus.className = 'status-message'; // Reset class
// }

// // Function to display status messages (success or error)
// function showStatus(element, message, isError = false) {
//     element.textContent = message;
//     element.className = isError ? 'status-message error' : 'status-message success';
// }

// // --- Main Function to Handle Form Submissions ---
// async function handleFormSubmit(event, formType) {
//     event.preventDefault(); // Stop browser's default form submission
//     clearStatusMessages(); // Clear any previous messages

//     let formData = {}; // Object to hold form data
//     let statusElement; // Element to display messages (<p> tag)
//     let submitButton; // The submit button element
//     let formElement; // The <form> element itself

//     // --- Collect Form Data based on 'signup' or 'signin' ---
//     if (formType === 'signup') {
//         formData = {
//             action: 'signup', // Action for Apps Script
//             fName: document.getElementById('fName').value,
//             lName: document.getElementById('lName').value,
//             email: document.getElementById('signupEmail').value,
//             password: document.getElementById('signupPassword').value,
//         };
//         statusElement = signupStatus;
//         submitButton = signupSubmitBtn;
//         formElement = actualSignUpForm;
//     } else if (formType === 'signin') {
//         formData = {
//             action: 'signin', // Action for Apps Script
//             email: document.getElementById('signInEmail').value,
//             password: document.getElementById('signInPassword').value,
//         };
//         statusElement = signinStatus;
//         submitButton = signinSubmitBtn;
//         formElement = actualSignInForm;
//     } else {
//         console.error("Invalid form type passed to handleFormSubmit");
//         return; // Exit if formType is unknown
//     }

//     // --- Basic Client-Side Validation ---
//     for (const key in formData) {
//         // Check if any field (except 'action') is empty
//         if (key !== 'action' && !formData[key]) {
//              showStatus(statusElement, `Please fill in all required fields.`, true);
//              return; // Stop submission if validation fails
//         }
//     }

//     // Disable submit button and show processing message
//     submitButton.disabled = true;
//     showStatus(statusElement, 'Processing...', false);

//     try {
//         // --- Prepare data for Apps Script (e.parameter requires URL-encoded) ---
//         const encodedData = new URLSearchParams(formData).toString();
//         console.log("Sending data:", encodedData); // DEBUGGING: See what's being sent

//         // --- Fetch Request to Google Apps Script ---
//         const response = await fetch(googleScriptURL, {
//             method: 'POST',
//             headers: {
//                 // Important: Set Content-Type for URL-encoded data
//                 'Content-Type': 'application/x-www-form-urlencoded',
//             },
//             body: encodedData, // Send the encoded string
//         });

//         // --- Handle Network Response ---
//          if (!response.ok) {
//              // Attempt to get error details from the response body if available
//              let errorText = `Network error! Status: ${response.status} ${response.statusText}`;
//               try {
//                   const errorData = await response.json(); // Try parsing server error message
//                   errorText = errorData.message || errorData.error || errorText;
//               } catch (e) {
//                    console.warn("Could not parse error response as JSON."); // Response might not be JSON
//               }
//               throw new Error(errorText); // Throw error to be caught below
//          }

//         // --- Handle Application Response (JSON from Apps Script) ---
//         const result = await response.json(); // Parse the JSON response from Apps Script

//         if (result.status === 'success') {
//             // --- SUCCESS ---
//             console.log("Login successful 😊 ", result); // DEBUGGING
//             showStatus(statusElement, result.message, false); // Show success message from Apps Script
//             formElement.reset(); // Clear the form fields

//             // --- REDIRECT LOGIC (Only for Sign In) ---
//             if (formType === 'signin') {
//                 showStatus(statusElement, result.message + " Redirecting...", false); // Update status

//                 // Set the target path - relative path to go UP one level
//                 const redirectTarget = '../index2.html';
//                 console.log("Attempting to redirect to:", redirectTarget); // DEBUGGING

//                 // Wait briefly before redirecting (optional)
//                 setTimeout(() => {
//                     window.location.href = redirectTarget; // Perform the redirect
//                 }, 1500); // 1500 milliseconds = 1.5 seconds delay
//             }
//             // --- END REDIRECT LOGIC ---

//         } else {
//             // --- FAILURE (Reported by Apps Script) ---
//              console.log("Login failed according to script result:", result); // DEBUGGING
//              showStatus(statusElement, result.message || 'An unknown error occurred.', true);
//         }

//     } catch (error) {
//          // --- CATCH FETCH/NETWORK ERRORS ---
//          console.error('Error during fetch or response handling:', error); // DEBUGGING
//          showStatus(statusElement, `Error: ${error.message || 'Could not connect.'}`, true);
//     } finally {
//          // --- ALWAYS RE-ENABLE BUTTON ---
//          submitButton.disabled = false; // Re-enable the submit button
//     }
// } // --- End of handleFormSubmit Function ---

// // --- Event Listeners ---

// // Listener for the button that switches view TO Sign In
// signInBtn.addEventListener('click', showSignIn);

// // Listener for the button that switches view TO Sign Up
// signUpBtn.addEventListener('click', showSignUp);

// // Listener for the Sign Up form submission
// actualSignUpForm.addEventListener('submit', (event) => handleFormSubmit(event, 'signup'));

// // Listener for the Sign In form submission
// actualSignInForm.addEventListener('submit', (event) => handleFormSubmit(event, 'signin'));

// showSignIn();

// console.log("Login/Signup script loaded."); // DEBUGGING: Confirm script execution


// new 10.24  06/05/2025



// File: script.js
// Location: TRAIL/login all file/script.js
// Updated with Role-Based Redirect Logic for Single Admin/User

// --- Configuration ---
const googleScriptURL = 'https://script.google.com/macros/s/AKfycbwUWkbpD51Sf28PAq80Pqv0yANgf6t1UCl7J61xBeR3EGhP43YHe2ujtQVkr9c7iH7g/exec'; // <-- PASTE YOUR DEPLOYED URL HERE

// --- Element Selection ---
const signInFormDiv = document.getElementById('signIn');
const signUpFormDiv = document.getElementById('signup');
const signInBtn = document.getElementById('signInButton');
const signUpBtn = document.getElementById('signUpButton');
const actualSignInForm = document.getElementById('signInForm');
const actualSignUpForm = document.getElementById('signupForm');
const signupStatus = document.getElementById('signup-status');
const signinStatus = document.getElementById('signin-status');
const signupSubmitBtn = actualSignUpForm.querySelector('input[type="submit"]');
const signinSubmitBtn = actualSignInForm.querySelector('input[type="submit"]');

// --- Functions ---

function showSignUp() {
    signInFormDiv.style.display = 'none';
    signUpFormDiv.style.display = 'block';
    clearStatusMessages();
}

function showSignIn() {
    signUpFormDiv.style.display = 'none';
    signInFormDiv.style.display = 'block';
    clearStatusMessages();
}

function clearStatusMessages() {
    signupStatus.textContent = '';
    signupStatus.className = 'status-message';
    signinStatus.textContent = '';
    signinStatus.className = 'status-message';
}

function showStatus(element, message, isError = false) {
    element.textContent = message;
    element.className = isError ? 'status-message error' : 'status-message success';
}

// --- Main Function to Handle Form Submissions ---
async function handleFormSubmit(event, formType) {
    event.preventDefault();
    clearStatusMessages();

    let formData = {};
    let statusElement;
    let submitButton;
    let formElement;
    let result = null;

    if (formType === 'signup') {
        formData = {
            action: 'signup',
            fName: document.getElementById('fName').value.trim(),
            lName: document.getElementById('lName').value.trim(),
            email: document.getElementById('signupEmail').value.trim(),
            password: document.getElementById('signupPassword').value,
        };
        statusElement = signupStatus;
        submitButton = signupSubmitBtn;
        formElement = actualSignUpForm;
    } else if (formType === 'signin') {
        formData = {
            action: 'signin',
            email: document.getElementById('signInEmail').value.trim(),
            password: document.getElementById('signInPassword').value,
        };
        statusElement = signinStatus;
        submitButton = signinSubmitBtn;
        formElement = actualSignInForm;
    } else {
        console.error("Invalid form type");
        return;
    }

    // Basic Client-Side Validation
    for (const key in formData) {
        if (key !== 'action' && !formData[key]) {
             showStatus(statusElement, `Please fill in all required fields.`, true);
             return;
        }
    }

    submitButton.disabled = true;
    showStatus(statusElement, 'Processing...', false);

    try {
        const encodedData = new URLSearchParams(formData).toString();
        console.log("Sending data:", encodedData);

        const response = await fetch(googleScriptURL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: encodedData,
        });

         if (!response.ok) {
             let errorText = `Network error! Status: ${response.status} ${response.statusText}`;
              try {
                  const errorData = await response.json();
                  errorText = errorData.message || errorData.error || errorText;
              } catch (e) { console.warn("Could not parse error response as JSON."); }
              throw new Error(errorText);
         }

        result = await response.json();

        if (result.status === 'success') {
            console.log(`${formType} successful: `, result);
            showStatus(statusElement, result.message, false);
            formElement.reset();

            // --- ROLE-BASED REDIRECT LOGIC (Only for Sign In) ---
            if (formType === 'signin') {
                showStatus(statusElement, result.message + " Redirecting...", false);

                let redirectTarget = '';

                // --- CHECK USER ROLE from Apps Script response ---
                // Apps Script now sends role: 'admin' or role: 'user'
                if (result.role && result.role === 'admin') {
                    // Redirect Admin
                    redirectTarget = 'index3_admin.html'; // <<< Your Admin Page Path
                    console.log("Admin login detected. Redirecting to:", redirectTarget);
                } else {
                    // Redirect Normal User
                    redirectTarget = 'index2.html'; // <<< Your Normal User Page Path
                    console.log("Normal user login detected. Redirecting to:", redirectTarget);
                }
                // --- END ROLE CHECK ---

                // Redirect after a delay
                setTimeout(() => {
                    if (redirectTarget) {
                        window.location.href = redirectTarget;
                    } else {
                         console.error("Redirect target not set! Check Apps Script response includes 'role'.");
                         showStatus(statusElement, "Login successful, but redirect failed (role missing?).", true);
                         submitButton.disabled = false;
                    }
                }, 1000); // 1.5 seconds delay
            }
            // --- END ROLE-BASED REDIRECT LOGIC ---

        } else {
             console.log(`${formType} failed according to script result:`, result);
             showStatus(statusElement, result.message || 'An unknown error occurred.', true);
        }

    } catch (error) {
         console.error(`Error during ${formType} or response handling:`, error);
         showStatus(statusElement, `Error: ${error.message || 'Could not connect.'}`, true);
    } finally {
         const isSuccessfulSigninRedirect = (formType === 'signin' && result && result.status === 'success');
         if (!isSuccessfulSigninRedirect) {
              submitButton.disabled = false;
         }
    }
} // --- End of handleFormSubmit Function ---

// --- Event Listeners ---
signInBtn.addEventListener('click', showSignIn);
signUpBtn.addEventListener('click', showSignUp);
actualSignUpForm.addEventListener('submit', (event) => handleFormSubmit(event, 'signup'));
actualSignInForm.addEventListener('submit', (event) => handleFormSubmit(event, 'signin'));

// --- Initial State ---
showSignIn();

console.log("Login/Signup script loaded (with final role redirect).");
