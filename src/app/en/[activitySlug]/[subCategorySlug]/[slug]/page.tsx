import type { Metadata } from 'next'
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { client } from '@/sanity/lib/client'
import { sejourBySlugQuery, sejourBySlugEnQuery, sejourSlugEnQuery, postsBySejourQuery, postsByActivityQuery, postsByTagsQuery, settingsQuery } from '@/sanity/lib/queries'
import { notFound, redirect } from 'next/navigation'
import { MapPin, BarChart3, Clock, Euro, ArrowLeft, Calendar, Download, Users, CalendarDays, Info } from 'lucide-react'
import { getServerTranslations } from '@/i18n/server'
import { autoFill, autoFillAll } from '@/lib/translate'
import SejourTabs from '@/components/SejourTabs'
import RichContent from '@/components/RichContent'
import BlogCard from '@/components/BlogCard'
import FAQAccordion from '@/components/FAQAccordion'
import { renderRichText, toPlainText } from '@/utils/richText'

function FicheRow({ icon, label, value, tooltip }: { icon: React.ReactNode; label: string; value: React.ReactNode; tooltip?: string }) {
  if (!value) return null
  return (
    <div className="group/fiche relative flex justify-between items-center py-4 border-b border-border">
      <div className="flex items-center gap-3">
        {icon}
        <span className="text-xs font-bold uppercase tracking-widest text-foreground/40">{label}</span>
        {tooltip && (
          <>
            <Info size={16} className="text-accent/60 shrink-0 cursor-help" />
            <div className="absolute left-0 bottom-full mb-2 z-30 w-64 p-3 rounded-xl glass text-xs text-foreground/80 shadow-xl border border-border opacity-0 pointer-events-none group-hover/fiche:opacity-100 group-hover/fiche:pointer-events-auto transition-all duration-200 ease-out">
              {tooltip}
            </div>
          </>
        )}
      </div>
      <span className="font-bold text-right max-w-[55%]">{value}</span>
    </div>
  )
}

export async function generateStaticParams() {
  const slugs = await client.fetch(sejourSlugEnQuery)
  return (slugs || []).map((s: any) => ({
    activitySlug: s.activitySlug,
    subCategorySlug: s.subCategorySlug,
    slug: s.slugEn,
  }))
}

function decodeSlug(slug: string) {
  try { return decodeURIComponent(slug).normalize('NFC') } catch { return slug }
}

export async function generateMetadata({ params }: { params: Promise<{ activitySlug: string; subCategorySlug: string; slug: string }> }): Promise<Metadata> {
  const slug = decodeSlug((await params).slug)
  const ref = await client.fetch(sejourBySlugEnQuery, { slug })
  if (!ref) return {}
  const sejour = await client.fetch(sejourBySlugQuery, { slug: ref.slug })
  if (!sejour) return {}
  const titleStr = (sejour.metaTitleEn || sejour.titleEn || sejour.title)
  const autoDesc = sejour.descriptionEn ? toPlainText(sejour.descriptionEn).substring(0, 160) : (sejour.description ? toPlainText(sejour.description).substring(0, 160) : '')
  const title = titleStr.includes('La Montagne Guide') ? titleStr : `${titleStr} | La Montagne Guide`
  const description = sejour.metaDescriptionEn || autoDesc
  return {
    title,
    description,
    alternates: {
      canonical: `/en/${ref.activitySlug}/${ref.subCategorySlug}/${slug}`,
      languages: {
        fr: `/${ref.activitySlug}/${ref.subCategorySlug}/${ref.slug}`,
        en: `/en/${ref.activitySlug}/${ref.subCategorySlug}/${slug}`,
      },
    },
    openGraph: { title, description, locale: 'en_US', alternateLocale: 'fr_FR' },
  }
}

