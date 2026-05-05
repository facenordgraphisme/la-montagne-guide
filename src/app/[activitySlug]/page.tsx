import React from 'react'
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from 'next/image';
import Link from 'next/link';
import { client } from "@/sanity/lib/client";
import { activityBySlugQuery } from "@/sanity/lib/queries";
import { notFound } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { urlFor } from "@/sanity/lib/image";
import { PortableText } from '@portabletext/react';

const VALID_ACTIVITIES = ['alpinisme', 'ski', 'escalade', 'cascade-de-glace', 'paralpinisme', 'voyages'];

export default async function ActivityLandingPage({ params }: { params: Promise<{ activitySlug: string }> }) {
  const { activitySlug } = await params;

  if (!VALID_ACTIVITIES.includes(activitySlug)) {
    notFound();
  }

  const activity = await client.fetch(activityBySlugQuery, { slug: activitySlug });

  if (!activity) notFound();

  // On utilise les univers définis dans Sanity ou une structure par défaut
  const univers = activity.univers || [];

  return (
    <main className="relative min-h-screen bg-background text-foreground transition-colors duration-300">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          {activity.image && (
            <Image 
              src={activity.image}
              alt={activity.title}
              fill
              sizes="100vw"
              className="object-cover"
              priority
            />
          )}
          <div className="absolute inset-0 bg-black/40 bg-gradient-to-t from-background via-transparent to-black/20" />
        </div>
        <div className="container relative z-10 px-6 text-center pt-20">
          <span className="text-accent font-black tracking-[0.4em] uppercase text-xs mb-6 block">{activity.subtitle || "AVENTURE"}</span>
          <h1 className="text-6xl md:text-9xl font-black tracking-tighter text-white uppercase mb-8 leading-[0.8]">{activity.title}</h1>
          <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto leading-relaxed font-medium">
            {activity.intro || activity.description?.substring(0, 200)}
          </p>
        </div>
      </section>

      {/* Key Points Section (Sécurité, Pédagogie, etc.) */}
      {activity.keyPoints && activity.keyPoints.length > 0 && (
        <section className="py-20 bg-card/5">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {activity.keyPoints.map((point: any, i: number) => (
                <div key={i} className="glass p-10 rounded-[40px] text-center border border-border shadow-lg hover:border-accent/30 transition-colors">
                  <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center text-accent mx-auto mb-6">
                    <span className="font-black text-xl">{i + 1}</span>
                  </div>
                  <h3 className="text-xl font-black mb-4 text-accent uppercase tracking-widest leading-tight">{point.title}</h3>
                  <p className="text-foreground/60 leading-relaxed font-medium">{point.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Univers Grid */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <span className="text-accent font-black tracking-widest uppercase text-xs mb-4 block">{activity.universBadge || "NOS UNIVERS"}</span>
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase mb-6">{activity.universTitle || "Choisissez votre univers"}</h2>
            <p className="text-lg text-foreground/60 max-w-2xl mx-auto font-medium">
              {activity.universDescription || "Découvrez nos différentes approches de la montagne, adaptées à vos envies et à votre niveau."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {univers.map((univ: any, i: number) => {
              // On crée un slug pour l'univers à partir du titre pour l'URL
              const universSlug = univ.title.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '-');
              
              return (
                <Link 
                  key={i} 
                  href={`/${activitySlug}/${universSlug}`}
                  className="group relative h-[450px] rounded-[50px] overflow-hidden border border-border hover:border-accent/40 transition-all duration-500 shadow-xl"
                >
                  {univ.image && (
                    <Image 
                      src={urlFor(univ.image).url()}
                      alt={univ.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
                  
                  <div className="absolute inset-0 p-12 flex flex-col justify-end">
                    <h3 className="text-3xl md:text-5xl font-black text-foreground uppercase tracking-tighter mb-4 group-hover:text-accent transition-colors">
                      {univ.title}
                    </h3>
                    <div className="text-foreground/60 text-lg mb-8 max-w-md line-clamp-2 font-medium opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                      {univ.description && (
                        <div className="prose-custom prose-sm">
                          <PortableText value={univ.description} />
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-accent font-black uppercase tracking-widest text-xs">
                      Découvrir le catalogue
                      <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {univers.length === 0 && (
            <div className="text-center py-20 glass rounded-[40px] border border-dashed border-border">
              <p className="text-xl text-foreground/40 font-medium">Les univers de cette activité seront bientôt disponibles.</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
