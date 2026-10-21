// SEO helpers shared by the React app (useSeo) and the Vercel functions
// that pre-render product meta tags. Keep this file free of browser APIs.
import { effectivePrice, productPath } from "./product.js";

export const SITE_NAME = "Nowhere";
export const DEFAULT_TITLE = "Nowhere - Clothing for everyday life";
export const DEFAULT_DESCRIPTION =
  "Modern menswear and womenswear made in Pakistan: shirts, tees, denim and tailoring. Free delivery over Rs. 5,000, cash on delivery and 30-day returns.";
export const DEFAULT_IMAGE = "/og-image.jpg";

const SHIPPING_FEE = 250;
const FREE_SHIPPING_FROM = 5000;

export const pageTitle = (title) => (title ? `${title} | ${SITE_NAME}` : DEFAULT_TITLE);

export const truncate = (text = "", max = 158) => {
  const clean = String(text).replace(/\s+/g, " ").trim();
  return clean.length > max ? `${clean.slice(0, max - 1).replace(/\s+\S*$/, "")}…` : clean;
};

export const absoluteUrl = (origin, path = "/") => (/^https?:\/\//.test(path) ? path : `${origin}${path}`);

// Canonical collection URL; params are written in a fixed order so the same
// listing always has one URL (used by pages, breadcrumbs and the sitemap).
export const collectionPath = (collection = "all", params = {}) => {
  const query = new URLSearchParams();
  ["gender", "category"].forEach((key) => params[key] && query.set(key, params[key]));
  const qs = query.toString();
  return `/collections/${collection}${qs ? `?${qs}` : ""}`;
};

export const productDescription = (product) =>
  truncate(`${product.name}${product.brand ? ` by ${product.brand}` : ""}. ${product.description}`);

export const organizationJsonLd = (origin) => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: origin,
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+92-300-0000000",
    email: "support@nowhere.pk",
    contactType: "customer service",
    areaServed: "PK",
    availableLanguage: ["English", "Urdu"],
  },
});

export const websiteJsonLd = (origin) => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: origin,
  potentialAction: {
    "@type": "SearchAction",
    target: { "@type": "EntryPoint", urlTemplate: `${origin}/collections/all?search={search_term_string}` },
    "query-input": "required name=search_term_string",
  },
});

export const breadcrumbJsonLd = (origin, items) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: absoluteUrl(origin, item.path),
  })),
});

export const productBreadcrumbs = (product) => [
  { name: "Home", path: "/" },
  { name: product.gender || "Shop", path: collectionPath("all", { gender: product.gender }) },
  { name: product.category, path: collectionPath("all", { gender: product.gender, category: product.category }) },
  { name: product.name, path: productPath(product) },
];

// schema.org Product with offer, shipping, returns and rating, for Google rich results.
export const productJsonLd = (origin, product, reviews = []) => {
  const url = absoluteUrl(origin, productPath(product));
  const price = effectivePrice(product);
  const data = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: truncate(product.description, 500),
    sku: product.sku,
    url,
    image: (product.images || []).map((img) => img.url),
    category: product.category,
    color: (product.colors || []).join(", "),
    ...(product.material && { material: product.material }),
    ...(product.brand && { brand: { "@type": "Brand", name: product.brand } }),
    offers: {
      "@type": "Offer",
      url,
      priceCurrency: "PKR",
      price,
      availability: product.countInStock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: { "@type": "Organization", name: SITE_NAME },
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingRate: { "@type": "MonetaryAmount", value: price >= FREE_SHIPPING_FROM ? 0 : SHIPPING_FEE, currency: "PKR" },
        shippingDestination: { "@type": "DefinedRegion", addressCountry: "PK" },
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          handlingTime: { "@type": "QuantitativeValue", minValue: 0, maxValue: 1, unitCode: "DAY" },
          transitTime: { "@type": "QuantitativeValue", minValue: 3, maxValue: 5, unitCode: "DAY" },
        },
      },
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        applicableCountry: "PK",
        returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
        merchantReturnDays: 30,
        returnMethod: "https://schema.org/ReturnByMail",
      },
    },
  };
  if (product.numReviews > 0) {
    data.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: product.numReviews,
      bestRating: 5,
      worstRating: 1,
    };
  }
  if (reviews.length) {
    data.review = reviews.slice(0, 3).map((r) => ({
      "@type": "Review",
      author: { "@type": "Person", name: r.name },
      datePublished: String(r.createdAt).slice(0, 10),
      reviewRating: { "@type": "Rating", ratingValue: r.rating, bestRating: 5 },
      ...(r.title && { name: r.title }),
      reviewBody: r.comment,
    }));
  }
  return data;
};

export const faqJsonLd = (sections) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: sections.flatMap((section) =>
    section.questions.map((q) => ({
      "@type": "Question",
      name: q.question,
      acceptedAnswer: { "@type": "Answer", text: q.answer },
    }))
  ),
});
