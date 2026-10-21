// /robots.txt: keep private and transactional pages out of search results
// and point crawlers at the sitemap on the current domain.
import { siteOrigin } from "./_lib/site.js";

const PRIVATE_PATHS = ["/admin", "/checkout", "/order-confirmation", "/order/", "/my-orders", "/profile", "/wishlist", "/login", "/register", "/api/"];

export const buildRobots = (origin) =>
  [
    "User-agent: *",
    "Allow: /",
    ...PRIVATE_PATHS.map((path) => `Disallow: ${path}`),
    // Search results and filter combinations are endless near-duplicates.
    "Disallow: /*?*search=",
    "",
    `Sitemap: ${origin}/sitemap.xml`,
    "",
  ].join("\n");

export default function handler(req, res) {
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader("Cache-Control", "public, s-maxage=86400");
  res.end(buildRobots(siteOrigin(req)));
}
