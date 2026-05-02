import React from 'react'
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import UpcomingSorties from "@/components/UpcomingSorties";
import Image from 'next/image';
import Link from 'next/link';

export default function VoyagesPage() {
  return (
    <main className="relative min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image 
            src="/photos/2017-06-15 12.01.27.jpg"
            alt="Voyages d'Aventure"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/50 bg-gradient-to-t from-background via-transparent to-black/20" />
        </div>
        <div className="container relative z-10 px-6 text-center">
          <span className="text-accent font-black tracking-[0.4em] uppercase text-xs mb-6 block">EXPLORATION DU MONDE</span>
          <h1 className="text-6xl md:text-9xl font-black tracking-tighter text-white uppercase mb-8">VOYAGES</h1>
          <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto leading-relaxed font-medium">
            L'Aventure au-delà des Frontières. <br />
            Découvrez les plus beaux massifs du monde. Je vous accompagne dans des expéditions sur mesure pour vivre la montagne à l'international.
          </p>
        </div>
      </section>

      {/* Key Points Section */}
      <section className="py-24 bg-accent/5">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { title: "Logistique Expédition", desc: "Une organisation rigoureuse pour des voyages fluides et sécurisés à l'étranger." },
              { title: "Culture & Partage", desc: "Plus qu'un sommet, une rencontre avec des peuples et des cultures d'altitude." },
              { title: "Dépaysement Total", desc: "L'immersion dans des massifs sauvages et préservés aux quatre coins du globe." }
            ].map((point, i) => (
              <div key={i} className="glass p-10 rounded-[40px] text-center">
                <h3 className="text-xl font-bold mb-4 text-accent uppercase tracking-widest">{point.title}</h3>
                <p className="text-foreground/70 leading-relaxed">{point.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Univers Section */}
      <section className="py-24 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-20">
            <span className="text-accent font-black tracking-widest uppercase text-xs mb-4 block">NOS UNIVERS VOYAGES</span>
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase mb-6">L'aventure sans limites</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Treks techniques", desc: "Des traversées d'exception nécessitant parfois l'usage des techniques de l'alpinisme." },
              { title: "Sommets lointains", desc: "L'ascension de sommets mythiques sur d'autres continents (Népal, Andes, Caucase)." },
              { title: "Ski d'expédition", desc: "Découvrir de nouveaux horizons skis aux pieds, du Groenland à la Turquie." }
            ].map((univ, i) => (
              <div key={i} className="group p-8 rounded-[40px] border border-border hover:border-accent transition-all hover:bg-accent/5">
                <h3 className="text-2xl font-bold mb-4 group-hover:text-accent transition-colors">{univ.title}</h3>
                <p className="text-foreground/60 leading-relaxed">{univ.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Sorties Section */}
      <UpcomingSorties initialFilter="Tout voir" showFilters={false} />

      <Footer />
    </main>
  );
}
