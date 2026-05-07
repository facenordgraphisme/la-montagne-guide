'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { useLanguage } from '@/context/LanguageContext'

export default function ContactForm() {
  const { at, t } = useLanguage()
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="glass p-10 rounded-[40px]"
    >
      <form className="space-y-6">
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-white/40 mb-2">{at('Nom complet')}</label>
          <input type="text" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-accent transition-colors text-white" placeholder={at("Votre nom")} />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-white/40 mb-2">{at('Email')}</label>
          <input type="email" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-accent transition-colors text-white" placeholder="votre@email.com" />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-white/40 mb-2">{at('Message')}</label>
          <textarea rows={4} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-accent transition-colors resize-none text-white" placeholder={at("Décrivez votre projet...")}></textarea>
        </div>
        <button className="btn-primary w-full !text-white">{at('Envoyer le message')}</button>
      </form>
    </motion.div>
  )
}
