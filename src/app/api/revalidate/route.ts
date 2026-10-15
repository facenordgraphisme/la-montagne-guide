import { revalidateTag } from 'next/cache'
import { type NextRequest, NextResponse } from 'next/server'
import { parseBody } from 'next-sanity/webhook'

// Called by a Sanity webhook on every publish/unpublish/delete: drops the cached Sanity data
// (see the 'sanity' tag in src/sanity/lib/live.ts) so changes show up on the next page view
export async function POST(req: NextRequest) {
  try {
    const secret = process.env.SANITY_REVALIDATE_SECRET
    if (!secret) return new Response('Missing SANITY_REVALIDATE_SECRET', { status: 500 })

    // Third arg: wait until the change is queryable before purging, so the refetch doesn't get stale data
    const { isValidSignature, body } = await parseBody<{ _type?: string }>(req, secret, true)
    if (!isValidSignature) return new Response('Invalid signature', { status: 401 })

    revalidateTag('sanity', { expire: 0 })
    return NextResponse.json({ revalidated: true, type: body?._type ?? null, now: Date.now() })
  } catch (err) {
    console.error(err)
    return new Response((err as Error).message, { status: 500 })
  }
}
