import { defineField, defineType } from 'sanity'

export const sejourType = defineType({
  name: 'sejour',
  title: 'Catalogue des Séjours',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Titre du séjour',
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
      name: 'activityType',
      title: 'Type d\'activité principale',
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
      name: 'subCategory',
      title: 'Univers',
      type: 'reference',
      to: [{ type: 'univers' }],
      options: {
        filter: ({ document }: any) => {
          if (!document.activityType) return { filter: '' };
          return {
            filter: 'activity->slug.current == $activitySlug',
            params: { activitySlug: document.activityType }
          };
        }
      },
      description: 'Choisissez d\'abord le type d\'activité pour filtrer les univers disponibles.',
    }),
    defineField({
      name: 'massif',
      title: 'Massif',
      type: 'string',
      description: 'Ex: Écrins, Queyras, Mont-Blanc...',
    }),
    defineField({
      name: 'level',
      title: 'Niveau',
      type: 'string',
      options: {
        list: [
          { title: 'Débutant', value: 'debutant' },
          { title: 'Intermédiaire', value: 'intermediaire' },
          { title: 'Confirmé', value: 'confirme' },
          { title: 'Expert', value: 'expert' },
        ],
      },
    }),
    defineField({
      name: 'season',
      title: 'Saison',
      type: 'string',
      options: {
        list: [
          { title: 'Été', value: 'ete' },
          { title: 'Hiver', value: 'hiver' },
          { title: 'Toutes saisons', value: 'toutes' },
        ],
      },
    }),
    defineField({
      name: 'duration',
      title: 'Durée',
      type: 'string',
      description: 'Ex: 1 jour, 3 jours, 1 semaine',
    }),
    defineField({
      name: 'basePrice',
      title: 'Prix "À partir de"',
      type: 'string',
    }),
    defineField({
      name: 'image',
      title: 'Image principale',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'description',
      title: 'Description détaillée',
      type: 'text',
    }),
    defineField({
      name: 'content',
      title: 'Contenu riche (Programme, etc.)',
      type: 'array',
      of: [{ type: 'block' }, { type: 'image' }],
    }),
  ],
})
