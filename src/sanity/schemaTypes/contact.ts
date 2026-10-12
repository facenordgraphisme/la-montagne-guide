import { defineField, defineType } from 'sanity'
import { Mail } from 'lucide-react'
import { FAQPickerInput } from '../components/FAQPickerInput'

export const contactType = defineType({
  name: 'contact',
  title: 'Page Contact',
  type: 'document',
  icon: Mail,
  fields: [
    defineField({
      name: 'faqs',
      title: 'FAQ à afficher',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'faq' }], weak: true }],
      components: { input: FAQPickerInput },
    }),
    defineField({
      name: 'title',
      title: 'Titre de la page',
      type: 'string',
      initialValue: 'CONTACT',
    }),
    defineField({ name: 'heading', title: 'Titre principal (FR)', type: 'string', initialValue: "Besoin d'infos ?" }),
    defineField({ name: 'headingEn', title: 'Titre principal (EN)', type: 'string', initialValue: 'Need some info?' }),
    defineField({
      name: 'image',
      title: 'Photo (colonne de gauche)',
      type: 'image',
      options: { hotspot: true },
      fields: [defineField({ name: 'alt', title: 'Texte ALT', type: 'string' })],
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
    }),
    defineField({
      name: 'email',
      title: 'Email de contact',
      type: 'string',
    }),
    defineField({
      name: 'phone',
      title: 'Téléphone de contact',
      type: 'string',
    }),
    defineField({
      name: 'location',
      title: 'Localisation',
      type: 'string',
    }),
  ],
})
