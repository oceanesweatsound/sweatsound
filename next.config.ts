import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
      {
        protocol: 'https',
        hostname: 'image.tmdb.org',
      },
      {
        protocol: 'https',
        hostname: 'media.hachette.fr',
      },
      {
        protocol: 'https',
        hostname: 'actes-sud.fr',
      },
    ],
  },
};

export default nextConfig;
