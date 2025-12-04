// Standalone test script for validation logic verification
console.log("Running Validation Tests...\n");

// --- Phone Number Tests ---
const phoneTests = [
    { input: "9876543210", expected: true, desc: "Valid 10 digit" },
    { input: "123456", expected: false, desc: "Too short" },
    { input: "98765432100", expected: false, desc: "Too long" },
    { input: "abcdefghij", expected: false, desc: "Non-digits" },
    { input: "5876543210", expected: false, desc: "Starts with 5 (invalid for India)" }, // Optional strictness
];

// Logic to test
const isValidPhoneNumber = (phone) => {
    const cleaned = phone.replace(/\D/g, '');
    return /^[6-9]\d{9}$/.test(cleaned) && cleaned.length === 10;
};

let passed = 0;
let total = 0;

function assert(condition, desc) {
    total++;
    if (condition) {
        passed++;
        console.log(`[PASS] ${desc}`);
    } else {
        console.log(`[FAIL] ${desc}`);
    }
}

console.log("--- Phone Number Validation ---");
phoneTests.forEach(t => {
    assert(isValidPhoneNumber(t.input) === t.expected, `${t.desc} (Input: ${t.input})`);
});

// --- Email Tests ---
const emailTests = [
    { input: "test@example.com", expected: true, desc: "Valid email" },
    { input: "test.name@domain.co.in", expected: true, desc: "Valid complex email" },
    { input: "invalid-email", expected: false, desc: "No @ symbol" },
    { input: "test@", expected: false, desc: "Missing domain" },
    { input: "@example.com", expected: false, desc: "Missing username" },
    { input: "", expected: false, desc: "Empty string" },
];

const isValidEmail = (email) => {
    if (!email) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

console.log("\n--- Email Validation ---");
emailTests.forEach(t => {
    assert(isValidEmail(t.input) === t.expected, `${t.desc} (Input: ${t.input})`);
});

// --- OTP Tests ---
const otpTests = [
    { input: "1234", expected: true, desc: "Valid 4 digit" },
    { input: "123", expected: false, desc: "Too short" },
    { input: "12345", expected: false, desc: "Too long" },
    { input: "abcd", expected: false, desc: "Non-digits" },
];

const isValidOTP = (otp) => {
    return /^\d{4}$/.test(otp);
};

console.log("\n--- OTP Validation ---");
otpTests.forEach(t => {
    assert(isValidOTP(t.input) === t.expected, `${t.desc} (Input: ${t.input})`);
});

// --- Name Tests ---
const nameTests = [
    { input: "John Doe", expected: true, desc: "Valid name" },
    { input: "Jo", expected: true, desc: "Min length name" },
    { input: "J", expected: false, desc: "Too short" },
    { input: "", expected: false, desc: "Empty" },
    { input: "   ", expected: false, desc: "Whitespace only" },
];

const isValidName = (name) => {
    if (!name) return false;
    return name.trim().length >= 2;
};

console.log("\n--- Name Validation ---");
nameTests.forEach(t => {
    assert(isValidName(t.input) === t.expected, `${t.desc} (Input: '${t.input}')`);
});

// --- City Tests ---
const cityTests = [
    { input: "Chennai", expected: true, desc: "Valid city" },
    { input: "", expected: false, desc: "Empty" },
    { input: "   ", expected: false, desc: "Whitespace only" },
];

const isValidCity = (city) => {
    if (!city) return false;
    return city.trim().length > 0;
};

console.log("\n--- City Validation ---");
cityTests.forEach(t => {
    assert(isValidCity(t.input) === t.expected, `${t.desc} (Input: '${t.input}')`);
});

console.log(`\nTotal Tests: ${total}`);
console.log(`Passed: ${passed}`);
console.log(`Failed: ${total - passed}`);

if (passed === total) {
    console.log("\nALL TESTS PASSED! Logic is sound.");
} else {
    console.log("\nSOME TESTS FAILED. Review logic.");
}
