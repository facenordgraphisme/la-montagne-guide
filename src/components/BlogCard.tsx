'use client'

import Link from 'next/link';
import Image from 'next/image';
import { Calendar } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { formatFriendlyDate } from '@/utils/date';
import { getVanityImageUrl } from '@/sanity/lib/image';

interface BlogCardProps {
  post: {
    title: string;
    titleEn?: string;
    slug: string;
    slugEn?: string;
    date: string;
    image: string;
    imageAlt?: string;
    imageAltEn?: string;
    imageName?: string;
    excerpt?: string;
    excerptEn?: string;
  };
}

export default function BlogCard({ post }: BlogCardProps) {
  const { at, t, language } = useLanguage();
  const formattedDate = formatFriendlyDate(post.date, language as 'fr' | 'en');
  const displayTitle = { fr: post.title, en: post.titleEn };
  const displayAlt = language === 'en' ? (post.imageAltEn || post.imageAlt) : post.imageAlt;
  const displayExcerpt = language === 'en' ? (post.excerptEn || post.excerpt) : post.excerpt;

  const href = language === 'en' && post.slugEn ? `/en/${post.slugEn}` : `/${post.slug}`

  return (
    <Link href={href} className="group block">
      <div className="glass overflow-hidden rounded-[2rem] border border-border bg-card/5 transition-all duration-500 hover:bg-card/10 hover:border-accent/40 hover:scale-[1.02] h-full flex flex-col">
        {/* Image Container */}
        <div className="relative h-64 overflow-hidden">
          {post.image ? (
            <Image
              src={getVanityImageUrl(post.image, post.imageName || post.imageAlt || post.title)}
              alt={displayAlt ? at(displayAlt) : at(displayTitle)}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              unoptimized
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
            {at(displayTitle)}
          </h3>
          
          {displayExcerpt && (
            <p className="text-foreground/60 line-clamp-3 mb-6 flex-1">
              {at(displayExcerpt)}
            </p>
          )}

          <div className="flex items-center gap-2 text-sm font-bold tracking-wider text-foreground group-hover:gap-4 transition-all duration-300">
            {at({ fr: "LIRE L'ARTICLE", en: 'READ THE ARTICLE' })}
            <span className="text-accent">→</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
