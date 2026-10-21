# Nowhere Storefront

React 18 + Vite single-page app for the Nowhere store: storefront, checkout, account pages, the Iris chat assistant and the admin panel.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start Vite on `http://localhost:5173` |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | ESLint |

Copy `.env.example` to `.env` and set `VITE_BACKEND_URL` to the API origin. `SITE_URL` (optional) is the public storefront URL used for absolute links in previews, the sitemap and robots.txt.

## Layout

```
api/            Vercel functions: /product/:slug previews, /sitemap.xml, /robots.txt
public/         static files served as-is (og-image.jpg)
src/
  components/   Layout, Product, Cart, Order, Agent, Admin, Common
  Pages/        route-level pages
  redux/        store and slices (auth, cart, products, checkout, orders, wishlist, store, agent, admin)
  hooks/        useSeo (title, meta, canonical, Open Graph, JSON-LD)
  utils/        api.js (axios client), product, order, price and SEO helpers
  assets/       brand imagery
```

Design tokens (colours, fonts, shadows) live in `tailwind.config.js`; shared component classes such as `.btn-primary`, `.input` and `.card` live in `src/index.css`.

See the [root README](../README.md) for setup and architecture.
