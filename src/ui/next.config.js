/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  // Add cache-busting for Firebase hosting
  generateBuildId: async () => {
    return `build-${Date.now()}`
  },
  // Disable static optimization to ensure fresh builds
  experimental: {
    optimizeCss: false
  }
}

module.exports = nextConfig
