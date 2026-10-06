import Image from 'next/image'
import Link from 'next/link'
import { PortableText } from '@portabletext/react'
import { Calendar, ArrowLeft, ChevronLeft, ChevronRight, FileText, Compass } from 'lucide-react'
import { urlFor, getVanityImageUrl } from '@/sanity/lib/image'
import { getServerTranslations } from '@/i18n/server'
import { autoFill } from '@/lib/translate'
import { formatFriendlyDate } from '@/utils/date'
import FAQAccordion from '@/components/FAQAccordion'
import FaqJsonLd from '@/components/FaqJsonLd'
import ImageGallery from '@/components/ImageGallery'
import PostComments from '@/components/PostComments'

function buildDownloadUrl(url: string, imageName?: string, originalFilename?: string, extension?: string) {
  if (!url) return undefined
  const base = url.split('?')[0]
  if (imageName) {
    const ext = extension || originalFilename?.split('.').pop() || 'jpg'
    return `${base}?dl=${encodeURIComponent(`${imageName}.${ext}`)}`
  }
  if (originalFilename) return `${base}?dl=${encodeURIComponent(originalFilename)}`
  return undefined
}

function makeBlogBlockComponents(lang: string) {
  return {
    block: {
      h1: ({ children }: any) => <h1 className="text-4xl md:text-5xl font-bold mb-8 mt-12 text-foreground">{children}</h1>,
      h2: ({ children }: any) => <h2 className="text-3xl md:text-4xl font-bold mb-6 mt-10 text-foreground">{children}</h2>,
      h3: ({ children }: any) => <h3 className="text-2xl md:text-3xl font-bold mb-4 mt-8 text-foreground">{children}</h3>,
      normal: ({ children }: any) => {
        const empty = !children || children.length === 0 || (children.length === 1 && children[0] === '')
        return <p className="text-lg md:text-xl text-foreground/70 leading-relaxed mb-6 text-justify" style={empty ? { minHeight: '1.5em' } : undefined}>{empty ? ' ' : children}</p>
      },
      blockCenter: ({ children }: any) => {
        const empty = !children || children.length === 0 || (children.length === 1 && children[0] === '')
        return <p className="text-lg md:text-xl text-foreground/70 leading-relaxed mb-6 text-center" style={empty ? { minHeight: '1.5em' } : undefined}>{empty ? ' ' : children}</p>
      },
      blockRight: ({ children }: any) => {
        const empty = !children || children.length === 0 || (children.length === 1 && children[0] === '')
        return <p className="text-lg md:text-xl text-foreground/70 leading-relaxed mb-6 text-right" style={empty ? { minHeight: '1.5em' } : undefined}>{empty ? ' ' : children}</p>
      },
      blockJustify: ({ children }: any) => {
        const empty = !children || children.length === 0 || (children.length === 1 && children[0] === '')
        return <p className="text-lg md:text-xl text-foreground/70 leading-relaxed mb-6 text-justify" style={empty ? { minHeight: '1.5em' } : undefined}>{empty ? ' ' : children}</p>
      },
      blockquote: ({ children }: any) => (
        <blockquote className="border-l-4 border-accent pl-6 py-4 my-10 italic text-2xl text-foreground/90 bg-accent/5 rounded-r-2xl">{children}</blockquote>
      ),
    },
    list: {
      bullet: ({ children }: any) => <ul className="list-disc list-inside mb-6 space-y-2 text-foreground/70">{children}</ul>,
      number: ({ children }: any) => <ol className="list-decimal list-inside mb-6 space-y-2 text-foreground/70">{children}</ol>,
    },
    types: {
      image: ({ value }: any) => {
        if (!value?.asset) return null
        return (
          <div className="my-12">
            <div className="relative w-full h-[400px] md:h-[600px] rounded-[2rem] overflow-hidden border border-border">
              <Image src={urlFor(value).url()} alt={(lang === 'en' ? (value.altEn || value.alt) : value.alt) || 'Image'} fill sizes="(max-width: 1024px) 100vw, 800px" className="object-cover" />
            </div>
            {(value.captionEn || value.caption) && (
              <p className="mt-3 text-center text-sm text-foreground/60 italic font-medium px-4">
                {lang === 'en' ? (value.captionEn || value.caption) : value.caption}
              </p>
            )}
          </div>
        )
      },
      gallery: ({ value }: any) => {
        if (!value?.images) return null
        const imgs = value.images.filter((img: any) => img?.asset).map((img: any) => {
          const rawUrl = img.url || img.asset?.url || urlFor(img).url()
          const sizedUrl = rawUrl.includes('?') ? rawUrl : `${rawUrl}?w=1600&q=80&auto=format&fit=max`
          const vanityName = img.imageName || img.originalFilename?.split('.')[0]
          return {
            src: getVanityImageUrl(sizedUrl, vanityName),
            alt: (lang === 'en' ? (img.altEn || img.alt) : img.alt) || img.caption || 'Image',
            caption: lang === 'en' ? (img.captionEn || img.caption) : img.caption,
            downloadUrl: buildDownloadUrl(rawUrl, img.imageName, img.originalFilename, img.extension),
          }
        })
        if (!imgs.length) return null
        return <div className="my-12"><ImageGallery images={imgs} unoptimized /></div>
      },
      video: ({ value }: any) => {
        if (!value?.url) return null
        const m = value.url.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/)
        const embedUrl = m && m[2].length === 11 ? `https://www.youtube.com/embed/${m[2]}` : null
        if (!embedUrl) return null
        return (
          <div className="my-12 aspect-video w-full rounded-[2rem] overflow-hidden border border-border">
            <iframe src={embedUrl} className="w-full h-full" allowFullScreen title="Video" />
          </div>
        )
      },
      ctaBlock: ({ value }: any) => {
        const cta = value.cta
        if (!cta) return null
        const text = lang === 'en' ? (cta.textEn || cta.text) : cta.text
        const label = lang === 'en' ? (cta.buttonLabelEn || cta.buttonLabel) : cta.buttonLabel
        const styleMap: Record<string, string> = { primary: 'bg-accent/8 border-accent/20', highlight: 'bg-highlight/8 border-highlight/20', outline: 'bg-transparent border-foreground/15' }
        const btnClass = cta.style === 'highlight' ? 'btn-highlight' : cta.style === 'outline' ? 'btn-outline' : 'btn-primary'
        return (
          <div className={`not-prose my-10 p-8 rounded-2xl border ${styleMap[cta.style || 'primary'] || styleMap.primary} text-center`}>
            {text && <p className="text-foreground/70 mb-6 text-base leading-relaxed text-center">{text}</p>}
            <Link href={cta.link || '/contact'} className={`${btnClass} inline-block !text-sm font-black uppercase tracking-widest`}>{label}</Link>
          </div>
        )
      },
    },
  }
}

