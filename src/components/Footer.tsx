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
                <a href={settingsData.instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-foreground/5 transition-colors">
                  <span className="sr-only">Instagram</span>
                  <div className="w-1 h-1 bg-accent rounded-full" />
                </a>
              )}
              {settingsData?.facebook && (
                <a href={settingsData.facebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-foreground/5 transition-colors">
                  <span className="sr-only">Facebook</span>
                  <div className="w-1 h-1 bg-accent rounded-full" />
                </a>
              )}
              {settingsData?.youtube && (
                <a href={settingsData.youtube} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-foreground/5 transition-colors">
                  <span className="sr-only">YouTube</span>
                  <div className="w-1 h-1 bg-accent rounded-full" />
                </a>
              )}
              {!settingsData?.instagram && !settingsData?.facebook && !settingsData?.youtube && (
                ['Instagram', 'Facebook'].map((social) => (
                  <a key={social} href="#" className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-foreground/5 transition-colors">
                    <span className="sr-only">{social}</span>
                    <div className="w-1 h-1 bg-accent rounded-full" />
                  </a>
                ))
              )}
            </div>
          </div>
          
          <div>
            <h4 className="font-bold mb-6 uppercase tracking-widest text-xs text-foreground/40">{t('footer.navigation') || t('nav.navigation')}</h4>
            <ul className="space-y-4 text-foreground/70 font-medium">
              <li><Link href="/prestations" className="hover:text-accent transition-colors">{t('nav.activities')}</Link></li>
              <li><Link href="/prochaines-sorties" className="hover:text-accent transition-colors">{t('nav.sorties')}</Link></li>
              <li><Link href="/le-guide" className="hover:text-accent transition-colors">{t('nav.guide')}</Link></li>
              <li><Link href="/blog" className="hover:text-accent transition-colors">{t('nav.blog')}</Link></li>
              <li><Link href="/contact" className="hover:text-accent transition-colors">{t('nav.contact')}</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-6 uppercase tracking-widest text-xs text-foreground/40">{t('nav.contact')}</h4>
            <ul className="space-y-4 text-foreground/70 font-medium">
              <li>{settingsData?.email || contactData?.email || 'draperinicolas@hotmail.com'}</li>
              <li>{settingsData?.phone || contactData?.phone || '06 75 07 97 08'}</li>
              <li>{at(settingsData?.address || contactData?.address || 'Champcella, Hautes-Alpes')}</li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between gap-4 text-sm text-foreground/30 font-medium">
          <p>© {new Date().getFullYear()} {settingsData?.siteName || "La Montagne Guide"}. {language === 'en' && settingsData?.copyrightEn ? settingsData.copyrightEn : (settingsData?.copyright || at('Tous droits réservés.'))}</p>
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

