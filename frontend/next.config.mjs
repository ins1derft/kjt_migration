/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  async rewrites() {
    if (process.env.NODE_ENV !== 'production') {
      return [
        {
          source: '/api/:path*',
          destination: process.env.NEXT_API_PROXY || 'http://nginx/api/:path*',
        },
      ];
    }
    return [];
  },
};

export default nextConfig;