interface Props {
  post: any
  forceLang?: 'fr' | 'en'
}

export default async function PostDetail({ post: rawPost, forceLang }: Props) {
  const { at, lang, translatePortableText } = await getServerTranslations(forceLang)

  const post = await autoFill(rawPost, [['title', 'titleEn'], ['excerpt', 'excerptEn'], ['imageAlt', 'imageAltEn']], lang)
  if (lang === 'en' && post.tags?.length) {
    post.tags = await Promise.all(post.tags.map((tag: any) => (tag && typeof tag === 'object' ? autoFill(tag, [['name', 'nameEn']], lang) : tag)))
  }

  const formattedDate = formatFriendlyDate(post.date, lang as 'fr' | 'en')

  // EN slug for prev/next links
  const postLink = (p: any) => lang === 'en' && p.slugEn ? `/en/${p.slugEn}` : `/${p.slug}`
  const postLabel = (p: any) => lang === 'en' ? (p.titleEn || p.title) : p.title

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: at({ fr: post.title, en: post.titleEn }),
    url: `https://www.la-montagne-guide.fr${postLink(post)}`,
    mainEntityOfPage: `https://www.la-montagne-guide.fr${postLink(post)}`,
    description: lang === 'en' ? (post.excerptEn || post.excerpt) : post.excerpt,
    image: post.image || undefined,
    datePublished: post.date || undefined,
    author: { '@type': 'Person', name: 'Nicolas Draperi' },
    publisher: { '@type': 'Organization', name: 'La Montagne Guide' },
  }

  const fullGallery = [...(post.gallery || []), ...(post.tagBrowsedImages || [])]

  const uniqueTags: any[] = []
  const seen = new Set()
  ;(post.tags || []).forEach((tag: any) => {
    if (!tag) return
    const label = typeof tag === 'string' ? tag : (tag.name || '')
    const norm = label.trim().toLowerCase()
    if (norm && !seen.has(norm)) { seen.add(norm); uniqueTags.push(tag) }
  })

  const blogLink = lang === 'en' ? '/en/blog' : '/blog'

  return (
    <main className="relative min-h-screen bg-background text-foreground transition-colors duration-300">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="relative py-20 md:py-28 bg-muted/10 border-b border-border/50">
        <div className="container relative z-10 px-6 max-w-3xl mx-auto">
          <Link href={blogLink} className="inline-flex items-center gap-2 text-accent font-bold mb-6 hover:gap-4 transition-all duration-300 text-sm">
            <ArrowLeft size={16} />
            {at('RETOUR AU BLOG')}
          </Link>
          <div className="flex items-center gap-3 text-foreground/60 mb-6 text-sm">
            <Calendar size={16} className="text-accent" />
            <span className="font-medium">{formattedDate}</span>
          </div>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tighter uppercase leading-[1.0] text-foreground">
            {at({ fr: post.title, en: post.titleEn })}
          </h1>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-7xl mx-auto items-start">
            <div className="lg:col-span-2">

              {(post.prevPost || post.nextPost) && (
                <div className="flex items-center justify-between border-b border-border/40 pb-6 mb-8 gap-4">
                  {post.prevPost ? (
                    <Link href={postLink(post.prevPost)} className="group flex items-center gap-2 text-foreground/60 hover:text-accent transition-colors text-sm max-w-[48%] text-left">
                      <ChevronLeft size={18} className="shrink-0 transition-transform group-hover:-translate-x-1" />
                      <span className="font-semibold line-clamp-1">{postLabel(post.prevPost)}</span>
                    </Link>
                  ) : <div />}
                  {post.nextPost ? (
                    <Link href={postLink(post.nextPost)} className="group flex items-center gap-2 text-foreground/60 hover:text-accent transition-colors text-sm max-w-[48%] text-right justify-end ml-auto">
                      <span className="font-semibold line-clamp-1">{postLabel(post.nextPost)}</span>
                      <ChevronRight size={18} className="shrink-0 transition-transform group-hover:translate-x-1" />
                    </Link>
                  ) : <div />}
                </div>
              )}

              {(post.excerptEn || post.excerpt) && (
                <p className="text-xl md:text-2xl text-foreground/80 font-bold leading-relaxed mb-12">
                  {lang === 'en' ? at(post.excerptEn || post.excerpt) : at(post.excerpt)}
                </p>
              )}

              {post.image && (
                <div className="relative aspect-video rounded-[2rem] overflow-hidden border border-border shadow-2xl mb-12">
                  <Image
                    src={getVanityImageUrl(post.image, post.imageName || post.imageAlt || post.title)}
                    alt={lang === 'en' ? (post.imageAltEn || post.imageAlt || at(post.title)) : (post.imageAlt || at(post.title))}
                    fill sizes="(max-width: 1024px) 100vw, 800px" className="object-cover" priority unoptimized
                  />
                </div>
              )}

              <div className="prose-custom max-w-none">
                {post.body ? (
                  <PortableText
                    value={lang === 'en' && post.bodyEn?.length ? post.bodyEn : translatePortableText(post.body)}
                    components={makeBlogBlockComponents(lang)}
                  />
                ) : (
                  <p className="italic text-foreground/45">{at('Pas de contenu pour le moment.')}</p>
                )}
              </div>

              {post.topo && post.topo.length > 0 && (
                <div className="mt-16 p-8 md:p-12 rounded-[2rem] border border-border bg-foreground/[0.02] prose-custom max-w-none">
                  <h3 className="text-xl font-bold uppercase tracking-widest text-accent mb-6 flex items-center gap-2">
                    <FileText size={18} />
                    {lang === 'en' ? 'Practical Info / Route Topo' : 'Données Pratiques / Topo'}
                  </h3>
                  <PortableText value={translatePortableText({ fr: post.topo, en: post.topoEn })} components={makeBlogBlockComponents(lang)} />
                </div>
              )}

              {fullGallery.length > 0 && (
                <div className="mt-16 pt-16 border-t border-border/40">
                  <h3 className="text-xl font-bold uppercase tracking-widest text-accent mb-8">{at('Galerie Photos')}</h3>
                  <ImageGallery unoptimized images={fullGallery.filter((img: any) => img?.url).map((img: any) => {
                    const sizedUrl = `${img.url}?w=1600&q=80&auto=format&fit=max`
                    const vanityName = img.imageName || img.originalFilename?.split('.')[0]
                    return {
                      src: getVanityImageUrl(sizedUrl, vanityName),
                      alt: (lang === 'en' ? (img.altEn || img.alt) : img.alt) || 'Image',
                      caption: lang === 'en' ? (img.captionEn || img.caption) : img.caption,
                      downloadUrl: buildDownloadUrl(img.url, img.imageName, img.originalFilename, img.extension),
                    }
                  })} />
                </div>
              )}

              {post.faqs?.some(Boolean) && (
                <div className="mt-16 pt-16 border-t border-border/40">
                  <h3 className="text-xl font-bold uppercase tracking-widest text-accent mb-8">{at('FAQ de la course')}</h3>
                  <FaqJsonLd faqs={post.faqs} lang={lang} />
                  <FAQAccordion faqs={post.faqs} />
                </div>
              )}

              {uniqueTags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-16 pt-8 border-t border-border/40">
                  {uniqueTags.map((tag: any, idx: number) => {
                    const tagLabel = typeof tag === 'string' ? tag : { fr: tag.name, en: tag.nameEn || tag.name }
                    return (
                      <span key={idx} className="px-4 py-2 rounded-full text-xs font-black bg-foreground/5 text-foreground/60 uppercase tracking-widest border border-border">
                        {at(tagLabel)}
                      </span>
                    )
                  })}
                </div>
              )}

              <PostComments postId={post._id} initialComments={post.comments || []} />

              {(post.prevPost || post.nextPost) && (
                <div className="flex items-center justify-between border-t border-border/40 pt-8 mt-16 gap-4">
                  {post.prevPost ? (
                    <Link href={postLink(post.prevPost)} className="group flex flex-col gap-1 text-left max-w-[48%]">
                      <span className="text-[10px] font-black uppercase text-accent tracking-widest flex items-center gap-1">
                        <ChevronLeft size={12} className="transition-transform group-hover:-translate-x-1" />
                        {at('Précédent')}
                      </span>
                      <span className="font-bold text-foreground/75 hover:text-accent transition-colors text-sm line-clamp-1">{postLabel(post.prevPost)}</span>
                    </Link>
                  ) : <div />}
                  {post.nextPost ? (
                    <Link href={postLink(post.nextPost)} className="group flex flex-col gap-1 text-right max-w-[48%] items-end ml-auto">
                      <span className="text-[10px] font-black uppercase text-accent tracking-widest flex items-center gap-1">
                        {at('Suivant')}
                        <ChevronRight size={12} className="transition-transform group-hover:translate-x-1" />
                      </span>
                      <span className="font-bold text-foreground/75 hover:text-accent transition-colors text-sm line-clamp-1">{postLabel(post.nextPost)}</span>
                    </Link>
                  ) : <div />}
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-32 space-y-6">
                <div className="glass p-8 rounded-[40px] border border-border shadow-xl text-center">
                  <h3 className="text-lg font-black tracking-tight mb-3 text-foreground uppercase leading-tight">
                    {lang === 'en' ? "Want to experience this type of adventure?" : "Envie de vivre ce type d'aventure ?"}
                  </h3>
                  <p className="text-foreground/60 text-sm mb-6 leading-relaxed">
                    {lang === 'en' ? "Contact me to plan your custom high-mountain project." : "Contactez-moi pour organiser votre prochaine sortie sur mesure."}
                  </p>
                  <Link href={post.ctaLink || '/contact'} className="btn-primary w-full block text-center !text-white text-xs font-black uppercase tracking-widest">
                    {lang === 'en' ? "Contact me" : "Contactez-moi"}
                  </Link>
                </div>

                {post.relatedActivities && post.relatedActivities.length > 0 && (
                  <div className="glass p-8 rounded-[40px] border border-border shadow-xl">
                    <h3 className="text-base font-black uppercase tracking-widest mb-6 flex items-center gap-2">
                      <Compass size={16} className="text-accent" />
                      {at('Séjours Recommandés')}
                    </h3>
                    <div className="space-y-4">
                      {post.relatedActivities.map((act: any) => {
                        const stayLink = lang === 'en' && act.slugEn
                          ? `/en/${act.categorySlug || 'alpinisme'}/${act.subCategorySlug || 'initiation'}/${act.slugEn}`
                          : `/${act.categorySlug || 'alpinisme'}/${act.subCategorySlug || 'initiation'}/${act.slug}`
                        return (
                          <Link key={act.slug} href={stayLink} className="group flex gap-3 items-center p-3 rounded-2xl hover:bg-foreground/5 border border-transparent hover:border-border transition-all duration-300">
                            {act.image && (
                              <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0">
                                <Image src={act.image} alt={at(act.title)} fill sizes="56px" className="object-cover" />
                              </div>
                            )}
                            <div className="overflow-hidden">
                              <h4 className="font-bold text-sm text-foreground group-hover:text-accent transition-colors line-clamp-2 leading-tight">{at(act.title)}</h4>
                              <p className="text-[10px] font-black uppercase tracking-widest text-highlight mt-1">{act.basePrice ? at(act.basePrice) : at('Sur devis')}</p>
                            </div>
                          </Link>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
