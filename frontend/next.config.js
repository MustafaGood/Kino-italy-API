/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static optimization
  output: 'export',
  
  // Disable strict mode during development for easier testing
  reactStrictMode: false,
  
  // Configure trailing slashes consistently
  trailingSlash: false,
  
  // Enable image optimization
  images: {
    domains: ['plankton-app-xhkom.ondigitalocean.app'],
    unoptimized: true,
  },
  
  // Configure TypeScript settings
  typescript: {
    // Disable TypeScript during build for faster builds (if using TypeScript)
    // Set to true if you want TypeScript errors to be checked during build
    ignoreBuildErrors: true,
  }
};

module.exports = nextConfig; 