import React from 'react'
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from 'next/image';
import Link from 'next/link';
import { client } from "@/sanity/lib/client";
import { activityBySlugQuery, activitiesQuery } from "@/sanity/lib/queries";
import { notFound } from 'next/navigation';

import UpcomingSorties from "@/components/UpcomingSorties";
import { PortableText } from '@portabletext/react';

export async function generateStaticParams() {
  const activities = await client.fetch(activitiesQuery);
  return activities.map((activity: any) => ({
    slug: activity.slug,
  }));
}

const prestationsFallback: Record<string, any> = {
  'alpinisme': {
    title: "Alpinisme",
    subtitle: "L'Esprit de Cordée",
    intro: "L’alpinisme est l’art de parcourir les montagnes dans ce qu’elles ont de plus sauvage. Entre roche, neige et glace, je vous guide vers les sommets emblématiques des Alpes pour une immersion totale.",
    description: "De l'initiation aux sommets de légende, l'alpinisme est l'essence même de la montagne. Entre pédagogie active et découverte historique, chaque ascension est une aventure humaine unique.",
    image: "/photos/DSC_0150.jpg",
    details: [
      "Apprentissage du cramponnage et de l'assurage",
      "Ascensions de sommets emblématiques (Écrins, Queyras)",
      "Approche historique et culturelle des massifs",
      "Groupes restreints pour une sécurité maximale"
    ],
    price: "420€ / jour (engagement)",
    period: "Saisonnière",
    location: "Alpes & International"
  },
  'ski': {
    title: "Ski de Randonnée",
    subtitle: "Évasion Hivernale",
    description: "Liberté totale loin des remontées mécaniques. Découvrez la montagne hivernale dans son état le plus sauvage, à la recherche de la meilleure neige et de paysages immaculés.",
    image: "/photos/P1060965.JPG",
    details: [
      "Initiation à la sécurité (DVA, sonde, pelle)",
      "Techniques de montée en peaux de phoque",
      "Choix d'itinéraires adaptés au niveau",
      "Raids à skis de plusieurs jours"
    ],
    price: "420€ / jour (engagement)",
    period: "Hiver / Printemps",
    location: "Alpes & International"
  },
  'escalade': {
    title: "Escalade",
    subtitle: "Verticalité Pure",
    description: "Des falaises ensoleillées de la vallée aux grandes parois granitiques d'altitude. L'escalade est un jeu d'équilibre et de confiance en soi au cœur du rocher.",
    image: "/photos/P1050811.JPG",
    details: [
      "Analyse gestuelle et technique de pied",
      "Apprentissage des manœuvres de cordée",
      "Grandes voies mythiques des Hautes-Alpes",
      "Stage de perfectionnement en falaise"
    ],
    price: "420€ / jour (engagement)",
    period: "Toute l'année",
    location: "Alpes & Provence"
  },
  'cascade-de-glace': {
    title: "Cascade de Glace",
    subtitle: "La Magie Cristalline",
    description: "Une activité envoûtante et accessible à tous. Découvrez l'univers éphémère de la glace et apprenez à grimper sur ces structures de cristal uniques au monde.",
    image: "/photos/DSC_6753.jpg",
    details: [
      "Maniement des piolets traction",
      "Techniques de cramponnage en glace",
      "Lecture de la glace et sécurité",
      "Initiation en petit groupe (max 4)"
    ],
    price: "Initiation dès 50€ / pers.",
    period: "Janvier / Février",
    location: "Hautes-Alpes"
  }
}

