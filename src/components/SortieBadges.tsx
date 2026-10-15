'use client'

import { useLanguage } from '@/context/LanguageContext'
import { spotsLeft } from '@/utils/dates'

// Remaining spots, made prominent: big number in a coloured disc (green → orange when ≤ 2 → red when full)
export function SpotsIndicator({ availableSpots, isFull, isPassed }: {
  availableSpots?: string | null
  isFull?: boolean
  isPassed?: boolean
}) {
  const { at } = useLanguage()
  const n = spotsLeft(availableSpots)
  const full = isFull || n === 0

  if (isPassed) {
    return <span className="text-[11px] font-black uppercase tracking-widest text-foreground/40">{at('Date passée')}</span>
  }
  if (full) {
    return (
      <div className="flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-full bg-red-500/15 text-red-600 text-lg font-black">0</span>
        <span className="text-xs font-black uppercase tracking-widest text-red-600">{at('Complet')}</span>
      </div>
    )
  }
  if (n === undefined) return null

  const last = n <= 2
  return (
    <div className="flex items-center gap-3">
      <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-full text-xl font-black ${last ? 'bg-orange-500/15 text-orange-600 animate-pulse' : 'bg-emerald-500/15 text-emerald-600'}`}>
        {n}
      </span>
      <span className="flex flex-col leading-tight">
        <span className="text-xs font-black uppercase tracking-widest text-foreground">
          {n > 1 ? at({ fr: 'places restantes', en: 'spots left' }) : at({ fr: 'place restante', en: 'spot left' })}
        </span>
        {last && <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600">{at({ fr: 'Dernières places !', en: 'Last spots!' })}</span>}
      </span>
    </div>
  )
}

// Diagonal corner ribbon (parent needs `relative overflow-hidden`)
export function CornerRibbon({ tone, children }: { tone: 'full' | 'confirmed'; children: React.ReactNode }) {
  return (
    <div className={`pointer-events-none absolute top-7 -right-14 z-10 w-56 rotate-45 py-2 text-center text-[11px] font-black uppercase tracking-[0.2em] text-white shadow-xl ${tone === 'full' ? 'bg-red-600' : 'bg-emerald-600'}`}>
      {children}
    </div>
  )
}
