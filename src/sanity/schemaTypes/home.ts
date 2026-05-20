import { defineField, defineType } from 'sanity'
import { Home } from 'lucide-react'

export const homeType = defineType({
  name: 'home',
  title: 'Page d\'accueil',
  type: 'document',
  icon: Home,
  groups: [
    { name: 'layout', title: 'Mise en Page ⚙️' },
    { name: 'hero', title: 'Hero' },
    { name: 'about', title: 'À Propos' },
    { name: 'activities', title: 'Activités' },
    { name: 'sorties', title: 'Sorties' },
    { name: 'adventure', title: 'Aventure' },
    { name: 'contact', title: 'Contact Home' },
    { name: 'testimonials', title: 'Témoignages' },
    { name: 'blog', title: 'Blog' },
  ],
  fields: [
    // HERO SECTION
    defineField({
      name: 'heroTitle',
      title: 'Titre Hero',
      type: 'text',
      description: 'Utilisez la touche Entrée pour passer à la ligne (ex: L\'AVENTURE sur la ligne 1, EN CORDÉE sur la ligne 2)',
      rows: 2,
      group: 'hero',
    }),
    defineField({
      name: 'heroSubtitle',
      title: 'Sous-titre Hero',
      type: 'string',
      group: 'hero',
    }),
    defineField({
      name: 'heroDescription',
      title: 'Description Hero',
      type: 'text',
      description: 'Utilisez la touche Entrée pour passer à la ligne.',
      rows: 4,
      group: 'hero',
    }),
    defineField({
      name: 'heroImages',
      title: 'Images du carrousel',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
      group: 'hero',
    }),

    // ABOUT SECTION
    defineField({
      name: 'aboutBadge',
      title: 'Badge À Propos',
      type: 'string',
      group: 'about',
      initialValue: 'Le Guide',
    }),
    defineField({
      name: 'aboutTitle',
      title: 'Titre À Propos (Normal)',
      type: 'string',
      group: 'about',
    }),
    defineField({
      name: 'aboutTitleAccent',
      title: 'Titre À Propos (Turquoise)',
      type: 'string',
      group: 'about',
    }),
    defineField({
      name: 'aboutDescription',
      title: 'Description À Propos',
      type: 'array',
      of: [{ type: 'block' }],
      group: 'about',
    }),
    defineField({
      name: 'aboutImage',
      title: 'Image À Propos',
      type: 'image',
      options: { hotspot: true },
      group: 'about',
    }),
    defineField({
      name: 'experienceYears',
      title: 'Années d\'expérience',
      type: 'number',
      group: 'about',
    }),

    // ACTIVITIES SECTION
    defineField({
      name: 'activitiesTitle',
      title: 'Titre Activités (Normal)',
      type: 'string',
      group: 'activities',
    }),
    defineField({
      name: 'activitiesTitleAccent',
      title: 'Titre Activités (Turquoise)',
      type: 'string',
      group: 'activities',
    }),
    defineField({
      name: 'activitiesDescription',
      title: 'Description Activités',
      type: 'text',
      group: 'activities',
    }),

    // SORTIES SECTION
    defineField({
      name: 'sortiesBadge',
      title: 'Badge Sorties',
      type: 'string',
      group: 'sorties',
      initialValue: 'Prochaines sorties',
    }),
    defineField({
      name: 'sortiesTitle',
      title: 'Titre Sorties (Normal)',
      type: 'string',
      group: 'sorties',
    }),
    defineField({
      name: 'sortiesTitleAccent',
      title: 'Titre Sorties (Turquoise)',
      type: 'string',
      group: 'sorties',
    }),

    // ADVENTURE START SECTION
    defineField({
      name: 'adventureBadge',
      title: 'Badge Aventure',
      type: 'string',
      group: 'adventure',
      initialValue: 'VOTRE AVENTURE COMMENCE ICI',
    }),
    defineField({
      name: 'adventureTitle',
      title: 'Titre Aventure (Normal)',
      type: 'string',
      group: 'adventure',
    }),
    defineField({
      name: 'adventureTitleAccent',
      title: 'Titre Aventure (Turquoise)',
      type: 'string',
      group: 'adventure',
    }),
    defineField({
      name: 'adventureDescription',
      title: 'Description Aventure',
      type: 'text',
      group: 'adventure',
    }),
    defineField({
      name: 'adventureFeatures',
      title: 'Points forts',
      type: 'array',
      of: [{ type: 'string' }],
      group: 'adventure',
    }),
    defineField({
      name: 'adventureImage',
      title: 'Image Aventure',
      type: 'image',
      options: { hotspot: true },
      group: 'adventure',
    }),

    // CONTACT HOME SECTION
    defineField({
      name: 'contactBadge',
      title: 'Badge Contact',
      type: 'string',
      group: 'contact',
      initialValue: 'Vous avez un projet ?',
    }),
    defineField({
      name: 'contactTitle',
      title: 'Titre Contact (Normal)',
      type: 'string',
      group: 'contact',
    }),
    defineField({
      name: 'contactTitleAccent',
      title: 'Titre Contact (Turquoise)',
      type: 'string',
      group: 'contact',
    }),
    defineField({
      name: 'contactDescription',
      title: 'Description Contact',
      type: 'text',
      group: 'contact',
    }),

    // TESTIMONIALS SECTION
    defineField({
      name: 'testimonialsBadge',
      title: 'Badge Témoignages',
      type: 'string',
      group: 'testimonials',
      initialValue: 'Avis Clients',
    }),
    defineField({
      name: 'testimonialsTitle',
      title: 'Titre Témoignages (Normal)',
      type: 'string',
      group: 'testimonials',
    }),
    defineField({
      name: 'testimonialsTitleAccent',
      title: 'Titre Témoignages (Turquoise)',
      type: 'string',
      group: 'testimonials',
    }),

    // BLOG SECTION
    defineField({
      name: 'blogBadge',
      title: 'Badge Blog',
      type: 'string',
      group: 'blog',
      initialValue: 'Carnet de voyage',
    }),
    defineField({
      name: 'blogTitle',
      title: 'Titre Blog (Normal)',
      type: 'string',
      group: 'blog',
    }),
    defineField({
      name: 'blogTitleAccent',
      title: 'Titre Blog (Turquoise)',
      type: 'string',
      group: 'blog',
    }),

    // LAYOUT CONTROLS
    defineField({
      name: 'hideTestimonials',
      title: 'Masquer la section Témoignages',
      type: 'boolean',
      initialValue: false,
      group: 'layout',
      description: "Masque le bloc d'avis clients sur la page d'accueil.",
    }),
    defineField({
      name: 'hideBlog',
      title: 'Masquer la section Blog',
      type: 'boolean',
      initialValue: false,
      group: 'layout',
      description: "Masque le bloc de carnet de voyage sur la page d'accueil.",
    }),
    defineField({
      name: 'featuredPostsLimit',
      title: "Limite d'articles de blog",
      type: 'number',
      initialValue: 3,
      group: 'layout',
      description: "Le nombre maximum d'articles à afficher dans la grille du blog.",
      validation: (Rule) => Rule.min(1).max(9),
    }),
  ],
})
