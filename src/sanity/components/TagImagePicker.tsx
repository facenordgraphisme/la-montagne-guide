import { useEffect, useState } from 'react'
import { useClient } from 'sanity'
import { set, unset } from 'sanity'
import { Stack, Text, Select, Flex, Button } from '@sanity/ui'

function generateKey() {
  return Math.random().toString(36).slice(2, 10)
}

type FilterMode = 'article' | 'media'

export function TagImagePickerInput(props: any) {
  const { value, onChange } = props
  const client = useClient({ apiVersion: '2023-01-01' })
  const [mode, setMode] = useState<FilterMode>('media')

  const [articleTags, setArticleTags] = useState<any[]>([])
  const [mediaTags, setMediaTags] = useState<any[]>([])

  const [selectedTagId, setSelectedTagId] = useState('')
  const [availableImages, setAvailableImages] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [lastClicked, setLastClicked] = useState<number | null>(null)

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
        : // Query blog posts that have the selected article tag, then extract ALL images
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
                },
                "bodyImages": body[_type == "image" && asset != null]{
                  "assetId": asset._ref,
                  "url": asset->url,
                  "alt": alt,
                  "imageName": imageName
                },
                "bodyGalleries": body[_type == "gallery"]{
                  "images": images[asset != null]{
                    "assetId": asset._ref,
                    "url": asset->url,
                    "alt": alt,
                    "imageName": imageName
                  }
                }
              }`,
              { tagId: selectedTagId }
            )
            .then((posts: any[]) => {
              const images: any[] = []
              const seen = new Set<string>()
              const add = (img: any) => {
                if (img?.assetId && !seen.has(img.assetId)) {
                  seen.add(img.assetId)
                  images.push(img)
                }
              }
              for (const post of posts) {
                add(post.mainImage)
                for (const img of post.bodyImages || []) add(img)
                for (const gallery of post.bodyGalleries || []) {
                  for (const img of gallery.images || []) add(img)
                }
                for (const img of post.gallery || []) add(img)
              }
              return images
            })

    query
      .then((images: any[]) => {
        setAvailableImages(images)
        setLastClicked(null)
      })
      .finally(() => setLoading(false))
  }, [selectedTagId, mode, client])

  function isSelected(assetId: string) {
    return currentValue.some((v: any) => v.asset?._ref === assetId)
  }

  function handleClick(index: number, shiftKey: boolean) {
    const img = availableImages[index]
    const select = !isSelected(img.assetId)
    const range = shiftKey && lastClicked !== null
      ? availableImages.slice(Math.min(lastClicked, index), Math.max(lastClicked, index) + 1)
      : [img]
    const ids = new Set(range.map(i => i.assetId))
    let next: any[]
    if (select) {
      const toAdd = range
        .filter(i => !isSelected(i.assetId))
        .map(i => ({
          _type: 'image',
          _key: generateKey(),
          asset: { _type: 'reference', _ref: i.assetId },
          alt: i.alt || '',
          imageName: i.imageName || '',
        }))
      next = [...currentValue, ...toAdd]
    } else {
      next = currentValue.filter((v: any) => !ids.has(v.asset?._ref))
    }
    setLastClicked(index)
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
            {availableImages.length} photo{availableImages.length > 1 ? 's' : ''} disponible{availableImages.length > 1 ? 's' : ''} — cliquez pour sélectionner, Maj + clic pour une plage
          </Text>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))',
              gap: 8,
            }}
          >
            {availableImages.map((img, index) => {
              const selected = isSelected(img.assetId)
              return (
                <div
                  key={img.assetId}
                  onClick={e => handleClick(index, e.shiftKey)}
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

      {currentValue.length > 0 && (
        <Flex align="center" justify="space-between">
          <Text size={1} weight="semibold">
            {currentValue.length} photo{currentValue.length > 1 ? 's' : ''} sélectionnée{currentValue.length > 1 ? 's' : ''} — glissez-déposez ci-dessous pour changer l'ordre
          </Text>
          <Button text="Tout retirer" tone="critical" mode="ghost" fontSize={1} padding={2} onClick={() => onChange(unset())} />
        </Flex>
      )}
      {currentValue.length > 0 && props.renderDefault(props)}
    </Stack>
  )
}
