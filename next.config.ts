import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.shopify.com' },
      { protocol: 'https', hostname: 'www.beauticate.com' },
      { protocol: 'https', hostname: 'beauticate.com' },
      { protocol: 'https', hostname: 'beauticate.shop' },
    ],
  },

  // Preserve WordPress URL structures and redirect beauticate.shop paths
  async redirects() {
    return [
      // beauticate.shop → beauticate.com/shop
      {
        source: '/collections/:slug',
        destination: '/shop/collections/:slug',
        permanent: true,
      },
      {
        source: '/products/:slug',
        destination: '/shop/products/:slug',
        permanent: true,
      },
      // Legacy WordPress paths
      {
        source: '/category/:slug*',
        destination: '/:slug*',
        permanent: true,
      },
      // Legacy pages
      {
        source: '/about',
        destination: '/about-beauticate',
        permanent: true,
      },
    ]
  },

  // SVG as React components
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    })
    return config
  },
}

export default nextConfig
