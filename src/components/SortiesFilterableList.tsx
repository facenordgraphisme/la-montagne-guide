'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Calendar as CalendarIcon, MapPin, ArrowRight, BarChart3, ChevronLeft, ChevronRight } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import { sortiePeriod } from '@/utils/dates'
import { SpotsIndicator, CornerRibbon } from './SortieBadges'

interface Sejour {
  title: string
  titleEn?: string
  slug: string
  slugEn?: string
  activityType: string
  activitySlug?: string
  subCategory: string
  subCategorySlug?: string
  massif: string
  level: string
  levelEn?: string
  season: string | string[]
  duration: string
  basePrice: string
  image: string
}

interface Sortie {
  date: string
  startDate?: string
  endDate?: string
  availableSpots: string
  isFull: boolean
  isConfirmed?: boolean
  titleOverride?: string
  titleOverrideEn?: string
  sejour: Sejour
}

interface SortiesFilterableListProps {
  initialSorties: Sortie[]
}

const toIsoDay = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

export default function SortiesFilterableList({ initialSorties }: SortiesFilterableListProps) {
  const { at, language } = useLanguage()
  const [filter, setFilter] = useState(at('Tout voir'))
  const [showPastSorties, setShowPastSorties] = useState(false)

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayIso = toIsoDay(today)

  // Open the calendar on the month of the next departure
  const [currentMonth, setCurrentMonth] = useState(() => {
    const next = initialSorties.map(s => s.startDate).filter((d): d is string => !!d && d >= todayIso).sort()[0]
    if (!next) return new Date(today.getFullYear(), today.getMonth(), 1)
    const [y, m] = next.split('-').map(Number)
    return new Date(y, m - 1, 1)
  })

  const categories = [at('Tout voir'), at('Alpinisme'), at('Escalade'), at('Ski'), at('Voyage'), at('Cascade de glace'), at('Paralpinisme')]

  const getActivityColor = (type: string) => {
    const map: Record<string, string> = {
      'alpinisme': 'bg-accent',
      'ski': 'bg-secondary',
      'escalade': 'bg-highlight',
      'voyage': 'bg-foreground/20',
      'voyages': 'bg-foreground/20',
      'paralpinisme': 'bg-purple-500',
      'parapente-alpinisme': 'bg-purple-500',
      'cascade-de-glace': 'bg-blue-300',
      'cascade de glace': 'bg-blue-300'
    }
    return map[type?.toLowerCase()] || 'bg-foreground/20'
  }

  const getCategoryLabel = (type: string) => {
    const map: Record<string, string> = {
      'alpinisme': at('Alpinisme'),
      'ski': at('Ski'),
      'escalade': at('Escalade'),
      'voyage': at('Voyage'),
      'voyages': at('Voyage'),
      'paralpinisme': at('Paralpinisme'),
      'parapente-alpinisme': at('Paralpinisme'),
      'cascade-de-glace': at('Cascade de glace'),
      'cascade de glace': at('Cascade de glace')
    }
    return map[type?.toLowerCase()] || type
  }

  const getLevelLabel = (level?: string) => {
    const map: Record<string, string> = {
      'debutant': at('Débutant'),
      'intermediaire': at('Intermédiaire'),
      'confirme': at('Confirmé'),
      'expert': at('Expert')
    }
    return level ? map[level] || level : ''
  }

  const filteredSorties = initialSorties
    .filter(s => {
      if (!s.sejour) return false
      return filter === at('Tout voir') || getCategoryLabel(s.sejour.activityType) === filter
    })
    .map(s => ({ ...s, isPassed: s.startDate ? s.startDate < todayIso : false }))

  const visibleSorties = filteredSorties.filter(s => showPastSorties || !s.isPassed)

  const renderCalendar = () => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    const totalDays = new Date(year, month + 1, 0).getDate()
    const startDay = (new Date(year, month, 1).getDay() + 6) % 7 // Monday first
    const locale = language === 'fr' ? 'fr-FR' : 'en-US'
    const monthName = new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(currentMonth)

    const days = []
    for (let i = 0; i < startDay; i++) {
      days.push(<div key={`pad-${i}`} className="h-8 w-8" />)
    }
    for (let d = 1; d <= totalDays; d++) {
      const isoDay = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
      const dailySorties = visibleSorties.filter(s => s.startDate === isoDay)

      days.push(
        <div
          key={d}
          title={dailySorties.map(s => s.titleOverride || s.sejour.title).join(' · ') || undefined}
          className={`relative h-8 w-8 flex items-center justify-center text-[10px] font-bold rounded-lg transition-colors cursor-default ${dailySorties.length > 0 ? 'bg-accent/10' : 'hover:bg-accent/10'}`}
        >
          <span className={dailySorties.length > 0 ? 'text-accent' : 'text-foreground/40'}>{d}</span>
          {dailySorties.length > 0 && (
            <div className="absolute bottom-1 flex gap-0.5">
              {dailySorties.slice(0, 3).map((s, idx) => (
                <div key={idx} className={`w-1 h-1 rounded-full ${getActivityColor(s.sejour.activityType)}`} />
              ))}
            </div>
          )}
        </div>
      )
    }
    return { monthName, days }
  }

  const { monthName, days } = renderCalendar()

  return (
    <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">

      {/* Sidebar Calendar */}
      <aside className="w-full lg:w-72 flex-shrink-0">
        <div className="sticky top-32 space-y-10">
          <div className="glass p-6 rounded-[32px] border border-white/5 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-black uppercase tracking-widest">{monthName}</h3>
              <div className="flex gap-1">
                <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))} className="p-1 hover:text-accent"><ChevronLeft size={16} /></button>
                <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))} className="p-1 hover:text-accent"><ChevronRight size={16} /></button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-y-2 text-center mb-2">
              {[at('Lundi'), at('Mardi'), at('Mercredi'), at('Jeudi'), at('Vendredi'), at('Samedi'), at('Dimanche')].map((d, idx) => (
                <span key={idx} className="text-[9px] font-black text-foreground/20">{d.charAt(0).toUpperCase()}</span>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-y-1">
              {days}
            </div>
          </div>

          <div className="space-y-6 px-4">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-foreground/30">{at('Activités')}</h4>
            <div className="grid grid-cols-1 gap-4">
              {[
                { name: at('Alpinisme'), color: 'bg-accent' },
                { name: at('Ski de Rando'), color: 'bg-secondary' },
                { name: at('Escalade'), color: 'bg-highlight' },
                { name: at('Voyage'), color: 'bg-foreground/20' },
                { name: at('Cascade de Glace'), color: 'bg-blue-300' },
                { name: at('Paralpinisme'), color: 'bg-purple-500' }
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-12">
          <div className="flex flex-wrap gap-2">
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

          <button
            onClick={() => setShowPastSorties(!showPastSorties)}
            className="px-6 py-2 rounded-full text-[10px] font-black transition-all uppercase tracking-widest border border-accent text-accent hover:bg-accent hover:text-white shrink-0"
          >
            {showPastSorties ? at('Masquer les sorties passées') : at('Voir les sorties passées')}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {visibleSorties.length > 0 ? (
              visibleSorties.map((s, index) => {
                const subSlug = s.sejour?.subCategorySlug || s.sejour?.subCategory?.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, '-')
                const activitySlug = s.sejour?.activitySlug || s.sejour?.activityType
                const href = language === 'en' && s.sejour?.slugEn && s.sejour?.subCategorySlug
                  ? `/en/${activitySlug}/${s.sejour.subCategorySlug}/${s.sejour.slugEn}`
                  : `/${activitySlug}/${subSlug}/${s.sejour?.slug}`
                const dimmed = s.isPassed || s.isFull
                const title = language === 'en'
                  ? (s.titleOverrideEn || s.titleOverride || s.sejour?.titleEn || s.sejour?.title)
                  : (s.titleOverride || s.sejour?.title)

                return (
                  <motion.div
                    key={index}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    className={`group glass rounded-[28px] overflow-hidden border transition-all duration-500 shadow-xl ${
                      dimmed ? 'border-white/5 opacity-75' : 'border-white/5 hover:border-accent/30'
                    }`}
                  >
                    <Link href={href} className="flex h-full flex-col">
                      <div className="relative aspect-[1.6] overflow-hidden">
                        {s.sejour?.image && (
                          <Image
                            src={s.sejour.image}
                            alt={title}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                            className={`object-cover transition-transform duration-700 group-hover:scale-110 ${dimmed ? 'grayscale' : ''}`}
                          />
                        )}
                        {!s.isPassed && (s.isFull
                          ? <CornerRibbon tone="full">{at('Séjour complet')}</CornerRibbon>
                          : s.isConfirmed && <CornerRibbon tone="confirmed">{at({ fr: 'Départ assuré', en: 'Guaranteed departure' })}</CornerRibbon>)}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                          <span className={`px-3 py-1 ${getActivityColor(s.sejour.activityType)} text-white text-[8px] font-black uppercase tracking-widest rounded-full shadow-lg`}>
                            {getCategoryLabel(s.sejour?.activityType)}
                          </span>
                          {s.isPassed && (
                            <span className="px-3 py-1 bg-zinc-600 text-white text-[8px] font-black uppercase tracking-widest rounded-full shadow-lg">
                              {at('Terminée')}
                            </span>
                          )}
                        </div>

                        <div className="absolute bottom-3 left-4 right-4">
                          <div className="flex items-center gap-2 text-accent font-black mb-1">
                            <CalendarIcon size={13} />
                            <span className="text-[11px] uppercase tracking-[0.2em]">{sortiePeriod(s, language)}</span>
                          </div>
                          <h3 className="text-lg font-black text-white uppercase tracking-tighter leading-tight line-clamp-2">
                            {title}
                          </h3>
                          {(s.sejour?.massif || s.sejour?.level) && (
                            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[10px] font-bold uppercase tracking-widest text-white/80">
                              {s.sejour?.massif && (
                                <div className="flex items-center gap-1.5">
                                  <MapPin size={12} className="text-accent" />
                                  {at(s.sejour.massif)}
                                </div>
                              )}
                              {s.sejour?.level && (
                                <div className="flex items-center gap-1.5">
                                  <BarChart3 size={12} className="text-accent" />
                                  {language === 'en' && s.sejour.levelEn ? s.sejour.levelEn : getLevelLabel(s.sejour.level)}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="p-5 flex-1 flex flex-col justify-end bg-card/5">
                        <div className="flex items-center justify-between gap-3">
                          <SpotsIndicator availableSpots={s.availableSpots} isFull={s.isFull} isPassed={s.isPassed} />
                          <div className="flex flex-col items-end ml-auto">
                            <span className="text-[8px] font-black text-foreground/30 uppercase tracking-widest">{at('À partir de')}</span>
                            <span className="text-lg font-black text-foreground">{at(s.sejour?.basePrice)}</span>
                          </div>
                          <span className={`w-10 h-10 rounded-xl flex items-center justify-center transition-transform ${dimmed ? 'bg-foreground/10 text-foreground/30' : 'bg-accent text-white shadow-lg shadow-accent/20 group-hover:scale-110'}`}>
                            <ArrowRight size={18} />
                          </span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                )
              })
            ) : (
              <div className="col-span-full text-center py-32 glass rounded-[60px] border border-dashed border-white/10">
                <p className="text-xl font-black uppercase tracking-tighter text-foreground/20">{at('Aucune sortie disponible')}</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
