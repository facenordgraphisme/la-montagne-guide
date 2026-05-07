'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

import { sanityTranslations } from '@/i18n/translations'
import en from '@/i18n/dictionaries/en.json'
import fr from '@/i18n/dictionaries/fr.json'

const normalize = (s: string) => s
  .toLowerCase()
  .trim()
  .replace(/[\u2013\u2014\u2015]/g, '-') // Normalize dashes
  .replace(/\s+/g, ' ')               // Normalize spaces

const normalizedDictionary: Record<string, string> = {}
Object.entries(sanityTranslations).forEach(([k, v]) => {
  normalizedDictionary[normalize(k)] = v
})

type Language = 'fr' | 'en'

const dictionaries = { en, fr }

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
    
    // Google Translate Cookie (kept for backward compatibility if script is ever added)
    document.cookie = `googtrans=/fr/${lang}; path=/; domain=${window.location.hostname}`
    document.cookie = `googtrans=/fr/${lang}; path=/`
    
    // Set a standard cookie for server-side if needed later
    document.cookie = `language=${lang}; path=/; max-age=31536000`
    
    window.location.reload()
  }

  // Translation function for dictionary keys (e.g., 'nav.activities')
  const t = (key: string) => {
    const keys = key.split('.')
    let value: any = dictionaries[language]
    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k]
      } else {
        value = undefined
        break
      }
    }
    return value || key
  }

  // Translation function for strings or Sanity objects
  const at = (text: any) => {
    if (!text) return ''
    
    // If it's a localized object { fr: '...', en: '...' }
    if (typeof text === 'object' && (text.fr || text.en)) {
      return text[language] || text['fr'] || ''
    }
    
    // If it's a simple string, look it up in sanityTranslations if language is EN
    if (typeof text === 'string') {
      if (language === 'fr') return text
      
      const normText = normalize(text)
      
      // Try exact or normalized match
      let result = sanityTranslations[text] || normalizedDictionary[normText]
      
      if (result) return result

      // If no match, try translating components of a date (e.g., "15 Mars 2026")
      if (/\d+ [a-zA-Z-]+ \d+/.test(text)) {
        let dateText = text;
        Object.entries(normalizedDictionary).forEach(([k, v]) => {
          // If a dictionary key is part of the date (like a month)
          if (dateText.toLowerCase().includes(k)) {
            const regex = new RegExp(k, 'gi');
            dateText = dateText.replace(regex, v);
          }
        });
        return dateText;
      }
      
      return text
    }
    
    return String(text)
  }

  const atc = (text: any) => at(text)
  const translatePortableText = (blocks: any) => {
    if (!blocks) return blocks
    if (Array.isArray(blocks)) return blocks
    // If blocks is localized
    if (blocks[language]) return blocks[language]
    if (blocks['fr']) return blocks['fr']
    return blocks
  }

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
