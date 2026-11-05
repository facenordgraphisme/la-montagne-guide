import type { Metadata } from 'next'
import { getLanguage } from '@/i18n/server'

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
