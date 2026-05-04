import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { client } from "@/sanity/lib/client";
import { contactQuery } from "@/sanity/lib/queries";
import ContactForm from "@/components/ContactForm"; // I'll create this

export default async function ContactPage() {
  const data = await client.fetch(contactQuery);

  const contact = data || {
    title: "CONTACT",
    description: "Une question ? Un projet de sommet ? Envoyez-moi un message et je vous répondrai dans les plus brefs délais.",
    email: "draperinicolas@hotmail.com",
    phone: "06 75 07 97 08",
    location: "Champcella, Hautes-Alpes"
  };

  return (
    <main className="relative pt-32 min-h-screen">
      <Navbar />
      <div className="container mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-8">{contact.title}</h1>
            <p className="text-white/60 text-lg max-w-2xl mx-auto">
              {contact.description}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <ContactForm />
            
            <div className="flex flex-col justify-center space-y-12">
              <div>
                <h4 className="font-bold text-accent mb-2 uppercase tracking-widest text-xs">Email</h4>
                <p className="text-2xl font-bold text-white">{contact.email}</p>
              </div>
              <div>
                <h4 className="font-bold text-accent mb-2 uppercase tracking-widest text-xs">Téléphone</h4>
                <p className="text-2xl font-bold text-white">{contact.phone}</p>
              </div>
              <div>
                <h4 className="font-bold text-accent mb-2 uppercase tracking-widest text-xs">Localisation</h4>
                <p className="text-2xl font-bold text-white">{contact.location}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
