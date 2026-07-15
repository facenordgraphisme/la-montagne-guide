import { type SchemaTypeDefinition } from 'sanity'
import { activityType } from './activity'
import { postType } from './post'
import { guideType } from './guide'
import { homeType } from './home'
import { contactType } from './contact'
import { testimonialType } from './testimonial'
import { sejourType } from './sejour'
import { universType } from './univers'
import { sortieType } from './sortie'
import { settingsType } from './settings'
import { faqType } from './faq'
import { tagType } from './tag'
import { resourceType } from './resource'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    settingsType,
    activityType,
    postType,
    tagType,
    guideType,
    homeType,
    contactType,
    testimonialType,
    sejourType,
    universType,
    sortieType,
    faqType,
    resourceType,
  ],
}
