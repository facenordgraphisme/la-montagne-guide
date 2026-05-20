'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useLanguage } from '@/context/LanguageContext'

interface Partner {
  name: string
  logo?: string
  link?: string
}

interface PartnersSliderProps {
  partners?: Partner[]
}

// Vector mountain brand fallback marks
const FALLBACK_PARTNERS = [
  {
    name: 'Petzl',
    link: 'https://www.petzl.com',
    logoSvg: (
      <svg className="w-24 h-8 fill-current text-white/40 group-hover:text-white transition-colors duration-300" viewBox="0 0 100 25">
        <text x="5" y="18" fontFamily="var(--font-outfit), sans-serif" fontWeight="900" fontSize="16" letterSpacing="2">PETZL</text>
        <circle cx="90" cy="12" r="3" fill="#ff5a00" className="animate-pulse" />
      </svg>
    )
  },
  {
    name: 'Scarpa',
    link: 'https://www.scarpa.com',
    logoSvg: (
      <svg className="w-28 h-8 fill-current text-white/40 group-hover:text-white transition-colors duration-300" viewBox="0 0 120 25">
        <path d="M5 5 L12 5 L8 20 L2 20 Z" fill="#00f2fe" opacity="0.8" />
        <text x="18" y="18" fontFamily="var(--font-outfit), sans-serif" fontWeight="800" fontSize="15" letterSpacing="3">SCARPA</text>
      </svg>
    )
  },
  {
    name: 'Black Diamond',
    link: 'https://www.blackdiamondequipment.com',
    logoSvg: (
      <svg className="w-36 h-8 fill-current text-white/40 group-hover:text-white transition-colors duration-300" viewBox="0 0 160 25">
        <polygon points="12,5 5,12 12,19 19,12" fill="#00f2fe" />
        <polygon points="12,8 8,12 12,16 16,12" fill="currentColor" />
        <text x="26" y="17" fontFamily="var(--font-outfit), sans-serif" fontWeight="700" fontSize="11" letterSpacing="1.5">BLACK DIAMOND</text>
      </svg>
    )
  },
  {
    name: 'Julbo',
    link: 'https://www.julbo.com',
    logoSvg: (
      <svg className="w-24 h-8 fill-current text-white/40 group-hover:text-white transition-colors duration-300" viewBox="0 0 100 25">
        <path d="M5 8 C5 8, 12 4, 18 10 C24 16, 20 20, 15 20" stroke="#00f2fe" strokeWidth="2.5" fill="none" />
        <text x="28" y="18" fontFamily="var(--font-outfit), sans-serif" fontWeight="800" fontSize="16" letterSpacing="2">Julbo</text>
      </svg>
    )
  },
  {
    name: 'Ortovox',
    link: 'https://www.ortovox.com',
    logoSvg: (
      <svg className="w-32 h-8 fill-current text-white/40 group-hover:text-white transition-colors duration-300" viewBox="0 0 120 25">
        <circle cx="12" cy="12" r="7" stroke="currentColor" strokeWidth="2.5" fill="none" />
        <path d="M8 12 L16 12" stroke="#ff5a00" strokeWidth="2.5" />
        <text x="26" y="18" fontFamily="var(--font-outfit), sans-serif" fontWeight="900" fontSize="14" letterSpacing="2">ORTOVOX</text>
      </svg>
    )
  },
  {
    name: 'Millet',
    link: 'https://www.millet.com',
    logoSvg: (
      <svg className="w-24 h-8 fill-current text-white/40 group-hover:text-white transition-colors duration-300" viewBox="0 0 100 25">
        <path d="M3 18 L3 6 L7 12 L11 6 L11 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d="M5 18 L9 18" stroke="#00f2fe" strokeWidth="2" />
        <text x="20" y="17" fontFamily="var(--font-outfit), sans-serif" fontWeight="800" fontSize="15" letterSpacing="3">MILLET</text>
      </svg>
    )
  }
]

export default function PartnersSlider({ partners }: PartnersSliderProps) {
  const { language } = useLanguage()
  
  const hasSanityPartners = partners && partners.length > 0
  const partnersList = hasSanityPartners ? partners : []

  // Duplicate arrays to make seamless scrolling
  const doubleList = [...partnersList, ...partnersList]
  const doubleFallbackList = [...FALLBACK_PARTNERS, ...FALLBACK_PARTNERS]

  return (
    <section className="py-16 bg-background overflow-hidden relative border-t border-white/5">
      <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
      
      <div className="container mx-auto px-6 mb-8 text-center">
        <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-accent/80">
          {language === 'en' ? 'TRUSTED BY THE BEST' : 'ILS ME FONT CONFIANCE'}
        </h3>
      </div>

      <div className="relative w-full flex items-center overflow-hidden">
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes marquee {
            0% { transform: translateX(0%); }
            100% { transform: translateX(-50%); }
          }
          .animate-marquee-scroll {
            display: flex;
            width: max-content;
            animation: marquee 30s linear infinite;
          }
          .animate-marquee-scroll:hover {
            animation-play-state: paused;
          }
        `}} />

        <div className="animate-marquee-scroll flex gap-12 items-center">
          {hasSanityPartners ? (
            doubleList.map((partner, index) => {
              const content = (
                <div className="relative group flex items-center justify-center px-8 py-4 bg-white/[0.01] border border-white/5 rounded-2xl h-16 w-44 hover:bg-white/[0.04] hover:border-accent/20 transition-all duration-300">
                  {partner.logo ? (
                    <Image
                      src={partner.logo}
                      alt={partner.name}
                      width={120}
                      height={40}
                      className="object-contain max-h-8 opacity-40 group-hover:opacity-100 transition-all duration-300 filter brightness-200"
                    />
                  ) : (
                    <span className="font-bold text-white/40 group-hover:text-white transition-colors duration-300">{partner.name}</span>
                  )}
                </div>
              )

              return partner.link ? (
                <Link key={index} href={partner.link} target="_blank" rel="noopener noreferrer">
                  {content}
                </Link>
              ) : (
                <div key={index}>{content}</div>
              )
            })
          ) : (
            doubleFallbackList.map((partner, index) => (
              <Link 
                key={index} 
                href={partner.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="group flex items-center justify-center px-8 py-4 bg-white/[0.01] border border-white/5 rounded-2xl h-16 w-44 hover:bg-white/[0.04] hover:border-accent/20 transition-all duration-300"
              >
                {partner.logoSvg}
              </Link>
            ))
          )}
        </div>
      </div>
    </section>
  )
}
