/**
 * SEO Generator — La Montagne Guide (version sans IA)
 *
 * Remplit automatiquement les meta descriptions (excerpt) et textes ALT
 * vides sur tous les articles de blog, à partir du contenu existant.
 *
 * Logique :
 *   excerpt  → premiers ~155 chars du corps de l'article
 *   alt      → caption > imageName > titre de l'article
 *
 * Usage :
 *   npx tsx scripts/generate-seo.ts                  → aperçu (dry-run)
 *   npx tsx scripts/generate-seo.ts --write           → écrit dans Sanity
 *   npx tsx scripts/generate-seo.ts --post=mon-slug   → un seul article
 *   npx tsx scripts/generate-seo.ts --overwrite       → écrase les existants
 *   npx tsx scripts/generate-seo.ts --skip-images     → meta descriptions uniquement
 */

// ── Charger le .env ──────────────────────────────────────────────────────────
import { readFileSync } from 'fs'
import { resolve } from 'path'

try {
  const lines = readFileSync(resolve(process.cwd(), '.env'), 'utf-8').split('\n')
  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq === -1) continue
    const key = trimmed.substring(0, eq).trim()
    const val = trimmed.substring(eq + 1).trim().replace(/^["']|["']$/g, '')
    if (key && !process.env[key]) process.env[key] = val
  }
} catch { /* .env absent, on continue */ }

import { createClient } from '@sanity/client'

// ── Args CLI ─────────────────────────────────────────────────────────────────
const args       = process.argv.slice(2)
const WRITE_MODE  = args.includes('--write')
const OVERWRITE   = args.includes('--overwrite')
const SKIP_IMAGES = args.includes('--skip-images')
const SINGLE_SLUG = args.find(a => a.startsWith('--post='))?.split('=')[1]

// ── Client Sanity ────────────────────────────────────────────────────────────
const sanity = createClient({
  projectId:  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID  || 'p72h34w4',
  dataset:    process.env.NEXT_PUBLIC_SANITY_DATASET      || 'production',
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION  || '2024-05-01',
  token:      process.env.SANITY_API_TOKEN,
  useCdn: false,
})

// ── Textes ALT génériques à écraser même sans --overwrite ───────────────────
const GENERIC_ALTS = new Set([
  '', 'image article', 'image galerie', 'photo', 'image',
  'photo de montagne', 'image de montagne', 'photo article',
  'photo galerie', 'galerie', 'image principale'
])

// ── Utilitaires ──────────────────────────────────────────────────────────────
function resolveTitle(title: any): string {
  if (!title) return 'Sans titre'
  if (typeof title === 'string') return title
  return title.fr || title.en || 'Sans titre'
}

function extractBodyText(body: any[]): string {
  if (!Array.isArray(body)) return ''
  return body
    .filter(b => b._type === 'block' && Array.isArray(b.children))
    .map(b => b.children.map((c: any) => c.text || '').join(''))
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim()
}

/** Génère un excerpt depuis le corps : ~155 chars, coupe proprement */
function buildExcerpt(body: any[], title: string): string {
  const text = extractBodyText(body)
  const source = text || title
  if (source.length <= 155) return source
  const cut = source.substring(0, 155)
  const lastSpace = cut.lastIndexOf(' ')
  return (lastSpace > 80 ? cut.substring(0, lastSpace) : cut) + '…'
}

/** Génère un ALT depuis les métadonnées de l'image */
function buildAlt(img: any, postTitle: string, index: number): string {
  const caption  = typeof img.caption  === 'string' ? img.caption.trim()  : ''
  const imgName  = typeof img.imageName === 'string' ? img.imageName.trim() : ''
  if (caption.length  > 3) return caption.substring(0, 125)
  if (imgName.length  > 3) return imgName.substring(0, 125)
  return `${postTitle} — photo ${index + 1}`.substring(0, 125)
}

function isGenericAlt(alt: string | undefined | null): boolean {
  if (!alt) return true
  return GENERIC_ALTS.has(alt.trim().toLowerCase()) || alt.trim().length < 4
}

function needsExcerpt(excerpt: any): boolean {
  if (OVERWRITE) return true
  return !excerpt || (typeof excerpt === 'string' && excerpt.trim().length < 10)
}

function needsAlt(alt: string | undefined | null): boolean {
  if (OVERWRITE) return true
  return isGenericAlt(alt)
}

