import { groq } from 'next-sanity'

const richContent = `{
  ...,
  _type == "image" => { ..., "url": asset->url }
}`

const tabFields = `
  title,
  titleEn,
  content[]${richContent},
  contentEn[]${richContent},
  "pdf": pdf.asset->url
`

// Everything the PDF fiche needs, read live from the séjour so the file is always up to date
export const sejourPdfQuery = groq`*[_type == "sejour" && !(isHidden == true) && !(_id in path("drafts.**")) && (slug.current == $slug || slugEn == $slug)][0]{
  _id,
  title, titleEn,
  "slug": slug.current,
  slugEn,
  activityType,
  levelDiscipline,
  "subCategory": subCategory->slug.current,
  "activitySlug": coalesce(subCategory->activity->slug.current, activityType),
  massif,
  level,
  physicalLevel,
  duration, durationEn,
  participants, participantsEn,
  period, periodEn,
  basePrice, basePriceEn,
  prixToutCompris, prixToutComprisAmount, prixToutComprisAmountEn,
  priceEncadrement, priceEncadrementEn,
  priceFraisSejour, priceFraisSejourEn,
  "image": image.asset->url,
  description, descriptionEn,
  "templateTabs": templateTabs[]->{ ${tabFields} },
  "tabs": tabs[]{
    _type == "reference" => @->{ ${tabFields} },
    _type != "reference" => { ${tabFields} }
  }[defined(title)],
  programme[]${richContent},
  budget[]${richContent},
  infosPratiques[]${richContent},
  materiel[]${richContent},
  "materielPdf": materielPdf.asset->url,
  "upcomingSorties": *[_type == "sortie" && sejour._ref == ^._id && startDate >= now()] | order(startDate asc) {
    startDate, endDate, date, availableSpots, isFull, isConfirmed
  },
  "settings": *[_type == "settings"][0]{
    "technicalLevelIcons": technicalLevelIcons[]{ label, labelEn, discipline, number },
    "physicalLevelIcons": physicalLevelIcons[]{ label, labelEn, number },
    email, phone, address
  },
  "cgv": *[_type == "resource" && slug.current == "conditions-de-vente"][0]{ title, titleEn, content, contentEn }
}`
