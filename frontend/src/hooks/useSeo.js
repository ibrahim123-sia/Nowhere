import { useEffect } from "react";
import { DEFAULT_DESCRIPTION, DEFAULT_IMAGE, SITE_NAME, absoluteUrl, pageTitle } from "../utils/seo";

const upsert = (selector, tag, attrs) => {
  let el = document.head.querySelector(selector);
  if (!el) {
    el = document.createElement(tag);
    document.head.appendChild(el);
  }
  Object.entries(attrs).forEach(([key, value]) => el.setAttribute(key, value));
};

const setMeta = (attr, key, content) => upsert(`meta[${attr}="${key}"]`, "meta", { [attr]: key, content });

// Sets the page title, description, canonical URL, robots, Open Graph /
// Twitter tags and JSON-LD structured data for the current route.
const useSeo = ({ title, description, image, path, type = "website", noindex = false, jsonLd } = {}) => {
  const key = JSON.stringify({ title, description, image, path, type, noindex, jsonLd });

  useEffect(() => {
    const origin = window.location.origin;
    const url = absoluteUrl(origin, path ?? window.location.pathname);
    const fullTitle = pageTitle(title);
    const desc = description || DEFAULT_DESCRIPTION;
    const img = absoluteUrl(origin, image || DEFAULT_IMAGE);

    document.title = fullTitle;
    setMeta("name", "description", desc);
    setMeta("name", "robots", noindex ? "noindex, follow" : "index, follow, max-image-preview:large");
    upsert('link[rel="canonical"]', "link", { rel: "canonical", href: url });

    setMeta("property", "og:site_name", SITE_NAME);
    setMeta("property", "og:type", type);
    setMeta("property", "og:title", fullTitle);
    setMeta("property", "og:description", desc);
    setMeta("property", "og:url", url);
    setMeta("property", "og:image", img);
    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:title", fullTitle);
    setMeta("name", "twitter:description", desc);
    setMeta("name", "twitter:image", img);

    const existing = document.getElementById("seo-jsonld");
    if (jsonLd && !noindex) {
      const script = existing || Object.assign(document.createElement("script"), { id: "seo-jsonld", type: "application/ld+json" });
      script.textContent = JSON.stringify(jsonLd);
      if (!existing) document.head.appendChild(script);
    } else if (existing) {
      existing.remove();
    }
    // `key` captures every input; the values above are read from it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
};

export default useSeo;
