import { type SchemaTypeDefinition } from 'sanity'
import { activityType } from './activity'
import { postType } from './post'
import { guideType } from './guide'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [activityType, postType, guideType],
}
