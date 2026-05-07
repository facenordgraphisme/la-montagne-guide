import React from 'react'
import Image from 'next/image';
import { client } from "@/sanity/lib/client";
import { activityBySlugQuery, sejoursByActivityQuery } from "@/sanity/lib/queries";
import { notFound } from 'next/navigation';
import SejourCard from "@/components/SejourCard";
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { PortableText } from '@portabletext/react';

import { getServerTranslations } from '@/i18n/server';

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
          
          <span className="text-accent font-black tracking-[0.4em] uppercase text-xs mb-6 block">{at("L'UNIVERS")}</span>
          <h1 className="text-6xl md:text-9xl font-black tracking-tighter uppercase leading-[0.8] text-white mb-12">
            {at(currentUnivers.title)}
          </h1>
        </div>
      </section>

      {/* Description Section - Centered & Wide */}
      <section className="relative -mt-32 z-20 pb-24">
        <div className="container mx-auto px-6">
          <div className="glass p-12 md:p-24 rounded-[60px] border border-white/10 shadow-2xl bg-background/80 backdrop-blur-3xl max-w-5xl mx-auto text-center">
            <div className="prose-custom prose-xl mx-auto">
              {currentUnivers.description ? (
                <PortableText value={translatePortableText(currentUnivers.description)} />
              ) : (
                <p className="text-foreground/60">{at('Description à venir pour cet univers.')}</p>
              )}
            </div>
            
            <div className="w-24 h-1 bg-accent mx-auto mt-16" />
          </div>
        </div>
      </section>

      {/* Catalog Section */}
      <section className="py-24 bg-card/5">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase mb-4">
              {at('Catalogue')} <span className="text-accent italic">{at('Séjours')}</span>
            </h2>
            <p className="text-foreground/40 font-bold uppercase tracking-widest text-xs">{at('Découvrez nos aventures dans cet univers')}</p>
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
      
    </main>
  );
}
