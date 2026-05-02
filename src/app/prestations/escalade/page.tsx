import React from 'react'
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import UpcomingSorties from "@/components/UpcomingSorties";
import Image from 'next/image';
import Link from 'next/link';

export default function EscaladePage() {
  return (
    <main className="relative min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image 
            src="/images/escalade.jpg"
            alt="Escalade"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/50 bg-gradient-to-t from-background via-transparent to-black/20" />
        </div>
        <div className="container relative z-10 px-6 text-center">
          <span className="text-accent font-black tracking-[0.4em] uppercase text-xs mb-6 block">VERTICALITÉ PURE</span>
          <h1 className="text-6xl md:text-9xl font-black tracking-tighter text-white uppercase mb-8">ESCALADE</h1>
          <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto leading-relaxed font-medium">
            Des falaises de la vallée aux grandes parois granitiques. <br />
            L’escalade est un jeu d’équilibre, de mental et de contact avec le rocher. Je vous accompagne pour franchir vos propres paliers techniques et découvrir les plus beaux spots de la région.
          </p>
        </div>
      </section>

      {/* Key Points Section */}
      <section className="py-24 bg-accent/5">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { title: "Analyse Gestuelle", desc: "Conseils personnalisés pour améliorer votre fluidité et votre efficacité sur le rocher." },
              { title: "Confiance & Sérénité", desc: "Un cadre sécurisant pour appréhender le vide et progresser à votre rythme." },
              { title: "Sites d'exception", desc: "Accès aux plus belles falaises, sélectionnées selon l'ensoleillement et votre niveau." }
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
            <span className="text-accent font-black tracking-widest uppercase text-xs mb-4 block">NOS UNIVERS ESCALADE</span>
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase mb-6">La roche dans tous ses états</h2>
            <p className="text-foreground/60 text-lg max-w-2xl mx-auto">
              Que ce soit pour une initiation en famille ou une ascension technique de plusieurs centaines de mètres, trouvez la formule qui vous correspond.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { title: "Initiation & École d'escalade", desc: "Apprentissage du matériel, de la gestuelle de base et des règles de sécurité indispensables en falaise." },
              { title: "Stages Perfectionnement", desc: "Travail spécifique sur le niveau technique, la manipulation de cordes et l’autonomie en tête." },
              { title: "Escalade Enfants & Familles", desc: "Une approche ludique et pédagogique pour découvrir la verticalité dès le plus âge." },
              { title: "Grandes Voies", desc: "Prenez de la hauteur sur des itinéraires de plusieurs longueurs pour vivre l’ambiance des grandes parois." }
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
      <UpcomingSorties initialFilter="Escalade" showFilters={false} />

      <Footer />
    </main>
  );
}
