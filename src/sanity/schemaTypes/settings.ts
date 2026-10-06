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
    { name: 'homepage', title: "Page d'Accueil" },
    { name: 'design', title: 'Design & Apparence' },
    { name: 'levels', title: 'Icônes de niveau' },
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
      type: 'string',
      initialValue: 'montagne2026',
      group: 'general',
    }),
    defineField({
      name: 'logoLight',
      title: 'Logo (Version Sombre / Texte blanc)',
      type: 'image',
      options: { hotspot: true },
      group: 'general',
    }),
    defineField({
      name: 'logoDark',
      title: 'Logo (Version Claire / Texte noir)',
      type: 'image',
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
      group: 'banner',
    }),

    // PARTNERS SECTION
    defineField({
      name: 'hidePartners',
      title: 'Masquer la section Partenaires',
      type: 'boolean',
      initialValue: false,
      group: 'partners',
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
      group: 'social',
    }),
    defineField({
      name: 'facebook',
      title: 'Lien Facebook',
      type: 'url',
      group: 'social',
    }),
    defineField({
      name: 'youtube',
      title: 'Lien YouTube',
      type: 'url',
      group: 'social',
    }),

    // CONTACT & WHATSAPP
    defineField({
      name: 'whatsappNumber',
      title: 'Numéro WhatsApp (Bouton flottant)',
      type: 'string',
      group: 'contact',
    }),
    defineField({
      name: 'whatsappText',
      title: 'Message WhatsApp pré-rempli (Français)',
      type: 'string',
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
    defineField({
      name: 'ressourcesBadge',
      title: 'Texte du badge (Français)',
      type: 'string',
      initialValue: 'RESSOURCES & CONSEILS',
      group: 'ressources',
    }),
    defineField({
      name: 'ressourcesBadgeEn',
      title: 'Texte du badge (Anglais)',
      type: 'string',
      initialValue: 'RESOURCES & ADVICE',
      group: 'ressources',
    }),
    defineField({
      name: 'ressourcesHeaderAlign',
      title: 'Alignement du header',
      type: 'string',
      initialValue: 'left',
      options: {
        list: [
          { title: 'Gauche', value: 'left' },
          { title: 'Centré', value: 'center' },
        ],
        layout: 'radio',
      },
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
      type: 'array',
      of: descriptionBlocks,
      group: 'sejoursSettings',
    }),
    defineField({
      name: 'sejourSidebarNoticeEn',
      title: 'Notice calendrier séjours (Anglais)',
      type: 'array',
      of: descriptionBlocks,
      group: 'sejoursSettings',
    }),

    // PAGE D'ACCUEIL
    defineField({
      name: 'homeFaqCategories',
      title: 'Catégories FAQ à afficher sur l\'accueil',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'faqCategory' }], weak: true }],
      group: 'homepage',
    }),

    // DESIGN & APPARENCE
    defineField({
      name: 'bgColorLight',
      title: 'Couleur de fond — Mode Clair (Hex)',
      type: 'string',
      group: 'design',
    }),
    defineField({
      name: 'bgColorDark',
      title: 'Couleur de fond — Mode Sombre (Hex)',
      type: 'string',
      group: 'design',
    }),
    defineField({
      name: 'accentColor',
      title: 'Couleur d\'accentuation (Hex)',
      type: 'string',
      initialValue: '#0ea5e9',
      group: 'design',
    }),
    defineField({
      name: 'highlightColor',
      title: 'Couleur de mise en valeur (Hex)',
      type: 'string',
      initialValue: '#f97316',
      group: 'design',
    }),
    defineField({
      name: 'btnHoverColor',
      title: 'Couleur de survol des boutons (Hex)',
      type: 'string',
      group: 'design',
    }),
    defineField({
      name: 'textColorLight',
      title: 'Couleur du texte - Mode Clair (Hex)',
      type: 'string',
      group: 'design',
    }),
    defineField({
      name: 'titleColorLight',
      title: 'Couleur des titres - Mode Clair (Hex)',
      type: 'string',
      group: 'design',
    }),
    defineField({
      name: 'textColorDark',
      title: 'Couleur du texte - Mode Sombre (Hex)',
      type: 'string',
      group: 'design',
    }),
    defineField({
      name: 'titleColorDark',
      title: 'Couleur des titres - Mode Sombre (Hex)',
      type: 'string',
      group: 'design',
    }),
    defineField({
      name: 'fontFamily',
      title: 'Police du site',
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

    // ICÔNES DE NIVEAU
    defineField({
      name: 'technicalLevelIcons',
      title: 'Niveau technique — Icônes',
      type: 'array',
      group: 'levels',
      of: [{ type: 'levelIcon' }],
    }),
    defineField({
      name: 'physicalLevelIcons',
      title: 'Niveau physique — Icônes',
      type: 'array',
      group: 'levels',
      of: [{ type: 'levelIcon' }],
    }),
    defineField({
      name: 'levelIconsShowText',
      title: 'Afficher aussi le texte à côté de l\'icône',
      type: 'boolean',
      group: 'levels',
      initialValue: true,
    }),
  ],
})

export const levelIconType = defineType({
  name: 'levelIcon',
  title: 'Niveau',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Libellé du niveau (FR)',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: 'labelEn', title: 'Libellé affiché (EN)', type: 'string' }),
    defineField({
      name: 'icon',
      title: 'Icône',
      type: 'image',
      options: { accept: 'image/svg+xml,image/png,image/webp' },
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: { title: 'label', subtitle: 'labelEn', media: 'icon' },
  },
})
