import { defineField, defineType } from 'sanity'
import { BookOpen } from 'lucide-react'

export const resourceType = defineType({
  name: 'resource',
  title: 'Ressources & Guides',
  type: 'document',
  icon: BookOpen,
  fields: [
    defineField({
      name: 'title',
      title: 'Titre (Français)',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'titleEn',
      title: 'Titre (Anglais)',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug (Français)',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slugEn',
      title: 'Slug (Anglais)',
      type: 'string',
    }),
    defineField({
      name: 'category',
      title: 'Catégorie',
      type: 'string',
      initialValue: 'alpinisme',
      options: {
        list: [
          { title: 'Alpinisme', value: 'alpinisme' },
          { title: 'Ski de Randonnée', value: 'ski' },
          { title: 'Escalade', value: 'escalade' },
          { title: 'Cascade de Glace', value: 'cascade-de-glace' },
          { title: 'Préparation & Physique', value: 'preparation' },
          { title: 'Équipement & Matériel', value: 'equipement' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'intro',
      title: 'Introduction / Chapô (Français)',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'introEn',
      title: 'Introduction / Chapô (Anglais)',
      type: 'text',
      rows: 3,
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
    defineField({
      name: 'content',
      title: 'Contenu (Français)',
      type: 'array',
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
            { title: 'Citation', value: 'blockquote' }
          ]
        },
        { type: 'image', options: { hotspot: true }, fields: [{ name: 'caption', type: 'string', title: 'Légende (Français)' }, { name: 'captionEn', type: 'string', title: 'Légende (Anglais)' }, { name: 'alt', type: 'string', title: 'ALT (Français)' }, { name: 'altEn', type: 'string', title: 'ALT (Anglais)' }] },
        { type: 'object', name: 'ctaBlock', title: 'CTA / Appel à l\'action', fields: [{ name: 'cta', type: 'reference', to: [{ type: 'cta' }], title: 'Choisir un CTA' }], preview: { select: { title: 'cta.name' }, prepare({ title }: any) { return { title: `📣 CTA : ${title || '(non défini)'}` } } } }
      ],
    }),
    defineField({
      name: 'contentEn',
      title: 'Contenu (Anglais)',
      type: 'array',
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
            { title: 'Citation', value: 'blockquote' }
          ]
        },
        { type: 'image', options: { hotspot: true }, fields: [{ name: 'caption', type: 'string', title: 'Légende (Français)' }, { name: 'captionEn', type: 'string', title: 'Légende (Anglais)' }, { name: 'alt', type: 'string', title: 'ALT (Français)' }, { name: 'altEn', type: 'string', title: 'ALT (Anglais)' }] },
        { type: 'object', name: 'ctaBlock', title: 'CTA / Appel à l\'action', fields: [{ name: 'cta', type: 'reference', to: [{ type: 'cta' }], title: 'Choisir un CTA' }], preview: { select: { title: 'cta.name' }, prepare({ title }: any) { return { title: `📣 CTA : ${title || '(non défini)'}` } } } }
      ],
    }),
    defineField({
      name: 'tabs',
      title: 'Onglets personnalisés',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'resourceTab',
          title: 'Onglet',
          fields: [
            defineField({ name: 'title', type: 'string', title: 'Titre (Français)', validation: (Rule) => Rule.required() }),
            defineField({ name: 'titleEn', type: 'string', title: 'Titre (Anglais)', validation: (Rule) => Rule.required() }),
            defineField({
              name: 'content',
              type: 'array',
              title: 'Contenu (Français)',
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
                    { title: 'Citation', value: 'blockquote' },
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
                { type: 'image', options: { hotspot: true }, fields: [{ name: 'caption', type: 'string', title: 'Légende (Français)' }, { name: 'captionEn', type: 'string', title: 'Légende (Anglais)' }, { name: 'alt', type: 'string', title: 'ALT (Français)' }, { name: 'altEn', type: 'string', title: 'ALT (Anglais)' }] },
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
                    defineField({ name: 'height', type: 'number', title: 'Hauteur (px)', initialValue: 400 }),
                  ],
                  preview: {
                    select: { title: 'url' },
                    prepare({ title }: { title?: string }) {
                      return { title: title ? `Carte : ${title.substring(0, 60)}…` : 'Carte Google Maps' };
                    },
                  },
                },
                { type: 'object', name: 'ctaBlock', title: 'CTA / Appel à l\'action', fields: [{ name: 'cta', type: 'reference', to: [{ type: 'cta' }], title: 'Choisir un CTA' }], preview: { select: { title: 'cta.name' }, prepare({ title }: any) { return { title: `📣 CTA : ${title || '(non défini)'}` } } } },
              ],
            }),
            defineField({
              name: 'contentEn',
              type: 'array',
              title: 'Contenu (Anglais)',
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
                    { title: 'Citation', value: 'blockquote' },
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
                { type: 'image', options: { hotspot: true }, fields: [{ name: 'caption', type: 'string', title: 'Légende (Français)' }, { name: 'captionEn', type: 'string', title: 'Légende (Anglais)' }, { name: 'alt', type: 'string', title: 'ALT (Français)' }, { name: 'altEn', type: 'string', title: 'ALT (Anglais)' }] },
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
                    defineField({ name: 'height', type: 'number', title: 'Hauteur (px)', initialValue: 400 }),
                  ],
                  preview: {
                    select: { title: 'url' },
                    prepare({ title }: { title?: string }) {
                      return { title: title ? `Carte : ${title.substring(0, 60)}…` : 'Carte Google Maps' };
                    },
                  },
                },
                { type: 'object', name: 'ctaBlock', title: 'CTA / Appel à l\'action', fields: [{ name: 'cta', type: 'reference', to: [{ type: 'cta' }], title: 'Choisir un CTA' }], preview: { select: { title: 'cta.name' }, prepare({ title }: any) { return { title: `📣 CTA : ${title || '(non défini)'}` } } } },
              ],
            }),
            defineField({
              name: 'pdf',
              type: 'file',
              title: 'PDF téléchargeable (optionnel)',
              options: { accept: '.pdf' },
            }),
          ],
        },
      ],
    }),
    defineField({
      name: 'relatedActivities',
      title: 'Activités & Séjours associés',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'sejour' }] }],
    }),
    defineField({
      name: 'faqs',
      title: 'FAQ Associées',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'faq' }], weak: true }],
    }),
    defineField({
      name: 'ctaTitle',
      title: 'CTA Sidebar — Titre',
      type: 'string',
    }),
    defineField({
      name: 'ctaText',
      title: 'CTA Sidebar — Texte',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'ctaLink',
      title: 'CTA Sidebar — Lien',
      type: 'string',
      initialValue: '/contact',
    }),
    defineField({
      name: 'ctaButtonLabel',
      title: 'CTA Sidebar — Libellé du bouton',
      type: 'string',
    }),
    defineField({
      name: 'metaTitle',
      title: '🔍 SEO — Titre (balise title)',
      type: 'string',
    }),
    defineField({
      name: 'metaDescription',
      title: '🔍 SEO — Description (meta description)',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'metaTitleEn',
      title: '🔍 SEO — Titre (balise title) EN',
      type: 'string',
    }),
    defineField({
      name: 'metaDescriptionEn',
      title: '🔍 SEO — Description (meta) EN',
      type: 'text',
      rows: 3,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      category: 'category',
      media: 'image',
    },
    prepare(selection) {
      const { title, category, media } = selection
      const catMap: Record<string, string> = {
        alpinisme: 'Alpinisme',
        ski: 'Ski de Randonnée',
        escalade: 'Escalade',
        'cascade-de-glace': 'Cascade de Glace',
        preparation: 'Préparation & Physique',
        equipement: 'Équipement & Matériel',
      }
      return {
        title: title || 'Sans titre',
        subtitle: catMap[category] || category || 'Catégorie générale',
        media,
      }
    },
  },
})
