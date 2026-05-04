import React from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
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
    h1: ({ children }: any) => <h1 className="text-4xl md:text-5xl font-bold mb-8 mt-12 text-white">{children}</h1>,
    h2: ({ children }: any) => <h2 className="text-3xl md:text-4xl font-bold mb-6 mt-10 text-white">{children}</h2>,
    h3: ({ children }: any) => <h3 className="text-2xl md:text-3xl font-bold mb-4 mt-8 text-white">{children}</h3>,
    normal: ({ children }: any) => <p className="text-lg md:text-xl text-white/70 leading-relaxed mb-6">{children}</p>,
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-4 border-accent pl-6 py-2 my-8 italic text-2xl text-white/90 bg-white/5 rounded-r-2xl">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }: any) => <ul className="list-disc list-inside mb-6 space-y-2 text-white/70">{children}</ul>,
    number: ({ children }: any) => <ol className="list-decimal list-inside mb-6 space-y-2 text-white/70">{children}</ol>,
  },
  types: {
    image: ({ value }: any) => {
      return (
        <div className="relative w-full h-[400px] md:h-[600px] my-12 rounded-[2rem] overflow-hidden border border-white/10">
          <Image
            src={urlFor(value).url()}
            alt={value.alt || 'Image article'}
            fill
            className="object-cover"
          />
          {value.caption && (
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-black/60 backdrop-blur-sm text-sm text-white/60">
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

export default async function PostDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await client.fetch(postBySlugQuery, { slug });

  if (!post) notFound();

  const formattedDate = new Date(post.date).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <main className="relative min-h-screen bg-black text-white">
      <Navbar />

      {/* Hero Header */}
      <section className="relative h-[60vh] md:h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          {post.image && (
            <Image
              src={post.image}
              alt={post.title}
              fill
              priority
              className="object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        </div>

        <div className="container relative z-10 px-6 pt-32 max-w-5xl">
          <Link 
            href="/blog" 
            className="inline-flex items-center gap-2 text-accent font-bold mb-8 hover:gap-4 transition-all duration-300"
          >
            <ArrowLeft size={20} />
            RETOUR AU BLOG
          </Link>
          
          <div className="flex items-center gap-3 text-white/60 mb-6">
            <Calendar size={18} className="text-accent" />
            <span className="font-medium">{formattedDate}</span>
          </div>

          <h1 className="text-4xl md:text-7xl lg:text-8xl font-black tracking-tighter uppercase leading-[0.9]">
            {post.title}
          </h1>
        </div>
      </section>

      {/* Article Content */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto">
            {post.excerpt && (
              <p className="text-2xl md:text-3xl font-medium text-white/90 mb-12 leading-tight border-l-2 border-accent pl-8">
                {post.excerpt}
              </p>
            )}
            
            <div className="prose-custom">
              <PortableText value={post.body} components={components} />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
