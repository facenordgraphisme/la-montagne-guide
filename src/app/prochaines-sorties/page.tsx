import type { Metadata } from 'next';
import React from 'react'
import { client } from "@/sanity/lib/client";
import { sortiesQuery, settingsQuery } from "@/sanity/lib/queries";
import SortiesFilterableList from "@/components/SortiesFilterableList";
import { getServerTranslations } from '@/i18n/server';
import { renderRichText, toPlainText } from '@/utils/richText';

export async function generateMetadata(): Promise<Metadata> {
  const [settingsData] = await Promise.all([
    client.fetch(settingsQuery)
  ]);
  const { at } = await getServerTranslations();

  const title = settingsData?.sortiesPageTitle 
    ? `${at(settingsData.sortiesPageTitle)} | La Montagne Guide` 
    : `${at('Prochaines Sorties')} | La Montagne Guide`;

  const rawDesc = settingsData?.sortiesPageDescription;
  const description = rawDesc
    ? toPlainText(at(rawDesc))
    : at("Rejoignez-moi pour des aventures d'exception aux quatre coins du monde. Alpinisme, escalade, ski et voyages. Calendrier des départs collectifs.");

  return {
    title,
    description,
    alternates: {
      canonical: '/prochaines-sorties',
    },
  };
}

export default async function SortiesPage() {
  const [sorties, settingsData] = await Promise.all([
    client.fetch(sortiesQuery),
    client.fetch(settingsQuery)
  ]);
  const { at, t, translatePortableText } = await getServerTranslations();

  const displayTitle = settingsData?.sortiesPageTitle 
    ? at(settingsData.sortiesPageTitle) 
    : at('PROCHAINS DÉPARTS');
  const displayDescription = settingsData?.sortiesPageDescription
    ? translatePortableText(settingsData.sortiesPageDescription)
    : at("Une sélection d'aventures verticales et de voyages au long cours. Chaque sortie est encadrée personnellement pour garantir sécurité et immersion.");

  return (
    <main className="relative pt-32 min-h-screen bg-background">
      <div className="container mx-auto px-6 py-20">
        <div className="max-w-4xl mb-20">
          <span className="text-accent font-bold tracking-widest uppercase text-sm mb-4 block">{at('Calendrier')}</span>
          <h1 className="text-5xl md:text-8xl font-bold tracking-tighter mb-6 text-gradient uppercase leading-[0.9]">
            {displayTitle}
          </h1>
          <div className="text-foreground/60 text-xl max-w-2xl leading-relaxed">
            {renderRichText(displayDescription)}
          </div>
        </div>
        
        <SortiesFilterableList initialSorties={sorties} />
      </div>
    </main>
  );
}