export default async function PrestationDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const sanityData = await client.fetch(activityBySlugQuery, { slug });
  const data = sanityData || prestationsFallback[slug];
  const { at, t } = await getServerTranslations();

  if (!data) notFound();

  return (
    <main className="relative min-h-screen">
      
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image 
            src={data.image || "/images/alpinisme.jpg"}
            alt={at(data.title)}
            fill
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/50 bg-gradient-to-t from-background via-transparent to-black/20" />
        </div>
        <div className="container relative z-10 px-6 text-center pt-20">
          <span className="text-accent font-black tracking-[0.4em] uppercase text-xs mb-6 block">{at(data.subtitle)}</span>
          <h1 className="text-6xl md:text-9xl font-black tracking-tighter text-white uppercase mb-8">{at(data.title)}</h1>
          {data.intro && (
            <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto leading-relaxed font-medium whitespace-pre-line">
              {at(data.intro)}
            </p>
          )}
        </div>
      </section>

      {/* Key Points Section */}
      {data.keyPoints && data.keyPoints.length > 0 && (
        <section className="py-20 bg-accent/5">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {data.keyPoints.map((point: any, i: number) => (
                <div key={i} className="glass p-10 rounded-[40px] text-center">
                  <h3 className="text-xl font-bold mb-4 text-accent uppercase tracking-widest">{point.title}</h3>
                  <p className="text-foreground/70 leading-relaxed">{point.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Content Section */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-20">
            <div className="lg:col-span-2 space-y-12">
              <div>
                <h2 className="text-3xl font-bold mb-6">Présentation</h2>
                <p className="text-xl text-foreground/70 leading-relaxed whitespace-pre-line">{data.description}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {(data.details || []).map((detail: string, i: number) => (
                  <div key={i} className="flex gap-4 items-start">
                    <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center text-accent mt-1 flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-3 h-3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    </div>
                    <p className="text-foreground/80 font-medium">{detail}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="glass p-10 rounded-[40px] sticky top-32">
                <h3 className="text-2xl font-bold mb-6">Informations</h3>
                <div className="space-y-6 mb-10">
                  <div className="flex justify-between items-center py-4 border-b border-white/10">
                    <span className="text-foreground/40 font-bold uppercase tracking-widest text-xs">Tarif</span>
                    <span className="text-xl font-bold text-highlight">{data.price}</span>
                  </div>
                  <div className="flex justify-between items-center py-4 border-b border-white/10">
                    <span className="text-foreground/40 font-bold uppercase tracking-widest text-xs">Période</span>
                    <span className="font-bold text-white">{data.period || "Saisonnière"}</span>
                  </div>
                  <div className="flex justify-between items-center py-4 border-b border-white/10">
                    <span className="text-foreground/40 font-bold uppercase tracking-widest text-xs">Lieu</span>
                    <span className="font-bold text-white">{data.location || "Alpes & International"}</span>
                  </div>
                </div>
                <Link href="/contact" className="btn-primary w-full block text-center !text-white">Réserver mon aventure</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Univers Section */}
      {data.univers && data.univers.length > 0 && (
        <section className="py-24 bg-accent/5">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16 max-w-3xl mx-auto">
              <span className="text-accent font-black tracking-widest uppercase text-xs mb-4 block">{data.universBadge || "NOS UNIVERS"}</span>
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase mb-6">{data.universTitle || "Une progression adaptée à vos envies"}</h2>
              {data.universDescription && (
                <p className="text-lg text-foreground/60 leading-relaxed">
                  {data.universDescription}
                </p>
              )}
            </div>
            <div className={`grid grid-cols-1 md:grid-cols-2 ${data.univers.length > 4 ? 'lg:grid-cols-3' : 'lg:grid-cols-2'} gap-8`}>
              {data.univers.map((univ: any, i: number) => (
                <div key={i} className="group p-8 rounded-[40px] border border-border hover:border-accent transition-all hover:bg-accent/5">
                  <h3 className="text-2xl font-bold mb-4 group-hover:text-accent transition-colors">{univ.title}</h3>
                  <div className="text-foreground/60 leading-relaxed prose-p:mb-0">
                    <PortableText value={univ.description} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Upcoming Sorties Section */}
      {data.showUpcomingSorties !== false && (
        <UpcomingSorties 
          initialFilter={data.title} 
          showFilters={false} 
        />
      )}

      <Footer />
    </main>
  );
}
