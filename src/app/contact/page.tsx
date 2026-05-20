import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { client } from "@/sanity/lib/client";
import { contactQuery, faqsQuery } from "@/sanity/lib/queries";
import ContactForm from "@/components/ContactForm";
import FAQAccordion from "@/components/FAQAccordion";

import { getServerTranslations } from '@/i18n/server';

export default async function ContactPage() {
  const [data, faqsData] = await Promise.all([
    client.fetch(contactQuery),
    client.fetch(faqsQuery)
  ]);
  const { at, t } = await getServerTranslations();

  const contact = data || {
    title: at("CONTACT"),
    description: at("Une question ? Un projet de sommet ? Envoyez-moi un message et je vous répondrai dans les plus brefs délais."),
    email: "draperinicolas@hotmail.com",
    phone: "06 75 07 97 08",
    location: at("Champcella, Hautes-Alpes")
  };

  return (
    <main className="relative pt-32 min-h-screen">
      <div className="container mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-8">{at(contact.title)}</h1>
            <p className="text-white/60 text-lg max-w-2xl mx-auto">
              {at(contact.description)}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <ContactForm />
            
            <div className="flex flex-col justify-center space-y-12">
              <div>
                <h4 className="font-bold text-accent mb-2 uppercase tracking-widest text-xs">{at('Email')}</h4>
                <p className="text-2xl font-bold text-white">{contact.email}</p>
              </div>
              <div>
                <h4 className="font-bold text-accent mb-2 uppercase tracking-widest text-xs">{at('Téléphone')}</h4>
                <p className="text-2xl font-bold text-white">{contact.phone}</p>
              </div>
              <div>
                <h4 className="font-bold text-accent mb-2 uppercase tracking-widest text-xs">{at('Localisation')}</h4>
                <p className="text-2xl font-bold text-white">{at(contact.location)}</p>
              </div>
            </div>
          </div>
          
          <div className="mt-24 border-t border-white/5 pt-12">
            <FAQAccordion faqs={faqsData} />
          </div>
        </div>
      </div>
    </main>
  );
}
