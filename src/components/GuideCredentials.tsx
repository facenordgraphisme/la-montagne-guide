import Image from 'next/image'
import Link from '@/components/LocaleLink'
import { Award, MapPin, Mountain } from 'lucide-react'
import { client } from '@/sanity/lib/live'
import { guideQuery } from '@/sanity/lib/queries'
import { urlFor } from '@/sanity/lib/image'
import { getServerTranslations } from '@/i18n/server'

export const GUIDE_PERSON_ID = 'https://www.la-montagne-guide.fr/le-guide#nicolas-draperi'

type Props = {
  // Reassurance block on hubs, univers and stays
  className?: string
}

export default async function GuideCredentials({ className = '' }: Props) {
  const [guide, { at, t, lang }] = await Promise.all([client.fetch(guideQuery), getServerTranslations()])

  const years = String(guide?.experience || '15+').match(/\d+/)?.[0] || '15'
  const certification = guide?.certification || 'UIAGM'
  const diploma = `${certification} / IFMGA`
  const photo = guide?.sections?.find((s: any) => s?.image)?.image
  const L = (fr: string, en: string) => (lang === 'en' ? en : fr)

  const facts = [
    { icon: Award, label: L('Diplôme', 'Qualification'), value: L(`Guide de haute montagne ${diploma}`, `${diploma} mountain guide`) },
    { icon: Mountain, label: L('Expérience', 'Experience'), value: L(`Plus de ${years} ans`, `Over ${years} years`) },
    { icon: MapPin, label: L('Basé à', 'Based in'), value: L('Champcella, Hautes-Alpes (Écrins, Queyras)', 'Champcella, Hautes-Alpes, France (Écrins, Queyras)') },
  ]

  return (
    <aside className={`glass rounded-[40px] border border-border p-6 md:p-8 ${className}`} aria-label={L('Votre guide', 'Your guide')}>
      <div className="flex flex-col md:flex-row md:items-center gap-6">
        <div className="flex items-center gap-4 md:w-80 shrink-0 text-left">
          {photo && (
            <Image
              src={urlFor(photo).width(160).height(160).fit('crop').url()}
              alt="Nicolas Draperi"
              width={80}
              height={80}
              className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover border-2 border-accent/40"
            />
          )}
          <div>
            <p className="text-[11px] font-black uppercase tracking-widest text-accent">{at({ fr: guide?.badge, en: guide?.badgeEn }) || L('Votre guide', 'Your guide')}</p>
            <p className="text-lg font-black uppercase tracking-tight leading-tight">Nicolas Draperi</p>
            <p className="text-sm text-foreground/60 !text-left">{L(`Guide de haute montagne ${diploma}`, `${diploma} mountain guide`)}</p>
          </div>
        </div>
        <ul className="flex-1 flex flex-wrap gap-2">
          {facts.slice(1).map(({ icon: Icon, value }) => (
            <li key={value} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-foreground/5 border border-border text-xs font-semibold text-foreground/75">
              <Icon size={14} className="text-accent shrink-0" aria-hidden />
              {value}
            </li>
          ))}
        </ul>
        <div className="flex flex-row md:flex-col gap-3 shrink-0">
          <Link href="/contact" className="btn-primary !text-white text-center text-xs font-black uppercase tracking-widest !py-3 !px-6">
            {t('nav.contact')}
          </Link>
          <Link href="/le-guide" className="text-center text-xs font-bold uppercase tracking-widest text-foreground/60 hover:text-accent transition-colors py-3">
            {L('Découvrir le guide', 'About your guide')}
          </Link>
        </div>
      </div>
    </aside>
  )
}
