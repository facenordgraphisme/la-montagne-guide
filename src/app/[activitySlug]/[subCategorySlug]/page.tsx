import type { Metadata } from 'next';
import React from 'react'
import Image from 'next/image';
import { client } from "@/sanity/lib/client";
import { activityBySlugQuery, sejoursByActivityQuery } from "@/sanity/lib/queries";
import { notFound } from 'next/navigation';
import SejourCard from "@/components/SejourCard";
import FAQAccordion from "@/components/FAQAccordion";
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { PortableText } from '@portabletext/react';

import { getServerTranslations } from '@/i18n/server';

function blocksToText(blocks: any, lang: string): string {
  if (!blocks) return '';
  const blockArray = Array.isArray(blocks) ? blocks : blocks[lang] || blocks.fr || blocks.en || [];
  if (!Array.isArray(blockArray)) return '';
  return blockArray
    .map(block => {
      if (block._type !== 'block' || !block.children) return '';
      return block.children.map((child: any) => child.text).join('');
    })
    .join(' ')
    .trim();
}

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

export async function generateMetadata({ params }: { params: Promise<{ activitySlug: string, subCategorySlug: string }> }): Promise<Metadata> {
  const { activitySlug, subCategorySlug } = await params;
  const activity = await client.fetch(activityBySlugQuery, { slug: activitySlug });
  const { at, lang } = await getServerTranslations();

  if (!activity) return {};

  const currentUnivers = activity.univers?.find((u: any) => {
    const uSlug = u.title.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '-');
    return uSlug === subCategorySlug;
  });

  if (!currentUnivers) return {};

  const title = `${at(currentUnivers.title)} - ${at(activity.title)} | La Montagne Guide`;
  const plainTextDescription = blocksToText(currentUnivers.description, lang);
  const description = plainTextDescription ? plainTextDescription.substring(0, 160) : '';
  const ogImage = currentUnivers.image || activity.image || undefined;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: ogImage ? [{ url: ogImage }] : undefined,
    },
  };
}

export default async function UniversePage({ params }: { params: Promise<{ activitySlug: string, subCategorySlug: string }> }) {
  const { activitySlug, subCategorySlug } = await params;
  const { at, t, translatePortableText } = await getServerTranslations();

  // Fetch activity and all its sejours
  const [activity, sejours] = await Promise.all([
    client.fetch(activityBySlugQuery, { slug: activitySlug }),
    client.fetch(sejoursByActivityQuery, { activity: activitySlug })
  ]);

  if (!activity) notFound();

  // On trouve l'univers correspondant au slug
  const currentUnivers = activity.univers?.find((u: any) => {
    const uSlug = u.title.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '-');
    return uSlug === subCategorySlug;
  });

  if (!currentUnivers) notFound();

  // Filtrage des séjours
  const filteredSejours = sejours.filter((s: any) => {
    return s.subCategory === subCategorySlug;
  });

  return (
    <main className="relative min-h-screen bg-background text-foreground transition-colors duration-300">
      
      {/* Hero Header with Background Image */}
      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          {currentUnivers.image ? (
            <Image 
              src={currentUnivers.image}
              alt={at(currentUnivers.title)}
              fill
              sizes="100vw"
              priority
              className="object-cover"
            />
          ) : (
             activity.image && (
              <Image 
                src={activity.image}
                alt={at(activity.title)}
                fill
                sizes="100vw"
                priority
                className="object-cover"
              />
            )
          )}
          <div className="absolute inset-0 bg-black/50 bg-gradient-to-t from-background via-background/20 to-black/40" />
        </div>

        <div className="container relative z-10 px-6 pt-32 text-center">
          <Link 
            href={`/${activitySlug}`} 
            className="inline-flex items-center gap-2 text-white/60 font-bold mb-12 hover:text-accent transition-all duration-300 group"
          >
            <ArrowLeft size={16} />
            {at('RETOUR À')} {at(activity.title).toUpperCase()}
          </Link>
          
          <h1 className="text-6xl md:text-9xl font-black tracking-tighter uppercase leading-[0.8] text-white mb-12">
            {at(currentUnivers.title)}
          </h1>
        </div>
      </section>

      {/* Description Section - Centered & Wide */}
      <section className="relative -mt-32 z-20 pb-24">
        <div className="container mx-auto px-6">
          <div className="glass p-12 md:p-24 rounded-[60px] border border-white/10 shadow-2xl bg-background/80 backdrop-blur-3xl max-w-5xl mx-auto text-center relative">
            <div className="prose-custom prose-xl mx-auto mb-16">
              {currentUnivers.description ? (
                <PortableText value={translatePortableText(currentUnivers.description)} components={blockAlignComponents} />
              ) : (
                <p className="text-foreground/60">{at('Description à venir pour cet univers.')}</p>
              )}
            </div>
            
            <div className="w-24 h-1 bg-accent mx-auto" />

            {/* CTA Encart - Sur mesure */}
            <div className="md:absolute -bottom-16 right-0 md:right-12 p-8 md:p-10 rounded-[40px] shadow-2xl max-w-xl text-left mt-12 md:mt-0 group transition-all duration-500 overflow-hidden border border-highlight/30 hover:border-highlight/60 bg-linear-to-br from-highlight/10 via-highlight/5 to-orange-400/10 backdrop-blur-3xl">
              <div className="absolute -right-4 -top-4 w-32 h-32 bg-highlight/10 rounded-full blur-3xl group-hover:bg-highlight/20 transition-colors" />
              <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                <div className="flex-1">
                  <p className="text-xl font-black leading-[1.1] tracking-tighter text-foreground uppercase">
                    {at(activity.customTripText) || t("customTrip.text")}
                  </p>
                </div>
                <Link
                  href="/contact"
                  className="whitespace-nowrap px-8 py-4 text-sm uppercase tracking-widest font-black rounded-full bg-highlight text-white shadow-xl shadow-highlight/30 hover:shadow-highlight/50 hover:-translate-y-0.5 transition-all duration-300"
                >
                  {at(activity.customTripCTA) || t("customTrip.cta")}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Catalog Section */}
      <section className="py-24 bg-card/5">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase">
              {currentUnivers.catalogTitle ? at(currentUnivers.catalogTitle) : (
                <>
                  {at('Catalogue')} <span className="text-accent italic">{at('Séjours')}</span>
                </>
              )}
            </h2>
          </div>

          {filteredSejours.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredSejours.map((sejour: any) => (
                <SejourCard 
                   key={sejour.slug} 
                   sejour={sejour} 
                   activitySlug={activitySlug} 
                 />
              ))}
            </div>
          ) : (
            <div className="glass p-20 rounded-[50px] text-center border border-dashed border-border">
              <h3 className="text-2xl font-bold mb-4 opacity-40 uppercase tracking-tighter">{at('Bientôt disponible')}</h3>
              <p className="text-foreground/40 font-medium">{at('Nous préparons de nouveaux séjours d\'exception pour cet univers.')}</p>
            </div>
          )}
        </div>
      </section>

      {currentUnivers.faqs && currentUnivers.faqs.length > 0 && (
        <section className="py-20 border-t border-border/10 bg-background">
          <div className="container mx-auto px-6 max-w-4xl">
            <FAQAccordion faqs={currentUnivers.faqs} />
          </div>
        </section>
      )}
      
    </main>
  );
}
