import { defineField, defineType } from 'sanity'
import { Home } from 'lucide-react'

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
    defineField({ name: 'heroTitle', title: 'Titre Hero (FR)', type: 'text', description: 'Utilisez la touche Entrée pour passer à la ligne', rows: 2, group: 'hero' }),
    defineField({ name: 'heroTitleEn', title: 'Titre Hero (EN)', type: 'text', rows: 2, group: 'hero' }),
    defineField({ name: 'heroSubtitle', title: 'Sous-titre Hero (FR)', type: 'string', group: 'hero' }),
    defineField({ name: 'heroSubtitleEn', title: 'Sous-titre Hero (EN)', type: 'string', group: 'hero' }),
    defineField({ name: 'heroDescription', title: 'Description Hero (FR)', type: 'array', of: descriptionBlocks, group: 'hero' }),
    defineField({ name: 'heroDescriptionEn', title: 'Description Hero (EN)', type: 'array', of: descriptionBlocks, group: 'hero' }),
    defineField({
      name: 'heroImages',
      title: 'Images du carrousel',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
      group: 'hero',
    }),
    defineField({
      name: 'heroTextAlign',
      title: 'Alignement du texte du Hero',
      type: 'string',
      initialValue: 'center',
      options: { list: [{ title: 'Centré', value: 'center' }, { title: 'Gauche', value: 'left' }, { title: 'Droite', value: 'right' }], layout: 'radio' },
      group: 'hero',
    }),
    defineField({ name: 'heroBtnDiscoverText', title: 'Bouton "Découvrir" (FR)', type: 'string', initialValue: 'Découvrir', group: 'hero' }),
    defineField({ name: 'heroBtnDiscoverTextEn', title: 'Bouton "Découvrir" (EN)', type: 'string', initialValue: 'Discover', group: 'hero' }),
    defineField({ name: 'heroBtnDeparturesText', title: 'Bouton "Sorties" (FR)', type: 'string', initialValue: 'Prochaines sorties', group: 'hero' }),
    defineField({ name: 'heroBtnDeparturesTextEn', title: 'Bouton "Sorties" (EN)', type: 'string', initialValue: 'Upcoming departures', group: 'hero' }),

    // ABOUT SECTION
    defineField({ name: 'aboutBadge', title: 'Badge À Propos (FR)', type: 'string', group: 'about', initialValue: 'Le Guide' }),
    defineField({ name: 'aboutBadgeEn', title: 'Badge À Propos (EN)', type: 'string', group: 'about', initialValue: 'The Guide' }),
    defineField({ name: 'aboutTitle', title: 'Titre À Propos Normal (FR)', type: 'string', group: 'about' }),
    defineField({ name: 'aboutTitleEn', title: 'Titre À Propos Normal (EN)', type: 'string', group: 'about' }),
    defineField({ name: 'aboutTitleAccent', title: 'Titre À Propos Turquoise (FR)', type: 'string', group: 'about' }),
    defineField({ name: 'aboutTitleAccentEn', title: 'Titre À Propos Turquoise (EN)', type: 'string', group: 'about' }),
    defineField({ name: 'aboutDescription', title: 'Description À Propos (FR)', type: 'array', of: richBlocks, group: 'about' }),
    defineField({ name: 'aboutDescriptionEn', title: 'Description À Propos (EN)', type: 'array', of: richBlocks, group: 'about' }),
    defineField({ name: 'aboutImage', title: 'Image À Propos', type: 'image', options: { hotspot: true }, group: 'about' }),
    defineField({ name: 'experienceYears', title: 'Années d\'expérience', type: 'number', group: 'about' }),

    // ACTIVITIES SECTION
    defineField({ name: 'activitiesTitle', title: 'Titre Activités Normal (FR)', type: 'string', group: 'activities' }),
    defineField({ name: 'activitiesTitleEn', title: 'Titre Activités Normal (EN)', type: 'string', group: 'activities' }),
    defineField({ name: 'activitiesTitleAccent', title: 'Titre Activités Turquoise (FR)', type: 'string', group: 'activities' }),
    defineField({ name: 'activitiesTitleAccentEn', title: 'Titre Activités Turquoise (EN)', type: 'string', group: 'activities' }),
    defineField({ name: 'activitiesDescription', title: 'Description Activités (FR)', type: 'array', of: descriptionBlocks, group: 'activities' }),
    defineField({ name: 'activitiesDescriptionEn', title: 'Description Activités (EN)', type: 'array', of: descriptionBlocks, group: 'activities' }),

    // SORTIES SECTION
    defineField({ name: 'sortiesBadge', title: 'Badge Sorties (FR)', type: 'string', group: 'sorties', initialValue: 'Prochaines sorties' }),
    defineField({ name: 'sortiesBadgeEn', title: 'Badge Sorties (EN)', type: 'string', group: 'sorties', initialValue: 'Upcoming trips' }),
    defineField({ name: 'sortiesTitle', title: 'Titre Sorties Normal (FR)', type: 'string', group: 'sorties' }),
    defineField({ name: 'sortiesTitleEn', title: 'Titre Sorties Normal (EN)', type: 'string', group: 'sorties' }),
    defineField({ name: 'sortiesTitleAccent', title: 'Titre Sorties Turquoise (FR)', type: 'string', group: 'sorties' }),
    defineField({ name: 'sortiesTitleAccentEn', title: 'Titre Sorties Turquoise (EN)', type: 'string', group: 'sorties' }),

    // ADVENTURE START SECTION
    defineField({ name: 'adventureBadge', title: 'Badge Aventure (FR)', type: 'string', group: 'adventure', initialValue: 'VOTRE AVENTURE COMMENCE ICI' }),
    defineField({ name: 'adventureBadgeEn', title: 'Badge Aventure (EN)', type: 'string', group: 'adventure', initialValue: 'YOUR ADVENTURE STARTS HERE' }),
    defineField({ name: 'adventureTitle', title: 'Titre Aventure Normal (FR)', type: 'string', group: 'adventure' }),
    defineField({ name: 'adventureTitleEn', title: 'Titre Aventure Normal (EN)', type: 'string', group: 'adventure' }),
    defineField({ name: 'adventureTitleAccent', title: 'Titre Aventure Turquoise (FR)', type: 'string', group: 'adventure' }),
    defineField({ name: 'adventureTitleAccentEn', title: 'Titre Aventure Turquoise (EN)', type: 'string', group: 'adventure' }),
    defineField({ name: 'adventureDescription', title: 'Description Aventure (FR)', type: 'array', of: descriptionBlocks, group: 'adventure' }),
    defineField({ name: 'adventureDescriptionEn', title: 'Description Aventure (EN)', type: 'array', of: descriptionBlocks, group: 'adventure' }),
    defineField({ name: 'adventureFeatures', title: 'Points forts (FR)', type: 'array', of: [{ type: 'string' }], group: 'adventure' }),
    defineField({ name: 'adventureFeaturesEn', title: 'Points forts (EN)', type: 'array', of: [{ type: 'string' }], group: 'adventure' }),
    defineField({ name: 'adventureImage', title: 'Image Aventure', type: 'image', options: { hotspot: true }, group: 'adventure' }),

    // CONTACT HOME SECTION
    defineField({ name: 'contactBadge', title: 'Badge Contact (FR)', type: 'string', group: 'contact', initialValue: 'Vous avez un projet ?' }),
    defineField({ name: 'contactBadgeEn', title: 'Badge Contact (EN)', type: 'string', group: 'contact', initialValue: 'Do you have a project?' }),
    defineField({ name: 'contactTitle', title: 'Titre Contact Normal (FR)', type: 'string', group: 'contact' }),
    defineField({ name: 'contactTitleEn', title: 'Titre Contact Normal (EN)', type: 'string', group: 'contact' }),
    defineField({ name: 'contactTitleAccent', title: 'Titre Contact Turquoise (FR)', type: 'string', group: 'contact' }),
    defineField({ name: 'contactTitleAccentEn', title: 'Titre Contact Turquoise (EN)', type: 'string', group: 'contact' }),
    defineField({ name: 'contactDescription', title: 'Description Contact (FR)', type: 'array', of: descriptionBlocks, group: 'contact' }),
    defineField({ name: 'contactDescriptionEn', title: 'Description Contact (EN)', type: 'array', of: descriptionBlocks, group: 'contact' }),

    // TESTIMONIALS SECTION
    defineField({ name: 'testimonialsBadge', title: 'Badge Témoignages (FR)', type: 'string', group: 'testimonials', initialValue: 'Avis Clients' }),
    defineField({ name: 'testimonialsBadgeEn', title: 'Badge Témoignages (EN)', type: 'string', group: 'testimonials', initialValue: 'Customer reviews' }),
    defineField({ name: 'testimonialsTitle', title: 'Titre Témoignages Normal (FR)', type: 'string', group: 'testimonials' }),
    defineField({ name: 'testimonialsTitleEn', title: 'Titre Témoignages Normal (EN)', type: 'string', group: 'testimonials' }),
    defineField({ name: 'testimonialsTitleAccent', title: 'Titre Témoignages Turquoise (FR)', type: 'string', group: 'testimonials' }),
    defineField({ name: 'testimonialsTitleAccentEn', title: 'Titre Témoignages Turquoise (EN)', type: 'string', group: 'testimonials' }),

    // BLOG SECTION
    defineField({ name: 'blogBadge', title: 'Badge Blog (FR)', type: 'string', group: 'blog', initialValue: 'Carnet de voyage' }),
    defineField({ name: 'blogBadgeEn', title: 'Badge Blog (EN)', type: 'string', group: 'blog', initialValue: 'Travel journal' }),
    defineField({ name: 'blogTitle', title: 'Titre Blog Normal (FR)', type: 'string', group: 'blog' }),
    defineField({ name: 'blogTitleEn', title: 'Titre Blog Normal (EN)', type: 'string', group: 'blog' }),
    defineField({ name: 'blogTitleAccent', title: 'Titre Blog Turquoise (FR)', type: 'string', group: 'blog' }),
    defineField({ name: 'blogTitleAccentEn', title: 'Titre Blog Turquoise (EN)', type: 'string', group: 'blog' }),

    // LAYOUT CONTROLS
    defineField({ name: 'hideTestimonials', title: 'Masquer la section Témoignages', type: 'boolean', initialValue: false, group: 'layout', description: "Masque le bloc d'avis clients sur la page d'accueil." }),
    defineField({ name: 'hideBlog', title: 'Masquer la section Blog', type: 'boolean', initialValue: false, group: 'layout', description: "Masque le bloc de carnet de voyage sur la page d'accueil." }),
    defineField({ name: 'hideSorties', title: 'Masquer la section Prochaines Sorties', type: 'boolean', initialValue: false, group: 'layout', description: "Masque le bloc des dates de départ planifiées sur la page d'accueil." }),
    defineField({ name: 'hideAdventure', title: 'Masquer la section Accompagnement Personnalisé', type: 'boolean', initialValue: false, group: 'layout', description: "Masque la section détaillant la philosophie et l'engagement du guide sur la page d'accueil." }),
    defineField({ name: 'featuredPostsLimit', title: "Limite d'articles de blog", type: 'number', initialValue: 3, group: 'layout', description: "Le nombre maximum d'articles à afficher dans la grille du blog.", validation: (Rule) => Rule.min(1).max(9) }),
  ],
})
