'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useTheme } from 'next-themes'
import { usePathname } from 'next/navigation'

const Footer = () => {
  const pathname = usePathname()
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Masquer le Footer dans le Studio Sanity
  if (pathname?.startsWith('/studio')) return null

  useEffect(() => setMounted(true), [])

  return (
    <footer className="py-20 px-6 bg-background border-t border-border">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="inline-block mb-8">
              {mounted && (
                <Image 
                  src={theme === 'dark' ? "/logo.webp" : "/logo-black.webp"} 
                  alt="La Montagne Guide" 
                  width={240} 
                  height={80} 
                  className="w-48 h-auto object-contain" 
                />
              )}
            </Link>
            <p className="text-foreground/60 max-w-sm text-lg leading-relaxed mb-8">
              Vivez l'exceptionnel en altitude avec un guide passionné. Sécurité, aventure et respect de la nature.
            </p>
            <div className="flex gap-4">
              {['Instagram', 'Facebook'].map((social) => (
                <a key={social} href="#" className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-foreground/5 transition-colors">
                  <span className="sr-only">{social}</span>
                  <div className="w-1 h-1 bg-accent rounded-full" />
                </a>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-bold mb-6 uppercase tracking-widest text-xs text-foreground/40">Navigation</h4>
            <ul className="space-y-4 text-foreground/70 font-medium">
              <li><Link href="/prestations" className="hover:text-accent transition-colors">Prestations</Link></li>
              <li><Link href="/prochaines-sorties" className="hover:text-accent transition-colors">Prochains départs</Link></li>
              <li><Link href="/le-guide" className="hover:text-accent transition-colors">Le Guide</Link></li>
              <li><Link href="/blog" className="hover:text-accent transition-colors">Blog</Link></li>
              <li><Link href="/contact" className="hover:text-accent transition-colors">Contact</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-6 uppercase tracking-widest text-xs text-foreground/40">Contact</h4>
            <ul className="space-y-4 text-foreground/70 font-medium">
              <li>draperinicolas@hotmail.com</li>
              <li>06 75 07 97 08</li>
              <li>Champcella, Hautes-Alpes</li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between gap-4 text-sm text-foreground/30 font-medium">
          <p>© {new Date().getFullYear()} La Montagne Guide. Tous droits réservés.</p>
          <div className="flex gap-8">
            <Link href="/mentions-legales" className="hover:text-accent transition-colors">Mentions Légales</Link>
            <Link href="/confidentialite" className="hover:text-accent transition-colors">Confidentialité</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer

