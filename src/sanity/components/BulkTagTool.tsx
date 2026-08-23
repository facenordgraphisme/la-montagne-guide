import React, { useEffect, useMemo, useState } from 'react'
import { useClient } from 'sanity'
import {
  Box,
  Button,
  Card,
  Checkbox,
  Container,
  Flex,
  Select,
  Stack,
  Text,
  TextInput,
  Spinner,
} from '@sanity/ui'

interface TagDoc {
  _id: string
  name: string
}

interface PostDoc {
  _id: string
  title: string
  tagIds: string[]
}

const randomKey = () =>
  Math.random().toString(36).slice(2, 10) + Math.random().toString(36).slice(2, 6)

export function BulkTagTool() {
  const client = useClient({ apiVersion: '2024-05-01' })

  const [tags, setTags] = useState<TagDoc[]>([])
  const [posts, setPosts] = useState<PostDoc[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTagId, setSelectedTagId] = useState('')
  const [search, setSearch] = useState('')
  const [selectedPostIds, setSelectedPostIds] = useState<Set<string>>(new Set())
  const [applying, setApplying] = useState(false)
  const [message, setMessage] = useState<{ tone: 'positive' | 'critical'; text: string } | null>(null)

  const loadData = () => {
    setLoading(true)
    Promise.all([
      client.fetch<TagDoc[]>(`*[_type == "tag"] | order(name asc){ _id, name }`),
      client.fetch<PostDoc[]>(
        `*[_type == "post"] | order(title asc){ _id, title, "tagIds": tags[]._ref }`
      ),
    ])
      .then(([tagDocs, postDocs]) => {
        setTags(tagDocs)
        setPosts(postDocs)
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const filteredPosts = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return posts
    return posts.filter((p) => p.title?.toLowerCase().includes(q))
  }, [posts, search])

  const togglePost = (id: string) => {
    setSelectedPostIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const selectAllFiltered = () => {
    setSelectedPostIds((prev) => {
      const next = new Set(prev)
      filteredPosts.forEach((p) => next.add(p._id))
      return next
    })
  }

  const clearSelection = () => setSelectedPostIds(new Set())

  const handleApply = async () => {
    if (!selectedTagId || selectedPostIds.size === 0) return
    setApplying(true)
    setMessage(null)
    try {
      const targets = posts.filter(
        (p) => selectedPostIds.has(p._id) && !p.tagIds?.includes(selectedTagId)
      )

      if (targets.length === 0) {
        setMessage({ tone: 'positive', text: 'Ces articles ont déjà ce tag, rien à faire.' })
        setApplying(false)
        return
      }

      let tx = client.transaction()
      targets.forEach((post) => {
        tx = tx
          .patch(post._id, (p) => p.setIfMissing({ tags: [] }))
          .patch(post._id, (p) =>
            p.append('tags', [{ _type: 'reference', _ref: selectedTagId, _key: randomKey() }])
          )
      })
      await tx.commit()

      setMessage({
        tone: 'positive',
        text: `Tag appliqué à ${targets.length} article(s) sur ${selectedPostIds.size} sélectionné(s).`,
      })
      clearSelection()
      loadData()
    } catch (err: any) {
      setMessage({ tone: 'critical', text: `Erreur : ${err?.message || 'inconnue'}` })
    } finally {
      setApplying(false)
    }
  }

  if (loading) {
    return (
      <Flex align="center" justify="center" padding={5} style={{ height: '100%' }}>
        <Spinner muted />
      </Flex>
    )
  }

  return (
    <Container width={2} padding={4}>
      <Stack space={4}>
        <Stack space={2}>
          <Text size={3} weight="bold">
            Tag en masse
          </Text>
          <Text size={1} muted>
            Sélectionnez plusieurs articles de blog et appliquez-leur un tag en une seule fois.
          </Text>
        </Stack>

        <Card padding={4} radius={3} shadow={1} border>
          <Stack space={4}>
            <Stack space={2}>
              <Text size={1} weight="semibold">
                1. Choisir le tag à appliquer
              </Text>
              <Select
                value={selectedTagId}
                onChange={(e) => setSelectedTagId(e.currentTarget.value)}
              >
                <option value="">— Sélectionner un tag —</option>
                {tags.map((tag) => (
                  <option key={tag._id} value={tag._id}>
                    {tag.name}
                  </option>
                ))}
              </Select>
            </Stack>

            <Stack space={2}>
              <Flex align="center" justify="space-between">
                <Text size={1} weight="semibold">
                  2. Sélectionner les articles ({selectedPostIds.size} sélectionné
                  {selectedPostIds.size > 1 ? 's' : ''})
                </Text>
                <Flex gap={2}>
                  <Button mode="ghost" text="Tout sélectionner" fontSize={1} padding={2} onClick={selectAllFiltered} />
                  <Button mode="ghost" text="Vider" fontSize={1} padding={2} onClick={clearSelection} />
                </Flex>
              </Flex>
              <TextInput
                placeholder="Rechercher un article par titre..."
                value={search}
                onChange={(e) => setSearch(e.currentTarget.value)}
              />
              <Card
                border
                radius={2}
                style={{ maxHeight: '360px', overflowY: 'auto' }}
              >
                <Stack space={0}>
                  {filteredPosts.length === 0 && (
                    <Box padding={3}>
                      <Text size={1} muted>Aucun article trouvé.</Text>
                    </Box>
                  )}
                  {filteredPosts.map((post) => {
                    const alreadyTagged = selectedTagId ? post.tagIds?.includes(selectedTagId) : false
                    return (
                      <Flex
                        key={post._id}
                        align="center"
                        gap={3}
                        padding={3}
                        style={{ borderBottom: '1px solid var(--card-border-color)' }}
                      >
                        <Checkbox
                          checked={selectedPostIds.has(post._id)}
                          onChange={() => togglePost(post._id)}
                        />
                        <Text size={1} style={{ flex: 1 }}>
                          {post.title || 'Sans titre'}
                        </Text>
                        {alreadyTagged && (
                          <Text size={0} muted>
                            déjà taggé
                          </Text>
                        )}
                      </Flex>
                    )
                  })}
                </Stack>
              </Card>
            </Stack>

            <Button
              text={applying ? 'Application en cours...' : `Appliquer le tag à ${selectedPostIds.size} article(s)`}
              tone="primary"
              disabled={!selectedTagId || selectedPostIds.size === 0 || applying}
              onClick={handleApply}
            />

            {message && (
              <Card padding={3} radius={2} tone={message.tone} border>
                <Text size={1}>{message.text}</Text>
              </Card>
            )}
          </Stack>
        </Card>
      </Stack>
    </Container>
  )
}
