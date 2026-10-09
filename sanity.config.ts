import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { presentationTool } from 'sanity/presentation'
import { resolve } from './src/sanity/presentation/resolve'
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
import { StudioLayoutWithScrollButtons } from './src/sanity/components/ScrollButtons'
import { MediaDetails } from './src/sanity/components/MediaDetails'
import { DeleteTagEverywhereAction } from './src/sanity/actions/deleteTagEverywhere'
import { ImageAssetSyncInput } from './src/sanity/components/ImageAssetSync'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'your-project-id'
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'

export default defineConfig({
  basePath: '/studio',
  projectId,
  dataset,
  icon: StudioLogo,
  theme: studioTheme,
  studio: { components: { layout: StudioLayoutWithScrollButtons } },
  plugins: [
    structureTool({ structure }),
    presentationTool({
      title: 'Éditeur visuel',
      resolve,
      previewUrl: { previewMode: { enable: '/api/draft-mode/enable' } },
    }),
    visionTool(),
    frFRLocale(),
    media({ components: { details: MediaDetails as any } }),
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
  form: { components: { input: ImageAssetSyncInput } },
  document: {
    actions: (prev, ctx) => {
      const extra: any[] = []
      if (['post', 'sejour', 'resource', 'tag'].includes(ctx.schemaType)) {
        extra.push(translateDocumentAction)
      }
      if (['post', 'sejour', 'resource'].includes(ctx.schemaType)) {
        extra.push(CopyAltToCaptionAction as any)
      }
      if (ctx.schemaType === 'post') {
        extra.push(ApplyTagsToImagesAction as any)
      }
      if (ctx.schemaType === 'tag') {
        extra.push(DeleteTagEverywhereAction)
      }
      return [...prev, ...extra]
    },
  },
})
