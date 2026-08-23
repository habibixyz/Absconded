/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  ...(process.env.EXPORT_BUILD === 'true' ? { output: 'export' } : {}),
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
