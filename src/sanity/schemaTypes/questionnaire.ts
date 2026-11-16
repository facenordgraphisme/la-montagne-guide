import { defineArrayMember, defineField, defineType } from 'sanity'
import { ClipboardList } from 'lucide-react'
import ShareLinkInput from '../components/ShareLinkInput'

export const QUESTION_KINDS = [
  { title: 'Texte court', value: 'short' },
  { title: 'Texte long', value: 'long' },
  { title: 'Choix unique', value: 'single' },
  { title: 'Choix multiple', value: 'multiple' },
  { title: 'Date', value: 'date' },
  { title: 'Nombre', value: 'number' },
  { title: 'Oui / Non', value: 'yesno' },
]

const kindTitle = (value?: string) => QUESTION_KINDS.find((k) => k.value === value)?.title || ''
const hasOptions = (kind?: string) => kind === 'single' || kind === 'multiple'

const question = defineArrayMember({
  name: 'questionnaireQuestion',
  title: 'Question',
  type: 'object',
  fields: [
    defineField({ name: 'label', title: 'Question (Français)', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'labelEn', title: 'Question (Anglais)', type: 'string', description: 'Laissé vide, la version française est affichée.' }),
    defineField({
      name: 'kind',
      title: 'Type de réponse',
      type: 'string',
      options: { list: QUESTION_KINDS, layout: 'radio', direction: 'horizontal' },
      initialValue: 'short',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'options',
      title: 'Choix proposés',
      type: 'array',
      hidden: ({ parent }) => !hasOptions(parent?.kind),
      of: [
        defineArrayMember({
          name: 'questionnaireOption',
          type: 'object',
          fields: [
            defineField({ name: 'label', title: 'Choix (Français)', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'labelEn', title: 'Choix (Anglais)', type: 'string' }),
          ],
          preview: { select: { title: 'label', subtitle: 'labelEn' } },
        }),
      ],
      validation: (Rule) =>
        Rule.custom((value: unknown[] | undefined, ctx) => {
          if (!hasOptions((ctx.parent as { kind?: string } | undefined)?.kind)) return true
          return (value?.length || 0) >= 2 ? true : 'Ajoutez au moins deux choix.'
        }),
    }),
    defineField({ name: 'help', title: "Aide (Français)", type: 'string', description: 'Petit texte sous la question, facultatif.' }),
    defineField({ name: 'helpEn', title: "Aide (Anglais)", type: 'string' }),
    defineField({ name: 'required', title: 'Réponse obligatoire', type: 'boolean', initialValue: false }),
  ],
  preview: {
    select: { title: 'label', kind: 'kind', required: 'required' },
    prepare: ({ title, kind, required }) => ({
      title: `${title || 'Question sans titre'}${required ? ' *' : ''}`,
      subtitle: kindTitle(kind),
    }),
  },
})

