'use client'

import type { ImageLoaderProps } from 'next/image'

// Route Sanity-hosted images through Sanity's own image CDN (which already
// resizes/compresses on the fly) instead of Vercel's Image Optimization
// pipeline. This avoids Vercel's optimization quota entirely for the bulk of
// the site's images (all Sanity photography).
export default function sanityImageLoader({ src, width, quality }: ImageLoaderProps) {
  if (src.includes('cdn.sanity.io')) {
    const url = new URL(src)
    url.searchParams.set('w', width.toString())
    url.searchParams.set('q', (quality ?? 75).toString())
    url.searchParams.set('auto', 'format')
    url.searchParams.set('fit', 'max')
    return url.toString()
  }

  // Local (/public) images: served as-is, unoptimized.
  return src
}
