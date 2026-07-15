import type { Metadata } from 'next';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { client } from "@/sanity/lib/client";
import { 
  activityBySlugQuery, 
  postBySlugQuery, 
  postSlugsQuery 
} from "@/sanity/lib/queries";
import { urlFor, getVanityImageUrl } from "@/sanity/lib/image";
import { getServerTranslations } from '@/i18n/server';
import { PortableText } from '@portabletext/react';
import FAQAccordion from "@/components/FAQAccordion";
import { Calendar, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import ImageGallery from '@/components/ImageGallery';
import { formatFriendlyDate } from '@/utils/date';

const VALID_ACTIVITIES = ['alpinisme', 'ski', 'escalade', 'cascade-de-glace', 'paralpinisme', 'voyages'];

// Portable Text component for activity blocks
const activityBlockComponents = {
  block: {
    normal: ({ children }: any) => {
      const isEmpty = !children || children.length === 0 || (children.length === 1 && children[0] === '');
      return <p style={{ minHeight: isEmpty ? '1.5em' : undefined }}>{isEmpty ? '\u00a0' : children}</p>;
    },
    blockCenter: ({ children }: any) => {
      const isEmpty = !children || children.length === 0 || (children.length === 1 && children[0] === '');
      return <p style={{ textAlign: 'center', minHeight: isEmpty ? '1.5em' : undefined }}>{isEmpty ? '\u00a0' : children}</p>;
    },
    blockRight: ({ children }: any) => {
      const isEmpty = !children || children.length === 0 || (children.length === 1 && children[0] === '');
      return <p style={{ textAlign: 'right', minHeight: isEmpty ? '1.5em' : undefined }}>{isEmpty ? '\u00a0' : children}</p>;
    },
    blockJustify: ({ children }: any) => {
      const isEmpty = !children || children.length === 0 || (children.length === 1 && children[0] === '');
      return <p style={{ textAlign: 'justify', minHeight: isEmpty ? '1.5em' : undefined }}>{isEmpty ? '\u00a0' : children}</p>;
    },
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-4 border-accent pl-6 py-4 my-8 italic text-xl text-foreground/80 bg-accent/5 rounded-r-2xl text-justify">
        {children}
      </blockquote>
    ),
  }
};

// Portable Text components for blog articles
const blogBlockComponents = {
  block: {
    h1: ({ children }: any) => <h1 className="text-4xl md:text-5xl font-bold mb-8 mt-12 text-foreground">{children}</h1>,
    h2: ({ children }: any) => <h2 className="text-3xl md:text-4xl font-bold mb-6 mt-10 text-foreground">{children}</h2>,
    h3: ({ children }: any) => <h3 className="text-2xl md:text-3xl font-bold mb-4 mt-8 text-foreground">{children}</h3>,
    normal: ({ children }: any) => {
      const isEmpty = !children || children.length === 0 || (children.length === 1 && children[0] === '');
      return (
        <p className="text-lg md:text-xl text-foreground/70 leading-relaxed mb-6 text-justify" style={isEmpty ? { minHeight: '1.5em' } : undefined}>
          {isEmpty ? '\u00a0' : children}
        </p>
      );
    },
    blockCenter: ({ children }: any) => {
      const isEmpty = !children || children.length === 0 || (children.length === 1 && children[0] === '');
      return (
        <p className="text-lg md:text-xl text-foreground/70 leading-relaxed mb-6 text-center" style={isEmpty ? { minHeight: '1.5em' } : undefined}>
          {isEmpty ? '\u00a0' : children}
        </p>
      );
    },
    blockRight: ({ children }: any) => {
      const isEmpty = !children || children.length === 0 || (children.length === 1 && children[0] === '');
      return (
        <p className="text-lg md:text-xl text-foreground/70 leading-relaxed mb-6 text-right" style={isEmpty ? { minHeight: '1.5em' } : undefined}>
          {isEmpty ? '\u00a0' : children}
        </p>
      );
    },
    blockJustify: ({ children }: any) => {
      const isEmpty = !children || children.length === 0 || (children.length === 1 && children[0] === '');
      return (
        <p className="text-lg md:text-xl text-foreground/70 leading-relaxed mb-6 text-justify" style={isEmpty ? { minHeight: '1.5em' } : undefined}>
          {isEmpty ? '\u00a0' : children}
        </p>
      );
    },
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
      if (!value || !value.asset) return null;
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
      if (!value || !value.images) return null;
      const formattedImages = value.images.map((img: any) => ({
        src: urlFor(img).url(),
        alt: img.alt || img.caption || 'Image galerie',
        caption: img.caption
      }));
      return (
        <div className="my-12">
          <ImageGallery images={formattedImages} />
        </div>
      );
    },
    video: ({ value }: any) => {
      if (!value || !value.url) return null;
      const getEmbedUrl = (url: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return match && match[2].length === 11 ? `https://www.youtube.com/embed/${match[2]}` : null;
      };
      const embedUrl = getEmbedUrl(value.url);
      if (!embedUrl) return null;
      return (
        <div className="my-12 aspect-video w-full rounded-[2rem] overflow-hidden border border-border">
          <iframe
            src={embedUrl}
            className="w-full h-full"
            allowFullScreen
            title="Video player"
          />
        </div>
      );
    }
  },
};

