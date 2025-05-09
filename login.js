
// // new 10.24  06/05/2025



// // File: script.js
// // Location: TRAIL/login all file/script.js
// // Updated with Role-Based Redirect Logic for Single Admin/User

// // --- Configuration ---
// const googleScriptURL = 'https://script.google.com/macros/s/AKfycbwUWkbpD51Sf28PAq80Pqv0yANgf6t1UCl7J61xBeR3EGhP43YHe2ujtQVkr9c7iH7g/exec'; // <-- PASTE YOUR DEPLOYED URL HERE

// // --- Element Selection ---
// const signInFormDiv = document.getElementById('signIn');
// const signUpFormDiv = document.getElementById('signup');
// const signInBtn = document.getElementById('signInButton');
// const signUpBtn = document.getElementById('signUpButton');
// const actualSignInForm = document.getElementById('signInForm');
// const actualSignUpForm = document.getElementById('signupForm');
// const signupStatus = document.getElementById('signup-status');
// const signinStatus = document.getElementById('signin-status');
// const signupSubmitBtn = actualSignUpForm.querySelector('input[type="submit"]');
// const signinSubmitBtn = actualSignInForm.querySelector('input[type="submit"]');

// // --- Functions ---

// function showSignUp() {
//     signInFormDiv.style.display = 'none';
//     signUpFormDiv.style.display = 'block';
//     clearStatusMessages();
// }

// function showSignIn() {
//     signUpFormDiv.style.display = 'none';
//     signInFormDiv.style.display = 'block';
//     clearStatusMessages();
// }

// function clearStatusMessages() {
//     signupStatus.textContent = '';
//     signupStatus.className = 'status-message';
//     signinStatus.textContent = '';
//     signinStatus.className = 'status-message';
// }

// function showStatus(element, message, isError = false) {
//     element.textContent = message;
//     element.className = isError ? 'status-message error' : 'status-message success';
// }

// // --- Main Function to Handle Form Submissions ---
// async function handleFormSubmit(event, formType) {
//     event.preventDefault();
//     clearStatusMessages();

//     let formData = {};
//     let statusElement;
//     let submitButton;
//     let formElement;
//     let result = null;

//     if (formType === 'signup') {
//         formData = {
//             action: 'signup',
//             fName: document.getElementById('fName').value.trim(),
//             lName: document.getElementById('lName').value.trim(),
//             email: document.getElementById('signupEmail').value.trim(),
//             password: document.getElementById('signupPassword').value,
//         };
//         statusElement = signupStatus;
//         submitButton = signupSubmitBtn;
//         formElement = actualSignUpForm;
//     } else if (formType === 'signin') {
//         formData = {
//             action: 'signin',
//             email: document.getElementById('signInEmail').value.trim(),
//             password: document.getElementById('signInPassword').value,
//         };
//         statusElement = signinStatus;
//         submitButton = signinSubmitBtn;
//         formElement = actualSignInForm;
//     } else {
//         console.error("Invalid form type");
//         return;
//     }

//     // Basic Client-Side Validation
//     for (const key in formData) {
//         if (key !== 'action' && !formData[key]) {
//              showStatus(statusElement, `Please fill in all required fields.`, true);
//              return;
//         }
//     }

//     submitButton.disabled = true;
//     showStatus(statusElement, 'Processing...', false);

//     try {
//         const encodedData = new URLSearchParams(formData).toString();
//         console.log("Sending data:", encodedData);

//         const response = await fetch(googleScriptURL, {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
//             body: encodedData,
//         });

//          if (!response.ok) {
//              let errorText = `Network error! Status: ${response.status} ${response.statusText}`;
//               try {
//                   const errorData = await response.json();
//                   errorText = errorData.message || errorData.error || errorText;
//               } catch (e) { console.warn("Could not parse error response as JSON."); }
//               throw new Error(errorText);
//          }

//         result = await response.json();

//         if (result.status === 'success') {
//             console.log(`${formType} successful: `, result);
//             showStatus(statusElement, result.message, false);
//             formElement.reset();

//             // --- ROLE-BASED REDIRECT LOGIC (Only for Sign In) ---
//             if (formType === 'signin') {
//                 showStatus(statusElement, result.message + " Redirecting...", false);

//                 let redirectTarget = '';

