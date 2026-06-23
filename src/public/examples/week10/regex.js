// Define all regex patterns and their corresponding test input IDs and result element IDs.
const regexTests = [
    {
        name: "Email",
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        inputId: "email-test",
        resultId: "email-result",
    },
    {
        name: "Phone",
        pattern: /^\d{3}-\d{3}-\d{4}$/,
        inputId: "phone-test",
        resultId: "phone-result",
    },
    {
        name: "URL",
        pattern: /^https?:\/\/.+\..+$/,
        inputId: "url-test",
        resultId: "url-result",
    },
    {
        name: "ZIP Code",
        pattern: /^\d{5}(-\d{4})?$/,
        inputId: "zip-test",
        resultId: "zip-result",
    },
    {
        name: "Username",
        pattern: /^[a-zA-Z0-9_-]{3,16}$/,
        inputId: "username-test",
        resultId: "username-result",
    },
    {
        name: "Strong Password",
        pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        inputId: "password-test",
        resultId: "password-result",
    },
    {
        name: "Hex Color",
        pattern: /^#([0-9A-F]{3}){1,2}$/i,
        inputId: "color-test",
        resultId: "color-result",
    },
    {
        name: "Date",
        pattern: /^\d{4}-\d{2}-\d{2}$/,
        inputId: "date-test",
        resultId: "date-result",
    },
    {
        name: "Numbers Only",
        pattern: /^\d+$/,
        inputId: "numbers-test",
        resultId: "numbers-result",
    },
];

// For each regex test, add an event listener to the input field.
regexTests.forEach((test) => {
    const input = document.querySelector(`#${test.inputId}`);
    const result = document.querySelector(`#${test.resultId}`);

    // Listen for input changes.
    input.addEventListener("input", () => {
        const value = input.value;

        // If the field is empty, show the empty state.
        if (value === "") {
            result.textContent = "Enter text to test";
            result.className = "result empty";
            return;
        }

        // Test if the input matches the regex pattern.
        const isMatch = test.pattern.test(value);

        // Update the result display.
        if (isMatch) {
            result.textContent = "Valid";
            result.className = "result valid";
        } else {
            result.textContent = "Invalid";
            result.className = "result invalid";
        }
    });
});