import type { Metadata } from 'next';
import Image from 'next/image';
import { Mail, Phone, MapPin } from 'lucide-react';
import { client } from "@/sanity/lib/live";
import { contactQuery, faqsQuery } from "@/sanity/lib/queries";
import ContactForm from "@/components/ContactForm";
import FAQAccordion from "@/components/FAQAccordion";
import FaqJsonLd from '@/components/FaqJsonLd';
import ObfuscatedContact from "@/components/ObfuscatedContact";

import { getServerTranslations } from '@/i18n/server';

export async function generateMetadata(): Promise<Metadata> {
  const [data] = await Promise.all([
    client.fetch(contactQuery),
  ]);
  const { at } = await getServerTranslations();

  const title = `${at(data?.title || 'Contact')} | La Montagne Guide`;
  const description = data?.description ? at(data.description) : "Contactez Nicolas Draperi, guide de haute montagne. Projet de sommet, question technique, demande d'information.";

  return {
    title,
    description,
  };
}

export default async function ContactPage() {
  const [data, faqsData] = await Promise.all([
    client.fetch(contactQuery),
    client.fetch(faqsQuery)
  ]);
  const { at, lang } = await getServerTranslations();

  const contact = {
    title: 'CONTACT',
    email: "draperinicolas@hotmail.com",
    phone: "+33 (0)6 75 07 97 08",
    location: "Champcella, Hautes-Alpes",
    ...data,
  };
  const heading = lang === 'en'
    ? (contact.headingEn || at(contact.heading || "Besoin d'infos ?"))
    : (contact.heading || "Besoin d'infos ?");
  const phoneHref = contact.phone ? `tel:${contact.phone.replace(/[\s().]/g, '')}` : null;

  return (
    <main className="relative pt-28">
      <section className="grid grid-cols-1 lg:grid-cols-2 lg:min-h-[calc(100vh-7rem)]">
        {/* Photo */}
        <div className="relative hidden lg:block">
          {contact.image ? (
            <Image
              src={contact.image}
              alt={contact.imageAlt || heading}
              fill
              sizes="50vw"
              className="object-cover"
              priority
            />
          ) : (
            <div className="absolute inset-0 bg-linear-to-br from-accent/30 via-accent/10 to-highlight/20" />
          )}
          <div className="absolute inset-0 bg-linear-to-r from-transparent via-transparent to-background" />
          <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent" />
          <p className="absolute bottom-12 left-12 right-24 text-white text-3xl font-black uppercase tracking-tighter leading-tight drop-shadow-lg">
            {at('Faites-moi part de vos envies !')}
          </p>
        </div>

        {/* Content */}
        <div className="flex items-center px-6 md:px-12 xl:px-20 py-16">
          <div className="w-full max-w-xl mx-auto lg:mx-0">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-accent mb-4">{at(contact.title)}</p>
            <h1 className="text-5xl md:text-6xl font-black tracking-tighter uppercase leading-[0.95] mb-6">
              {heading}
            </h1>
            <p className="text-lg text-foreground/70 mb-2 text-left">{at("Demande-moi conseil, ça n'engage à rien !")}</p>
            {contact.description && (
              <p className="text-foreground/60 mb-8 text-left">{at(contact.description)}</p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
              {contact.email && (
                <div className="glass rounded-2xl p-4 flex items-start gap-3 sm:col-span-2">
                  <Mail size={20} className="text-accent shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-foreground/40">{at('Email')}</p>
                    <p className="font-bold break-all"><ObfuscatedContact type="email" value={contact.email} /></p>
                  </div>
                </div>
              )}
              {contact.phone && (
                <div className="glass rounded-2xl p-4 flex items-start gap-3">
                  <Phone size={20} className="text-accent shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-foreground/40">{at('Téléphone')}</p>
                    <p className="font-bold"><ObfuscatedContact type="phone" value={contact.phone} /></p>
                  </div>
                </div>
              )}
              {contact.location && (
                <div className="glass rounded-2xl p-4 flex items-start gap-3">
                  <MapPin size={20} className="text-accent shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-foreground/40">{at('Localisation')}</p>
                    <p className="font-bold">{at(contact.location)}</p>
                  </div>
                </div>
              )}
            </div>

            <ContactForm />

            {phoneHref && (
              <a
                href={phoneHref}
                className="mt-6 flex w-full items-center justify-center gap-3 rounded-full border border-border px-8 py-4 text-sm font-black uppercase tracking-widest hover:border-accent/60 hover:text-accent transition-colors"
              >
                <Phone size={18} />
                {at('Appelez-moi')}
              </a>
            )}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <FaqJsonLd faqs={faqsData} lang={lang} />
          <FAQAccordion faqs={faqsData} initialVisible={6} />
        </div>
      </section>
    </main>
  );
}
