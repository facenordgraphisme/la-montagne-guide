import { groq } from 'next-sanity'

export const homeQuery = groq`*[_type == "home"][0]{
  heroTitle, heroTitleEn,
  heroSubtitle, heroSubtitleEn,
  heroDescription, heroDescriptionEn,
  "heroImages": heroImages[].asset->url,

  aboutBadge, aboutBadgeEn,
  aboutTitle, aboutTitleEn,
  aboutTitleAccent, aboutTitleAccentEn,
  aboutDescription, aboutDescriptionEn,
  "aboutImage": aboutImage.asset->url,
  experienceYears,

  activitiesTitle, activitiesTitleEn,
  activitiesTitleAccent, activitiesTitleAccentEn,
  activitiesDescription, activitiesDescriptionEn,

  sortiesBadge, sortiesBadgeEn,
  sortiesTitle, sortiesTitleEn,
  sortiesTitleAccent, sortiesTitleAccentEn,

  adventureBadge, adventureBadgeEn,
  adventureTitle, adventureTitleEn,
  adventureTitleAccent, adventureTitleAccentEn,
  adventureDescription, adventureDescriptionEn,
  adventureFeatures, adventureFeaturesEn,
  "adventureImage": adventureImage.asset->url,

  contactBadge, contactBadgeEn,
  contactTitle, contactTitleEn,
  contactTitleAccent, contactTitleAccentEn,
  contactDescription, contactDescriptionEn,

  testimonialsBadge, testimonialsBadgeEn,
  testimonialsTitle, testimonialsTitleEn,
  testimonialsTitleAccent, testimonialsTitleAccentEn,

  blogBadge, blogBadgeEn,
  blogTitle, blogTitleEn,
  blogTitleAccent, blogTitleAccentEn,
  hideTestimonials,
  hideBlog,
  hideSorties,
  hideAdventure,
  featuredPostsLimit,
  heroTextAlign,
  heroBtnDiscoverText, heroBtnDiscoverTextEn,
  heroBtnDeparturesText, heroBtnDeparturesTextEn
}`

export const testimonialsQuery = groq`*[_type == "testimonial"] | order(_createdAt desc) {
  author,
  role,
  quote,
  rating,
  "avatar": avatar.asset->url
}`

export const sortiesQuery = groq`*[_type == "sortie" && !(sejour->isHidden == true)] | order(startDate asc) {
  date,
  startDate,
  availableSpots,
  isFull,
  titleOverride,
  titleOverrideEn,
  "sejour": sejour-> {
    title,
    titleEn,
    "slug": slug.current,
    "slugEn": slugEn,
    activityType,
    "subCategory": subCategory->slug.current,
    "subCategorySlug": subCategory->slug.current,
    massif,
    level,
    season,
    duration,
    basePrice,
    "image": image.asset->url
  }
}`

export const sejoursQuery = groq`*[_type == "sejour" && !(isHidden == true)] | order(title asc) {
  title,
  titleEn,
  "slug": slug.current,
  "slugEn": slugEn,
  activityType,
  "subCategory": subCategory->slug.current,
  "subCategorySlug": subCategory->slug.current,
  massif,
  level,
  season,
  duration,
  basePrice,
  "image": image.asset->url,
  description
}`

export const sejoursByActivityQuery = groq`*[_type == "sejour" && !(isHidden == true) && activityType == $activity] | order(title asc) {
  title,
  titleEn,
  "slug": slug.current,
  "slugEn": slugEn,
  activityType,
  "subCategory": subCategory->slug.current,
  "subCategorySlug": subCategory->slug.current,
  massif,
  level,
  season,
  duration,
  basePrice,
  "image": image.asset->url,
  description
}`

