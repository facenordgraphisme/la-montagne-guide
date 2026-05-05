import React from 'react'
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from 'next/image';
import Link from 'next/link';
import { client } from "@/sanity/lib/client";
import { sejourBySlugQuery } from "@/sanity/lib/queries";
import { notFound } from 'next/navigation';
import { PortableText } from '@portabletext/react';
import { MapPin, BarChart3, Clock, Euro, ArrowLeft } from 'lucide-react';

export default async function SejourDetail({ params }: { params: Promise<{ activitySlug: string, subCategorySlug: string, slug: string }> }) {
  const { activitySlug, subCategorySlug, slug } = await params;
  const sejour = await client.fetch(sejourBySlugQuery, { slug });

  if (!sejour) notFound();

  const getLevelLabel = (level?: string) => {
    const map: Record<string, string> = {
      'debutant': 'Débutant',
      'intermediaire': 'Intermédiaire',
      'confirme': 'Confirmé',
      'expert': 'Expert'
    }
    return level ? map[level] || level : ''
  }

  return (
    <main className="relative min-h-screen bg-background text-foreground transition-colors duration-300">
      <Navbar />

      {/* Hero Header */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          {sejour.image && (
            <Image
              src={sejour.image}
              alt={sejour.title}
              fill
              priority
              className="object-cover"
            />
          )}
          <div className="absolute inset-0 bg-black/40 bg-gradient-to-t from-background via-transparent to-black/20" />
        </div>

        <div className="container relative z-10 px-6 pt-32 max-w-5xl">
          <Link
            href={`/${activitySlug}/${subCategorySlug}`}
            className="inline-flex items-center gap-2 text-accent font-bold mb-8 hover:gap-4 transition-all duration-300"
          >
            <ArrowLeft size={20} />
            RETOUR À L'UNIVERS
          </Link>

          <div className="flex flex-wrap gap-4 mb-8">
            <span className="px-4 py-1.5 bg-accent text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">
              {sejour.activityType}
            </span>
            {sejour.massif && (
              <span className="px-3 py-1 bg-background/50 text-white text-[10px] font-bold uppercase tracking-wider rounded-full backdrop-blur-md border border-white/10 flex items-center gap-1">
                <MapPin size={10} className="text-accent" />
                {sejour.massif}
              </span>
            )}
          </div>

          <h1 className="text-5xl md:text-8xl lg:text-9xl font-black tracking-tighter uppercase leading-[0.8] text-white">
            {sejour.title}
          </h1>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-20">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-12">
              <div className="prose-custom max-w-none">
                {sejour.description && (
                  <p className="text-2xl font-medium leading-relaxed mb-12 text-foreground/80">
                    {sejour.description}
                  </p>
                )}
                {sejour.content && (
                  <PortableText value={sejour.content} />
                )}
              </div>
            </div>

            {/* Sidebar Stats */}
            <div className="lg:col-span-1">
              <div className="glass p-10 rounded-[40px] sticky top-32 border border-border shadow-2xl">
                <h3 className="text-2xl font-black uppercase tracking-tight mb-8">Fiche Technique</h3>

                <div className="space-y-6 mb-12">
                  <div className="flex justify-between items-center py-4 border-b border-border">
                    <div className="flex items-center gap-3">
                      <Clock size={18} className="text-accent" />
                      <span className="text-xs font-bold uppercase tracking-widest text-foreground/40">Durée</span>
                    </div>
                    <span className="font-bold">{sejour.duration}</span>
                  </div>

                  <div className="flex justify-between items-center py-4 border-b border-border">
                    <div className="flex items-center gap-3">
                      <BarChart3 size={18} className="text-accent" />
                      <span className="text-xs font-bold uppercase tracking-widest text-foreground/40">Niveau</span>
                    </div>
                    <span className="font-bold">{getLevelLabel(sejour.level)}</span>
                  </div>

                  <div className="flex justify-between items-center py-4 border-b border-border">
                    <div className="flex items-center gap-3">
                      <MapPin size={18} className="text-accent" />
                      <span className="text-xs font-bold uppercase tracking-widest text-foreground/40">Massif</span>
                    </div>
                    <span className="font-bold">{sejour.massif}</span>
                  </div>

                  <div className="flex justify-between items-center py-4 border-b border-border">
                    <div className="flex items-center gap-3">
                      <Euro size={18} className="text-accent" />
                      <span className="text-xs font-bold uppercase tracking-widest text-foreground/40">Prix</span>
                    </div>
                    <div className="text-right">
                      <span className="block text-[10px] font-bold text-foreground/30 uppercase leading-none mb-1">À partir de</span>
                      <span className="text-2xl font-black text-highlight leading-none">{sejour.basePrice}</span>
                    </div>
                  </div>
                </div>

                {/* Upcoming Dates Section */}
                <div className="mb-12">
                  <h4 className="text-xs font-black uppercase tracking-[0.2em] text-accent mb-6">Prochains Départs</h4>
                  {sejour.upcomingSorties && sejour.upcomingSorties.length > 0 ? (
                    <div className="space-y-3">
                      {sejour.upcomingSorties.map((s: any, i: number) => (
                        <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-foreground/5 border border-border">
                          <div className="flex flex-col">
                            <span className="font-bold text-sm">{s.date}</span>
                            <span className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest">{s.availableSpots} places</span>
                          </div>
                          {s.isFull ? (
                            <span className="text-[8px] font-black uppercase bg-red-500/10 text-red-500 px-2 py-1 rounded-full border border-red-500/20">Complet</span>
                          ) : (
                            <span className="text-[8px] font-black uppercase bg-green-500/10 text-green-500 px-2 py-1 rounded-full border border-green-500/20">Disponible</span>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 rounded-2xl bg-foreground/5 border border-dashed border-border text-center">
                      <p className="text-xs font-bold text-foreground/40 uppercase tracking-widest">Dates sur demande</p>
                    </div>
                  )}
                </div>

                <Link href="/contact" className="btn-primary w-full block text-center !text-white py-4 text-sm font-black uppercase tracking-widest">
                  Réserver ce séjour
                </Link>
                <p className="text-[10px] text-center mt-6 text-foreground/40 font-bold uppercase tracking-widest">
                  Conseils & Réservation par téléphone possible
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
