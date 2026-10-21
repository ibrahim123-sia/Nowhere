// /sitemap.xml: storefront pages, collections and every published product,
// built from the live catalogue so new products are discoverable right away.
import { productPath, slugify } from "../src/utils/product.js";
import { absoluteUrl, collectionPath } from "../src/utils/seo.js";
import { backendUrl, escapeHtml, fetchJson, siteOrigin } from "./_lib/site.js";

const STATIC_PAGES = [
  { path: "/", priority: "1.0", changefreq: "daily" },
  { path: collectionPath("all"), priority: "0.9", changefreq: "daily" },
  { path: collectionPath("new-arrivals"), priority: "0.9", changefreq: "daily" },
  { path: collectionPath("sale"), priority: "0.8", changefreq: "daily" },
  ...["Men", "Women"].flatMap((gender) => [
    { path: collectionPath("all", { gender }), priority: "0.8", changefreq: "daily" },
    ...["Top Wear", "Bottom Wear"].map((category) => ({
      path: collectionPath("all", { gender, category }),
      priority: "0.7",
      changefreq: "weekly",
    })),
  ]),
  { path: "/about", priority: "0.4", changefreq: "monthly" },
  { path: "/features", priority: "0.4", changefreq: "monthly" },
  { path: "/faqs", priority: "0.5", changefreq: "monthly" },
  { path: "/contact", priority: "0.4", changefreq: "monthly" },
];

const urlEntry = (origin, { path, lastmod, priority, changefreq, image, imageTitle }) =>
  [
    "  <url>",
    `    <loc>${escapeHtml(absoluteUrl(origin, path))}</loc>`,
    lastmod && `    <lastmod>${new Date(lastmod).toISOString().slice(0, 10)}</lastmod>`,
    changefreq && `    <changefreq>${changefreq}</changefreq>`,
    priority && `    <priority>${priority}</priority>`,
    image && `    <image:image><image:loc>${escapeHtml(image)}</image:loc><image:title>${escapeHtml(imageTitle)}</image:title></image:image>`,
    "  </url>",
  ]
    .filter(Boolean)
    .join("\n");

export const buildSitemap = (origin, { products = [], collections = [] } = {}) => {
  const entries = [
    ...STATIC_PAGES,
    ...collections.map((name) => ({ path: collectionPath(slugify(name)), priority: "0.7", changefreq: "weekly" })),
    ...products.map((p) => ({
      path: productPath(p),
      lastmod: p.updatedAt,
      priority: "0.8",
      changefreq: "weekly",
      image: p.image,
      imageTitle: p.name,
    })),
  ];
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">',
    ...entries.map((entry) => urlEntry(origin, entry)),
    "</urlset>",
    "",
  ].join("\n");
};

export default async function handler(req, res) {
  const origin = siteOrigin(req);
  let catalogue = {};
  let cache = "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400";
  try {
    if (backendUrl()) catalogue = await fetchJson(`${backendUrl()}/api/products/sitemap`, 8000);
  } catch (error) {
    // Still list the static pages; don't cache the partial result for long.
    console.error("[seo] sitemap catalogue failed", error.message);
    cache = "public, s-maxage=300";
  }
  res.statusCode = 200;
  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader("Cache-Control", cache);
  res.end(buildSitemap(origin, catalogue));
}
