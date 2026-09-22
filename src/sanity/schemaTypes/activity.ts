import { defineField, defineType } from 'sanity'
import { Compass } from 'lucide-react'

const descriptionBlocks = [
  {
    type: 'block',
    styles: [
      { title: 'Normal', value: 'normal' },
      { title: 'Centré', value: 'blockCenter' },
      { title: 'Justifié', value: 'blockJustify' },
      { title: 'Droite', value: 'blockRight' },
    ],
    lists: [],
    marks: {
      decorators: [
        { title: 'Gras', value: 'strong' },
        { title: 'Italique', value: 'em' },
      ]
    }
  }
]

export const activityType = defineType({
  name: 'activity',
  title: 'Activités',
  type: 'document',
  icon: Compass,
  fields: [
    defineField({ name: 'title', title: 'Titre (FR)', type: 'string' }),
    defineField({ name: 'titleEn', title: 'Titre (EN)', type: 'string' }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
    }),
    defineField({ name: 'subtitle', title: 'Sous-titre (FR)', type: 'string' }),
    defineField({ name: 'subtitleEn', title: 'Sous-titre (EN)', type: 'string' }),
    defineField({ name: 'intro', title: 'Introduction Hero (FR)', type: 'text', rows: 3 }),
    defineField({ name: 'introEn', title: 'Introduction Hero (EN)', type: 'text', rows: 3 }),
    defineField({ name: 'description', title: 'Description courte (FR)', type: 'array', of: descriptionBlocks }),
    defineField({ name: 'descriptionEn', title: 'Description courte (EN)', type: 'array', of: descriptionBlocks }),
    defineField({
      name: 'image',
      title: 'Image principale',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'keyPoints',
      title: 'Points clés (Section du haut)',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'title', type: 'string', title: 'Titre (FR)' },
            { name: 'titleEn', type: 'string', title: 'Titre (EN)' },
            { name: 'description', type: 'text', title: 'Description (FR)' },
            { name: 'descriptionEn', type: 'text', title: 'Description (EN)' },
          ],
        },
      ],
    }),
    defineField({ name: 'details', title: 'Détails techniques FR (Checklist)', type: 'array', of: [{ type: 'string' }] }),
    defineField({ name: 'detailsEn', title: 'Détails techniques EN (Checklist)', type: 'array', of: [{ type: 'string' }] }),
    defineField({ name: 'universBadge', title: 'Badge Section Univers (FR)', type: 'string', initialValue: 'NOS UNIVERS' }),
    defineField({ name: 'universBadgeEn', title: 'Badge Section Univers (EN)', type: 'string', initialValue: 'OUR WORLDS' }),
    defineField({ name: 'universTitle', title: 'Titre Section Univers (FR)', type: 'string', initialValue: 'Une progression adaptée à vos envies' }),
    defineField({ name: 'universTitleEn', title: 'Titre Section Univers (EN)', type: 'string' }),
    defineField({ name: 'universDescription', title: 'Description Section Univers (FR)', type: 'array', of: descriptionBlocks }),
    defineField({ name: 'universDescriptionEn', title: 'Description Section Univers (EN)', type: 'array', of: descriptionBlocks }),
    defineField({
      name: 'univers',
      title: 'Univers / Variantes',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'title', type: 'string', title: 'Titre (FR)' },
            { name: 'titleEn', type: 'string', title: 'Titre (EN)' },
            { name: 'description', type: 'array', title: 'Description (FR)', of: descriptionBlocks },
            { name: 'descriptionEn', type: 'array', title: 'Description (EN)', of: descriptionBlocks },
          ],
        },
      ],
    }),
    defineField({ name: 'price', title: 'Prix / Tarif', type: 'string' }),
    defineField({ name: 'period', title: 'Période (FR)', type: 'string', initialValue: 'Saisonnière' }),
    defineField({ name: 'periodEn', title: 'Période (EN)', type: 'string', initialValue: 'Seasonal' }),
    defineField({ name: 'location', title: 'Lieu (FR)', type: 'string', initialValue: 'Alpes & International' }),
    defineField({ name: 'locationEn', title: 'Lieu (EN)', type: 'string', initialValue: 'Alps & International' }),
    defineField({ name: 'showUpcomingSorties', title: 'Afficher les prochaines sorties ?', type: 'boolean', initialValue: true }),
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
    defineField({ name: 'customTripText', title: 'Texte Encart Sur Mesure (FR)', type: 'string', description: 'Texte affiché dans l\'encart en bas des pages d\'univers.' }),
    defineField({ name: 'customTripTextEn', title: 'Texte Encart Sur Mesure (EN)', type: 'string' }),
    defineField({ name: 'customTripCTA', title: 'Texte Bouton Sur Mesure (FR)', type: 'string', description: 'Texte du bouton dans l\'encart en bas des pages d\'univers.' }),
    defineField({ name: 'customTripCTAEn', title: 'Texte Bouton Sur Mesure (EN)', type: 'string' }),
    defineField({ name: 'hideCustomTrip', title: 'Masquer l\'encart "Sur Mesure"', type: 'boolean', initialValue: false, description: 'Cochez pour masquer l\'encart de contact sur mesure sur les pages d\'univers de cette activité.' }),
    defineField({
      name: 'faqs',
      title: 'Questions fréquentes (FAQ)',
      description: 'Sélectionnez des FAQ spécifiques à afficher sur cette page d\'activité.',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'faq' }], weak: true }],
    }),
    defineField({
      name: 'metaTitle',
      title: '🔍 SEO — Titre (balise title)',
      type: 'string',
      description: 'Optionnel. Remplace le titre auto-généré dans les résultats Google. Idéalement < 60 caractères.',
    }),
    defineField({
      name: 'metaDescription',
      title: '🔍 SEO — Description (meta description)',
      type: 'text',
      rows: 3,
      description: 'Optionnel. Remplace la description auto-générée dans les résultats Google. Idéalement entre 120 et 160 caractères.',
    }),
  ],
})
