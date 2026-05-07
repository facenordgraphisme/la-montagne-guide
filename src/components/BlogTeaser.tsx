'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useLanguage } from '@/context/LanguageContext'

interface Post {
  title: string
  excerpt: string
  date: string
  image: string
  slug: string
}

interface BlogTeaserProps {
  data?: Post[]
  badge?: string
  title?: string
  titleAccent?: string
  className?: string
}

const BlogTeaser = ({ 
  data = [],
  badge = "Carnet de voyage",
  title = "DERNIERS",
  titleAccent = "RÉCITS",
  className = "bg-background"
}: BlogTeaserProps) => {
  const { at, t, language } = useLanguage()
  
  const formatDate = (dateStr: string) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    return date.toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', { month: 'long', year: 'numeric' })
  }

  const safeData = data || []
  const list = safeData.length > 0 ? safeData.map(p => ({
    ...p,
    date: formatDate(p.date)
  })) : [
    {
      title: at("Expédition au coeur du Queyras"),
      excerpt: at("Retour sur une semaine de ski de randonnée entre crêtes sauvages et neige de cinéma..."),
      date: at("Mars 2026"),
      image: "/photos/DSC_6614.jpg",
      slug: "expedition-queyras"
    },
    {
      title: at("Les plus belles cascades de glace"),
      excerpt: at("Sélection des itinéraires incontournables pour s'initier ou se perfectionner cet hiver..."),
      date: at("Janvier 2026"),
      image: "/photos/DSC_6753.jpg",
      slug: "cascades-glace-top"
    },
    {
      title: at("Préparer sa saison d'alpinisme"),
      excerpt: at("Conseils d'expert pour l'entraînement physique et le choix du matériel avant l'été..."),
      date: at("Avril 2026"),
      image: "/images/alpinisme.jpg",
      slug: "prepa-alpinisme"
    }
  ]
  return (
    <section className={`py-24 px-6 transition-colors duration-300 ${className}`}>
      <div className="container mx-auto">
        <div className="flex justify-between items-end mb-16">
          <div>
            <span className="text-accent font-bold tracking-widest uppercase text-sm mb-4 block">{at(badge)}</span>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tighter uppercase">
              {at(title)} <br /> <span className="text-accent italic">{at(titleAccent)}</span>
            </h2>
          </div>
          <Link href="/blog" className="hidden md:block px-8 py-3 rounded-full border border-border hover:bg-foreground hover:text-background transition-all font-bold text-sm uppercase tracking-widest">
            {t('blog.viewAll')}
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {list.map((post, i) => (
            <Link key={i} href={`/blog/${post.slug}`} className="group block">
              <div className="relative aspect-[16/10] rounded-[32px] overflow-hidden mb-6 shadow-lg">
                {post.image && (
                  <Image
                    src={post.image}
                    alt={at(post.title)}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                )}
              </div>
              <p className="text-accent font-bold text-xs uppercase tracking-widest mb-3">{at(post.date)}</p>
              <h3 className="text-2xl font-bold mb-4 group-hover:text-accent transition-colors leading-tight">
                {at(post.title)}
              </h3>
              <p className="text-foreground/60 leading-relaxed line-clamp-2">
                {at(post.excerpt)}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export default BlogTeaser
