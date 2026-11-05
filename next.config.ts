import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Title, canonical and hreflang always in <head>: when streamed they can land after </head>, even for Googlebot
  htmlLimitedBots: /.*/,
  images: {
    loader: 'custom',
    loaderFile: './src/sanity/lib/imageLoader.ts',
    qualities: [75, 85, 90],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
    ],
  },
  async redirects() {
    return [
      { source: '/alpinisme/stages-alpinisme', destination: '/alpinisme/stage-alpinisme', permanent: true },
      { source: '/goulotte-pschitt', destination: '/goulotte-pschitt-ailefroide-orientale', permanent: true },
      { source: '/pilier-sud-tete-fetoules', destination: '/tete-fetoules-south-pillar', permanent: true },
      { source: '/tour-bans', destination: '/tour-des-bans-ecrins', permanent: true },
      { source: '/paralpinisme', destination: '/parapente-alpinisme', permanent: true },
      { source: '/ski/ski-de-randonnee', destination: '/ski/ski-randonnee', permanent: true },
      { source: '/ski/freerando', destination: '/ski/ski-hors-piste', permanent: true },
      { source: '/ski/freeride-', destination: '/ski/ski-hors-piste', permanent: true },
      { source: '/ski/ski-de-pente-raide', destination: '/ski/ski-alpinisme', permanent: true },
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
