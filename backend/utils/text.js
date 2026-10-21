// Escape user input before using it inside a RegExp (prevents ReDoS / regex injection).
const escapeRegex = (value = "") => String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const normalizeEmail = (email = "") => String(email).trim().toLowerCase();

const isValidEmail = (email = "") => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// URL-friendly version of a name, e.g. "Slim-Fit Shirt" -> "slim-fit-shirt".
const slugify = (value = "") =>
  String(value)
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

// Storefront path for a product: readable slug plus the id the API needs.
const productPath = (product) => `/product/${slugify(product.name)}-${product._id}`;

module.exports = { escapeRegex, normalizeEmail, isValidEmail, slugify, productPath };
