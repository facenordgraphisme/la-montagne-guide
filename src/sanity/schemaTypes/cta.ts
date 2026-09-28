import { defineField, defineType } from 'sanity'
import { MousePointerClick } from 'lucide-react'

export const ctaType = defineType({
  name: 'cta',
  title: 'Bibliothèque CTA',
  type: 'document',
  icon: MousePointerClick,
  fields: [
    defineField({
      name: 'name',
      title: 'Nom interne',
      type: 'string',
      description: 'Identifiant pour retrouver ce CTA dans la bibliothèque.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'text',
      title: 'Texte descriptif (FR)',
      type: 'text',
      rows: 2,
      description: 'Texte affiché au-dessus du bouton.',
    }),
    defineField({
      name: 'textEn',
      title: 'Texte descriptif (EN)',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'buttonLabel',
      title: 'Libellé du bouton (FR)',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'buttonLabelEn',
      title: 'Libellé du bouton (EN)',
      type: 'string',
    }),
    defineField({
      name: 'link',
      title: 'Lien URL',
      type: 'string',
      description: 'URL interne (ex: /contact) ou externe.',
      initialValue: '/contact',
    }),
    defineField({
      name: 'style',
      title: 'Style',
      type: 'string',
      initialValue: 'primary',
      options: {
        list: [
          { title: 'Principal (accent)', value: 'primary' },
          { title: 'Highlight (orange)', value: 'highlight' },
          { title: 'Contour', value: 'outline' },
        ],
        layout: 'radio',
      },
    }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'buttonLabel' },
    prepare({ title, subtitle }: any) {
      return { title: title || 'CTA sans nom', subtitle: subtitle ? `→ ${subtitle}` : '' }
    },
  },
})
