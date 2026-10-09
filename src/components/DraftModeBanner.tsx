'use client'

import { useEffect, useState } from 'react'

export default function DraftModeBanner() {
  const [standalone, setStandalone] = useState(false)

  useEffect(() => {
    // Inside the Studio's Presentation iframe the Studio handles exiting preview
    setStandalone(window.self === window.top)
  }, [])

  if (!standalone) return null

  return (
    <a
      href="/api/draft-mode/disable"
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] rounded-full bg-highlight px-6 py-3 text-sm font-black uppercase tracking-widest text-white shadow-2xl hover:opacity-90"
    >
      Mode aperçu (brouillons) — Quitter
    </a>
  )
}
