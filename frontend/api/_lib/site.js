// Helpers shared by the Vercel functions (files under api/_lib are not routes).
import { readFile } from "node:fs/promises";
import path from "node:path";

export const backendUrl = () => (process.env.VITE_BACKEND_URL || process.env.BACKEND_URL || "").replace(/\/+$/, "");

// Public origin of the storefront, e.g. https://nowhere.pk
export const siteOrigin = (req) => {
  if (process.env.SITE_URL) return process.env.SITE_URL.replace(/\/+$/, "");
  const host = req.headers["x-forwarded-host"] || req.headers.host;
  const proto = req.headers["x-forwarded-proto"] || (host?.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}`;
};

export const escapeHtml = (value = "") =>
  String(value).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

// JSON inside <script> must not be able to close the tag.
export const safeJson = (data) => JSON.stringify(data).replace(/</g, "\\u003c");

export const fetchJson = async (url, timeoutMs = 4000) => {
  const res = await fetch(url, { signal: AbortSignal.timeout(timeoutMs), headers: { accept: "application/json" } });
  if (!res.ok) {
    const error = new Error(`${res.status} from ${url}`);
    error.status = res.status;
    throw error;
  }
  return res.json();
};

let indexHtml;

// The built SPA shell: read from the deployment bundle, or fetched from the
// site itself (static files are served before rewrites, so this can't loop).
export const loadIndexHtml = async (origin) => {
  if (indexHtml) return indexHtml;
  try {
    indexHtml = await readFile(path.join(process.cwd(), "dist", "index.html"), "utf8");
  } catch {
    const res = await fetch(`${origin}/index.html`, { signal: AbortSignal.timeout(4000) });
    if (!res.ok) throw new Error(`index.html: ${res.status}`);
    indexHtml = await res.text();
  }
  return indexHtml;
};
