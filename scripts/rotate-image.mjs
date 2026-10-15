// Fix a photo stored sideways in Sanity: uploads a rotated copy and swaps every reference to it.
// Usage: node scripts/rotate-image.mjs <asset id | cdn url> <90|180|270> [--dry]
//   90 = quarter turn clockwise, 270 = quarter turn counter-clockwise
import 'dotenv/config'
import { createClient } from '@sanity/client'
import sharp from 'sharp'

const [input, angleArg] = process.argv.slice(2)
const dry = process.argv.includes('--dry')
const angle = Number(angleArg)
if (!input || ![90, 180, 270].includes(angle)) {
  console.error('Usage: node scripts/rotate-image.mjs <asset id | cdn url> <90|180|270> [--dry]')
  process.exit(1)
}

const client = createClient({
  projectId: 'p72h34w4',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
})

// Accept "image-<hash>-WxH-jpg" or a cdn.sanity.io URL
const m = input.match(/([0-9a-f]{40}-\d+x\d+)\.(\w+)/)
const assetId = input.startsWith('image-') ? input : m ? `image-${m[1]}-${m[2]}` : null
if (!assetId) { console.error('Asset introuvable dans', input); process.exit(1) }

const asset = await client.fetch('*[_id == $id][0]{_id, url, originalFilename, mimeType}', { id: assetId })
if (!asset) { console.error('Asset introuvable :', assetId); process.exit(1) }

const docs = await client.fetch('*[references($id)]', { id: assetId })
console.log(`${asset.originalFilename} → rotation ${angle}°, utilisée dans ${docs.length} document(s)`)
if (dry) process.exit(0)

const original = Buffer.from(await (await fetch(asset.url)).arrayBuffer())
const rotated = await sharp(original).rotate(angle).toBuffer()
const newAsset = await client.assets.upload('image', rotated, {
  filename: asset.originalFilename,
  contentType: asset.mimeType,
})

const tx = client.transaction()
for (const doc of docs) {
  const { _rev, _updatedAt, _createdAt, ...rest } = doc
  tx.createOrReplace(JSON.parse(JSON.stringify(rest).replaceAll(`"${assetId}"`, `"${newAsset._id}"`)))
}
await tx.commit()
console.log(`OK : ${newAsset.url}`)
