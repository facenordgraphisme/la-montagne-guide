import React from 'react'
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { client } from "@/sanity/lib/client";
import { sortiesQuery } from "@/sanity/lib/queries";
import SortiesFilterableList from "@/components/SortiesFilterableList";

export const metadata = {
  title: 'Prochaines Sorties | La Montagne Guide',
  description: 'Rejoignez-moi pour des aventures d\'exception aux quatre coins du monde. Alpinisme, escalade, ski et voyages.',
}

export default async function SortiesPage() {
  const sorties = await client.fetch(sortiesQuery);

  return (
    <main className="relative pt-32 min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-6 py-20">
        <div className="max-w-4xl mb-20">
          <span className="text-accent font-bold tracking-widest uppercase text-sm mb-4 block">Calendrier</span>
          <h1 className="text-5xl md:text-8xl font-bold tracking-tighter mb-6 text-gradient uppercase leading-[0.9]">
            PROCHAINS <br /> DÉPARTS
          </h1>
          <p className="text-foreground/60 text-xl max-w-2xl leading-relaxed">
            Une sélection d'aventures verticales et de voyages au long cours. Chaque sortie est encadrée personnellement pour garantir sécurité et immersion.
          </p>
        </div>
        
        <SortiesFilterableList initialSorties={sorties} />
      </div>
      <Footer />
    </main>
  );
}
