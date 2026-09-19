'use client'

import { usePathname } from 'next/navigation'

export default function CanonicalHeader() {
  const pathname = usePathname()
  // Clean up any trailing slashes or duplicate paths
  const cleanPath = pathname === '/' ? '' : pathname
  const canonicalUrl = `https://www.la-montagne-guide.fr${cleanPath}`

  return (
    <link rel="canonical" href={canonicalUrl} />
  )
}
