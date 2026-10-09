import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { client } from '@/sanity/lib/live'
import { postBySlugEnQuery, postBySlugQuery, postSlugEnQuery } from '@/sanity/lib/queries'
import { prefersFrench } from '@/i18n/server'
import PostDetail from '@/components/PostDetail'

export async function generateStaticParams() {
  const slugs = await client.fetch(postSlugEnQuery)
  return (slugs || []).map((p: any) => ({ activitySlug: p.slugEn }))
}

export async function generateMetadata({ params }: { params: Promise<{ activitySlug: string }> }): Promise<Metadata> {
  const { activitySlug: slug } = await params
  const ref = await client.fetch(postBySlugEnQuery, { slug })
  if (!ref) return {}
  const post = await client.fetch(postBySlugQuery, { slug: ref.slug })
  if (!post) return {}
  const titleStr = post.metaTitleEn || post.titleEn || post.title
  const title = titleStr.includes('La Montagne Guide') ? titleStr : `${titleStr} | La Montagne Guide`
  const description = post.excerptEn || post.excerpt || post.metaDescriptionEn || post.metaDescription || ''
  return {
    title,
    description,
    alternates: {
      canonical: `/en/${slug}`,
      languages: { fr: `/${ref.slug}`, en: `/en/${slug}` },
    },
    openGraph: {
      title,
      description,
      locale: 'en_US',
      alternateLocale: 'fr_FR',
    },
  }
}

export default async function EnPostPage({ params }: { params: Promise<{ activitySlug: string }> }) {
  const { activitySlug: slug } = await params

  const ref = await client.fetch(postBySlugEnQuery, { slug })
  if (!ref) notFound()

  const post = await client.fetch(postBySlugQuery, { slug: ref.slug })
  if (!post) notFound()

  if (await prefersFrench()) redirect(`/${ref.slug}`)

  return <PostDetail post={post} forceLang="en" />
}
