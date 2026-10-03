import { useState } from 'react'
import { useClient } from 'sanity'

export function ApplyTagsToImagesAction(props: { id: string; type: string }) {
  const { id, type } = props
  const client = useClient({ apiVersion: '2023-01-01' })
  const [status, setStatus] = useState<'idle' | 'running' | 'done' | 'none'>('idle')

  if (type !== 'post') return null

  return {
    label: status === 'running' ? '⏳ Application...' : status === 'done' ? '✓ Tags appliqués' : status === 'none' ? '(aucun tag/image)' : '🏷️ Tags → Images',
    tone: status === 'done' ? 'positive' : 'default',
    disabled: status === 'running',
    onHandle: async () => {
      setStatus('running')
      try {
        // 1. Fetch document tags and all image asset refs
        const doc = await client.fetch(
          `*[_id == $id][0]{
            "tagRefs": tags[]._ref,
            "assetRefs": [
              ...body[_type == "image" && defined(asset._ref)].asset._ref,
              ...body[_type == "gallery"].images[defined(asset._ref)].asset._ref,
              ...gallery[defined(asset._ref)].asset._ref
            ]
          }`,
          { id }
        )

        const tagRefs: string[] = doc.tagRefs || []
        const assetRefs: string[] = [...new Set<string>((doc.assetRefs || []).filter(Boolean))]

        if (tagRefs.length === 0 || assetRefs.length === 0) {
          setStatus('none')
          return
        }

        // 2. Fetch article tag names
        const tags: { _id: string; name: string }[] = await client.fetch(
          `*[_id in $tagRefs]{ _id, name }`,
          { tagRefs }
        )

        // 3. For each tag, find or create a matching media.tag
        const mediaTagRefs: string[] = []
        for (const tag of tags) {
          const slug = tag.name
            .toLowerCase()
            .normalize('NFD')
            .replace(/[̀-ͯ]/g, '')
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9-]/g, '')

          let mediaTag = await client.fetch(
            `*[_type == "media.tag" && name.current == $slug][0]{ _id }`,
            { slug }
          )

          if (!mediaTag) {
            mediaTag = await client.create({
              _type: 'media.tag',
              name: { _type: 'slug', current: slug },
            })
          }
          mediaTagRefs.push(mediaTag._id)
        }

        // 4. Patch each image asset to include the new media tags
        const newTagObjs = mediaTagRefs.map(_ref => ({ _type: 'reference', _key: Math.random().toString(36).slice(2, 14), _ref, _weak: true }))

        for (const assetRef of assetRefs) {
          const asset = await client.fetch(
            `*[_id == $assetRef][0]{ "existing": opt.media.tags[]._ref }`,
            { assetRef }
          )
          const existingRefs: string[] = asset?.existing || []
          const toAdd = newTagObjs.filter(t => !existingRefs.includes(t._ref))
          if (toAdd.length > 0) {
            await client
              .patch(assetRef)
              .setIfMissing({ 'opt.media.tags': [] })
              .append('opt.media.tags', toAdd)
              .commit()
          }
        }

        setStatus('done')
      } catch (e) {
        console.error(e)
        setStatus('idle')
      }
    },
  }
}
