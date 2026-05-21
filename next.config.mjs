/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pub-9241a3f69fe0429c9ba547a7017c6648.r2.dev',
      },
    ],
  },
};

export default nextConfig;