export async function generateStaticParams() {
  const posts = await client.fetch(postSlugsQuery);
  const postParams = posts.map((post: any) => ({
    activitySlug: post.slug,
  }));
  const activityParams = VALID_ACTIVITIES.map((act) => ({
    activitySlug: act,
  }));
  return [...postParams, ...activityParams];
}

export async function generateMetadata({ params }: { params: Promise<{ activitySlug: string }> }): Promise<Metadata> {
  const { activitySlug } = await params;
  const { at } = await getServerTranslations();

  if (VALID_ACTIVITIES.includes(activitySlug)) {
    const activity = await client.fetch(activityBySlugQuery, { slug: activitySlug });
    if (!activity) return {};
    const title = `${at(activity.title)} | La Montagne Guide`;
    const description = activity.intro ? at(activity.intro) : (activity.description ? at(activity.description).substring(0, 160) : '');
    const ogImage = activity.image || undefined;
    return {
      title,
      description,
      openGraph: {
        title,
        description,
        images: ogImage ? [{ url: ogImage }] : undefined,
      },
    };
  } else {
    const post = await client.fetch(postBySlugQuery, { slug: activitySlug });
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
}

export default async function GenericRootPage({ params }: { params: Promise<{ activitySlug: string }> }) {
  const { activitySlug } = await params;
  const { at, t, lang, translatePortableText } = await getServerTranslations();

  if (VALID_ACTIVITIES.includes(activitySlug)) {
    // RENDER ACTIVITY LANDING PAGE
    const activity = await client.fetch(activityBySlugQuery, { slug: activitySlug });
    if (!activity) notFound();
    const univers = activity.univers || [];

    return (
      <main className="relative min-h-screen bg-background text-foreground transition-colors duration-300">
        <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            {activity.image && (
              <Image 
                src={activity.image}
                alt={at(activity.title)}
                fill
                sizes="100vw"
                className="object-cover"
                priority
              />
            )}
            <div className="absolute inset-0 bg-black/40 bg-gradient-to-t from-background via-transparent to-black/20" />
          </div>
          <div className="container relative z-10 px-6 text-center pt-20">
            <h1 className="text-6xl md:text-9xl font-black tracking-tighter text-white uppercase mb-8 leading-[0.8]">{at(activity.title)}</h1>
            <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto leading-relaxed font-medium">
              {at(activity.intro || activity.description?.substring(0, 200))}
            </p>
          </div>
        </section>

        {activity.keyPoints && activity.keyPoints.length > 0 && (
          <section className="py-20 bg-card/5">
            <div className="container mx-auto px-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {activity.keyPoints.map((point: any, i: number) => (
                  <div key={i} className="glass p-10 rounded-[40px] text-center border border-border shadow-lg hover:border-accent/30 transition-colors">
                    <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center text-accent mx-auto mb-6">
                      <span className="font-black text-xl">{i + 1}</span>
                    </div>
                    <h3 className="text-xl font-black mb-4 text-accent uppercase tracking-widest leading-tight">{at(point.title)}</h3>
                    <p className="text-foreground/60 leading-relaxed font-medium">{at(point.description)}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="py-24">
          <div className="container mx-auto px-6">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase mb-6">{at(activity.universTitle || "Choisissez votre univers")}</h2>
              <p className="text-lg text-foreground/60 max-w-2xl mx-auto font-medium">
                {at(activity.universDescription || "Découvrez nos différentes approches de la montagne, adaptées à vos envies et à votre niveau.")}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {univers.map((univ: any, i: number) => {
                const universSlug = univ.title.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '-');
                return (
                  <Link 
                    key={i} 
                    href={`/${activitySlug}/${universSlug}`}
                    className="group relative h-[450px] rounded-[50px] overflow-hidden border border-border hover:border-accent/40 transition-all duration-500 shadow-xl"
                  >
                    {univ.image && (
                      <Image 
                        src={urlFor(univ.image).url()}
                        alt={at(univ.title)}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
                    
                    <div className="absolute inset-0 p-12 flex flex-col justify-end">
                      <h3 className="text-3xl md:text-5xl font-black text-foreground uppercase tracking-tighter group-hover:text-accent transition-colors">
                        {at(univ.title)}
                      </h3>
                    </div>
                  </Link>
                );
              })}
            </div>

            {univers.length === 0 && (
              <div className="text-center py-20 glass rounded-[40px] border border-dashed border-border">
                <p className="text-xl text-foreground/40 font-medium">{at('Les univers de cette activité seront bientôt disponibles.')}</p>
              </div>
            )}
          </div>
        </section>

        {activity.faqs && activity.faqs.length > 0 && (
          <section className="py-20 border-t border-border/10 bg-background">
            <div className="container mx-auto px-6 max-w-4xl">
              <FAQAccordion faqs={activity.faqs} />
            </div>
          </section>
        )}
      </main>
    );
  } else {
    // RENDER BLOG POST DETAIL PAGE
    const post = await client.fetch(postBySlugQuery, { slug: activitySlug });
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

        <section className="py-16">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto">
              {(post.prevPost || post.nextPost) && (
                <div className="flex items-center justify-between border-b border-border/40 pb-6 mb-8 gap-4">
                  {post.prevPost ? (
                    <Link 
                      href={`/${post.prevPost.slug}`}
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
                      href={`/${post.nextPost.slug}`}
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

              {post.excerpt && (
                <p className="text-xl md:text-2xl text-foreground/80 font-bold leading-relaxed mb-12">
                  {at(post.excerpt)}
                </p>
              )}

              {post.image && (
                <div className="relative aspect-video rounded-[2rem] overflow-hidden border border-border shadow-2xl mb-12">
                  <Image 
                    src={getVanityImageUrl(post.image, post.imageName || post.imageAlt || post.title)}
                    alt={post.imageAlt ? at(post.imageAlt) : at(post.title)}
                    fill
                    sizes="(max-width: 1024px) 100vw, 800px"
                    className="object-cover"
                    priority
                  />
                </div>
              )}

              <div className="prose prose-invert max-w-none">
                {post.body ? (
                  <PortableText value={translatePortableText(post.body)} components={blogBlockComponents} />
                ) : (
                  <p className="italic text-foreground/45">{at('Pas de contenu pour le moment.')}</p>
                )}
              </div>

              {post.gallery && post.gallery.length > 0 && (
                <div className="mt-16 pt-16 border-t border-border/40">
                  <h3 className="text-xl font-bold uppercase tracking-widest text-accent mb-8">{at('Galerie Photos')}</h3>
                  <ImageGallery images={post.gallery} />
                </div>
              )}

              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-16 pt-8 border-t border-border/40">
                  {post.tags.map((tag: any, idx: number) => {
                    const tagLabel = typeof tag === 'string' ? tag : tag.name;
                    return (
                      <span 
                        key={idx} 
                        className="px-4 py-2 rounded-full text-xs font-black bg-foreground/5 text-foreground/60 uppercase tracking-widest border border-border"
                      >
                        {at(tagLabel)}
                      </span>
                    );
                  })}
                </div>
              )}

              {(post.prevPost || post.nextPost) && (
                <div className="flex items-center justify-between border-t border-border/40 pt-8 mt-16 gap-4">
                  {post.prevPost ? (
                    <Link 
                      href={`/${post.prevPost.slug}`}
                      className="group flex flex-col gap-1 text-left max-w-[48%]"
                    >
                      <span className="text-[10px] font-black uppercase text-accent tracking-widest flex items-center gap-1">
                        <ChevronLeft size={12} className="transition-transform group-hover:-translate-x-1" />
                        {at('Précédent')}
                      </span>
                      <span className="font-bold text-foreground/75 hover:text-accent transition-colors text-sm line-clamp-1">{at(post.prevPost.title)}</span>
                    </Link>
                  ) : (
                    <div />
                  )}
                  
                  {post.nextPost ? (
                    <Link 
                      href={`/${post.nextPost.slug}`}
                      className="group flex flex-col gap-1 text-right max-w-[48%] items-end ml-auto"
                    >
                      <span className="text-[10px] font-black uppercase text-accent tracking-widest flex items-center gap-1">
                        {at('Suivant')}
                        <ChevronRight size={12} className="transition-transform group-hover:translate-x-1" />
                      </span>
                      <span className="font-bold text-foreground/75 hover:text-accent transition-colors text-sm line-clamp-1">{at(post.nextPost.title)}</span>
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
}
