// Price the customer pays (discount price when it is a real discount).
export const effectivePrice = (product) =>
  product?.discountPrice && product.discountPrice < product.price
    ? product.discountPrice
    : product?.price ?? 0;

export const isOnSale = (product) =>
  Boolean(product?.discountPrice && product.discountPrice < product.price);

export const discountPercent = (product) =>
  isOnSale(product) ? Math.round((1 - product.discountPrice / product.price) * 100) : 0;

// Requests a right-sized Unsplash image; other URLs are returned unchanged.
export const imageUrl = (url, width = 600) => {
  if (!url) return "";
  if (!url.includes("images.unsplash.com")) return url;
  return url.replace(/([?&])w=\d+/, `$1w=${width}`);
};

export const imageSrcSet = (url, widths = [400, 700, 1000]) =>
  url && url.includes("images.unsplash.com")
    ? widths.map((w) => `${imageUrl(url, w)} ${w}w`).join(", ")
    : undefined;

const SWATCHES = {
  black: "#111111",
  white: "#ffffff",
  "off white": "#f5f2ea",
  gray: "#9ca3af",
  grey: "#9ca3af",
  "heather gray": "#b8bcc2",
  charcoal: "#3f4148",
  navy: "#1e2a4a",
  "navy blue": "#1e2a4a",
  blue: "#2f5fb3",
  "light blue": "#a9c7ea",
  "dark blue": "#1f3b6e",
  "dark wash": "#2b3a55",
  red: "#c0392b",
  burgundy: "#6d1f2c",
  pink: "#f2b8c6",
  lavender: "#c7b8e8",
  yellow: "#f1c40f",
  green: "#2e7d4f",
  "dark green": "#1f4d36",
  olive: "#6b6b2f",
  khaki: "#c3b091",
  beige: "#e8dcc4",
  brown: "#7b4f2c",
};

const PATTERNS = {
  "tropical print": "linear-gradient(135deg, #2e7d4f 0 33%, #f1c40f 33% 66%, #c0392b 66%)",
  "navy palms": "linear-gradient(135deg, #1e2a4a 0 50%, #2e7d4f 50%)",
};

// CSS background for a colour swatch; unknown names fall back to a neutral tone.
export const swatchStyle = (name = "") => {
  const key = name.toLowerCase();
  if (PATTERNS[key]) return { backgroundImage: PATTERNS[key] };
  return { backgroundColor: SWATCHES[key] || "#d6d3d1" };
};

export const isLightColor = (name = "") =>
  ["white", "off white", "beige", "yellow", "light blue", "pink", "khaki", "lavender"].includes(
    name.toLowerCase()
  );

// URL-friendly version of a name, e.g. "Slim-Fit Shirt" -> "slim-fit-shirt".
export const slugify = (value = "") =>
  String(value)
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

// Readable product URL that still carries the id: /product/slim-fit-shirt-<id>
export const productPath = (product) =>
  product?.name ? `/product/${slugify(product.name)}-${product._id}` : `/product/${product?._id}`;

// Accepts "/product/<id>" and "/product/<slug>-<id>" and returns the id.
export const productIdFromParam = (param = "") => param.match(/([a-f0-9]{24})$/i)?.[1] || param;

// URL query keys the collection filters use.
export const FILTER_KEYS = ["gender", "category", "size", "color", "material", "brand", "minPrice", "maxPrice", "onSale", "inStock"];
