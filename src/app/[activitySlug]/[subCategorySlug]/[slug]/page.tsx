import type { Metadata } from 'next';
import React from 'react'
import Image from 'next/image';
import Link from 'next/link';
import { client } from "@/sanity/lib/live";
import { sejourBySlugQuery, postsBySejourQuery, postsByActivityQuery, postsByTagsQuery, settingsQuery } from "@/sanity/lib/queries";
import { notFound, redirect } from 'next/navigation';
import { MapPin, BarChart3, Clock, Euro, ArrowLeft, Calendar, Download, Users, CalendarDays, Info } from 'lucide-react';

import { getServerTranslations } from '@/i18n/server';
import { autoFill, autoFillAll } from '@/lib/translate';
import SejourTabs from '@/components/SejourTabs';
import RichContent from '@/components/RichContent';
import BlogCard from '@/components/BlogCard';
import FAQAccordion from '@/components/FAQAccordion';
import FaqJsonLd from '@/components/FaqJsonLd';
import SejourCard from '@/components/SejourCard';
import BookingButton from '@/components/BookingButton';
import { LevelValue } from '@/components/LevelValue';
import { renderRichText, toPlainText } from '@/utils/richText';

function FicheRow({ icon, label, value, tooltip }: {
  icon: React.ReactNode
  label: string
  value: React.ReactNode
  tooltip?: string
}) {
  if (!value) return null
  return (
    <div className="group/fiche relative flex justify-between items-center py-4 border-b border-border">
      <div className="flex items-center gap-3">
        {icon}
        <span className="text-xs font-bold uppercase tracking-widest text-foreground/40">{label}</span>
        {tooltip && (
          <>
            <Info size={16} className="text-accent/60 shrink-0 cursor-help" />
            <div className="absolute left-0 bottom-full mb-2 z-30 w-64 p-3 rounded-xl glass text-xs text-foreground/80 shadow-xl border border-border
              opacity-0 pointer-events-none
              group-hover/fiche:opacity-100 group-hover/fiche:pointer-events-auto
              transition-all duration-200 ease-out">
              {tooltip}
            </div>
          </>
        )}
      </div>
      <span className="font-bold text-right max-w-[55%]">{value}</span>
    </div>
  )
}

function decodeSlug(slug: string) {
  try { return decodeURIComponent(slug).normalize('NFC') } catch { return slug }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const slug = decodeSlug((await params).slug);
  let sejour = await client.fetch(sejourBySlugQuery, { slug });
  const { at, lang } = await getServerTranslations();

  if (!sejour) return {};
  sejour = await autoFill(sejour, [['title', 'titleEn'], ['imageAlt', 'imageAltEn']], lang);

  const autoTitle = `${at({ fr: sejour.title, en: sejour.titleEn })} | La Montagne Guide`;
  const descForMeta = lang === 'en' && sejour.descriptionEn?.length ? sejour.descriptionEn : sejour.description;
  const autoDescription = descForMeta ? toPlainText(descForMeta).substring(0, 160) : '';

  const title = (lang === 'en' ? (sejour.metaTitleEn || sejour.metaTitle) : sejour.metaTitle) || autoTitle;
  const description = (lang === 'en' ? (sejour.metaDescriptionEn || sejour.metaDescription) : sejour.metaDescription) || autoDescription;
  const ogImage = sejour.image || undefined;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: ogImage ? [{ url: ogImage }] : undefined,
    },
  };
}

