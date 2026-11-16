'use client'
import { useState } from 'react'
import { useFormValue } from 'sanity'
import { Button, Card, Flex, Stack, Text } from '@sanity/ui'

const SITE = 'https://www.la-montagne-guide.fr'

// Read-only field: shows the links to send to clients, built from the slug
export default function ShareLinkInput() {
  const slug = useFormValue(['slug', 'current']) as string | undefined
  const [copied, setCopied] = useState<string | null>(null)

  if (!slug) {
    return (
      <Card padding={3} radius={2} tone="caution">
        <Text size={1}>Générez l&apos;adresse de la page pour obtenir le lien.</Text>
      </Card>
    )
  }

  const links = [
    { label: 'Français', url: `${SITE}/inscription/${slug}` },
    { label: 'Anglais', url: `${SITE}/en/inscription/${slug}` },
  ]

  const copy = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(url)
      setTimeout(() => setCopied(null), 2000)
    } catch {}
  }

  return (
    <Stack space={2}>
      {links.map(({ label, url }) => (
        <Card key={url} padding={2} radius={2} border>
          <Flex align="center" gap={2}>
            <Text size={1} weight="semibold" style={{ minWidth: 60 }}>{label}</Text>
            <Text size={1} style={{ flex: 1, wordBreak: 'break-all' }}>
              <a href={url} target="_blank" rel="noreferrer">{url}</a>
            </Text>
            <Button mode="ghost" fontSize={1} padding={2} text={copied === url ? 'Copié' : 'Copier'} onClick={() => copy(url)} />
          </Flex>
        </Card>
      ))}
    </Stack>
  )
}
