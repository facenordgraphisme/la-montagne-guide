'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useTheme } from 'next-themes'
import { Moon, Sun } from 'lucide-react'

const Navbar = () => {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-6xl glass rounded-full px-8 py-4 flex items-center justify-between shadow-2xl"


    >
      <Link href="/" className="flex items-center">
        {mounted && (
          <Image
            src={theme === 'dark' ? "/logo.webp" : "/logo-black.webp"}
            alt="La Montagne Guide"
            width={240}
            height={80}
            className="w-40 h-auto md:w-48 lg:w-56 object-contain"
            priority
          />
        )}
      </Link>







      <div className="flex items-center gap-4 md:gap-8 text-sm font-medium">
        <div className="hidden lg:flex items-center gap-8 text-foreground/80">
          {/* Prestations with Submenu */}
          <div className="relative group/menu py-4">
            <Link href="/prestations" className="hover:text-accent transition-colors flex items-center gap-1">
              Activités
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3 h-3 group-hover/menu:rotate-180 transition-transform">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </Link>

            {/* Submenu Card */}
            <div className="absolute top-full left-0 pt-2 opacity-0 translate-y-4 pointer-events-none group-hover/menu:opacity-100 group-hover/menu:translate-y-0 group-hover/menu:pointer-events-auto transition-all duration-300">
              <div className="glass rounded-[32px] p-6 w-[900px] grid grid-cols-3 gap-6 shadow-2xl border border-white/10">

                {[
                  { title: "Alpinisme", slug: "alpinisme", image: "/images/alpinisme.jpg" },
                  { title: "Ski", slug: "ski", image: "/images/ski.jpg" },
                  { title: "Escalade", slug: "escalade", image: "/images/escalade.jpg" },
                  { title: "Cascade de Glace", slug: "cascade-de-glace", image: "/photos/DSC_6753.jpg" },
                  { title: "Paralpinisme", slug: "paralpinisme", image: "/photos/DSC_6701.jpg" },
                  { title: "Voyages", slug: "voyages", image: "/photos/2017-06-15 12.01.27.jpg" },
                ].map((item) => (

                  <Link
                    key={item.slug}
                    href={`/prestations/${item.slug}`}
                    className="relative aspect-[16/9] rounded-2xl overflow-hidden group/item shadow-lg"
                  >
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover/item:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute inset-0 p-4 flex flex-col justify-end">
                      <p className="font-bold text-white text-lg tracking-tight">{item.title}</p>
                      <p className="text-white/60 text-xs font-medium uppercase tracking-widest">En savoir plus</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

          </div>

          <Link href="/prochaines-sorties" className="hover:text-accent transition-colors">Sorties</Link>
          <Link href="/le-guide" className="hover:text-accent transition-colors">Le Guide</Link>
          <Link href="/blog" className="hover:text-accent transition-colors">Blog</Link>
        </div>

        <div className="flex items-center gap-2">
          {mounted && (
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-full hover:bg-foreground/5 transition-colors text-foreground"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          )}
          <Link href="/contact" className="btn-primary py-2 px-5 text-sm !text-white">Contact</Link>
        </div>
      </div>



    </motion.nav>
  )
}

export default Navbar

