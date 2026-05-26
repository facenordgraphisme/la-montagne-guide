import React from 'react'
import Image from 'next/image';
import Link from 'next/link';
import { client } from "@/sanity/lib/client";
import { sejourBySlugQuery, postsBySejourQuery } from "@/sanity/lib/queries";
import { notFound } from 'next/navigation';
import { PortableText } from '@portabletext/react';
import { MapPin, BarChart3, Clock, Euro, ArrowLeft } from 'lucide-react';

import { getServerTranslations } from '@/i18n/server';
import SejourTabs from '@/components/SejourTabs';
import BlogCard from '@/components/BlogCard';

export default async function SejourDetail({ params }: { params: Promise<{ activitySlug: string, subCategorySlug: string, slug: string }> }) {
  const { activitySlug, subCategorySlug, slug } = await params;
  const sejour = await client.fetch(sejourBySlugQuery, { slug });
  const { at, t, translatePortableText } = await getServerTranslations();

  if (!sejour) notFound();

  const relatedPosts = sejour._id
    ? await client.fetch(postsBySejourQuery, { sejourId: sejour._id })
    : [];

  const getLevelLabel = (level?: string) => {
    const map: Record<string, string> = {
      'debutant': at('Débutant'),
      'intermediaire': at('Intermédiaire'),
      'confirme': at('Confirmé'),
      'expert': at('Expert')
    }
    return level ? map[level] || level : ''
  }

  const hasTabs = sejour.programme || sejour.budget || sejour.infosPratiques || sejour.materiel || sejour.materielPdf

  const tabs = [
    { id: 'programme', label: at('Programme'), content: sejour.programme ? translatePortableText(sejour.programme) : null },
    { id: 'budget', label: at('Budget'), content: sejour.budget ? translatePortableText(sejour.budget) : null },
    { id: 'infos', label: at('Infos Pratiques'), content: sejour.infosPratiques ? translatePortableText(sejour.infosPratiques) : null },
    { id: 'materiel', label: at('Matériel'), content: sejour.materiel ? translatePortableText(sejour.materiel) : null, pdf: sejour.materielPdf ?? null },
  ]

  return (
    <main className="relative min-h-screen bg-background text-foreground transition-colors duration-300">

      {/* Hero Header */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          {sejour.image && (
            <Image
              src={sejour.image}
              alt={at(sejour.title)}
              fill
              sizes="100vw"
              priority
              className="object-cover"
            />
          )}
          <div className="absolute inset-0 bg-black/40 bg-linear-to-t from-background via-transparent to-black/20" />
        </div>

        <div className="container relative z-10 px-6 pt-32 max-w-5xl">
          <Link
            href={`/${activitySlug}/${subCategorySlug}`}
            className="inline-flex items-center gap-2 text-accent font-bold mb-8 hover:gap-4 transition-all duration-300"
          >
            <ArrowLeft size={20} />
            {at("RETOUR À L'UNIVERS")}
          </Link>

          <div className="flex flex-wrap gap-4 mb-8">
            <span className="px-4 py-1.5 bg-accent text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">
              {at(sejour.activityType)}
            </span>
            {sejour.massif && (
              <span className="px-3 py-1 bg-background/50 text-white text-[10px] font-bold uppercase tracking-wider rounded-full backdrop-blur-md border border-white/10 flex items-center gap-1">
                <MapPin size={10} className="text-accent" />
                {at(sejour.massif)}
              </span>
            )}
          </div>

          <h1 className="text-5xl md:text-8xl lg:text-9xl font-black tracking-tighter uppercase leading-[0.8] text-white">
            {at(sejour.title)}
          </h1>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-20">

            {/* Main Content */}
            <div className="lg:col-span-2 space-y-12">
              {sejour.description && (
                <p className="text-2xl font-medium leading-relaxed text-foreground/80">
                  {at(sejour.description)}
                </p>
              )}

              {hasTabs ? (
                <SejourTabs tabs={tabs} />
              ) : sejour.content ? (
                <div className="prose-custom max-w-none">
                  <PortableText value={translatePortableText(sejour.content)} />
                </div>
              ) : null}
            </div>

            {/* Sidebar Stats */}
            <div className="lg:col-span-1">
              <div className="glass p-10 rounded-[40px] sticky top-32 border border-border shadow-2xl">
                <h3 className="text-2xl font-black uppercase tracking-tight mb-8">{at('Fiche Technique')}</h3>

                <div className="space-y-6 mb-12">
                  <div className="flex justify-between items-center py-4 border-b border-border">
                    <div className="flex items-center gap-3">
                      <Clock size={18} className="text-accent" />
                      <span className="text-xs font-bold uppercase tracking-widest text-foreground/40">{at('Durée')}</span>
                    </div>
                    <span className="font-bold">{at(sejour.duration)}</span>
                  </div>

                  <div className="flex justify-between items-center py-4 border-b border-border">
                    <div className="flex items-center gap-3">
                      <BarChart3 size={18} className="text-accent" />
                      <span className="text-xs font-bold uppercase tracking-widest text-foreground/40">{at('Niveau')}</span>
                    </div>
                    <span className="font-bold">{getLevelLabel(sejour.level)}</span>
                  </div>

                  <div className="flex justify-between items-center py-4 border-b border-border">
                    <div className="flex items-center gap-3">
                      <MapPin size={18} className="text-accent" />
                      <span className="text-xs font-bold uppercase tracking-widest text-foreground/40">{at('Massif')}</span>
                    </div>
                    <span className="font-bold">{at(sejour.massif)}</span>
                  </div>

                  {/* Dual pricing */}
                  <div className="py-4 border-b border-border space-y-3">
                    <div className="flex items-center gap-3 mb-2">
                      <Euro size={18} className="text-accent" />
                      <span className="text-xs font-bold uppercase tracking-widest text-foreground/40">{at('Tarifs')}</span>
                    </div>
                    {sejour.priceEncadrement ? (
                      <div className="flex justify-between items-baseline">
                        <span className="text-[11px] font-bold text-foreground/50 uppercase tracking-wider">{at('Encadrement')}</span>
                        <span className="font-black text-highlight">{at(sejour.priceEncadrement)}</span>
                      </div>
                    ) : null}
                    {sejour.priceFraisSejour ? (
                      <div className="flex justify-between items-baseline">
                        <span className="text-[11px] font-bold text-foreground/50 uppercase tracking-wider">{at('Frais de séjour')}</span>
                        <span className="font-black text-foreground/80">{at(sejour.priceFraisSejour)}</span>
                      </div>
                    ) : null}
                    {!sejour.priceEncadrement && !sejour.priceFraisSejour && sejour.basePrice ? (
                      <div className="flex justify-between items-baseline">
                        <span className="text-[10px] font-bold text-foreground/30 uppercase">{at('À partir de')}</span>
                        <span className="text-2xl font-black text-highlight leading-none">{at(sejour.basePrice)}</span>
                      </div>
                    ) : null}
                  </div>
                </div>

                {/* Upcoming Dates Section */}
                <div className="mb-12">
                  <h4 className="text-xs font-black uppercase tracking-[0.2em] text-accent mb-6">{at('Prochains Départs')}</h4>
                  {sejour.upcomingSorties && sejour.upcomingSorties.length > 0 ? (
                    <div className="space-y-3">
                      {sejour.upcomingSorties.map((s: any, i: number) => (
                        <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-foreground/5 border border-border">
                          <div className="flex flex-col">
                            <span className="font-bold text-sm">{at(s.date)}</span>
                            <span className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest">{at(s.availableSpots)} {at('places')}</span>
                          </div>
                          {s.isFull ? (
                            <span className="text-[8px] font-black uppercase bg-red-500/10 text-red-500 px-2 py-1 rounded-full border border-red-500/20">{at('Complet')}</span>
                          ) : (
                            <span className="text-[8px] font-black uppercase bg-green-500/10 text-green-500 px-2 py-1 rounded-full border border-green-500/20">{at('Disponible')}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 rounded-2xl bg-foreground/5 border border-dashed border-border text-center">
                      <p className="text-xs font-bold text-foreground/40 uppercase tracking-widest">{at('Dates sur demande')}</p>
                    </div>
                  )}

                  <div className="mt-8 space-y-4 p-6 rounded-3xl bg-accent/5 border border-accent/10">
                    <p className="text-[11px] leading-relaxed text-foreground/70 font-medium">
                      <span className="text-accent font-bold block mb-1 uppercase">{at('PARTAGE DE SORTIE')}</span>
                      {at("Ces dates sont destinées aux personnes souhaitant s'inscrire individuellement et partager les frais d'une sortie.")}
                    </p>
                    <p className="text-[11px] leading-relaxed text-foreground/70 font-medium">
                      <span className="text-accent font-bold block mb-1 uppercase">{at('GROUPES & SUR MESURE')}</span>
                      {at('Si vous êtes un groupe déjà constitué ou si vous souhaitez')} <span className="text-accent font-bold">{at('ouvrir de nouvelles dates')}</span> {at('à la demande, contactez-moi directement pour un engagement privé.')}
                    </p>
                  </div>
                </div>

                <Link href="/contact" className="btn-primary w-full block text-center text-white! py-4 text-sm font-black uppercase tracking-widest">
                  {at('Réserver ce séjour')}
                </Link>

                <p className="text-[10px] text-center mt-6 text-foreground/40 font-bold uppercase tracking-widest">
                  {at('Conseils & Réservation par téléphone possible')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Photo Gallery */}
      {sejour.gallery && sejour.gallery.length > 0 && (
        <section className="pb-24">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase mb-10">
              {at('Galerie')} <span className="text-accent italic">{at('Photos')}</span>
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {sejour.gallery.map((photo: { url: string; alt?: string }, i: number) => (
                <div key={i} className="relative aspect-square overflow-hidden rounded-2xl group">
                  <Image
                    src={photo.url}
                    alt={photo.alt || at(sejour.title)}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Related Blog Posts */}
      {relatedPosts && relatedPosts.length > 0 && (
        <section className="pb-24 bg-surface/40">
          <div className="container mx-auto px-6 pt-16">
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase mb-10">
              {at('Dernières')} <span className="text-accent italic">{at('Sorties')}</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedPosts.map((post: any) => (
                <BlogCard key={post.slug} post={post} />
              ))}
            </div>
          </div>
        </section>
      )}

    </main>
  );
}
