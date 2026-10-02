import { defineField, defineType } from 'sanity'
import { FileText } from 'lucide-react'
import { TagImagePickerInput } from '../components/TagImagePicker'
import { FAQPickerInput } from '../components/FAQPickerInput'

export const postType = defineType({
  name: 'post',
  title: 'Blog',
  type: 'document',
  icon: FileText,
  fields: [
    defineField({
      name: 'title',
      title: 'Titre (FranÃ§ais)',
      type: 'string',
    }),
    defineField({
      name: 'titleEn',
      title: 'Titre (Anglais)',
      type: 'string',
      description: 'Si vide, traduit automatiquement cÃ´tÃ© site. Utilisez "ðŸŒ Traduire EN" pour remplir.',
    }),
    defineField({
      name: 'slug',
      title: 'Slug (FranÃ§ais)',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
    }),
    defineField({
      name: 'slugEn',
      title: 'Slug (Anglais)',
      type: 'string',
      description: 'GÃ©nÃ©rÃ© automatiquement par "ðŸŒ Traduire EN". URL anglaise : /en/[slug-en]. Modifiable si besoin.',
    }),
    defineField({
      name: 'excerpt',
      title: 'Extrait (FranÃ§ais)',
      type: 'text',
      description: 'Un court rÃ©sumÃ© de l\'article pour la liste des blogs.',
      validation: (Rule) => Rule.max(200),
    }),
    defineField({
      name: 'excerptEn',
      title: 'Extrait (Anglais)',
      type: 'text',
      description: 'Version anglaise de l\'extrait. Si vide, l\'extrait FR est utilisÃ©.',
      validation: (Rule) => Rule.max(200),
    }),
    defineField({
      name: 'mainImage',
      title: 'Image principale',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'imageName',
          type: 'string',
          title: 'Nom personnalisÃ© / Titre de l\'image',
          description: 'Pour organiser ou nommer l\'image.',
        },
        {
          name: 'alt',
          type: 'string',
          title: 'Texte alternatif ALT (FranÃ§ais)',
          description: 'Pour le SEO et l\'accessibilitÃ©.',
        },
        {
          name: 'altEn',
          type: 'string',
          title: 'Texte alternatif ALT (Anglais)',
          description: 'Version anglaise du texte alt. Si vide, le texte FR est utilisÃ©.',
        }
      ]
    }),
    defineField({
      name: 'publishedAt',
      title: 'Date de publication',
      type: 'datetime',
    }),
    defineField({
      name: 'body',
      title: 'Corps',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H2', value: 'h2' },
            { title: 'H3', value: 'h3' },
            { title: 'CentrÃ©', value: 'blockCenter' },
            { title: 'JustifiÃ©', value: 'blockJustify' },
            { title: 'Droite', value: 'blockRight' },
            { title: 'Citation', value: 'blockquote' }
          ]
        },
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            { name: 'imageName', type: 'string', title: 'Nom / Titre' },
            { name: 'caption', type: 'string', title: 'LÃ©gende (FranÃ§ais)' },
            { name: 'captionEn', type: 'string', title: 'LÃ©gende (Anglais)' },
            { name: 'alt', type: 'string', title: 'ALT (FranÃ§ais)' },
            { name: 'altEn', type: 'string', title: 'ALT (Anglais)' },
          ],
        },
        {
          name: 'gallery',
          type: 'object',
          title: 'Galerie d\'images',
          fields: [
            {
              name: 'images',
              type: 'array',
              title: 'Images',
              of: [{
                type: 'image',
                options: { hotspot: true },
                fields: [
                  { name: 'imageName', type: 'string', title: 'Nom / Titre' },
                  { name: 'caption', type: 'string', title: 'LÃ©gende (FranÃ§ais)' },
                  { name: 'captionEn', type: 'string', title: 'LÃ©gende (Anglais)' },
                  { name: 'alt', type: 'string', title: 'ALT (FranÃ§ais)' },
                  { name: 'altEn', type: 'string', title: 'ALT (Anglais)' },
                ],
              }]
            }
          ]
        },
        {
          name: 'video',
          type: 'object',
          title: 'VidÃ©o',
          fields: [
            {
              name: 'url',
              type: 'url',
              title: 'URL de la vidÃ©o (YouTube, Vimeo, etc.)'
            }
          ]
        },
        {
          type: 'object',
          name: 'ctaBlock',
          title: 'CTA / Appel Ã  l\'action',
          fields: [
            { name: 'cta', type: 'reference', to: [{ type: 'cta' }], title: 'Choisir un CTA de la bibliothÃ¨que' }
          ],
          preview: {
            select: { title: 'cta.name' },
            prepare({ title }: any) {
              return { title: `ðŸ“£ CTA : ${title || '(non dÃ©fini)'}` }
            }
          }
        }
      ],
    }),
    defineField({
      name: 'bodyEn',
      title: 'Corps (Anglais)',
      type: 'array',
      description: 'Version anglaise du corps de l\'article. Si vide, l\'article s\'affiche en franÃ§ais. Utilisez "ðŸŒ Traduire EN".',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H2', value: 'h2' },
            { title: 'H3', value: 'h3' },
            { title: 'CentrÃ©', value: 'blockCenter' },
            { title: 'JustifiÃ©', value: 'blockJustify' },
            { title: 'Droite', value: 'blockRight' },
            { title: 'Citation', value: 'blockquote' }
          ]
        },
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            { name: 'imageName', type: 'string', title: 'Nom / Titre' },
            { name: 'caption', type: 'string', title: 'LÃ©gende (FranÃ§ais)' },
            { name: 'captionEn', type: 'string', title: 'LÃ©gende (Anglais)' },
            { name: 'alt', type: 'string', title: 'ALT (FranÃ§ais)' },
            { name: 'altEn', type: 'string', title: 'ALT (Anglais)' },
          ],
        },
        {
          name: 'gallery',
          type: 'object',
          title: 'Galerie d\'images',
          fields: [
            {
              name: 'images',
              type: 'array',
              title: 'Images',
              of: [{
                type: 'image',
                options: { hotspot: true },
                fields: [
                  { name: 'imageName', type: 'string', title: 'Nom / Titre' },
                  { name: 'caption', type: 'string', title: 'LÃ©gende (FranÃ§ais)' },
                  { name: 'captionEn', type: 'string', title: 'LÃ©gende (Anglais)' },
                  { name: 'alt', type: 'string', title: 'ALT (FranÃ§ais)' },
                  { name: 'altEn', type: 'string', title: 'ALT (Anglais)' },
                ],
              }]
            }
          ]
        },
        {
          name: 'video',
          type: 'object',
          title: 'VidÃ©o',
          fields: [
            {
              name: 'url',
              type: 'url',
              title: 'URL de la vidÃ©o (YouTube, Vimeo, etc.)'
            }
          ]
        },
        {
          type: 'object',
          name: 'ctaBlock',
          title: 'CTA / Appel Ã  l\'action',
          fields: [
            { name: 'cta', type: 'reference', to: [{ type: 'cta' }], title: 'Choisir un CTA de la bibliothÃ¨que' }
          ],
          preview: {
            select: { title: 'cta.name' },
            prepare({ title }: any) {
              return { title: `ðŸ“£ CTA : ${title || '(non dÃ©fini)'}` }
            }
          }
        }
      ],
    }),
    defineField({
      name: 'activityType',
      title: 'CatÃ©gorie (Type d\'activitÃ©)',
      type: 'reference',
      to: [{ type: 'activity' }],
      description: 'CatÃ©gorie principale de cet article â€” utilisÃ©e pour afficher les articles pertinents sur les pages sÃ©jour.',
    }),
    defineField({
      name: 'relatedSejour',
      title: 'SÃ©jour liÃ©',
      type: 'reference',
      to: [{ type: 'sejour' }],
      description: 'Associer cet article Ã  un sÃ©jour pour l\'afficher sur la page du sÃ©jour',
    }),
    defineField({
      name: 'tags',
      title: 'Tags / CatÃ©gories',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'tag' }], weak: true }],
      description: 'Tags et catÃ©gories associÃ©s Ã  cet article'
    }),
    defineField({
      name: 'gallery',
      title: 'Galerie photos (Bas d\'article)',
      type: 'array',
      options: {
        layout: 'grid',
      },
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            { name: 'imageName', type: 'string', title: 'Nom / Titre' },
            { name: 'caption', type: 'string', title: 'LÃ©gende (FranÃ§ais)' },
            { name: 'captionEn', type: 'string', title: 'LÃ©gende (Anglais)' },
            { name: 'alt', type: 'string', title: 'ALT (FranÃ§ais)' },
            { name: 'altEn', type: 'string', title: 'ALT (Anglais)' },
          ],
        },
      ],
      description: 'Optionnel. Galerie de photos qui s\'affichera automatiquement en bas de l\'article.',
    }),
    defineField({
      name: 'tagBrowsedImages',
      title: 'Galerie â€” SÃ©lection par tag',
      description: 'Choisissez un Media Tag ou un tag d\'article, parcourez les photos et cliquez pour les sÃ©lectionner.',
      type: 'array',
      of: [
        {
          type: 'image',
          fields: [
            defineField({ name: 'imageName', type: 'string', title: 'Nom / Titre' }),
            defineField({ name: 'alt', type: 'string', title: 'ALT (FranÃ§ais)' }),
            defineField({ name: 'altEn', type: 'string', title: 'ALT (Anglais)' }),
          ],
        },
      ],
      components: { input: TagImagePickerInput },
    }),
    defineField({
      name: 'mediaManager',
      title: 'Gestion des textes ALT & LÃ©gendes',
      type: 'object',
      fields: [
        defineField({
          name: 'info',
          title: 'Notice',
          type: 'string',
          readOnly: true,
          description: 'Module d\'administration des mÃ©dias'
        })
      ],
      components: {
        input: PostMediaManagerInput
      }
    }),
    defineField({
      name: 'topo',
      title: 'DonnÃ©es pratiques / Topo',
      description: 'DonnÃ©es techniques, topos de la course, informations pratiques.',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H2', value: 'h2' },
            { title: 'H3', value: 'h3' },
            { title: 'CentrÃ©', value: 'blockCenter' },
            { title: 'JustifiÃ©', value: 'blockJustify' },
            { title: 'Droite', value: 'blockRight' },
            { title: 'Citation', value: 'blockquote' }
          ]
        },
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            { name: 'imageName', type: 'string', title: 'Nom / Titre' },
            { name: 'caption', type: 'string', title: 'LÃ©gende (FranÃ§ais)' },
            { name: 'captionEn', type: 'string', title: 'LÃ©gende (Anglais)' },
            { name: 'alt', type: 'string', title: 'ALT (FranÃ§ais)' },
            { name: 'altEn', type: 'string', title: 'ALT (Anglais)' },
          ]
        }
      ]
    }),
    defineField({
      name: 'faqs',
      title: 'FAQ de l\'article',
      description: 'SÃ©lectionnez des FAQ spÃ©cifiques Ã  afficher sur cet article de blog. Filtrez par catÃ©gorie pour retrouver vos questions plus facilement.',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'faq' }], weak: true }],
      components: { input: FAQPickerInput },
    }),
    defineField({
      name: 'relatedActivities',
      title: 'ActivitÃ©s & SÃ©jours associÃ©s',
      description: 'Liez des sÃ©jours recommandÃ©s pour faire du maillage interne (affichÃ© aprÃ¨s le CTA).',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'sejour' }] }],
    }),
    defineField({
      name: 'ctaText',
      title: 'Texte d\'appel Ã  l\'action (FranÃ§ais)',
      type: 'string',
      description: 'Optionnel. Laisse par dÃ©faut si vide : "Toi aussi tu souhaites vivre ce type d\'aventure ? Contacte-moi !"',
    }),
    defineField({
      name: 'ctaTextEn',
      title: 'Texte d\'appel Ã  l\'action (Anglais)',
      type: 'string',
      description: 'Optionnel. Laisse par dÃ©faut si vide : "Want to experience this type of adventure too? Contact me!"',
    }),
    defineField({
      name: 'ctaLink',
      title: 'Lien d\'appel Ã  l\'action',
      type: 'string',
      initialValue: '/contact',
      description: 'Le lien vers lequel redirige le bouton d\'appel Ã  l\'action.',
    }),
    defineField({
      name: 'metaTitle',
      title: 'ðŸ” SEO â€” Titre (balise title) FR',
      type: 'string',
      description: 'Optionnel. Remplace le titre auto-gÃ©nÃ©rÃ© dans Google. IdÃ©alement < 60 caractÃ¨res.',
    }),
    defineField({
      name: 'metaDescription',
      title: 'ðŸ” SEO â€” Description (meta) FR',
      type: 'text',
      rows: 3,
      description: 'Optionnel. RÃ©sumÃ© affichÃ© sous le titre dans Google. IdÃ©alement 120â€“160 caractÃ¨res.',
    }),
    defineField({
      name: 'metaTitleEn',
      title: 'ðŸ” SEO â€” Titre (balise title) EN',
      type: 'string',
      description: 'Optionnel. Version anglaise du titre SEO.',
    }),
    defineField({
      name: 'metaDescriptionEn',
      title: 'ðŸ” SEO â€” Description (meta) EN',
      type: 'text',
      rows: 3,
      description: 'Optionnel. Version anglaise de la meta description.',
    }),
    defineField({
      name: 'reviewed',
      title: 'âœ… Article relu / validÃ©',
      type: 'boolean',
      initialValue: false,
      description: 'Cochez quand l\'article a Ã©tÃ© relu et validÃ© pour publication.',
    }),
  ],
  orderings: [
    {
      title: 'Relus en premier',
      name: 'reviewedFirst',
      by: [
        { field: 'reviewed', direction: 'desc' },
        { field: 'publishedAt', direction: 'desc' },
      ],
    },
    {
      title: 'Date (rÃ©cent en premier)',
      name: 'publishedAtDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }],
    },
  ],
  preview: {
    select: {
      title: 'title',
      media: 'mainImage',
      reviewed: 'reviewed',
      date: 'publishedAt',
    },
    prepare({ title, media, reviewed, date }: any) {
      const dateStr = date ? new Date(date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }) : ''
      return {
        title: `${reviewed ? 'âœ…' : 'â¬œ'} ${title || 'Sans titre'}`,
        subtitle: dateStr,
        media,
      }
    },
  },
})

