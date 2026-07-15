import type { Metadata } from 'next';
import React from 'react'
import Link from 'next/link';
import Image from 'next/image';
import { client } from "@/sanity/lib/client";
import { resourcesQuery, faqsQuery } from "@/sanity/lib/queries";
import { getServerTranslations } from '@/i18n/server';
import ResourcesListClient from './ResourcesListClient';

export async function generateMetadata(): Promise<Metadata> {
  const { at } = await getServerTranslations();
  return {
    title: `${at('Ressources & Guides')} | La Montagne Guide`,
    description: at('Découvrez nos guides pratiques, conseils et ressources pour préparer vos sorties en haute montagne : alpinisme, ski de randonnée, escalade, cascade de glace, entraînement et matériel.'),
  };
}

export default async function RessourcesPage() {
  const [resources, allFaqs] = await Promise.all([
    client.fetch(resourcesQuery),
    client.fetch(faqsQuery)
  ]);

  const { at } = await getServerTranslations();

  // Filtrer les FAQ pour ne garder que les FAQ générales de niveau global (ex: category === 'general' ou non rattachées à un guide particulier)
  const generalFaqs = allFaqs.filter((faq: any) => faq.category === 'general');

  return (
    <main className="relative pt-32 min-h-screen">
      {/* Background glow effects */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-highlight/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-6 py-20 relative z-10">
        <div className="max-w-3xl mb-16">
          <span className="text-accent font-black tracking-widest uppercase text-xs mb-4 block">
            {at('RESSOURCES & CONSEILS')}
          </span>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 text-gradient uppercase">
            {at('Guides &')} <br /> <span className="text-accent italic">{at('Préparation')}</span>
          </h1>
          <p className="text-foreground/60 text-lg md:text-xl leading-relaxed">
            {at('Pour partir sereinement en altitude, la préparation est la clé. Retrouvez ici nos articles conseils, dossiers techniques sur le matériel et fiches pratiques classés par activités.')}
          </p>
        </div>

        {/* Client component for searching and interactive filtering */}
        <ResourcesListClient resources={resources} generalFaqs={generalFaqs} />
      </div>
    </main>
  );
}
