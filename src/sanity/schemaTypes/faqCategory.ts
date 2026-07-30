import { defineField, defineType } from 'sanity'
import { Folder } from 'lucide-react'

export const faqCategoryType = defineType({
  name: 'faqCategory',
  title: 'Catégorie de FAQ',
  type: 'document',
  icon: Folder,
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
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug (Identifiant URL)',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      slug: 'slug.current',
    },
    prepare(selection) {
      const { title, slug } = selection
      return {
        title: title || 'Sans titre',
        subtitle: slug ? `Slug: ${slug}` : '',
      }
    },
  },
})
