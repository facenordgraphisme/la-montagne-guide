import type { Metadata } from 'next';
import React from 'react'
import Image from 'next/image';
import Link from 'next/link';
import { client } from "@/sanity/lib/client";
import { resourceBySlugQuery, resourcesQuery } from "@/sanity/lib/queries";
import { notFound } from 'next/navigation';
import { getServerTranslations } from '@/i18n/server';
import { ArrowLeft, BookOpen, Clock, Compass } from 'lucide-react';
import { PortableText } from '@portabletext/react';
import FAQAccordion from "@/components/FAQAccordion";

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

export async function generateStaticParams() {
  const resources = await client.fetch(resourcesQuery);
  return resources.map((res: any) => ({
    slug: res.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const res = await client.fetch(resourceBySlugQuery, { slug });
  const { at } = await getServerTranslations();

  if (!res) return {};

  const title = `${at(res.title)} | Conseils & Guides`;
  const description = res.intro ? at(res.intro).substring(0, 160) : '';

  return {
    title,
    description,
  };
}

export default async function ResourceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await client.fetch(resourceBySlugQuery, { slug });
  const { at, lang } = await getServerTranslations();

  if (!data) notFound();

  const displayTitle = lang === 'en' ? (data.titleEn || data.title) : data.title;
  const displayIntro = lang === 'en' ? (data.introEn || data.intro) : data.intro;
  const displayContent = lang === 'en' ? (data.contentEn || data.content) : data.content;

  const catLabels: Record<string, string> = {
    alpinisme: 'Alpinisme',
    ski: 'Ski de Randonnée',
    escalade: 'Escalade',
    'cascade-de-glace': 'Cascade de Glace',
    preparation: 'Préparation',
    equipement: 'Équipement & Matériel'
  };

  return (
    <main className="relative min-h-screen pt-32 pb-24">
      {/* Back button */}
      <div className="container mx-auto px-6 mb-12">
        <Link 
          href="/ressources" 
          className="inline-flex items-center gap-2 text-foreground/60 hover:text-accent font-bold uppercase tracking-widest text-xs transition-colors"
        >
          <ArrowLeft size={16} />
          {at('Retour aux ressources')}
        </Link>
      </div>

      <article className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-start">
          
          {/* Main content column */}
          <div className="lg:col-span-2 space-y-12">
            <div>
              {/* Category pill */}
              <span className="inline-block px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-accent/10 text-accent mb-6">
                {at(catLabels[data.category] || data.category)}
              </span>
              
              <h1 className="text-4xl md:text-6xl font-bold tracking-tighter leading-tight mb-8">
                {displayTitle}
              </h1>

              {displayIntro && (
                <p className="text-xl text-foreground/70 leading-relaxed font-medium border-l-4 border-accent pl-6 py-1 my-8">
                  {displayIntro}
                </p>
              )}
            </div>

            {/* Main guide image */}
            {data.image && (
              <div className="relative aspect-[16/9] rounded-[40px] overflow-hidden shadow-2xl">
                <Image 
                  src={data.image}
                  alt={displayTitle}
                  fill
                  sizes="(max-width: 1024px) 100vw, 800px"
                  className="object-cover"
                />
              </div>
            )}

            {/* Rich text body content */}
            <div className="prose prose-invert prose-lg max-w-none text-foreground/80 leading-relaxed">
              {displayContent ? (
                <PortableText value={displayContent} components={blockAlignComponents} />
              ) : (
                <p className="italic text-foreground/40">{at('Ce guide est en cours de rédaction.')}</p>
              )}
            </div>
          </div>

          {/* Sidebar (Related Activities) */}
          <div className="lg:col-span-1 space-y-8 sticky top-32">
            {data.relatedActivities && data.relatedActivities.length > 0 ? (
              <div className="glass p-8 rounded-[40px] border border-border shadow-xl">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2.5">
                  <Compass className="text-accent w-5 h-5" />
                  {at('Séjours Recommandés')}
                </h3>
                <div className="space-y-6">
                  {data.relatedActivities.map((act: any) => {
                    const stayLink = `/${act.categorySlug || 'ski'}/${act.subCategory?.slug || 'initiation'}/${act.slug}`;
                    return (
                      <Link 
                        key={act.slug} 
                        href={stayLink} 
                        className="group flex gap-4 items-center p-3 rounded-2xl hover:bg-foreground/5 border border-transparent hover:border-border transition-all duration-300"
                      >
                        {act.image && (
                          <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0">
                            <Image 
                              src={act.image}
                              alt={at(act.title)}
                              fill
                              sizes="80px"
                              className="object-cover"
                            />
                          </div>
                        )}
                        <div className="overflow-hidden">
                          <h4 className="font-bold text-sm text-foreground group-hover:text-accent transition-colors line-clamp-1">
                            {at(act.title)}
                          </h4>
                          <p className="text-[10px] font-black uppercase tracking-widest text-highlight mt-1">
                            {act.basePrice ? at(act.basePrice) : at('Sur devis')}
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ) : (
              // Secondary CTA fallback
              <div className="glass p-8 rounded-[40px] border border-border shadow-xl text-center">
                <BookOpen className="text-accent w-12 h-12 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">{at('Envie de tester sur le terrain ?')}</h3>
                <p className="text-foreground/60 text-sm mb-6 leading-relaxed">
                  {at('Discutez de votre projet ou organisez un séjour sur-mesure directement avec votre guide.')}
                </p>
                <Link href="/contact" className="btn-primary w-full block text-center !text-white text-xs font-black uppercase tracking-widest">
                  {at('Me contacter')}
                </Link>
              </div>
            )}
          </div>

        </div>
      </article>

      {/* Custom FAQs related to this resource */}
      {data.faqs && data.faqs.length > 0 && (
        <section className="container mx-auto px-6 mt-32 pt-20 border-t border-foreground/5 max-w-4xl">
          <div className="text-center mb-16">
            <span className="text-accent font-black tracking-widest uppercase text-xs mb-4 block">FAQ</span>
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase">
              {at('Questions')} <span className="text-accent italic">{at('Fréquentes')}</span>
            </h2>
          </div>
          <FAQAccordion faqs={data.faqs} />
        </section>
      )}
    </main>
  );
}
