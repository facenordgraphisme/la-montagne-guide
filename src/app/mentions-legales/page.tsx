import type { Metadata } from 'next';
import React from 'react';
import { getServerTranslations } from '@/i18n/server';

export async function generateMetadata(): Promise<Metadata> {
  const { at } = await getServerTranslations();
  return {
    title: `${at('Mentions Légales')} | La Montagne Guide`,
    description: at("Mentions légales et informations obligatoires concernant le site La Montagne Guide."),
  };
}

export default async function MentionsLegalesPage() {
  const { at } = await getServerTranslations();

  return (
    <main className="relative pt-32 min-h-screen bg-background text-foreground transition-colors duration-300">
      <div className="container mx-auto px-6 py-20 max-w-4xl">
        <div className="mb-12">
          <span className="text-accent font-bold tracking-widest uppercase text-sm mb-4 block">
            {at('Informations')}
          </span>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-8 bg-gradient-to-r from-foreground to-foreground/40 bg-clip-text text-transparent uppercase">
            {at('MENTIONS LÉGALES')}
          </h1>
          <div className="h-1 w-20 bg-accent rounded-full mb-12" />
        </div>

        <div className="space-y-12 text-foreground/80 leading-relaxed font-medium">
          {/* Section 1 */}
          <section className="glass p-8 md:p-10 rounded-[2rem] border border-border shadow-md">
            <h2 className="text-2xl font-bold mb-4 text-foreground uppercase tracking-wide">
              {at('1. Présentation du site')}
            </h2>
            <p className="mb-4">
              {at("En vertu de l'article 6 de la loi n° 2004-575 du 21 juin 2004 pour la confiance dans l'économie numérique, il est précisé aux utilisateurs du site l'identité des différents intervenants dans le cadre de sa réalisation et de son suivi :")}
            </p>
            <ul className="list-disc list-inside space-y-2 text-foreground/70">
              <li><strong>{at('Propriétaire & Éditeur :')}</strong> Nicolas Draperi – Guide de Haute Montagne – Champcella, Hautes-Alpes</li>
              <li><strong>{at('SIRET :')}</strong> 800 248 107 00021</li>
              <li><strong>{at('Directeur de la publication :')}</strong> Nicolas Draperi</li>
              <li><strong>{at('Contact :')}</strong> draperinicolas@hotmail.com | 06 75 07 97 08</li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="glass p-8 md:p-10 rounded-[2rem] border border-border shadow-md">
            <h2 className="text-2xl font-bold mb-4 text-foreground uppercase tracking-wide">
              {at('2. Hébergement')}
            </h2>
            <p>
              {at("Le site est hébergé par la société Vercel Inc., située au 340 S Lemon Ave #4133 Walnut, CA 91789, États-Unis. La gestion de contenu (CMS) est assurée par la plateforme Sanity.io.")}
            </p>
          </section>

          {/* Section 3 */}
          <section className="glass p-8 md:p-10 rounded-[2rem] border border-border shadow-md">
            <h2 className="text-2xl font-bold mb-4 text-foreground uppercase tracking-wide">
              {at('3. Propriété intellectuelle')}
            </h2>
            <p className="mb-4">
              {at("Nicolas Draperi est propriétaire des droits de propriété intellectuelle ou détient les droits d'usage sur tous les éléments accessibles sur le site, notamment les textes, images, graphismes, logo, icônes, sons et logiciels.")}
            </p>
            <p>
              {at("Toute reproduction, représentation, modification, publication, adaptation de tout ou partie des éléments du site, quel que soit le moyen ou le procédé utilisé, est interdite, sauf autorisation écrite préalable de Nicolas Draperi.")}
            </p>
          </section>

          {/* Section 4 */}
          <section className="glass p-8 md:p-10 rounded-[2rem] border border-border shadow-md">
            <h2 className="text-2xl font-bold mb-4 text-foreground uppercase tracking-wide">
              {at('4. Limitation de responsabilité')}
            </h2>
            <p className="mb-4">
              {at("Nicolas Draperi ne pourra être tenu responsable des dommages directs et indirects causés au matériel de l'utilisateur, lors de l'accès au site, et résultant soit de l'utilisation d'un matériel ne répondant pas aux spécifications indiquées, soit de l'apparition d'un bug ou d'une incompatibilité.")}
            </p>
            <p>
              {at("Les activités de montagne comportent des risques inhérents. Les informations fournies sur ce site le sont à titre informatif et indicatif. Seul l'engagement professionnel et direct du guide permet de valider les conditions de sécurité sur le terrain.")}
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