export const questionnaireType = defineType({
  name: 'questionnaire',
  title: 'Questionnaire',
  type: 'document',
  icon: ClipboardList,
  fields: [
    defineField({ name: 'title', title: 'Titre (Français)', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'titleEn', title: 'Titre (Anglais)', type: 'string' }),
    defineField({
      name: 'slug',
      title: 'Adresse de la page',
      type: 'slug',
      description: "Fin du lien envoyé aux clients. Évitez de la changer une fois le lien envoyé.",
      options: { source: 'title', maxLength: 80 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'shareLink',
      title: 'Lien à envoyer',
      type: 'string',
      description: "La page n'apparaît ni dans le menu ni sur Google : seuls ceux qui ont le lien y accèdent. Pensez à publier.",
      readOnly: true,
      components: { input: ShareLinkInput },
    }),
    defineField({ name: 'intro', title: "Texte d'introduction (Français)", type: 'text', rows: 3 }),
    defineField({ name: 'introEn', title: "Texte d'introduction (Anglais)", type: 'text', rows: 3 }),
    defineField({
      name: 'steps',
      title: 'Étapes',
      description: "Le client remplit une étape à la fois. Ses coordonnées (nom, e-mail, téléphone) sont toujours demandées en premier : inutile de les ajouter.",
      type: 'array',
      validation: (Rule) => Rule.required().min(1),
      of: [
        defineArrayMember({
          name: 'questionnaireStep',
          title: 'Étape',
          type: 'object',
          fields: [
            defineField({ name: 'title', title: "Titre de l'étape (Français)", type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'titleEn', title: "Titre de l'étape (Anglais)", type: 'string' }),
            defineField({
              name: 'questions',
              title: 'Questions',
              type: 'array',
              of: [question],
              validation: (Rule) => Rule.required().min(1),
            }),
          ],
          preview: {
            select: { title: 'title', questions: 'questions' },
            prepare: ({ title, questions }) => ({
              title: title || 'Étape sans titre',
              subtitle: `${questions?.length || 0} question(s)`,
            }),
          },
        }),
      ],
    }),
    defineField({
      name: 'confirmation',
      title: 'Message de confirmation (Français)',
      type: 'text',
      rows: 3,
      description: 'Affiché une fois le questionnaire envoyé.',
      initialValue: 'Merci ! Vos réponses sont bien enregistrées. Je reviens vers vous rapidement.',
    }),
    defineField({ name: 'confirmationEn', title: 'Message de confirmation (Anglais)', type: 'text', rows: 3 }),
    defineField({
      name: 'closed',
      title: 'Fermer le questionnaire',
      type: 'boolean',
      description: "Le lien affiche alors un message indiquant que les inscriptions sont closes.",
      initialValue: false,
    }),
  ],
  preview: {
    select: { title: 'title', slug: 'slug.current', closed: 'closed' },
    prepare: ({ title, slug, closed }) => ({
      title: title || 'Questionnaire',
      subtitle: `${closed ? 'Fermé · ' : ''}/inscription/${slug || '…'}`,
    }),
  },
})

export const questionnaireResponseType = defineType({
  name: 'questionnaireResponse',
  title: 'Réponse à un questionnaire',
  type: 'document',
  icon: ClipboardList,
  // Responses come from the site: only the "handled" tick is editable
  fields: [
    defineField({ name: 'handled', title: 'Traitée', type: 'boolean', initialValue: false }),
    defineField({ name: 'questionnaire', title: 'Questionnaire', type: 'reference', to: [{ type: 'questionnaire' }], weak: true, readOnly: true }),
    defineField({ name: 'questionnaireTitle', title: 'Titre du questionnaire', type: 'string', readOnly: true }),
    defineField({ name: 'submittedAt', title: 'Envoyé le', type: 'datetime', readOnly: true }),
    defineField({ name: 'firstName', title: 'Prénom', type: 'string', readOnly: true }),
    defineField({ name: 'lastName', title: 'Nom', type: 'string', readOnly: true }),
    defineField({ name: 'email', title: 'E-mail', type: 'string', readOnly: true }),
    defineField({ name: 'phone', title: 'Téléphone', type: 'string', readOnly: true }),
    defineField({ name: 'lang', title: 'Langue', type: 'string', readOnly: true }),
    defineField({
      name: 'answers',
      title: 'Réponses',
      type: 'array',
      readOnly: true,
      of: [
        defineArrayMember({
          name: 'questionnaireAnswer',
          type: 'object',
          fields: [
            defineField({ name: 'step', title: 'Étape', type: 'string' }),
            defineField({ name: 'question', title: 'Question', type: 'string' }),
            defineField({ name: 'answer', title: 'Réponse', type: 'text', rows: 2 }),
          ],
          preview: { select: { title: 'question', subtitle: 'answer' } },
        }),
      ],
    }),
  ],
  orderings: [{ title: 'Plus récentes', name: 'submittedAtDesc', by: [{ field: 'submittedAt', direction: 'desc' }] }],
  preview: {
    select: { firstName: 'firstName', lastName: 'lastName', q: 'questionnaireTitle', date: 'submittedAt', handled: 'handled' },
    prepare: ({ firstName, lastName, q, date, handled }) => ({
      title: `${handled ? '✅ ' : '🆕 '}${[firstName, lastName].filter(Boolean).join(' ') || 'Anonyme'}`,
      subtitle: [q, date ? new Date(date).toLocaleDateString('fr-FR') : ''].filter(Boolean).join(' · '),
    }),
  },
})
