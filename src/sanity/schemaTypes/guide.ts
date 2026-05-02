import { defineField, defineType } from 'sanity'

export const guideType = defineType({
  name: 'guide',
  title: 'Le Guide',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Nom',
      type: 'string',
    }),
    defineField({
      name: 'bio',
      title: 'Biographie',
      type: 'text',
    }),
    defineField({
      name: 'photo',
      title: 'Photo de profil',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'contact',
      title: 'Informations de contact',
      type: 'object',
      fields: [
        { name: 'email', type: 'string', title: 'Email' },
        { name: 'phone', type: 'string', title: 'Téléphone' },
        { name: 'socials', type: 'array', title: 'Réseaux sociaux', of: [{ type: 'string' }] },
      ],
    }),
  ],
})
