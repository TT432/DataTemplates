import type { NextConfig } from "next";
const isProd = process.env.NODE_ENV === 'production'
const repoName = 'DataTemplates' // 你的仓库名称

const nextConfig = {
  output: 'export', // 启用静态导出
  assetPrefix: isProd ? `/${repoName}/` : '',
  basePath: isProd ? `/${repoName}` : '',
  images: {
    unoptimized: true // 禁用图片优化（GitHub Pages 需要）
  }
}

export default nextConfig;