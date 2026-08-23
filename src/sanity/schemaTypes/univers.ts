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
      title: 'Titre du catalogue de séjours',
      type: 'string',
      description: 'Optionnel. Par défaut: "Catalogue Séjours".',
    }),
    defineField({
      name: 'faqs',
      title: 'Questions fréquentes (FAQ)',
      description: 'Sélectionnez des FAQ spécifiques à afficher sur la page de cet univers.',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'faq' }], weak: true }],
    }),
  ],
})
