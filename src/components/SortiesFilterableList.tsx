'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Calendar, MapPin, Clock, ArrowRight } from 'lucide-react'

interface Sortie {
  title: string
  slug: string
  date: string
  location?: string
  duration?: string
  description?: string
  price?: string
  image: string
  activityType: string
  isFull?: boolean
}

interface SortiesFilterableListProps {
  initialSorties: Sortie[]
}

const categories = ['Tout voir', 'Alpinisme', 'Escalade', 'Ski', 'Voyage']

export default function SortiesFilterableList({ initialSorties }: SortiesFilterableListProps) {
  const [filter, setFilter] = useState('Tout voir')

  const getCategoryLabel = (type: string) => {
    const map: Record<string, string> = {
      'alpinisme': 'Alpinisme',
      'ski': 'Ski',
      'escalade': 'Escalade',
      'voyage': 'Voyage'
    }
    return map[type] || type
  }

  const filteredSorties = filter === 'Tout voir'
    ? initialSorties
    : initialSorties.filter(s => getCategoryLabel(s.activityType) === filter)

  return (
    <div className="space-y-16">
      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-16">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-8 py-3 rounded-full text-sm font-bold transition-all border ${
              filter === cat
                ? 'bg-accent border-accent text-white shadow-xl scale-105'
                : 'bg-foreground/5 border-transparent text-foreground/40 hover:border-foreground/10 hover:bg-foreground/10'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="space-y-12">
        <AnimatePresence mode="popLayout">
          {filteredSorties.length > 0 ? (
            filteredSorties.map((s, index) => (
              <motion.div
                key={s.slug}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className={`group flex flex-col ${
                  index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                } gap-12 items-stretch glass p-6 md:p-10 rounded-[60px] hover:bg-white/5 transition-colors border border-white/5 hover:border-accent/20`}
              >
                {/* Image Container */}
                <div className="w-full lg:w-2/5 aspect-[4/3] lg:aspect-auto rounded-[40px] overflow-hidden relative">
                  <Image
                    src={s.image}
                    alt={s.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  {s.isFull && (
                    <div className="absolute top-6 left-6 z-10">
                      <span className="px-4 py-1.5 bg-red-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">
                        Complet
                      </span>
                    </div>
                  )}
                  <div className="absolute top-6 right-6 lg:left-6 lg:right-auto z-10">
                    {!s.isFull && (
                      <span className="px-4 py-1.5 bg-accent text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">
                        {getCategoryLabel(s.activityType)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Content Container */}
                <div className="w-full lg:w-3/5 flex flex-col justify-between py-4">
                  <div className="space-y-6">
                    <div className="flex flex-wrap items-center gap-6">
                      <div className="flex items-center gap-2 text-accent font-bold">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm uppercase tracking-wider">{s.date}</span>
                      </div>
                      {s.location && (
                        <div className="flex items-center gap-2 text-foreground/40 font-bold">
                          <MapPin className="w-4 h-4" />
                          <span className="text-sm uppercase tracking-wider">{s.location}</span>
                        </div>
                      )}
                    </div>

                    <h3 className="text-4xl md:text-5xl font-bold tracking-tight group-hover:text-accent transition-colors">
                      {s.title}
                    </h3>
                    
                    <p className="text-foreground/60 text-lg leading-relaxed line-clamp-3">
                      {s.description || "Découvrez cette aventure exceptionnelle encadrée par un guide passionné."}
                    </p>
                    
                    <div className="grid grid-cols-2 gap-8 py-6 border-y border-foreground/5">
                      <div>
                        <p className="text-[10px] text-foreground/30 uppercase tracking-widest font-black mb-1">Durée</p>
                        <div className="flex items-center gap-2 font-bold">
                          <Clock className="w-4 h-4 text-accent" />
                          <span>{s.duration || "Non spécifié"}</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-[10px] text-foreground/30 uppercase tracking-widest font-black mb-1">Budget est.</p>
                        <p className="text-xl font-black text-accent">{s.price || "Sur devis"}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-10 flex flex-col sm:flex-row gap-4">
                    <Link 
                      href={`/prochaines-sorties/${s.slug}`}
                      className="btn-primary flex items-center justify-center gap-3 px-10 py-5 rounded-2xl font-bold uppercase tracking-widest group/btn"
                    >
                      Voir les détails
                      <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                    <Link 
                      href="/contact"
                      className="px-10 py-5 bg-foreground/5 hover:bg-foreground/10 text-foreground font-bold rounded-2xl text-center transition-all border border-transparent hover:border-foreground/10"
                    >
                      Me contacter
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-20 glass rounded-[40px]">
              <p className="text-2xl text-foreground/40 font-bold">Aucune sortie ne correspond à ce filtre.</p>
              <button 
                onClick={() => setFilter('Tout voir')}
                className="mt-6 text-accent font-bold underline"
              >
                Voir toutes les sorties
              </button>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
