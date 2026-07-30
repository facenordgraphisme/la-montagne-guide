import type { Metadata } from 'next';
import React from 'react'
import { client } from "@/sanity/lib/client";
import { resourcesQuery, faqsQuery, settingsQuery } from "@/sanity/lib/queries";
import { getServerTranslations } from '@/i18n/server';
import ResourcesListClient from './ResourcesListClient';
import { notFound } from 'next/navigation';
import { renderRichText, toPlainText } from '@/utils/richText';

export async function generateMetadata(): Promise<Metadata> {
  const [settingsData] = await Promise.all([
    client.fetch(settingsQuery)
  ]);
  const { at } = await getServerTranslations();

  if (settingsData?.hideRessourcesPage) {
    return {};
  }

  const title = settingsData?.ressourcesPageTitle 
    ? `${at(settingsData.ressourcesPageTitle)} | La Montagne Guide` 
    : `${at('Ressources & Guides')} | La Montagne Guide`;

  const rawDesc = settingsData?.ressourcesPageDescription;
  const description = rawDesc
    ? toPlainText(at(rawDesc))
    : at('Découvrez nos guides pratiques, conseils et ressources pour préparer vos sorties en haute montagne : alpinisme, ski de randonnée, escalade, cascade de glace, entraînement et matériel.');

  return {
    title,
    description,
    alternates: {
      canonical: '/ressources',
    },
  };
}

export default async function RessourcesPage() {
  const [resources, allFaqs, settingsData] = await Promise.all([
    client.fetch(resourcesQuery),
    client.fetch(faqsQuery),
    client.fetch(settingsQuery)
  ]);

  if (settingsData?.hideRessourcesPage) {
    notFound();
  }

  const { at, translatePortableText } = await getServerTranslations();

  // Filtrer les FAQ pour ne garder que les FAQ générales de niveau global (ex: category === 'general' ou non rattachées à un guide particulier)
  const generalFaqs = allFaqs.filter((faq: any) => faq.category === 'general');

  const displayTitle = settingsData?.ressourcesPageTitle 
    ? at(settingsData.ressourcesPageTitle) 
    : at('Guides & Préparation');
  const displayDescription = settingsData?.ressourcesPageDescription
    ? translatePortableText(settingsData.ressourcesPageDescription)
    : at('Pour partir sereinement en altitude, la préparation est la clé. Retrouvez ici nos articles conseils, dossiers techniques sur le matériel et fiches pratiques classés par activités.');

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
            {displayTitle}
          </h1>
          <div className="text-foreground/60 text-lg md:text-xl leading-relaxed">
            {renderRichText(displayDescription)}
          </div>
        </div>

        {/* Client component for searching and interactive filtering */}
        <ResourcesListClient resources={resources} generalFaqs={generalFaqs} />
      </div>
    </main>
  );
}
