import React from 'react'
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from 'next/link';
import { client } from "@/sanity/lib/client";
import { activitiesQuery } from "@/sanity/lib/queries";
import Image from 'next/image';

export default async function PrestationsPage() {
  const sanityActivities = await client.fetch(activitiesQuery);
  
  const fallback = [
    {
      title: 'Alpinisme',
      slug: 'alpinisme',
      description: 'De l\'initiation au perfectionnement sur les plus beaux sommets des Alpes.',
      price: 'À partir de 420€/jour',
      image: '/images/alpinisme.jpg'
    },
    {
      title: 'Ski de Randonnée & Hors-piste',
      slug: 'ski',
      description: 'Découvrez la montagne hivernale, loin de la foule des stations.',
      price: 'À partir de 420€/jour',
      image: '/images/ski.jpg'
    },
    {
      title: 'Escalade',
      slug: 'escalade',
      description: 'Grandes voies, falaises ou initiation, grimpez en toute sérénité.',
      price: 'À partir de 420€/jour',
      image: '/images/escalade.jpg'
    },
    {
      title: 'Cascade de glace',
      slug: 'cascade-de-glace',
      description: 'Une expérience éphémère et magique au cœur de l\'hiver.',
      price: 'Initiation dès 50€',
      image: '/photos/DSC_6753.jpg'
    },
    {
      title: 'Voyages lointains',
      slug: 'voyages',
      description: 'Maroc, Jordanie... grimpez sur les plus beaux calcaires du monde.',
      price: 'Sur devis',
      image: '/photos/P1050811.JPG'
    }
  ];

  const activities = sanityActivities?.length > 0 ? sanityActivities : fallback;
  return (
    <main className="relative pt-32 min-h-screen">
      <Navbar />
      <div className="container mx-auto px-6 py-20">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-4 text-gradient">NOS PRESTATIONS</h1>
        <p className="text-foreground/60 text-lg mb-16 max-w-2xl">
          Découvrez toutes les activités que je propose. Chaque sortie est encadrée avec passion et une sécurité absolue.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {activities.map((p: any) => (
            <Link href={`/prestations/${p.slug}`} key={p.slug} className="group glass rounded-[40px] overflow-hidden flex flex-col h-full hover:border-accent transition-all duration-500">
              <div className="h-64 overflow-hidden relative">
                <Image 
                  src={p.image || "/images/alpinisme.jpg"}
                  alt={p.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
              </div>
              <div className="p-8 flex flex-col flex-1">
                <h3 className="text-2xl font-bold mb-4 group-hover:text-accent transition-colors">
                  {p.title}
                </h3>
                <p className="text-foreground/70 mb-8 flex-1 leading-relaxed line-clamp-3">
                  {p.description}
                </p>

                <div className="flex items-center justify-between mt-auto">
                  <span className="font-bold text-highlight">{p.price}</span>
                  <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <Footer />
    </main>
  );
}
