import { defineField, defineType } from 'sanity'
import { Mountain } from 'lucide-react'
import { TagImagePickerInput, GalleryPickerInput } from '../components/TagImagePicker'
import { FAQPickerInput } from '../components/FAQPickerInput'

const descriptionBlocks = [
  {
    type: 'block',
    styles: [
      { title: 'Normal', value: 'normal' },
      { title: 'Centré', value: 'blockCenter' },
      { title: 'Justifié', value: 'blockJustify' },
      { title: 'Droite', value: 'blockRight' },
      { title: 'Encart', value: 'encart' },
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
  fieldsets: [
    { name: 'fsTitle', title: 'Titre', options: { columns: 2 } },
    { name: 'fsDuration', title: 'Durée', options: { columns: 2 } },
    { name: 'fsParticipants', title: 'Participants', options: { columns: 2 } },
    { name: 'fsPeriod', title: 'Période', options: { columns: 2 } },
    { name: 'fsBasePrice', title: 'Prix « À partir de »', options: { columns: 2 } },
    { name: 'fsAllIn', title: 'Prix tout compris', options: { columns: 2 } },
    { name: 'fsGuiding', title: 'Tarif encadrement', options: { columns: 2 } },
    { name: 'fsCosts', title: 'Frais de séjour', options: { columns: 2 } },
    { name: 'fsSeoTitle', title: '🔍 SEO — Titre', options: { columns: 2 } },
    { name: 'fsSeoDesc', title: '🔍 SEO — Description', options: { columns: 2 } },
  ],
  fields: [
    defineField({
      name: 'isHidden',
      title: 'Masquer la page sur le site',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({ name: 'title', fieldset: 'fsTitle', title: 'Titre du séjour (FR)', type: 'string' }),
    defineField({ name: 'titleEn', fieldset: 'fsTitle', title: 'Titre du séjour (EN)', type: 'string' }),
    defineField({
      name: 'slug',
      title: 'Slug (Français)',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
        slugify: (input: string) => input.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 96),
      },
    }),
    defineField({
      name: 'slugEn',
      title: 'Slug (Anglais)',
      type: 'string',
    }),
    defineField({
      name: 'activityType',
      title: 'Type d\'activité principale',
      type: 'string',
      options: {
        list: [
          { title: 'Alpinisme', value: 'alpinisme' },
          { title: 'Ski', value: 'ski' },
          { title: 'Cascade de glace', value: 'cascade-de-glace' },
          { title: 'Escalade', value: 'escalade' },
          { title: 'Parapente alpinisme', value: 'parapente-alpinisme' },
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
    }),
    defineField({
      name: 'massif',
      title: 'Massif',
      type: 'string',
    }),
    defineField({
      name: 'level',
      title: 'Niveau technique',
      type: 'string',
    }),
    defineField({
      name: 'physicalLevel',
      title: 'Niveau physique',
      type: 'string',
    }),
    defineField({
      name: 'physicalLevelTooltip',
      title: 'Niveau physique — Texte au survol',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'season',
      title: 'Saisons (filtre "Prochains Départs")',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Printemps', value: 'printemps' },
          { title: 'Été', value: 'ete' },
          { title: 'Automne', value: 'automne' },
          { title: 'Hiver', value: 'hiver' },
          { title: 'Toutes saisons', value: 'toutes' },
        ],
      },
    }),
    defineField({
      name: 'duration', fieldset: 'fsDuration',
      title: 'Durée (FR)',
      type: 'string',
    }),
    defineField({ name: 'durationEn', fieldset: 'fsDuration', title: 'Durée (EN)', type: 'string' }),
    defineField({
      name: 'participants', fieldset: 'fsParticipants',
      title: 'Nombre de participants (FR)',
      type: 'string',
    }),
    defineField({
      name: 'participantsEn', fieldset: 'fsParticipants',
      title: 'Nombre de participants (EN)',
      type: 'string',
    }),
    defineField({
      name: 'period', fieldset: 'fsPeriod',
      title: 'Période (FR)',
      type: 'string',
    }),
    defineField({
      name: 'periodEn', fieldset: 'fsPeriod',
      title: 'Période (EN)',
      type: 'string',
    }),
    defineField({
      name: 'basePrice', fieldset: 'fsBasePrice',
      title: 'Prix "À partir de" (FR)',
      type: 'string',
    }),
    defineField({
      name: 'basePriceEn', fieldset: 'fsBasePrice',
      title: 'Prix "À partir de" (EN)',
      type: 'string',
    }),
    defineField({
      name: 'prixToutCompris',
      title: 'Mode tarifaire',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'prixToutComprisAmount', fieldset: 'fsAllIn',
      title: 'Prix tout compris (FR)',
      type: 'string',
    }),
    defineField({
      name: 'prixToutComprisAmountEn', fieldset: 'fsAllIn',
      title: 'Prix tout compris (EN)',
      type: 'string',
    }),
    defineField({
      name: 'priceEncadrement', fieldset: 'fsGuiding',
      title: 'Tarif encadrement (FR)',
      type: 'string',
    }),
    defineField({
      name: 'priceEncadrementEn', fieldset: 'fsGuiding',
      title: 'Tarif encadrement (EN)',
      type: 'string',
    }),
    defineField({
      name: 'priceFraisSejour', fieldset: 'fsCosts',
      title: 'Frais de séjour (FR)',
      type: 'string',
    }),
    defineField({
      name: 'priceFraisSejourEn', fieldset: 'fsCosts',
      title: 'Frais de séjour (EN)',
      type: 'string',
    }),
    defineField({
      name: 'image',
      title: 'Image principale',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({ name: 'alt', type: 'string', title: 'Texte ALT (Français)' }),
        defineField({ name: 'altEn', type: 'string', title: 'Texte ALT (Anglais)' }),
      ],
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
                { type: 'object', name: 'ctaBlock', title: 'CTA / Appel à l\'action', fields: [{ name: 'cta', type: 'reference', to: [{ type: 'cta' }], title: 'Choisir un CTA' }], preview: { select: { title: 'cta.name' }, prepare({ title }: any) { return { title: `📣 CTA : ${title || '(non défini)'}` } } } },
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
                {
                  type: 'object',
                  name: 'mapEmbed',
                  title: 'Carte Google Maps',
                  fields: [
                    defineField({
                      name: 'url',
                      type: 'url',
                      title: 'URL d\'intégration Google Maps',
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
                { type: 'object', name: 'ctaBlock', title: 'CTA / Appel à l\'action', fields: [{ name: 'cta', type: 'reference', to: [{ type: 'cta' }], title: 'Choisir un CTA' }], preview: { select: { title: 'cta.name' }, prepare({ title }: any) { return { title: `📣 CTA : ${title || '(non défini)'}` } } } },
              ]
            }),
            defineField({
              name: 'pdf',
              type: 'file',
              title: 'PDF téléchargeable (optionnel)',
              options: { accept: '.pdf' },
            }),
          ]
        },
        {
          type: 'reference',
          title: 'Onglet modèle',
          to: [{ type: 'tabTemplate' }],
        },
      ]
    }),
    defineField({
      name: 'templateTabs',
      title: 'Onglets modèles (ancien emplacement)',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'tabTemplate' }] }],
      hidden: ({ value }) => !(value as unknown[])?.length,
    }),
    defineField({
      name: 'ficheTooltips',
      title: 'Fiche Technique — Info-bulles',
      type: 'object',
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({ name: 'duration', title: 'Info-bulle — Durée', type: 'text', rows: 2 }),
        defineField({ name: 'level', title: 'Info-bulle — Niveau technique', type: 'text', rows: 2 }),
        defineField({ name: 'physicalLevel', title: 'Info-bulle — Niveau physique', type: 'text', rows: 2 }),
        defineField({ name: 'massif', title: 'Info-bulle — Massif', type: 'text', rows: 2 }),
        defineField({ name: 'participants', title: 'Info-bulle — Participants', type: 'text', rows: 2 }),
        defineField({ name: 'period', title: 'Info-bulle — Période', type: 'text', rows: 2 }),
        defineField({ name: 'tarifs', title: 'Info-bulle — Tarifs', type: 'text', rows: 2 }),
      ]
    }),
    defineField({
      name: 'materielPdf',
      title: 'Matériel — PDF téléchargeable',
      type: 'file',
      options: { accept: '.pdf' },
    }),
    defineField({
      name: 'tagBrowsedImages',
      title: 'Galerie — Sélection par tag',
      type: 'array',
      of: [
        {
          type: 'image',
          fields: [
            defineField({ name: 'imageName', type: 'string', title: 'Nom / Titre' }),
            defineField({ name: 'alt', type: 'string', title: 'ALT (Français)' }),
            defineField({ name: 'altEn', type: 'string', title: 'ALT (Anglais)' }),
          ],
        },
      ],
      options: { layout: 'grid' },
      components: { input: TagImagePickerInput },
    }),
    defineField({
      name: 'gallery',
      title: 'Galerie photos',
      type: 'array',
      components: { input: GalleryPickerInput },
      options: {
        layout: 'grid',
      },
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({ name: 'imageName', type: 'string', title: 'Nom / Titre' }),
            defineField({ name: 'caption', type: 'string', title: 'Légende (Français)' }),
            defineField({ name: 'captionEn', type: 'string', title: 'Légende (Anglais)' }),
            defineField({ name: 'alt', type: 'string', title: 'ALT (Français)' }),
            defineField({ name: 'altEn', type: 'string', title: 'ALT (Anglais)' }),
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
    }),
    defineField({
      name: 'hideGallery',
      title: 'Masquer la galerie photos',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'bookAdventureUrl',
      title: 'Lien de réservation Outplanners',
      type: 'url',
    }),
    defineField({
      name: 'faqs',
      title: 'Questions fréquentes (FAQ)',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'faq' }], weak: true }],
      components: { input: FAQPickerInput },
    }),
    defineField({
      name: 'recommendedSejours',
      title: 'Séjours recommandés',
      type: 'array',
      of: [{
        type: 'reference',
        to: [{ type: 'sejour' }],
        weak: true,
        options: {
          filter: ({ document }: any) => {
            const id = String(document._id || '').replace(/^drafts\./, '')
            return { filter: '!(_id in [$id, $draftId])', params: { id, draftId: `drafts.${id}` } }
          },
        },
      }],
      validation: (Rule) => Rule.unique(),
    }),
    defineField({
      name: 'relatedPosts',
      title: 'Articles de blog (sélection manuelle)',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'post' }], weak: true }],
    }),
    defineField({
      name: 'relatedTags',
      title: 'Tags d\'articles liés (sélection par tag)',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'tag' }], weak: true }],
    }),
    defineField({
      name: 'relatedPostsLimit',
      title: 'Nombre d\'articles à afficher',
      type: 'number',
      initialValue: 6,
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
    }),
    defineField({
      name: 'metaTitle', fieldset: 'fsSeoTitle',
      title: '🔍 SEO — Titre (balise title)',
      type: 'string',
    }),
    defineField({
      name: 'metaDescription', fieldset: 'fsSeoDesc',
      title: '🔍 SEO — Description (meta description)',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'metaTitleEn', fieldset: 'fsSeoTitle',
      title: '🔍 SEO — Titre (balise title) EN',
      type: 'string',
    }),
    defineField({
      name: 'metaDescriptionEn', fieldset: 'fsSeoDesc',
      title: '🔍 SEO — Description (meta) EN',
      type: 'text',
      rows: 3,
    }),
  ],
})
