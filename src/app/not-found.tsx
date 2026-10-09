import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Compass, Mail } from 'lucide-react'
import { client } from '@/sanity/lib/live'
import { activitiesQuery, settingsQuery } from '@/sanity/lib/queries'
import { getServerTranslations } from '@/i18n/server'
import { sortActivities } from '@/utils/activity'

export const metadata: Metadata = {
  title: 'Page introuvable | La Montagne Guide',
  robots: { index: false },
}

export default async function NotFound() {
  const { lang } = await getServerTranslations()
  const en = lang === 'en'
  const [activities, settings] = await Promise.all([
    client.fetch(activitiesQuery).catch(() => []),
    client.fetch(settingsQuery).catch(() => null),
  ])
  const sorted = sortActivities(activities || [], settings?.activitiesOrder)

  return (
    <main className="relative min-h-screen overflow-hidden flex items-center justify-center pt-40 pb-56 px-6">
      <div className="absolute inset-0 -z-10 bg-linear-to-b from-accent/10 via-background to-background" />
      <div className="absolute top-32 left-1/2 -translate-x-1/2 -z-10 w-[40rem] h-[40rem] rounded-full bg-accent/10 blur-3xl" />

      <div className="relative z-10 max-w-3xl text-center">
        <p className="text-[9rem] md:text-[14rem] font-black leading-none tracking-tighter text-gradient select-none">
          404
        </p>
        <h1 className="mt-2 text-4xl md:text-6xl font-black uppercase tracking-tighter">
          {en ? 'Off-piste!' : 'Hors-piste !'}
        </h1>
        <p className="mt-6 text-lg md:text-xl text-foreground/70 text-center leading-relaxed">
          {en
            ? "This page got lost somewhere on the mountain. Don't worry — your guide knows the way back."
            : "Cette page s'est égarée quelque part en montagne. Pas de panique, ton guide connaît le chemin du retour."}
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link href="/" className="btn-primary inline-flex items-center gap-2 !px-8 !py-4 uppercase tracking-widest text-sm font-black">
            <ArrowLeft size={18} />
            {en ? 'Back to home' : "Retour à l'accueil"}
          </Link>
          <Link href="/activites" className="inline-flex items-center gap-2 px-8 py-4 rounded-full border border-border hover:border-accent/60 hover:text-accent uppercase tracking-widest text-sm font-black transition-colors">
            <Compass size={18} />
            {en ? 'Our activities' : 'Les activités'}
          </Link>
          <Link href="/contact" className="inline-flex items-center gap-2 px-8 py-4 rounded-full border border-border hover:border-accent/60 hover:text-accent uppercase tracking-widest text-sm font-black transition-colors">
            <Mail size={18} />
            Contact
          </Link>
        </div>

        {sorted.length > 0 && (
          <div className="mt-14">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-foreground/40 mb-5">
              {en ? 'Or set off on an adventure' : "Ou repars à l'aventure"}
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {sorted.map((a: any) => (
                <Link
                  key={a._id}
                  href={`/${a.slug}`}
                  className="glass rounded-full px-5 py-2 text-sm font-semibold hover:text-accent hover:border-accent/50 transition-colors"
                >
                  {en ? a.titleEn || a.title : a.title}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      <svg
        aria-hidden="true"
        className="absolute bottom-0 left-0 w-full h-48 md:h-64 -z-10"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
      >
        <path fill="var(--accent)" fillOpacity="0.12" d="M0 320 L0 210 L160 120 L300 200 L470 60 L620 190 L760 110 L900 220 L1060 80 L1220 200 L1440 130 L1440 320 Z" />
        <path fill="var(--accent)" fillOpacity="0.22" d="M0 320 L0 260 L200 180 L360 250 L540 150 L700 240 L860 170 L1020 260 L1200 160 L1440 240 L1440 320 Z" />
        <path fill="var(--foreground)" fillOpacity="0.08" d="M0 320 L0 300 L240 250 L420 290 L640 230 L820 290 L1040 240 L1260 295 L1440 270 L1440 320 Z" />
        <line x1="470" y1="60" x2="470" y2="22" stroke="var(--accent)" strokeWidth="3" />
        <path d="M470 22 L500 31 L470 40 Z" fill="var(--highlight)" />
      </svg>
    </main>
  )
}
