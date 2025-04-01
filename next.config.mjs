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
};

export default nextConfig;
