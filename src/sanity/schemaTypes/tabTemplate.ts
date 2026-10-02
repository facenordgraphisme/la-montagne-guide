import { defineField, defineType } from 'sanity'
import { LayoutTemplate } from 'lucide-react'
import { FAQPickerInput } from '../components/FAQPickerInput'

const tabContentOf = [
  {
    type: 'block',
    styles: [
      { title: 'Normal', value: 'normal' },
      { title: 'H2', value: 'h2' },
      { title: 'H3', value: 'h3' },
      { title: 'Centré', value: 'blockCenter' },
      { title: 'Justifié', value: 'blockJustify' },
      { title: 'Droite', value: 'blockRight' },
    ],
    marks: {
      decorators: [
        { title: 'Gras', value: 'strong' },
        { title: 'Italique', value: 'em' },
      ],
      annotations: [
        {
          name: 'link',
          type: 'object',
          title: 'Lien hypertexte',
          fields: [
            { name: 'href', type: 'url', title: 'URL' },
            { name: 'blank', type: 'boolean', title: 'Ouvrir dans un nouvel onglet', initialValue: true },
          ],
        },
      ],
    },
  },
  { type: 'image', options: { hotspot: true } },
  {
    type: 'object',
    name: 'mapEmbed',
    title: 'Carte Google Maps',
    fields: [
      defineField({ name: 'url', type: 'url', title: 'URL d\'intégration', description: 'Dans Google Maps → Partager → Intégrer une carte → copier l\'URL du src.', validation: (Rule: any) => Rule.required() }),
      defineField({ name: 'height', type: 'number', title: 'Hauteur (px)', initialValue: 400 }),
    ],
    preview: {
      select: { title: 'url' },
      prepare({ title }: { title?: string }) {
        return { title: title ? `Carte : ${title.substring(0, 60)}…` : 'Carte Google Maps' }
      },
    },
  },
  {
    type: 'object',
    name: 'ctaBlock',
    title: 'CTA / Appel à l\'action',
    fields: [{ name: 'cta', type: 'reference', to: [{ type: 'cta' }], title: 'Choisir un CTA' }],
    preview: {
      select: { title: 'cta.name' },
      prepare({ title }: any) { return { title: `📣 CTA : ${title || '(non défini)'}` } },
    },
  },
]

export const tabTemplateType = defineType({
  name: 'tabTemplate',
  title: 'Modèles d\'Onglets',
  type: 'document',
  icon: LayoutTemplate,
  description: 'Créez des onglets réutilisables à partager entre plusieurs séjours (ex: liste de matériel commune, CGV, infos départ).',
  fields: [
    defineField({
      name: 'name',
      title: 'Nom interne (Studio)',
      type: 'string',
      validation: (Rule) => Rule.required(),
      description: 'Nom affiché uniquement dans le Studio pour identifier ce modèle.',
    }),
    defineField({
      name: 'title',
      title: 'Titre de l\'onglet (Français)',
      type: 'string',
      validation: (Rule) => Rule.required(),
      description: 'Label affiché sur l\'onglet côté site.',
    }),
    defineField({
      name: 'titleEn',
      title: 'Titre de l\'onglet (Anglais)',
      type: 'string',
    }),
    defineField({
      name: 'content',
      title: 'Contenu (Français)',
      type: 'array',
      of: tabContentOf as any,
    }),
    defineField({
      name: 'contentEn',
      title: 'Contenu (Anglais)',
      type: 'array',
      of: tabContentOf as any,
    }),
    defineField({
      name: 'pdf',
      type: 'file',
      title: 'PDF téléchargeable (optionnel)',
      description: 'Un bouton de téléchargement apparaîtra dans l\'onglet.',
      options: { accept: '.pdf' },
    }),
    defineField({
      name: 'faqs',
      title: 'FAQ à afficher dans cet onglet',
      description: 'Filtrez par catégorie pour retrouver vos questions plus facilement.',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'faq' }], weak: true }],
      components: { input: FAQPickerInput },
    }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'title' },
    prepare({ title, subtitle }) {
      return { title: title || 'Sans nom', subtitle: subtitle || '' }
    },
  },
})
