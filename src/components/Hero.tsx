'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

const backgrounds = [
  '/images/hero.jpg',
  '/photos/DSC_6701.jpg',
  '/photos/DSC_6612.jpg',
  '/photos/DSC_6683.jpg',
]

const Hero = () => {
  const [currentBg, setCurrentBg] = React.useState(0)

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % backgrounds.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [])

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
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url('${backgrounds[currentBg]}')` }}
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-black/40 bg-gradient-to-b from-black/60 via-transparent to-black" />
      </div>

      <div className="container relative z-10 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-[#ffffff]"
        >
          <span className="text-[#f97316] font-bold tracking-widest uppercase text-sm mb-4 block">
            Nicolas Draperi — Guide de Haute Montagne
          </span>
          <h1 className="text-5xl md:text-8xl font-bold tracking-tighter mb-8 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
            L'AVENTURE <br /> EN CORDÉE
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-white/80 mb-10 leading-relaxed">
            Alpinisme, Ski, Escalade & Voyages. <br />
            Explorez les plus beaux massifs des Alpes et d'ailleurs avec un guide passionné.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/prestations" className="btn-primary !text-white">Découvrir les prestations</Link>
            <Link href="/prochaines-sorties" className="px-8 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full font-medium transition-all text-white">
              Prochains départs
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

