import { defineField, defineType } from 'sanity'
import { FileText } from 'lucide-react'
import { TagImagePickerInput, GalleryPickerInput } from '../components/TagImagePicker'
import { FAQPickerInput } from '../components/FAQPickerInput'

export const postType = defineType({
  name: 'post',
  title: 'Blog',
  type: 'document',
  icon: FileText,
  fieldsets: [
    { name: 'fsTitle', title: 'Titre', options: { columns: 2 } },
    { name: 'fsExcerpt', title: 'Extrait', options: { columns: 2 } },
    { name: 'fsSeoTitle', title: '🔍 SEO — Titre', options: { columns: 2 } },
  ],
  fields: [
    defineField({
      name: 'isHidden',
      title: 'Masquer la page sur le site',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'title', fieldset: 'fsTitle',
      title: 'Titre (Français)',
      type: 'string',
    }),
    defineField({
      name: 'titleEn', fieldset: 'fsTitle',
      title: 'Titre (Anglais)',
      type: 'string',
    }),
    defineField({
      name: 'slug',
      title: 'Slug (Français)',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
    }),
    defineField({
      name: 'slugEn',
      title: 'Slug (Anglais)',
      type: 'string',
    }),
    defineField({
      name: 'excerpt', fieldset: 'fsExcerpt',
      title: 'Extrait (Français)',
      type: 'text',
      validation: (Rule) => [Rule.max(200), Rule.max(160).warning('Au-delà de 160 caractères, Google tronque la description.')],
    }),
    defineField({
      name: 'excerptEn', fieldset: 'fsExcerpt',
      title: 'Extrait (Anglais)',
      type: 'text',
      validation: (Rule) => [Rule.max(200), Rule.max(160).warning('Au-delà de 160 caractères, Google tronque la description.')],
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
          title: 'Nom personnalisé / Titre de l\'image',
          hidden: true,
        },
        {
          name: 'alt',
          type: 'string',
          title: 'Texte alternatif ALT (Français)',
        },
        {
          name: 'altEn',
          type: 'string',
          title: 'Texte alternatif ALT (Anglais)',
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
            { title: 'Centré', value: 'blockCenter' },
            { title: 'Justifié', value: 'blockJustify' },
            { title: 'Droite', value: 'blockRight' },
            { title: 'Citation', value: 'blockquote' }
          ]
        },
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            { name: 'imageName', type: 'string', title: 'Nom / Titre' },
            { name: 'caption', type: 'string', title: 'Légende (Français)' },
            { name: 'captionEn', type: 'string', title: 'Légende (Anglais)' },
            { name: 'alt', type: 'string', title: 'ALT (Français)' },
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
              components: { input: GalleryPickerInput },
              title: 'Images',
              of: [{
                type: 'image',
                options: { hotspot: true },
                fields: [
                  { name: 'imageName', type: 'string', title: 'Nom / Titre' },
                  { name: 'caption', type: 'string', title: 'Légende (Français)' },
                  { name: 'captionEn', type: 'string', title: 'Légende (Anglais)' },
                  { name: 'alt', type: 'string', title: 'ALT (Français)' },
                  { name: 'altEn', type: 'string', title: 'ALT (Anglais)' },
                ],
              }]
            }
          ]
        },
        {
          name: 'video',
          type: 'object',
          title: 'Vidéo',
          fields: [
            {
              name: 'url',
              type: 'url',
              title: 'URL de la vidéo (YouTube, Vimeo, etc.)'
            }
          ]
        },
        {
          type: 'object',
          name: 'ctaBlock',
          title: 'CTA / Appel à l\'action',
          fields: [
            { name: 'cta', type: 'reference', to: [{ type: 'cta' }], title: 'Choisir un CTA de la bibliothèque' }
          ],
          preview: {
            select: { title: 'cta.name' },
            prepare({ title }: any) {
              return { title: `📣 CTA : ${title || '(non défini)'}` }
            }
          }
        }
      ],
    }),
    defineField({
      name: 'bodyEn',
      title: 'Corps (Anglais)',
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
            { title: 'Citation', value: 'blockquote' }
          ]
        },
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            { name: 'imageName', type: 'string', title: 'Nom / Titre' },
            { name: 'caption', type: 'string', title: 'Légende (Français)' },
            { name: 'captionEn', type: 'string', title: 'Légende (Anglais)' },
            { name: 'alt', type: 'string', title: 'ALT (Français)' },
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
              components: { input: GalleryPickerInput },
              title: 'Images',
              of: [{
                type: 'image',
                options: { hotspot: true },
                fields: [
                  { name: 'imageName', type: 'string', title: 'Nom / Titre' },
                  { name: 'caption', type: 'string', title: 'Légende (Français)' },
                  { name: 'captionEn', type: 'string', title: 'Légende (Anglais)' },
                  { name: 'alt', type: 'string', title: 'ALT (Français)' },
                  { name: 'altEn', type: 'string', title: 'ALT (Anglais)' },
                ],
              }]
            }
          ]
        },
        {
          name: 'video',
          type: 'object',
          title: 'Vidéo',
          fields: [
            {
              name: 'url',
              type: 'url',
              title: 'URL de la vidéo (YouTube, Vimeo, etc.)'
            }
          ]
        },
        {
          type: 'object',
          name: 'ctaBlock',
          title: 'CTA / Appel à l\'action',
          fields: [
            { name: 'cta', type: 'reference', to: [{ type: 'cta' }], title: 'Choisir un CTA de la bibliothèque' }
          ],
          preview: {
            select: { title: 'cta.name' },
            prepare({ title }: any) {
              return { title: `📣 CTA : ${title || '(non défini)'}` }
            }
          }
        }
      ],
    }),
    defineField({
      name: 'activityType',
      title: 'Catégorie (Type d\'activité)',
      type: 'reference',
      to: [{ type: 'activity' }],
    }),
    defineField({
      name: 'relatedSejour',
      title: 'Séjour lié',
      type: 'reference',
      to: [{ type: 'sejour' }],
    }),
    defineField({
      name: 'tags',
      title: 'Tags / Catégories',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'tag' }], weak: true }],
    }),
    defineField({
      name: 'gallery',
      title: 'Galerie photos (Bas d\'article)',
      type: 'array',
      components: { input: GalleryPickerInput },
      options: {
        layout: 'grid',
      },
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            { name: 'imageName', type: 'string', title: 'Nom / Titre' },
            { name: 'caption', type: 'string', title: 'Légende (Français)' },
            { name: 'captionEn', type: 'string', title: 'Légende (Anglais)' },
            { name: 'alt', type: 'string', title: 'ALT (Français)' },
            { name: 'altEn', type: 'string', title: 'ALT (Anglais)' },
          ],
        },
      ],
    }),
    defineField({
      name: 'tagBrowsedImages',
      title: 'Galerie — Sélection par tag',
      type: 'array',
      of: [
        {
          type: 'image',
          fields: [
            defineField({ name: 'imageName', type: 'string', title: 'Nom / Titre' }),
            defineField({ name: 'alt', type: 'string', title: 'ALT (Français)' }),
            defineField({ name: 'altEn', type: 'string', title: 'ALT (Anglais)' }),
          ],
        },
      ],
      options: { layout: 'grid' },
      components: { input: TagImagePickerInput },
    }),
    defineField({
      name: 'mediaManager',
      title: 'Gestion des textes ALT & Légendes',
      type: 'object',
      fields: [
        defineField({
          name: 'info',
          title: 'Notice',
          type: 'string',
          readOnly: true,
        })
      ],
      components: {
        input: PostMediaManagerInput
      }
    }),
    defineField({
      name: 'topo',
      title: 'Données pratiques / Topo',
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
            { title: 'Citation', value: 'blockquote' }
          ]
        },
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            { name: 'imageName', type: 'string', title: 'Nom / Titre' },
            { name: 'caption', type: 'string', title: 'Légende (Français)' },
            { name: 'captionEn', type: 'string', title: 'Légende (Anglais)' },
            { name: 'alt', type: 'string', title: 'ALT (Français)' },
            { name: 'altEn', type: 'string', title: 'ALT (Anglais)' },
          ]
        }
      ]
    }),
    defineField({
      name: 'topoEn',
      title: 'Données pratiques / Topo (Anglais)',
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
            { title: 'Citation', value: 'blockquote' }
          ]
        },
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            { name: 'imageName', type: 'string', title: 'Nom / Titre' },
            { name: 'caption', type: 'string', title: 'Légende (Français)' },
            { name: 'captionEn', type: 'string', title: 'Légende (Anglais)' },
            { name: 'alt', type: 'string', title: 'ALT (Français)' },
            { name: 'altEn', type: 'string', title: 'ALT (Anglais)' },
          ]
        }
      ]
    }),
    defineField({
      name: 'faqs',
      title: 'FAQ de l\'article',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'faq' }], weak: true }],
      components: { input: FAQPickerInput },
      hidden: ({ value }) => !(value as unknown[])?.length,
    }),
    defineField({
      name: 'relatedActivities',
      title: 'Activités & Séjours associés',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'sejour' }] }],
    }),
    defineField({
      name: 'ctaText',
      title: 'Texte d\'appel à l\'action (Français)',
      type: 'string',
    }),
    defineField({
      name: 'ctaTextEn',
      title: 'Texte d\'appel à l\'action (Anglais)',
      type: 'string',
    }),
    defineField({
      name: 'ctaLink',
      title: 'Lien d\'appel à l\'action',
      type: 'string',
      initialValue: '/contact',
    }),
    defineField({
      name: 'metaTitle', fieldset: 'fsSeoTitle',
      title: '🔍 SEO — Titre (balise title) FR',
      type: 'string',
    }),
    defineField({
      name: 'metaDescription',
      hidden: ({ value }) => !value,
      title: '🔍 SEO — Description (meta) FR',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'metaTitleEn', fieldset: 'fsSeoTitle',
      title: '🔍 SEO — Titre (balise title) EN',
      type: 'string',
    }),
    defineField({
      name: 'metaDescriptionEn',
      hidden: ({ value }) => !value,
      title: '🔍 SEO — Description (meta) EN',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'reviewed',
      title: '✅ Article relu / validé',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'imagesReviewed',
      title: '🖼️ Images revues',
      type: 'boolean',
      initialValue: false,
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
      title: 'Date (récent en premier)',
      name: 'publishedAtDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }],
    },
  ],
  preview: {
    select: {
      title: 'title',
      media: 'mainImage',
      reviewed: 'reviewed',
      imagesReviewed: 'imagesReviewed',
      isHidden: 'isHidden',
      date: 'publishedAt',
    },
    prepare({ title, media, reviewed, imagesReviewed, date, isHidden }: any) {
      const dateStr = date ? new Date(date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }) : ''
      return {
        title: `${reviewed ? '✅' : '⬜'}${imagesReviewed ? '🖼️' : '▫️'} ${title || 'Sans titre'}`,
        subtitle: isHidden ? `Masqué · ${dateStr}` : dateStr,
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
        <Text size={2} weight="bold">📸 Gestion des Textes Alternatifs & Légendes de l'Article</Text>
        <Text size={1} muted>Modifiez rapidement les textes descriptifs (ALT) et légendes de toutes les images utilisées dans cet article pour optimiser votre SEO.</Text>

        {/* 2. Images du corps de l'article */}
        <Card border padding={3} radius={2}>
          <Stack space={3}>
            <Text size={1} weight="bold">📝 Images du corps de l'article (Texte riche)</Text>
            {bodyImages.length === 0 ? (
              <Text size={1} muted>Aucune image insérée dans le texte de l'article.</Text>
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
                        <Label size={0}>Légende :</Label>
                        <TextInput
                          value={localValues[`${img._key}_caption`] ?? (img.caption || '')}
                          onChange={(e: any) => handleUpdate(`${img._key}_caption`, e.target.value, ['body', { _key: img._key }, 'caption'])}
                          placeholder="Légende affichée sous la photo..."
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
            <Text size={1} weight="bold">📚 Images des Galeries du corps de l'article (Texte riche)</Text>
            {bodyGalleryImages.length === 0 ? (
              <Text size={1} muted>Aucune galerie d'images insérée dans le texte de l'article.</Text>
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
                          <Label size={0}>Légende :</Label>
                          <TextInput
                            value={localValues[`bgi_${img._key}_caption`] ?? (img.caption || '')}
                            onChange={(e: any) => handleUpdate(`bgi_${img._key}_caption`, e.target.value, [...imagePath, 'caption'])}
                            placeholder="Légende de la photo dans la galerie..."
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
            <Text size={1} weight="bold">🖼️ Images de la Galerie (Bas d'article)</Text>
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
                        <Label size={0}>Légende :</Label>
                        <TextInput
                          value={localValues[`gal_${img._key}_caption`] ?? (img.caption || '')}
                          onChange={(e: any) => handleUpdate(`gal_${img._key}_caption`, e.target.value, ['gallery', { _key: img._key }, 'caption'])}
                          placeholder="Légende affichée sous la photo..."
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


