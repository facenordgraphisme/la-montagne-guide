import type { MetadataRoute } from 'next'
import { client } from '@/sanity/lib/client'

const SITE = 'https://www.la-montagne-guide.fr'

export const revalidate = 3600

const PUBLISHED = '!(_id in path("drafts.**")) && !(isHidden == true) && defined(slug.current)'

const query = `{
  "activities": *[_type == "activity" && !(_id in path("drafts.**")) && defined(slug.current)]{ "slug": slug.current, _updatedAt },
  "univers": *[_type == "univers" && ${PUBLISHED} && defined(activity->slug.current)]{ "slug": slug.current, "activity": activity->slug.current, _updatedAt },
  "sejours": *[_type == "sejour" && ${PUBLISHED} && defined(subCategory->slug.current)]{
    "slug": slug.current, slugEn, _updatedAt,
    "univers": subCategory->slug.current,
    "activity": subCategory->activity->slug.current
  },
  "posts": *[_type == "post" && ${PUBLISHED}]{ "slug": slug.current, slugEn, _updatedAt },
  "resources": *[_type == "resource" && !(_id in path("drafts.**")) && defined(slug.current)]{ "slug": slug.current, slugEn, _updatedAt },
  "hideRessources": *[_type == "settings"][0].hideRessourcesPage
}`

const url = (path: string) => encodeURI(`${SITE}${path}`)

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const data = await client.fetch(query)
  const entries: MetadataRoute.Sitemap = []

  const staticPages: [string, number][] = [
    ['/', 1],
    ['/activites', 0.8],
    ['/prochaines-sorties', 0.8],
    ['/blog', 0.7],
    ['/le-guide', 0.6],
    ['/contact', 0.6],
    ['/tarifs', 0.5],
    ['/mentions-legales', 0.1],
    ['/confidentialite', 0.1],
  ]
  if (!data.hideRessources) staticPages.push(['/ressources', 0.6])
  for (const [path, priority] of staticPages) entries.push({ url: url(path), priority })

  for (const a of data.activities) {
    entries.push({ url: url(`/${a.slug}`), lastModified: a._updatedAt, priority: 0.9 })
  }
  for (const u of data.univers) {
    entries.push({ url: url(`/${u.activity}/${u.slug}`), lastModified: u._updatedAt, priority: 0.8 })
  }
  for (const s of data.sejours) {
    if (!s.activity) continue
    const fr = url(`/${s.activity}/${s.univers}/${s.slug}`)
    const en = s.slugEn ? url(`/en/${s.activity}/${s.univers}/${s.slugEn}`) : null
    const alternates = en ? { languages: { fr, en } } : undefined
    entries.push({ url: fr, lastModified: s._updatedAt, priority: 0.9, alternates })
    if (en) entries.push({ url: en, lastModified: s._updatedAt, priority: 0.7, alternates })
  }
  for (const p of data.posts) {
    const fr = url(`/${p.slug}`)
    const en = p.slugEn ? url(`/en/${p.slugEn}`) : null
    const alternates = en ? { languages: { fr, en } } : undefined
    entries.push({ url: fr, lastModified: p._updatedAt, priority: 0.6, alternates })
    if (en) entries.push({ url: en, lastModified: p._updatedAt, priority: 0.4, alternates })
  }
  if (!data.hideRessources) {
    for (const r of data.resources) {
      const fr = url(`/ressources/${r.slug}`)
      const en = r.slugEn ? url(`/en/ressources/${r.slugEn}`) : null
      const alternates = en ? { languages: { fr, en } } : undefined
      entries.push({ url: fr, lastModified: r._updatedAt, priority: 0.6, alternates })
      if (en) entries.push({ url: en, lastModified: r._updatedAt, priority: 0.4, alternates })
    }
  }

  return entries
}
