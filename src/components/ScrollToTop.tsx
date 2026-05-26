'use client'

import { useEffect, useState } from 'react'
import { ArrowUp } from 'lucide-react'

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (!visible) return null

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Retour en haut"
      className="fixed bottom-24 right-6 z-50 w-12 h-12 flex items-center justify-center rounded-full bg-accent text-white shadow-lg shadow-accent/30 hover:bg-secondary hover:shadow-secondary/30 hover:-translate-y-1 transition-all duration-300"
    >
      <ArrowUp size={20} />
    </button>
  )
}
