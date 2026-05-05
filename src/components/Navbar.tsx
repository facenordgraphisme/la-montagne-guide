'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from 'next-themes'
import { Moon, Sun, Menu, X, ChevronDown } from 'lucide-react'

const Navbar = () => {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [isActivitiesOpen, setIsActivitiesOpen] = useState(false)

  useEffect(() => setMounted(true), [])

  const activities = [
    { title: "Alpinisme", slug: "alpinisme", image: "/images/alpinisme.jpg" },
    { title: "Ski", slug: "ski", image: "/images/ski.jpg" },
    { title: "Escalade", slug: "escalade", image: "/images/escalade.jpg" },
    { title: "Cascade de Glace", slug: "cascade-de-glace", image: "/photos/DSC_6753.jpg" },
    { title: "Paralpinisme", slug: "paralpinisme", image: "/photos/DSC_6701.jpg" },
    { title: "Voyages", slug: "voyages", image: "/photos/2017-06-15 12.01.27.jpg" },
  ]

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed top-6 left-1/2 -translate-x-1/2 z-[60] w-[95%] max-w-6xl glass rounded-full px-4 md:px-8 py-3 md:py-4 flex items-center justify-between shadow-2xl"
      >
        <Link href="/" className="flex items-center" onClick={() => setIsOpen(false)}>
          {mounted && (
            <Image
              src={theme === 'dark' ? "/logo.webp" : "/logo-black.webp"}
              alt="La Montagne Guide"
              width={240}
              height={80}
              className="w-32 h-auto md:w-48 lg:w-56 object-contain"
              priority
            />
          )}
        </Link>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-8 text-sm font-medium">
          <div className="flex items-center gap-8 text-foreground/80">
            {/* Prestations with Submenu */}
            <div className="relative group/menu py-4">
              <Link href="/prestations" className="hover:text-accent transition-colors flex items-center gap-1">
                Activités
                <ChevronDown className="w-3 h-3 group-hover/menu:rotate-180 transition-transform" />
              </Link>

              {/* Submenu Card */}
              <div className="absolute top-full left-0 pt-2 opacity-0 translate-y-4 pointer-events-none group-hover/menu:opacity-100 group-hover/menu:translate-y-0 group-hover/menu:pointer-events-auto transition-all duration-300">
                <div className="glass rounded-[32px] p-6 w-[900px] grid grid-cols-3 gap-6 shadow-2xl border border-white/10">
                  {activities.map((item) => (
                    <Link
                      key={item.slug}
                      href={`/${item.slug}`}
                      className="relative aspect-[16/9] rounded-2xl overflow-hidden group/item shadow-lg"
                    >
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        sizes="(max-width: 1024px) 100vw, 300px"
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
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          {mounted && (
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-full hover:bg-foreground/5 transition-colors text-foreground"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          )}
          <Link href="/contact" className="hidden sm:block btn-primary py-2 px-5 text-sm !text-white">Contact</Link>
          
          {/* Mobile Menu Button */}
          <button 
            className="lg:hidden p-2 text-foreground"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-x-0 top-0 pt-28 pb-12 z-[50] glass lg:hidden max-h-screen overflow-y-auto"
          >
            <div className="flex flex-col items-center gap-6 px-6">
              <div className="w-full flex flex-col items-center">
                <button 
                  onClick={() => setIsActivitiesOpen(!isActivitiesOpen)}
                  className="w-full flex items-center justify-between py-4 text-xl font-semibold border-b border-foreground/10"
                >
                  Activités
                  <ChevronDown className={`w-5 h-5 transition-transform ${isActivitiesOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {isActivitiesOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="w-full overflow-hidden grid grid-cols-1 sm:grid-cols-2 gap-4 py-4"
                    >
                      {activities.map((item) => (
                        <Link
                          key={item.slug}
                          href={`/${item.slug}`}
                          onClick={() => setIsOpen(false)}
                          className="relative h-24 rounded-xl overflow-hidden group"
                        >
                          <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            sizes="(max-width: 768px) 100vw, 300px"
                            className="object-cover"
                          />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <span className="text-white font-bold">{item.title}</span>
                          </div>
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {[
                { name: "Sorties", href: "/prochaines-sorties" },
                { name: "Le Guide", href: "/le-guide" },
                { name: "Blog", href: "/blog" },
                { name: "Contact", href: "/contact" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="w-full py-4 text-xl font-semibold border-b border-foreground/10"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default Navbar

