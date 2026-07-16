import { defineField, defineType } from 'sanity'
import { FileText } from 'lucide-react'

export const postType = defineType({
  name: 'post',
  title: 'Blog',
  type: 'document',
  icon: FileText,
  fields: [
    defineField({
      name: 'title',
      title: 'Titre',
      type: 'string',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
    }),
    defineField({
      name: 'excerpt',
      title: 'Extrait',
      type: 'text',
      description: 'Un court résumé de l\'article pour la liste des blogs.',
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
          title: 'Nom personnalisé / Titre de l\'image',
          description: 'Pour organiser ou nommer l\'image.',
        },
        {
          name: 'alt',
          type: 'string',
          title: 'Texte alternatif (ALT)',
          description: 'Pour le SEO et l\'accessibilité.',
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
            { name: 'caption', type: 'string', title: 'Légende' },
            { name: 'alt', type: 'string', title: 'Texte alternatif (ALT)' },
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
                  { name: 'caption', type: 'string', title: 'Légende' },
                  { name: 'alt', type: 'string', title: 'Texte alternatif (ALT)' },
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
        }
      ],
    }),
    defineField({
      name: 'activityType',
      title: 'Catégorie (Type d\'activité)',
      type: 'reference',
      to: [{ type: 'activity' }],
      description: 'Catégorie principale de cet article — utilisée pour afficher les articles pertinents sur les pages séjour.',
    }),
    defineField({
      name: 'relatedSejour',
      title: 'Séjour lié',
      type: 'reference',
      to: [{ type: 'sejour' }],
      description: 'Associer cet article à un séjour pour l\'afficher sur la page du séjour',
    }),
    defineField({
      name: 'tags',
      title: 'Tags / Catégories',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'tag' }] }],
      description: 'Tags et catégories associés à cet article'
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
            { name: 'caption', type: 'string', title: 'Légende' },
            { name: 'alt', type: 'string', title: 'Texte alternatif (ALT)' },
          ],
        },
      ],
      description: 'Optionnel. Galerie de photos qui s\'affichera automatiquement en bas de l\'article.',
    }),
    defineField({
      name: 'mediaManager',
      title: 'Gestion des textes ALT & Légendes',
      type: 'string',
      components: {
        input: PostMediaManagerInput
      }
    }),
  ],
})

// Custom React component to manage and edit ALT texts/captions of all images inside the post
import { Card, Stack, Text, TextInput, Label, Flex } from '@sanity/ui'
import { useFormValue, set, useClient, PatchEvent } from 'sanity'
import { useEffect, useState } from 'react'
import { urlFor } from '@/sanity/lib/image'

function PostMediaManagerInput(props: any) {
  const client = useClient({ apiVersion: '2023-01-01' })
  const [assetAlts, setAssetAlts] = useState<Record<string, string>>({})

  // Read fields from the form values
  const mainImage = useFormValue(['mainImage']) as any
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
    if (mainImage?.asset?._ref) ids.push(mainImage.asset._ref)
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

    client.fetch(`*[_id in $ids]{_id, altText}`, { ids })
      .then((results: any[]) => {
        const alts: Record<string, string> = {}
        results.forEach(res => {
          if (res.altText) {
            alts[res._id] = res.altText
          }
        })
        setAssetAlts(alts)
      })
      .catch(console.error)
  }, [mainImage?.asset?._ref, body, gallery, client])

  // Helper to dispatch a patch update back to Sanity
  const handleUpdate = (value: string, path: any[]) => {
    props.onChange(PatchEvent.from(set(value, path)))
  }

  return (
    <Card padding={4} radius={3} shadow={1} tone="inherit" border>
      <Stack space={4}>
        <Text size={2} weight="bold">📸 Gestion des Textes Alternatifs & Légendes de l'Article</Text>
        <Text size={1} muted>Modifiez rapidement les textes descriptifs (ALT) et légendes de toutes les images utilisées dans cet article pour optimiser votre SEO.</Text>
        
        {/* 1. Image principale */}
        <Card border padding={3} radius={2}>
          <Stack space={3}>
            <Text size={1} weight="bold">🖼️ Image Principale</Text>
            {mainImage?.asset ? (
              <Flex gap={3} align="center">
                <div style={{ width: '80px', height: '60px', position: 'relative', overflow: 'hidden', borderRadius: '4px', background: '#000' }}>
                  <img 
                    src={urlFor(mainImage.asset).width(160).height(120).url()} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                </div>
                <Stack space={3} flex={1}>
                  <div>
                    <Label size={0}>Nom / Titre de l'image principale :</Label>
                    <TextInput 
                      value={mainImage.imageName || ''} 
                      onChange={(e: any) => handleUpdate(e.target.value, ['mainImage', 'imageName'])}
                      placeholder="Ex: nicolas-draperi-guide-alpinisme"
                    />
                  </div>
                  <div>
                    <Label size={0}>Texte alternatif (ALT) :</Label>
                    <TextInput 
                      value={mainImage.alt || ''} 
                      onChange={(e: any) => handleUpdate(e.target.value, ['mainImage', 'alt'])}
                      placeholder={assetAlts[mainImage.asset._ref] || "Description SEO de l'image..."}
                    />
                  </div>
                </Stack>
              </Flex>
            ) : (
              <Text size={1} muted>Aucune image principale configurée.</Text>
            )}
          </Stack>
        </Card>

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
                      <img 
                        src={urlFor(img.asset).width(160).height(120).url()} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                      />
                    </div>
                    <Stack space={3} flex={1}>
                      <div>
                        <Label size={0}>Légende :</Label>
                        <TextInput 
                          value={img.caption || ''} 
                          onChange={(e: any) => handleUpdate(e.target.value, ['body', { _key: img._key }, 'caption'])}
                          placeholder="Légende affichée sous la photo..."
                        />
                      </div>
                      <div>
                        <Label size={0}>Texte alternatif (ALT) :</Label>
                        <TextInput 
                          value={img.alt || ''} 
                          onChange={(e: any) => handleUpdate(e.target.value, ['body', { _key: img._key }, 'alt'])}
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
                        <img 
                          src={urlFor(img.asset).width(160).height(120).url()} 
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                        />
                      </div>
                      <Stack space={3} flex={1}>
                        <div>
                          <Label size={0}>Légende :</Label>
                          <TextInput 
                            value={img.caption || ''} 
                            onChange={(e: any) => handleUpdate(e.target.value, [...imagePath, 'caption'])}
                            placeholder="Légende de la photo dans la galerie..."
                          />
                        </div>
                        <div>
                          <Label size={0}>Texte alternatif (ALT) :</Label>
                          <TextInput 
                            value={img.alt || ''} 
                            onChange={(e: any) => handleUpdate(e.target.value, [...imagePath, 'alt'])}
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
                      {img.asset && (
                        <img 
                          src={urlFor(img.asset).width(160).height(120).url()} 
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                        />
                      )}
                    </div>
                    <Stack space={3} flex={1}>
                      <div>
                        <Label size={0}>Légende :</Label>
                        <TextInput 
                          value={img.caption || ''} 
                          onChange={(e: any) => handleUpdate(e.target.value, ['gallery', { _key: img._key }, 'caption'])}
                          placeholder="Légende affichée sous la photo..."
                        />
                      </div>
                      <div>
                        <Label size={0}>Texte alternatif (ALT) :</Label>
                        <TextInput 
                          value={img.alt || ''} 
                          onChange={(e: any) => handleUpdate(e.target.value, ['gallery', { _key: img._key }, 'alt'])}
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
