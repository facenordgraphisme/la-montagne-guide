'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

import { PortableText } from '@portabletext/react'

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
  experience = 15,
  className = "bg-background"
}: AboutProps) => {
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
            <div className="absolute top-1/2 -right-8 glass p-6 rounded-2xl hidden md:block">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center font-bold">{experience}+</div>
                <div>
                  <p className="text-xs text-foreground/60 uppercase tracking-wider font-bold">Années d'expérience</p>
                  <p className="font-medium">Guide de Haute Montagne</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-accent font-black tracking-widest uppercase text-sm mb-4 block">
              {badge}
            </span>
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-8 leading-tight uppercase">
              {title} <br /> <span className="text-accent italic">{titleAccent}</span>
            </h2>
            <div className="space-y-6 text-foreground/70 text-lg leading-relaxed mb-10">
              {description ? (
                <PortableText value={description} />
              ) : (
                <>
                  <p>
                    Installé à Champcella dans les Hautes-Alpes, je suis Guide de Haute Montagne spécialisé dans les massifs des Écrins et du Queyras.
                  </p>
                  <p>
                    Ma philosophie repose sur une approche authentique et humaine de la montagne. "Laissez le rêve être votre guide" n'est pas qu'une devise, c'est une promesse de partage et de découverte.
                  </p>
                </>
              )}
            </div>
            
            <Link href="/le-guide" className="btn-primary inline-block">
              En savoir plus sur moi
            </Link>

          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default AboutSection
