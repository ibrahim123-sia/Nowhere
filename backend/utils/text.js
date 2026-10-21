// Escape user input before using it inside a RegExp (prevents ReDoS / regex injection).
const escapeRegex = (value = "") => String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const normalizeEmail = (email = "") => String(email).trim().toLowerCase();

const isValidEmail = (email = "") => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

module.exports = { escapeRegex, normalizeEmail, isValidEmail };
