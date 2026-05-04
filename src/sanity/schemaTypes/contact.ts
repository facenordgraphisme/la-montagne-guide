import { defineField, defineType } from 'sanity'

export const contactType = defineType({
  name: 'contact',
  title: 'Page Contact',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Titre de la page',
      type: 'string',
      initialValue: 'CONTACT',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
    }),
    defineField({
      name: 'email',
      title: 'Email de contact',
      type: 'string',
    }),
    defineField({
      name: 'phone',
      title: 'Téléphone de contact',
      type: 'string',
    }),
    defineField({
      name: 'location',
      title: 'Localisation',
      type: 'string',
    }),
  ],
})
