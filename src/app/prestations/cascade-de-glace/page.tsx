import React from 'react'
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import UpcomingSorties from "@/components/UpcomingSorties";
import Image from 'next/image';
import Link from 'next/link';

export default function CascadeGlacePage() {
  return (
    <main className="relative min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image 
            src="/photos/DSC_6753.jpg"
            alt="Cascade de Glace"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/50 bg-gradient-to-t from-background via-transparent to-black/20" />
        </div>
        <div className="container relative z-10 px-6 text-center">
          <span className="text-accent font-black tracking-[0.4em] uppercase text-xs mb-6 block">LA MAGIE CRISTALLINE</span>
          <h1 className="text-6xl md:text-9xl font-black tracking-tighter text-white uppercase mb-8">CASCADE DE GLACE</h1>
          <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto leading-relaxed font-medium">
            Une activité envoûtante et accessible à tous. <br />
            Découvrez l'univers éphémère de la glace et apprenez à grimper sur ces structures de cristal uniques au monde.
          </p>
        </div>
      </section>

      {/* Key Points Section */}
      <section className="py-24 bg-accent/5">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { title: "Maniement technique", desc: "Apprentissage spécifique de l'ancrage des piolets traction et du cramponnage." },
              { title: "Lecture de la glace", desc: "Comprendre la formation de la glace pour choisir les meilleurs passages." },
              { title: "Ambiance Éphémère", desc: "Vivez une aventure unique au cœur de structures qui changent chaque jour." }
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
            <span className="text-accent font-black tracking-widest uppercase text-xs mb-4 block">NOS UNIVERS GLACE</span>
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase mb-6">De l'initiation aux grandes cascades</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { title: "Baptême & Initiation", desc: "Pour découvrir les sensations uniques de la grimpe sur glace en toute sécurité." },
              { title: "Perfectionnement Technique", desc: "Travaillez votre gestuelle et votre efficacité pour aborder des lignes plus raides." },
              { title: "Grandes Cascades", desc: "Vivez l'aventure sur des itinéraires de plusieurs longueurs dans des lieux mythiques." },
              { title: "Dry Tooling", desc: "L'art de grimper sur le rocher avec piolets et crampons pour une approche moderne." }
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
