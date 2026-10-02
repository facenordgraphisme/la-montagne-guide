import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { frFRLocale } from '@sanity/locale-fr-fr'
import { media } from 'sanity-plugin-media'
import { imageAssetPickerPlugin } from 'sanity-plugin-image-asset-picker'
import { Tags } from 'lucide-react'
import { schema } from './src/sanity/schemaTypes'
import { structure } from './src/sanity/structure'
import { StudioLogo } from './src/sanity/components/StudioLogo'
import { studioTheme } from './src/sanity/theme'
import { BulkTagTool } from './src/sanity/components/BulkTagTool'
import { translateDocumentAction } from './src/sanity/actions/translateDocument'
import { CopyAltToCaptionAction } from './src/sanity/actions/copyAltToCaption'
import { ApplyTagsToImagesAction } from './src/sanity/actions/applyTagsToImages'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'your-project-id'
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'

export default defineConfig({
  basePath: '/studio',
  projectId,
  dataset,
  icon: StudioLogo,
  theme: studioTheme,
  plugins: [
    structureTool({ structure }),
    visionTool(),
    frFRLocale(),
    media(),
    imageAssetPickerPlugin(),
  ],
  tools: (prev) => [
    ...prev,
    {
      name: 'bulk-tag',
      title: 'Tag en masse',
      component: BulkTagTool,
      icon: Tags,
    },
  ],
  schema,
  document: {
    actions: (prev, ctx) => {
      const actions = [...prev]
      if (['post', 'sejour', 'resource', 'tag'].includes(ctx.schemaType)) {
        actions.unshift(translateDocumentAction)
      }
      if (['post', 'sejour', 'resource'].includes(ctx.schemaType)) {
        actions.unshift(CopyAltToCaptionAction as any)
      }
      if (ctx.schemaType === 'post') {
        actions.unshift(ApplyTagsToImagesAction as any)
      }
      return actions
    },
  },
})
