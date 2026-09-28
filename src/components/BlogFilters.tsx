'use client'

import { useRouter, usePathname } from 'next/navigation'
import { useLanguage } from '@/context/LanguageContext'
import { Search, X } from 'lucide-react'
import { useRef } from 'react'

interface FilterTag {
  name: string
  nameEn?: string
  slug: string
}

interface BlogFiltersProps {
  categories: FilterTag[]
  massifs: FilterTag[]
  activeCategory?: string
  activeMassif?: string
  activeSearch?: string
}

export default function BlogFilters({
  categories,
  massifs,
  activeCategory,
  activeMassif,
  activeSearch,
}: BlogFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { at, t } = useLanguage()
  const inputRef = useRef<HTMLInputElement>(null)

  const navigate = (opts: {
    category?: string
    massif?: string
    q?: string
  }) => {
    const params = new URLSearchParams()
    if (opts.category) params.set('category', opts.category)
    if (opts.massif) params.set('massif', opts.massif)
    if (opts.q) params.set('q', opts.q)
    const query = params.toString()
    router.push(query ? `${pathname}?${query}` : pathname)
  }

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const q = inputRef.current?.value?.trim()
    navigate({ category: activeCategory, massif: activeMassif, q: q || undefined })
  }

  const clearSearch = () => {
    if (inputRef.current) inputRef.current.value = ''
    navigate({ category: activeCategory, massif: activeMassif })
  }

  const pillClass = (active: boolean) =>
    `px-6 py-2 rounded-full text-[10px] font-black transition-all uppercase tracking-widest border ${
      active
        ? 'bg-accent border-accent text-white shadow-xl scale-105'
        : 'bg-transparent border-white/10 text-foreground/40 hover:border-accent/40'
    }`

  return (
    <div className="mb-16 space-y-6">

      {/* Search bar */}
      <form onSubmit={handleSearch} className="relative max-w-lg">
        <Search
          size={16}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/30 pointer-events-none"
        />
        <input
          ref={inputRef}
          type="search"
          defaultValue={activeSearch || ''}
          placeholder={at('Rechercher un article…')}
          className="w-full pl-11 pr-10 py-3 rounded-full bg-foreground/5 border border-white/10 text-sm font-medium text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-accent/50 transition-colors"
        />
        {activeSearch ? (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground/30 hover:text-foreground/60 transition-colors"
          >
            <X size={14} />
          </button>
        ) : (
          <button
            type="submit"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground/30 hover:text-accent transition-colors"
          >
            <Search size={14} />
          </button>
        )}
      </form>

      {/* Category pills */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => navigate({ massif: activeMassif, q: activeSearch })}
          className={pillClass(!activeCategory)}
        >
          {at('Tout voir')}
        </button>
        {categories.map((cat) => (
          <button
            key={cat.slug}
            onClick={() =>
              navigate({
                category: activeCategory === cat.slug ? undefined : cat.slug,
                massif: activeMassif,
                q: activeSearch,
              })
            }
            className={pillClass(activeCategory === cat.slug)}
          >
            {at({ fr: cat.name, en: cat.nameEn || cat.name })}
          </button>
        ))}
      </div>

      {/* Massif select */}
      {massifs.length > 0 && (
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-[10px] font-black uppercase tracking-widest text-foreground/30">{at('Massif')}</span>
          <select
            value={activeMassif || ''}
            onChange={(e) =>
              navigate({
                category: activeCategory,
                massif: e.target.value || undefined,
                q: activeSearch,
              })
            }
            className="bg-transparent border border-white/10 rounded-full px-5 py-2 text-[10px] font-black uppercase tracking-widest text-foreground/60 hover:border-accent/40 transition-all focus:outline-none focus:border-accent cursor-pointer"
          >
            <option value="" className="bg-background text-foreground">{at('Tous les massifs')}</option>
            {massifs.map((m) => (
              <option key={m.slug} value={m.slug} className="bg-background text-foreground">
                {at({ fr: m.name, en: m.nameEn || m.name })}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  )
}
