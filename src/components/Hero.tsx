'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'

import { useLanguage } from '@/context/LanguageContext'
import { renderRichText } from '@/utils/richText'

interface HeroProps {
  title?: string
  subtitle?: string
  description?: any
  images?: string[]
  textAlign?: string
  btnDiscoverText?: string
  btnDiscoverTextEn?: string
  btnDeparturesText?: string
  btnDeparturesTextEn?: string
}

const Hero = ({ 
  title = "L'AVENTURE EN CORDÉE", 
  subtitle = "Nicolas Draperi — Guide de Haute Montagne",
  description = "Alpinisme, Ski, Escalade & Voyages. Explorez les plus beaux massifs des Alpes et d'ailleurs avec un guide passionné.",
  images = [
    '/images/hero.jpg',
    '/photos/DSC_6701.jpg',
    '/photos/DSC_6612.jpg',
    '/photos/DSC_6683.jpg',
  ],
  textAlign = 'center',
  btnDiscoverText,
  btnDiscoverTextEn,
  btnDeparturesText,
  btnDeparturesTextEn
}: HeroProps) => {
  const { at, t, language, translatePortableText } = useLanguage()
  const [currentBg, setCurrentBg] = React.useState(0)
  const backgrounds = (images && images.length > 0) ? images : ['/images/hero.jpg']

  React.useEffect(() => {
    if (backgrounds.length <= 1) return
    const timer = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % backgrounds.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [backgrounds.length])

  const alignClass = textAlign === 'left' ? 'text-left items-start' : textAlign === 'right' ? 'text-right items-end' : 'text-center items-center';
  const descAlignClass = textAlign === 'left' ? 'mr-auto' : textAlign === 'right' ? 'ml-auto' : 'mx-auto';
  const btnAlignClass = textAlign === 'left' ? 'justify-start' : textAlign === 'right' ? 'justify-end' : 'justify-center';

  return (
    <section className="relative h-screen w-full overflow-hidden flex items-center justify-center">
      {/* Background Carousel */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentBg}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <Image
              src={backgrounds[currentBg]}
              alt="Hero Background"
              fill
              priority={currentBg === 0}
              className="object-cover"
              sizes="100vw"
            />
          </motion.div>
        </AnimatePresence>
        <div className="absolute inset-0 bg-black/40 bg-gradient-to-b from-black/60 via-transparent to-black" />
      </div>

      <div className={`container relative z-10 px-6 pt-20 flex flex-col ${alignClass}`}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className={`text-[#ffffff] w-full max-w-4xl flex flex-col ${alignClass}`}
        >
          <span className={`text-[#f97316] font-black tracking-widest uppercase text-sm mb-4 block ${textAlign === 'left' ? 'text-left' : textAlign === 'right' ? 'text-right' : 'text-center'}`}>
            {at(subtitle)}
          </span>
          <h1 className={`text-5xl md:text-8xl font-black tracking-tighter mb-8 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60 uppercase whitespace-pre-line ${textAlign === 'left' ? 'text-left' : textAlign === 'right' ? 'text-right' : 'text-center'}`}>
            {at(title)}
          </h1>
          <div 
            className={`max-w-2xl text-lg text-white/80 mb-10 leading-relaxed ${descAlignClass} ${textAlign === 'left' ? 'text-left' : textAlign === 'right' ? 'text-right' : 'text-center'}`}
            style={{ textAlign: (textAlign === 'left' || textAlign === 'right') ? textAlign : 'center' }}
          >
            {renderRichText(translatePortableText(description) || at(description))}
          </div>
          <div className={`flex flex-col sm:flex-row items-center gap-4 ${btnAlignClass}`}>
            <Link href="/activites" className="btn-primary !text-white">
              {language === 'en' 
                ? (btnDiscoverTextEn || btnDiscoverText || t('hero.discover')) 
                : (btnDiscoverText || t('hero.discover'))
              }
            </Link>
            <Link href="/prochaines-sorties" className="px-8 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full font-medium transition-all text-white">
              {language === 'en' 
                ? (btnDeparturesTextEn || btnDeparturesText || t('hero.departures')) 
                : (btnDeparturesText || t('hero.departures'))
              }
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Progress Indicators */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex gap-3">
        {backgrounds.map((_, i) => (
          <button 
            key={i} 
            onClick={() => setCurrentBg(i)}
            className={`h-1 rounded-full transition-all duration-500 ${i === currentBg ? 'w-12 bg-accent' : 'w-4 bg-white/20 hover:bg-white/40'}`} 
          />
        ))}
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 right-10 z-20 hidden md:flex flex-col items-center gap-3"
      >
        <span className="text-[10px] uppercase tracking-[0.3em] text-white/40 rotate-90 translate-y-12 mb-12">Scroll</span>
        <div className="w-[1px] h-20 bg-gradient-to-b from-white/40 to-transparent" />
      </motion.div>
    </section>
  )
}

export default Hero

