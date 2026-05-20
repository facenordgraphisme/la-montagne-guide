'use client'

import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Megaphone, Bell, Flame } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'

interface AnnouncementBannerProps {
  settings: {
    showBanner?: boolean
    bannerText?: string
    bannerTextEn?: string
    bannerColor?: 'cyan' | 'orange' | 'navy' | string
    bannerLink?: string
  }
}

export default function AnnouncementBanner({ settings }: AnnouncementBannerProps) {
  const { language } = useLanguage()
  const bannerRef = useRef<HTMLDivElement>(null)
  
  const [mounted, setMounted] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  const showBanner = settings?.showBanner ?? false
  const bannerText = language === 'en' && settings?.bannerTextEn ? settings.bannerTextEn : settings?.bannerText
  const color = settings?.bannerColor || 'cyan'
  const link = settings?.bannerLink

  useEffect(() => {
    setMounted(true)
    if (showBanner && bannerText) {
      const dismissed = sessionStorage.getItem('announcement_dismissed')
      if (!dismissed) {
        setIsVisible(true)
      }
    }
  }, [showBanner, bannerText])

  // Update dynamic CSS variable --banner-height
  useEffect(() => {
    if (!mounted) return

    const updateHeight = () => {
      if (isVisible && bannerRef.current) {
        const height = bannerRef.current.getBoundingClientRect().height || bannerRef.current.offsetHeight
        document.documentElement.style.setProperty('--banner-height', `${height}px`)
      } else {
        document.documentElement.style.setProperty('--banner-height', '0px')
      }
    }

    // Run initially
    updateHeight()

    // Observe size changes
    let resizeObserver: ResizeObserver | null = null
    if (isVisible && bannerRef.current && typeof window !== 'undefined' && 'ResizeObserver' in window) {
      resizeObserver = new ResizeObserver(() => {
        updateHeight()
      })
      resizeObserver.observe(bannerRef.current)
    }

    window.addEventListener('resize', updateHeight)

    return () => {
      window.removeEventListener('resize', updateHeight)
      if (resizeObserver) resizeObserver.disconnect()
      document.documentElement.style.setProperty('--banner-height', '0px')
    }
  }, [isVisible, mounted])

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    setIsVisible(false)
    sessionStorage.setItem('announcement_dismissed', 'true')
  }

  if (!mounted || !isVisible || !bannerText) return null

  // Setup styles based on color selection
  let colorStyles = ''
  let icon = <Megaphone className="w-4 h-4 text-accent shrink-0 animate-pulse" />

  if (color === 'cyan') {
    colorStyles = 'bg-gradient-to-r from-slate-950 via-[#0a182c] to-slate-950 text-white border-b border-accent/25'
    icon = <Megaphone className="w-4 h-4 text-[#00f2fe] shrink-0" />
  } else if (color === 'orange') {
    colorStyles = 'bg-gradient-to-r from-stone-950 via-[#1c120c] to-stone-950 text-orange-100 border-b border-orange-500/25'
    icon = <Flame className="w-4 h-4 text-orange-400 shrink-0" />
  } else {
    // navy
    colorStyles = 'bg-gradient-to-r from-[#030712]/95 via-slate-950/95 to-[#030712]/95 text-slate-100 border-b border-white/5 backdrop-blur-md'
    icon = <Bell className="w-4 h-4 text-slate-400 shrink-0" />
  }

  const content = (
    <div className="flex items-center justify-center gap-3 px-6 py-2.5 text-center text-xs md:text-sm font-semibold tracking-tight leading-snug">
      {icon}
      <span>{bannerText}</span>
      {link && (
        <span className="underline ml-1.5 hover:text-accent transition-colors duration-200">
          {language === 'en' ? 'Learn more →' : 'En savoir plus →'}
        </span>
      )}
    </div>
  )

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          ref={bannerRef}
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className={`fixed top-0 left-0 w-full z-[100] ${colorStyles}`}
        >
          <div className="relative w-full mx-auto max-w-7xl flex items-center justify-center">
            {link ? (
              <Link href={link} className="w-full flex-grow cursor-pointer block">
                {content}
              </Link>
            ) : (
              <div className="w-full flex-grow">{content}</div>
            )}
            
            <button
              onClick={handleDismiss}
              className="absolute right-4 p-1.5 rounded-full text-foreground/50 hover:text-foreground hover:bg-white/5 transition-all duration-200"
              aria-label="Fermer l'annonce"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
