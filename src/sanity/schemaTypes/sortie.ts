import { defineField, defineType } from 'sanity'
import { CalendarRange } from 'lucide-react'
import { sortiePeriod } from '../../utils/dates'

export const sortieType = defineType({
  name: 'sortie',
  title: 'Prochaines Sorties',
  type: 'document',
  icon: CalendarRange,
  fields: [
    defineField({
      name: 'sejour',
      title: 'Modèle de séjour',
      type: 'reference',
      to: [{ type: 'sejour' }],
    }),
    defineField({
      name: 'startDate',
      title: 'Date de début',
      type: 'date',
      options: { dateFormat: 'DD/MM/YYYY' },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'endDate',
      title: 'Date de fin',
      description: 'Laisser vide pour une sortie à la journée. La période affichée sur le site est calculée automatiquement.',
      type: 'date',
      options: { dateFormat: 'DD/MM/YYYY' },
      validation: (Rule) => Rule.custom((end, { document }) => {
        const start = document?.startDate as string | undefined
        return !end || !start || end >= start || 'La date de fin doit être après la date de début'
      }),
    }),
    // Former free-text period, replaced by the dates above; only shown for sorties without dates
    defineField({
      name: 'date',
      title: 'Date affichée (ancien champ)',
      type: 'string',
      hidden: ({ document }) => !!document?.startDate,
    }),
    defineField({
      name: 'availableSpots',
      title: 'Places restantes',
      description: 'Un chiffre (ex : 4).',
      type: 'string',
    }),
    defineField({
      name: 'isFull',
      title: 'Complet ?',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'isConfirmed',
      title: 'Départ assuré',
      description: 'Affiche un bandeau « Départ assuré » sur la sortie.',
      type: 'boolean',
      initialValue: false,
    }),
    // On garde les anciens champs optionnels au cas où on veut surcharger le modèle
    defineField({
      name: 'titleOverride',
      title: 'Titre (Surcharge FR)',
      type: 'string',
    }),
    defineField({
      name: 'titleOverrideEn',
      title: 'Titre (Surcharge EN)',
      type: 'string',
    }),
  ],
  preview: {
    select: {
      sejourTitle: 'sejour.title',
      date: 'date',
      startDate: 'startDate',
      endDate: 'endDate',
      isConfirmed: 'isConfirmed',
      titleOverride: 'titleOverride',
      availableSpots: 'availableSpots',
      isFull: 'isFull',
      media: 'sejour.image',
    },
    prepare(selection) {
      const { sejourTitle, titleOverride, availableSpots, isFull, isConfirmed, media } = selection
      const mainTitle = titleOverride || sejourTitle || 'Sans titre'
      const period = sortiePeriod(selection)
      const dateStr = period ? ` - ${period}` : ''
      
      let statusPrefix = ''
      let subtitle = ''

      if (isFull === true) {
        statusPrefix = '🔴 [COMPLET] '
        subtitle = '⚠️ COMPLET - Plus de place'
      } else {
        let spotsCount = -1
        if (availableSpots) {
          const match = availableSpots.trim().match(/^(\d+)/)
          if (match) {
            spotsCount = parseInt(match[1], 10)
          } else if (/^\d+$/.test(availableSpots.trim())) {
            spotsCount = parseInt(availableSpots.trim(), 10)
          }
        }

        if (spotsCount === 0) {
          statusPrefix = '🔴 [COMPLET] '
          subtitle = '⚠️ COMPLET - Plus de place'
        } else if (spotsCount > 0 && spotsCount <= 2) {
          statusPrefix = '⚠️ [DERNIÈRES PLACES] '
          subtitle = `🔥 ${availableSpots} !`
        } else {
          statusPrefix = '🟢 [PLACES DISPO] '
          subtitle = availableSpots ? `✔ ${availableSpots}` : '✔ Places disponibles'
        }
      }

      return {
        title: `${statusPrefix}${mainTitle}${dateStr}`,
        subtitle: isConfirmed ? `✅ Départ assuré · ${subtitle}` : subtitle,
        media,
      }
    },
  },
})
