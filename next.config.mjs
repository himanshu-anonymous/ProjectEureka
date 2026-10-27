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
};

export default nextConfig;