export default async function EnSejourDetail({ params }: { params: Promise<{ activitySlug: string; subCategorySlug: string; slug: string }> }) {
  const { activitySlug, subCategorySlug, slug: rawSlug } = await params
  const slug = decodeSlug(rawSlug)

  let ref = await client.fetch(sejourBySlugEnQuery, { slug })
  if (!ref) {
    const normalizedSlug = slug.normalize('NFD').replace(/[̀-ͯ]/g, '')
    if (normalizedSlug !== slug) ref = await client.fetch(sejourBySlugEnQuery, { slug: normalizedSlug })
  }
  if (!ref) notFound()

  const [rawSejour, settingsData] = await Promise.all([
    client.fetch(sejourBySlugQuery, { slug: ref.slug }),
    client.fetch(settingsQuery),
  ])
  if (!rawSejour) notFound()

  const { at, lang, translatePortableText } = await getServerTranslations('en')
  if (lang === 'fr') redirect(`/${ref.activitySlug}/${ref.subCategorySlug}/${ref.slug}`)

  let sejour = await autoFill(rawSejour, [['title', 'titleEn'], ['imageAlt', 'imageAltEn']], 'en')
  if (sejour.tabs?.length) {
    sejour = { ...sejour, tabs: await autoFillAll(sejour.tabs, [['title', 'titleEn']], 'en') }
  }

  const fullGallery = [...(sejour.gallery || []), ...(sejour.tagBrowsedImages || [])]
  const postsLimit = sejour.relatedPostsLimit || 6

  let relatedPosts: any[] = []
  if (sejour.relatedPosts && sejour.relatedPosts.length > 0) {
    relatedPosts = sejour.relatedPosts.slice(0, postsLimit)
  } else if (sejour.relatedTagIds && sejour.relatedTagIds.length > 0) {
    relatedPosts = (await client.fetch(postsByTagsQuery, { tagIds: sejour.relatedTagIds, limit: postsLimit })).slice(0, postsLimit)
  } else {
    const directPosts = sejour._id ? await client.fetch(postsBySejourQuery, { sejourId: sejour._id, limit: postsLimit }) : []
    const directIds = directPosts.map((p: any) => p.slug)
    const activityPosts = (directPosts.length < 3 && sejour.activityType)
      ? await client.fetch(postsByActivityQuery, { activityType: sejour.activityType, excludedIds: sejour._id ? [sejour._id] : [], limit: postsLimit })
      : []
    const seenSlugs = new Set(directIds)
    relatedPosts = [...directPosts, ...activityPosts.filter((p: any) => !seenSlugs.has(p.slug))].slice(0, postsLimit)
  }

  const getLevelLabel = (level?: string) => {
    const map: Record<string, string> = { debutant: 'Beginner', intermediaire: 'Intermediate', confirme: 'Advanced', expert: 'Expert' }
    return level ? map[level] || level : ''
  }

  const templateTabs = (sejour.templateTabs || []).map((tab: any, idx: number) => ({
    id: `template-${idx}`,
    label: tab.titleEn || tab.title,
    content: translatePortableText({ fr: tab.content, en: tab.contentEn }) || null,
    pdf: tab.pdf ?? null,
    faqs: tab.faqs || [],
  }))

  const dynamicTabs = (sejour.tabs || []).map((tab: any, idx: number) => ({
    id: `dynamic-${idx}`,
    label: tab.titleEn || tab.title,
    content: translatePortableText({ fr: tab.content, en: tab.contentEn }) || null,
    pdf: tab.pdf ?? null,
  }))

  const legacyTabs = [
    { id: 'programme', label: 'Programme', content: sejour.programme ? translatePortableText(sejour.programme) : null },
    { id: 'budget', label: 'Budget', content: sejour.budget ? translatePortableText(sejour.budget) : null },
    { id: 'infos', label: 'Practical Info', content: sejour.infosPratiques ? translatePortableText(sejour.infosPratiques) : null },
    { id: 'materiel', label: 'Gear List', content: sejour.materiel ? translatePortableText(sejour.materiel) : null, pdf: sejour.materielPdf ?? null },
    ...(sejour.faqs && sejour.faqs.length > 0 ? [{ id: 'faq', label: 'FAQ', content: null, faqs: sejour.faqs }] : []),
  ].filter(tab => tab.content !== null || tab.pdf !== null || (tab as any).faqs?.length > 0)

  const tabs = [...templateTabs, ...dynamicTabs, ...legacyTabs]
  const hasTabs = tabs.length > 0

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    name: sejour.titleEn || sejour.title,
    description: sejour.descriptionEn ? toPlainText(sejour.descriptionEn) : (sejour.description ? toPlainText(sejour.description) : undefined),
    image: sejour.image || undefined,
    touristType: sejour.activityType || undefined,
    offers: sejour.basePrice ? {
      '@type': 'Offer',
      price: sejour.basePrice.replace(/[^0-9]/g, ''),
      priceCurrency: 'EUR',
      description: 'Base rate',
    } : undefined,
    provider: { '@type': 'Person', name: 'Nicolas Draperi', jobTitle: 'Mountain Guide' },
  }

  return (
    <main className="relative min-h-screen bg-background text-foreground transition-colors duration-300">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          {sejour.image && (
            <Image
              src={sejour.image}
              alt={(sejour.imageAltEn || sejour.imageAlt) || (sejour.titleEn || sejour.title)}
              fill sizes="100vw" priority className="object-cover"
            />
          )}
          <div className="absolute inset-0 bg-black/40 bg-linear-to-t from-background via-transparent to-black/20" />
        </div>

        <div className="container relative z-10 px-6 pt-32 max-w-5xl">
          <Link
            href={`/en/${activitySlug}/${subCategorySlug}`}
            className="inline-flex items-center gap-2 text-accent font-bold mb-8 hover:gap-4 transition-all duration-300 uppercase"
          >
            <ArrowLeft size={20} />
            BACK TO {sejour.subCategoryTitle ? at(sejour.subCategoryTitle) : 'ACTIVITIES'}
          </Link>

          <div className="flex flex-wrap gap-4 mb-8">
            <span className="px-4 py-1.5 bg-accent text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">
              {at(sejour.activityType)}
            </span>
            {sejour.massif && (
              <span className="px-3 py-1 bg-background/50 text-white text-[10px] font-bold uppercase tracking-wider rounded-full backdrop-blur-md border border-white/10 flex items-center gap-1">
                <MapPin size={10} className="text-accent" />
                {at(sejour.massif)}
              </span>
            )}
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter uppercase leading-[1.0] text-white">
            {sejour.titleEn || sejour.title}
          </h1>
        </div>
      </section>

      {/* Content */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-20">

            <div className="lg:col-span-2 space-y-12">
              {sejour.description && (
                <div className="text-2xl font-medium leading-relaxed text-foreground/80">
                  {renderRichText(translatePortableText({ fr: sejour.description, en: sejour.descriptionEn }))}
                </div>
              )}

              {hasTabs ? (
                <SejourTabs tabs={tabs} />
              ) : sejour.content ? (
                <RichContent value={translatePortableText(sejour.content)} />
              ) : null}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-32 space-y-6">
                <div className="glass p-10 rounded-[40px] border border-border shadow-2xl">
                  <h3 className="text-2xl font-black uppercase tracking-tight mb-8">Technical Details</h3>

                  <div className="space-y-6 mb-10">
                    <FicheRow icon={<Clock size={18} className="text-accent" />} label="Duration" value={sejour.durationEn || sejour.duration} tooltip={sejour.ficheTooltips?.duration} />
                    <FicheRow icon={<BarChart3 size={18} className="text-accent" />} label="Technical Level" value={getLevelLabel(sejour.level)} tooltip={sejour.ficheTooltips?.level} />
                    <FicheRow icon={<BarChart3 size={18} className="text-accent" />} label="Physical Level" value={sejour.physicalLevel} tooltip={sejour.physicalLevelTooltip || sejour.ficheTooltips?.physicalLevel} />
                    <FicheRow icon={<MapPin size={18} className="text-accent" />} label="Massif" value={at(sejour.massif)} tooltip={sejour.ficheTooltips?.massif} />
                    <FicheRow icon={<Users size={18} className="text-accent" />} label="Participants" value={sejour.participantsEn || sejour.participants} tooltip={sejour.ficheTooltips?.participants} />
                    <FicheRow icon={<CalendarDays size={18} className="text-accent" />} label="Season" value={sejour.periodEn || sejour.period} tooltip={sejour.ficheTooltips?.period} />

                    <div className="group/fiche relative py-4 border-b border-border space-y-3">
                      <div className="flex items-center gap-3 mb-2">
                        <Euro size={18} className="text-accent" />
                        <span className="text-xs font-bold uppercase tracking-widest text-foreground/40">Rates</span>
                        {sejour.ficheTooltips?.tarifs && (
                          <>
                            <Info size={16} className="text-accent/60 shrink-0 cursor-help" />
                            <div className="absolute left-0 bottom-full mb-2 z-30 w-64 p-3 rounded-xl glass text-xs text-foreground/80 shadow-xl border border-border opacity-0 pointer-events-none group-hover/fiche:opacity-100 group-hover/fiche:pointer-events-auto transition-all duration-200 ease-out">
                              {sejour.ficheTooltips.tarifs}
                            </div>
                          </>
                        )}
                      </div>
                      {sejour.prixToutCompris ? (
                        sejour.prixToutComprisAmount ? (
                          <div className="flex justify-between items-baseline">
                            <span className="text-[11px] font-bold text-foreground/50 uppercase tracking-wider">All-inclusive</span>
                            <span className="font-black text-highlight">{sejour.prixToutComprisAmountEn || sejour.prixToutComprisAmount}</span>
                          </div>
                        ) : null
                      ) : (
                        <>
                          {sejour.priceEncadrement && (
                            <div className="flex justify-between items-baseline">
                              <span className="text-[11px] font-bold text-foreground/50 uppercase tracking-wider">Guiding fee</span>
                              <span className="font-black text-highlight">{sejour.priceEncadrementEn || sejour.priceEncadrement}</span>
                            </div>
                          )}
                          {sejour.priceFraisSejour && (
                            <div className="flex justify-between items-baseline">
                              <span className="text-[11px] font-bold text-foreground/50 uppercase tracking-wider">Trip expenses</span>
                              <span className="font-black text-foreground/80">{sejour.priceFraisSejourEn || sejour.priceFraisSejour}</span>
                            </div>
                          )}
                          {!sejour.priceEncadrement && !sejour.priceFraisSejour && sejour.basePrice && (
                            <div className="flex justify-between items-baseline">
                              <span className="text-[10px] font-bold text-foreground/30 uppercase">From</span>
                              <span className="text-2xl font-black text-highlight leading-none">{sejour.basePriceEn || sejour.basePrice}</span>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  <Link href="/contact" className="btn-primary w-full block text-center text-white! py-4 text-sm font-black uppercase tracking-widest">
                    Book this trip
                  </Link>
                  <p className="text-[10px] text-center mt-6 text-foreground/40 font-bold uppercase tracking-widest">
                    Booking & advice by phone available
                  </p>
                </div>

                {!sejour.hideUpcomingSorties && (
                  <div className="glass p-8 rounded-[40px] border border-border shadow-xl">
                    <h4 className="text-xs font-black uppercase tracking-[0.2em] text-accent mb-6 flex items-center gap-2">
                      <Calendar size={14} />
                      Upcoming Dates
                    </h4>
                    {sejour.upcomingSorties && sejour.upcomingSorties.length > 0 ? (
                      <div className="space-y-3">
                        {sejour.upcomingSorties.map((s: any, i: number) => (
                          <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-foreground/5 border border-border">
                            <div className="flex flex-col">
                              <span className="font-bold text-sm">{at(s.date)}</span>
                              <span className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest">{at(s.availableSpots)} spots</span>
                            </div>
                            {s.isFull ? (
                              <span className="text-[8px] font-black uppercase bg-red-500/10 text-red-500 px-2 py-1 rounded-full border border-red-500/20">Full</span>
                            ) : (
                              <span className="text-[8px] font-black uppercase bg-green-500/10 text-green-500 px-2 py-1 rounded-full border border-green-500/20">Available</span>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 rounded-2xl bg-foreground/5 border border-dashed border-border text-center">
                        <p className="text-xs font-bold text-foreground/40 uppercase tracking-widest">Dates on request</p>
                      </div>
                    )}

                    <div className="mt-6 space-y-4 p-5 rounded-3xl bg-accent/5 border border-accent/10 text-[11px] leading-relaxed text-foreground/70 font-medium">
                      {settingsData?.sejourSidebarNotice ? (
                        renderRichText(translatePortableText(settingsData.sejourSidebarNotice))
                      ) : (
                        <>
                          <p className="mb-3">
                            <span className="text-accent font-bold block mb-1 uppercase">SHARED OUTINGS</span>
                            These dates are for individuals wishing to join and share the costs of an outing.
                          </p>
                          <p>
                            <span className="text-accent font-bold block mb-1 uppercase">GROUPS & CUSTOM TRIPS</span>
                            If you are an existing group or wish to <span className="text-accent font-bold">open new dates</span> on request, contact me directly for a private engagement.
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {!sejour.hideGallery && fullGallery.length > 0 && (
        <section className="pb-24">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase mb-10">
              Photo <span className="text-accent italic">Gallery</span>
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {fullGallery.map((photo: any, i: number) => {
                const dlFilename = photo.imageName
                  ? `${photo.imageName}.${photo.extension || photo.originalFilename?.split('.').pop() || 'jpg'}`
                  : photo.originalFilename
                const downloadUrl = dlFilename ? `${photo.url.split('?')[0]}?dl=${encodeURIComponent(dlFilename)}` : undefined
                return (
                  <div key={i} className="relative aspect-square overflow-hidden rounded-2xl group">
                    <Image
                      src={photo.url}
                      alt={(photo.altEn || photo.alt) || (sejour.titleEn || sejour.title)}
                      fill sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                    {downloadUrl && (
                      <a href={downloadUrl} target="_blank" rel="noopener noreferrer" title="Download"
                        className="absolute bottom-2 right-2 p-1.5 rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-accent/80 z-10">
                        <Download size={13} />
                      </a>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {!sejour.hideRelatedPosts && relatedPosts && relatedPosts.length > 0 && (
        <section className="pb-24 bg-surface/40">
          <div className="container mx-auto px-6 pt-16">
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase mb-10">
              Related <span className="text-accent italic">Trip Reports</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedPosts.map((post: any) => (
                <BlogCard key={post.slug} post={post} />
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  )
}
