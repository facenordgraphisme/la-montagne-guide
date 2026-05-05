import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { MapPin, BarChart3, Clock } from 'lucide-react'

interface SejourCardProps {
  sejour: {
    title: string
    slug: string
    activityType: string
    subCategory: string
    massif?: string
    level?: string
    duration?: string
    basePrice?: string
    image?: string
  }
  activitySlug: string
}

const SejourCard = ({ sejour, activitySlug }: SejourCardProps) => {
  const getLevelLabel = (level?: string) => {
    const map: Record<string, string> = {
      'debutant': 'Débutant',
      'intermediaire': 'Intermédiaire',
      'confirme': 'Confirmé',
      'expert': 'Expert'
    }
    return level ? map[level] || level : ''
  }

  const getActivityLabel = (type: string) => {
    const map: Record<string, string> = {
      'alpinisme': 'Alpinisme',
      'ski': 'Ski de Randonnée',
      'escalade': 'Escalade',
      'voyage': 'Voyage'
    }
    return map[type] || type
  }

  const universSlug = sejour.subCategory?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '-');

  return (
    <Link href={`/${activitySlug}/${universSlug}/${sejour.slug}`} className="group block h-full">
      <div className="glass overflow-hidden rounded-[40px] border border-border bg-card/5 transition-all duration-500 hover:bg-card/10 hover:border-accent/40 hover:scale-[1.02] h-full flex flex-col shadow-xl">
        {/* Header Badge & Level */}
        <div className="absolute top-6 left-6 right-6 z-20 flex justify-between items-center pointer-events-none">
          <span className="px-4 py-1.5 bg-accent text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg backdrop-blur-md">
            {getActivityLabel(sejour.activityType)}
          </span>
          <div className="flex gap-2">
            {sejour.massif && (
              <span className="px-3 py-1 bg-background/80 text-foreground text-[10px] font-bold uppercase tracking-wider rounded-full backdrop-blur-md border border-white/10 flex items-center gap-1">
                <MapPin size={10} className="text-accent" />
                {sejour.massif}
              </span>
            )}
            {sejour.level && (
              <span className="px-3 py-1 bg-background/80 text-foreground text-[10px] font-bold uppercase tracking-wider rounded-full backdrop-blur-md border border-white/10 flex items-center gap-1">
                <BarChart3 size={10} className="text-accent" />
                {getLevelLabel(sejour.level)}
              </span>
            )}
          </div>
        </div>

        {/* Image Container */}
        <div className="relative aspect-[4/5] overflow-hidden">
          {sejour.image ? (
            <Image
              src={sejour.image}
              alt={sejour.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-foreground/10 to-foreground/5" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
          
          <div className="absolute bottom-6 left-8 right-8">
            {sejour.duration && (
              <div className="flex items-center gap-1 text-foreground/60 text-[10px] font-bold uppercase tracking-widest mb-2">
                <Clock size={12} className="text-accent" />
                {sejour.duration}
              </div>
            )}
            <h3 className="text-2xl font-black text-foreground uppercase tracking-tighter leading-none mb-6">
              {sejour.title}
            </h3>
            
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest leading-none mb-1">À partir de</span>
                <span className="text-xl font-black text-highlight leading-none">{sejour.basePrice || "Sur devis"}</span>
              </div>
              <div className="bg-foreground text-background text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full transition-colors group-hover:bg-accent group-hover:text-white">
                Voir le séjour
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default SejourCard
