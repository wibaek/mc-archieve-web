/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [
      "image.stage.mc-archieve.wibaek.com",
      "image.mc-archieve.wibaek.com",
    ],
  },
};

export default nextConfig;
