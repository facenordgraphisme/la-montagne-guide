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
  blogTitleAccent,
  hideTestimonials,
  hideBlog,
  featuredPostsLimit
}`

export const testimonialsQuery = groq`*[_type == "testimonial"] | order(_createdAt desc) {
  author,
  role,
  quote,
  rating,
  "avatar": avatar.asset->url
}`

export const sortiesQuery = groq`*[_type == "sortie"] | order(startDate asc) {
  date,
  availableSpots,
  isFull,
  titleOverride,
  "sejour": sejour-> {
    title,
    "slug": slug.current,
    activityType,
    "subCategory": subCategory->slug.current,
    massif,
    level,
    season,
    duration,
    basePrice,
    "image": image.asset->url
  }
}`

export const sejoursQuery = groq`*[_type == "sejour"] | order(title asc) {
  title,
  "slug": slug.current,
  activityType,
  "subCategory": subCategory->slug.current,
  massif,
  level,
  season,
  duration,
  basePrice,
  "image": image.asset->url,
  description
}`

export const sejoursByActivityQuery = groq`*[_type == "sejour" && activityType == $activity] | order(title asc) {
  title,
  "slug": slug.current,
  activityType,
  "subCategory": subCategory->slug.current,
  massif,
  level,
  season,
  duration,
  basePrice,
  "image": image.asset->url,
  description
}`

export const sejourBySlugQuery = groq`*[_type == "sejour" && slug.current == $slug][0] {
  ...,
  "slug": slug.current,
  "subCategory": subCategory->slug.current,
  "image": image.asset->url,
  "upcomingSorties": *[_type == "sortie" && sejour._ref == ^._id && startDate >= now()] | order(startDate asc) {
    date,
    availableSpots,
    isFull
  }
}`

export const sortieBySlugQuery = groq`*[_type == "sortie" && slug.current == $slug][0] {
  title,
  "slug": slug.current,
  date,
  location,
  duration,
  description,
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
  "univers": *[_type == "univers" && activity._ref == ^._id] {
    title,
    "slug": slug.current,
    description,
    "image": image.asset->url
  },
  price,
  period,
  location,
  showUpcomingSorties,
  type,
  customTripText,
  customTripCTA
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
  "univers": *[_type == "univers" && activity._ref == ^._id] {
    title,
    "slug": slug.current,
    description,
    "image": image.asset->url
  },
  price,
  period,
  location,
  showUpcomingSorties,
  type
}`

export const blogTeaserQuery = groq`*[_type == "post"] | order(publishedAt desc)[0...$limit] {
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

export const settingsQuery = groq`*[_type == "settings"][0]{
  siteName,
  "logoLight": logoLight.asset->url,
  "logoDark": logoDark.asset->url,
  instagram,
  facebook,
  youtube,
  whatsappNumber,
  whatsappText,
  whatsappTextEn,
  email,
  phone,
  address,
  footerDescription,
  footerDescriptionEn,
  copyright,
  seoTitle,
  seoTitleEn,
  seoDescription,
  seoDescriptionEn,
  "seoImage": seoImage.asset->url,
  showBanner,
  bannerText,
  bannerTextEn,
  bannerColor,
  bannerLink,
  hidePartners,
  "partners": partners[]{
    name,
    "logo": logo.asset->url,
    link
  }
}`

export const faqsQuery = groq`*[_type == "faq"] | order(order asc, _createdAt desc) {
  _id,
  question,
  questionEn,
  answer,
  answerEn,
  category
}`

