import type { Metadata } from 'next';
import React from 'react';
import Image from 'next/image';
import { client } from "@/sanity/lib/client";
import { postBySlugQuery, postSlugsQuery } from "@/sanity/lib/queries";
import { notFound } from 'next/navigation';
import { PortableText } from '@portabletext/react';
import { Calendar, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { urlFor, getVanityImageUrl } from "@/sanity/lib/image";
import { getServerTranslations } from '@/i18n/server';
import ImageGallery from '@/components/ImageGallery';
import { formatFriendlyDate } from '@/utils/date';

// Portable Text components for styling
const components = {
  block: {
    h1: ({ children }: any) => <h1 className="text-4xl md:text-5xl font-bold mb-8 mt-12 text-foreground">{children}</h1>,
    h2: ({ children }: any) => <h2 className="text-3xl md:text-4xl font-bold mb-6 mt-10 text-foreground">{children}</h2>,
    h3: ({ children }: any) => <h3 className="text-2xl md:text-3xl font-bold mb-4 mt-8 text-foreground">{children}</h3>,
    normal: ({ children }: any) => <p className="text-lg md:text-xl text-foreground/70 leading-relaxed mb-6">{children}</p>,
    blockCenter: ({ children }: any) => <p className="text-lg md:text-xl text-foreground/70 leading-relaxed mb-6 text-center">{children}</p>,
    blockRight: ({ children }: any) => <p className="text-lg md:text-xl text-foreground/70 leading-relaxed mb-6 text-right">{children}</p>,
    blockJustify: ({ children }: any) => <p className="text-lg md:text-xl text-foreground/70 leading-relaxed mb-6 text-justify">{children}</p>,
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
        <div className="my-12">
          <div className="relative w-full h-[400px] md:h-[600px] rounded-[2rem] overflow-hidden border border-border">
            <Image
              src={urlFor(value).url()}
              alt={value.alt || 'Image article'}
              fill
              sizes="(max-width: 1024px) 100vw, 800px"
              className="object-cover"
            />
          </div>
          {value.caption && (
            <p className="mt-3 text-center text-sm text-foreground/60 italic font-medium px-4">
              {value.caption}
            </p>
          )}
        </div>
      );
    },
    gallery: ({ value }: any) => {
      if (!value || !value.images || !Array.isArray(value.images)) return null;
      const formattedImages = value.images
        .map((img: any) => {
          if (!img || !img.asset) return null;
          return {
            src: urlFor(img).url(),
            alt: img.caption || '',
            caption: img.caption || ''
          };
        })
        .filter(Boolean);

      if (formattedImages.length === 0) return null;
      return <ImageGallery images={formattedImages} />;
    },
    video: ({ value }: any) => {
      if (!value || !value.url) return null;
      let embedUrl = value.url;
      // Convert standard YouTube link to embed link
      if (embedUrl.includes('youtube.com/watch')) {
        try {
          const urlObj = new URL(embedUrl);
          const v = urlObj.searchParams.get('v');
          if (v) {
            embedUrl = `https://www.youtube.com/embed/${v}`;
          }
        } catch (e) {
          // ignore
        }
      } else if (embedUrl.includes('youtu.be/')) {
        const parts = embedUrl.split('youtu.be/');
        if (parts[1]) {
          const id = parts[1].split(/[?#]/)[0];
          embedUrl = `https://www.youtube.com/embed/${id}`;
        }
      }
      return (
        <div className="relative w-full aspect-video my-12 rounded-[2rem] overflow-hidden border border-border">
          <iframe
            src={embedUrl}
            className="absolute inset-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      );
    }
  },
};

export async function generateStaticParams() {
  const posts = await client.fetch(postSlugsQuery);
  return posts.map((post: any) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await client.fetch(postBySlugQuery, { slug });
  const { at } = await getServerTranslations();

  if (!post) return {};

  const title = `${at(post.title)} | La Montagne Guide`;
  const description = post.excerpt ? at(post.excerpt) : '';
  const ogImage = post.image || undefined;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      images: ogImage ? [{ url: ogImage }] : undefined,
    },
  };
}

export default async function PostDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await client.fetch(postBySlugQuery, { slug });
  const { at, t, lang, translatePortableText } = await getServerTranslations();

  if (!post) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": at(post.title),
    "description": post.excerpt ? at(post.excerpt) : undefined,
    "image": post.image || undefined,
    "datePublished": post.date || undefined,
    "author": {
      "@type": "Person",
      "name": "Nicolas Draperi"
    },
    "publisher": {
      "@type": "Organization",
      "name": "La Montagne Guide"
    }
  };

  const formattedDate = formatFriendlyDate(post.date, lang as 'fr' | 'en');

  return (
    <main className="relative min-h-screen bg-background text-foreground transition-colors duration-300">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero Header (Text only, more compact) */}
      <section className="relative py-20 md:py-28 bg-muted/10 border-b border-border/50">
        <div className="container relative z-10 px-6 max-w-3xl mx-auto">
          <Link 
            href="/blog" 
            className="inline-flex items-center gap-2 text-accent font-bold mb-6 hover:gap-4 transition-all duration-300 text-sm"
          >
            <ArrowLeft size={16} />
            {at('RETOUR AU BLOG')}
          </Link>
          
          <div className="flex items-center gap-3 text-foreground/60 mb-6 text-sm">
            <Calendar size={16} className="text-accent" />
            <span className="font-medium">{formattedDate}</span>
          </div>

          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tighter uppercase leading-[1.0] text-foreground">
            {at(post.title)}
          </h1>
        </div>
      </section>

      {/* Article Content */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto">
            {/* Top Navigation */}
            {(post.prevPost || post.nextPost) && (
              <div className="flex items-center justify-between border-b border-border/40 pb-6 mb-8 gap-4">
                {post.prevPost ? (
                  <Link 
                    href={`/blog/${post.prevPost.slug}`}
                    className="group flex items-center gap-2 text-foreground/60 hover:text-accent transition-colors text-sm max-w-[48%] text-left"
                  >
                    <ChevronLeft size={18} className="shrink-0 transition-transform group-hover:-translate-x-1" />
                    <span className="font-semibold line-clamp-1">{at(post.prevPost.title)}</span>
                  </Link>
                ) : (
                  <div />
                )}
                
                {post.nextPost ? (
                  <Link 
                    href={`/blog/${post.nextPost.slug}`}
                    className="group flex items-center gap-2 text-foreground/60 hover:text-accent transition-colors text-sm max-w-[48%] text-right justify-end ml-auto"
                  >
                    <span className="font-semibold line-clamp-1">{at(post.nextPost.title)}</span>
                    <ChevronRight size={18} className="shrink-0 transition-transform group-hover:translate-x-1" />
                  </Link>
                ) : (
                  <div />
                )}
              </div>
            )}

            {/* Tags / Catégories */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2.5 mb-8">
                {post.tags.map((tag: any, idx: number) => {
                  const href = tag.tagType === 'massif' 
                    ? `/blog?massif=${tag.slug}` 
                    : `/blog?category=${tag.slug}`;
                  return (
                    <Link 
                      key={idx} 
                      href={href}
                      className="inline-flex items-center bg-accent/10 text-accent font-semibold px-3.5 py-1.5 rounded-full text-xs uppercase tracking-wider border border-accent/20 hover:bg-accent/20 transition-colors duration-300 select-none"
                    >
                      {tag.name}
                    </Link>
                  );
                })}
              </div>
            )}

            {/* Featured Image (Much smaller, in-flow after title/tags) */}
            {post.image && (
              <div className="relative w-full aspect-[16/10] md:aspect-[16/9] max-h-[450px] rounded-3xl overflow-hidden border border-border mb-10 shadow-lg">
                <Image
                  src={getVanityImageUrl(post.image, post.imageName || post.imageAlt || post.title)}
                  alt={post.imageAlt ? at(post.imageAlt) : at(post.title)}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 800px"
                  className="object-cover"
                />
              </div>
            )}

            <div className="prose-custom mb-16">
              <PortableText value={translatePortableText(post.body)} components={components} />
            </div>

            {/* Photo Gallery (Root level) */}
            {post.gallery && post.gallery.length > 0 && (
              <div className="mt-16 border-t border-border/40 pt-10 mb-16">
                <h2 className="text-3xl font-black tracking-tighter uppercase mb-8">
                  {at('Galerie')} <span className="text-accent italic">{at('Photos')}</span>
                </h2>
                <ImageGallery images={post.gallery.map((img: any) => ({ src: img.url, alt: img.caption || '', caption: img.caption || '' }))} />
              </div>
            )}

            {/* Bottom Navigation */}
            {(post.prevPost || post.nextPost) && (
              <div className="flex items-center justify-between border-t border-border/40 pt-8 mt-12 gap-4">
                {post.prevPost ? (
                  <Link 
                    href={`/blog/${post.prevPost.slug}`}
                    className="group flex items-center gap-2.5 text-foreground/60 hover:text-accent transition-colors text-sm max-w-[48%] text-left"
                  >
                    <ChevronLeft size={20} className="shrink-0 transition-transform group-hover:-translate-x-1" />
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase tracking-wider text-foreground/40 font-bold">{at('Article précédent')}</span>
                      <span className="font-bold line-clamp-1">{at(post.prevPost.title)}</span>
                    </div>
                  </Link>
                ) : (
                  <div />
                )}
                
                {post.nextPost ? (
                  <Link 
                    href={`/blog/${post.nextPost.slug}`}
                    className="group flex items-center gap-2.5 text-foreground/60 hover:text-accent transition-colors text-sm max-w-[48%] text-right justify-end ml-auto"
                  >
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase tracking-wider text-foreground/40 font-bold">{at('Article suivant')}</span>
                      <span className="font-bold line-clamp-1">{at(post.nextPost.title)}</span>
                    </div>
                    <ChevronRight size={20} className="shrink-0 transition-transform group-hover:translate-x-1" />
                  </Link>
                ) : (
                  <div />
                )}
              </div>
            )}
          </div>
        </div>
      </section>

    </main>
  );
}
