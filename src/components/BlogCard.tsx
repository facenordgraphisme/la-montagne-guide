'use client'

import Link from 'next/link';
import Image from 'next/image';
import { Calendar } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface BlogCardProps {
  post: {
    title: string;
    slug: string;
    date: string;
    image: string;
    excerpt?: string;
  };
}

export default function BlogCard({ post }: BlogCardProps) {
  const { at, t, language } = useLanguage();
  const formattedDate = new Date(post.date).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <div className="glass overflow-hidden rounded-[2rem] border border-border bg-card/5 transition-all duration-500 hover:bg-card/10 hover:border-accent/40 hover:scale-[1.02] h-full flex flex-col">
        {/* Image Container */}
        <div className="relative h-64 overflow-hidden">
          {post.image ? (
            <Image
              src={post.image}
              alt={at(post.title)}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-foreground/10 to-foreground/5 flex items-center justify-center">
               <span className="text-foreground/20 font-bold uppercase tracking-widest text-[10px]">{at('Image bientôt disponible')}</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>

        {/* Content */}
        <div className="p-8 flex-1 flex flex-col">
          <div className="flex items-center gap-2 text-accent text-sm font-medium mb-4">
            <Calendar size={14} />
            <span>{formattedDate}</span>
          </div>
          
          <h3 className="text-2xl font-bold mb-4 group-hover:text-accent transition-colors duration-300">
            {at(post.title)}
          </h3>
          
          {post.excerpt && (
            <p className="text-foreground/60 line-clamp-3 mb-6 flex-1">
              {at(post.excerpt)}
            </p>
          )}

          <div className="flex items-center gap-2 text-sm font-bold tracking-wider text-foreground group-hover:gap-4 transition-all duration-300">
            {at("LIRE L'ARTICLE")}
            <span className="text-accent">→</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
