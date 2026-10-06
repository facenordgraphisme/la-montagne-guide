import { useState } from 'react'
import { useClient } from 'sanity'
import { Button, Card, Stack, Text } from '@sanity/ui'

const toSlug = (name: string) =>
  name.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

const key = () => Math.random().toString(36).slice(2, 14)

export function SyncArticleTagsToMedia() {
  const client = useClient({ apiVersion: '2024-05-01' })
  const [running, setRunning] = useState(false)
  const [status, setStatus] = useState<{ tone: 'positive' | 'critical' | 'default'; text: string } | null>(null)

  async function run() {
    setRunning(true)
    setStatus({ tone: 'default', text: 'Analyse des articles…' })
    try {
      const posts: { tagRefs?: string[]; assetRefs?: string[] }[] = await client.fetch(`*[_type == "post" && !(_id in path("drafts.**")) && count(tags) > 0]{
        "tagRefs": tags[]._ref,
        "assetRefs": [
          mainImage.asset._ref,
          ...body[_type == "image"].asset._ref,
          ...body[_type == "gallery"].images[].asset._ref,
          ...gallery[].asset._ref
        ]
      }`)

      const tags: { _id: string; name: string }[] = await client.fetch(`*[_type == "tag" && defined(name)]{ _id, name }`)
      const mediaTags: { _id: string; slug: string }[] = await client.fetch(`*[_type == "media.tag"]{ _id, "slug": name.current }`)
      const mediaBySlug = new Map(mediaTags.map(t => [t.slug, t._id]))

      const tagToMedia = new Map<string, string>()
      for (const tag of tags) {
        const slug = toSlug(tag.name)
        if (!slug) continue
        let mediaId = mediaBySlug.get(slug)
        if (!mediaId) {
          const created = await client.create({ _type: 'media.tag', name: { _type: 'slug', current: slug } })
          mediaId = created._id
          mediaBySlug.set(slug, mediaId)
        }
        tagToMedia.set(tag._id, mediaId)
      }

      const wanted = new Map<string, Set<string>>()
      for (const post of posts) {
        const mediaIds = (post.tagRefs || []).map(r => tagToMedia.get(r)).filter(Boolean) as string[]
        for (const assetId of new Set((post.assetRefs || []).filter(Boolean))) {
          const set = wanted.get(assetId) || new Set<string>()
          mediaIds.forEach(m => set.add(m))
          wanted.set(assetId, set)
        }
      }

      const assets: { _id: string; existing?: string[] }[] = await client.fetch(
        `*[_id in $ids]{ _id, "existing": opt.media.tags[]._ref }`,
        { ids: [...wanted.keys()] },
      )

      const patches = assets
        .map(a => ({ id: a._id, add: [...(wanted.get(a._id) || [])].filter(m => !(a.existing || []).includes(m)) }))
        .filter(p => p.add.length)

      for (let i = 0; i < patches.length; i += 100) {
        const tx = client.transaction()
        for (const p of patches.slice(i, i + 100)) {
          tx.patch(p.id, patch => patch
            .setIfMissing({ 'opt.media.tags': [] })
            .append('opt.media.tags', p.add.map(_ref => ({ _type: 'reference', _key: key(), _ref, _weak: true }))))
        }
        await tx.commit()
        setStatus({ tone: 'default', text: `Mise à jour des photos… ${Math.min(i + 100, patches.length)}/${patches.length}` })
      }

      setStatus({ tone: 'positive', text: `Terminé : ${patches.length} photo${patches.length > 1 ? 's' : ''} mise${patches.length > 1 ? 's' : ''} à jour. Les tags d'articles sont maintenant filtrables dans Media.` })
    } catch (e: any) {
      console.error('[SyncArticleTagsToMedia]', e)
      setStatus({ tone: 'critical', text: `Erreur : ${e?.message || e}` })
    } finally {
      setRunning(false)
    }
  }

  return (
    <Card padding={4} radius={3} shadow={1} border>
      <Stack space={3}>
        <Text size={2} weight="semibold">Tags d&apos;articles → Media</Text>
        <Text size={1} muted>
          Ajoute les tags de chaque article à toutes ses photos, pour pouvoir les filtrer dans Media. Les tags déjà présents sur les photos sont conservés. À relancer après avoir tagué de nouveaux articles.
        </Text>
        <Button text={running ? 'Synchronisation…' : 'Synchroniser tous les articles'} tone="primary" disabled={running} onClick={run} />
        {status && (
          <Card padding={3} radius={2} tone={status.tone} border>
            <Text size={1}>{status.text}</Text>
          </Card>
        )}
      </Stack>
    </Card>
  )
}
