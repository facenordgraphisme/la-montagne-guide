import { useEffect, useState } from 'react'
import { useClient, type AssetSource, type AssetSourceComponentProps } from 'sanity'
import { Box, Button, Card, Dialog, Flex, Grid, Spinner, Stack, Text, TextInput } from '@sanity/ui'
import { Newspaper } from 'lucide-react'

const TYPE_LABEL: Record<string, string> = { post: 'Article', sejour: 'Séjour', resource: 'Ressource' }

// Accepts a slug, a full page URL or words of the title
function slugOf(input: string) {
  const last = input.trim().replace(/[?#].*$/, '').split('/').filter(Boolean).pop() || ''
  try { return decodeURIComponent(last) } catch { return last }
}

type Doc = { _id: string; _type: string; title?: string; slug?: string }
type Asset = { _id: string; url: string; originalFilename?: string; altText?: string }

// "Sélectionner → Photos d'un article": pick an image already used in a post, séjour or resource
function ArticleImagesDialog({ onSelect, onClose }: AssetSourceComponentProps) {
  const client = useClient({ apiVersion: '2024-05-01' })
  const [query, setQuery] = useState('')
  const [docs, setDocs] = useState<Doc[] | null>(null)
  const [doc, setDoc] = useState<Doc | null>(null)
  const [assets, setAssets] = useState<Asset[] | null>(null)

  useEffect(() => {
    const q = query.trim()
    if (q.length < 2) { setDocs(null); return }
    const t = setTimeout(() => {
      client
        .fetch<Doc[]>(
          `*[_type in ["post", "sejour", "resource"] && !(_id in path("drafts.**"))
            && ($slug in [slug.current, slugEn, slugEn.current] || title match $words)]
            | order(_createdAt desc)[0...30]{ _id, _type, title, "slug": slug.current }`,
          { slug: slugOf(q), words: q.split(/\s+/).map(w => `${w}*`) },
        )
        .then(r => {
          setDocs(r)
          // Exact slug match: open it directly
          const exact = r.find(d => d.slug === slugOf(q))
          if (exact) setDoc(exact)
        })
    }, 350)
    return () => clearTimeout(t)
  }, [query, client])

  useEffect(() => {
    if (!doc) { setAssets(null); return }
    setAssets(null)
    client.fetch(`*[_id == $id][0]`, { id: doc._id }).then(async full => {
      // Every image reference anywhere in the document (cover, body, galleries…), in order of appearance
      const ids = [...new Set<string>(JSON.stringify(full ?? {}).match(/image-[0-9a-f]{40}-\d+x\d+-\w+/g) ?? [])]
      const found = await client.fetch<Asset[]>(
        `*[_id in $ids]{ _id, url, originalFilename, altText }`,
        { ids },
      )
      setAssets(ids.map(id => found.find(a => a._id === id)).filter(Boolean) as Asset[])
    })
  }, [doc, client])

  return (
    <Dialog id="article-images-source" header="Photos d'un article" width={4} onClose={onClose} open>
      <Stack space={4} padding={4}>
        <TextInput
          autoFocus
          placeholder="Slug, adresse de la page ou mots du titre…"
          value={query}
          onChange={e => { setQuery(e.currentTarget.value); setDoc(null) }}
        />

        {!doc && docs && (
          docs.length === 0
            ? <Text muted size={1}>Aucun article, séjour ou ressource trouvé.</Text>
            : <Stack space={2}>
                {docs.map(d => (
                  <Card key={d._id} as="button" padding={3} radius={2} border onClick={() => setDoc(d)} style={{ textAlign: 'left', cursor: 'pointer' }}>
                    <Stack space={2}>
                      <Text size={1} weight="semibold">{d.title || d.slug}</Text>
                      <Text size={0} muted>{TYPE_LABEL[d._type]} · {d.slug}</Text>
                    </Stack>
                  </Card>
                ))}
              </Stack>
        )}

        {doc && (
          <Stack space={3}>
            <Flex align="center" gap={3}>
              <Button mode="bleed" fontSize={1} text="← Résultats" onClick={() => setDoc(null)} />
              <Text size={1} weight="semibold">{TYPE_LABEL[doc._type]} : {doc.title || doc.slug}</Text>
            </Flex>
            {!assets
              ? <Flex justify="center" padding={4}><Spinner muted /></Flex>
              : assets.length === 0
                ? <Text muted size={1}>Aucune photo dans ce document.</Text>
                : <Grid columns={[2, 3, 4, 5]} gap={2}>
                    {assets.map(a => (
                      <Card
                        key={a._id}
                        as="button"
                        radius={2}
                        border
                        title={a.originalFilename}
                        onClick={() => onSelect([{ kind: 'assetDocumentId', value: a._id }])}
                        style={{ cursor: 'pointer', overflow: 'hidden', padding: 0 }}
                      >
                        <img src={`${a.url}?w=300&h=300&fit=crop&auto=format`} alt={a.altText || ''} style={{ display: 'block', width: '100%', aspectRatio: '1', objectFit: 'cover' }} />
                        <Box padding={2}><Text size={0} muted textOverflow="ellipsis">{a.originalFilename}</Text></Box>
                      </Card>
                    ))}
                  </Grid>}
          </Stack>
        )}
      </Stack>
    </Dialog>
  )
}

export const articleImagesSource: AssetSource = {
  name: 'article-images',
  title: "Photos d'un article",
  icon: Newspaper as any,
  component: ArticleImagesDialog,
}
