# Nowhere API

Express + MongoDB REST API for the Nowhere store, including the **Nora** shopping assistant.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the API with nodemon (default port `9000`) |
| `npm start` | Start the API with Node |
| `npm test` | End-to-end API and assistant tests (in-memory MongoDB + mock LLM) |
| `npm run seed` | Fresh database: sample catalogue and reviews, verified admin from `ADMIN_*` |
| `npm run enhance` | Upgrade an existing catalogue in place by SKU (`-- --dry` to preview) |

Copy `.env.example` to `.env` before running. The assistant is enabled when at least one of `GROQ_API_KEY`, `GEMINI_API_KEY` or `AGENT_BASE_URL` is set.

## Layout

```
agent/        provider.js (Groq / Gemini / custom), tools.js, prompt.js, agentService.js
config/       db.js, store.js (shipping, coupons, policies, size guide)
data/         sample products and reviews
middleware/   protect / optionalAuth / admin, error handling
models/       User, Product, Review, Cart, Order, Subscriber, AgentSession
routes/       users, products, cart, checkout, orders, agent, store, contact, admin
scripts/      enhanceProducts.js
services/     productService, cartService, orderService
tests/        api.test.js, mockLlm.js
utils/        mailer, HttpError, text helpers
```

Routes stay thin; business rules live in `services/` so the REST API and the assistant's tools share the same validation, pricing and stock logic.

See the [root README](../README.md) and the [docs](../docs) for the full API reference and architecture.
