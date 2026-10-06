import { defineField, defineType } from 'sanity'
import { CalendarRange } from 'lucide-react'

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
      title: 'Date de début (pour le tri)',
      type: 'date',
    }),
    defineField({
      name: 'date',
      title: 'Date affichée (Période)',
      type: 'string',
    }),
    defineField({
      name: 'availableSpots',
      title: 'Nombre de places disponibles',
      type: 'string',
    }),
    defineField({
      name: 'isFull',
      title: 'Complet ?',
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
      titleOverride: 'titleOverride',
      availableSpots: 'availableSpots',
      isFull: 'isFull',
      media: 'sejour.image',
    },
    prepare(selection) {
      const { sejourTitle, date, titleOverride, availableSpots, isFull, media } = selection
      const mainTitle = titleOverride || sejourTitle || 'Sans titre'
      const dateStr = date ? ` - ${date}` : ''
      
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
        subtitle,
        media,
      }
    },
  },
})
