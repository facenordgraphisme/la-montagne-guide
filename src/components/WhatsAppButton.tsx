'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { MessageCircle } from 'lucide-react'

interface WhatsAppButtonProps {
  phoneNumber: string
}

const WhatsAppButton = ({ phoneNumber }: WhatsAppButtonProps) => {
  if (!phoneNumber) return null

  // Remove any non-digit characters for the link
  const cleanNumber = phoneNumber.replace(/\D/g, '')
  
  // Ensure the number starts with a country code if needed (assuming French +33 if it starts with 0)
  const formattedNumber = cleanNumber.startsWith('0') 
    ? `33${cleanNumber.slice(1)}` 
    : cleanNumber

  const whatsappUrl = `https://wa.me/${formattedNumber}`

  return (
    <motion.a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="fixed bottom-8 right-8 z-[100] w-16 h-16 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-2xl transition-shadow hover:shadow-[0_0_20px_rgba(37,211,102,0.5)] group"
      aria-label="Contacter sur WhatsApp"
    >
      <MessageCircle size={32} className="fill-current" />
      
      {/* Tooltip */}
      <div className="absolute right-full mr-4 bg-white dark:bg-black px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl border border-foreground/5 text-foreground">
        Contactez le guide 👋
      </div>

      {/* Ping animation */}
      <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20" />
    </motion.a>
  )
}

export default WhatsAppButton
