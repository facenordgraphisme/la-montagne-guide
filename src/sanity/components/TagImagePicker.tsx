import { useEffect, useState } from 'react'
import { useClient } from 'sanity'
import { set, unset } from 'sanity'
import { Card, Stack, Text, Select, Flex, Button } from '@sanity/ui'

function generateKey() {
  return Math.random().toString(36).slice(2, 10)
}

type FilterMode = 'article' | 'media'

export function TagImagePickerInput({ value, onChange }: any) {
  const client = useClient({ apiVersion: '2023-01-01' })
  const [mode, setMode] = useState<FilterMode>('media')

  const [articleTags, setArticleTags] = useState<any[]>([])
  const [mediaTags, setMediaTags] = useState<any[]>([])

  const [selectedTagId, setSelectedTagId] = useState('')
  const [availableImages, setAvailableImages] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [imageCache, setImageCache] = useState<Record<string, any>>({})

  const currentValue: any[] = value || []

  // Fetch both tag types on mount
  useEffect(() => {
    client
      .fetch(`*[_type == "tag"] | order(name asc) { _id, name }`)
      .then(setArticleTags)
    client
      .fetch(`*[_type == "media.tag"] | order(name.current asc) { _id, "name": name.current }`)
      .then(setMediaTags)
  }, [client])

  // Reset selected tag when mode switches
  useEffect(() => {
    setSelectedTagId('')
    setAvailableImages([])
  }, [mode])

  // Fetch images when a tag is selected
  useEffect(() => {
    if (!selectedTagId) return
    setLoading(true)
    setAvailableImages([])

    const query =
      mode === 'media'
        ? // Query sanity.imageAsset directly by media.tag
          client.fetch(
            `*[_type == "sanity.imageAsset" && $tagId in opt.media.tags[]._ref] {
              "assetId": _id,
              "url": url,
              "alt": altText,
              "imageName": originalFilename
            }`,
            { tagId: selectedTagId }
          )
        : // Query blog posts that have the selected article tag, then extract images
          client
            .fetch(
              `*[_type == "post" && count(tags[@._ref == $tagId]) > 0] {
                "mainImage": select(
                  mainImage.asset != null => {
                    "assetId": mainImage.asset._ref,
                    "url": mainImage.asset->url,
                    "alt": mainImage.alt,
                    "imageName": mainImage.imageName
                  }
                ),
                "gallery": gallery[asset != null]{
                  "assetId": asset._ref,
                  "url": asset->url,
                  "alt": alt,
                  "imageName": imageName
                }
              }`,
              { tagId: selectedTagId }
            )
            .then((posts: any[]) => {
              const images: any[] = []
              const seen = new Set<string>()
              for (const post of posts) {
                if (post.mainImage?.assetId && !seen.has(post.mainImage.assetId)) {
                  seen.add(post.mainImage.assetId)
                  images.push(post.mainImage)
                }
                for (const img of post.gallery || []) {
                  if (img?.assetId && !seen.has(img.assetId)) {
                    seen.add(img.assetId)
                    images.push(img)
                  }
                }
              }
              return images
            })

    query
      .then((images: any[]) => {
        setAvailableImages(images)
        setImageCache(prev => {
          const next = { ...prev }
          for (const img of images) next[img.assetId] = img
          return next
        })
      })
      .finally(() => setLoading(false))
  }, [selectedTagId, mode, client])

  function isSelected(assetId: string) {
    return currentValue.some((v: any) => v.asset?._ref === assetId)
  }

  function toggleImage(img: any) {
    let next: any[]
    if (isSelected(img.assetId)) {
      next = currentValue.filter((v: any) => v.asset?._ref !== img.assetId)
    } else {
      next = [
        ...currentValue,
        {
          _type: 'image',
          _key: generateKey(),
          asset: { _type: 'reference', _ref: img.assetId },
          alt: img.alt || '',
          imageName: img.imageName || '',
        },
      ]
    }
    onChange(next.length ? set(next) : unset())
  }

  function removeImage(assetId: string) {
    const next = currentValue.filter((v: any) => v.asset?._ref !== assetId)
    onChange(next.length ? set(next) : unset())
  }

  const activeTags = mode === 'media' ? mediaTags : articleTags

  return (
    <Stack space={4}>
      {/* Mode toggle */}
      <Flex gap={2}>
        {([
          { value: 'media', label: '🏷️ Media Tags' },
          { value: 'article', label: '📝 Tags d\'articles' },
        ] as { value: FilterMode; label: string }[]).map(opt => (
          <button
            key={opt.value}
            type="button"
            onClick={() => setMode(opt.value)}
            style={{
              padding: '6px 14px',
              borderRadius: 20,
              border: '1px solid',
              cursor: 'pointer',
              fontSize: 12,
              fontWeight: 700,
              transition: 'all 0.15s',
              borderColor: mode === opt.value ? '#2276fc' : 'var(--card-border-color)',
              background: mode === opt.value ? '#2276fc' : 'transparent',
              color: mode === opt.value ? '#fff' : 'inherit',
            }}
          >
            {opt.label}
          </button>
        ))}
      </Flex>

      {/* Tag selector */}
      <Select value={selectedTagId} onChange={e => setSelectedTagId(e.currentTarget.value)}>
        <option value="">
          {mode === 'media' ? 'Choisir un Media Tag…' : 'Choisir un tag d\'article…'}
        </option>
        {activeTags.map(t => (
          <option key={t._id} value={t._id}>{t.name}</option>
        ))}
      </Select>

      {/* Available images grid */}
      {loading && <Text size={1} muted>Chargement des photos…</Text>}

      {!loading && availableImages.length > 0 && (
        <Stack space={3}>
          <Text size={1} weight="semibold">
            {availableImages.length} photo{availableImages.length > 1 ? 's' : ''} disponible{availableImages.length > 1 ? 's' : ''} — cliquez pour sélectionner / désélectionner
          </Text>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))',
              gap: 8,
            }}
          >
            {availableImages.map(img => {
              const selected = isSelected(img.assetId)
              return (
                <div
                  key={img.assetId}
                  onClick={() => toggleImage(img)}
                  title={img.imageName || img.alt || ''}
                  style={{
                    position: 'relative',
                    cursor: 'pointer',
                    borderRadius: 6,
                    overflow: 'hidden',
                    aspectRatio: '1',
                    outline: selected ? '3px solid #2276fc' : '2px solid transparent',
                    transition: 'outline 0.1s',
                  }}
                >
                  <img
                    src={`${img.url}?w=180&h=180&fit=crop`}
                    alt={img.alt || ''}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                  {selected && (
                    <div
                      style={{
                        position: 'absolute',
                        top: 4,
                        right: 4,
                        background: '#2276fc',
                        borderRadius: '50%',
                        width: 22,
                        height: 22,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: 13,
                        fontWeight: 'bold',
                        boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
                      }}
                    >
                      ✓
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </Stack>
      )}

      {!loading && selectedTagId && availableImages.length === 0 && (
        <Text size={1} muted>Aucune photo trouvée pour ce tag.</Text>
      )}

      {/* Selected images summary */}
      {currentValue.length > 0 && (
        <Card padding={3} radius={2} tone="primary" border>
          <Stack space={3}>
            <Flex align="center" justify="space-between">
              <Text size={1} weight="semibold">
                {currentValue.length} photo{currentValue.length > 1 ? 's' : ''} sélectionnée{currentValue.length > 1 ? 's' : ''}
              </Text>
              <Button
                text="Tout retirer"
                tone="critical"
                mode="ghost"
                fontSize={1}
                padding={2}
                onClick={() => onChange(unset())}
              />
            </Flex>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {currentValue.map((v: any) => {
                const assetId = v.asset?._ref
                const cached = imageCache[assetId]
                return (
                  <div
                    key={v._key || assetId}
                    onClick={() => removeImage(assetId)}
                    title={`Retirer : ${v.imageName || v.alt || ''}`}
                    style={{
                      position: 'relative',
                      width: 56,
                      height: 56,
                      borderRadius: 4,
                      overflow: 'hidden',
                      cursor: 'pointer',
                      flexShrink: 0,
                      background: '#2276fc22',
                    }}
                  >
                    {cached ? (
                      <img
                        src={`${cached.url}?w=112&h=112&fit=crop`}
                        alt={v.alt || ''}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                      />
                    ) : (
                      <div
                        style={{
                          width: '100%',
                          height: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 10,
                          color: '#2276fc',
                          textAlign: 'center',
                          padding: 4,
                        }}
                      >
                        {v.imageName || v.alt || '📷'}
                      </div>
                    )}
                    <div
                      style={{
                        position: 'absolute',
                        top: 2,
                        right: 2,
                        background: 'rgba(0,0,0,0.6)',
                        borderRadius: '50%',
                        width: 16,
                        height: 16,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: 10,
                      }}
                    >
                      ✕
                    </div>
                  </div>
                )
              })}
            </div>
          </Stack>
        </Card>
      )}
    </Stack>
  )
}
