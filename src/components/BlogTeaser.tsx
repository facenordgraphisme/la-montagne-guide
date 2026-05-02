import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

const posts = [
  {
    title: "Expédition au coeur du Queyras",
    excerpt: "Retour sur une semaine de ski de randonnée entre crêtes sauvages et neige de cinéma...",
    date: "Mars 2026",
    image: "/photos/DSC_6614.jpg",
    slug: "expedition-queyras"
  },
  {
    title: "Les plus belles cascades de glace",
    excerpt: "Sélection des itinéraires incontournables pour s'initier ou se perfectionner cet hiver...",
    date: "Janvier 2026",
    image: "/photos/DSC_6753.jpg",
    slug: "cascades-glace-top"
  },
  {
    title: "Préparer sa saison d'alpinisme",
    excerpt: "Conseils d'expert pour l'entraînement physique et le choix du matériel avant l'été...",
    date: "Avril 2026",
    image: "/images/alpinisme.jpg",
    slug: "prepa-alpinisme"
  }
]

const BlogTeaser = () => {
  return (
    <section className="py-24 px-6">
      <div className="container mx-auto">
        <div className="flex justify-between items-end mb-16">
          <div>
            <span className="text-accent font-bold tracking-widest uppercase text-sm mb-4 block">Carnet de voyage</span>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tighter uppercase">DERNIERS <br /> <span className="text-accent italic">RÉCITS</span></h2>
          </div>
          <Link href="/blog" className="hidden md:block px-8 py-3 rounded-full border border-border hover:bg-foreground hover:text-background transition-all font-bold text-sm uppercase tracking-widest">
            Tout lire
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.map((post, i) => (
            <Link key={i} href={`/blog/${post.slug}`} className="group block">
              <div className="relative aspect-[16/10] rounded-[32px] overflow-hidden mb-6 shadow-lg">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <p className="text-accent font-bold text-xs uppercase tracking-widest mb-3">{post.date}</p>
              <h3 className="text-2xl font-bold mb-4 group-hover:text-accent transition-colors leading-tight">
                {post.title}
              </h3>
              <p className="text-foreground/60 leading-relaxed line-clamp-2">
                {post.excerpt}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export default BlogTeaser