export const sejourBySlugQuery = groq`*[_type == "sejour" && !(isHidden == true) && slug.current == $slug][0] {
  ...,
  slugEn,
  "subCategory": subCategory->slug.current,
  "subCategoryTitle": subCategory->title,
  "image": image.asset->url,
  "imageAlt": image.alt,
  "imageAltEn": coalesce(image.altEn, image.alt),
  priceEncadrement,
  priceFraisSejour,
  hideUpcomingSorties,
  hideGallery,
  "programme": programme[]{
    ...,
    _type == "image" => { ..., "asset": asset-> }
  },
  "budget": budget[]{
    ...,
    _type == "image" => { ..., "asset": asset-> }
  },
  "infosPratiques": infosPratiques[]{
    ...,
    _type == "image" => { ..., "asset": asset-> }
  },
  "materiel": materiel[]{
    ...,
    _type == "image" => { ..., "asset": asset-> }
  },
  "materielPdf": materielPdf.asset->url,
  "gallery": gallery[]{imageName, "caption": coalesce(caption, asset->description), captionEn, alt, altEn, "url": asset->url, "originalFilename": asset->originalFilename, "extension": asset->extension},
  "upcomingSorties": *[_type == "sortie" && sejour._ref == ^._id && startDate >= now()] | order(startDate asc) {
    date,
    availableSpots,
    isFull
  },
  "faqs": faqs[]->{_id, question, questionEn, answer, answerEn, "category": category->slug.current, "categoryTitle": category->title, "categoryTitleEn": category->titleEn, order},
  title, titleEn,
  description, descriptionEn,
  duration, durationEn,
  participants,
  period,
  "tabs": tabs[]{
    _type == "reference" => @->{
      title,
      titleEn,
      content[]{
        ...,
        _type == "image" => { ..., "asset": asset-> },
        _type == "ctaBlock" => { ..., "cta": cta-> }
      },
      contentEn[]{
        ...,
        _type == "image" => { ..., "asset": asset-> },
        _type == "ctaBlock" => { ..., "cta": cta-> }
      },
      "pdf": pdf.asset->url,
      "faqs": faqs[]->{_id, question, questionEn, answer, answerEn}
    },
    _type != "reference" => {
      title,
      titleEn,
      content[]{
        ...,
        _type == "image" => { ..., "asset": asset-> },
        _type == "ctaBlock" => { ..., "cta": cta-> }
      },
      contentEn[]{
        ...,
        _type == "image" => { ..., "asset": asset-> },
        _type == "ctaBlock" => { ..., "cta": cta-> }
      },
      "pdf": pdf.asset->url
    }
  }[defined(title)],
  "templateTabs": templateTabs[]->{
    title,
    titleEn,
    content[]{
      ...,
      _type == "image" => { ..., "asset": asset-> },
      _type == "ctaBlock" => { ..., "cta": cta-> }
    },
    contentEn[]{
      ...,
      _type == "image" => { ..., "asset": asset-> },
      _type == "ctaBlock" => { ..., "cta": cta-> }
    },
    "pdf": pdf.asset->url,
    "faqs": faqs[]->{_id, question, questionEn, answer, answerEn}
  },
  "relatedTags": relatedTags[]->slug.current,
  "relatedTagIds": relatedTags[]._ref,
  "tagBrowsedImages": tagBrowsedImages[]{imageName, "caption": coalesce(caption, asset->description), alt, altEn, "url": asset->url, "originalFilename": asset->originalFilename, "extension": asset->extension},
  relatedPostsLimit,
  hideRelatedPosts,
  bookAdventureUrl,
  "recommendedSejours": (recommendedSejours[!(@->isHidden == true)]->{
    title,
    titleEn,
    "slug": slug.current,
    slugEn,
    activityType,
    "activitySlug": subCategory->activity->slug.current,
    "subCategory": subCategory->slug.current,
    "subCategorySlug": subCategory->slug.current,
    massif,
    level,
    duration,
    basePrice,
    "image": image.asset->url
  })[defined(slug)],
  "relatedPosts": relatedPosts[!(@->isHidden == true)]->{
    title, titleEn,
    "slug": slug.current, slugEn,
    "date": publishedAt,
    "image": mainImage.asset->url,
    "imageAlt": coalesce(mainImage.alt, mainImage.asset->altText),
    "imageAltEn": coalesce(mainImage.altEn, mainImage.alt, mainImage.asset->altText),
    "imageName": mainImage.imageName,
    excerpt,
    excerptEn
  }
}`

export const postsBySejourQuery = groq`*[_type == "post" && !(isHidden == true) && relatedSejour._ref == $sejourId] | order(publishedAt desc)[0...$limit] {
  title, titleEn,
  "slug": slug.current, slugEn,
  "date": publishedAt,
  "image": mainImage.asset->url,
  "imageAlt": coalesce(mainImage.alt, mainImage.asset->altText),
  "imageAltEn": coalesce(mainImage.altEn, mainImage.alt, mainImage.asset->altText),
  "imageName": mainImage.imageName,
  excerpt, excerptEn
}`


