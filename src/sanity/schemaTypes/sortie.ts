import { defineField, defineType } from 'sanity'

export const sortieType = defineType({
  name: 'sortie',
  title: 'Prochaines Sorties',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Titre de la sortie',
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
      name: 'date',
      title: 'Date ou Période',
      type: 'string',
      description: 'Ex: Juillet 2024, ou 15-20 Juin',
    }),
    defineField({
      name: 'price',
      title: 'Prix',
      type: 'string',
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'activityType',
      title: 'Type d\'activité',
      type: 'string',
      options: {
        list: [
          { title: 'Alpinisme', value: 'alpinisme' },
          { title: 'Ski de randonnée', value: 'ski' },
          { title: 'Escalade', value: 'escalade' },
          { title: 'Voyage', value: 'voyage' },
        ],
      },
    }),
    defineField({
      name: 'location',
      title: 'Lieu',
      type: 'string',
    }),
    defineField({
      name: 'duration',
      title: 'Durée',
      type: 'string',
      description: 'Ex: 8 jours, 1 semaine',
    }),
    defineField({
      name: 'description',
      title: 'Description courte',
      type: 'text',
    }),
    defineField({
      name: 'isFull',
      title: 'Complet ?',
      type: 'boolean',
      initialValue: false,
    }),
  ],
})
