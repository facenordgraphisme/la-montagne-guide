'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

type Language = 'fr' | 'en'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguageState] = useState<Language>('fr')

  useEffect(() => {
    // 1. Charger la langue depuis le cookie/localStorage
    const saved = localStorage.getItem('language') as Language
    if (saved) setLanguageState(saved)

    // 2. Initialiser Google Translate
    const initGoogleTranslate = () => {
      if (!(window as any).googleTranslateElementInit) {
        (window as any).googleTranslateElementInit = () => {
          new (window as any).google.translate.TranslateElement({
            pageLanguage: 'fr',
            includedLanguages: 'fr,en',
            layout: (window as any).google.translate.TranslateElement.InlineLayout.SIMPLE,
            autoDisplay: false
          }, 'google_translate_element')
        }

        const script = document.createElement('script')
        script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit'
        script.async = true
        document.body.appendChild(script)
      }
    }

    initGoogleTranslate()
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem('language', lang)
    
    const cookieValue = lang === 'fr' ? '' : `/fr/${lang}`
    document.cookie = `googtrans=${cookieValue}; path=/; SameSite=Lax`
    
    // On recharge pour que Google Translate applique le changement
    window.location.reload()
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
      <div id="google_translate_element" style={{ display: 'none' }}></div>
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) throw new Error('useLanguage must be used within LanguageProvider')
  return context
}
