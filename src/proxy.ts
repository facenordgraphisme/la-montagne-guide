import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PRODUCTION_DOMAIN = 'www.la-montagne-guide.fr'

export function proxy(request: NextRequest) {
  const host = request.headers.get('host') || ''

  // Redirect *.vercel.app and non-www to the canonical domain (preview deployments stay testable, Vercel already noindexes them)
  const isPreview = process.env.VERCEL_ENV === 'preview'
  if ((host.endsWith('.vercel.app') && !isPreview) || host === 'la-montagne.guide' || host === 'la-montagne-guide.fr') {
    const url = request.nextUrl.clone()
    url.host = PRODUCTION_DOMAIN
    url.protocol = 'https'
    url.port = ''
    const response = NextResponse.redirect(url, { status: 301 })
    // Tell Google not to index this URL
    response.headers.set('X-Robots-Tag', 'noindex, nofollow')
    return response
  }

  // The URL decides the language: /en/* is English, everything else is French.
  // This header is how the server (root layout, getServerTranslations) learns it.
  const { pathname } = request.nextUrl
  const headers = new Headers(request.headers)
  if (pathname === '/en' || pathname.startsWith('/en/')) headers.set('x-lang', 'en')
  else headers.delete('x-lang')

  return NextResponse.next({ request: { headers } })
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon|api/|studio).*)',
  ],
}
