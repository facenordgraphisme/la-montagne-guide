import type { Metadata } from 'next';
import React from 'react';
import { getServerTranslations } from '@/i18n/server';

export async function generateMetadata(): Promise<Metadata> {
  const { at } = await getServerTranslations();
  return {
    title: `${at('Politique de Confidentialité')} | La Montagne Guide`,
    description: at("Politique de confidentialité et protection des données personnelles de La Montagne Guide."),
  };
}

export default async function ConfidentialitePage() {
  const { at } = await getServerTranslations();

  return (
    <main className="relative pt-32 min-h-screen bg-background text-foreground transition-colors duration-300">
      <div className="container mx-auto px-6 py-20 max-w-4xl">
        <div className="mb-12">
          <span className="text-accent font-bold tracking-widest uppercase text-sm mb-4 block">
            {at('Données')}
          </span>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-8 bg-gradient-to-r from-foreground to-foreground/40 bg-clip-text text-transparent uppercase">
            {at('CONFIDENTIALITÉ')}
          </h1>
          <div className="h-1 w-20 bg-accent rounded-full mb-12" />
        </div>

        <div className="space-y-12 text-foreground/80 leading-relaxed font-medium">
          {/* Section 1 */}
          <section className="glass p-8 md:p-10 rounded-[2rem] border border-border shadow-md">
            <h2 className="text-2xl font-bold mb-4 text-foreground uppercase tracking-wide">
              {at('1. Collecte des informations')}
            </h2>
            <p className="mb-4">
              {at("Nous recueillons des informations lorsque vous utilisez notre formulaire de contact sur ce site. Les informations recueillies incluent votre nom, votre adresse e-mail et votre numéro de téléphone.")}
            </p>
            <p>
              {at("De plus, nous recevons et enregistrons automatiquement des informations à partir de votre ordinateur et navigateur, y compris votre adresse IP, vos logiciels et votre matériel, et la page que vous demandez à des fins statistiques.")}
            </p>
          </section>

          {/* Section 2 */}
          <section className="glass p-8 md:p-10 rounded-[2rem] border border-border shadow-md">
            <h2 className="text-2xl font-bold mb-4 text-foreground uppercase tracking-wide">
              {at('2. Utilisation des informations')}
            </h2>
            <p className="mb-4">
              {at("Toutes les informations que nous recueillons auprès de vous peuvent être utilisées pour :")}
            </p>
            <ul className="list-disc list-inside space-y-2 text-foreground/70">
              <li>{at("Personnaliser votre expérience et répondre à vos besoins individuels")}</li>
              <li>{at("Fournir un contenu et des informations personnalisés pour vos futures sorties")}</li>
              <li>{at("Vous contacter par e-mail ou par téléphone pour l'organisation de vos prestations")}</li>
              <li>{at("Améliorer les performances et l'ergonomie de notre site internet")}</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="glass p-8 md:p-10 rounded-[2rem] border border-border shadow-md">
            <h2 className="text-2xl font-bold mb-4 text-foreground uppercase tracking-wide">
              {at('3. Confidentialité et transmission des données')}
            </h2>
            <p>
              {at("Nous sommes les seuls propriétaires des informations collectées sur ce site. Vos informations personnelles ne seront pas vendues, échangées, transférées, ou données à une autre société pour n'importe quel motif, sans votre consentement, en dehors de ce qui est nécessaire pour répondre à une demande d'inscription ou organiser les hébergements collectifs de vos séjours.")}
            </p>
          </section>

          {/* Section 4 */}
          <section className="glass p-8 md:p-10 rounded-[2rem] border border-border shadow-md">
            <h2 className="text-2xl font-bold mb-4 text-foreground uppercase tracking-wide">
              {at('4. Vos droits concernant vos données')}
            </h2>
            <p>
              {at("Conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi Informatique et Libertés, vous disposez d'un droit d'accès, de rectification, de portabilité et de suppression de vos données personnelles. Vous pouvez exercer ces droits à tout moment en nous envoyant un e-mail à :")} <strong>draperinicolas@hotmail.com</strong>.
            </p>
          </section>

          {/* Section 5 */}
          <section className="glass p-8 md:p-10 rounded-[2rem] border border-border shadow-md">
            <h2 className="text-2xl font-bold mb-4 text-foreground uppercase tracking-wide">
              {at('5. Cookies')}
            </h2>
            <p>
              {at("Nos cookies améliorent l'accès à notre site et identifient les visiteurs réguliers (par exemple pour conserver votre préférence de langue d'une visite à l'autre). Cependant, cette utilisation des cookies n'est en aucune façon liée à des informations personnelles identifiables sur notre site.")}
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
