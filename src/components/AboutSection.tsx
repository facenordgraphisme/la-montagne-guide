'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'

import { PortableText } from '@portabletext/react'

import { useLanguage } from '@/context/LanguageContext'

const blockAlignComponents = {
  block: {
    normal: ({ children }: any) => {
      const isEmpty = !children || children.length === 0 || (children.length === 1 && children[0] === '');
      return <p style={{ minHeight: isEmpty ? '1.5em' : undefined }}>{isEmpty ? '\u00a0' : children}</p>;
    },
    blockCenter: ({ children }: any) => {
      const isEmpty = !children || children.length === 0 || (children.length === 1 && children[0] === '');
      return <p style={{ textAlign: 'center', minHeight: isEmpty ? '1.5em' : undefined }}>{isEmpty ? '\u00a0' : children}</p>;
    },
    blockRight: ({ children }: any) => {
      const isEmpty = !children || children.length === 0 || (children.length === 1 && children[0] === '');
      return <p style={{ textAlign: 'right', minHeight: isEmpty ? '1.5em' : undefined }}>{isEmpty ? '\u00a0' : children}</p>;
    },
    blockJustify: ({ children }: any) => {
      const isEmpty = !children || children.length === 0 || (children.length === 1 && children[0] === '');
      return <p style={{ textAlign: 'justify', minHeight: isEmpty ? '1.5em' : undefined }}>{isEmpty ? '\u00a0' : children}</p>;
    },
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-4 border-accent pl-6 py-4 my-8 italic text-xl text-foreground/80 bg-accent/5 rounded-r-2xl text-justify">
        {children}
      </blockquote>
    ),
  }
}

interface AboutProps {
  badge?: string
  title?: string
  titleAccent?: string
  description?: any
  image?: string
  experience?: number
  className?: string
}

const AboutSection = ({
  badge = "Le Guide",
  title = "NICOLAS",
  titleAccent = "DRAPERI",
  description,
  image = "/images/guide.jpg",
  experience = 16,
  className = "bg-background"
}: AboutProps) => {
  const { at, t, translatePortableText } = useLanguage()
  const displayExperience = experience === 14 || experience === 15 ? 16 : experience;

  return (
    <section id="a-propos" className={`py-24 px-6 overflow-hidden transition-colors duration-300 ${className}`}>
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="aspect-[4/5] rounded-[40px] overflow-hidden">
              <div 
                className="w-full h-full bg-cover bg-center"
                style={{ backgroundImage: `url('${image}')` }}
              />
            </div>
            {/* Decorative element */}
            <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-accent rounded-full blur-[100px] opacity-20 -z-10" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-accent font-black tracking-widest uppercase text-sm mb-4 block">
              {at(badge)}
            </span>
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-8 leading-tight uppercase">
              {at(title)} <br /> <span className="text-accent italic">{at(titleAccent)}</span>
            </h2>
            <div className="space-y-6 text-foreground/70 text-lg leading-relaxed mb-10">
              {description ? (
                <PortableText value={translatePortableText(description)} components={blockAlignComponents} />
              ) : (
                <>
                  <p>
                    {at('Installé à Champcella dans les Hautes-Alpes, je suis Guide de Haute Montagne spécialisé dans les massifs des Écrins et du Queyras.')}
                  </p>
                  <p>
                    {at('Ma philosophie repose sur une approche authentique et humaine de la montagne. "Laissez le rêve être votre guide" n\'est pas qu\'une devise, c\'est une promesse de partage et de découverte.')}
                  </p>
                </>
              )}
            </div>
            
            <div className="space-y-8">
              <div className="flex items-center gap-6 flex-wrap">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-accent/15 border border-accent/30 text-accent rounded-full flex items-center justify-center font-bold text-lg shrink-0">
                    {displayExperience}+
                  </div>
                  <div>
                    <p className="text-[10px] text-foreground/50 uppercase tracking-widest font-black leading-tight">{t('about.yearsExperience')}</p>
                    <p className="font-bold text-sm text-foreground/80">{t('about.role')}</p>
                  </div>
                </div>

                <div className="h-12 w-px bg-foreground/10 hidden sm:block" />

                <div className="flex items-center gap-3">
                  <Image 
                    src="/images/uiagm-logo.png" 
                    alt="Logo UIAGM - IFMGA - IVBV" 
                    width={48} 
                    height={48} 
                    className="object-contain w-12 h-12"
                  />
                  <div className="text-[9px] font-black text-foreground/50 uppercase tracking-widest leading-tight">
                    Guide de Haute Montagne<br/>
                    <span className="text-accent">UIAGM / IFMGA</span>
                  </div>
                </div>
              </div>

              <div>
                <Link href="/le-guide" className="btn-primary inline-block text-center">
                  {t('about.learnMore')}
                </Link>
              </div>
            </div>

          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default AboutSection