export const postsByTagsQuery = groq`*[_type == "post" && !(isHidden == true) && count(tags[@._ref in $tagIds]) > 0] | order(publishedAt desc)[0...$limit] {
  title, titleEn,
  "slug": slug.current, slugEn,
  "date": publishedAt,
  "image": mainImage.asset->url,
  "imageAlt": coalesce(mainImage.alt, mainImage.asset->altText),
  "imageAltEn": coalesce(mainImage.altEn, mainImage.alt, mainImage.asset->altText),
  "imageName": mainImage.imageName,
  excerpt, excerptEn
}`

export const postsByActivityQuery = groq`*[_type == "post" && !(isHidden == true) && (activityType == $activityType || activityType->_ref == $activityType || activityType->type == $activityType || activityType->slug.current == $activityType) && !(relatedSejour._ref in $excludedIds)] | order(publishedAt desc)[0...$limit] {
  title, titleEn,
  "slug": slug.current, slugEn,
  "date": publishedAt,
  "image": mainImage.asset->url,
  "imageAlt": coalesce(mainImage.alt, mainImage.asset->altText),
  "imageAltEn": coalesce(mainImage.altEn, mainImage.alt, mainImage.asset->altText),
  "imageName": mainImage.imageName,
  excerpt, excerptEn
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

export const activitySlugsQuery = groq`*[_type == "activity"] { "slug": slug.current }`

export const activitiesQuery = groq`*[_type == "activity"] | order(title asc) {
  _id,
  title, titleEn,
  "slug": slug.current,
  subtitle, subtitleEn,
  intro, introEn,
  description, descriptionEn,
  "image": image.asset->url,
  keyPoints,
  details, detailsEn,
  universBadge, universBadgeEn,
  universTitle, universTitleEn,
  universDescription, universDescriptionEn,
  "univers": *[_type == "univers" && !(isHidden == true) && activity._ref == ^._id] {
    title, titleEn,
    "slug": slug.current,
    description, descriptionEn,
    "image": image.asset->url,
    catalogTitle, catalogTitleEn
  },
  price,
  period, periodEn,
  location, locationEn,
  showUpcomingSorties,
  type,
  customTripText, customTripTextEn,
  customTripCTA, customTripCTAEn,
  hideCustomTrip
}`

export const activityBySlugQuery = groq`*[_type == "activity" && slug.current == $slug][0] {
  title, titleEn,
  "slug": slug.current,
  subtitle, subtitleEn,
  intro, introEn,
  description, descriptionEn,
  "image": image.asset->url,
  keyPoints,
  details, detailsEn,
  universBadge, universBadgeEn,
  universTitle, universTitleEn,
  universDescription, universDescriptionEn,
  "univers": *[_type == "univers" && !(isHidden == true) && activity._ref == ^._id] {
    title, titleEn,
    "slug": slug.current,
    description, descriptionEn,
    "image": image.asset->url,
    catalogTitle, catalogTitleEn,
    metaTitle, metaDescription,
    "faqs": faqs[]->{_id, question, questionEn, answer, answerEn, "category": coalesce(category->slug.current, category), "categoryTitle": category->title, "categoryTitleEn": category->titleEn, order}
  },
  price,
  period, periodEn,
  location, locationEn,
  showUpcomingSorties,
  type,
  customTripText, customTripTextEn,
  customTripCTA, customTripCTAEn,
  hideCustomTrip,
  metaTitle, metaDescription,
  "faqs": faqs[]->{_id, question, questionEn, answer, answerEn, "category": coalesce(category->slug.current, category), "categoryTitle": category->title, "categoryTitleEn": category->titleEn, order}
}`

export const blogTeaserQuery = groq`*[_type == "post" && !(isHidden == true)] | order(publishedAt desc)[0...$limit] {
  title,
  titleEn,
  "slug": slug.current,
  "slugEn": slugEn,
  "date": publishedAt,
  "image": mainImage.asset->url,
  "imageAlt": coalesce(mainImage.alt, mainImage.asset->altText),
  "imageAltEn": coalesce(mainImage.altEn, mainImage.alt, mainImage.asset->altText),
  "imageName": mainImage.imageName,
  "excerpt": coalesce(excerpt, pt::text(body)),
  excerptEn
}`

export const guideQuery = groq`*[_type == "guide"][0] {
  badge, badgeEn,
  titleNormal, titleNormalEn,
  titleAccent, titleAccentEn,
  quote, quoteEn,
  "image": image.asset->url,
  bioTitle, bioTitleEn,
  bio, bioEn,
  certification,
  certificationSub, certificationSubEn,
  experience,
  experienceSub, experienceSubEn,
  values[]{title, titleEn, description, descriptionEn},
  sections[] {
    title, titleEn,
    content, contentEn,
    image,
    imagePosition
  },
  hideStats,
  hideValues,
  "faqs": faqs[]->{_id, question, questionEn, answer, answerEn, "category": coalesce(category->slug.current, category), "categoryTitle": category->title, "categoryTitleEn": category->titleEn, order}
}`

export const contactQuery = groq`*[_type == "contact"][0] {
  title,
  heading,
  headingEn,
  "image": coalesce(image.asset->url, *[_type == "home"][0].heroImages[0].asset->url),
  "imageAlt": image.alt,
  description,
  email,
  phone,
  location
}`

export const postsQuery = groq`*[_type == "post" && !(isHidden == true)] | order(publishedAt desc) {
  title,
  "slug": slug.current,
  "date": publishedAt,
  "image": mainImage.asset->url,
  "imageAlt": coalesce(mainImage.alt, mainImage.asset->altText),
  "imageAltEn": coalesce(mainImage.altEn, mainImage.alt, mainImage.asset->altText),
  "imageName": mainImage.imageName,
  excerpt,
  excerptEn,
  "body": body[] {
    ...,
    _type == "image" => {
      ...,
      "alt": coalesce(alt, asset->altText)
    },
    _type == "gallery" => {
      ...,
      images[] {
        ...,
        "alt": coalesce(alt, asset->altText)
      }
    }
  },
  "tags": tags[]->name
}`

export const postSlugsQuery = groq`*[_type == "post" && !(isHidden == true)]{ "slug": slug.current }`

export const postsPageQuery = groq`{
  "posts": *[_type == "post" && !(isHidden == true)
    && (!defined($category) || $category in tags[]->slug.current || activityType->slug.current == $category)
    && (!defined($massif) || $massif in tags[]->slug.current)
    && (!defined($q) || title match $q + "*" || excerpt match $q + "*")
  ] | order(publishedAt desc) [$start...$end] {
    title,
    titleEn,
    "slug": slug.current,
    "slugEn": slugEn,
    "date": publishedAt,
    "image": mainImage.asset->url,
    "imageAlt": coalesce(mainImage.alt, mainImage.asset->altText),
    "imageAltEn": coalesce(mainImage.altEn, mainImage.alt, mainImage.asset->altText),
    "imageName": mainImage.imageName,
    excerpt,
    excerptEn
  },
  "total": count(*[_type == "post" && !(isHidden == true)
    && (!defined($category) || $category in tags[]->slug.current || activityType->slug.current == $category)
    && (!defined($massif) || $massif in tags[]->slug.current)
    && (!defined($q) || title match $q + "*" || excerpt match $q + "*")
  ])
}`

export const categoryTagsQuery = groq`*[_type == "tag" && tagType == "category"] | order(name asc) { name, nameEn, "slug": slug.current }`

export const massifTagsQuery = groq`*[_type == "tag" && tagType == "massif"] | order(name asc) { name, nameEn, "slug": slug.current }`

export const postBySlugQuery = groq`*[_type == "post" && !(isHidden == true) && slug.current == $slug][0] {
  _id,
  title,
  titleEn,
  "slug": slug.current,
  slugEn,
  "date": publishedAt,
  "image": mainImage.asset->url,
  "imageAlt": coalesce(mainImage.alt, mainImage.asset->altText),
  "imageAltEn": coalesce(mainImage.altEn, mainImage.alt, mainImage.asset->altText),
  "imageName": mainImage.imageName,
  excerpt,
  excerptEn,
  "bodyEn": bodyEn[] {
    ...,
    _type == "image" => {
      ...,
      "alt": coalesce(alt, asset->altText),
      "caption": coalesce(caption, asset->description),
      "altEn": coalesce(altEn, alt, asset->altText)
    },
    _type == "gallery" => {
      ...,
      images[] {
        ...,
        "alt": coalesce(alt, asset->altText),
        "caption": coalesce(caption, asset->description),
        "altEn": coalesce(altEn, alt, asset->altText),
        captionEn,
        "url": asset->url,
        "originalFilename": asset->originalFilename,
        "extension": asset->extension
      }
    },
    _type == "ctaBlock" => { ..., "cta": cta-> }
  },
  "body": body[] {
    ...,
    _type == "image" => {
      ...,
      "alt": coalesce(alt, asset->altText),
      "caption": coalesce(caption, asset->description),
      "altEn": coalesce(altEn, alt, asset->altText)
    },
    _type == "gallery" => {
      ...,
      images[] {
        ...,
        "alt": coalesce(alt, asset->altText),
        "caption": coalesce(caption, asset->description),
        "altEn": coalesce(altEn, alt, asset->altText),
        captionEn,
        "url": asset->url,
        "originalFilename": asset->originalFilename,
        "extension": asset->extension
      }
    },
    _type == "ctaBlock" => { ..., "cta": cta-> }
  },
  "gallery": gallery[]{
    captionEn,
    imageName,
    "alt": coalesce(alt, asset->altText),
    "caption": coalesce(caption, asset->description),
    "altEn": coalesce(altEn, alt, asset->altText),
    "url": asset->url,
    "originalFilename": asset->originalFilename,
    "extension": asset->extension
  },
  "tags": array::compact([
    activityType->{ "name": title, "slug": slug.current, "tagType": "category" }
  ] + tags[]->{ name, nameEn, "slug": slug.current, tagType }),
  "prevPost": *[_type == "post" && !(isHidden == true) && (publishedAt < ^.publishedAt || (publishedAt == ^.publishedAt && _createdAt < ^._createdAt))] | order(publishedAt desc, _createdAt desc)[0] {
    title, titleEn, "slug": slug.current, slugEn
  },
  "nextPost": *[_type == "post" && !(isHidden == true) && (publishedAt > ^.publishedAt || (publishedAt == ^.publishedAt && _createdAt > ^._createdAt))] | order(publishedAt asc, _createdAt asc)[0] {
    title, titleEn, "slug": slug.current, slugEn
  },
  metaTitle,
  metaDescription,
  metaTitleEn,
  metaDescriptionEn,
  ctaText,
  ctaTextEn,
  ctaLink,
  topo[]{
    ...,
    _type == "image" => { ..., "asset": asset-> }
  },
  topoEn[]{
    ...,
    _type == "image" => { ..., "asset": asset-> }
  },
  "faqs": faqs[]->{_id, question, questionEn, answer, answerEn, "category": category->slug.current, "categoryTitle": category->title, "categoryTitleEn": category->titleEn, order},
  "relatedActivities": relatedActivities[!(@->isHidden == true)]-> {
    title,
    "slug": slug.current,
    "image": image.asset->url,
    basePrice,
    "categorySlug": activityType,
    "subCategorySlug": subCategory->slug.current
  },
  "tagBrowsedImages": tagBrowsedImages[]{imageName, "caption": coalesce(caption, asset->description), alt, altEn, "url": asset->url, "originalFilename": asset->originalFilename, "extension": asset->extension},
  "comments": *[_type == "comment" && post._ref == ^._id && approved == true] | order(_createdAt asc) {
    _id,
    name,
    rating,
    content,
    _createdAt
  }
}`

export const settingsQuery = groq`*[_type == "settings"][0]{
  "technicalLevelIcons": technicalLevelIcons[]{ label, labelEn, "icon": icon.asset->url },
  "physicalLevelIcons": physicalLevelIcons[]{ label, labelEn, "icon": icon.asset->url },
  levelIconsShowText,
  siteName,
  clientPasscode,
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
  },
  activitiesPageTitle,
  activitiesPageTitleEn,
  activitiesPageDescription,
  activitiesPageDescriptionEn,
  "activitiesOrder": activitiesOrder[]->{
    _id
  },
  sortiesPageTitle,
  sortiesPageTitleEn,
  sortiesPageDescription,
  sortiesPageDescriptionEn,
  hideRessourcesPage,
  ressourcesMenuTitle,
  ressourcesMenuTitleEn,
  ressourcesPageTitle,
  ressourcesPageTitleEn,
  ressourcesPageDescription,
  ressourcesPageDescriptionEn,
  hideTarifsPage,
  tarifsMenuTitle,
  tarifsMenuTitleEn,
  tarifsPageTitle,
  tarifsPageTitleEn,
  tarifsPageDescription,
  tarifsPageDescriptionEn,
  tarifsContent,
  menuActivities,
  menuActivitiesEn,
  menuSorties,
  menuSortiesEn,
  menuGuide,
  menuGuideEn,
  menuBlog,
  menuBlogEn,
  sejourSidebarNotice,
  sejourSidebarNoticeEn,
  bgColorLight,
  bgColorDark,
  accentColor,
  highlightColor,
  btnHoverColor,
  textColorLight,
  titleColorLight,
  textColorDark,
  titleColorDark,
  fontFamily,
  fontScale,
  ressourcesBadge,
  ressourcesBadgeEn,
  ressourcesHeaderAlign,
  "homeFaqCategories": homeFaqCategories[]->slug.current
}`

export const faqsQuery = groq`*[_type == "faq"] | order(order asc, _createdAt desc) {
  _id,
  question,
  questionEn,
  answer,
  answerEn,
  "category": category->slug.current,
  "categoryTitle": category->title,
  "categoryTitleEn": category->titleEn
}`

export const resourceCategoryQuery = groq`*[_type == "resourceCategory"] | order(order asc, title asc) {
  title,
  titleEn,
  "value": slug.current
}`

export const resourcesQuery = groq`*[_type == "resource"] | order(_createdAt desc) {
  _id,
  title,
  titleEn,
  "slug": slug.current,
  category,
  intro,
  introEn,
  "image": image.asset->url,
  "relatedActivities": relatedActivities[!(@->isHidden == true)]-> {
    title,
    "slug": slug.current
  }
}`

export const resourceBySlugQuery = groq`*[_type == "resource" && slug.current == $slug][0] {
  _id,
  title,
  titleEn,
  "slug": slug.current,
  slugEn,
  category,
  intro,
  introEn,
  "image": image.asset->url,
  "imageAlt": image.alt,
  "imageAltEn": coalesce(image.altEn, image.alt),
  "content": content[]{
    ...,
    _type == "ctaBlock" => { ..., "cta": cta-> }
  },
  "contentEn": contentEn[]{
    ...,
    _type == "ctaBlock" => { ..., "cta": cta-> }
  },
  tabs[]{
    title,
    titleEn,
    content[]{
      ...,
      _type == "image" => { ..., "asset": asset-> },
      _type == "ctaBlock" => { ..., "cta": cta-> }
    },
    contentEn[]{
      ...,
      _type == "image" => { ..., "asset": asset-> },
      _type == "ctaBlock" => { ..., "cta": cta-> }
    },
    "pdf": pdf.asset->url
  },
  "relatedActivities": relatedActivities[!(@->isHidden == true)]-> {
    title,
    "slug": slug.current,
    "image": image.asset->url,
    basePrice,
    duration,
    level,
    "categorySlug": activityType,
    "subCategorySlug": subCategory->slug.current
  },
  "faqs": faqs[]->{_id, question, questionEn, answer, answerEn, "category": coalesce(category->slug.current, category), "categoryTitle": category->title, "categoryTitleEn": category->titleEn, order},
  ctaTitle,
  ctaText,
  ctaLink,
  ctaButtonLabel,
  metaTitle,
  metaDescription
}`

// ── EN slug lookup queries ───────────────────────────────────────────────────

export const postBySlugEnQuery = groq`*[_type == "post" && !(isHidden == true) && slugEn == $slug][0] { "slug": slug.current }`

export const resourceBySlugEnQuery = groq`*[_type == "resource" && slugEn == $slug][0] { "slug": slug.current }`

export const sejourBySlugEnQuery = groq`*[_type == "sejour" && !(isHidden == true) && slugEn == $slug][0] {
  "slug": slug.current,
  "activitySlug": activityType,
  "subCategorySlug": subCategory->slug.current
}`

export const postSlugEnQuery = groq`*[_type == "post" && !(isHidden == true) && defined(slugEn)]{ slugEn }`
export const resourceSlugEnQuery = groq`*[_type == "resource" && defined(slugEn)]{ slugEn }`
export const sejourSlugEnQuery = groq`*[_type == "sejour" && !(isHidden == true) && defined(slugEn)]{
  slugEn,
  "activitySlug": activityType,
  "subCategorySlug": subCategory->slug.current
}`

