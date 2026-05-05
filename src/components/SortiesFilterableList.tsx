'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Calendar, MapPin, Clock, ArrowRight, BarChart3, Users } from 'lucide-react'

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
  description?: string
}

interface Sortie {
  date: string
  availableSpots: string
  isFull: boolean
  titleOverride?: string
  sejour: Sejour
}

interface SortiesFilterableListProps {
  initialSorties: Sortie[]
}

const categories = ['Tout voir', 'Alpinisme', 'Escalade', 'Ski', 'Voyage']
const seasons = ['Toutes saisons', 'Été', 'Hiver']

export default function SortiesFilterableList({ initialSorties }: SortiesFilterableListProps) {
  const [filter, setFilter] = useState('Tout voir')
  const [seasonFilter, setSeasonFilter] = useState('Toutes saisons')

  const getCategoryLabel = (type: string) => {
    const map: Record<string, string> = {
      'alpinisme': 'Alpinisme',
      'ski': 'Ski',
      'escalade': 'Escalade',
      'voyage': 'Voyage'
    }
    return map[type] || type
  }

  const getLevelLabel = (level?: string) => {
    const map: Record<string, string> = {
      'debutant': 'Débutant',
      'intermediaire': 'Intermédiaire',
      'confirme': 'Confirmé',
      'expert': 'Expert'
    }
    return level ? map[level] || level : ''
  }

  const filteredSorties = initialSorties.filter(s => {
    if (!s.sejour) return false;
    
    const matchesCategory = filter === 'Tout voir' || getCategoryLabel(s.sejour.activityType) === filter;
    const matchesSeason = seasonFilter === 'Toutes saisons' || 
                         (seasonFilter === 'Été' && s.sejour.season === 'ete') ||
                         (seasonFilter === 'Hiver' && s.sejour.season === 'hiver') ||
                         s.sejour.season === 'toutes';

    return matchesCategory && matchesSeason;
  });

  return (
    <div className="space-y-16">
      {/* Filters Container */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16 bg-card/5 p-8 rounded-[40px] border border-border">
        <div className="space-y-4">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-accent">Filtrer par activité</p>
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-6 py-2.5 rounded-full text-xs font-bold transition-all uppercase tracking-widest ${
                  filter === cat
                    ? 'bg-accent text-white shadow-xl scale-105'
                    : 'bg-foreground/5 text-foreground/40 hover:bg-foreground/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-accent md:text-right">Filtrer par saison</p>
          <div className="flex flex-wrap gap-2 justify-end">
            {seasons.map(s => (
              <button
                key={s}
                onClick={() => setSeasonFilter(s)}
                className={`px-6 py-2.5 rounded-full text-xs font-bold transition-all uppercase tracking-widest ${
                  seasonFilter === s
                    ? 'bg-foreground text-background shadow-xl scale-105'
                    : 'bg-foreground/5 text-foreground/40 hover:bg-foreground/10'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* List */}
      <div className="space-y-12">
        <AnimatePresence mode="popLayout">
          {filteredSorties.length > 0 ? (
            filteredSorties.map((s, index) => (
              <motion.div
                key={index}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className={`group flex flex-col ${
                  index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                } gap-12 items-stretch glass p-6 md:p-10 rounded-[60px] hover:bg-card/10 transition-all duration-500 border border-border shadow-xl hover:shadow-2xl hover:border-accent/20`}
              >
                {/* Image Container */}
                <div className="w-full lg:w-2/5 aspect-[4/3] lg:aspect-auto rounded-[40px] overflow-hidden relative shadow-lg">
                  {s.sejour?.image && (
                    <Image
                      src={s.sejour.image}
                      alt={s.titleOverride || s.sejour.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  )}
                  {s.isFull && (
                    <div className="absolute top-6 left-6 z-10">
                      <span className="px-4 py-2 bg-red-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">
                        Complet
                      </span>
                    </div>
                  )}
                  <div className="absolute top-6 right-6 lg:left-6 lg:right-auto z-10">
                    <span className="px-4 py-2 bg-accent text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">
                      {getCategoryLabel(s.sejour?.activityType)}
                    </span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent" />
                </div>

                {/* Content Container */}
                <div className="w-full lg:w-3/5 flex flex-col justify-between py-4">
                  <div className="space-y-8">
                    <div className="flex flex-wrap items-center gap-6">
                      <div className="flex items-center gap-2 text-accent font-black bg-accent/5 px-4 py-2 rounded-full border border-accent/10">
                        <Calendar className="w-4 h-4" />
                        <span className="text-xs uppercase tracking-[0.2em]">{s.date}</span>
                      </div>
                      {s.sejour?.massif && (
                        <div className="flex items-center gap-2 text-foreground/60 font-bold bg-foreground/5 px-4 py-2 rounded-full border border-border">
                          <MapPin className="w-4 h-4" />
                          <span className="text-xs uppercase tracking-wider">{s.sejour.massif}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-foreground/40 font-bold px-4 py-2 rounded-full border border-border">
                        <Users className="w-4 h-4" />
                        <span className="text-xs uppercase tracking-wider">{s.availableSpots}</span>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-4xl md:text-6xl font-black tracking-tighter uppercase mb-6 leading-none group-hover:text-accent transition-colors">
                        {s.titleOverride || s.sejour?.title}
                      </h3>
                      <p className="text-foreground/60 text-lg leading-relaxed line-clamp-2 max-w-2xl font-medium">
                        {s.sejour?.description || "Une expérience d'exception encadrée par votre guide Nicolas Draperi."}
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-8 py-8 border-y border-border">
                      <div>
                        <p className="text-[10px] text-foreground/30 uppercase tracking-[0.2em] font-black mb-2">Durée</p>
                        <div className="flex items-center gap-2 font-black text-lg">
                          <Clock className="w-5 h-5 text-accent" />
                          <span>{s.sejour?.duration}</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-[10px] text-foreground/30 uppercase tracking-[0.2em] font-black mb-2">Niveau</p>
                        <div className="flex items-center gap-2 font-black text-lg">
                          <BarChart3 className="w-5 h-5 text-accent" />
                          <span>{getLevelLabel(s.sejour?.level)}</span>
                        </div>
                      </div>
                      <div className="col-span-2 md:col-span-1">
                        <p className="text-[10px] text-foreground/30 uppercase tracking-[0.2em] font-black mb-2">À partir de</p>
                        <p className="text-3xl font-black text-highlight leading-none">{s.sejour?.basePrice}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-12 flex flex-col sm:flex-row gap-4">
                    {(() => {
                      const universSlug = s.sejour?.subCategory?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '-');
                      return (
                        <Link 
                          href={`/${s.sejour?.activityType}/${universSlug}/${s.sejour?.slug}`}
                          className="bg-foreground text-background hover:bg-accent hover:text-white px-12 py-5 rounded-[20px] font-black uppercase tracking-[0.2em] text-xs transition-all flex items-center justify-center gap-3 group/btn"
                        >
                          Voir les détails
                          <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-2 transition-transform" />
                        </Link>
                      );
                    })()}
                    <Link 
                      href="/contact"
                      className="px-12 py-5 bg-card/5 hover:bg-card/10 text-foreground font-black uppercase tracking-[0.2em] text-xs rounded-[20px] text-center transition-all border border-border"
                    >
                      Nous Contacter
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-32 glass rounded-[60px] border border-dashed border-border">
              <p className="text-3xl font-black uppercase tracking-tighter text-foreground/20 mb-8">Aucune sortie disponible</p>
              <button 
                onClick={() => { setFilter('Tout voir'); setSeasonFilter('Toutes saisons'); }}
                className="text-accent font-black uppercase tracking-widest text-sm hover:underline"
              >
                Réinitialiser les filtres
              </button>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
