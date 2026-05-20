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
      title: 'Catégorie',
      type: 'string',
      initialValue: 'general',
      options: {
        list: [
          { title: 'Général & Réservations', value: 'general' },
          { title: 'Technique & Équipement', value: 'technical' },
          { title: 'Sécurité & Guide', value: 'safety' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'order',
      title: "Ordre d'affichage",
      type: 'number',
      initialValue: 0,
      description: 'Plus le chiffre est bas, plus la question apparaît en premier (ex: 0, 1, 2...).',
    }),
  ],
  preview: {
    select: {
      question: 'question',
      category: 'category',
    },
    prepare(selection) {
      const { question, category } = selection
      const catMap: Record<string, string> = {
        general: 'Général & Réservations',
        technical: 'Technique & Équipement',
        safety: 'Sécurité & Guide',
      }
      return {
        title: question || 'Sans question',
        subtitle: catMap[category] || category || 'Catégorie générale',
      }
    },
  },
})
