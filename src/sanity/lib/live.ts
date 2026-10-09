import { draftMode } from 'next/headers'
import type { QueryParams } from 'next-sanity'
import { client as baseClient } from './client'

const token = process.env.SANITY_API_READ_TOKEN || process.env.SANITY_API_TOKEN

// Stega (click-to-edit markers) only on displayed text fields: values used in comparisons, URLs or regexes
// (slugs, activityType, level, prices…) must stay clean or preview pages would break
const STEGA_KEY = /(title|text|subtitle|description|excerpt|intro|question|answer|caption|label|badge|heading|content|name|duration|participants|period|massif)(En)?$/i
const STEGA_EXCLUDED = new Set(['imageName', 'originalFilename', 'filename', 'whatsappText'])

const previewClient = baseClient.withConfig({
  token,
  useCdn: false,
  perspective: 'drafts',
  stega: {
    enabled: true,
    studioUrl: '/studio',
    filter: (props) => {
      const key = props.sourcePath.at(-1)
      return typeof key === 'string' && STEGA_KEY.test(key) && !STEGA_EXCLUDED.has(key) && props.filterDefault(props)
    },
  },
})

export async function isPreview() {
  try {
    return (await draftMode()).isEnabled
  } catch {
    // Outside a request (generateStaticParams, build) there is no draft mode
    return false
  }
}

// Hidden pages ("Masquer la page sur le site") must stay editable in the visual editor
const HIDDEN_FILTER = /!\([\w@>.-]*isHidden == true\)/g

export const client = {
  async fetch<R = any>(query: string, params: QueryParams = {}): Promise<R> {
    if (token && (await isPreview())) return previewClient.fetch<R>(query.replace(HIDDEN_FILTER, 'true'), params)
    return baseClient.fetch<R>(query, params)
  },
}
