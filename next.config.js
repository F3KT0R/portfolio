/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: { images: { allowFutureImage: true } },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = [...config.externals, 'canvas', 'jsdom']
    }
    return config
  }
}

module.exports = nextConfig
