'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Calendar as CalendarIcon, MapPin, Clock, ArrowRight, BarChart3, Users, ChevronLeft, ChevronRight } from 'lucide-react'

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

const categories = ['Tout voir', 'Alpinisme', 'Escalade', 'Ski', 'Voyage', 'Cascade de glace', 'Paralpinisme']

const getActivityColor = (type: string) => {
  const map: Record<string, string> = {
    'alpinisme': 'bg-accent',
    'ski': 'bg-secondary',
    'escalade': 'bg-highlight',
    'voyage': 'bg-foreground/20',
    'paralpinisme': 'bg-purple-500',
    'cascade-de-glace': 'bg-blue-300',
    'cascade de glace': 'bg-blue-300'
  }
  return map[type.toLowerCase()] || 'bg-foreground/20'
}

const getCategoryLabel = (type: string) => {
  const map: Record<string, string> = {
    'alpinisme': 'Alpinisme',
    'ski': 'Ski',
    'escalade': 'Escalade',
    'voyage': 'Voyage',
    'paralpinisme': 'Paralpinisme',
    'cascade-de-glace': 'Cascade de glace',
    'cascade de glace': 'Cascade de glace'
  }
  return map[type.toLowerCase()] || type
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

export default function SortiesFilterableList({ initialSorties }: SortiesFilterableListProps) {
  const [filter, setFilter] = useState('Tout voir')
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const filteredSorties = initialSorties.filter(s => {
    if (!s.sejour) return false;
    return filter === 'Tout voir' || getCategoryLabel(s.sejour.activityType) === filter;
  });

  // Calendar Logic
  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const renderCalendar = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const totalDays = daysInMonth(year, month);
    const startDay = (firstDayOfMonth(year, month) + 6) % 7; // Adjust for Monday start
    const monthName = new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric' }).format(currentMonth);

    const days = [];
    // Padding
    for (let i = 0; i < startDay; i++) {
      days.push(<div key={`pad-${i}`} className="h-8 w-8" />);
    }
    // Days
    for (let d = 1; d <= totalDays; d++) {
      const dateStr = `${d < 10 ? '0' + d : d}`;
      // Check for sorties on this day
      // Note: This is simplified parsing, assumes date format "DD Month YYYY"
      const dailySorties = filteredSorties.filter(s => {
        const parts = s.date.split(' ');
        const day = parts[0];
        const sMonth = parts[1]?.toLowerCase();
        const currentMonthName = new Intl.DateTimeFormat('fr-FR', { month: 'long' }).format(currentMonth).toLowerCase();
        return day === dateStr && sMonth === currentMonthName;
      });

      days.push(
        <div key={d} className="relative h-8 w-8 flex items-center justify-center text-[10px] font-bold rounded-lg hover:bg-accent/10 transition-colors cursor-default">
          <span className={dailySorties.length > 0 ? 'text-accent' : 'text-foreground/40'}>{d}</span>
          {dailySorties.length > 0 && (
            <div className="absolute bottom-1 flex gap-0.5">
              {dailySorties.slice(0, 3).map((s, idx) => (
                <div key={idx} className={`w-1 h-1 rounded-full ${getActivityColor(s.sejour.activityType)}`} />
              ))}
            </div>
          )}
        </div>
      );
    }
    return { monthName, days };
  };

  const { monthName, days } = renderCalendar();

  return (
    <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
      
      {/* Sidebar Calendar */}
      <aside className="w-full lg:w-72 flex-shrink-0">
        <div className="sticky top-32 space-y-10">
          <div className="glass p-6 rounded-[32px] border border-white/5 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-black uppercase tracking-widest">{monthName}</h3>
              <div className="flex gap-1">
                <button onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)))} className="p-1 hover:text-accent"><ChevronLeft size={16} /></button>
                <button onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)))} className="p-1 hover:text-accent"><ChevronRight size={16} /></button>
              </div>
            </div>
            
            <div className="grid grid-cols-7 gap-y-2 text-center mb-2">
              {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((d, idx) => (
                <span key={`${d}-${idx}`} className="text-[9px] font-black text-foreground/20">{d}</span>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-y-1">
              {days}
            </div>
          </div>

          <div className="space-y-6 px-4">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-foreground/30">Activités</h4>
            <div className="grid grid-cols-1 gap-4">
              {[
                { name: 'Alpinisme', color: 'bg-accent' },
                { name: 'Ski de Rando', color: 'bg-secondary' },
                { name: 'Escalade', color: 'bg-highlight' },
                { name: 'Voyage', color: 'bg-foreground/20' },
                { name: 'Cascade de Glace', color: 'bg-blue-300' },
                { name: 'Paralpinisme', color: 'bg-purple-500' }
              ].map(cat => (
                <div key={cat.name} className="flex items-center gap-3">
                  <div className={`w-2.5 h-2.5 rounded-full ${cat.color} shadow-lg`} />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-foreground/60">{cat.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 space-y-12">
        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-12">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-6 py-2 rounded-full text-[10px] font-black transition-all uppercase tracking-widest border ${
                filter === cat
                  ? 'bg-accent border-accent text-white shadow-xl scale-105'
                  : 'bg-transparent border-white/10 text-foreground/40 hover:border-accent/40'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid of smaller cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredSorties.length > 0 ? (
              filteredSorties.map((s, index) => (
                <motion.div
                  key={index}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="group glass rounded-[40px] overflow-hidden flex flex-col border border-white/5 hover:border-accent/30 transition-all duration-500 shadow-xl"
                >
                  {/* Image Card */}
                  <div className="relative aspect-[1.4] overflow-hidden">
                    {s.sejour?.image && (
                      <Image
                        src={s.sejour.image}
                        alt={s.titleOverride || s.sejour.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    
                    <div className="absolute top-4 left-4 flex gap-2">
                      <span className={`px-3 py-1 ${getActivityColor(s.sejour.activityType)} text-white text-[8px] font-black uppercase tracking-widest rounded-full shadow-lg`}>
                        {getCategoryLabel(s.sejour?.activityType)}
                      </span>
                      {s.isFull && (
                        <span className="px-3 py-1 bg-red-500 text-white text-[8px] font-black uppercase tracking-widest rounded-full shadow-lg">
                          Complet
                        </span>
                      )}
                    </div>

                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex items-center gap-2 text-accent font-black mb-1">
                        <CalendarIcon size={14} />
                        <span className="text-xs uppercase tracking-[0.2em]">{s.date}</span>
                      </div>
                      <h3 className="text-2xl font-black text-white uppercase tracking-tighter leading-none line-clamp-1">
                        {s.titleOverride || s.sejour?.title}
                      </h3>
                    </div>
                  </div>

                  {/* Info Section */}
                  <div className="p-6 flex-1 flex flex-col justify-between bg-card/5">
                    <div className="space-y-4 mb-6">
                      <div className="flex flex-wrap gap-5 text-[11px] font-bold uppercase tracking-widest text-foreground/50">
                        <div className="flex items-center gap-1.5">
                          <MapPin size={14} className="text-accent" />
                          {s.sejour?.massif}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Users size={14} className="text-accent" />
                          {s.availableSpots}
                        </div>
                        <div className="flex items-center gap-1.5 text-highlight">
                          <BarChart3 size={14} />
                          {getLevelLabel(s.sejour?.level)}
                        </div>
                      </div>
                      <p className="text-sm leading-relaxed text-foreground/70 line-clamp-2 font-medium">
                        {s.sejour?.description || "Une expérience d'exception encadrée par votre guide."}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                      <div className="flex flex-col">
                        <span className="text-[8px] font-black text-foreground/30 uppercase tracking-widest">À partir de</span>
                        <span className="text-xl font-black text-foreground">{s.sejour?.basePrice}</span>
                      </div>
                      {(() => {
                        const universSlug = s.sejour?.subCategory?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '-');
                        return (
                          <Link 
                            href={`/${s.sejour?.activityType}/${universSlug}/${s.sejour?.slug}`}
                            className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center text-white hover:scale-110 transition-transform shadow-lg shadow-accent/20"
                          >
                            <ArrowRight size={18} />
                          </Link>
                        );
                      })()}
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-32 glass rounded-[60px] border border-dashed border-white/10">
                <p className="text-xl font-black uppercase tracking-tighter text-foreground/20">Aucune sortie disponible</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