//                 // --- CHECK USER ROLE from Apps Script response ---
//                 // Apps Script now sends role: 'admin' or role: 'user'
//                 if (result.role && result.role === 'admin') {
//                     // Redirect Admin
//                     redirectTarget = 'index3_admin.html'; // <<< Your Admin Page Path
//                     console.log("Admin login detected. Redirecting to:", redirectTarget);
//                 } else {
//                     // Redirect Normal User
//                     redirectTarget = 'index2.html'; // <<< Your Normal User Page Path
//                     console.log("Normal user login detected. Redirecting to:", redirectTarget);
//                 }
//                 // --- END ROLE CHECK ---

//                 // Redirect after a delay
//                 setTimeout(() => {
//                     if (redirectTarget) {
//                         window.location.href = redirectTarget;
//                     } else {
//                          console.error("Redirect target not set! Check Apps Script response includes 'role'.");
//                          showStatus(statusElement, "Login successful, but redirect failed (role missing?).", true);
//                          submitButton.disabled = false;
//                     }
//                 }, 1000); // 1.5 seconds delay
//             }
//             // --- END ROLE-BASED REDIRECT LOGIC ---

//         } else {
//              console.log(`${formType} failed according to script result:`, result);
//              showStatus(statusElement, result.message || 'An unknown error occurred.', true);
//         }

//     } catch (error) {
//          console.error(`Error during ${formType} or response handling:`, error);
//          showStatus(statusElement, `Error: ${error.message || 'Could not connect.'}`, true);
//     } finally {
//          const isSuccessfulSigninRedirect = (formType === 'signin' && result && result.status === 'success');
//          if (!isSuccessfulSigninRedirect) {
//               submitButton.disabled = false;
//          }
//     }
// } // --- End of handleFormSubmit Function ---

// // --- Event Listeners ---
// signInBtn.addEventListener('click', showSignIn);
// signUpBtn.addEventListener('click', showSignUp);
// actualSignUpForm.addEventListener('submit', (event) => handleFormSubmit(event, 'signup'));
// actualSignInForm.addEventListener('submit', (event) => handleFormSubmit(event, 'signin'));

// // --- Initial State ---
// showSignIn();

// console.log("Login/Signup script loaded (with final role redirect).");


// new 19.31 09/05/2025

// Client-Side JavaScript for your Login Page (e.g., in login.html)

// --- Configuration ---
// IMPORTANT: Replace this with your ACTUAL deployed Google Apps Script Web App URL
const googleScriptURL = 'https://script.google.com/macros/s/AKfycbx7cXeijOmX5t_wr1FY48s-XCjoiECRc0EN_6CNPZJ8zMUCqSnzdLCuCpsc9cMUXwFx/exec';

// --- Element Selection (ensure these IDs match your HTML form elements) ---
const signInFormDiv = document.getElementById('signIn'); // The div containing the sign-in form
const signUpFormDiv = document.getElementById('signup'); // The div containing the sign-up form
const signInBtn = document.getElementById('signInButton'); // Button to show sign-in form
const signUpBtn = document.getElementById('signUpButton'); // Button to show sign-up form
const actualSignInForm = document.getElementById('signInForm'); // The <form> element for sign-in
const actualSignUpForm = document.getElementById('signupForm'); // The <form> element for sign-up
const signupStatus = document.getElementById('signup-status'); // <p> or <div> to show signup messages
const signinStatus = document.getElementById('signin-status'); // <p> or <div> to show signin messages
const signupSubmitBtn = actualSignUpForm.querySelector('input[type="submit"]'); // Submit button for signup
const signinSubmitBtn = actualSignInForm.querySelector('input[type="submit"]'); // Submit button for signin

// --- UI Functions ---
function showSignUp() {
    if (signInFormDiv) signInFormDiv.style.display = 'none';
    if (signUpFormDiv) signUpFormDiv.style.display = 'block';
    clearStatusMessages();
}

function showSignIn() {
    if (signUpFormDiv) signUpFormDiv.style.display = 'none';
    if (signInFormDiv) signInFormDiv.style.display = 'block';
    clearStatusMessages();
}

function clearStatusMessages() {
    if (signupStatus) {
        signupStatus.textContent = '';
        signupStatus.className = 'status-message'; // Reset class
    }
    if (signinStatus) {
        signinStatus.textContent = '';
        signinStatus.className = 'status-message'; // Reset class
    }
}

