import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development", 
  register: true,
  // skipWaiting foi removido daqui porque já cuidamos disso no sw.js
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configurações normais do seu Next.js aqui (se houver)
};

export default withPWA(nextConfig);