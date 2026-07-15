import type { Metadata } from 'next';
import React from 'react'
import Image from 'next/image';
import Link from 'next/link';
import { client } from "@/sanity/lib/client";
import { guideQuery, settingsQuery } from "@/sanity/lib/queries";
import { PortableText } from "@portabletext/react";
import PartnersSlider from "@/components/PartnersSlider";
import { urlFor } from "@/sanity/lib/image";
import FAQAccordion from "@/components/FAQAccordion";

import { getServerTranslations } from '@/i18n/server';

const blockAlignComponents = {
  block: {
    normal: ({ children }: any) => {
      const isEmpty = !children || children.length === 0 || (children.length === 1 && children[0] === '');
      return <p style={{ minHeight: isEmpty ? '1.5em' : undefined }}>{isEmpty ? '\u00a0' : children}</p>;
    },
    blockCenter: ({ children }: any) => {
      const isEmpty = !children || children.length === 0 || (children.length === 1 && children[0] === '');
      return <p style={{ textAlign: 'center', minHeight: isEmpty ? '1.5em' : undefined }}>{isEmpty ? '\u00a0' : children}</p>;
    },
    blockRight: ({ children }: any) => {
      const isEmpty = !children || children.length === 0 || (children.length === 1 && children[0] === '');
      return <p style={{ textAlign: 'right', minHeight: isEmpty ? '1.5em' : undefined }}>{isEmpty ? '\u00a0' : children}</p>;
    },
    blockJustify: ({ children }: any) => {
      const isEmpty = !children || children.length === 0 || (children.length === 1 && children[0] === '');
      return <p style={{ textAlign: 'justify', minHeight: isEmpty ? '1.5em' : undefined }}>{isEmpty ? '\u00a0' : children}</p>;
    },
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-4 border-accent pl-6 py-4 my-8 italic text-xl text-foreground/80 bg-accent/5 rounded-r-2xl text-justify">
        {children}
      </blockquote>
    ),
  }
};

export async function generateMetadata(): Promise<Metadata> {
  const [data, settingsData] = await Promise.all([
    client.fetch(guideQuery),
    client.fetch(settingsQuery)
  ]);
  const { at } = await getServerTranslations();

  const title = `${at(data?.titleNormal || 'Nicolas')} ${at(data?.titleAccent || 'Draperi')} - Guide UIAGM | La Montagne Guide`;
  const description = data?.quote ? `"${at(data.quote)}" — Nicolas Draperi, guide de haute montagne.` : "Nicolas Draperi, guide de haute montagne certifié UIAGM. Découvrez mon parcours, ma philosophie et mes valeurs.";

  return {
    title,
    description,
  };
}

export default async function GuidePage() {
  const [data, settingsData] = await Promise.all([
    client.fetch(guideQuery),
    client.fetch(settingsQuery)
  ]);
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
      { title: at("Adaptabilité"), description: at("La montagne impose son rythme, je m'adaptte pour que votre expérience soit optimale.") },
      { title: at("Pédagogie"), description: at("Plus qu'un guide, je suis là pour vous apprendre à devenir autonome en montagne.") }
    ],
    sections: []
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

      {/* Main Bio Sections */}
      {guide.sections && guide.sections.length > 0 ? (
        guide.sections.map((sect: any, idx: number) => {
          const isImageLeft = sect.imagePosition === 'left';
          return (
            <section key={idx} className={`py-20 ${idx % 2 === 0 ? '' : 'bg-surface/30'}`}>
              <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                  {/* Image Column */}
                  <div className={`relative aspect-[4/5] rounded-[60px] overflow-hidden shadow-2xl ${isImageLeft ? '' : 'lg:order-last'}`}>
                    {sect.image ? (
                      <Image
                        src={urlFor(sect.image).url()}
                        alt={sect.title || "Nicolas Draperi"}
                        fill
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-accent/10 flex items-center justify-center">
                        <span className="text-foreground/30">Pas d'image</span>
                      </div>
                    )}
                  </div>

                  {/* Text Column */}
                  <div className="space-y-8 text-lg text-foreground/70 leading-relaxed">
                    {sect.title && (
                      <h2 className="text-4xl font-bold text-foreground">{at(sect.title)}</h2>
                    )}
                    <div className="prose prose-invert prose-lg max-w-none text-foreground/70">
                      {sect.content && (
                        <PortableText value={translatePortableText(sect.content)} components={blockAlignComponents} />
                      )}
                    </div>
                    {idx === guide.sections.length - 1 && (
                      <div className="pt-6">
                        <Link href="/contact" className="btn-primary inline-block">
                          {at('Contactez-moi')}
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>
          );
        })
      ) : (
        /* Fallback section */
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
                    <PortableText value={translatePortableText(guide.bio)} components={blockAlignComponents} />
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
                <div className="pt-6">
                  <Link href="/contact" className="btn-primary inline-block">
                    {at('Contactez-moi')}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Stats Banner */}
      {!guide.hideStats && (
        <section className="py-12 border-y border-border/10 bg-surface/20">
          <div className="container mx-auto px-6 max-w-4xl">
            <div className="grid grid-cols-2 gap-8 md:gap-16 text-center">
              <div>
                <p className="text-4xl md:text-6xl font-black text-highlight mb-2">{at(guide.certification)}</p>
                <p className="text-xs md:text-sm uppercase tracking-widest font-black opacity-50">{at(guide.certificationSub)}</p>
              </div>
              <div>
                <p className="text-4xl md:text-6xl font-black text-highlight mb-2">{at(guide.experience)}</p>
                <p className="text-xs md:text-sm uppercase tracking-widest font-black opacity-50">{at(guide.experienceSub)}</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Philosophy / Values Section */}
      {!guide.hideValues && (
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
      )}

      {guide.faqs && guide.faqs.length > 0 && (
        <section className="py-20 border-t border-border/10">
          <div className="container mx-auto px-6">
            <FAQAccordion faqs={guide.faqs} />
          </div>
        </section>
      )}

      {!settingsData?.hidePartners && (
        <PartnersSlider partners={settingsData?.partners} />
      )}
    </main>
  );
}
