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
        patch.execute([{ set: patches }])
        setStatus('done')
      } else {
        setStatus('none')
      }
    },
  }
}
