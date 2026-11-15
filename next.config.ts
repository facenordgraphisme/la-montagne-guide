import type { NextConfig } from "next";

// Old slug (still in Google's index) -> current Sanity slug. Matched by WordPress post id,
// archived title and publish date. Keep until Sanity stores old slugs itself.
const RENAMED_POSTS: Record<string, string> = {
  '4-jours-dans-les-ecrins': '4-jours-alpinisme-ecrins',
  'barrah-tribord-toute': 'barrah-tribord-toute-wadi-rum',
  'black-magic': 'black-magic-wadi-rum',
  'cat-fish-corner': 'cat-fish-corner-wadi-rum',
  'crete-reychard': 'ski-randonnee-puy-saint-vincent-crete-reychard',
  'deux-jours-poudreland': 'deux-jours-poudreuse-serre-chevalier',
  'ecole-glace-3': 'ecole-glace-crampons-ecrins',
  'grandes-voies': 'grandes-voies-hautes-alpes',
  'hors-piste-serre-che': 'hors-piste-serre-chevalier-montagnolle',
  'initiation-alpinisme-place-aux-pietons': 'initiation-alpinisme-week-end',
  'initiation-poudreuse': 'initiation-poudreuse-week-end-ski-randonnee',
  'initiation-seuls-au-monde': 'initiation-alpinisme-seuls-au-monde',
  'initiation-ski-de-rando-cochette': 'initiation-ski-de-rando-cochette-briancon',
  'la-tete-dans-les-nuages': 'initiation-alpinisme-ecrins-arsine-roche-faurio',
  'mont-rose-2': 'cosmiques-mont-rose-alpinisme',
  'pelas-vernet': 'ski-blanche-face-ouest-couloir-pelas-vernet',
  'ptit-tour-a-jacquette': 'ski-randonnee-jacquette-marcelette-ceillac',
  'retour-dans-le-raide': 'grande-voie-cap-canaille',
  'roche-faurio-2': 'roche-faurio-ecole-glace',
  'roche-faurio-3': 'roche-faurio-ascension',
  'roche-paillon-emile-pic-2': 'roche-paillon-emile-pic-traversee-neige',
  'tete-aval': 'tete-aval-polichinelle-pilier-rouge',
  'tete-raisins-2': 'ski-randonnee-tete-des-raisins-freissinieres',
  'un-mont-blanc': 'mont-blanc-trois-jours-tete-rousse-gouter',
  // Slugs with accents or a space, cleaned on 2026-11-15 (case-only renames live in proxy.ts:
  // redirects here match case-insensitively and would loop)
  'initiation-alpinisme -seuls-au-monde': 'initiation-alpinisme-seuls-au-monde',
  'initiation-ski-de-rando-cochette-briançon': 'initiation-ski-de-rando-cochette-briancon',
  'crete-seyte-ski-de-randonnée': 'crete-seyte-ski-de-randonnee',
  'ski-de-rando-mission-sauvetage-Montgenèvre': 'ski-de-rando-mission-sauvetage-montgenevre',
  'initiation-ski-randonnée-briançon': 'initiation-ski-randonnee-briancon',
  'initiation-poudreuse-week-end-ski-randonnée': 'initiation-poudreuse-week-end-ski-randonnee',
  'dôme-des-ecrins-avec-troupe': 'dome-des-ecrins-avec-troupe',
}

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
  // HSTS is already sent by Vercel. SAMEORIGIN keeps the Studio's Presentation preview (same domain) working.
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()' },
        ],
      },
    ]
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
      { source: '/ski/freerando/sejour-freerando-hautes-alpes', destination: '/ski/raid-ski-sejours/freerando-hautes-alpes', permanent: true },
      // Posts renamed in Sanity in November 2026 (old WordPress slug -> current slug)
      ...Object.entries(RENAMED_POSTS).map(([from, to]) => ({
        source: `/${encodeURIComponent(from)}`,
        destination: `/${encodeURIComponent(to)}`,
        permanent: true,
      })),
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
