'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Calendar, Users, MapPin, Clock } from 'lucide-react'

interface Sejour {
  title: string
  slug: string
  activityType: string
  subCategory: string
  massif: string
  level: string
  season: string
  duration: string
  basePrice: string
  image: string
}

interface Sortie {
  date: string
  availableSpots: string
  isFull: boolean
  titleOverride?: string
  sejour: Sejour
}

interface UpcomingSortiesProps {
  initialFilter?: string;
  showFilters?: boolean;
  data?: Sortie[];
  badge?: string
  title?: string
  titleAccent?: string
  className?: string
}

import { useLanguage } from '@/context/LanguageContext'

const UpcomingSorties = ({ 
  initialFilter = 'Tous les séjours', 
  showFilters = true, 
  data = [],
  badge = "Prochaines sorties",
  title = "REJOIGNEZ",
  titleAccent = "L'AVENTURE",
  className = "bg-background"
}: UpcomingSortiesProps) => {
  const { at, t } = useLanguage()
  const [filter, setFilter] = useState(initialFilter)
  const [seasonFilter, setSeasonFilter] = useState('Toutes saisons')

  const categories = ['Tous les séjours', 'Alpinisme', 'Ski', 'Escalade']
  const seasons = ['Toutes saisons', 'Été', 'Hiver']

  // Mapping activities to display names
  const getCategoryDisplay = (type: string) => {
    const map: Record<string, string> = {
      'alpinisme': at('Alpinisme'),
      'ski': at('Ski'),
      'escalade': at('Escalade'),
      'voyage': at('Voyages')
    }
    return map[type] || at(type)
  }

  const safeData = data || []
  
  const filteredSorties = safeData.filter(s => {
    if (!s.sejour) return false;
    
    const matchesCategory = filter === 'Tous les séjours' || getCategoryDisplay(s.sejour.activityType) === getCategoryDisplay(filter.toLowerCase());
    // Special case for filters
    const matchesCategoryFixed = filter === 'Tous les séjours' || s.sejour.activityType.toLowerCase().includes(filter.toLowerCase().replace('Tous les séjours', ''));
    
    // Simplification for the filter logic to be language independent
    const currentCat = filter === 'Tous les séjours' ? 'all' : filter;
    const matchesCat = currentCat === 'all' || s.sejour.activityType.toLowerCase().includes(filter.toLowerCase());

    const matchesSeason = seasonFilter === 'Toutes saisons' || 
                         (seasonFilter === 'Été' && s.sejour.season === 'ete') ||
                         (seasonFilter === 'Hiver' && s.sejour.season === 'hiver') ||
                         s.sejour.season === 'toutes';

    return matchesCat && matchesSeason;
  });

  return (
    <section className={`py-24 px-6 transition-colors duration-300 ${className}`}>
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div>
            <span className="text-accent font-bold tracking-widest uppercase text-sm mb-4 block">{at(badge)}</span>
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase">
              {at(title)} <br /> <span className="text-accent italic">{at(titleAccent)}</span>
            </h2>
          </div>

          {showFilters && (
            <div className="flex flex-col gap-4 items-end">
              {/* Activité Filter */}
              <div className="flex flex-wrap gap-2 justify-end">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setFilter(cat)}
                    className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${filter === cat
                        ? 'bg-accent text-white shadow-lg'
                        : 'bg-foreground/5 text-foreground/40 hover:bg-foreground/10'
                      }`}
                  >
                    {at(cat)}
                  </button>
                ))}
              </div>
              {/* Season Filter */}
              <div className="flex flex-wrap gap-2 justify-end">
                {seasons.map(s => (
                  <button
                    key={s}
                    onClick={() => setSeasonFilter(s)}
                    className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${seasonFilter === s
                        ? 'bg-foreground text-background shadow-md'
                        : 'bg-foreground/5 text-foreground/40 hover:bg-foreground/10'
                      }`}
                  >
                    {at(s)}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredSorties.map((s, idx) => (
              <motion.div
                key={idx}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                className="group relative aspect-[4/5] rounded-[40px] overflow-hidden shadow-2xl bg-card/5 border border-border"
              >
                {s.sejour?.image && (
                  <Image
                    src={s.sejour.image}
                    alt={at(s.titleOverride || s.sejour.title)}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
                
                {/* Badges */}
                <div className="absolute top-6 left-6 right-6 flex justify-between items-start">
                  <span className="px-4 py-1.5 bg-accent text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">
                    {getCategoryDisplay(s.sejour?.activityType)}
                  </span>
                  {s.isFull && (
                    <span className="px-4 py-1.5 bg-red-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">
                      {at('Complet')}
                    </span>
                  )}
                </div>

                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center gap-3 text-accent font-bold uppercase tracking-[0.2em] text-xs">
                      <Calendar size={14} />
                      {at(s.date)}
                    </div>
                    <h3 className="text-3xl font-black text-foreground uppercase tracking-tighter leading-none">
                      {at(s.titleOverride || s.sejour?.title)}
                    </h3>
                    <div className="flex flex-wrap gap-4 text-[10px] font-bold uppercase tracking-widest text-foreground/60">
                      <div className="flex items-center gap-1">
                        <MapPin size={12} className="text-accent" />
                        {at(s.sejour?.massif)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={12} className="text-accent" />
                        {at(s.sejour?.duration)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users size={12} className="text-accent" />
                        {at(s.availableSpots)}
                      </div>
                    </div>
                  </div>

                  {(() => {
                    const universSlug = s.sejour?.subCategory?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '-');
                    return (
                      <Link
                        href={`/${s.sejour?.activityType}/${universSlug}/${s.sejour?.slug}`}
                        className="w-full py-4 bg-foreground text-background hover:bg-accent hover:text-white transition-all rounded-2xl text-center text-xs font-black uppercase tracking-widest"
                      >
                        {at('Découvrir la sortie')}
                      </Link>
                    );
                  })()}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredSorties.length === 0 && (
          <div className="text-center py-24 glass rounded-[40px]">
            <p className="text-xl text-foreground/40 font-medium">{at('Aucune sortie programmée pour ces critères actuellement.')}</p>
          </div>
        )}
      </div>
    </section>
  )
}

export default UpcomingSorties
