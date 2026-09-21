import { useEffect, useState } from 'react'
import { useClient } from 'sanity'
import { set, unset } from 'sanity'
import { Card, Stack, Text, Select, Flex, Button } from '@sanity/ui'

function generateKey() {
  return Math.random().toString(36).slice(2, 10)
}

export function TagImagePickerInput({ value, onChange }: any) {
  const client = useClient({ apiVersion: '2023-01-01' })
  const [tags, setTags] = useState<any[]>([])
  const [selectedTagId, setSelectedTagId] = useState('')
  const [availableImages, setAvailableImages] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  // Cache assetId → image data so thumbnails stay visible after switching tags
  const [imageCache, setImageCache] = useState<Record<string, any>>({})

  const currentValue: any[] = value || []

  useEffect(() => {
    client
      .fetch(`*[_type == "tag"] | order(name asc) { _id, name }`)
      .then(setTags)
  }, [client])

  useEffect(() => {
    if (!selectedTagId) return
    setLoading(true)
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
        setAvailableImages(images)
        setImageCache(prev => {
          const next = { ...prev }
          for (const img of images) next[img.assetId] = img
          return next
        })
      })
      .finally(() => setLoading(false))
  }, [selectedTagId, client])

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

  return (
    <Stack space={4}>
      {/* Tag selector */}
      <Select value={selectedTagId} onChange={e => setSelectedTagId(e.currentTarget.value)}>
        <option value="">Choisir un tag pour parcourir les photos…</option>
        {tags.map(t => (
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
