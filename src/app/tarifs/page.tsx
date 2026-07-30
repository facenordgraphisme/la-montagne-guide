import type { Metadata } from 'next';
import React from 'react'
import { client } from "@/sanity/lib/client";
import { settingsQuery } from "@/sanity/lib/queries";
import { getServerTranslations } from '@/i18n/server';
import { notFound } from 'next/navigation';
import { renderRichText, toPlainText } from '@/utils/richText';

export async function generateMetadata(): Promise<Metadata> {
  const [settingsData] = await Promise.all([
    client.fetch(settingsQuery)
  ]);
  const { at } = await getServerTranslations();

  if (settingsData?.hideTarifsPage) {
    return {};
  }

  const title = settingsData?.tarifsPageTitle 
    ? `${at(settingsData.tarifsPageTitle)} | La Montagne Guide` 
    : `${at('Tarifs')} | La Montagne Guide`;

  const rawDesc = settingsData?.tarifsPageDescription;
  const description = rawDesc
    ? toPlainText(at(rawDesc))
    : at('Retrouvez tous mes tarifs pour l\'encadrement en haute montagne, escalade, ski de randonnée et alpinisme.');

  return {
    title,
    description,
    alternates: {
      canonical: '/tarifs',
    },
  };
}

export default async function TarifsPage() {
  const settingsData = await client.fetch(settingsQuery);

  if (settingsData?.hideTarifsPage) {
    notFound();
  }

  const { at, translatePortableText } = await getServerTranslations();

  const displayTitle = settingsData?.tarifsPageTitle 
    ? at(settingsData.tarifsPageTitle) 
    : at('Mes Tarifs');
  const displayDescription = settingsData?.tarifsPageDescription
    ? translatePortableText(settingsData.tarifsPageDescription)
    : at('Retrouvez le récapitulatif des tarifs d\'encadrement pour mes différentes formules d\'accompagnement en montagne.');

  return (
    <main className="relative pt-32 min-h-screen">
      {/* Background glow effects */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-highlight/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-6 py-20 relative z-10">
        <div className="max-w-3xl mb-16">
          <span className="text-accent font-black tracking-widest uppercase text-xs mb-4 block">
            {at('INFORMATIONS & TARIFS')}
          </span>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 text-gradient uppercase">
            {displayTitle}
          </h1>
          <div className="text-foreground/60 text-lg md:text-xl leading-relaxed">
            {renderRichText(displayDescription)}
          </div>
        </div>

        {/* Content Section */}
        {settingsData?.tarifsContent && (
          <div className="glass p-8 md:p-16 rounded-[40px] border border-border bg-card/5 max-w-4xl mx-auto prose prose-invert prose-custom">
            {renderRichText(translatePortableText(settingsData.tarifsContent) || at(settingsData.tarifsContent))}
          </div>
        )}
      </div>
    </main>
  );
}
