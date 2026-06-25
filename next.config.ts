import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development", 
  register: true,
  skipWaiting: true,
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Isso avisa ao Next.js 16+ para aceitar plugins baseados em Webpack
  experimental: {
    turbopack: {},
  },
};

export default withPWA(nextConfig);