'use client'
/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { PortableText } from '@portabletext/react'
import { BarChart3, ChevronLeft, ChevronRight } from 'lucide-react'
import type { LevelIcon } from '@/utils/levels'

const panelComponents = {
  block: {
    normal: ({ children }: any) => <p className="mb-3 text-[15px] text-foreground/70 leading-relaxed text-left">{children}</p>,
    h3: ({ children }: any) => (
      <h3 className="mt-6 pt-6 border-t border-border first:mt-0 first:pt-0 first:border-t-0 mb-2 text-lg font-bold text-foreground">{children}</h3>
    ),
  },
  list: {
    bullet: ({ children }: any) => <ul className="mb-2 space-y-1.5 list-disc pl-6 text-[15px] leading-snug text-foreground/70 marker:text-foreground/40">{children}</ul>,
  },
}

export type SejourLevel = {
  heading: string
  // Resolved settings entry; absent when the séjour value matches no configured level
  match?: LevelIcon
  // Fallback text when no level matches
  text?: string
}

export function SejourLevels({ technical, physical, lang = 'fr' }: {
  technical?: SejourLevel
  physical?: SejourLevel
  lang?: string
}) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = previous
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  const en = lang === 'en'
  const levels = [technical, physical].filter((l): l is SejourLevel => !!(l?.match || l?.text))
  if (!levels.length) return null

  const labelOf = (l: SejourLevel) => (en ? l.match?.labelEn || l.match?.label : l.match?.label) || l.text || ''
  const descriptionOf = (l: SejourLevel) => {
    const d = en && l.match?.descriptionEn?.length ? l.match.descriptionEn : l.match?.description
    return d?.length ? d : undefined
  }
  const expandable = levels.some(descriptionOf)

  const summary = (
    <div className="grid grid-cols-2 gap-3">
      {levels.map(l => (
        <div key={l.heading} className="flex flex-col gap-2 min-w-0">
          <span className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 leading-tight">{l.heading}</span>
          <div className="flex items-center gap-2 min-w-0">
            {l.match?.icon
              ? <img src={l.match.icon} alt={labelOf(l)} title={labelOf(l)} className="h-9 w-auto shrink-0" />
              : <BarChart3 size={18} className="text-accent shrink-0" />}
            {/* Narrow sidebar: icons only, like the reference design */}
            <span className={`text-sm font-bold leading-tight ${l.match?.icon ? 'hidden @[17rem]:block' : ''}`}>{labelOf(l)}</span>
          </div>
        </div>
      ))}
    </div>
  )

  if (!expandable) return <div className="@container py-4 border-b border-border">{summary}</div>

  return (
    <div className="@container py-4 border-b border-border">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        className={`group w-full text-left rounded-2xl border p-4 transition-colors cursor-pointer ${open ? 'border-accent bg-accent/5' : 'border-border hover:border-accent hover:bg-accent/5'}`}
      >
        {summary}
        <span className="mt-3 flex items-center justify-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-accent">
          {en ? 'What do these levels mean?' : 'Que signifient ces niveaux ?'}
          <ChevronRight size={14} className="transition-transform group-hover:translate-x-0.5" />
        </span>
      </button>

      {open && createPortal(
        <div className="fixed inset-0 z-[200] flex justify-end bg-black/30" onClick={() => setOpen(false)} role="dialog" aria-modal="true" aria-label={en ? 'Levels' : 'Niveaux'}>
          {/* Clicking the panel itself folds it back, as asked by the client */}
          <aside
            className="h-full w-full sm:w-[400px] lg:w-[22vw] lg:min-w-[360px] overflow-y-auto bg-background shadow-2xl animate-[slideIn_0.25s_ease-out] cursor-pointer"
            title={en ? 'Click to close' : 'Cliquer pour fermer'}
          >
            <div className="flex items-center gap-3 border-b border-border px-6 py-5">
              <span className="rounded-full p-1 text-accent" aria-hidden>
                <ChevronLeft size={22} />
              </span>
              <p className="text-2xl font-bold tracking-tight">{en ? 'Levels' : 'Niveaux'}</p>
            </div>
            <div className="px-6 py-6">
              {levels.map(l => {
                const description = descriptionOf(l)
                return (
                  <section key={l.heading} className="not-first:mt-8 not-first:pt-8 not-first:border-t-2 not-first:border-border">
                    <p className="text-xs font-bold uppercase tracking-widest text-foreground/40 mb-3">{l.heading}</p>
                    <div className="flex items-center gap-3 mb-5">
                      {l.match?.icon && <img src={l.match.icon} alt="" className="h-7 w-auto" />}
                      <h2 className="text-xl font-bold leading-tight">{labelOf(l)}</h2>
                    </div>
                    {description && <PortableText value={description} components={panelComponents} />}
                  </section>
                )
              })}
            </div>
          </aside>
        </div>,
        document.body
      )}
    </div>
  )
}
