import React, { useEffect } from 'react'
import { useClient, set } from 'sanity'

export function AutoFilenameImageInput(props: any) {
  const { onChange, value, schemaType, renderDefault } = props
  const client = useClient({ apiVersion: '2024-05-01' })

  useEffect(() => {
    if (value?.asset?._ref) {
      const assetRef = value.asset._ref
      
      const hasAltField = schemaType.fields.some((f: any) => f.name === 'alt')
      const hasImageNameField = schemaType.fields.some((f: any) => f.name === 'imageName')
      const hasCaptionField = schemaType.fields.some((f: any) => f.name === 'caption')

      const needsAlt = hasAltField && (value.alt === undefined || value.alt === '')
      const needsImageName = hasImageNameField && (value.imageName === undefined || value.imageName === '')
      const needsCaption = hasCaptionField && (value.caption === undefined || value.caption === '')

      if (needsAlt || needsImageName || needsCaption) {
        client.getDocument(assetRef).then((asset: any) => {
          if (asset && asset.originalFilename) {
            const filenameWithoutExt = asset.originalFilename.replace(/\.[^/.]+$/, "")
            const formattedName = filenameWithoutExt
              .replace(/[-_]/g, ' ')
              .trim()

            const patches: any[] = []
            if (needsAlt) patches.push(set(formattedName, ['alt']))
            if (needsImageName) patches.push(set(formattedName, ['imageName']))
            if (needsCaption) patches.push(set(formattedName, ['caption']))

            if (patches.length > 0) {
              onChange(patches)
            }
          }
        }).catch((err) => {
          console.error("Error fetching asset for auto-filename:", err)
        })
      }
    }
  }, [value?.asset?._ref, onChange, client, schemaType.fields, value?.alt, value?.imageName, value?.caption])

  return renderDefault(props)
}
