import React from 'react'
import Image from 'next/image'

const features = [
  "Guide de haute montagne diplômé UIAGM",
  "Connaissance approfondie des Alpes",
  "Activités adaptées à tous les niveaux",
  "Encadrement en toute sécurité",
  "Groupes réduits pour une expérience personnalisée",
  "Partage de la culture et de l’environnement montagnard"
]

interface AdventureProps {
  badge?: string
  title?: string
  titleAccent?: string
  description?: string
  features?: string[]
  image?: string
}

const AdventureStart = ({
  badge = "VOTRE AVENTURE COMMENCE ICI",
  title = "UN ACCOMPAGNEMENT",
  titleAccent = "PROFESSIONNEL ET PASSIONNÉ",
  description = "Que ce soit pour gravir un sommet mythique, s'initier à l'escalade ou tracer dans la poudreuse, je vous accompagne dans vos projets les plus fous avec une expertise forgée par des années d'expédition.",
  features = [
    "Guide de haute montagne diplômé UIAGM",
    "Connaissance approfondie des Alpes",
    "Activités adaptées à tous les niveaux",
    "Encadrement en toute sécurité",
    "Groupes réduits pour une expérience personnalisée",
    "Partage de la culture et de l’environnement montagnard"
  ],
  image = "/photos/DSC_6758.jpg"
}: AdventureProps) => {
  return (
    <section className="py-24 px-6 bg-foreground text-background overflow-hidden transition-colors duration-300">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="order-2 lg:order-1">
            <span className="inline-block px-4 py-1.5 bg-highlight text-white text-[10px] font-black uppercase tracking-widest rounded-full mb-8">
              {badge}
            </span>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-8 leading-tight uppercase whitespace-pre-line">
              {title} <br /> <span className="text-accent italic">{titleAccent}</span>
            </h2>
            <p className="text-lg text-background/60 mb-12 max-w-xl leading-relaxed">
              {description}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(features || []).map((f, i) => (
                <div key={i} className="flex gap-3 items-start group">
                  <div className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center text-accent mt-1 transition-colors group-hover:bg-accent group-hover:text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-3 h-3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-background/80">{f}</p>
                </div>
              ))}
            </div>
          </div>
          
          <div className="order-1 lg:order-2 relative">
            <div className="aspect-[3/4] rounded-[60px] overflow-hidden shadow-2xl relative">
              <Image 
                src={image || "/photos/DSC_6758.jpg"} 
                alt="Montagne Aventure" 
                fill 
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-transparent to-transparent" />
            </div>
            {/* Abstract decorative elements */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-accent rounded-full blur-[100px] opacity-20" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-highlight rounded-full blur-[100px] opacity-20" />
          </div>
        </div>
      </div>
    </section>
  )
}

export default AdventureStart
