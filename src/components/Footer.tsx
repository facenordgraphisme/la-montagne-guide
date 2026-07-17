'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useTheme } from 'next-themes'
import { usePathname } from 'next/navigation'

interface FooterProps {
  contactData?: any
  settingsData?: any
}

import { useLanguage } from '@/context/LanguageContext'
import ObfuscatedContact from './ObfuscatedContact'

const Footer = ({ contactData, settingsData }: FooterProps) => {
  const { at, t, language } = useLanguage()
  const pathname = usePathname()
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Masquer le Footer dans le Studio Sanity
  if (pathname?.startsWith('/studio')) return null

  useEffect(() => setMounted(true), [])

  return (
    <footer className="py-20 px-6 bg-background border-t border-border">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="inline-block mb-8">
              {mounted && (
                <Image 
                  src={
                    theme === 'dark' 
                      ? (settingsData?.logoLight || "/logo.webp") 
                      : (settingsData?.logoDark || "/logo-black.webp")
                  } 
                  alt={settingsData?.siteName || "La Montagne Guide"} 
                  width={240} 
                  height={80} 
                  className="w-48 h-auto object-contain"
                  unoptimized={settingsData?.logoLight || settingsData?.logoDark ? true : undefined}
                />
              )}
            </Link>
            <p className="text-foreground/60 max-w-sm text-lg leading-relaxed mb-8">
              {language === 'en' && settingsData?.footerDescriptionEn 
                ? settingsData.footerDescriptionEn 
                : (settingsData?.footerDescription || at("Vivez l'exceptionnel en altitude avec un guide passionné. Sécurité, aventure et respect de la nature."))}
            </p>
            <div className="flex gap-4">
              {settingsData?.instagram && (
                <a href={settingsData.instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-foreground/5 transition-colors group">
                  <span className="sr-only">Instagram</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-foreground/70 group-hover:text-accent transition-colors">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </a>
              )}
              {settingsData?.facebook && (
                <a href={settingsData.facebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-foreground/5 transition-colors group">
                  <span className="sr-only">Facebook</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-foreground/70 group-hover:text-accent transition-colors">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                  </svg>
                </a>
              )}
              {settingsData?.youtube && (
                <a href={settingsData.youtube} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-foreground/5 transition-colors group">
                  <span className="sr-only">YouTube</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-foreground/70 group-hover:text-accent transition-colors">
                    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.95 1.96C5.12 19.5 12 19.5 12 19.5s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path>
                    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
                  </svg>
                </a>
              )}
              {!settingsData?.instagram && !settingsData?.facebook && !settingsData?.youtube && (
                <>
                  <a href="#" className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-foreground/5 transition-colors group">
                    <span className="sr-only">Instagram</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-foreground/70 group-hover:text-accent transition-colors">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                    </svg>
                  </a>
                  <a href="#" className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-foreground/5 transition-colors group">
                    <span className="sr-only">Facebook</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-foreground/70 group-hover:text-accent transition-colors">
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                    </svg>
                  </a>
                </>
              )}
            </div>
          </div>
          
          <div>
            <ul className="space-y-4 text-foreground/70 font-medium">
              <li><Link href="/activites" className="hover:text-accent transition-colors">{t('nav.activities')}</Link></li>
              <li><Link href="/prochaines-sorties" className="hover:text-accent transition-colors">{t('nav.sorties')}</Link></li>
              <li><Link href="/le-guide" className="hover:text-accent transition-colors">{t('nav.guide')}</Link></li>
              <li><Link href="/blog" className="hover:text-accent transition-colors">{t('nav.blog')}</Link></li>
              <li><Link href="/ressources" className="hover:text-accent transition-colors">{t('nav.resources')}</Link></li>
              <li><Link href="/contact" className="hover:text-accent transition-colors">{t('nav.contact')}</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-6 uppercase tracking-widest text-xs text-foreground/40">{t('nav.contact')}</h4>
            <ul className="space-y-4 text-foreground/70 font-medium">
              <li>
                <ObfuscatedContact 
                  type="email" 
                  value={settingsData?.email || contactData?.email || 'draperinicolas@hotmail.com'} 
                />
              </li>
              <li>
                <ObfuscatedContact 
                  type="phone" 
                  value={settingsData?.phone || contactData?.phone || '+33 (0)6 75 07 97 08'} 
                />
              </li>
              <li>{at(settingsData?.address || contactData?.address || 'Champcella, Hautes-Alpes')}</li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between gap-4 text-sm text-foreground/30 font-medium">
          <div>
            <p>© {new Date().getFullYear()} {settingsData?.siteName || "La Montagne Guide"}. {language === 'en' && settingsData?.copyrightEn ? settingsData.copyrightEn : (settingsData?.copyright || at('Tous droits réservés.'))}</p>
            <p className="mt-1.5 text-[11px] text-foreground/20">
              {at('Propulsé par')}{' '}
              <a 
                href="https://facenordgraphisme.fr" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-accent transition-colors underline decoration-dotted"
              >
                Face Nord Graphisme
              </a>
            </p>
          </div>
          <div className="flex gap-8">
            <Link href="/mentions-legales" className="hover:text-accent transition-colors">{at('Mentions Légales')}</Link>
            <Link href="/confidentialite" className="hover:text-accent transition-colors">{at('Confidentialité')}</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer

