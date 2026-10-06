import { defineField, defineType } from 'sanity'
import { FolderOpen } from 'lucide-react'

export const resourceCategoryType = defineType({
  name: 'resourceCategory',
  title: 'Catégories de Ressources',
  type: 'document',
  icon: FolderOpen,
  fields: [
    defineField({
      name: 'title',
      title: 'Titre (Français)',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'titleEn',
      title: 'Titre (Anglais)',
      type: 'string',
    }),
    defineField({
      name: 'slug',
      title: 'Identifiant URL',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'order',
      title: 'Ordre d\'affichage',
      type: 'number',
      initialValue: 10,
    }),
  ],
  orderings: [
    { title: 'Ordre d\'affichage', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] },
    { title: 'Nom A-Z', name: 'titleAsc', by: [{ field: 'title', direction: 'asc' }] },
  ],
  preview: {
    select: { title: 'title', subtitle: 'slug.current', order: 'order' },
    prepare({ title, subtitle, order }) {
      return {
        title: title || 'Sans titre',
        subtitle: `/${subtitle}  •  ordre: ${order ?? '—'}`,
      }
    },
  },
})