export default async function SejourDetail({ params }: { params: Promise<{ activitySlug: string, subCategorySlug: string, slug: string }> }) {
  const { activitySlug, subCategorySlug, slug: rawSlug } = await params;
  const slug = decodeSlug(rawSlug);
  const [rawSejourDirect, settingsData] = await Promise.all([
    client.fetch(sejourBySlugQuery, { slug }),
    client.fetch(settingsQuery)
  ]);

  // Fallback: if slug has accents and doesn't match, try the normalized (no-accent) version
  let rawSejour = rawSejourDirect
  if (!rawSejour) {
    const normalizedSlug = slug.normalize('NFD').replace(/[̀-ͯ]/g, '')
    if (normalizedSlug !== slug) {
      const fallback = await client.fetch(sejourBySlugQuery, { slug: normalizedSlug })
      if (fallback) redirect(`/${activitySlug}/${subCategorySlug}/${fallback.slug}`)
    }
  }

  const { at, t, lang, translatePortableText } = await getServerTranslations();

  if (!rawSejour) notFound();

  // Redirect EN visitors to the English URL if slugEn exists
  if (lang === 'en' && rawSejour.slugEn) {
    redirect(`/en/${activitySlug}/${subCategorySlug}/${rawSejour.slugEn}`)
  }

  let sejour = await autoFill(rawSejour, [['title', 'titleEn'], ['imageAlt', 'imageAltEn']], lang);
  if (sejour.tabs?.length) {
    sejour = { ...sejour, tabs: await autoFillAll(sejour.tabs, [['title', 'titleEn']], lang) };
  }

  const fullGallery = [...(sejour.gallery || []), ...(sejour.tagBrowsedImages || [])]

  const postsLimit = sejour.relatedPostsLimit || 6;

  // Priorité articles liés : 1. Sélection manuelle, 2. Tags, 3. Auto (sejour direct + activité)
  let relatedPosts: any[] = [];

  if (sejour.relatedPosts && sejour.relatedPosts.length > 0) {
    relatedPosts = sejour.relatedPosts.slice(0, postsLimit);
  } else if (sejour.relatedTagIds && sejour.relatedTagIds.length > 0) {
    relatedPosts = (await client.fetch(postsByTagsQuery, { tagIds: sejour.relatedTagIds, limit: postsLimit })).slice(0, postsLimit);
  } else {
    const directPosts = sejour._id
      ? await client.fetch(postsBySejourQuery, { sejourId: sejour._id, limit: postsLimit })
      : [];

    const directIds = directPosts.map((p: any) => p.slug);
    const activityPosts = (directPosts.length < 3 && sejour.activityType)
      ? await client.fetch(postsByActivityQuery, {
          activityType: sejour.activityType,
          excludedIds: sejour._id ? [sejour._id] : [],
          limit: postsLimit
        })
      : [];

    const seenSlugs = new Set(directIds);
    const extraPosts = activityPosts.filter((p: any) => !seenSlugs.has(p.slug));
    relatedPosts = [...directPosts, ...extraPosts].slice(0, postsLimit);
  }

  relatedPosts = await autoFillAll(relatedPosts, [['title', 'titleEn'], ['excerpt', 'excerptEn'], ['imageAlt', 'imageAltEn']], lang);

  const getLevelLabel = (level?: string) => {
    const map: Record<string, string> = {
      'debutant': at('Débutant'),
      'intermediaire': at('Intermédiaire'),
      'confirme': at('Confirmé'),
      'expert': at('Expert')
    }
    return level ? map[level] || level : ''
  }

  const templateTabs = (sejour.templateTabs || []).map((tab: any, idx: number) => ({
    id: `template-${idx}`,
    label: at({ fr: tab.title, en: tab.titleEn }),
    content: translatePortableText({ fr: tab.content, en: tab.contentEn }) || null,
    pdf: tab.pdf ?? null,
    faqs: tab.faqs || []
  }))

  const dynamicTabs = (sejour.tabs || []).map((tab: any, idx: number) => ({
    id: `dynamic-${idx}`,
    label: at({ fr: tab.title, en: tab.titleEn }),
    content: translatePortableText({ fr: tab.content, en: tab.contentEn }) || null,
    pdf: tab.pdf ?? null,
    faqs: tab.faqs || []
  }))

  const legacyTabs = [
    { id: 'programme', label: at('Programme'), content: sejour.programme ? translatePortableText(sejour.programme) : null },
    { id: 'budget', label: at('Budget'), content: sejour.budget ? translatePortableText(sejour.budget) : null },
    { id: 'infos', label: at('Infos Pratiques'), content: sejour.infosPratiques ? translatePortableText(sejour.infosPratiques) : null },
    { id: 'materiel', label: at('Matériel'), content: sejour.materiel ? translatePortableText(sejour.materiel) : null, pdf: sejour.materielPdf ?? null },
    ...(sejour.faqs?.some(Boolean) ? [{ id: 'faq', label: at('FAQ'), content: null, faqs: sejour.faqs }] : []),
  ].filter(tab => tab.content !== null || tab.pdf !== null || (tab as any).faqs?.length > 0)

  const tabs = [...templateTabs, ...dynamicTabs, ...legacyTabs]
  const hasTabs = tabs.length > 0

  // First amount only, so ranges like "1 500€ - 2 000€" don't merge into one number
  const basePriceValue = sejour.basePrice?.replace(/(\d)[\s\u00a0\u202f.](?=\d{3}(\D|$))/g, '$1').match(/\d+/)?.[0]

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    "name": at({ fr: sejour.title, en: sejour.titleEn }),
    "description": sejour.description ? toPlainText(sejour.description) : undefined,
    "image": sejour.image || undefined,
    "touristType": sejour.activityType ? at(sejour.activityType) : undefined,
    "url": encodeURI(`https://www.la-montagne-guide.fr/${activitySlug}/${subCategorySlug}/${slug}`),
    "offers": basePriceValue ? {
      "@type": "Offer",
      "price": basePriceValue,
      "priceCurrency": "EUR",
      "description": at("Tarif de base")
    } : undefined,
    "provider": {
      "@type": "Person",
      "name": "Nicolas Draperi",
      "jobTitle": "Guide de Haute Montagne"
    }
  };

  return (
    <main className="relative min-h-screen bg-background text-foreground transition-colors duration-300">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <FaqJsonLd faqs={tabs.flatMap((tab: any) => tab.faqs || [])} lang={lang} />

      {/* Hero Header */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          {sejour.image && (
            <Image
              src={sejour.image}
              alt={(lang === 'en' ? (sejour.imageAltEn || sejour.imageAlt) : sejour.imageAlt) || at({ fr: sejour.title, en: sejour.titleEn })}
              fill
              sizes="100vw"
              priority
              quality={90}
              className="object-cover"
            />
          )}
          <div className="absolute inset-0 bg-black/40 bg-linear-to-t from-background via-transparent to-black/20" />
        </div>

        <div className="container relative z-10 px-6 pt-32 max-w-5xl">
          <Link
            href={`/${activitySlug}/${subCategorySlug}`}
            className="inline-flex items-center gap-2 text-accent font-bold mb-8 hover:gap-4 transition-all duration-300 uppercase"
          >
            <ArrowLeft size={20} />
            {at("RETOUR À")} {sejour.subCategoryTitle ? at(sejour.subCategoryTitle) : at("L'UNIVERS")}
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
            {at({ fr: sejour.title, en: sejour.titleEn })}
          </h1>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-20">

            {/* Main Content */}
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

            {/* Sidebar — 2 blocs distincts */}
            <div className="lg:col-span-1">
              <div className="sticky top-32 space-y-6">

              {/* Bloc 1 — Fiche Technique + Tarifs + CTA */}
              <div className="glass p-10 rounded-[40px] border border-border shadow-2xl">
                <h3 className="text-2xl font-black uppercase tracking-tight mb-8">{at('Fiche Technique')}</h3>

                <div className="space-y-6 mb-10">
                  <FicheRow
                    icon={<Clock size={18} className="text-accent" />}
                    label={at('Durée')}
                    value={at({ fr: sejour.duration, en: sejour.durationEn })}
                    tooltip={sejour.ficheTooltips?.duration}
                  />
                  <FicheRow
                    icon={<BarChart3 size={18} className="text-accent" />}
                    label={at('Niveau technique')}
                    value={sejour.level ? <LevelValue raw={sejour.level} text={getLevelLabel(sejour.level)} icons={settingsData?.technicalLevelIcons} showText={settingsData?.levelIconsShowText} lang={lang} /> : null}
                    tooltip={sejour.ficheTooltips?.level}
                  />
                  <FicheRow
                    icon={<BarChart3 size={18} className="text-accent" />}
                    label={at('Niveau physique')}
                    value={sejour.physicalLevel ? <LevelValue raw={sejour.physicalLevel} text={sejour.physicalLevel} icons={settingsData?.physicalLevelIcons} showText={settingsData?.levelIconsShowText} lang={lang} /> : null}
                    tooltip={sejour.physicalLevelTooltip || sejour.ficheTooltips?.physicalLevel}
                  />
                  <FicheRow
                    icon={<MapPin size={18} className="text-accent" />}
                    label={at('Massif')}
                    value={at(sejour.massif)}
                    tooltip={sejour.ficheTooltips?.massif}
                  />
                  <FicheRow
                    icon={<Users size={18} className="text-accent" />}
                    label={at('Participants')}
                    value={sejour.participants ? at({ fr: sejour.participants, en: sejour.participantsEn }) : undefined}
                    tooltip={sejour.ficheTooltips?.participants}
                  />
                  <FicheRow
                    icon={<CalendarDays size={18} className="text-accent" />}
                    label={at('Période')}
                    value={sejour.period ? at({ fr: sejour.period, en: sejour.periodEn }) : undefined}
                    tooltip={sejour.ficheTooltips?.period}
                  />

                  {/* Tarifs */}
                  <div className="group/fiche relative py-4 border-b border-border space-y-3">
                    <div className="flex items-center gap-3 mb-2">
                      <Euro size={18} className="text-accent" />
                      <span className="text-xs font-bold uppercase tracking-widest text-foreground/40">{at('Tarifs')}</span>
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
                          <span className="text-[11px] font-bold text-foreground/50 uppercase tracking-wider">{at('Tout compris')}</span>
                          <span className="font-black text-highlight">{at({ fr: sejour.prixToutComprisAmount, en: sejour.prixToutComprisAmountEn })}</span>
                        </div>
                      ) : null
                    ) : (
                      <>
                        {sejour.priceEncadrement ? (
                          <div className="flex justify-between items-baseline">
                            <span className="text-[11px] font-bold text-foreground/50 uppercase tracking-wider">{at('Encadrement')}</span>
                            <span className="font-black text-highlight">{at({ fr: sejour.priceEncadrement, en: sejour.priceEncadrementEn })}</span>
                          </div>
                        ) : null}
                        {sejour.priceFraisSejour ? (
                          <div className="flex justify-between items-baseline">
                            <span className="text-[11px] font-bold text-foreground/50 uppercase tracking-wider">{at('Frais de séjour')}</span>
                            <span className="font-black text-foreground/80">{at({ fr: sejour.priceFraisSejour, en: sejour.priceFraisSejourEn })}</span>
                          </div>
                        ) : null}
                        {!sejour.priceEncadrement && !sejour.priceFraisSejour && sejour.basePrice ? (
                          <div className="flex justify-between items-baseline">
                            <span className="text-[10px] font-bold text-foreground/30 uppercase">{at('À partir de')}</span>
                            <span className="text-2xl font-black text-highlight leading-none">{at({ fr: sejour.basePrice, en: sejour.basePriceEn })}</span>
                          </div>
                        ) : null}
                      </>
                    )}
                  </div>
                </div>

                <BookingButton url={sejour.bookAdventureUrl} label={at('Réserver ce séjour')} />

                <p className="text-[10px] text-center mt-6 text-foreground/40 font-bold uppercase tracking-widest">
                  {at('Conseils & Réservation par téléphone possible')}
                </p>
              </div>

              {/* Bloc 2 — Prochains Départs (conditionnel) */}
              {!sejour.hideUpcomingSorties && (
                <div className="glass p-8 rounded-[40px] border border-border shadow-xl">
                  <h4 className="text-xs font-black uppercase tracking-[0.2em] text-accent mb-6 flex items-center gap-2">
                    <Calendar size={14} />
                    {at('Prochains Départs')}
                  </h4>
                  {sejour.upcomingSorties && sejour.upcomingSorties.length > 0 ? (
                    <div className="space-y-3">
                      {sejour.upcomingSorties.map((s: any, i: number) => (
                        <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-foreground/5 border border-border">
                          <div className="flex flex-col">
                            <span className="font-bold text-sm">{at(s.date)}</span>
                            <span className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest">{at(s.availableSpots)} {at('places')}</span>
                          </div>
                          {s.isFull ? (
                            <span className="text-[8px] font-black uppercase bg-red-500/10 text-red-500 px-2 py-1 rounded-full border border-red-500/20">{at('Complet')}</span>
                          ) : (
                            <span className="text-[8px] font-black uppercase bg-green-500/10 text-green-500 px-2 py-1 rounded-full border border-green-500/20">{at('Disponible')}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 rounded-2xl bg-foreground/5 border border-dashed border-border text-center">
                      <p className="text-xs font-bold text-foreground/40 uppercase tracking-widest">{at('Dates sur demande')}</p>
                    </div>
                  )}

                  <div className="mt-6 space-y-4 p-5 rounded-3xl bg-accent/5 border border-accent/10 text-[11px] leading-relaxed text-foreground/70 font-medium">
                    {settingsData?.sejourSidebarNotice ? (
                      renderRichText(translatePortableText(settingsData.sejourSidebarNotice) || at(settingsData.sejourSidebarNotice))
                    ) : (
                      <>
                        <p className="mb-3">
                          <span className="text-accent font-bold block mb-1 uppercase">{at('PARTAGE DE SORTIE')}</span>
                          {at("Ces dates sont destinées aux personnes souhaitant s'inscrire individuellement et partager les frais d'une sortie.")}
                        </p>
                        <p>
                          <span className="text-accent font-bold block mb-1 uppercase">{at('GROUPES & SUR MESURE')}</span>
                          {at('Si vous êtes un groupe déjà constitué ou si vous souhaitez')} <span className="text-accent font-bold">{at('ouvrir de nouvelles dates')}</span> {at('à la demande, contactez-moi directement pour un engagement privé.')}
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

      {/* Photo Gallery */}
      {!sejour.hideGallery && fullGallery.length > 0 && (
        <section className="pb-24">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase mb-10">
              {at('Galerie')} <span className="text-accent italic">{at('Photos')}</span>
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {fullGallery.map((photo: { url: string; alt?: string; imageName?: string; originalFilename?: string; extension?: string }, i: number) => {
                const dlFilename = photo.imageName
                  ? `${photo.imageName}.${photo.extension || photo.originalFilename?.split('.').pop() || 'jpg'}`
                  : photo.originalFilename;
                const downloadUrl = dlFilename ? `${photo.url.split('?')[0]}?dl=${encodeURIComponent(dlFilename)}` : undefined;
                return (
                  <div key={i} className="relative aspect-square overflow-hidden rounded-2xl group">
                    <Image
                      src={photo.url}
                      alt={(lang === 'en' ? ((photo as any).altEn || photo.alt) : photo.alt) || at({ fr: sejour.title, en: sejour.titleEn })}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      quality={85}
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                    {downloadUrl && (
                      <a
                        href={downloadUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Télécharger"
                        className="absolute bottom-2 right-2 p-1.5 rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-accent/80 z-10"
                      >
                        <Download size={13} />
                      </a>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Recommended séjours */}
      {sejour.recommendedSejours?.length > 0 && (
        <section className="pb-24">
          <div className="container mx-auto px-6 pt-16">
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase mb-10">
              {at({ fr: 'Séjours', en: 'Recommended' })} <span className="text-accent italic">{at({ fr: 'recommandés', en: 'Trips' })}</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {sejour.recommendedSejours.map((s: any) => (
                <SejourCard key={s.slug} sejour={s} activitySlug={s.activitySlug || s.activityType} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Related Blog Posts */}
      {!sejour.hideRelatedPosts && relatedPosts && relatedPosts.length > 0 && (
        <section className="pb-24 bg-surface/40">
          <div className="container mx-auto px-6 pt-16">
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase mb-10">
              {at({ fr: 'Récits de', en: 'Related' })} <span className="text-accent italic">{at({ fr: 'Séjours', en: 'Trip Reports' })}</span>
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
  );
}
