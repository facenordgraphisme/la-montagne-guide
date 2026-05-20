import { defineField, defineType } from 'sanity'
import { Settings } from 'lucide-react'

export const settingsType = defineType({
  name: 'settings',
  title: 'Paramètres Globaux',
  type: 'document',
  icon: Settings,
  groups: [
    { name: 'general', title: 'Général & Logo' },
    { name: 'banner', title: "Bandeau d'Annonce" },
    { name: 'partners', title: "Partenaires" },
    { name: 'social', title: 'Réseaux Sociaux' },
    { name: 'contact', title: 'Contact & WhatsApp' },
    { name: 'footer', title: 'Footer (Pied de page)' },
    { name: 'seo', title: 'Référencement (SEO)' },
  ],
  fields: [
    // GENERAL & LOGO
    defineField({
      name: 'siteName',
      title: 'Nom du site',
      type: 'string',
      initialValue: 'La Montagne Guide',
      group: 'general',
    }),
    defineField({
      name: 'logoLight',
      title: 'Logo (Version Sombre / Texte blanc)',
      type: 'image',
      description: 'Affiché sur fond sombre. Si laissé vide, le logo par défaut est utilisé.',
      options: { hotspot: true },
      group: 'general',
    }),
    defineField({
      name: 'logoDark',
      title: 'Logo (Version Claire / Texte noir)',
      type: 'image',
      description: 'Affiché sur fond clair. Si laissé vide, le logo par défaut est utilisé.',
      options: { hotspot: true },
      group: 'general',
    }),

    // BANNER SECTION
    defineField({
      name: 'showBanner',
      title: "Activer le bandeau d'annonce",
      type: 'boolean',
      initialValue: false,
      group: 'banner',
    }),
    defineField({
      name: 'bannerText',
      title: "Texte de l'annonce (Français)",
      type: 'string',
      group: 'banner',
    }),
    defineField({
      name: 'bannerTextEn',
      title: "Texte de l'annonce (Anglais)",
      type: 'string',
      group: 'banner',
    }),
    defineField({
      name: 'bannerColor',
      title: "Couleur du bandeau",
      type: 'string',
      initialValue: 'cyan',
      options: {
        list: [
          { title: 'Turquoise glacé', value: 'cyan' },
          { title: 'Alerte orange', value: 'orange' },
          { title: 'Bleu marine sobre', value: 'navy' },
        ],
      },
      group: 'banner',
    }),
    defineField({
      name: 'bannerLink',
      title: "Lien de redirection (Optionnel)",
      type: 'string',
      description: 'Ex: /prochaines-sorties ou un lien externe.',
      group: 'banner',
    }),

    // PARTNERS SECTION
    defineField({
      name: 'hidePartners',
      title: 'Masquer la section Partenaires',
      type: 'boolean',
      initialValue: false,
      group: 'partners',
      description: "Cochez cette case pour masquer le défilement des logos partenaires sur tout le site (page d'accueil et page guide).",
    }),
    defineField({
      name: 'partners',
      title: "Marques partenaires",
      type: 'array',
      group: 'partners',
      of: [
        {
          type: 'object',
          name: 'partner',
          title: 'Partenaire',
          fields: [
            { name: 'name', title: 'Nom de la marque', type: 'string' },
            { name: 'logo', title: 'Logo (PNG transparent ou SVG)', type: 'image' },
            { name: 'link', title: 'Lien du site', type: 'url' },
          ],
          preview: {
            select: {
              title: 'name',
              media: 'logo',
            },
          },
        },
      ],
    }),

    // SOCIAL NETWORKS
    defineField({
      name: 'instagram',
      title: 'Lien Instagram',
      type: 'url',
      description: 'Ex: https://www.instagram.com/moncompte',
      group: 'social',
    }),
    defineField({
      name: 'facebook',
      title: 'Lien Facebook',
      type: 'url',
      description: 'Ex: https://www.facebook.com/moncompte',
      group: 'social',
    }),
    defineField({
      name: 'youtube',
      title: 'Lien YouTube',
      type: 'url',
      description: 'Ex: https://www.youtube.com/@moncompte',
      group: 'social',
    }),

    // CONTACT & WHATSAPP
    defineField({
      name: 'whatsappNumber',
      title: 'Numéro WhatsApp (Bouton flottant)',
      type: 'string',
      description: 'Le numéro de téléphone au format international sans le + ni le 0 (ex: 33675079708). Utilisé pour le bouton de discussion instantanée.',
      group: 'contact',
    }),
    defineField({
      name: 'whatsappText',
      title: 'Message WhatsApp pré-rempli (Français)',
      type: 'string',
      description: 'Message par défaut envoyé lors du clic (ex: Bonjour Nicolas, je souhaiterais avoir des informations...)',
      group: 'contact',
    }),
    defineField({
      name: 'whatsappTextEn',
      title: 'Message WhatsApp pré-rempli (Anglais)',
      type: 'string',
      group: 'contact',
    }),
    defineField({
      name: 'email',
      title: 'Adresse email',
      type: 'string',
      initialValue: 'draperinicolas@hotmail.com',
      group: 'contact',
    }),
    defineField({
      name: 'phone',
      title: 'Numéro de téléphone',
      type: 'string',
      initialValue: '06 75 07 97 08',
      group: 'contact',
    }),
    defineField({
      name: 'address',
      title: 'Adresse postale',
      type: 'string',
      initialValue: 'Champcella, Hautes-Alpes',
      group: 'contact',
    }),

    // FOOTER
    defineField({
      name: 'footerDescription',
      title: 'Texte court du Footer (Français)',
      type: 'text',
      rows: 3,
      initialValue: "Vivez l'exceptionnel en altitude avec un guide passionné. Sécurité, aventure et respect de la nature.",
      group: 'footer',
    }),
    defineField({
      name: 'footerDescriptionEn',
      title: 'Texte court du Footer (Anglais)',
      type: 'text',
      rows: 3,
      group: 'footer',
    }),
    defineField({
      name: 'copyright',
      title: 'Texte de Copyright',
      type: 'string',
      initialValue: 'La Montagne Guide. Tous droits réservés.',
      group: 'footer',
    }),

    // SEO
    defineField({
      name: 'seoTitle',
      title: 'Titre SEO de base (Français)',
      type: 'string',
      description: 'Le titre du site affiché sur Google (ex: Nicolas Draperi - Guide de Haute Montagne Ecrins).',
      group: 'seo',
    }),
    defineField({
      name: 'seoTitleEn',
      title: 'Titre SEO de base (Anglais)',
      type: 'string',
      group: 'seo',
    }),
    defineField({
      name: 'seoDescription',
      title: 'Description SEO générale (Français)',
      type: 'text',
      rows: 3,
      description: 'Le texte descriptif affiché sous le titre dans les résultats Google.',
      group: 'seo',
    }),
    defineField({
      name: 'seoDescriptionEn',
      title: 'Description SEO générale (Anglais)',
      type: 'text',
      rows: 3,
      group: 'seo',
    }),
    defineField({
      name: 'seoImage',
      title: 'Image de partage social (Open Graph)',
      type: 'image',
      description: 'L\'image affichée lors du partage du lien sur les réseaux sociaux (Facebook, LinkedIn, Twitter). Dimension idéale : 1200x630px.',
      group: 'seo',
    }),
  ],
})
