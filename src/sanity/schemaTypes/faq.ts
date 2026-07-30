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
      description: 'Sélectionnez une catégorie dynamique ou laissez vide.',
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
      categoryTitle: 'category->title',
      categoryString: 'category',
    },
    prepare(selection) {
      const { question, categoryTitle, categoryString } = selection
      const legacyMap: Record<string, string> = {
        general: 'Général & Réservations',
        technical: 'Technique & Équipement',
        safety: 'Sécurité & Guide',
      }
      const categoryName = categoryTitle || legacyMap[categoryString] || categoryString || 'Sans catégorie'
      return {
        title: question || 'Sans question',
        subtitle: categoryName,
      }
    },
  },
})
