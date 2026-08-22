import { defineField, defineType } from 'sanity'
import { Mountain } from 'lucide-react'

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

export const sejourType = defineType({
  name: 'sejour',
  title: 'Catalogue des Séjours',
  type: 'document',
  icon: Mountain,
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
      name: 'priceEncadrement',
      title: 'Tarif encadrement',
      type: 'string',
      description: 'Ex: 450€/personne',
    }),
    defineField({
      name: 'priceFraisSejour',
      title: 'Frais de séjour',
      type: 'string',
      description: 'Ex: 180€/personne (hébergement, repas)',
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
      type: 'array',
      of: descriptionBlocks,
    }),
    defineField({
      name: 'content',
      title: 'Contenu riche (Programme, etc.) [Obsolète - Utilisez les onglets]',
      type: 'array',
      of: [{
        type: 'block',
        styles: [
          { title: 'Normal', value: 'normal' },
          { title: 'H2', value: 'h2' },
          { title: 'H3', value: 'h3' },
          { title: 'Centré', value: 'blockCenter' },
          { title: 'Justifié', value: 'blockJustify' },
          { title: 'Droite', value: 'blockRight' },
          { title: 'Citation', value: 'blockquote' }
        ],
      }, { type: 'image' }],
      hidden: true,
    }),
    defineField({
      name: 'programme',
      title: 'Onglet — Programme [Obsolète]',
      type: 'array',
      of: [{
        type: 'block',
        styles: [
          { title: 'Normal', value: 'normal' },
          { title: 'H2', value: 'h2' },
          { title: 'H3', value: 'h3' },
          { title: 'Centré', value: 'blockCenter' },
          { title: 'Justifié', value: 'blockJustify' },
          { title: 'Droite', value: 'blockRight' },
        ],
      }, { type: 'image' }],
      hidden: true,
    }),
    defineField({
      name: 'budget',
      title: 'Onglet — Budget [Obsolète]',
      type: 'array',
      of: [{
        type: 'block',
        styles: [
          { title: 'Normal', value: 'normal' },
          { title: 'H2', value: 'h2' },
          { title: 'H3', value: 'h3' },
          { title: 'Centré', value: 'blockCenter' },
          { title: 'Justifié', value: 'blockJustify' },
          { title: 'Droite', value: 'blockRight' },
        ],
      }, { type: 'image' }],
      hidden: true,
    }),
    defineField({
      name: 'infosPratiques',
      title: 'Onglet — Infos Pratiques [Obsolète]',
      type: 'array',
      of: [{
        type: 'block',
        styles: [
          { title: 'Normal', value: 'normal' },
          { title: 'H2', value: 'h2' },
          { title: 'H3', value: 'h3' },
          { title: 'Centré', value: 'blockCenter' },
          { title: 'Justifié', value: 'blockJustify' },
          { title: 'Droite', value: 'blockRight' },
        ],
      }, { type: 'image' }],
      hidden: true,
    }),
    defineField({
      name: 'materiel',
      title: 'Onglet — Matériel [Obsolète]',
      type: 'array',
      of: [{
        type: 'block',
        styles: [
          { title: 'Normal', value: 'normal' },
          { title: 'H2', value: 'h2' },
          { title: 'H3', value: 'h3' },
          { title: 'Centré', value: 'blockCenter' },
          { title: 'Justifié', value: 'blockJustify' },
          { title: 'Droite', value: 'blockRight' },
        ],
      }, { type: 'image' }],
      hidden: true,
    }),
    defineField({
      name: 'tabs',
      title: 'Onglets personnalisés',
      description: 'Créez et organisez vos onglets librement.',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'sejourTab',
          title: 'Onglet',
          fields: [
            defineField({ name: 'title', type: 'string', title: 'Titre (Français)', validation: (Rule) => Rule.required() }),
            defineField({ name: 'titleEn', type: 'string', title: 'Titre (Anglais)', validation: (Rule) => Rule.required() }),
            defineField({
              name: 'content',
              type: 'array',
              title: 'Contenu',
              of: [
                {
                  type: 'block',
                  styles: [
                    { title: 'Normal', value: 'normal' },
                    { title: 'H2', value: 'h2' },
                    { title: 'H3', value: 'h3' },
                    { title: 'Centré', value: 'blockCenter' },
                    { title: 'Justifié', value: 'blockJustify' },
                    { title: 'Droite', value: 'blockRight' },
                  ],
                },
                { type: 'image' }
              ]
            }),
            defineField({
              name: 'pdf',
              type: 'file',
              title: 'PDF téléchargeable (optionnel)',
              description: 'Ex: liste de matériel à télécharger. Un bouton de téléchargement apparaîtra dans cet onglet.',
              options: { accept: '.pdf' },
            }),
          ]
        }
      ]
    }),
    defineField({
      name: 'materielPdf',
      title: 'Matériel — PDF téléchargeable',
      type: 'file',
      options: { accept: '.pdf' },
    }),
    defineField({
      name: 'gallery',
      title: 'Galerie photos',
      type: 'array',
      options: {
        layout: 'grid',
      },
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({ name: 'alt', type: 'string', title: 'Texte alternatif' }),
          ],
        },
      ],
    }),
    defineField({
      name: 'hideUpcomingSorties',
      title: 'Masquer le bloc "Prochains Départs"',
      type: 'boolean',
      initialValue: false,
      description: 'Cochez pour masquer les dates de sorties sur la page de ce séjour (ex: séjour uniquement sur demande privée).',
    }),
    defineField({
      name: 'hideGallery',
      title: 'Masquer la galerie photos',
      type: 'boolean',
      initialValue: false,
      description: 'Cochez pour masquer la galerie photos sur la page de ce séjour, même si des photos sont renseignées.',
    }),
    defineField({
      name: 'bookAdventureUrl',
      title: 'Lien de réservation Book\'Adventure (Séjour)',
      type: 'url',
      description: 'Optionnel. Si défini, le bouton de réservation principal renverra vers ce lien plutôt que vers le formulaire de contact.',
    }),
    defineField({
      name: 'faqs',
      title: 'Questions fréquentes (FAQ)',
      description: 'Sélectionnez des FAQ spécifiques à afficher sur la page de ce séjour.',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'faq' }], weak: true }],
    }),
    defineField({
      name: 'relatedTags',
      title: 'Tags d\'articles liés',
      description: 'Sélectionnez des tags. Les articles de blog possédant ces tags seront affichés en bas de la page de ce séjour.',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'tag' }], weak: true }],
    }),
  ],
})
