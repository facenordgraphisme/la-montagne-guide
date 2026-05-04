import { type SchemaTypeDefinition } from 'sanity'
import { activityType } from './activity'
import { postType } from './post'
import { guideType } from './guide'
import { homeType } from './home'
import { contactType } from './contact'
import { testimonialType } from './testimonial'
import { sortieType } from './sortie'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [activityType, postType, guideType, homeType, contactType, testimonialType, sortieType],
}
