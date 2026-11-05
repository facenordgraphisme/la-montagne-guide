import type { Metadata } from 'next'
import { groq } from 'next-sanity'
import { client } from '@/sanity/lib/live'
import { getLanguage } from '@/i18n/server'

export const SITE_URL = 'https://www.la-montagne-guide.fr'
export const SITE_NAME = 'La Montagne Guide'

// canonical + reciprocal hreflang for a page. Pass enPath = null when it has no English version.
export function alternatesFor(lang: 'fr' | 'en', frPath: string, enPath: string | null): Metadata['alternates'] {
  return {
    canonical: lang === 'en' && enPath ? enPath : frPath,
    languages: enPath ? { fr: frPath, en: enPath, 'x-default': frPath } : undefined,
  }
}

// Same page served at /path and /en/path (home, hubs, contact…)
export async function sharedPageAlternates(frPath: string): Promise<Metadata['alternates']> {
  const enPath = frPath === '/' ? '/en' : `/en${frPath}`
  return alternatesFor(await getLanguage(), frPath, enPath)
}

const defaultOgImageQuery = groq`{
  "seo": *[_type == "settings"][0].seoImage.asset->url,
  "hero": *[_type == "home"][0].heroImages[0].asset->url
}`

// Social preview size; Sanity crops it, other URLs are left alone
function ogSized(url: string) {
  if (!url.startsWith('https://cdn.sanity.io/') || url.includes('?')) return { url }
  return { url: `${url}?w=1200&h=630&fit=crop&fm=jpg&q=80`, width: 1200, height: 630 }
}

// Site image for pages that have none: the SEO image from the settings, otherwise the first home hero
export async function defaultOgImage(): Promise<string | undefined> {
  const d = await client.fetch(defaultOgImageQuery)
  return d?.seo || d?.hero || undefined
}

// A page's openGraph replaces the layout's whole object, so every page builds it here
export async function openGraphFor(o: {
  title?: string
  description?: string
  image?: string | null
  url?: string | null
  type?: 'website' | 'article'
}): Promise<Metadata['openGraph']> {
  const lang = await getLanguage()
  const image = o.image || await defaultOgImage()
  return {
    title: o.title,
    description: o.description,
    type: o.type || 'website',
    siteName: SITE_NAME,
    url: o.url || undefined,
    locale: lang === 'en' ? 'en_GB' : 'fr_FR',
    alternateLocale: lang === 'en' ? 'fr_FR' : 'en_GB',
    images: image ? [ogSized(image)] : undefined,
  }
}

export const canonicalOf = (a: Metadata['alternates']) => (typeof a?.canonical === 'string' ? a.canonical : undefined)
