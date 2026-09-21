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
    defineField({ name: 'title', title: 'Titre du séjour (FR)', type: 'string' }),
    defineField({ name: 'titleEn', title: 'Titre du séjour (EN)', type: 'string' }),
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
          { title: 'Voyage', value: 'voyages' },
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
      description: 'Ex: Débutant, F/PD, AD, D+, TD… Texte libre.',
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
      title: 'Durée (FR)',
      type: 'string',
      description: 'Ex: 1 jour, 3 jours, 1 semaine',
    }),
    defineField({ name: 'durationEn', title: 'Durée (EN)', type: 'string', description: 'Ex: 1 day, 3 days, 1 week' }),
    defineField({
      name: 'participants',
      title: 'Nombre de participants (facultatif)',
      type: 'string',
      description: 'Ex: 2 à 4 personnes, Max 6 personnes…',
    }),
    defineField({
      name: 'period',
      title: 'Période (facultatif)',
      type: 'string',
      description: 'Ex: Juin à Septembre, Décembre à Avril…',
    }),
    defineField({
      name: 'basePrice',
      title: 'Prix "À partir de"',
      type: 'string',
    }),
    defineField({
      name: 'prixToutCompris',
      title: 'Mode tarifaire',
      type: 'boolean',
      initialValue: false,
      description: 'Activez pour afficher un "Prix tout compris" au lieu de la décomposition Encadrement / Frais de séjour.',
    }),
    defineField({
      name: 'prixToutComprisAmount',
      title: 'Prix tout compris',
      type: 'string',
      description: 'Ex: 1 490€/personne — affiché uniquement si le mode "tout compris" est activé.',
    }),
    defineField({
      name: 'priceEncadrement',
      title: 'Tarif encadrement',
      type: 'string',
      description: 'Ex: 450€/personne — affiché si le mode "tout compris" est désactivé.',
    }),
    defineField({
      name: 'priceFraisSejour',
      title: 'Frais de séjour',
      type: 'string',
      description: 'Ex: 180€/personne (hébergement, repas) — affiché si le mode "tout compris" est désactivé.',
    }),
    defineField({
      name: 'image',
      title: 'Image principale',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({ name: 'description', title: 'Description détaillée (FR)', type: 'array', of: descriptionBlocks }),
    defineField({ name: 'descriptionEn', title: 'Description détaillée (EN)', type: 'array', of: descriptionBlocks }),
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
                  marks: {
                    decorators: [
                      { title: 'Gras', value: 'strong' },
                      { title: 'Italique', value: 'em' },
                    ],
                    annotations: [
                      {
                        name: 'link',
                        type: 'object',
                        title: 'Lien hypertexte',
                        fields: [
                          { name: 'href', type: 'url', title: 'URL' },
                          { name: 'blank', type: 'boolean', title: 'Ouvrir dans un nouvel onglet', initialValue: true },
                        ],
                      },
                    ],
                  },
                },
                { type: 'image' },
                {
                  type: 'object',
                  name: 'mapEmbed',
                  title: 'Carte Google Maps',
                  fields: [
                    defineField({
                      name: 'url',
                      type: 'url',
                      title: 'URL d\'intégration Google Maps',
                      description: 'Dans Google Maps → Partager → Intégrer une carte → copier l\'URL du src dans le code iframe.',
                      validation: (Rule) => Rule.required(),
                    }),
                    defineField({
                      name: 'height',
                      type: 'number',
                      title: 'Hauteur de la carte (px)',
                      initialValue: 400,
                    }),
                  ],
                  preview: {
                    select: { title: 'url' },
                    prepare({ title }: { title?: string }) {
                      return { title: title ? `Carte : ${title.substring(0, 60)}…` : 'Carte Google Maps' };
                    },
                  },
                },
              ]
            }),
            defineField({
              name: 'contentEn',
              type: 'array',
              title: 'Contenu (EN)',
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
                  marks: {
                    decorators: [
                      { title: 'Gras', value: 'strong' },
                      { title: 'Italique', value: 'em' },
                    ],
                    annotations: [
                      {
                        name: 'link',
                        type: 'object',
                        title: 'Lien hypertexte',
                        fields: [
                          { name: 'href', type: 'url', title: 'URL' },
                          { name: 'blank', type: 'boolean', title: 'Ouvrir dans un nouvel onglet', initialValue: true },
                        ],
                      },
                    ],
                  },
                },
                { type: 'image' },
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
      name: 'galleryTags',
      title: 'Galerie — Importer par tags',
      description: 'Sélectionnez des tags : toutes les photos des articles ayant ces tags seront ajoutées automatiquement à la galerie.',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'tag' }], weak: true }],
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
            defineField({ name: 'imageName', type: 'string', title: 'Nom / Titre de l\'image', description: 'Pour organiser ou identifier l\'image dans la galerie.' }),
            defineField({ name: 'caption', type: 'string', title: 'Légende' }),
            defineField({ name: 'alt', type: 'string', title: 'Texte alternatif (ALT)' }),
          ],
          preview: {
            select: {
              title: 'imageName',
              subtitle: 'caption',
              media: 'asset',
            },
            prepare({ title, subtitle, media }: { title?: string; subtitle?: string; media?: any }) {
              return {
                title: title || 'Sans titre',
                subtitle: subtitle || '',
                media,
              }
            },
          },
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
      name: 'relatedPosts',
      title: 'Articles de blog (sélection manuelle)',
      description: 'Sélectionnez directement les articles à afficher. Si renseigné, ces articles sont affichés en priorité (les Tags liés sont ignorés).',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'post' }], weak: true }],
    }),
    defineField({
      name: 'relatedTags',
      title: 'Tags d\'articles liés (sélection par tag)',
      description: 'Alternative à la sélection manuelle : tous les articles ayant ces tags seront affichés. Ignoré si des articles sont sélectionnés manuellement ci-dessus.',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'tag' }], weak: true }],
    }),
    defineField({
      name: 'relatedPostsLimit',
      title: 'Nombre d\'articles à afficher',
      type: 'number',
      initialValue: 6,
      description: 'Nombre maximum d\'articles de blog affichés dans "Dernières Sorties". Par défaut : 6.',
      options: {
        list: [6, 12, 18, 24, 30, 36, 42, 48, 54, 60].map(n => ({ title: `${n} articles`, value: n })),
      },
      validation: (Rule) => Rule.required().min(6),
    }),
    defineField({
      name: 'hideRelatedPosts',
      title: 'Masquer les dernières sorties du blog',
      type: 'boolean',
      initialValue: false,
      description: 'Cochez pour ne pas afficher la section "Dernières Sorties" sur la page de ce séjour.',
    }),
  ],
})
