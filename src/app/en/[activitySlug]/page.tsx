import type { Metadata } from 'next'
import { notFound, permanentRedirect, redirect } from 'next/navigation'
import { client } from '@/sanity/lib/live'
import { activityBySlugQuery, postBySlugEnQuery, postBySlugQuery, postSlugEnQuery } from '@/sanity/lib/queries'
import PostDetail from '@/components/PostDetail'
import { decodeSlug } from '@/lib/localePath'
import { alternatesFor } from '@/lib/seo'
import ActivityOrPostPage, { generateMetadata as activityMetadata } from '@/app/[activitySlug]/page'

type Props = { params: Promise<{ activitySlug: string }> }

export async function generateStaticParams() {
  const slugs = await client.fetch(postSlugEnQuery)
  return (slugs || []).map((p: any) => ({ activitySlug: p.slugEn }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = decodeSlug((await params).activitySlug)
  if (await client.fetch(activityBySlugQuery, { slug })) return activityMetadata({ params })

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
    alternates: alternatesFor('en', `/${ref.slug}`, `/en/${slug}`),
    openGraph: {
      title,
      description,
      locale: 'en_US',
      alternateLocale: 'fr_FR',
    },
  }
}

export default async function EnActivityOrPostPage({ params }: Props) {
  const slug = decodeSlug((await params).activitySlug)

  if (await client.fetch(activityBySlugQuery, { slug })) {
    return <ActivityOrPostPage params={params} />
  }

  const ref = await client.fetch(postBySlugEnQuery, { slug })
  if (ref) {
    const post = await client.fetch(postBySlugQuery, { slug: ref.slug })
    if (!post) notFound()
    return <PostDetail post={post} forceLang="en" />
  }

  // French slug under /en (language switch, internal link): go to the English URL, or to the French page if there is none
  const frPost = await client.fetch(postBySlugQuery, { slug })
  if (!frPost) notFound()
  if (frPost.slugEn) permanentRedirect(encodeURI(`/en/${frPost.slugEn}`))
  redirect(encodeURI(`/${frPost.slug}`))
}
