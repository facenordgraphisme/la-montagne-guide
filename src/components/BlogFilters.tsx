'use client'

import { useRouter, usePathname } from 'next/navigation'
import { useLanguage } from '@/context/LanguageContext'

interface FilterTag {
  name: string
  slug: string
}

interface BlogFiltersProps {
  categories: FilterTag[]
  massifs: FilterTag[]
  activeCategory?: string
  activeMassif?: string
}

export default function BlogFilters({ categories, massifs, activeCategory, activeMassif }: BlogFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { at } = useLanguage()

  const navigate = (nextCategory?: string, nextMassif?: string) => {
    const params = new URLSearchParams()
    if (nextCategory) params.set('category', nextCategory)
    if (nextMassif) params.set('massif', nextMassif)
    const query = params.toString()
    router.push(query ? `${pathname}?${query}` : pathname)
  }

  const pillClass = (active: boolean) =>
    `px-6 py-2 rounded-full text-[10px] font-black transition-all uppercase tracking-widest border ${
      active
        ? 'bg-accent border-accent text-white shadow-xl scale-105'
        : 'bg-transparent border-white/10 text-foreground/40 hover:border-accent/40'
    }`

  return (
    <div className="mb-16 space-y-6">
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => navigate(undefined, activeMassif)}
          className={pillClass(!activeCategory)}
        >
          {at('Tout voir')}
        </button>
        {categories.map((cat) => (
          <button
            key={cat.slug}
            onClick={() => navigate(activeCategory === cat.slug ? undefined : cat.slug, activeMassif)}
            className={pillClass(activeCategory === cat.slug)}
          >
            {at(cat.name)}
          </button>
        ))}
      </div>

      {massifs.length > 0 && (
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-[10px] font-black uppercase tracking-widest text-foreground/30">{at('Massif')}</span>
          <select
            value={activeMassif || ''}
            onChange={(e) => navigate(activeCategory, e.target.value || undefined)}
            className="bg-transparent border border-white/10 rounded-full px-5 py-2 text-[10px] font-black uppercase tracking-widest text-foreground/60 hover:border-accent/40 transition-all focus:outline-none focus:border-accent cursor-pointer"
          >
            <option value="" className="bg-background text-foreground">{at('Tous les massifs')}</option>
            {massifs.map((m) => (
              <option key={m.slug} value={m.slug} className="bg-background text-foreground">
                {at(m.name)}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  )
}
