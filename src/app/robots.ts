import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/studio', '/api/'],
    },
    sitemap: 'https://www.la-montagne-guide.fr/sitemap.xml',
    host: 'https://www.la-montagne-guide.fr',
  }
}
