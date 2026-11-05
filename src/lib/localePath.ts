const UNLOCALIZED = /^\/(en|api|studio|_next)(\/|$)/
const FILE = /\.[a-z0-9]+$/i

export const isEnPath = (pathname?: string | null) => pathname === '/en' || !!pathname?.startsWith('/en/')

// "/contact" -> "/en/contact". Leaves external links, anchors, files and already-prefixed paths alone.
export function toEnPath(href: string): string {
  if (!href.startsWith('/') || href.startsWith('//')) return href
  const path = href.split(/[?#]/)[0]
  if (UNLOCALIZED.test(path) || FILE.test(path)) return href
  return href === '/' ? '/en' : href.startsWith('/?') || href.startsWith('/#') ? `/en${href.slice(1)}` : `/en${href}`
}

export function decodeSlug(slug: string) {
  try { return decodeURIComponent(slug).normalize('NFC') } catch { return slug }
}

export function toFrPath(pathname: string): string {
  return pathname.replace(/^\/en(?=\/|$)/, '') || '/'
}
