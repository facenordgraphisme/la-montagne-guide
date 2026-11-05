import { getLanguage } from '@/i18n/server'
import { toEnPath } from '@/lib/localePath'
import { SITE_URL } from '@/lib/seo'

type Crumb = { name: string; path: string }

// French paths are moved under /en on English pages; paths already under /en and full URLs are kept
async function absolute(path: string) {
  if (path.startsWith('http')) return path
  const lang = await getLanguage()
  return encodeURI(SITE_URL + (lang === 'en' ? toEnPath(path) : path))
}

const script = (data: object) => (
  <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
)

// Breadcrumb trail shown by Google instead of the raw URL. Home is added first.
export async function BreadcrumbJsonLd({ items }: { items: Crumb[] }) {
  const lang = await getLanguage()
  const trail = [{ name: lang === 'en' ? 'Home' : 'Accueil', path: '/' }, ...items.filter(i => i.name)]
  return script({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: await Promise.all(trail.map(async (c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name.charAt(0).toUpperCase() + c.name.slice(1),
      item: await absolute(c.path),
    }))),
  })
}

// A page's catalogue (univers of an activity, stays of an univers)
export async function ItemListJsonLd({ name, items }: { name: string; items: Crumb[] }) {
  if (!items.length) return null
  return script({
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name,
    numberOfItems: items.length,
    itemListElement: await Promise.all(items.map(async (c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      url: await absolute(c.path),
    }))),
  })
}
