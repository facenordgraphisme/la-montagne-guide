import { defineField, defineType } from 'sanity'
import { Layers } from 'lucide-react'

export const universType = defineType({
  name: 'univers',
  title: 'Les Univers',
  type: 'document',
  icon: Layers,
  fields: [
    defineField({
      name: 'title',
      title: 'Nom de l\'univers',
      type: 'string',
      description: 'Ex: Initiation, Pente Raide, Course de légende...',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
    }),
    defineField({
      name: 'activity',
      title: 'Activité parente',
      type: 'reference',
      to: [{ type: 'activity' }],
      description: 'À quelle activité appartient cet univers ?',
    }),
    defineField({
      name: 'description',
      title: 'Description de l\'univers',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'image',
      title: 'Image de l\'univers',
      type: 'image',
      options: { hotspot: true },
    }),
  ],
})
