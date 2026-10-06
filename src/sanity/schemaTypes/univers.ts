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
      title: 'Nom de l\'univers (FR)',
      type: 'string',
    }),
    defineField({
      name: 'titleEn',
      title: 'Nom de l\'univers (EN)',
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
      name: 'activity',
      title: 'Activité parente',
      type: 'reference',
      to: [{ type: 'activity' }],
    }),
    defineField({
      name: 'description',
      title: 'Description de l\'univers (FR)',
      type: 'array',
      of: [{
        type: 'block',
        styles: [
          { title: 'Normal', value: 'normal' },
          { title: 'H2', value: 'h2' },
          { title: 'H3', value: 'h3' },
          { title: 'Centré', value: 'blockCenter' },
          { title: 'Justifié', value: 'blockJustify' },
          { title: 'Droite', value: 'blockRight' },
          { title: 'Citation', value: 'blockquote' }
        ]
      }],
    }),
    defineField({
      name: 'descriptionEn',
      title: 'Description de l\'univers (EN)',
      type: 'array',
      of: [{
        type: 'block',
        styles: [
          { title: 'Normal', value: 'normal' },
          { title: 'H2', value: 'h2' },
          { title: 'H3', value: 'h3' },
          { title: 'Centré', value: 'blockCenter' },
          { title: 'Justifié', value: 'blockJustify' },
          { title: 'Droite', value: 'blockRight' },
          { title: 'Citation', value: 'blockquote' }
        ]
      }],
    }),
    defineField({
      name: 'image',
      title: 'Image de l\'univers',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'catalogTitle',
      title: 'Titre du catalogue de séjours (FR)',
      type: 'string',
    }),
    defineField({
      name: 'catalogTitleEn',
      title: 'Titre du catalogue de séjours (EN)',
      type: 'string',
    }),
    defineField({
      name: 'faqs',
      title: 'Questions fréquentes (FAQ)',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'faq' }], weak: true }],
    }),
    defineField({
      name: 'metaTitle',
      title: '🔍 SEO — Titre (balise title)',
      type: 'string',
    }),
    defineField({
      name: 'metaDescription',
      title: '🔍 SEO — Description (meta description)',
      type: 'text',
      rows: 3,
    }),
  ],
})
