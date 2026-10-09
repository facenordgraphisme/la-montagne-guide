import { defineDocuments, defineLocations, type PresentationPluginOptions } from 'sanity/presentation'

// Order matters: /en/... routes must be tried before the generic /:activity/:univers pattern
export const resolve: PresentationPluginOptions['resolve'] = {
  mainDocuments: defineDocuments([
    { route: '/', filter: `_type == "home"` },
    { route: '/le-guide', filter: `_type == "guide"` },
    { route: '/contact', filter: `_type == "contact"` },
    { route: '/en/ressources/:slug', filter: `_type == "resource" && slugEn == $slug` },
    { route: '/en/:activity/:univers/:slug', filter: `_type == "sejour" && slugEn == $slug` },
    { route: '/en/:slug', filter: `_type == "post" && slugEn == $slug` },
    { route: '/ressources/:slug', filter: `_type == "resource" && slug.current == $slug` },
    { route: '/:activity/:univers/:slug', filter: `_type == "sejour" && slug.current == $slug` },
    { route: '/:activity/:univers', filter: `_type == "univers" && slug.current == $univers` },
    { route: '/:slug', filter: `_type in ["activity", "post"] && slug.current == $slug` },
  ]),
  locations: {
    home: defineLocations({ message: "Page d'accueil", locations: [{ title: 'Accueil', href: '/' }] }),
    guide: defineLocations({ locations: [{ title: 'Le Guide', href: '/le-guide' }] }),
    contact: defineLocations({ locations: [{ title: 'Contact', href: '/contact' }] }),
    activity: defineLocations({
      select: { title: 'title', slug: 'slug.current' },
      resolve: (doc) => (doc?.slug ? { locations: [{ title: doc.title || 'Activité', href: `/${doc.slug}` }] } : null),
    }),
    univers: defineLocations({
      select: { title: 'title', slug: 'slug.current', activity: 'activity.slug.current' },
      resolve: (doc) =>
        doc?.slug && doc?.activity ? { locations: [{ title: doc.title || 'Univers', href: `/${doc.activity}/${doc.slug}` }] } : null,
    }),
    sejour: defineLocations({
      select: {
        title: 'title',
        slug: 'slug.current',
        slugEn: 'slugEn',
        univers: 'subCategory.slug.current',
        activity: 'subCategory.activity.slug.current',
      },
      resolve: (doc) => {
        if (!doc?.slug || !doc?.univers || !doc?.activity) return null
        const base = `/${doc.activity}/${doc.univers}`
        return {
          locations: [
            { title: doc.title || 'Séjour', href: `${base}/${doc.slug}` },
            ...(doc.slugEn ? [{ title: `${doc.title || 'Séjour'} (EN)`, href: `/en${base}/${doc.slugEn}` }] : []),
          ],
        }
      },
    }),
    post: defineLocations({
      select: { title: 'title', slug: 'slug.current', slugEn: 'slugEn' },
      resolve: (doc) =>
        doc?.slug
          ? {
              locations: [
                { title: doc.title || 'Article', href: `/${doc.slug}` },
                ...(doc.slugEn ? [{ title: `${doc.title || 'Article'} (EN)`, href: `/en/${doc.slugEn}` }] : []),
                { title: 'Blog', href: '/blog' },
              ],
            }
          : null,
    }),
    resource: defineLocations({
      select: { title: 'title', slug: 'slug.current', slugEn: 'slugEn' },
      resolve: (doc) =>
        doc?.slug
          ? {
              locations: [
                { title: doc.title || 'Ressource', href: `/ressources/${doc.slug}` },
                ...(doc.slugEn ? [{ title: `${doc.title || 'Ressource'} (EN)`, href: `/en/ressources/${doc.slugEn}` }] : []),
              ],
            }
          : null,
    }),
  },
}
