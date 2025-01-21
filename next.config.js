const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["raw.githubusercontent.com"],
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.md$/,
      use: "raw-loader",
    })
    return config
  },
  async rewrites() {
    return [
      {
        source: "/content/images/:path*",
        destination: "/images/:path*",
      },
    ]
  },
}

module.exports = nextConfig

