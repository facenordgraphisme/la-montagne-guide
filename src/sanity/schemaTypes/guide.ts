import { defineField, defineType } from 'sanity'
import { UserRound } from 'lucide-react'

export const guideType = defineType({
  name: 'guide',
  title: 'Le Guide',
  type: 'document',
  icon: UserRound,
  fields: [
    defineField({
      name: 'badge',
      title: 'Badge',
      type: 'string',
      initialValue: 'Votre Guide',
    }),
    defineField({
      name: 'titleNormal',
      title: 'Titre (Normal)',
      type: 'string',
    }),
    defineField({
      name: 'titleAccent',
      title: 'Titre (Turquoise)',
      type: 'string',
    }),
    defineField({
      name: 'quote',
      title: 'Citation',
      type: 'string',
    }),
    defineField({
      name: 'image',
      title: 'Image de profil',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'bioTitle',
      title: 'Titre de la Bio',
      type: 'string',
    }),
    defineField({
      name: 'bio',
      title: 'Biographie',
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
        ]
      }],
    }),
    defineField({
      name: 'certification',
      title: 'Certification (ex: UIAGM)',
      type: 'string',
    }),
    defineField({
      name: 'certificationSub',
      title: 'Sous-titre Certification',
      type: 'string',
    }),
    defineField({
      name: 'experience',
      title: 'Expérience (ex: 15+)',
      type: 'string',
    }),
    defineField({
      name: 'experienceSub',
      title: 'Sous-titre Expérience',
      type: 'string',
    }),
    defineField({
      name: 'values',
      title: 'Mes Valeurs',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'title', title: 'Titre', type: 'string' }),
            defineField({ name: 'description', title: 'Description', type: 'text' }),
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
            defineField({ name: 'title', title: 'Titre de la section', type: 'string' }),
            defineField({
              name: 'content',
              title: 'Contenu (Texte)',
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
                ]
              }]
            }),
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
  ],
})
