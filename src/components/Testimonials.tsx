'use client'

import React from 'react'
import { motion } from 'framer-motion'

const testimonials = [
  {
    name: "Thomas Bernard",
    role: "Alpiniste amateur",
    text: "Une expérience inoubliable au sommet de la Barre des Écrins. Nicolas est un guide d'une sérénité absolue, ce qui est très rassurant quand on débute en haute montagne.",
    stars: 5
  },
  {
    name: "Sophie Morel",
    role: "Passionnée de Ski",
    text: "Nicolas nous a fait découvrir des vallons secrets du Queyras loin de la foule. Sa connaissance du terrain et de la sécurité est impressionnante. Je recommande les yeux fermés !",
    stars: 5
  },
  {
    name: "Marc Lefebvre",
    role: "Grimpeur",
    text: "Superbe journée en grande voie à Ailefroide. Nicolas a su me mettre en confiance sur des passages techniques. Un vrai partage de passion et de technique.",
    stars: 5
  }
]

const Testimonials = () => {
  return (
    <section className="py-24 px-6 bg-accent/5">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <span className="text-accent font-bold tracking-widest uppercase text-sm mb-4 block">Avis Clients</span>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tighter">ILS NOUS ONT FAIT <br /> <span className="text-accent italic">CONFIANCE</span></h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, index) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="glass p-10 rounded-[40px] flex flex-col justify-between h-full hover:border-accent transition-colors group"
            >
              <div>
                <div className="flex gap-1 mb-6">
                  {[...Array(t.stars)].map((_, i) => (
                    <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-highlight">
                      <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                    </svg>
                  ))}
                </div>
                <p className="text-lg text-foreground/80 leading-relaxed italic mb-8">
                  "{t.text}"
                </p>
              </div>
              <div>
                <p className="font-bold text-xl">{t.name}</p>
                <p className="text-sm text-accent font-medium">{t.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Testimonials
