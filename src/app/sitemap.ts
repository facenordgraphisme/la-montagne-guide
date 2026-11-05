import type { MetadataRoute } from 'next'
import { client } from '@/sanity/lib/client'

const SITE = 'https://www.la-montagne-guide.fr'

export const revalidate = 3600

const PUBLISHED = '!(_id in path("drafts.**")) && !(isHidden == true) && defined(slug.current)'

// A slugEn shared by several posts belongs to the oldest one (same rule as postBySlugEnQuery)
const query = `{
  "activities": *[_type == "activity" && !(_id in path("drafts.**")) && defined(slug.current)]{ "slug": slug.current, _updatedAt },
  "univers": *[_type == "univers" && ${PUBLISHED} && defined(activity->slug.current)]{ "slug": slug.current, "activity": activity->slug.current, _updatedAt },
  "sejours": *[_type == "sejour" && ${PUBLISHED} && defined(subCategory->slug.current)]{
    "slug": slug.current, slugEn, _updatedAt,
    "univers": subCategory->slug.current,
    "activity": subCategory->activity->slug.current
  },
  "posts": *[_type == "post" && ${PUBLISHED}] | order(_createdAt asc) { "slug": slug.current, slugEn, "hasEnBody": defined(bodyEn), _updatedAt },
  "resources": *[_type == "resource" && !(_id in path("drafts.**")) && defined(slug.current)]{ "slug": slug.current, slugEn, _updatedAt },
  "hideRessources": *[_type == "settings"][0].hideRessourcesPage,
  "hideTarifs": *[_type == "settings"][0].hideTarifsPage
}`

const url = (path: string) => encodeURI(`${SITE}${path}`)

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Tagged so the Sanity webhook (/api/revalidate) purges it too
  const data = await client.fetch(query, {}, { next: { revalidate, tags: ['sanity'] } })
  const entries = new Map<string, MetadataRoute.Sitemap[number]>()

  const add = (frPath: string, enPath: string | null, priority: number, lastModified?: string) => {
    const fr = url(frPath)
    const en = enPath ? url(enPath) : null
    const alternates = en ? { languages: { fr, en, 'x-default': fr } } : undefined
    if (!entries.has(fr)) entries.set(fr, { url: fr, lastModified, priority, alternates })
    if (en && !entries.has(en)) entries.set(en, { url: en, lastModified, priority: Math.round(priority * 7) / 10, alternates })
  }
  // Same slug in both languages
  const addShared = (path: string, priority: number, lastModified?: string) =>
    add(path, path === '/' ? '/en' : `/en${path}`, priority, lastModified)

  addShared('/', 1)
  addShared('/activites', 0.8)
  addShared('/prochaines-sorties', 0.8)
  addShared('/blog', 0.7)
  addShared('/le-guide', 0.6)
  addShared('/contact', 0.6)
  if (!data.hideTarifs) addShared('/tarifs', 0.5)
  if (!data.hideRessources) addShared('/ressources', 0.6)
  add('/mentions-legales', null, 0.1)
  add('/confidentialite', null, 0.1)

  for (const a of data.activities) addShared(`/${a.slug}`, 0.9, a._updatedAt)
  for (const u of data.univers) addShared(`/${u.activity}/${u.slug}`, 0.8, u._updatedAt)

  for (const s of data.sejours) {
    if (!s.activity) continue
    const base = `/${s.activity}/${s.univers}`
    add(`${base}/${s.slug}`, s.slugEn ? `/en${base}/${s.slugEn}` : null, 0.9, s._updatedAt)
  }

  const claimedSlugEn = new Set<string>()
  for (const p of data.posts) {
    const ownsSlugEn = p.slugEn && p.hasEnBody && !claimedSlugEn.has(p.slugEn)
    if (ownsSlugEn) claimedSlugEn.add(p.slugEn)
    add(`/${p.slug}`, ownsSlugEn ? `/en/${p.slugEn}` : null, 0.6, p._updatedAt)
  }

  if (!data.hideRessources) {
    for (const r of data.resources) {
      add(`/ressources/${r.slug}`, r.slugEn ? `/en/ressources/${r.slugEn}` : null, 0.6, r._updatedAt)
    }
  }

  return [...entries.values()]
}
