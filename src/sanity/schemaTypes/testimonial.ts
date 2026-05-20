import { defineField, defineType } from 'sanity'
import { MessageSquareQuote } from 'lucide-react'

export const testimonialType = defineType({
  name: 'testimonial',
  title: 'Témoignages',
  type: 'document',
  icon: MessageSquareQuote,
  fields: [
    defineField({
      name: 'author',
      title: 'Auteur',
      type: 'string',
    }),
    defineField({
      name: 'role',
      title: 'Rôle / Activité',
      type: 'string',
      description: 'Ex: Alpinisme, Ski de rando...',
    }),
    defineField({
      name: 'quote',
      title: 'Citation',
      type: 'text',
    }),
    defineField({
      name: 'rating',
      title: 'Note',
      type: 'number',
      initialValue: 5,
      validation: Rule => Rule.min(1).max(5),
    }),
    defineField({
      name: 'avatar',
      title: 'Avatar',
      type: 'image',
      options: { hotspot: true },
    }),
  ],
})
