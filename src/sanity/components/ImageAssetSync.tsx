import { useEffect, useRef } from 'react'
import { useClient, type InputProps } from 'sanity'

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

  return props.renderDefault(props)
}

export function ImageAssetSyncInput(props: InputProps) {
  if (!isImageType(props.schemaType)) return props.renderDefault(props)
  return <ImageAssetSyncInner {...props} />
}