// ── Script principal ─────────────────────────────────────────────────────────
async function run() {
  console.log('\n🏔  SEO Generator — La Montagne Guide')
  console.log('─'.repeat(52))
  console.log(`Mode    : ${WRITE_MODE ? '✍️  ÉCRITURE (Sanity)' : '👁  APERÇU (dry-run)'}`)
  console.log(`Écraser : ${OVERWRITE ? 'oui' : 'non (champs vides uniquement)'}`)
  console.log(`Images  : ${SKIP_IMAGES ? 'ignorées' : 'incluses'}`)
  if (SINGLE_SLUG) console.log(`Article : ${SINGLE_SLUG}`)
  console.log('─'.repeat(52))
  console.log()

  if (!process.env.SANITY_API_TOKEN) {
    console.error('❌  SANITY_API_TOKEN manquant dans .env')
    process.exit(1)
  }

  // Récupération des articles
  const slugFilter = SINGLE_SLUG ? ` && slug.current == "${SINGLE_SLUG}"` : ''
  const posts: any[] = await sanity.fetch(`
    *[_type == "post"${slugFilter}] | order(publishedAt desc) {
      _id,
      title,
      "slug": slug.current,
      excerpt,
      "mainImage": mainImage{
        alt,
        caption,
        imageName,
        "url": asset->url
      },
      "body": body[]{
        ...,
        _type == "image" => {
          _key, alt, caption, imageName,
          "url": asset->url
        },
        _type == "gallery" => {
          _key,
          "images": images[]{
            _key, alt, caption, imageName,
            "url": asset->url
          }
        }
      },
      "gallery": gallery[]{
        _key, alt, caption, imageName,
        "url": asset->url
      }
    }
  `)

  if (posts.length === 0) {
    console.log('Aucun article trouvé.')
    return
  }

  console.log(`📋  ${posts.length} article(s) à traiter\n`)

  let totalExcerpts = 0
  let totalAlts = 0
  let totalErrors = 0

  for (let i = 0; i < posts.length; i++) {
    const post  = posts[i]
    const title = resolveTitle(post.title)
    console.log(`[${String(i + 1).padStart(2)}/${posts.length}] ${title}`)

    const patches: Record<string, string> = {}

    // ── 1. Excerpt ────────────────────────────────────────────────────────────
    if (needsExcerpt(post.excerpt)) {
      const excerpt = buildExcerpt(post.body || [], title)
      if (excerpt) {
        patches['excerpt'] = excerpt
        totalExcerpts++
        console.log(`        excerpt → "${excerpt.substring(0, 90)}${excerpt.length > 90 ? '…' : ''}"`)
      }
    } else {
      console.log(`        excerpt ✓ (existant)`)
    }

    // ── 2. Images ─────────────────────────────────────────────────────────────
    if (!SKIP_IMAGES) {
      let imgCounter = 0

      // Image principale
      if (post.mainImage?.url && needsAlt(post.mainImage.alt)) {
        const alt = buildAlt(post.mainImage, title, imgCounter++)
        patches['mainImage.alt'] = alt
        totalAlts++
        console.log(`        mainImage.alt → "${alt}"`)
      }

      // Images dans le corps
      const bodyImages = (post.body || []).filter((b: any) => b._type === 'image' && b.url)
      for (const img of bodyImages) {
        if (needsAlt(img.alt)) {
          const alt = buildAlt(img, title, imgCounter++)
          patches[`body[_key=="${img._key}"].alt`] = alt
          totalAlts++
          console.log(`        body img → "${alt}"`)
        }
      }

      // Galeries inline dans le corps
      const bodyGalleries = (post.body || [])
        .filter((b: any) => b._type === 'gallery' && Array.isArray(b.images))
      for (const gallery of bodyGalleries) {
        for (const img of (gallery.images || [])) {
          if (img.url && needsAlt(img.alt)) {
            const alt = buildAlt(img, title, imgCounter++)
            patches[`body[_key=="${gallery._key}"].images[_key=="${img._key}"].alt`] = alt
            totalAlts++
            console.log(`        gallery inline → "${alt}"`)
          }
        }
      }

      // Galerie de bas d'article
      for (const img of (post.gallery || [])) {
        if (img.url && needsAlt(img.alt)) {
          const alt = buildAlt(img, title, imgCounter++)
          patches[`gallery[_key=="${img._key}"].alt`] = alt
          totalAlts++
          console.log(`        gallery → "${alt}"`)
        }
      }
    }

    // ── Appliquer les patches ─────────────────────────────────────────────────
    const patchCount = Object.keys(patches).length
    if (patchCount > 0) {
      if (WRITE_MODE) {
        try {
          await sanity.patch(post._id).set(patches).commit()
          console.log(`        💾 Sauvegardé : ${patchCount} champ(s)`)
        } catch (e: any) {
          console.log(`        ❌ Erreur Sanity : ${e.message?.substring(0, 80)}`)
          totalErrors++
        }
      } else {
        console.log(`        → ${patchCount} champ(s) à écrire (dry-run)`)
      }
    } else {
      console.log(`        ✓ Rien à faire`)
    }

    console.log()
  }

  // ── Résumé ────────────────────────────────────────────────────────────────
  console.log('─'.repeat(52))
  console.log('📊  Résumé')
  console.log(`   Meta descriptions : ${totalExcerpts} générée(s)`)
  console.log(`   Textes ALT        : ${totalAlts} généré(s)`)
  if (totalErrors > 0) console.log(`   Erreurs Sanity    : ${totalErrors}`)
  if (!WRITE_MODE && (totalExcerpts + totalAlts) > 0) {
    console.log()
    console.log('⚠️  Mode aperçu — relancez avec --write pour appliquer.')
  }
  console.log()
}

run().catch(err => {
  console.error('Erreur fatale :', err)
  process.exit(1)
})
