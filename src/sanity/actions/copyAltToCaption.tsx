import { useState } from 'react'
import { useClient } from 'sanity'

export function CopyAltToCaptionAction(props: { id: string; type: string }) {
  const { id, type } = props
  const client = useClient({ apiVersion: '2023-01-01' })
  const [status, setStatus] = useState<'idle' | 'running' | 'done' | 'none'>('idle')

  if (!['post', 'sejour', 'resource'].includes(type)) return null

  return {
    label: status === 'running' ? '⏳ Copie...' : status === 'done' ? '✓ ALT → Légende fait' : status === 'none' ? '(rien à copier)' : '📋 ALT → Légende',
    tone: status === 'done' ? 'positive' : 'default',
    disabled: status === 'running',
    onHandle: async () => {
      setStatus('running')
      try {
        const doc = await client.fetch(
          `*[_id == $id][0]{ body, bodyEn, gallery }`,
          { id }
        )
        const patches: Record<string, string> = {}

        function processImages(images: any[], pathPrefix: string) {
          images?.forEach((img: any) => {
            if (img._type === 'image' && img._key) {
              if (!img.caption?.trim() && img.alt?.trim())
                patches[`${pathPrefix}[_key=="${img._key}"].caption`] = img.alt
              if (!img.captionEn?.trim() && img.altEn?.trim())
                patches[`${pathPrefix}[_key=="${img._key}"].captionEn`] = img.altEn
            }
            if (img._type === 'gallery' && img._key) {
              img.images?.forEach((sub: any) => {
                if (sub._key) {
                  if (!sub.caption?.trim() && sub.alt?.trim())
                    patches[`${pathPrefix}[_key=="${img._key}"].images[_key=="${sub._key}"].caption`] = sub.alt
                  if (!sub.captionEn?.trim() && sub.altEn?.trim())
                    patches[`${pathPrefix}[_key=="${img._key}"].images[_key=="${sub._key}"].captionEn`] = sub.altEn
                }
              })
            }
          })
        }

        processImages(doc.body || [], 'body')
        processImages(doc.bodyEn || [], 'bodyEn')
        processImages(doc.gallery || [], 'gallery')

        if (Object.keys(patches).length > 0) {
          await client.patch(id).set(patches).commit()
          setStatus('done')
        } else {
          setStatus('none')
        }
      } catch (e) {
        console.error(e)
        setStatus('idle')
      }
    },
  }
}
