import { defineField, defineType } from 'sanity'
import { FileText } from 'lucide-react'
import { AutoFilenameImageInput } from '../components/AutoFilenameImageInput'

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
      components: {
        input: AutoFilenameImageInput
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Texte alternatif (Alt Text)',
          description: 'Important pour l\'accessibilité et le référencement (SEO).',
        },
        {
          name: 'imageName',
          type: 'string',
          title: 'Nom personnalisé / Titre de l\'image',
          description: 'Pour organiser ou nommer l\'image.',
        }
      ]
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
      of: [
        { type: 'block' },
        {
          type: 'image',
          options: { hotspot: true },
          components: {
            input: AutoFilenameImageInput
          },
          fields: [
            { name: 'alt', type: 'string', title: 'Texte alternatif' },
            { name: 'caption', type: 'string', title: 'Légende' },
          ],
        },
        {
          name: 'gallery',
          type: 'object',
          title: 'Galerie d\'images',
          fields: [
            {
              name: 'images',
              type: 'array',
              title: 'Images',
              of: [{
                type: 'image',
                options: { hotspot: true },
                components: {
                  input: AutoFilenameImageInput
                },
                fields: [
                  { name: 'alt', type: 'string', title: 'Texte alternatif' },
                  { name: 'caption', type: 'string', title: 'Légende' },
                ],
              }]
            }
          ]
        },
        {
          name: 'video',
          type: 'object',
          title: 'Vidéo',
          fields: [
            {
              name: 'url',
              type: 'url',
              title: 'URL de la vidéo (YouTube, Vimeo, etc.)'
            }
          ]
        }
      ],
    }),
    defineField({
      name: 'activityType',
      title: 'Catégorie (Type d\'activité)',
      type: 'reference',
      to: [{ type: 'activity' }],
      description: 'Catégorie principale de cet article — utilisée pour afficher les articles pertinents sur les pages séjour.',
    }),
    defineField({
      name: 'relatedSejour',
      title: 'Séjour lié',
      type: 'reference',
      to: [{ type: 'sejour' }],
      description: 'Associer cet article à un séjour pour l\'afficher sur la page du séjour',
    }),
    defineField({
      name: 'tags',
      title: 'Tags / Catégories',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'tag' }] }],
      description: 'Tags et catégories associés à cet article'
    }),
    defineField({
      name: 'gallery',
      title: 'Galerie photos (Bas d\'article)',
      type: 'array',
      options: {
        layout: 'grid',
      },
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          components: {
            input: AutoFilenameImageInput
          },
          fields: [
            defineField({ name: 'alt', type: 'string', title: 'Texte alternatif' }),
          ],
        },
      ],
      description: 'Optionnel. Galerie de photos qui s\'affichera automatiquement en bas de l\'article.',
    }),
  ],
})
