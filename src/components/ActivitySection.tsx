'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'

const activities = [
  {
    title: 'Alpinisme',
    slug: 'alpinisme',
    description: 'Sommets mythiques, arêtes effilées et glaciers majestueux. Découvrez la haute montagne.',
    image: '/images/alpinisme.jpg',
  },
  {
    title: 'Ski',
    slug: 'ski',
    description: 'Ski de randonnée, freeride ou hors-piste. Tracez votre propre voie dans la poudreuse.',
    image: '/images/ski.jpg',
  },

  {
    title: 'Escalade',
    slug: 'escalade',
    description: 'Verticalité et sensations. Des falaises ensoleillées aux grandes voies calcaires.',
    image: '/images/escalade.jpg',
  },
  {
    title: 'Cascade de Glace',
    slug: 'cascade-de-glace',
    description: 'La magie cristalline des éphémères. Grimpez sur des structures de glace uniques.',
    image: '/photos/DSC_6753.jpg',
  },
  {
    title: 'Paralpinisme',
    slug: 'paralpinisme',
    description: 'Entre ciel et terre. Gravissez les sommets pour vous envoler en parapente.',
    image: '/photos/DSC_6701.jpg',
  },
  {
    title: 'Voyages',
    slug: 'voyages',
    description: 'L\'aventure au-delà des frontières. Expéditions sur mesure dans les plus beaux massifs du monde.',
    image: '/photos/2017-06-15 12.01.27.jpg',
  }
]


interface ActivitySectionProps {
  title?: string
  titleAccent?: string
  description?: string
  data?: any[]
}

const ActivitySection = ({
  title = "VOS PROCHAINES",
  titleAccent = "AVENTURES",
  description = "Que vous soyez débutant ou expert, chaque sortie est conçue pour vous offrir une expérience unique, sécurisée et inoubliable.",
  data = []
}: ActivitySectionProps) => {
  const safeData = data?.length > 0 ? data : activities;
  return (
    <section id="activites" className="py-24 px-6 bg-background transition-colors duration-300">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-8">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-6 uppercase">
              {title} <br /> <span className="text-accent italic">{titleAccent}</span>
            </h2>
            <p className="text-foreground/60 text-lg">
              {description}
            </p>
          </div>
          <button className="text-sm font-bold tracking-widest uppercase border-b border-accent pb-1 text-foreground/60 hover:text-accent transition-colors">
            Voir tout
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {safeData.map((activity, index) => (
            <Link 
              key={activity.title} 
              href={`/prestations/${activity.slug}`}
              className="block"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="group relative h-[500px] rounded-3xl overflow-hidden cursor-pointer"
              >
                <Image 
                  src={activity.image || "/images/alpinisme.jpg"}
                  alt={activity.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                
                <div className="absolute inset-0 p-8 flex flex-col justify-end text-white">
                  <h3 className="text-2xl font-bold mb-2 group-hover:text-accent transition-colors">
                    {activity.title}
                  </h3>
                  <p className="text-sm text-white/80 line-clamp-2 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    {activity.description}
                  </p>
                  <div className="mt-6 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-accent transition-colors text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                    </svg>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}

        </div>
      </div>
    </section>
  )
}

export default ActivitySection
