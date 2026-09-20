'use client'

import React, { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useLanguage } from '@/context/LanguageContext'
import emailjs from '@emailjs/browser'
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react'

const PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!
const TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!

type Status = 'idle' | 'sending' | 'success' | 'error'

export default function ContactForm() {
  const { at } = useLanguage()
  const formRef = useRef<HTMLFormElement>(null)
  const [status, setStatus] = useState<Status>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!formRef.current) return
    setStatus('sending')
    try {
      await emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, formRef.current, { publicKey: PUBLIC_KEY })
      setStatus('success')
      formRef.current.reset()
    } catch {
      setStatus('error')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="glass p-10 rounded-[40px]"
    >
      {status === 'success' ? (
        <div className="flex flex-col items-center justify-center py-12 text-center gap-4">
          <CheckCircle size={48} className="text-accent" />
          <p className="text-xl font-bold">{at('Message envoyé !')}</p>
          <p className="text-foreground/60 text-sm">{at('Je vous répondrai dans les plus brefs délais.')}</p>
          <button
            onClick={() => setStatus('idle')}
            className="mt-4 text-xs font-bold uppercase tracking-widest text-accent hover:underline"
          >
            {at('Envoyer un autre message')}
          </button>
        </div>
      ) : (
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-foreground/40 mb-2">
              {at('Nom complet')}
            </label>
            <input
              type="text"
              name="from_name"
              required
              className="w-full bg-foreground/5 border border-foreground/10 rounded-xl px-4 py-3 focus:outline-none focus:border-accent transition-colors text-foreground"
              placeholder={at('Votre nom')}
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-foreground/40 mb-2">
              {at('Email')}
            </label>
            <input
              type="email"
              name="reply_to"
              required
              className="w-full bg-foreground/5 border border-foreground/10 rounded-xl px-4 py-3 focus:outline-none focus:border-accent transition-colors text-foreground"
              placeholder="votre@email.com"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-foreground/40 mb-2">
              {at('Message')}
            </label>
            <textarea
              rows={4}
              name="message"
              required
              className="w-full bg-foreground/5 border border-foreground/10 rounded-xl px-4 py-3 focus:outline-none focus:border-accent transition-colors resize-none text-foreground"
              placeholder={at('Décrivez votre projet...')}
            />
          </div>

          {status === 'error' && (
            <div className="flex items-center gap-2 text-red-500 text-sm font-medium">
              <AlertCircle size={16} />
              {at("Une erreur est survenue. Veuillez réessayer ou nous contacter par téléphone.")}
            </div>
          )}

          <button
            type="submit"
            disabled={status === 'sending'}
            className="btn-primary w-full !text-white flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {status === 'sending' ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                {at('Envoi en cours...')}
              </>
            ) : (
              at('Envoyer le message')
            )}
          </button>
        </form>
      )}
    </motion.div>
  )
}
