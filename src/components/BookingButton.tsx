'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import { ExternalLink, X } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'

const BUTTON_CLASS = 'btn-primary w-full block text-center text-white! py-4 text-sm font-black uppercase tracking-widest'

export default function BookingButton({ url, label }: { url?: string | null; label: string }) {
  const { language } = useLanguage()
  const en = language === 'en'
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  if (!url) {
    return <Link href="/contact" className={BUTTON_CLASS}>{label}</Link>
  }

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={`${BUTTON_CLASS} cursor-pointer`}>
        {label}
      </button>

      {open && createPortal(
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-sm p-2 md:p-6"
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label={label}
        >
          <div
            className="relative flex h-full max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl bg-background shadow-2xl border border-border"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-4 border-b border-border px-5 py-3">
              <p className="text-sm font-black uppercase tracking-widest">{label}</p>
              <div className="flex items-center gap-2">
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold text-foreground/60 hover:text-accent transition-colors"
                >
                  <ExternalLink size={14} />
                  {en ? 'Open in a new tab' : 'Ouvrir dans un nouvel onglet'}
                </a>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-full p-2 hover:bg-foreground/10 transition-colors cursor-pointer"
                  aria-label={en ? 'Close' : 'Fermer'}
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            <iframe
              src={url}
              title={label}
              className="h-full w-full flex-1 bg-white"
              allow="payment"
            />
          </div>
        </div>,
        // Portal to <body>: the sidebar card uses backdrop-filter, which would otherwise trap position:fixed
        document.body
      )}
    </>
  )
}
