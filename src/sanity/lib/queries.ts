import { groq } from 'next-sanity'

export const homeQuery = groq`*[_type == "home"][0]{
  heroTitle,
  heroSubtitle,
  heroDescription,
  "heroImages": heroImages[].asset->url,
  
  aboutBadge,
  aboutTitle,
  aboutTitleAccent,
  aboutDescription,
  "aboutImage": aboutImage.asset->url,
  experienceYears,

  activitiesTitle,
  activitiesTitleAccent,
  activitiesDescription,

  sortiesBadge,
  sortiesTitle,
  sortiesTitleAccent,

  adventureBadge,
  adventureTitle,
  adventureTitleAccent,
  adventureDescription,
  adventureFeatures,
  "adventureImage": adventureImage.asset->url,

  contactBadge,
  contactTitle,
  contactTitleAccent,
  contactDescription,

  testimonialsBadge,
  testimonialsTitle,
  testimonialsTitleAccent,

  blogBadge,
  blogTitle,
  blogTitleAccent
}`

export const testimonialsQuery = groq`*[_type == "testimonial"] | order(_createdAt desc) {
  author,
  role,
  quote,
  rating,
  "avatar": avatar.asset->url
}`

export const sortiesQuery = groq`*[_type == "sortie"] | order(date asc) {
  title,
  "slug": slug.current,
  date,
  price,
  "image": image.asset->url,
  activityType,
  isFull
}`

export const activitiesQuery = groq`*[_type == "activity"] | order(title asc) {
  title,
  "slug": slug.current,
  subtitle,
  intro,
  description,
  "image": image.asset->url,
  keyPoints,
  details,
  universBadge,
  universTitle,
  universDescription,
  univers,
  price,
  period,
  location,
  showUpcomingSorties,
  type
}`

export const activityBySlugQuery = groq`*[_type == "activity" && slug.current == $slug][0] {
  title,
  "slug": slug.current,
  subtitle,
  intro,
  description,
  "image": image.asset->url,
  keyPoints,
  details,
  universBadge,
  universTitle,
  universDescription,
  univers,
  price,
  period,
  location,
  showUpcomingSorties,
  type
}`

export const blogTeaserQuery = groq`*[_type == "post"] | order(publishedAt desc)[0...3] {
  title,
  "slug": slug.current,
  "date": publishedAt,
  "image": mainImage.asset->url,
  "excerpt": pt::text(body)
}`

export const guideQuery = groq`*[_type == "guide"][0] {
  badge,
  titleNormal,
  titleAccent,
  quote,
  "image": image.asset->url,
  bioTitle,
  bio,
  certification,
  certificationSub,
  experience,
  experienceSub,
  values
}`

export const contactQuery = groq`*[_type == "contact"][0] {
  title,
  description,
  email,
  phone,
  location
}`

export const postsQuery = groq`*[_type == "post"] | order(publishedAt desc) {
  title,
  "slug": slug.current,
  "date": publishedAt,
  "image": mainImage.asset->url,
  excerpt,
  "body": body
}`

export const postBySlugQuery = groq`*[_type == "post" && slug.current == $slug][0] {
  title,
  "slug": slug.current,
  "date": publishedAt,
  "image": mainImage.asset->url,
  excerpt,
  body
}`

