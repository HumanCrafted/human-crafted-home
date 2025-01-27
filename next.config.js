/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["localhost"],
  },
  eslint: {
    // Remove this if you want to ensure ESLint runs during build
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig

