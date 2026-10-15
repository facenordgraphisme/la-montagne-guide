import { createClient } from 'next-sanity'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'your-project-id'
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-05-01'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  // CDN = cached, faster, and counted against the separate 1M "API CDN" quota instead of the 250k "API" one
  useCdn: true,
})
