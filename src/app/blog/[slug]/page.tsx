import React from 'react';
import Image from 'next/image';
import { client } from "@/sanity/lib/client";
import { postBySlugQuery, postsQuery } from "@/sanity/lib/queries";
import { notFound } from 'next/navigation';
import { PortableText } from '@portabletext/react';
import { Calendar, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { urlFor } from "@/sanity/lib/image";

// Portable Text components for styling
const components = {
  block: {
    h1: ({ children }: any) => <h1 className="text-4xl md:text-5xl font-bold mb-8 mt-12 text-foreground">{children}</h1>,
    h2: ({ children }: any) => <h2 className="text-3xl md:text-4xl font-bold mb-6 mt-10 text-foreground">{children}</h2>,
    h3: ({ children }: any) => <h3 className="text-2xl md:text-3xl font-bold mb-4 mt-8 text-foreground">{children}</h3>,
    normal: ({ children }: any) => <p className="text-lg md:text-xl text-foreground/70 leading-relaxed mb-6">{children}</p>,
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-4 border-accent pl-6 py-4 my-10 italic text-2xl text-foreground/90 bg-accent/5 rounded-r-2xl">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }: any) => <ul className="list-disc list-inside mb-6 space-y-2 text-foreground/70">{children}</ul>,
    number: ({ children }: any) => <ol className="list-decimal list-inside mb-6 space-y-2 text-foreground/70">{children}</ol>,
  },
  types: {
    image: ({ value }: any) => {
      return (
        <div className="relative w-full h-[400px] md:h-[600px] my-12 rounded-[2rem] overflow-hidden border border-border">
          <Image
            src={urlFor(value).url()}
            alt={value.alt || 'Image article'}
            fill
            sizes="(max-width: 1024px) 100vw, 800px"
            className="object-cover"
          />
          {value.caption && (
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-sm text-sm text-foreground/60">
              {value.caption}
            </div>
          )}
        </div>
      );
    },
  },
};

export async function generateStaticParams() {
  const posts = await client.fetch(postsQuery);
  return posts.map((post: any) => ({
    slug: post.slug,
  }));
}

import { getServerTranslations } from '@/i18n/server';

export default async function PostDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await client.fetch(postBySlugQuery, { slug });
  const { at, t, lang, translatePortableText } = await getServerTranslations();

  if (!post) notFound();

  const formattedDate = new Date(post.date).toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <main className="relative min-h-screen bg-background text-foreground transition-colors duration-300">

      {/* Hero Header */}
      <section className="relative h-[60vh] md:h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          {post.image && (
            <Image
              src={post.image}
              alt={at(post.title)}
              fill
              sizes="100vw"
              priority
              className="object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        </div>

        <div className="container relative z-10 px-6 pt-32 max-w-5xl">
          <Link 
            href="/blog" 
            className="inline-flex items-center gap-2 text-accent font-bold mb-8 hover:gap-4 transition-all duration-300"
          >
            <ArrowLeft size={20} />
            {at('RETOUR AU BLOG')}
          </Link>
          
          <div className="flex items-center gap-3 text-foreground/60 mb-6">
            <Calendar size={18} className="text-accent" />
            <span className="font-medium">{formattedDate}</span>
          </div>

          <h1 className="text-4xl md:text-7xl lg:text-8xl font-black tracking-tighter uppercase leading-[0.9]">
            {at(post.title)}
          </h1>
        </div>
      </section>

      {/* Article Content */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto">
            {post.excerpt && (
              <p className="text-2xl md:text-3xl font-medium text-foreground/90 mb-12 leading-tight border-l-2 border-accent pl-8">
                {at(post.excerpt)}
              </p>
            )}
            
            <div className="prose-custom">
              <PortableText value={translatePortableText(post.body)} components={components} />
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
