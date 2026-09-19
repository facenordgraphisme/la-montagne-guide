import { defineField, defineType } from 'sanity'
import { UserRound } from 'lucide-react'

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

const richBlocks = [
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
  }
]

export const guideType = defineType({
  name: 'guide',
  title: 'Le Guide',
  type: 'document',
  icon: UserRound,
  fields: [
    defineField({ name: 'badge', title: 'Badge (FR)', type: 'string', initialValue: 'Votre Guide' }),
    defineField({ name: 'badgeEn', title: 'Badge (EN)', type: 'string', initialValue: 'Your Guide' }),
    defineField({ name: 'titleNormal', title: 'Titre Normal (FR)', type: 'string' }),
    defineField({ name: 'titleNormalEn', title: 'Titre Normal (EN)', type: 'string' }),
    defineField({ name: 'titleAccent', title: 'Titre Turquoise (FR)', type: 'string' }),
    defineField({ name: 'titleAccentEn', title: 'Titre Turquoise (EN)', type: 'string' }),
    defineField({ name: 'quote', title: 'Citation (FR)', type: 'string' }),
    defineField({ name: 'quoteEn', title: 'Citation (EN)', type: 'string' }),
    defineField({ name: 'image', title: 'Image de profil', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'bioTitle', title: 'Titre de la Bio (FR)', type: 'string' }),
    defineField({ name: 'bioTitleEn', title: 'Titre de la Bio (EN)', type: 'string' }),
    defineField({ name: 'bio', title: 'Biographie (FR)', type: 'array', of: richBlocks }),
    defineField({ name: 'bioEn', title: 'Biographie (EN)', type: 'array', of: richBlocks }),
    defineField({ name: 'certification', title: 'Certification (ex: UIAGM)', type: 'string' }),
    defineField({ name: 'certificationSub', title: 'Sous-titre Certification (FR)', type: 'string' }),
    defineField({ name: 'certificationSubEn', title: 'Sous-titre Certification (EN)', type: 'string' }),
    defineField({ name: 'experience', title: 'Expérience (ex: 15+)', type: 'string' }),
    defineField({ name: 'experienceSub', title: 'Sous-titre Expérience (FR)', type: 'string' }),
    defineField({ name: 'experienceSubEn', title: 'Sous-titre Expérience (EN)', type: 'string' }),
    defineField({
      name: 'values',
      title: 'Mes Valeurs',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'title', title: 'Titre (FR)', type: 'string' }),
            defineField({ name: 'titleEn', title: 'Titre (EN)', type: 'string' }),
            defineField({ name: 'description', title: 'Description (FR)', type: 'array', of: descriptionBlocks }),
            defineField({ name: 'descriptionEn', title: 'Description (EN)', type: 'array', of: descriptionBlocks }),
          ],
        },
      ],
    }),
    defineField({
      name: 'sections',
      title: 'Sections de la biographie',
      type: 'array',
      description: 'Ajoutez des blocs de contenu alternés (image à gauche ou à droite) pour structurer le texte.',
      of: [
        {
          type: 'object',
          name: 'aboutSection',
          title: 'Section de contenu',
          fields: [
            defineField({ name: 'title', title: 'Titre de la section (FR)', type: 'string' }),
            defineField({ name: 'titleEn', title: 'Titre de la section (EN)', type: 'string' }),
            defineField({ name: 'content', title: 'Contenu (FR)', type: 'array', of: richBlocks }),
            defineField({ name: 'contentEn', title: 'Contenu (EN)', type: 'array', of: richBlocks }),
            defineField({ name: 'image', title: 'Image', type: 'image', options: { hotspot: true } }),
            defineField({
              name: 'imagePosition',
              title: 'Position de l\'image',
              type: 'string',
              initialValue: 'left',
              options: {
                list: [
                  { title: 'Image à gauche, texte à droite', value: 'left' },
                  { title: 'Image à droite, texte à gauche', value: 'right' }
                ],
                layout: 'radio'
              }
            })
          ]
        }
      ]
    }),
    defineField({ name: 'hideStats', title: 'Masquer les encarts statistiques (UIAGM / Expérience)', type: 'boolean', initialValue: false }),
    defineField({ name: 'hideValues', title: 'Masquer la section "Mes Valeurs"', type: 'boolean', initialValue: false }),
    defineField({
      name: 'faqs',
      title: 'Questions fréquentes (FAQ)',
      description: 'Sélectionnez des FAQ spécifiques à afficher sur la page À Propos.',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'faq' }], weak: true }],
    }),
  ],
})
