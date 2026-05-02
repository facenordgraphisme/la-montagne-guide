import React from 'react'
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import UpcomingSorties from "@/components/UpcomingSorties";
import Image from 'next/image';
import Link from 'next/link';

export default function SkiPage() {
  return (
    <main className="relative min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image 
            src="/images/ski.jpg"
            alt="Ski de Randonnée"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/50 bg-gradient-to-t from-background via-transparent to-black/20" />
        </div>
        <div className="container relative z-10 px-6 text-center">
          <span className="text-accent font-black tracking-[0.4em] uppercase text-xs mb-6 block">ÉVASION HIVERNALE</span>
          <h1 className="text-6xl md:text-9xl font-black tracking-tighter text-white uppercase mb-8">SKI</h1>
          <p className="text-xl md:text-2xl text-white/80 max-w-4xl mx-auto leading-relaxed font-medium">
            Tracez votre propre voie dans les plus beaux massifs alpins, loin des remontées mécaniques. <br className="hidden md:block" />
            Quitter l’agitation des stations pour le silence des sommets enneigés. Que vous souhaitiez vous initier au ski de randonnée ou perfectionner votre technique en freeride, je vous accompagne pour une immersion totale en haute montagne. Ensemble, nous choisirons l’itinéraire idéal selon les conditions de neige et vos envies de glisse.
          </p>

        </div>
      </section>

      {/* Key Points Section */}
      <section className="py-24 bg-accent/5">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { title: "Sécurité Neige", desc: "Formation constante sur l'utilisation du DVA, de la sonde et de la pelle." },
              { title: "Lecture du terrain", desc: "Apprendre à choisir le meilleur itinéraire en fonction des conditions nivologiques." },
              { title: "Plaisir de la glisse", desc: "Une recherche permanente de la neige de qualité pour des descentes inoubliables." }
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
            <span className="text-accent font-black tracking-widest uppercase text-xs mb-4 block">NOS UNIVERS SKI</span>
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase mb-6">De la première trace aux grands raids</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: "Initiation", desc: "Découvrez le matériel et les bases de la montée pour vos premières traces." },
              { title: "Sorties Journée", desc: "Parcourez les plus beaux vallons sauvages des Écrins et du Queyras." },
              { title: "Raids à skis", desc: "L'itinérance de refuge en refuge pour une immersion totale en haute montagne." },
              { title: "Ski de Pente Raide", desc: "Pour les skieurs confirmés souhaitant aborder les couloirs techniques." }
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
      <UpcomingSorties initialFilter="Ski" showFilters={false} />

      <Footer />
    </main>
  );
}
