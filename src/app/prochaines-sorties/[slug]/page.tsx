import React from 'react'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { client } from "@/sanity/lib/client";
import { sortieBySlugQuery } from "@/sanity/lib/queries";
import { Calendar, MapPin, Clock, Euro, Users, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface SortiePageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: SortiePageProps): Promise<Metadata> {
  const { slug } = await params
  const sortie = await client.fetch(sortieBySlugQuery, { slug })

  if (!sortie) {
    return {
      title: 'Sortie non trouvée',
    }
  }

  return {
    title: `${sortie.title} | La Montagne Guide`,
    description: sortie.description,
  }
}

export default async function SortieDetailPage({ params }: SortiePageProps) {
  const { slug } = await params
  const sortie = await client.fetch(sortieBySlugQuery, { slug })

  if (!sortie) {
    notFound()
  }

  return (
    <main className="relative min-h-screen pb-20">
      
      {/* Hero Section */}
      <section className="relative h-[70vh] w-full overflow-hidden">
        <Image
          src={sortie.image}
          alt={sortie.title}
          fill
          sizes="100vw"
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
        
        <div className="absolute inset-0 flex flex-col justify-end container mx-auto px-6 pb-12">
          <Link 
            href="/prochaines-sorties" 
            className="flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-8 group w-fit"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-bold uppercase tracking-widest">Retour aux sorties</span>
          </Link>
          
          <div className="max-w-4xl">
            <span className="px-4 py-1.5 bg-accent text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg mb-6 inline-block">
              {sortie.activityType}
            </span>
            <h1 className="text-5xl md:text-8xl font-bold tracking-tighter text-white uppercase leading-[0.9]">
              {sortie.title}
            </h1>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="container mx-auto px-6 -mt-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            <div className="glass p-8 md:p-12 rounded-[40px] space-y-8">
              <h2 className="text-3xl font-bold">Présentation de l'aventure</h2>
              <p className="text-foreground/70 text-xl leading-relaxed whitespace-pre-line">
                {sortie.description || "Aucune description disponible pour le moment."}
              </p>
            </div>
            
            <div className="glass p-8 md:p-12 rounded-[40px] space-y-8 bg-accent/5 border-accent/10">
              <h2 className="text-3xl font-bold">Informations Pratiques</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-accent/20 flex items-center justify-center shrink-0">
                    <Calendar className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm text-foreground/40 font-bold uppercase tracking-widest">Date / Période</p>
                    <p className="text-lg font-bold">{sortie.date}</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-accent/20 flex items-center justify-center shrink-0">
                    <MapPin className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm text-foreground/40 font-bold uppercase tracking-widest">Lieu</p>
                    <p className="text-lg font-bold">{sortie.location || "À définir"}</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-accent/20 flex items-center justify-center shrink-0">
                    <Clock className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm text-foreground/40 font-bold uppercase tracking-widest">Durée</p>
                    <p className="text-lg font-bold">{sortie.duration || "Non spécifiée"}</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-accent/20 flex items-center justify-center shrink-0">
                    <Euro className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm text-foreground/40 font-bold uppercase tracking-widest">Budget estimé</p>
                    <p className="text-lg font-bold">{sortie.price || "Sur devis"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar / CTA */}
          <div className="lg:col-span-1">
            <div className="sticky top-32 glass p-8 md:p-10 rounded-[40px] space-y-8 border-2 border-accent/20">
              <div className="space-y-2">
                <p className="text-sm text-foreground/40 font-bold uppercase tracking-widest">Statut</p>
                {sortie.isFull ? (
                  <span className="flex items-center gap-2 text-red-500 font-bold">
                    <Users className="w-5 h-5" />
                    GROUPE COMPLET
                  </span>
                ) : (
                  <span className="flex items-center gap-2 text-green-500 font-bold">
                    <Users className="w-5 h-5" />
                    PLACES DISPONIBLES
                  </span>
                )}
              </div>
              
              <div className="space-y-4">
                <h3 className="text-2xl font-bold">Intéressé par cette sortie ?</h3>
                <p className="text-foreground/60">
                  Contactez-moi pour obtenir le programme détaillé et valider votre participation.
                </p>
              </div>

              <Link 
                href="/contact" 
                className={`btn-primary w-full text-center py-6 rounded-2xl font-bold uppercase tracking-widest transition-all ${sortie.isFull ? 'opacity-50 cursor-not-allowed grayscale' : ''}`}
              >
                {sortie.isFull ? "S'inscrire en liste d'attente" : "Demander le programme"}
              </Link>
              
              <p className="text-[10px] text-center text-foreground/30 uppercase tracking-widest font-bold">
                Engagement sans obligation d'achat
              </p>
            </div>
          </div>

        </div>
      </section>

    </main>
  )
}
