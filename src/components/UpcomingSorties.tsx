'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'

const categories = ['Tout voir', 'Alpinisme', 'Escalade', 'Ski']

const FALLBACK_SORTIES = [
  {
    id: '1',
    title: "Traversée des Écrins",
    activityType: "alpinisme",
    date: "15 Juin 2026",
    image: "/photos/DSC_6701.jpg",
    slug: "traversee-ecrins"
  },
  {
    id: '2',
    title: "Grandes Voies Ailefroide",
    activityType: "escalade",
    date: "12 Juillet 2026",
    image: "/images/escalade.jpg",
    slug: "escalade-ailefroide"
  }
]

interface Sortie {
  id?: string
  title: string
  activityType: string
  date: string
  image: string
  slug: string
  isFull?: boolean
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

const UpcomingSorties = ({ 
  initialFilter = 'Tout voir', 
  showFilters = true, 
  data = [],
  badge = "Prochaines sorties",
  title = "REJOIGNEZ",
  titleAccent = "L'AVENTURE",
  className = "bg-background"
}: UpcomingSortiesProps) => {
  const [filter, setFilter] = useState(initialFilter)

  // Mapping Sanity activityType to UI categories if they differ
  const getCategory = (type: string) => {
    const map: Record<string, string> = {
      'alpinisme': 'Alpinisme',
      'ski': 'Ski',
      'escalade': 'Escalade',
      'voyage': 'Voyage'
    }
    return map[type] || type
  }

  const safeData = data || []
  const list = safeData.length > 0 ? safeData.map(s => ({
    ...s,
    category: getCategory(s.activityType)
  })) : FALLBACK_SORTIES.map(s => ({
    ...s,
    category: getCategory(s.activityType)
  }))

  const filteredSorties = filter === 'Tout voir'
    ? list
    : list.filter(s => s.category === filter)

  return (
    <section className={`py-24 px-6 transition-colors duration-300 ${className}`}>
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div>
            <span className="text-accent font-bold tracking-widest uppercase text-sm mb-4 block">{badge}</span>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tighter uppercase">
              {title} <br /> <span className="text-accent italic">{titleAccent}</span>
            </h2>
          </div>

          {showFilters && (
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${filter === cat
                      ? 'bg-accent text-white shadow-lg'
                      : 'bg-foreground/5 text-foreground/40 hover:bg-foreground/10'
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>


        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredSorties.map((s) => (
              <motion.div
                key={s.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                className="group relative aspect-[4/5] rounded-[40px] overflow-hidden shadow-xl"
              >
                <Image
                  src={s.image}
                  alt={s.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                <div className="absolute top-6 left-6">
                  <span className="px-4 py-1.5 bg-accent text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">
                    {s.category}
                  </span>
                </div>
                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                  <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-2">{s.date}</p>
                  <h3 className="text-2xl font-bold text-white mb-6 leading-tight">{s.title}</h3>
                  <Link
                    href={`/prochaines-sorties/${s.slug}`}
                    className="w-full py-4 bg-white/10 hover:bg-white text-white hover:text-black backdrop-blur-md rounded-2xl text-center text-sm font-bold transition-all border border-white/20 hover:border-white"
                  >
                    Découvrir la sortie
                  </Link>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}

export default UpcomingSorties
