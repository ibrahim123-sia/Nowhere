import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Public site URL for absolute links in index.html (social previews need them).
// Falls back to the production domain Vercel exposes at build time.
const siteUrl = () =>
  (process.env.SITE_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL && `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`) ||
    '').replace(/\/+$/, '')

const absoluteShareImage = () => ({
  name: 'absolute-share-image',
  transformIndexHtml(html) {
    const url = siteUrl()
    return url ? html.replaceAll('content="/og-image.jpg"', `content="${url}/og-image.jpg"`) : html
  },
})

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), absoluteShareImage()],
})
