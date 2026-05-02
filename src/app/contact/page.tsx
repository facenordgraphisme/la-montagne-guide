'use client'

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

export default function ContactPage() {
  return (
    <main className="relative pt-32 min-h-screen">
      <Navbar />
      <div className="container mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-8 text-center">CONTACT</h1>
            <p className="text-white/60 text-center text-lg mb-16">
              Une question ? Un projet de sommet ? Envoyez-moi un message et je vous répondrai dans les plus brefs délais.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="glass p-10 rounded-[40px]">
                <form className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-white/40 mb-2">Nom complet</label>
                    <input type="text" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-accent transition-colors" placeholder="Votre nom" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-white/40 mb-2">Email</label>
                    <input type="email" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-accent transition-colors" placeholder="votre@email.com" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-white/40 mb-2">Message</label>
                    <textarea rows={4} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-accent transition-colors resize-none" placeholder="Décrivez votre projet..."></textarea>
                  </div>
                  <button className="btn-primary w-full">Envoyer le message</button>
                </form>
              </div>
              
              <div className="flex flex-col justify-center space-y-12">
                <div>
                  <h4 className="font-bold text-accent mb-2 uppercase tracking-widest text-xs">Email</h4>
                  <p className="text-2xl font-bold">draperinicolas@hotmail.com</p>
                </div>
                <div>
                  <h4 className="font-bold text-accent mb-2 uppercase tracking-widest text-xs">Téléphone</h4>
                  <p className="text-2xl font-bold">06 75 07 97 08</p>
                </div>
                <div>
                  <h4 className="font-bold text-accent mb-2 uppercase tracking-widest text-xs">Localisation</h4>
                  <p className="text-2xl font-bold">Champcella, Hautes-Alpes</p>
                </div>
              </div>

            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
