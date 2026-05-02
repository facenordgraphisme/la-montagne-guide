import React from 'react'
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import UpcomingSorties from "@/components/UpcomingSorties";
import Image from 'next/image';
import Link from 'next/link';

export default function AlpinismePage() {
  return (
    <main className="relative min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image 
            src="/images/alpinisme.jpg"
            alt="Alpinisme"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/50 bg-gradient-to-t from-background via-transparent to-black/20" />
        </div>
        <div className="container relative z-10 px-6 text-center">
          <span className="text-accent font-black tracking-[0.4em] uppercase text-xs mb-6 block">L'Esprit de Cordée</span>
          <h1 className="text-6xl md:text-9xl font-black tracking-tighter text-white uppercase mb-8">ALPINISME</h1>
          <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto leading-relaxed font-medium">
            L’alpinisme est l’art de parcourir les montagnes dans ce qu’elles ont de plus sauvage. Entre roche, neige et glace, je vous guide vers les sommets emblématiques des Alpes pour une immersion totale.
          </p>
        </div>
      </section>

      {/* Key Points Section */}
      <section className="py-24 bg-accent/5">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { title: "Pédagogie active", desc: "Apprentissage des techniques de cramponnage et d'assurage à chaque sortie." },
              { title: "Sécurité & Engagement", desc: "Une gestion rigoureuse des risques pour une progression sereine en haute altitude." },
              { title: "Partage d'expérience", desc: "Découvrez l'histoire de l'alpinisme et la géologie des massifs parcourus." }
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
            <span className="text-accent font-black tracking-widest uppercase text-xs mb-4 block">NOS UNIVERS ALPINISME</span>
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase mb-6">Une progression structurée vers les sommets</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Initiation", desc: "Pour découvrir l’univers de la haute montagne et les techniques de base de progression." },
              { title: "« À la carte »", desc: "Un projet précis ? Une envie particulière ? Créons ensemble votre itinéraire sur mesure." },
              { title: "Stages", desc: "Plusieurs jours en immersion pour approfondir vos connaissances et gagner en autonomie." },
              { title: "Randonnée glaciaire", desc: "La magie des glaciers accessible, pour contempler l’immensité sans difficulté technique majeure." },
              { title: "Écoles de glace", desc: "Apprentissage spécifique du cramponnage et de l’évolution sur le « verre » des glaciers." },
              { title: "Courses de légende", desc: "Meije, Écrins, Mont-Blanc… relevez le défi des grands sommets historiques." }
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
