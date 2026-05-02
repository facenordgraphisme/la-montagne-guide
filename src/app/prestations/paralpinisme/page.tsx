import React from 'react'
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import UpcomingSorties from "@/components/UpcomingSorties";
import Image from 'next/image';
import Link from 'next/link';

export default function ParalpinismePage() {
  return (
    <main className="relative min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image 
            src="/photos/DSC_6701.jpg"
            alt="Paralpinisme"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/50 bg-gradient-to-t from-background via-transparent to-black/20" />
        </div>
        <div className="container relative z-10 px-6 text-center">
          <span className="text-accent font-black tracking-[0.4em] uppercase text-xs mb-6 block">ENTRE CIEL ET TERRE</span>
          <h1 className="text-6xl md:text-9xl font-black tracking-tighter text-white uppercase mb-8">PARALPINISME</h1>
          <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto leading-relaxed font-medium">
            Prendre de la hauteur, littéralement. <br />
            Le paralpinisme est l'art de gravir un sommet pour s'en envoler en parapente. Une discipline d'exception pour ceux qui cherchent la liberté absolue.
          </p>
        </div>
      </section>

      {/* Key Points Section */}
      <section className="py-24 bg-accent/5">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { title: "Analyse Aérologique", desc: "Comprendre les masses d'air pour un décollage et un vol en toute sécurité." },
              { title: "Techniques de Décollage", desc: "Maîtriser le décollage en terrain varié, parfois technique et engagé." },
              { title: "Compromis Poids/Sécurité", desc: "Optimiser son matériel pour la montée sans sacrifier la sécurité en vol." }
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
            <span className="text-accent font-black tracking-widest uppercase text-xs mb-4 block">NOS UNIVERS PARALPINISME</span>
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase mb-6">L'envolée sauvage</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Initiation Vol Rando", desc: "Vos premiers sommets et vos premiers vols en montagne en toute sérénité." },
              { title: "Grands Sommets", desc: "L'ascension de sommets mythiques suivie d'une descente magique par les airs." },
              { title: "Progression Technique", desc: "Améliorez votre lecture du terrain et votre pilotage en conditions de montagne." }
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
      <UpcomingSorties initialFilter="Alpinisme" showFilters={false} />

      <Footer />
    </main>
  );
}
