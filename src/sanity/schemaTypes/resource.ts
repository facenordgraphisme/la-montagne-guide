import { defineField, defineType } from 'sanity'
import { BookOpen } from 'lucide-react'

export const resourceType = defineType({
  name: 'resource',
  title: 'Ressources & Guides',
  type: 'document',
  icon: BookOpen,
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
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Catégorie',
      type: 'string',
      initialValue: 'alpinisme',
      options: {
        list: [
          { title: 'Alpinisme', value: 'alpinisme' },
          { title: 'Ski de Randonnée', value: 'ski' },
          { title: 'Escalade', value: 'escalade' },
          { title: 'Cascade de Glace', value: 'cascade-de-glace' },
          { title: 'Préparation & Physique', value: 'preparation' },
          { title: 'Équipement & Matériel', value: 'equipement' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'intro',
      title: 'Introduction / Chapô (Français)',
      type: 'text',
      rows: 3,
      description: 'Un court résumé affiché dans les listes.',
    }),
    defineField({
      name: 'introEn',
      title: 'Introduction / Chapô (Anglais)',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'image',
      title: 'Image principale',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'content',
      title: 'Contenu (Français)',
      type: 'array',
      of: [
        {
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
        },
        { type: 'image', options: { hotspot: true } }
      ],
    }),
    defineField({
      name: 'contentEn',
      title: 'Contenu (Anglais)',
      type: 'array',
      of: [
        {
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
        },
        { type: 'image', options: { hotspot: true } }
      ],
    }),
    defineField({
      name: 'relatedActivities',
      title: 'Activités & Séjours associés',
      description: 'Liez des séjours recommandés pour faire du maillage interne.',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'sejour' }] }],
    }),
    defineField({
      name: 'faqs',
      title: 'FAQ Associées',
      description: 'Questions/Réponses spécifiques à afficher en bas de ce guide.',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'faq' }] }],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      category: 'category',
      media: 'image',
    },
    prepare(selection) {
      const { title, category, media } = selection
      const catMap: Record<string, string> = {
        alpinisme: 'Alpinisme',
        ski: 'Ski de Randonnée',
        escalade: 'Escalade',
        'cascade-de-glace': 'Cascade de Glace',
        preparation: 'Préparation & Physique',
        equipement: 'Équipement & Matériel',
      }
      return {
        title: title || 'Sans titre',
        subtitle: catMap[category] || category || 'Catégorie générale',
        media,
      }
    },
  },
})
