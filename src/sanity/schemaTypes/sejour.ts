import { defineField, defineType } from 'sanity'
import { Mountain } from 'lucide-react'

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
      type: 'text',
    }),
    defineField({
      name: 'content',
      title: 'Contenu riche (Programme, etc.)',
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
    }),
    defineField({
      name: 'programme',
      title: 'Onglet — Programme',
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
    }),
    defineField({
      name: 'budget',
      title: 'Onglet — Budget',
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
    }),
    defineField({
      name: 'infosPratiques',
      title: 'Onglet — Infos Pratiques',
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
    }),
    defineField({
      name: 'materiel',
      title: 'Onglet — Matériel',
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
  ],
})
