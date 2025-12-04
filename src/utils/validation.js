/**
 * Validation utility functions for Fresh Hands App
 */

export const isValidPhoneNumber = (phone) => {
    // Must be exactly 10 digits. 
    // Allowing optional +91 prefix, but core must be 10 digits.
    // For this app, let's assume the user enters just the 10 digits or we strip non-digits.
    const cleaned = phone.replace(/\D/g, '');
    // If user enters +91, cleaned will have 12 digits. If just 10 digits, it has 10.
    // Let's enforce that the *last* 10 digits are valid and it's a valid length.
    // Actually, simplest UX: User enters 10 digits.
    return /^[6-9]\d{9}$/.test(cleaned) && cleaned.length === 10;
};

export const isValidEmail = (email) => {
    if (!email) return false;
    // Standard email regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const isValidName = (name) => {
    if (!name) return false;
    return name.trim().length >= 2;
};

export const isValidOTP = (otp) => {
    // Must be exactly 4 digits
    return /^\d{4}$/.test(otp);
};

export const isValidCity = (city) => {
    if (!city) return false;
    return city.trim().length > 0;
};
