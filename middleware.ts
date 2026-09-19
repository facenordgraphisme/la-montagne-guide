import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PRODUCTION_DOMAIN = 'www.la-montagne-guide.fr'

export function middleware(request: NextRequest) {
  const host = request.headers.get('host') || ''

  // Redirect *.vercel.app and non-www to the canonical domain
  if (host.endsWith('.vercel.app') || host === 'la-montagne.guide' || host === 'la-montagne-guide.fr') {
    const url = request.nextUrl.clone()
    url.host = PRODUCTION_DOMAIN
    url.protocol = 'https'
    url.port = ''
    const response = NextResponse.redirect(url, { status: 301 })
    // Tell Google not to index this URL
    response.headers.set('X-Robots-Tag', 'noindex, nofollow')
    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon|api/|studio).*)',
  ],
}
