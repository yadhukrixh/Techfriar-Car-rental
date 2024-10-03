/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_FRONTEND_URL: process.env.NEXT_PUBLIC_FRONTEND_URL,
  },
  images: {
    domains: ['127.0.0.1', 'localhost'], // Add trusted domains for image loading
  },
};

export default nextConfig;
