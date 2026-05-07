'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { PortableText } from '@portabletext/react'
import { useLanguage } from '@/context/LanguageContext'
import UpcomingSorties from "@/components/UpcomingSorties"

interface PrestationContentProps {
  data: any
  initialLang?: 'fr' | 'en'
}

const PrestationContent = ({ data, initialLang = 'fr' }: PrestationContentProps) => {
  const { t, at, atc: contextAtc, language: contextLang, translatePortableText } = useLanguage()
  
  // On utilise la langue du contexte si dispo (client), sinon celle du serveur
  const currentLang = contextLang || initialLang

  // Fonction de protection autonome utilisable dès le premier rendu (SSR)
  const protectedAtc = (text: string | undefined) => {
    if (!text) return ''
    if (currentLang === 'en') {
      const cleanText = text.trim().toLowerCase()
      let override = ''
      
      if (cleanText.includes("cascade") || cleanText.includes("glace")) override = "Ice climbing"
      else if (cleanText.includes("escalade")) override = "Climbing"
      else if (cleanText.includes("alpinisme")) override = "Mountaineering"
      else if (cleanText.includes("ski")) override = "Skiing"

      if (override) {
        return (
          <span className="notranslate" translate="no" style={{ display: 'inline-flex', gap: '0' }}>
            {override.split('').map((char, index) => (
              <span key={index}>{char === ' ' ? '\u00A0' : char}</span>
            ))}
          </span>
        )
      }
    }
    return text
  }

  if (!data) return null

  return (
    <main className="relative min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image 
            src={data.image || "/images/alpinisme.jpg"}
            alt={at(data.title)}
            fill
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/50 bg-gradient-to-t from-background via-transparent to-black/20" />
        </div>
        <div className="container relative z-10 px-6 text-center pt-20">
          <span className={`text-accent font-black tracking-[0.4em] uppercase text-xs mb-6 block ${currentLang === 'en' ? 'notranslate' : ''}`} translate={currentLang === 'en' ? "no" : "yes"}>
            {protectedAtc(data.subtitle)}
          </span>
          <h1 className={`text-6xl md:text-9xl font-black tracking-tighter text-white uppercase mb-8 ${currentLang === 'en' ? 'notranslate' : ''}`} translate={currentLang === 'en' ? "no" : "yes"}>
            {protectedAtc(data.title)}
          </h1>
          {data.intro && (
            <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto leading-relaxed font-medium whitespace-pre-line">
              {at(data.intro)}
            </p>
          )}
        </div>
      </section>

      {/* Key Points Section */}
      {data.keyPoints && data.keyPoints.length > 0 && (
        <section className="py-20 bg-accent/5">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {data.keyPoints.map((point: any, i: number) => (
                <div key={i} className="glass p-10 rounded-[40px] text-center">
                  <h3 className="text-xl font-bold mb-4 text-accent uppercase tracking-widest">{at(point.title)}</h3>
                  <p className="text-foreground/70 leading-relaxed">{at(point.description)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Content Section */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-20">
            <div className="lg:col-span-2 space-y-12">
              <div>
                <h2 className="text-3xl font-bold mb-6">{t('prestation.presentation')}</h2>
                <p className="text-xl text-foreground/70 leading-relaxed whitespace-pre-line">{at(data.description)}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {(data.details || []).map((detail: string, i: number) => (
                  <div key={i} className="flex gap-4 items-start">
                    <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center text-accent mt-1 flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-3 h-3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    </div>
                    <p className="text-foreground/80 font-medium">{at(detail)}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="glass p-10 rounded-[40px] sticky top-32">
                <h3 className="text-2xl font-bold mb-6">{t('prestation.informations')}</h3>
                <div className="space-y-6 mb-10">
                  <div className="flex justify-between items-center py-4 border-b border-white/10">
                    <span className="text-foreground/40 font-bold uppercase tracking-widest text-xs">{t('prestation.price')}</span>
                    <span className="text-xl font-bold text-highlight">{at(data.price)}</span>
                  </div>
                  <div className="flex justify-between items-center py-4 border-b border-white/10">
                    <span className="text-foreground/40 font-bold uppercase tracking-widest text-xs">{t('prestation.period')}</span>
                    <span className="font-bold text-white">{at(data.period) || t('prestation.seasonal')}</span>
                  </div>
                  <div className="flex justify-between items-center py-4 border-b border-white/10">
                    <span className="text-foreground/40 font-bold uppercase tracking-widest text-xs">{t('prestation.location')}</span>
                    <span className="font-bold text-white">{at(data.location) || t('prestation.defaultLocation')}</span>
                  </div>
                </div>
                <Link href="/contact" className="btn-primary w-full block text-center !text-white">{t('prestation.book')}</Link>
                <div className="mt-8 space-y-3">
                  <p className="text-[10px] text-center text-foreground/40 font-bold uppercase tracking-widest leading-relaxed">
                    Possibilité d'ouvrir des dates à la demande
                  </p>
                  <p className="text-[10px] text-center text-foreground/40 font-bold uppercase tracking-widest leading-relaxed border-t border-white/5 pt-3">
                    Groupes constitués : Engagement privé possible
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Univers Section */}
      {data.univers && data.univers.length > 0 && (
        <section className="py-24 bg-accent/5">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16 max-w-3xl mx-auto">
              <span className="text-accent font-black tracking-widest uppercase text-xs mb-4 block">{at(data.universBadge) || t('prestation.universBadge')}</span>
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase mb-6">{at(data.universTitle) || t('prestation.universTitle')}</h2>
              {data.universDescription && (
                <p className="text-lg text-foreground/60 leading-relaxed">
                  {at(data.universDescription)}
                </p>
              )}
            </div>
            <div className={`grid grid-cols-1 md:grid-cols-2 ${data.univers.length > 4 ? 'lg:grid-cols-3' : 'lg:grid-cols-2'} gap-8`}>
              {data.univers.map((univ: any, i: number) => (
                <div key={i} className="group p-8 rounded-[40px] border border-border hover:border-accent transition-all hover:bg-accent/5">
                  <h3 className="text-2xl font-bold mb-4 group-hover:text-accent transition-colors">{at(univ.title)}</h3>
                  <div className="text-foreground/60 leading-relaxed prose-p:mb-0">
                    <PortableText value={translatePortableText(univ.description)} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Upcoming Sorties Section */}
      {data.showUpcomingSorties !== false && (
        <UpcomingSorties 
          initialFilter={data.title} 
          showFilters={false} 
        />
      )}
    </main>
  )
}

export default PrestationContent