// Custom React component to manage and edit ALT texts/captions of all images inside the post
import { Card, Stack, Text, TextInput, Label, Flex } from '@sanity/ui'
import { useFormValue, set, unset, useClient, PatchEvent } from 'sanity'
import { useEffect, useState } from 'react'
import { urlFor } from '@/sanity/lib/image'

function safeImgUrl(asset: any, w: number, h: number): string | null {
  try {
    if (!asset?._ref) return null
    return urlFor(asset).width(w).height(h).url()
  } catch { return null }
}

function PostMediaManagerInput(props: any) {
  const client = useClient({ apiVersion: '2023-01-01' })
  const [assetAlts, setAssetAlts] = useState<Record<string, string>>({})
  const [assetNames, setAssetNames] = useState<Record<string, string>>({})
  const [localValues, setLocalValues] = useState<Record<string, string>>({})
  const documentId = useFormValue(['_id']) as string

  // Read fields from the form values
  const body = useFormValue(['body']) as any[] | undefined
  const gallery = useFormValue(['gallery']) as any[] | undefined

  // Find all images in the Portable Text body
  const bodyImages = (body || []).filter((block: any) => block._type === 'image')

  // Find all inline galleries in the Portable Text body and extract their images
  const bodyGalleryImages: any[] = []
  ;(body || []).forEach((block: any) => {
    if (block._type === 'gallery' && Array.isArray(block.images)) {
      block.images.forEach((img: any, idx: number) => {
        bodyGalleryImages.push({
          ...img,
          parentBlockKey: block._key,
          index: idx
        })
      })
    }
  })

  // Find all images in the gallery array
  const galleryImages = gallery || []

  // Fetch alt texts from Sanity Media Library on mount or updates
  useEffect(() => {
    const ids: string[] = []
    bodyImages.forEach(img => {
      if (img.asset?._ref) ids.push(img.asset._ref)
    })
    bodyGalleryImages.forEach(img => {
      if (img.asset?._ref) ids.push(img.asset._ref)
    })
    galleryImages.forEach(img => {
      if (img.asset?._ref) ids.push(img.asset._ref)
    })

    if (ids.length === 0) return

    client.fetch(`*[_id in $ids]{_id, altText, originalFilename}`, { ids })
      .then((results: any[]) => {
        const alts: Record<string, string> = {}
        const names: Record<string, string> = {}
        results.forEach(res => {
          if (res.altText) {
            alts[res._id] = res.altText
          }
          if (res.originalFilename) {
            names[res._id] = res.originalFilename
          }
        })
        setAssetAlts(alts)
        setAssetNames(names)
      })
      .catch(console.error)
  }, [body, gallery, client])

  // Sync existing document values into local state (only for keys not yet locally modified)
  useEffect(() => {
    setLocalValues(prev => {
      const updates: Record<string, string> = {}
      const sync = (img: any, prefix: string) => {
        if (!img._key) return
        if (img.imageName && !(`${prefix}${img._key}_name` in prev)) updates[`${prefix}${img._key}_name`] = img.imageName
        if (img.caption && !(`${prefix}${img._key}_caption` in prev)) updates[`${prefix}${img._key}_caption`] = img.caption
        if (img.alt && !(`${prefix}${img._key}_alt` in prev)) updates[`${prefix}${img._key}_alt`] = img.alt
      }
      bodyImages.forEach(img => sync(img, ''))
      bodyGalleryImages.forEach(img => sync(img, 'bgi_'))
      galleryImages.forEach(img => sync(img, 'gal_'))
      return Object.keys(updates).length ? { ...prev, ...updates } : prev
    })
  }, [body, gallery])

  // Patch a field at the document level (bypasses props.onChange which is scoped to mediaManager)
  const buildPath = (segments: any[]): string =>
    segments.map((seg, i) => {
      if (typeof seg === 'string') return i === 0 ? seg : `.${seg}`
      if (typeof seg === 'object' && '_key' in seg) return `[_key=="${seg._key}"]`
      if (typeof seg === 'number') return `[${seg}]`
      return ''
    }).join('')

  const handleUpdate = (localKey: string, value: string, pathSegments: any[], assetRef?: string) => {
    setLocalValues(prev => ({ ...prev, [localKey]: value }))
    if (!documentId || !client) return
    const pathStr = buildPath(pathSegments)
    client.patch(documentId).set({ [pathStr]: value }).commit().catch(console.error)
    // Sync alt text to the media library asset (sanity.imageAsset)
    if (localKey.endsWith('_alt') && assetRef) {
      client.patch(assetRef).set({ altText: value }).commit().catch(console.error)
    }
  }

  return (
    <Card padding={4} radius={3} shadow={1} tone="inherit" border>
      <Stack space={4}>
        <Text size={2} weight="bold">ðŸ“¸ Gestion des Textes Alternatifs & LÃ©gendes de l'Article</Text>
        <Text size={1} muted>Modifiez rapidement les textes descriptifs (ALT) et lÃ©gendes de toutes les images utilisÃ©es dans cet article pour optimiser votre SEO.</Text>

        {/* 2. Images du corps de l'article */}
        <Card border padding={3} radius={2}>
          <Stack space={3}>
            <Text size={1} weight="bold">ðŸ“ Images du corps de l'article (Texte riche)</Text>
            {bodyImages.length === 0 ? (
              <Text size={1} muted>Aucune image insÃ©rÃ©e dans le texte de l'article.</Text>
            ) : (
              <Stack space={4}>
                {bodyImages.map((img: any, idx: number) => (
                  <Flex key={img._key || idx} gap={3} align="center" style={{ borderBottom: '1px solid var(--card-border-color)', paddingBottom: '12px' }}>
                    <div style={{ width: '80px', height: '60px', position: 'relative', overflow: 'hidden', borderRadius: '4px', background: '#000' }}>
                      {safeImgUrl(img.asset, 160, 120) && (<img src={safeImgUrl(img.asset, 160, 120) || ''} 
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                        />
                      )}
                    </div>
                    <Stack space={3} flex={1}>
                      <div>
                        <Label size={0}>Nom / Titre de l'image :</Label>
                        <TextInput
                          value={localValues[`${img._key}_name`] ?? (img.imageName || '')}
                          onChange={(e: any) => handleUpdate(`${img._key}_name`, e.target.value, ['body', { _key: img._key }, 'imageName'])}
                          placeholder={img.asset?._ref && assetNames[img.asset._ref] ? assetNames[img.asset._ref].replace(/\.[^/.]+$/, "") : "Nom de l'image..."}
                        />
                      </div>
                      <div>
                        <Label size={0}>LÃ©gende :</Label>
                        <TextInput
                          value={localValues[`${img._key}_caption`] ?? (img.caption || '')}
                          onChange={(e: any) => handleUpdate(`${img._key}_caption`, e.target.value, ['body', { _key: img._key }, 'caption'])}
                          placeholder="LÃ©gende affichÃ©e sous la photo..."
                        />
                      </div>
                      <div>
                        <Label size={0}>Texte alternatif (ALT) :</Label>
                        <TextInput
                          value={localValues[`${img._key}_alt`] ?? (img.alt || '')}
                          onChange={(e: any) => handleUpdate(`${img._key}_alt`, e.target.value, ['body', { _key: img._key }, 'alt'], img.asset?._ref)}
                          placeholder={img.asset?._ref ? assetAlts[img.asset._ref] : "Description SEO de l'image..."}
                        />
                      </div>
                    </Stack>
                  </Flex>
                ))}
              </Stack>
            )}
          </Stack>
        </Card>

        {/* 3. Images des Galeries du corps de l'article */}
        <Card border padding={3} radius={2}>
          <Stack space={3}>
            <Text size={1} weight="bold">ðŸ“š Images des Galeries du corps de l'article (Texte riche)</Text>
            {bodyGalleryImages.length === 0 ? (
              <Text size={1} muted>Aucune galerie d'images insÃ©rÃ©e dans le texte de l'article.</Text>
            ) : (
              <Stack space={4}>
                {bodyGalleryImages.map((img: any, idx: number) => {
                  const imagePath = ['body', { _key: img.parentBlockKey }, 'images', img._key ? { _key: img._key } : img.index];
                  return (
                    <Flex key={img._key || idx} gap={3} align="center" style={{ borderBottom: '1px solid var(--card-border-color)', paddingBottom: '12px' }}>
                      <div style={{ width: '80px', height: '60px', position: 'relative', overflow: 'hidden', borderRadius: '4px', background: '#000' }}>
                        {safeImgUrl(img.asset, 160, 120) && (<img src={safeImgUrl(img.asset, 160, 120) || ''} 
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                          />
                        )}
                      </div>
                       <Stack space={3} flex={1}>
                        <div>
                          <Label size={0}>Nom / Titre de l'image :</Label>
                          <TextInput
                            value={localValues[`bgi_${img._key}_name`] ?? (img.imageName || '')}
                            onChange={(e: any) => handleUpdate(`bgi_${img._key}_name`, e.target.value, [...imagePath, 'imageName'])}
                            placeholder={img.asset?._ref && assetNames[img.asset._ref] ? assetNames[img.asset._ref].replace(/\.[^/.]+$/, "") : "Nom de l'image..."}
                          />
                        </div>
                        <div>
                          <Label size={0}>LÃ©gende :</Label>
                          <TextInput
                            value={localValues[`bgi_${img._key}_caption`] ?? (img.caption || '')}
                            onChange={(e: any) => handleUpdate(`bgi_${img._key}_caption`, e.target.value, [...imagePath, 'caption'])}
                            placeholder="LÃ©gende de la photo dans la galerie..."
                          />
                        </div>
                        <div>
                          <Label size={0}>Texte alternatif (ALT) :</Label>
                          <TextInput
                            value={localValues[`bgi_${img._key}_alt`] ?? (img.alt || '')}
                            onChange={(e: any) => handleUpdate(`bgi_${img._key}_alt`, e.target.value, [...imagePath, 'alt'], img.asset?._ref)}
                            placeholder={img.asset?._ref ? assetAlts[img.asset._ref] : "Description SEO de l'image..."}
                          />
                        </div>
                      </Stack>
                    </Flex>
                  );
                })}
              </Stack>
            )}
          </Stack>
        </Card>

        {/* 4. Galerie Photos (Bas d'article) */}
        <Card border padding={3} radius={2}>
          <Stack space={3}>
            <Text size={1} weight="bold">ðŸ–¼ï¸ Images de la Galerie (Bas d'article)</Text>
            {galleryImages.length === 0 ? (
              <Text size={1} muted>Aucune image dans la galerie de bas d'article.</Text>
            ) : (
              <Stack space={4}>
                {galleryImages.map((img: any, idx: number) => (
                  <Flex key={img._key || idx} gap={3} align="center" style={{ borderBottom: '1px solid var(--card-border-color)', paddingBottom: '12px' }}>
                    <div style={{ width: '80px', height: '60px', position: 'relative', overflow: 'hidden', borderRadius: '4px', background: '#000' }}>
                      {safeImgUrl(img.asset, 160, 120) && (<img src={safeImgUrl(img.asset, 160, 120) || ''} 
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                        />
                      )}
                    </div>
                     <Stack space={3} flex={1}>
                      <div>
                        <Label size={0}>Nom / Titre de l'image :</Label>
                        <TextInput
                          value={localValues[`gal_${img._key}_name`] ?? (img.imageName || '')}
                          onChange={(e: any) => handleUpdate(`gal_${img._key}_name`, e.target.value, ['gallery', { _key: img._key }, 'imageName'])}
                          placeholder={img.asset?._ref && assetNames[img.asset._ref] ? assetNames[img.asset._ref].replace(/\.[^/.]+$/, "") : "Nom de l'image..."}
                        />
                      </div>
                      <div>
                        <Label size={0}>LÃ©gende :</Label>
                        <TextInput
                          value={localValues[`gal_${img._key}_caption`] ?? (img.caption || '')}
                          onChange={(e: any) => handleUpdate(`gal_${img._key}_caption`, e.target.value, ['gallery', { _key: img._key }, 'caption'])}
                          placeholder="LÃ©gende affichÃ©e sous la photo..."
                        />
                      </div>
                      <div>
                        <Label size={0}>Texte alternatif (ALT) :</Label>
                        <TextInput
                          value={localValues[`gal_${img._key}_alt`] ?? (img.alt || '')}
                          onChange={(e: any) => handleUpdate(`gal_${img._key}_alt`, e.target.value, ['gallery', { _key: img._key }, 'alt'], img.asset?._ref)}
                          placeholder={img.asset?._ref ? assetAlts[img.asset._ref] : "Description SEO de l'image..."}
                        />
                      </div>
                    </Stack>
                  </Flex>
                ))}
              </Stack>
            )}
          </Stack>
        </Card>

      </Stack>
    </Card>
  )
}


