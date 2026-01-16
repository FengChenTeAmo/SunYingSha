/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production'
// GitHub Pages 使用仓库名作为路径，例如：/SunYingSha/
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || (isProd ? '/SunYingSha' : '')

const nextConfig = {
  output: 'export', // 静态导出，适用于 GitHub Pages
  basePath: basePath, // 设置 basePath 以支持 GitHub Pages 子路径
  assetPrefix: basePath, // 确保静态资源路径正确
  trailingSlash: true, // 添加尾部斜杠，有助于 GitHub Pages 路由
  images: {
    unoptimized: true, // GitHub Pages 需要禁用图片优化
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
