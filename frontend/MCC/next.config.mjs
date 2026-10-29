/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: false,
  experimental: {
    cpus: 1,
  },
  webpack: (config) => {
    config.cache = false;
    return config;
  },
  async rewrites() {
    const backendUrl = (process.env.BACKEND_URL || process.env.FASTAPI_BACKEND_URL || 'http://127.0.0.1:8000').replace(/\/$/, '');
    return [
      {
        source: '/api/v1/:path*',
        destination: `${backendUrl}/api/v1/:path*`,
      },
    ];
  },
};

export default nextConfig;
