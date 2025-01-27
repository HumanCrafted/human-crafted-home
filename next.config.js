/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '',
        pathname: '/**',
      },
    ],
    unoptimized: true,
  },
  eslint: {
    // Remove this if you want to ensure ESLint runs during build
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig

