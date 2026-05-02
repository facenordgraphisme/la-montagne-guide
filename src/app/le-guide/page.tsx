import React from 'react'
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from 'next/image';

export default function GuidePage() {
  return (
    <main className="relative min-h-screen">
      <Navbar />

      {/* Header Section */}
      <section className="relative pt-48 pb-20 overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl">
            <span className="text-accent font-bold tracking-widest uppercase text-sm mb-4 block">Votre Guide</span>
            <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-8 text-gradient">
              NICOLAS <br /> DRAPERI
            </h1>
            <p className="text-xl text-foreground/60 leading-relaxed italic border-l-4 border-accent pl-8 py-2">
              "Laissez le rêve être votre guide."
            </p>
          </div>
        </div>
      </section>

      {/* Main Bio Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="relative aspect-[4/5] rounded-[60px] overflow-hidden shadow-2xl">
              <Image
                src="/images/guide.jpg"
                alt="Nicolas Draperi"
                fill
                className="object-cover"
              />
            </div>

            <div className="space-y-8 text-lg text-foreground/70 leading-relaxed">
              <h2 className="text-4xl font-bold text-foreground">Une passion née dans les Hautes-Alpes</h2>
              <p>
                Installé à Champcella, au pied du massif des Écrins et aux portes du Queyras, je vis ma passion pour la montagne au quotidien. En tant que Guide de Haute Montagne UIAGM, mon métier est avant tout une histoire de partage et de transmission.
              </p>
              <p>
                Ma philosophie repose sur une approche authentique et humaine de la montagne. Chaque cordée est unique, et ma priorité est de m'adapter à votre rythme, à vos envies et à vos capacités, tout en garantissant une sécurité absolue.
              </p>
              <p>
                Qu'il s'agisse de gravir une face nord technique, de tracer les premières courbes dans une combe sauvage ou de découvrir la magie cristalline d'une cascade de glace, je serai à vos côtés pour transformer vos rêves en souvenirs inoubliables.
              </p>

              <div className="pt-8 grid grid-cols-2 gap-8">
                <div className="glass p-6 rounded-3xl">
                  <p className="text-3xl font-bold text-highlight">UIAGM</p>
                  <p className="text-xs uppercase tracking-widest font-bold opacity-50">Certification Internationale</p>
                </div>
                <div className="glass p-6 rounded-3xl">
                  <p className="text-3xl font-bold text-highlight">15+</p>
                  <p className="text-xs uppercase tracking-widest font-bold opacity-50">Années d'expérience</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy / Values Section */}
      <section className="py-20 bg-accent/5">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Mes Valeurs</h2>
            <div className="w-20 h-1.5 bg-accent mx-auto rounded-full" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Sécurité", desc: "La base de toute aventure. Une analyse constante des conditions pour un plaisir serein." },
              { title: "Adaptabilité", desc: "La montagne impose son rythme, je m'adapte pour que votre expérience soit optimale." },
              { title: "Pédagogie", desc: "Plus qu'un guide, je suis là pour vous apprendre à devenir autonome en montagne." }
            ].map((v) => (
              <div key={v.title} className="glass p-10 rounded-[40px] hover:border-accent transition-colors">
                <h3 className="text-2xl font-bold mb-4 text-accent">{v.title}</h3>
                <p className="text-foreground/60">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
