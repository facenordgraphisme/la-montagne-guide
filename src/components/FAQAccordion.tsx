'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, HelpCircle } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'

interface FAQItem {
  _id: string
  question: string
  questionEn: string
  answer: string
  answerEn: string
  category: 'general' | 'technical' | 'safety' | string
}

interface FAQAccordionProps {
  faqs?: FAQItem[]
}

const DEFAULT_FAQS = [
  {
    _id: 'default-1',
    question: "Quel niveau physique et technique faut-il pour une première course d'alpinisme ?",
    questionEn: "What level of physical and technical fitness is required for a first mountaineering trip?",
    answer: "Pour une initiation (ex: Dôme de Neige des Écrins ou Glacier Blanc), une bonne condition physique générale suffit (être capable de marcher 5 à 6 heures en montée avec un sac à dos). Aucune expérience technique n'est requise au départ : le maniement des crampons et du piolet vous sera enseigné sur le glacier par votre guide.",
    answerEn: "For an introductory trip (e.g., Dôme de Neige des Écrins or Glacier Blanc), a good general physical fitness is sufficient (being able to walk 5 to 6 hours uphill with a backpack). No prior technical experience is required: the handling of crampons and ice axe will be taught on the glacier by your guide.",
    category: 'technical'
  },
  {
    _id: 'default-2',
    question: "Comment se déroule la réservation et le paiement ?",
    questionEn: "How does the booking and payment process work?",
    answer: "La réservation s'effectue par email ou via le formulaire de contact. Des arrhes de 30% sont demandées pour valider définitivement la date. Le solde est réglé directement au guide au début ou à la fin de la sortie (chèque, espèces ou virement). Les frais de refuge et de remontées mécaniques restent à votre charge directe.",
    answerEn: "Bookings can be made by email or through the contact form. A 30% deposit is required to secure the date. The balance is paid directly to the guide at the start or end of the outing (check, cash, or bank transfer). Mountain hut fees and ski lift passes are paid directly by you.",
    category: 'general'
  },
  {
    _id: 'default-3',
    question: "Que se passe-t-il en cas de mauvaise météo ?",
    questionEn: "What happens in case of bad weather?",
    answer: "La sécurité est la priorité absolue. En cas de météo défavorable ou de conditions de montagne dangereuses (risque d'avalanche élevé, chutes de pierres), le guide vous proposera un itinéraire de repli adapté, une autre activité (ex: escalade en basse vallée) ou un report de la sortie. Si aucune alternative n'est possible, les arrhes vous sont remboursées.",
    answerEn: "Safety is our absolute priority. In case of unfavorable weather or dangerous mountain conditions (high avalanche risk, rockfalls), the guide will suggest an alternative route, a different activity (e.g., low-valley rock climbing), or a postponement. If no alternative is possible, the deposit is refunded.",
    category: 'safety'
  }
]

export default function FAQAccordion({ faqs }: FAQAccordionProps) {
  const { language } = useLanguage()
  const [activeId, setActiveId] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const items = faqs && faqs.length > 0 ? faqs : DEFAULT_FAQS

  // Handle toggling FAQ items
  const toggleItem = (id: string) => {
    setActiveId(activeId === id ? null : id)
  }

  // Categories definition
  const categories = [
    { value: 'all', labelFr: 'Toutes', labelEn: 'All' },
    { value: 'general', labelFr: 'Réservations', labelEn: 'Booking' },
    { value: 'technical', labelFr: 'Équipement', labelEn: 'Equipment' },
    { value: 'safety', labelFr: 'Sécurité', labelEn: 'Safety' }
  ]

  // Filter items
  const filteredItems = selectedCategory === 'all'
    ? items
    : items.filter(item => item.category === selectedCategory)

  return (
    <section className="py-20 w-full relative">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-12">
          <span className="text-accent font-bold tracking-widest uppercase text-xs mb-3 block">
            {language === 'en' ? 'GOT QUESTIONS?' : 'UNE QUESTION ?'}
          </span>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
            {language === 'en' ? 'Frequently Asked Questions' : 'Foire Aux Questions'}
          </h2>
          <div className="w-16 h-1 bg-accent mx-auto rounded-full mt-4" />
        </div>

        {/* Categories Tab Selector */}
        <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-10">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.value
            const label = language === 'en' ? cat.labelEn : cat.labelFr
            return (
              <button
                key={cat.value}
                onClick={() => {
                  setSelectedCategory(cat.value)
                  setActiveId(null) // Reset active open FAQ on category switch
                }}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold tracking-wide border transition-all duration-300 ${
                  isActive
                    ? 'bg-accent border-accent text-white shadow-[0_0_15px_rgba(0,242,254,0.3)]'
                    : 'bg-white/[0.02] border-white/5 text-foreground/60 hover:text-white hover:border-white/10'
                }`}
              >
                {label}
              </button>
            )
          })}
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item, index) => {
              const isOpen = activeId === item._id
              const question = language === 'en' ? item.questionEn : item.question
              const answer = language === 'en' ? item.answerEn : item.answer

              return (
                <motion.div
                  key={item._id}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.3 }}
                  className={`glass border rounded-3xl overflow-hidden transition-all duration-300 ${
                    isOpen 
                      ? 'border-accent/40 bg-white/[0.03] shadow-[0_4px_30px_rgba(0,242,254,0.05)]' 
                      : 'border-white/5 bg-white/[0.01] hover:border-white/10 hover:bg-white/[0.02]'
                  }`}
                >
                  {/* Accordion Trigger */}
                  <button
                    onClick={() => toggleItem(item._id)}
                    className="w-full flex items-center justify-between gap-6 px-6 md:px-8 py-5 text-left text-base md:text-lg font-bold text-white transition-colors duration-200"
                  >
                    <span className="flex items-center gap-3">
                      <HelpCircle className={`w-5 h-5 shrink-0 transition-colors duration-300 ${isOpen ? 'text-accent' : 'text-foreground/40'}`} />
                      {question}
                    </span>
                    <span className={`p-1.5 rounded-full bg-white/5 text-foreground/50 transition-all duration-300 ${isOpen ? 'rotate-180 bg-accent/15 text-accent' : 'group-hover:text-white'}`}>
                      <ChevronDown className="w-4 h-4" />
                    </span>
                  </button>

                  {/* Accordion Content */}
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 md:px-8 pb-6 text-sm md:text-base text-foreground/70 leading-relaxed border-t border-white/5 pt-4">
                          <p>{answer}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )
            })}
          </AnimatePresence>
          
          {filteredItems.length === 0 && (
            <div className="text-center py-12 text-foreground/40 text-sm">
              {language === 'en' ? 'No FAQs in this category.' : 'Aucune question dans cette catégorie.'}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
