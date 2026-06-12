import { defineField, defineType } from 'sanity'
import { Tag } from 'lucide-react'

export const tagType = defineType({
  name: 'tag',
  title: 'Tags / Catégories',
  type: 'document',
  icon: Tag,
  fields: [
    defineField({
      name: 'name',
      title: 'Nom',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'tagType',
      title: 'Type',
      type: 'string',
      options: {
        list: [
          { title: 'Catégorie / Activité', value: 'category' },
          { title: 'Massif', value: 'massif' },
          { title: 'Autre', value: 'other' },
        ],
      },
      initialValue: 'other',
      description: 'Utilisé pour les filtres de la page blog.',
    }),
  ],
})
