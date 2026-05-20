import { defineField, defineType } from 'sanity'
import { FileText } from 'lucide-react'

export const postType = defineType({
  name: 'post',
  title: 'Blog',
  type: 'document',
  icon: FileText,
  fields: [
    defineField({
      name: 'title',
      title: 'Titre',
      type: 'string',
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
      name: 'excerpt',
      title: 'Extrait',
      type: 'text',
      description: 'Un court résumé de l\'article pour la liste des blogs.',
      validation: (Rule) => Rule.max(200),
    }),
    defineField({
      name: 'mainImage',
      title: 'Image principale',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'publishedAt',
      title: 'Date de publication',
      type: 'datetime',
    }),
    defineField({
      name: 'body',
      title: 'Corps',
      type: 'array',
      of: [{ type: 'block' }, { type: 'image' }],
    }),
  ],
})
