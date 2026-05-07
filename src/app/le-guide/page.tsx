import React from 'react'
import Image from 'next/image';
import { client } from "@/sanity/lib/client";
import { guideQuery } from "@/sanity/lib/queries";
import { PortableText } from "@portabletext/react";

import { getServerTranslations } from '@/i18n/server';

export default async function GuidePage() {
  const data = await client.fetch(guideQuery);
  const { at, t, translatePortableText } = await getServerTranslations();

  const fallback = {
    badge: at("Votre Guide"),
    titleNormal: at("NICOLAS"),
    titleAccent: at("DRAPERI"),
    quote: at("Laissez le rêve être votre guide."),
    image: "/images/guide.jpg",
    bioTitle: at("Une passion née dans les Hautes-Alpes"),
    certification: "UIAGM",
    certificationSub: at("Certification Internationale"),
    experience: "15+",
    experienceSub: at("Années d'expérience"),
    values: [
      { title: at("Sécurité"), description: at("La base de toute aventure. Une analyse constante des conditions pour un plaisir serein.") },
      { title: at("Adaptabilité"), description: at("La montagne impose son rythme, je m'adapte pour que votre expérience soit optimale.") },
      { title: at("Pédagogie"), description: at("Plus qu'un guide, je suis là pour vous apprendre à devenir autonome en montagne.") }
    ]
  };

  const guide = data || fallback;
  return (
    <main className="relative min-h-screen">

      {/* Header Section */}
      <section className="relative pt-48 pb-20 overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl">
            <span className="text-accent font-bold tracking-widest uppercase text-sm mb-4 block">{at(guide.badge)}</span>
            <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-8 text-gradient uppercase">
              {at(guide.titleNormal)} <br /> {at(guide.titleAccent)}
            </h1>
            <p className="text-xl text-foreground/60 leading-relaxed italic border-l-4 border-accent pl-8 py-2">
              "{at(guide.quote)}"
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
                src={guide.image || "/images/guide.jpg"}
                alt="Nicolas Draperi"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>

            <div className="space-y-8 text-lg text-foreground/70 leading-relaxed">
              <h2 className="text-4xl font-bold text-foreground">{at(guide.bioTitle)}</h2>
              <div className="prose prose-invert prose-lg max-w-none text-foreground/70">
                {guide.bio ? (
                  <PortableText value={translatePortableText(guide.bio)} />
                ) : (
                  <>
                    <p>
                      {at('Installé à Champcella, au pied du massif des Écrins et aux portes du Queyras, je vis ma passion pour la montagne au quotidien. En tant que Guide de Haute Montagne UIAGM, mon métier est avant tout une histoire de partage et de transmission.')}
                    </p>
                    <p>
                      {at('Ma philosophie repose sur une approche authentique et humaine de la montagne. Chaque cordée est unique, et ma priorité est de m\'adapter à votre rythme, à vos envies et à vos capacités, tout en garantissant une sécurité absolue.')}
                    </p>
                  </>
                )}
              </div>

              <div className="pt-8 grid grid-cols-2 gap-8">
                <div className="glass p-6 rounded-3xl">
                  <p className="text-3xl font-bold text-highlight">{at(guide.certification)}</p>
                  <p className="text-xs uppercase tracking-widest font-bold opacity-50">{at(guide.certificationSub)}</p>
                </div>
                <div className="glass p-6 rounded-3xl">
                  <p className="text-3xl font-bold text-highlight">{at(guide.experience)}</p>
                  <p className="text-xs uppercase tracking-widest font-bold opacity-50">{at(guide.experienceSub)}</p>
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
            <h2 className="text-4xl font-bold mb-4">{at('Mes Valeurs')}</h2>
            <div className="w-20 h-1.5 bg-accent mx-auto rounded-full" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {(guide.values || []).map((v: any, index: number) => (
              <div key={index} className="glass p-10 rounded-[40px] hover:border-accent transition-colors">
                <h3 className="text-2xl font-bold mb-4 text-accent">{at(v.title)}</h3>
                <p className="text-foreground/60">{at(v.description)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </main>
  );
}
