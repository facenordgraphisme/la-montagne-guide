import { defineField, defineType } from 'sanity'

export const sortieType = defineType({
  name: 'sortie',
  title: 'Prochaines Sorties',
  type: 'document',
  fields: [
    defineField({
      name: 'sejour',
      title: 'Modèle de séjour',
      type: 'reference',
      to: [{ type: 'sejour' }],
      description: 'Sélectionnez le séjour de base pour reprendre ses informations automatiquement.',
    }),
    defineField({
      name: 'startDate',
      title: 'Date de début (pour le tri)',
      type: 'date',
      description: 'Indispensable pour classer les sorties par ordre chronologique.',
    }),
    defineField({
      name: 'date',
      title: 'Date affichée (Période)',
      type: 'string',
      description: 'Ex: 15-17 Juin 2024',
    }),
    defineField({
      name: 'availableSpots',
      title: 'Nombre de places disponibles',
      type: 'string',
      description: 'Ex: 2 places restantes',
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
      title: 'Titre (Surcharge)',
      type: 'string',
      description: 'Laissez vide pour utiliser le titre du séjour de base.',
    }),
  ],
  preview: {
    select: {
      sejourTitle: 'sejour.title',
      date: 'date',
      titleOverride: 'titleOverride',
      availableSpots: 'availableSpots',
      media: 'sejour.image',
    },
    prepare(selection) {
      const { sejourTitle, date, titleOverride, availableSpots, media } = selection
      const mainTitle = titleOverride || sejourTitle || 'Sans titre'
      const dateStr = date ? ` - ${date}` : ''
      
      let subtitle = availableSpots
      if (availableSpots && /^\d+$/.test(availableSpots.trim())) {
        const spots = parseInt(availableSpots.trim(), 10)
        subtitle = spots > 1 ? `${spots} places disponibles` : `${spots} place disponible`
      }
      
      return {
        title: `${mainTitle}${dateStr}`,
        subtitle,
        media,
      }
    },
  },
})
