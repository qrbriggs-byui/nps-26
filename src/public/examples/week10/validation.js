// Grab the main elements once so we can reuse them throughout the file.
// This is more efficient and keeps the code readable.
const form = document.querySelector("#signup-form");
const result = document.querySelector("#result");
const errorSummary = document.querySelector("#error-summary");

// Get all input elements so we can loop through them for validation.
const fullNameInput = document.querySelector("#fullName");
const emailInput = document.querySelector("#email");
const zipCodeInput = document.querySelector("#zipCode");
const passwordInput = document.querySelector("#password");
const confirmPasswordInput = document.querySelector("#confirmPassword");

const allInputs = [fullNameInput, emailInput, zipCodeInput, passwordInput, confirmPasswordInput];

// ===== Validation functions for each field =====

function validateFullName(input) {
    if (input.value === "") {
        return "This field is required.";
    }
    if (input.value.length < 2) {
        return "Enter at least 2 characters.";
    }
    return "";
}

function validateEmail(input) {
    if (input.value === "") {
        return "This field is required.";
    }
    if (!input.validity.valid) {
        return "Enter a valid email address.";
    }
    return "";
}

function validateZipCode(input) {
    if (input.value === "") {
        return "This field is required.";
    }
    const zipPattern = /^\d{5}(-\d{4})?$/;
    if (!zipPattern.test(input.value)) {
        return "Enter a ZIP code in 12345 or 12345-6789 format.";
    }
    return "";
}

function validatePassword(input) {
    if (input.value === "") {
        return "This field is required.";
    }
    if (input.value.length < 8) {
        return "Enter at least 8 characters.";
    }
    return "";
}

function validateConfirmPassword(input) {
    if (input.value === "") {
        return "This field is required.";
    }
    if (input.value !== passwordInput.value) {
        return "Passwords must match.";
    }
    return "";
}

// Helper function to get the right validation function based on input ID.
function getValidationFunction(input) {
    if (input.id === "fullName") return validateFullName;
    if (input.id === "email") return validateEmail;
    if (input.id === "zipCode") return validateZipCode;
    if (input.id === "password") return validatePassword;
    if (input.id === "confirmPassword") return validateConfirmPassword;
}

// Check one input and update its styling and error message.
function validateInput(input) {
    const validationFn = getValidationFunction(input);
    const errorMessage = validationFn(input);
    
    const field = input.closest(".field");
    const errorElement = document.querySelector(`#${input.id}-error`);

    if (errorMessage === "") {
        // Input is valid: green styling and clear message.
        field.classList.remove("error");
        field.classList.add("success");
        input.setAttribute("aria-invalid", "false");
        errorElement.textContent = "";
    } else {
        // Input is invalid: red styling and show error message.
        field.classList.add("error");
        field.classList.remove("success");
        input.setAttribute("aria-invalid", "true");
        errorElement.textContent = errorMessage;
    }
}

// Clear top-level messages (summary and result).
function clearMessages() {
    errorSummary.classList.remove("show");
    errorSummary.textContent = "";
    result.hidden = true;
    result.textContent = "";
}

// Check all inputs and return the first one that fails validation.
function checkAllInputs() {
    let firstInvalid = null;
    const invalidLabels = [];

    allInputs.forEach((input) => {
        validateInput(input);

        // Check if this input has an error.
        const validationFn = getValidationFunction(input);
        const errorMessage = validationFn(input);

        if (errorMessage !== "") {
            if (!firstInvalid) {
                firstInvalid = input;
            }
            // Collect the label text for the summary message.
            const label = input.closest(".field").querySelector("label");
            invalidLabels.push(label.textContent);
        }
    });

    // If there are errors, show them in the summary at the top.
    if (invalidLabels.length > 0) {
        errorSummary.textContent = `Please fix: ${invalidLabels.join(", ")}.`;
        errorSummary.classList.add("show");
    }

    return firstInvalid;
}

// Listen for typing in each input.
allInputs.forEach((input) => {
    input.addEventListener("input", () => {
        clearMessages();
        validateInput(input);

        // If password fields change, recheck the confirm password match.
        if (input.id === "password" || input.id === "confirmPassword") {
            validateInput(confirmPasswordInput);
        }
    });

    // Also validate when user leaves the field.
    input.addEventListener("blur", () => {
        validateInput(input);
    });
});

// Handle form submission.
form.addEventListener("submit", (event) => {
    event.preventDefault();

    // Check all fields.
    const firstInvalid = checkAllInputs();

    if (firstInvalid) {
        // Focus on the first field with an error to draw attention to it.
        firstInvalid.focus();
        return;
    }

    // All fields are valid. Show success message.
    result.hidden = false;
    result.textContent = "Form is valid. Submit action prevented for this demo.";

    // Reset form for testing.
    form.reset();

    // Clear all styling after reset.
    allInputs.forEach((input) => {
        input.closest(".field").classList.remove("error", "success");
        input.setAttribute("aria-invalid", "false");
        document.querySelector(`#${input.id}-error`).textContent = "";
    });
});