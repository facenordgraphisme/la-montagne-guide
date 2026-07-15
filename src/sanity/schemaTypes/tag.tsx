import { defineField, defineType } from 'sanity'
import { Tag } from 'lucide-react'

export const tagType = defineType({
  name: 'tag',
  title: 'Tags / Catégories',
  type: 'document',
  icon: Tag,
  fields: [
    defineField({
      name: 'name',
      title: 'Nom',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'tagType',
      title: 'Type',
      type: 'string',
      options: {
        list: [
          { title: 'Catégorie / Activité', value: 'category' },
          { title: 'Massif', value: 'massif' },
          { title: 'Autre', value: 'other' },
        ],
      },
      initialValue: 'other',
      description: 'Utilisé pour les filtres de la page blog.',
    }),
    defineField({
      name: 'referredPosts',
      title: 'Articles associés',
      type: 'string',
      components: {
        input: ReferredPostsInput
      }
    }),
  ],
})

// Custom React component to fetch and show all blog posts referencing this tag inside Sanity Studio
import { Card, Stack, Text } from '@sanity/ui'
import { useClient, useFormValue, getPublishedId } from 'sanity'
import { useEffect, useState } from 'react'

function ReferredPostsInput(props: any) {
  const client = useClient({ apiVersion: '2023-01-01' })
  const [posts, setPosts] = useState<any[]>([])
  
  // In Sanity v3, get the current document ID via useFormValue
  const rawId = useFormValue(['_id']) as string | undefined
  const cleanId = rawId ? getPublishedId(rawId) : undefined

  useEffect(() => {
    if (!cleanId) return
    client.fetch(`*[_type == "post" && references($cleanId)]{_id, title, "slug": slug.current}`, { cleanId })
      .then(setPosts)
      .catch(console.error)
  }, [cleanId, client])

  return (
    <Card padding={4} radius={3} shadow={1} tone="inherit" border>
      <Stack space={3}>
        <Text size={1} weight="bold">Articles de blog associés à ce Tag :</Text>
        {posts.length === 0 ? (
          <Text size={1} muted>Aucun article n'est actuellement associé à ce tag.</Text>
        ) : (
          <Stack space={3}>
            {posts.map((post) => (
              <Text key={post._id} size={1}>
                👉 <strong>{post.title}</strong> <span style={{ opacity: 0.5 }}>({post.slug})</span>
                {post._id.startsWith('drafts.') && <span style={{ color: '#f97316', fontSize: '0.85em', marginLeft: '8px' }}>[Brouillon]</span>}
              </Text>
            ))}
          </Stack>
        )}
      </Stack>
    </Card>
  )
}
