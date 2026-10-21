// Serves /product/:slug with the product's title, description, image and
// structured data already in the HTML, so search engines and link previews
// (WhatsApp, Facebook, X) see them without running JavaScript.
import { productIdFromParam, productPath } from "../src/utils/product.js";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  pageTitle,
  productBreadcrumbs,
  productDescription,
  productJsonLd,
} from "../src/utils/seo.js";
import { backendUrl, escapeHtml, fetchJson, loadIndexHtml, safeJson, siteOrigin } from "./_lib/site.js";

// Tags the SPA shell ships with that are replaced by product-specific ones.
const REPLACED_TAGS = [
  /<title>[\s\S]*?<\/title>/i,
  /<meta\s+name="description"[^>]*>/gi,
  /<meta\s+name="robots"[^>]*>/gi,
  /<meta\s+name="twitter:[^"]*"[^>]*>/gi,
  /<meta\s+property="og:[^"]*"[^>]*>/gi,
  /<link\s+rel="canonical"[^>]*>/gi,
];

export const injectHead = (html, tags) => {
  const stripped = REPLACED_TAGS.reduce((out, pattern) => out.replace(pattern, ""), html);
  return stripped.replace("</head>", `${tags}\n  </head>`);
};

export const productHead = (origin, product, reviews = []) => {
  const title = escapeHtml(pageTitle(product.name));
  const description = escapeHtml(productDescription(product));
  const url = escapeHtml(absoluteUrl(origin, productPath(product)));
  const image = escapeHtml(product.images?.[0]?.url || absoluteUrl(origin, "/og-image.jpg"));
  const jsonLd = [productJsonLd(origin, product, reviews), breadcrumbJsonLd(origin, productBreadcrumbs(product))];
  return [
    `<title>${title}</title>`,
    `<meta name="description" content="${description}" />`,
    `<meta name="robots" content="index, follow, max-image-preview:large" />`,
    `<link rel="canonical" href="${url}" />`,
    `<meta property="og:site_name" content="Nowhere" />`,
    `<meta property="og:type" content="product" />`,
    `<meta property="og:title" content="${title}" />`,
    `<meta property="og:description" content="${description}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${image}" />`,
    `<meta property="og:image:alt" content="${escapeHtml(product.images?.[0]?.altText || product.name)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${title}" />`,
    `<meta name="twitter:description" content="${description}" />`,
    `<meta name="twitter:image" content="${image}" />`,
    `<script type="application/ld+json" id="seo-jsonld">${safeJson(jsonLd)}</script>`,
  ]
    .map((tag) => `    ${tag}`)
    .join("\n");
};

const notFoundShell = (shell) =>
  injectHead(shell, `    <title>Product not found | Nowhere</title>\n    <meta name="robots" content="noindex" />`);

const sendHtml = (res, status, html, cache) => {
  res.statusCode = status;
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", cache);
  res.end(html);
};

export default async function handler(req, res) {
  const origin = siteOrigin(req);
  const slug = String(req.query.slug || "");
  const id = productIdFromParam(slug);

  let shell;
  try {
    shell = await loadIndexHtml(origin);
  } catch (error) {
    console.error("[seo] could not load index.html", error.message);
    res.statusCode = 503;
    return res.end("Service unavailable");
  }

  if (!backendUrl()) return sendHtml(res, 200, shell, "no-store");
  if (!/^[a-f0-9]{24}$/i.test(id)) return sendHtml(res, 404, notFoundShell(shell), "public, s-maxage=300");

  try {
    const api = `${backendUrl()}/api/products/${id}`;
    const [product, reviewData] = await Promise.all([
      fetchJson(api),
      fetchJson(`${api}/reviews`).catch(() => ({ reviews: [] })),
    ]);

    // One URL per product: /product/<id> and outdated slugs redirect permanently.
    const canonical = productPath(product);
    if (`/product/${slug}` !== canonical) {
      res.statusCode = 301;
      res.setHeader("Location", canonical);
      res.setHeader("Cache-Control", "public, s-maxage=3600");
      return res.end();
    }

    const html = injectHead(shell, productHead(origin, product, reviewData.reviews || []));
    return sendHtml(res, 200, html, "public, max-age=0, s-maxage=600, stale-while-revalidate=86400");
  } catch (error) {
    if (error.status === 404 || error.status === 400) {
      return sendHtml(res, 404, notFoundShell(shell), "public, s-maxage=300");
    }
    // API unreachable: still serve the app; it will retry from the browser.
    console.error("[seo] product lookup failed", error.message);
    return sendHtml(res, 200, shell, "no-store");
  }
}
