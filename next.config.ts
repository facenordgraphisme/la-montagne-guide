import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    loader: 'custom',
    loaderFile: './src/sanity/lib/imageLoader.ts',
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/prestations/:slug',
        destination: '/:slug',
        permanent: true,
      },
      {
        source: '/prestations',
        destination: '/activites',
        permanent: true,
      },
      {
        source: '/activite',
        destination: '/activites',
        permanent: true,
      },
      {
        source: '/activites/:slug',
        destination: '/:slug',
        permanent: true,
      },
      {
        source: '/blog/:slug',
        destination: '/:slug',
        permanent: true,
      },
    ]
  },
};

export default nextConfig;
