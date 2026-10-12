'use client'
/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { PortableText } from '@portabletext/react'
import { ChevronLeft } from 'lucide-react'
import { findLevelIcon, type LevelIcon } from '@/utils/levels'

const panelComponents = {
  block: {
    normal: ({ children }: any) => <p className="mb-3 text-[15px] text-foreground/70 leading-relaxed text-left">{children}</p>,
    // Sections ("Votre pratique", "Avec moi"…) separated by a thin rule, like the reference design
    h3: ({ children }: any) => (
      <h3 className="mt-6 pt-6 border-t border-border first:mt-0 first:pt-0 first:border-t-0 mb-2 text-lg font-bold text-foreground">{children}</h3>
    ),
  },
  list: {
    bullet: ({ children }: any) => <ul className="mb-2 space-y-1.5 list-disc pl-6 text-[15px] leading-snug text-foreground/70 marker:text-foreground/40">{children}</ul>,
  },
}

export function LevelValue({ raw, text, icons, lang = 'fr', heading, note }: {
  raw?: string
  text?: string
  icons?: LevelIcon[] | null
  lang?: string
  heading?: string
  // Séjour-specific text (former hover tooltip), shown in the panel after the generic level description
  note?: string | null
}) {
  const [open, setOpen] = useState(false)
  const match = findLevelIcon(icons, raw)

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

  if (!text) return null
  // No icon configured for this level: keep the plain text so the row is never empty
  if (!match) return <>{text}</>

  const en = lang === 'en'
  const label = en ? (match.labelEn || text) : text
  const description = en ? (match.descriptionEn?.length ? match.descriptionEn : match.description) : match.description
  const hasDescription = !!description?.length
  const hasNote = !!note?.trim()

  const icon = <img src={match.icon} alt={label} title={label} className="h-9 w-auto" />
  if (!hasDescription && !hasNote) return icon

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex cursor-pointer rounded-lg p-1 -m-1 hover:bg-accent/10 transition-colors"
        aria-label={`${heading ? `${heading} : ` : ''}${label}`}
      >
        {icon}
      </button>

      {open && createPortal(
        <div className="fixed inset-0 z-[200] flex justify-end bg-black/30" onClick={() => setOpen(false)} role="dialog" aria-modal="true" aria-label={label}>
          <aside
            className="h-full w-full sm:w-[400px] lg:w-[22vw] lg:min-w-[360px] overflow-y-auto bg-background shadow-2xl animate-[slideIn_0.25s_ease-out]"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 border-b border-border px-6 py-5">
              <button type="button" onClick={() => setOpen(false)} className="rounded-full p-1 text-accent hover:bg-accent/10 transition-colors cursor-pointer" aria-label={en ? 'Close' : 'Fermer'}>
                <ChevronLeft size={22} />
              </button>
              <p className="text-2xl font-bold tracking-tight">{heading || (en ? 'Level' : 'Niveau')}</p>
            </div>
            <div className="px-6 py-6">
              <div className="flex items-center gap-3 mb-5">
                <img src={match.icon} alt="" className="h-7 w-auto" />
                <h2 className="text-xl font-bold leading-tight">{label}</h2>
              </div>
              {hasDescription && <PortableText value={description} components={panelComponents} />}
              {hasNote && (
                <p className={`text-[15px] text-foreground/70 leading-relaxed text-left whitespace-pre-line ${hasDescription ? 'mt-6 pt-6 border-t border-border' : ''}`}>{note}</p>
              )}
            </div>
          </aside>
        </div>,
        document.body
      )}
    </>
  )
}
