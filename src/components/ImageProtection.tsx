'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

// Discourages saving photos (right-click, drag, iOS long-press). Not bulletproof: screenshots still work.
export default function ImageProtection() {
  const pathname = usePathname()
  const enabled = !pathname?.startsWith('/studio')

  useEffect(() => {
    if (!enabled) return
    const block = (e: Event) => {
      if ((e.target as HTMLElement | null)?.closest?.('img, picture, [data-protected-image]')) e.preventDefault()
    }
    document.addEventListener('contextmenu', block)
    document.addEventListener('dragstart', block)
    return () => {
      document.removeEventListener('contextmenu', block)
      document.removeEventListener('dragstart', block)
    }
  }, [enabled])

  if (!enabled) return null
  return <style>{`img { -webkit-user-drag: none; user-select: none; -webkit-touch-callout: none; }`}</style>
}
