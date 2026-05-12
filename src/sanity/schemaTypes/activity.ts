import { defineField, defineType } from 'sanity'

export const activityType = defineType({
  name: 'activity',
  title: 'Activités',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Titre',
      type: 'string',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
    }),
    defineField({
      name: 'subtitle',
      title: 'Sous-titre',
      type: 'string',
    }),
    defineField({
      name: 'intro',
      title: 'Texte d\'introduction (Hero)',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'description',
      title: 'Description courte',
      type: 'text',
    }),
    defineField({
      name: 'image',
      title: 'Image principale',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'keyPoints',
      title: 'Points clés (Section du haut)',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'title', type: 'string', title: 'Titre' },
            { name: 'description', type: 'text', title: 'Description' },
          ],
        },
      ],
    }),
    defineField({
      name: 'details',
      title: 'Détails techniques (Checklist)',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'universBadge',
      title: 'Badge Section Univers',
      type: 'string',
      initialValue: 'NOS UNIVERS',
    }),
    defineField({
      name: 'universTitle',
      title: 'Titre Section Univers (H2)',
      type: 'string',
      initialValue: 'Une progression adaptée à vos envies',
    }),
    defineField({
      name: 'universDescription',
      title: 'Description Section Univers',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'univers',
      title: 'Univers / Variantes',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'title', type: 'string', title: 'Titre' },
            { name: 'description', type: 'text', title: 'Description' },
          ],
        },
      ],
    }),
    defineField({
      name: 'price',
      title: 'Prix / Tarif',
      type: 'string',
    }),
    defineField({
      name: 'period',
      title: 'Période',
      type: 'string',
      initialValue: 'Saisonnière',
    }),
    defineField({
      name: 'location',
      title: 'Lieu',
      type: 'string',
      initialValue: 'Alpes & International',
    }),
    defineField({
      name: 'showUpcomingSorties',
      title: 'Afficher les prochaines sorties ?',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'type',
      title: 'Type d\'activité (pour le filtrage)',
      type: 'string',
      options: {
        list: [
          { title: 'Alpinisme', value: 'alpinisme' },
          { title: 'Ski de randonnée', value: 'ski' },
          { title: 'Escalade', value: 'escalade' },
          { title: 'Cascade de Glace', value: 'cascade-de-glace' },
          { title: 'Paralpinisme', value: 'paralpinisme' },
          { title: 'Voyages', value: 'voyage' },
        ],
      },
    }),
    defineField({
      name: 'customTripText',
      title: 'Texte Encart Sur Mesure',
      type: 'string',
      description: 'Texte affiché dans l\'encart en bas des pages d\'univers.',
    }),
    defineField({
      name: 'customTripCTA',
      title: 'Texte Bouton Sur Mesure',
      type: 'string',
      description: 'Texte du bouton dans l\'encart en bas des pages d\'univers.',
    }),
  ],
})
