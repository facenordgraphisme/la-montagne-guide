'use client'

import React from 'react'
import Link from 'next/link'
import { useLanguage } from '@/context/LanguageContext'
import ObfuscatedContact from "./ObfuscatedContact"

interface ContactHomeProps {
  badge?: string
  title?: string
  titleAccent?: string
  description?: string
}

const ContactHome = ({
  badge = "Vous avez un projet ?",
  title = "PRENONS LE TEMPS",
  titleAccent = "D'EN DISCUTER",
  description = "Que ce soit pour un sommet précis, une formation technique ou simplement pour échanger sur vos envies de montagne, n'hésitez pas à me contacter.",
}: ContactHomeProps) => {
  const { at, t } = useLanguage()
  return (
    <section className="py-24 bg-card/5 border-t border-border/20">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="glass p-12 md:p-20 rounded-[50px] border border-border shadow-2xl relative overflow-hidden bg-linear-to-br from-card/30 via-card/10 to-accent/5">
            <div className="absolute -left-10 -top-10 w-40 h-40 bg-accent/5 rounded-full blur-3xl" />
            <span className="text-accent font-black tracking-[0.3em] uppercase text-xs mb-6 block">{at(badge)}</span>
            <h2 className="text-4xl md:text-8xl font-black tracking-tighter mb-10 leading-none uppercase whitespace-pre-line">
              {at(title)} <br /> <span className="text-accent italic">{at(titleAccent)}</span>
            </h2>
            <p className="text-foreground/60 text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
              {at(description)}
            </p>
            
            <div className="flex flex-col md:flex-row items-center justify-center gap-8">
              <Link href="/contact" className="btn-primary px-12 py-5 text-lg shadow-2xl hover:scale-105 transition-transform">
                {t('contact.button')}
              </Link>
              <div className="flex flex-col items-start md:items-start text-left">
                <p className="text-[10px] font-black uppercase tracking-widest text-foreground/40 mb-1">{t('contact.directPhone')}</p>
                <p className="text-2xl font-black text-foreground">
                  <ObfuscatedContact type="phone" value="+33 (0)6 75 07 97 08" />
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ContactHome
