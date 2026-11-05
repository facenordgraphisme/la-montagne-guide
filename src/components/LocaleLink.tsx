'use client'

import type { ComponentProps } from 'react'
import NextLink from 'next/link'
import { usePathname } from 'next/navigation'
import { isEnPath, toEnPath } from '@/lib/localePath'

type Props = ComponentProps<typeof NextLink> & {
  /** Keep the href as is on English pages, for content that only exists in French */
  noLocale?: boolean
}

// next/link that keeps English visitors under /en
export default function LocaleLink({ href, noLocale, ...props }: Props) {
  const pathname = usePathname()
  const target = !noLocale && typeof href === 'string' && isEnPath(pathname) ? toEnPath(href) : href
  return <NextLink href={target} {...props} />
}