function showStatus(element, message, isError = false) {
    if (element) {
        element.textContent = message;
        element.className = isError ? 'status-message error' : 'status-message success';
    } else {
        console.warn("Status element not found for message:", message);
    }
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
        console.error("Invalid form type specified for handleFormSubmit");
        return;
    }

    // Basic Client-Side Validation
    for (const key in formData) {
        if (key !== 'action' && typeof formData[key] === 'string' && !formData[key]) {
            showStatus(statusElement, `Please fill in all required fields. '${key}' is missing.`, true);
            return;
        }
    }
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
         showStatus(statusElement, 'Please enter a valid email address.', true);
         return;
    }
    if (formData.password && formData.password.length < 6) {
         showStatus(statusElement, 'Password must be at least 6 characters.', true);
         return;
    }


    submitButton.disabled = true;
    showStatus(statusElement, 'Processing...', false);

    try {
        const encodedData = new URLSearchParams(formData).toString();
        console.log("Sending data to Apps Script:", encodedData);

        const response = await fetch(googleScriptURL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: encodedData,
            mode: 'cors' // Required if your HTML is on a different domain than script.google.com initially, though Apps Script handles this with redirects for web apps.
        });

        if (!response.ok) {
            let errorText = `Network error! Status: ${response.status} ${response.statusText}`;
            try {
                const errorData = await response.json();
                errorText = errorData.message || errorData.error || `Server error (Status ${response.status}).`;
            } catch (e) {
                console.warn("Could not parse error response as JSON. Raw response:", await response.text());
            }
            throw new Error(errorText);
        }

        result = await response.json();
        console.log("Received result from Apps Script:", result);

        if (result.status === 'success') {
            showStatus(statusElement, result.message, false);
            if (formElement) formElement.reset();

            if (formType === 'signin' && result.sessionId) {
                localStorage.setItem('myAppSessionId', result.sessionId);
                localStorage.setItem('myAppUserRole', result.role); // Store role
                localStorage.setItem('myAppUserFirstName', result.user ? result.user.firstName : ''); // Store name

                showStatus(statusElement, result.message + " Redirecting...", false);
                let redirectTarget = '';
                if (result.role === 'admin') {
                    redirectTarget = 'index3_admin.html'; // Your Admin Page
                } else {
                    redirectTarget = 'index2.html'; // Your Normal User Page
                }

                setTimeout(() => {
                    if (redirectTarget) {
                        window.location.href = redirectTarget;
                    } else {
                        console.error("Redirect target not set! Check Apps Script response includes 'role'.");
                        showStatus(statusElement, "Login successful, but redirect failed (role missing?).", true);
                        if(submitButton) submitButton.disabled = false;
                    }
                }, 1000); // Delay for user to see message
            } else if (formType === 'signin' && !result.sessionId) {
                // Signin reported success from script but no session ID was returned
                console.error("Signin success from script, but no sessionId returned.");
                showStatus(statusElement, "Login successful, but session could not be established. Please try again.", true);
            }
        } else {
            // result.status is 'error' or other
            showStatus(statusElement, result.message || 'An unknown error occurred from the server.', true);
        }

    } catch (error) {
        console.error(`Error during ${formType} or response handling:`, error);
        showStatus(statusElement, `Client-side error: ${error.message || 'Could not connect or process response.'}`, true);
    } finally {
        const isSuccessfulSigninRedirect = (formType === 'signin' && result && result.status === 'success' && result.sessionId);
        if (!isSuccessfulSigninRedirect && submitButton) { // Check if submitButton exists
            submitButton.disabled = false;
        }
    }
}

// --- Event Listeners (Ensure these elements exist on your login page) ---
if (signInBtn) signInBtn.addEventListener('click', showSignIn);
if (signUpBtn) signUpBtn.addEventListener('click', showSignUp);
if (actualSignUpForm) actualSignUpForm.addEventListener('submit', (event) => handleFormSubmit(event, 'signup'));
if (actualSignInForm) actualSignInForm.addEventListener('submit', (event) => handleFormSubmit(event, 'signin'));

// --- Initial State ---
// Call showSignIn() or showSignUp() depending on which form you want to display initially
showSignIn();

console.log("Login/Signup script (with session handling for signin) loaded.");
