import { defineField, defineType } from 'sanity'
import { Settings } from 'lucide-react'

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
    { name: 'activities', title: 'Page Activités' },
    { name: 'sorties', title: 'Page Sorties' },
    { name: 'ressources', title: 'Page Ressources' },
    { name: 'tarifs', title: 'Page Tarifs' },
    { name: 'menu', title: 'Menu / Navigation' },
    { name: 'sejoursSettings', title: 'Page Séjours' },
    { name: 'design', title: 'Design & Apparence' },
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
      name: 'clientPasscode',
      title: 'Code d\'accès client (Témoignages)',
      description: 'Le mot de passe confidentiel à donner à vos clients pour qu\'ils puissent laisser un commentaire sur votre blog (ex: guide2026).',
      type: 'string',
      initialValue: 'montagne2026',
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
      initialValue: '+33 (0)6 75 07 97 08',
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
    defineField({
      name: 'activitiesPageTitle',
      title: 'Titre de la page Activités (Français)',
      type: 'string',
      initialValue: 'NOS ACTIVITÉS',
      group: 'activities',
    }),
    defineField({
      name: 'activitiesPageTitleEn',
      title: 'Titre de la page Activités (Anglais)',
      type: 'string',
      initialValue: 'OUR ACTIVITIES',
      group: 'activities',
    }),
    defineField({
      name: 'activitiesPageDescription',
      title: 'Description de la page Activités (Français)',
      type: 'array',
      of: descriptionBlocks,
      group: 'activities',
    }),
    defineField({
      name: 'activitiesPageDescriptionEn',
      title: 'Description de la page Activités (Anglais)',
      type: 'array',
      of: descriptionBlocks,
      group: 'activities',
    }),
    defineField({
      name: 'activitiesOrder',
      title: 'Ordre d\'affichage des activités',
      description: 'Glissez-déposez les activités ci-dessous pour choisir l\'ordre d\'affichage global (sur la page d\'accueil, la page activités et la barre de navigation).',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'activity' }] }],
      group: 'activities',
    }),

    // PAGE SORTIES
    defineField({
      name: 'sortiesPageTitle',
      title: 'Titre de la page Sorties (Français)',
      type: 'string',
      initialValue: 'Prochaines sorties',
      group: 'sorties',
    }),
    defineField({
      name: 'sortiesPageTitleEn',
      title: 'Titre de la page Sorties (Anglais)',
      type: 'string',
      initialValue: 'Upcoming outings',
      group: 'sorties',
    }),
    defineField({
      name: 'sortiesPageDescription',
      title: 'Description de la page Sorties (Français)',
      type: 'array',
      of: descriptionBlocks,
      group: 'sorties',
    }),
    defineField({
      name: 'sortiesPageDescriptionEn',
      title: 'Description de la page Sorties (Anglais)',
      type: 'array',
      of: descriptionBlocks,
      group: 'sorties',
    }),

    // PAGE RESSOURCES
    defineField({
      name: 'hideRessourcesPage',
      title: 'Masquer la page Ressources',
      type: 'boolean',
      initialValue: false,
      group: 'ressources',
    }),
    defineField({
      name: 'ressourcesMenuTitle',
      title: 'Nom dans le menu (Français)',
      type: 'string',
      initialValue: 'Ressources & Guides',
      group: 'ressources',
    }),
    defineField({
      name: 'ressourcesMenuTitleEn',
      title: 'Nom dans le menu (Anglais)',
      type: 'string',
      initialValue: 'Resources & Guides',
      group: 'ressources',
    }),
    defineField({
      name: 'ressourcesPageTitle',
      title: 'Titre de la page (Français)',
      type: 'string',
      initialValue: 'Ressources & Guides de Montagne',
      group: 'ressources',
    }),
    defineField({
      name: 'ressourcesPageTitleEn',
      title: 'Titre de la page (Anglais)',
      type: 'string',
      initialValue: 'Mountain Resources & Guides',
      group: 'ressources',
    }),
    defineField({
      name: 'ressourcesPageDescription',
      title: 'Description (Français)',
      type: 'array',
      of: descriptionBlocks,
      group: 'ressources',
    }),
    defineField({
      name: 'ressourcesPageDescriptionEn',
      title: 'Description (Anglais)',
      type: 'array',
      of: descriptionBlocks,
      group: 'ressources',
    }),

    // PAGE TARIFS
    defineField({
      name: 'hideTarifsPage',
      title: 'Masquer la page Tarifs',
      type: 'boolean',
      initialValue: true,
      group: 'tarifs',
    }),
    defineField({
      name: 'tarifsMenuTitle',
      title: 'Nom dans le menu (Français)',
      type: 'string',
      initialValue: 'Tarifs',
      group: 'tarifs',
    }),
    defineField({
      name: 'tarifsMenuTitleEn',
      title: 'Nom dans le menu (Anglais)',
      type: 'string',
      initialValue: 'Rates',
      group: 'tarifs',
    }),
    defineField({
      name: 'tarifsPageTitle',
      title: 'Titre de la page (Français)',
      type: 'string',
      initialValue: 'Mes Tarifs',
      group: 'tarifs',
    }),
    defineField({
      name: 'tarifsPageTitleEn',
      title: 'Titre de la page (Anglais)',
      type: 'string',
      initialValue: 'My Rates',
      group: 'tarifs',
    }),
    defineField({
      name: 'tarifsPageDescription',
      title: 'Description de la page Tarifs (Français)',
      type: 'array',
      of: descriptionBlocks,
      group: 'tarifs',
    }),
    defineField({
      name: 'tarifsPageDescriptionEn',
      title: 'Description de la page Tarifs (Anglais)',
      type: 'array',
      of: descriptionBlocks,
      group: 'tarifs',
    }),
    defineField({
      name: 'tarifsContent',
      title: 'Contenu des Tarifs',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H2', value: 'h2' },
            { title: 'H3', value: 'h3' },
            { title: 'Centré', value: 'blockCenter' },
            { title: 'Justifié', value: 'blockJustify' },
            { title: 'Droite', value: 'blockRight' },
          ],
        }
      ],
      group: 'tarifs',
    }),

    // MENU CUSTOMIZATION
    defineField({
      name: 'menuActivities',
      title: 'Intitulé "Activités" (Français)',
      type: 'string',
      initialValue: 'Activités',
      group: 'menu',
    }),
    defineField({
      name: 'menuActivitiesEn',
      title: 'Intitulé "Activités" (Anglais)',
      type: 'string',
      initialValue: 'Activities',
      group: 'menu',
    }),
    defineField({
      name: 'menuSorties',
      title: 'Intitulé "Sorties" (Français)',
      type: 'string',
      initialValue: 'Sorties',
      group: 'menu',
    }),
    defineField({
      name: 'menuSortiesEn',
      title: 'Intitulé "Sorties" (Anglais)',
      type: 'string',
      initialValue: 'Outings',
      group: 'menu',
    }),
    defineField({
      name: 'menuGuide',
      title: 'Intitulé "Le Guide" (Français)',
      type: 'string',
      initialValue: 'Le Guide',
      group: 'menu',
    }),
    defineField({
      name: 'menuGuideEn',
      title: 'Intitulé "Le Guide" (Anglais)',
      type: 'string',
      initialValue: 'The Guide',
      group: 'menu',
    }),
    defineField({
      name: 'menuBlog',
      title: 'Intitulé "Blog" (Français)',
      type: 'string',
      initialValue: 'Blog',
      group: 'menu',
    }),
    defineField({
      name: 'menuBlogEn',
      title: 'Intitulé "Blog" (Anglais)',
      type: 'string',
      initialValue: 'Blog',
      group: 'menu',
    }),

    // PAGE SEJOURS
    defineField({
      name: 'sejourSidebarNotice',
      title: 'Notice calendrier séjours (Français)',
      description: 'La notice d\'information affichée sous le calendrier de départ des séjours (Partage de sortie, Groupes sur mesure...).',
      type: 'array',
      of: descriptionBlocks,
      group: 'sejoursSettings',
    }),
    defineField({
      name: 'sejourSidebarNoticeEn',
      title: 'Notice calendrier séjours (Anglais)',
      description: 'La notice d\'information affichée sous le calendrier de départ des séjours (Partage de sortie, Groupes sur mesure...).',
      type: 'array',
      of: descriptionBlocks,
      group: 'sejoursSettings',
    }),

    // DESIGN & APPARENCE
    defineField({
      name: 'accentColor',
      title: 'Couleur d\'accentuation (Hex)',
      description: 'Couleur principale du site (ex: #0ea5e9 pour bleu, #22c55e pour vert). Laissez vide pour la couleur par défaut.',
      type: 'string',
      initialValue: '#0ea5e9',
      group: 'design',
    }),
    defineField({
      name: 'highlightColor',
      title: 'Couleur de mise en valeur (Hex)',
      description: 'Couleur des éléments mis en valeur (ex: #f97316 pour orange). Laissez vide pour la couleur par défaut.',
      type: 'string',
      initialValue: '#f97316',
      group: 'design',
    }),
    defineField({
      name: 'btnHoverColor',
      title: 'Couleur de survol des boutons (Hex)',
      description: 'Couleur du bouton au survol de la souris. Laissez vide pour la valeur par défaut.',
      type: 'string',
      group: 'design',
    }),
    defineField({
      name: 'textColorLight',
      title: 'Couleur du texte - Mode Clair (Hex)',
      description: 'Couleur par défaut du corps de texte sur fond clair (ex: #0b1121). Laissez vide pour défaut.',
      type: 'string',
      group: 'design',
    }),
    defineField({
      name: 'titleColorLight',
      title: 'Couleur des titres - Mode Clair (Hex)',
      description: 'Couleur des titres (H1, H2...) sur fond clair. Laissez vide pour défaut.',
      type: 'string',
      group: 'design',
    }),
    defineField({
      name: 'textColorDark',
      title: 'Couleur du texte - Mode Sombre (Hex)',
      description: 'Couleur par défaut du corps de texte sur fond sombre (ex: #f1f5f9). Laissez vide pour défaut.',
      type: 'string',
      group: 'design',
    }),
    defineField({
      name: 'titleColorDark',
      title: 'Couleur des titres - Mode Sombre (Hex)',
      description: 'Couleur des titres (H1, H2...) sur fond sombre. Laissez vide pour défaut.',
      type: 'string',
      group: 'design',
    }),
    defineField({
      name: 'fontFamily',
      title: 'Police du site',
      description: 'La police utilisée pour tous les textes du site. Laissez vide pour la police par défaut (Outfit).',
      type: 'string',
      group: 'design',
      options: {
        list: [
          { title: 'Outfit (moderne, par défaut)', value: 'outfit' },
          { title: 'Poppins (rond, chaleureux)', value: 'poppins' },
          { title: 'Montserrat (classique, élégant)', value: 'montserrat' },
          { title: 'Playfair Display (serif, prestige)', value: 'playfair' },
          { title: 'Inter (neutre, très lisible)', value: 'inter' },
        ],
      },
    }),
    defineField({
      name: 'fontScale',
      title: 'Taille du texte',
      description: 'Ajuste la taille de tous les textes du site (titres et paragraphes) de façon proportionnelle. Laissez vide pour la taille par défaut.',
      type: 'string',
      group: 'design',
      options: {
        list: [
          { title: 'Petit (90%)', value: '0.9' },
          { title: 'Normal (100%)', value: '1' },
          { title: 'Grand (110%)', value: '1.1' },
          { title: 'Très grand (120%)', value: '1.2' },
        ],
      },
    }),
  ],
})
