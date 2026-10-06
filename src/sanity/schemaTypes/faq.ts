import { defineField, defineType } from 'sanity'
import { HelpCircle } from 'lucide-react'

export const faqType = defineType({
  name: 'faq',
  title: 'Foire Aux Questions (FAQ)',
  type: 'document',
  icon: HelpCircle,
  fields: [
    defineField({
      name: 'question',
      title: 'Question (Français)',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'questionEn',
      title: 'Question (Anglais)',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'answer',
      title: 'Réponse (Français)',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'answerEn',
      title: 'Réponse (Anglais)',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Catégorie de FAQ',
      type: 'reference',
      to: [{ type: 'faqCategory' }],
      weak: true,
    }),
    defineField({
      name: 'order',
      title: "Ordre d'affichage",
      type: 'number',
      initialValue: 0,
    }),
  ],
  preview: {
    select: {
      question: 'question',
      categoryTitle: 'category->title',
    },
    prepare(selection) {
      const { question, categoryTitle } = selection
      return {
        title: question || 'Sans question',
        subtitle: categoryTitle || 'Sans catégorie',
      }
    },
  },
})
