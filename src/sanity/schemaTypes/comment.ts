import { defineField, defineType } from 'sanity'
import { MessageSquare } from 'lucide-react'

export const commentType = defineType({
  name: 'comment',
  title: 'Commentaire / Témoignage Client',
  type: 'document',
  icon: MessageSquare,
  fields: [
    defineField({
      name: 'name',
      title: 'Nom du client',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'rating',
      title: 'Note (de 1 à 5 étoiles)',
      type: 'number',
      validation: (Rule) => Rule.required().min(1).max(5),
    }),
    defineField({
      name: 'content',
      title: 'Commentaire / Témoignage',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'post',
      title: 'Article de blog lié',
      type: 'reference',
      to: [{ type: 'post' }],
      weak: true,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'approved',
      title: 'Approuvé (visible sur le site)',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      name: 'name',
      rating: 'rating',
      postTitle: 'post->title',
      approved: 'approved',
    },
    prepare(selection) {
      const { name, rating, postTitle, approved } = selection
      return {
        title: `${name} (${rating}★) - ${approved ? 'Approuvé' : 'En attente'}`,
        subtitle: `Article: ${postTitle || 'Inconnu'}`,
      }
    },
  },
})
