/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverComponentsExternalPackages: ['fluent-ffmpeg', 'wavefile'],
  },
  images: {
    domains: ['images.unsplash.com'],
  },
  // Configure Next.js to serve files from these directories as static assets
  async rewrites() {
    return [
      {
        source: '/uploads/:path*',
        destination: '/api/static/uploads/:path*',
      },
      {
        source: '/processed/:path*',
        destination: '/api/static/processed/:path*',
      },
    ];
  },
  webpack: (config) => {
    // Important for server-side modules like fluent-ffmpeg
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      os: false,
    };

    return config;
  },
  // Increase API body size limit for file uploads
  api: {
    bodyParser: {
      sizeLimit: '50mb',
    },
    responseLimit: '50mb',
  },
};

module.exports = nextConfig; 