/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [],
    formats: ['image/avif', 'image/webp'],
  },
  experimental: {
    optimizePackageImports: ['framer-motion', 'react-icons'],
  },
  // 优化字体加载
  optimizeFonts: true,
}

module.exports = nextConfig
