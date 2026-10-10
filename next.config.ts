import type { NextConfig } from 'next'

// v2 addresses keep working: anything linked or indexed before 3.0 lands on its new home.
const legacyRedirects = [
  { source: '/projects', destination: '/quests' },
  { source: '/projects/:owner/:repo', destination: '/quests' },
  { source: '/experience', destination: '/chronicle' },
  { source: '/about', destination: '/' },
  { source: '/uses', destination: '/skills' },
  { source: '/now', destination: '/' },
  { source: '/contact', destination: '/recruit' },
  { source: '/api/download-cv', destination: '/cv/Tibor_Balint_CV.pdf' },
]

const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
]

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  typedRoutes: true,
  images: { formats: ['image/avif', 'image/webp'] },
  async redirects() {
    return legacyRedirects.map((r) => ({ ...r, permanent: true }))
  },
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }]
  },
}

export default nextConfig
