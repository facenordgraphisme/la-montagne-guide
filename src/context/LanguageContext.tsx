'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

type Language = 'fr' | 'en'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
  at: (text: any) => string
  atc: (text: any) => any
  translatePortableText: (blocks: any) => any
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguageState] = useState<Language>('fr')

  useEffect(() => {
    const savedLang = localStorage.getItem('language') as Language
    if (savedLang) setLanguageState(savedLang)
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem('language', lang)
    
    // Google Translate Cookie
    document.cookie = `googtrans=/fr/${lang}; path=/; domain=${window.location.hostname}`
    document.cookie = `googtrans=/fr/${lang}; path=/`
    
    window.location.reload()
  }

  // Fallback translation functions for components that still call them
  const t = (key: string) => key
  const at = (text: any) => {
    if (!text) return ''
    if (typeof text === 'string') return text
    return text[language] || text['fr'] || ''
  }
  const atc = (text: any) => at(text)
  const translatePortableText = (blocks: any) => blocks

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, at, atc, translatePortableText }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) throw new Error('useLanguage must be used within a LanguageProvider')
  return context
}
