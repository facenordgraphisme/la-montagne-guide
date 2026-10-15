import { useEffect, useRef, useState } from 'react'
import { set, unset, useClient, type InputProps } from 'sanity'
import { Button, Flex, Stack, Text } from '@sanity/ui'
import { RotateCcw, RotateCw } from 'lucide-react'

// Image field → sanity-plugin-media asset field ("description" is shown as "Légende" in Media)
const FIELD_TO_ASSET: Record<string, string> = { alt: 'altText', caption: 'description', imageName: 'title' }

function isImageType(type: any): boolean {
  for (let t = type; t; t = t.type) if (t.name === 'image') return true
  return false
}

function ImageAssetSyncInner(props: InputProps) {
  const client = useClient({ apiVersion: '2024-05-01' })
  const value = props.value as Record<string, any> | undefined
  const assetRef: string | undefined = value?.asset?._ref
  const snapshot = JSON.stringify(Object.keys(FIELD_TO_ASSET).map(k => value?.[k] ?? null))
  const previous = useRef<{ assetRef?: string; snapshot: string } | null>(null)

  useEffect(() => {
    const prev = previous.current
    previous.current = { assetRef, snapshot }
    // Only sync real edits: skip the first render and asset swaps
    if (!prev || !assetRef || prev.assetRef !== assetRef || prev.snapshot === snapshot) return

    const timer = setTimeout(async () => {
      const set: Record<string, string> = {}
      for (const [field, assetField] of Object.entries(FIELD_TO_ASSET)) {
        const v = value?.[field]
        if (typeof v === 'string' && v.trim()) set[assetField] = v.trim()
      }
      if (!Object.keys(set).length) return
      try {
        const asset = await client.fetch(`*[_id == $id][0]{ altText, description, title }`, { id: assetRef })
        const changed = Object.fromEntries(Object.entries(set).filter(([k, v]) => asset?.[k] !== v))
        if (Object.keys(changed).length) await client.patch(assetRef).set(changed).commit({ visibility: 'async' })
      } catch (e) {
        console.error('[ImageAssetSync]', e)
      }
    }, 1000)
    return () => clearTimeout(timer)
  }, [assetRef, snapshot, client, value])

  return (
    <Stack space={2}>
      {props.renderDefault(props)}
      {assetRef && !props.readOnly && <RotateButtons {...props} assetRef={assetRef} />}
    </Stack>
  )
}

// Some imported photos were uploaded sideways (pixels rotated, no EXIF): re-upload a rotated copy
function RotateButtons({ assetRef, onChange }: InputProps & { assetRef: string }) {
  const client = useClient({ apiVersion: '2024-05-01' })
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const rotate = async (angle: 90 | -90) => {
    setBusy(true)
    setError(null)
    try {
      const asset = await client.fetch(
        `*[_id == $id][0]{ url, originalFilename, mimeType, altText, description, title, opt }`,
        { id: assetRef },
      )
      const bitmap = await createImageBitmap(await (await fetch(asset.url)).blob())
      const canvas = document.createElement('canvas')
      canvas.width = bitmap.height
      canvas.height = bitmap.width
      const ctx = canvas.getContext('2d')!
      ctx.translate(canvas.width / 2, canvas.height / 2)
      ctx.rotate((angle * Math.PI) / 180)
      ctx.drawImage(bitmap, -bitmap.width / 2, -bitmap.height / 2)
      const type = asset.mimeType === 'image/png' ? 'image/png' : 'image/jpeg'
      const blob = await new Promise<Blob>((resolve, reject) =>
        canvas.toBlob(b => (b ? resolve(b) : reject(new Error('Conversion impossible'))), type, 0.92),
      )
      const uploaded = await client.assets.upload('image', blob, { filename: asset.originalFilename })
      // Keep the Media library metadata (alt, légende, tags) on the new asset
      const meta = Object.fromEntries(
        Object.entries({ altText: asset.altText, description: asset.description, title: asset.title, opt: asset.opt })
          .filter(([, v]) => v != null),
      )
      if (Object.keys(meta).length) await client.patch(uploaded._id).set(meta).commit()
      // Crop/hotspot were set for the old orientation
      onChange([set({ _type: 'reference', _ref: uploaded._id }, ['asset']), unset(['crop']), unset(['hotspot'])])
    } catch (e: any) {
      console.error('[RotateImage]', e)
      setError(e?.message || 'Erreur')
    } finally {
      setBusy(false)
    }
  }

  return (
    <Flex gap={2} align="center">
      <Button mode="ghost" fontSize={1} padding={2} icon={RotateCcw} text="Pivoter à gauche" disabled={busy} onClick={() => rotate(-90)} />
      <Button mode="ghost" fontSize={1} padding={2} icon={RotateCw} text="Pivoter à droite" disabled={busy} onClick={() => rotate(90)} />
      {busy && <Text size={1} muted>Rotation en cours…</Text>}
      {error && <Text size={1} style={{ color: 'var(--card-critical-fg-color, #e5484d)' }}>{error}</Text>}
    </Flex>
  )
}

export function ImageAssetSyncInput(props: InputProps) {
  if (!isImageType(props.schemaType)) return props.renderDefault(props)
  return <ImageAssetSyncInner {...props} />
}
