import { useState } from 'react'
import { useDocumentOperation } from 'sanity'
import type { DocumentActionProps } from 'sanity'

export function CopyAltToCaptionAction(props: DocumentActionProps) {
  const { id, type, draft, published } = props
  const { patch } = useDocumentOperation(id, type)
  const [status, setStatus] = useState<'idle' | 'done' | 'none'>('idle')

  if (!['post', 'sejour', 'resource'].includes(type)) return null

  return {
    label: status === 'done' ? '✓ ALT → Légende fait' : status === 'none' ? '(rien à copier)' : '📋 ALT → Légende',
    tone: status === 'done' ? ('positive' as const) : undefined,
    disabled: !(draft || published),
    onHandle: () => {
      const doc: any = draft || published
      const patches: Record<string, string> = {}
      // Alt text moved into the caption is cleared afterwards
      const cleared: string[] = []

      function processImages(images: any[], pathPrefix: string) {
        images?.forEach((img: any) => {
          if (img._type === 'image' && img._key) {
            if (!img.caption?.trim() && img.alt?.trim()) {
              patches[`${pathPrefix}[_key=="${img._key}"].caption`] = img.alt
              cleared.push(`${pathPrefix}[_key=="${img._key}"].alt`)
            }
            if (!img.captionEn?.trim() && img.altEn?.trim()) {
              patches[`${pathPrefix}[_key=="${img._key}"].captionEn`] = img.altEn
              cleared.push(`${pathPrefix}[_key=="${img._key}"].altEn`)
            }
          }
          if (img._type === 'gallery' && img._key) {
            img.images?.forEach((sub: any) => {
              if (sub._key) {
                const base = `${pathPrefix}[_key=="${img._key}"].images[_key=="${sub._key}"]`
                if (!sub.caption?.trim() && sub.alt?.trim()) {
                  patches[`${base}.caption`] = sub.alt
                  cleared.push(`${base}.alt`)
                }
                if (!sub.captionEn?.trim() && sub.altEn?.trim()) {
                  patches[`${base}.captionEn`] = sub.altEn
                  cleared.push(`${base}.altEn`)
                }
              }
            })
          }
        })
      }

      processImages(doc.body || [], 'body')
      processImages(doc.bodyEn || [], 'bodyEn')
      processImages(doc.gallery || [], 'gallery')

      if (Object.keys(patches).length > 0) {
        patch.execute([{ set: patches }, { unset: cleared }])
        setStatus('done')
      } else {
        setStatus('none')
      }
    },
  }
}
