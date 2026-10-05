import { useEffect, useState } from 'react'
import { useClient } from 'sanity'
import { set, unset } from 'sanity'
import { Card, Stack, Text, Select, Flex, Button, Checkbox, Label } from '@sanity/ui'

interface FAQItem {
  _id: string
  question: string
  categoryId: string
  categoryTitle: string
}

interface CategoryItem {
  _id: string
  title: string
}

function generateKey() {
  return Math.random().toString(36).slice(2, 10)
}

export function FAQPickerInput({ value, onChange }: any) {
  const client = useClient({ apiVersion: '2023-01-01' })
  const [categories, setCategories] = useState<CategoryItem[]>([])
  const [faqs, setFaqs] = useState<FAQItem[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)

  const currentValue: any[] = value || []

  useEffect(() => {
    Promise.all([
      client.fetch(`*[_type == "faqCategory"] | order(title asc) { _id, title }`),
      client.fetch(`*[_type == "faq"] | order(category->title asc, order asc) { _id, question, "categoryId": category._ref, "categoryTitle": category->title }`),
    ]).then(([cats, faqList]) => {
      setCategories(cats)
      setFaqs(faqList)
      setLoading(false)
    })
  }, [client])

  const filteredFaqs = selectedCategory
    ? faqs.filter(f => f.categoryId === selectedCategory)
    : faqs

  function isSelected(faqId: string) {
    return currentValue.some((v: any) => v._ref === faqId)
  }

  function toggleFaq(faqId: string) {
    let next: any[]
    if (isSelected(faqId)) {
      next = currentValue.filter((v: any) => v._ref !== faqId)
    } else {
      next = [...currentValue, { _type: 'reference', _key: generateKey(), _ref: faqId, _weak: true }]
    }
    onChange(next.length ? set(next) : unset())
  }

  function removeAll() {
    onChange(unset())
  }

  if (loading) return <Text size={1} muted>Chargement des FAQ…</Text>

  const selectedFaqs = currentValue
    .map((v: any) => faqs.find(f => f._id === v._ref))
    .filter(Boolean) as FAQItem[]

  if (!open) {
    return (
      <Card border padding={3} radius={2}>
        <Flex align="center" justify="space-between" gap={3}>
          <Stack space={2} flex={1}>
            <Text size={1} weight="semibold">
              {currentValue.length ? `${currentValue.length} FAQ sélectionnée${currentValue.length > 1 ? 's' : ''}` : 'Aucune FAQ sélectionnée'}
            </Text>
            {selectedFaqs.map(f => <Text key={f._id} size={1} muted>• {f.question}</Text>)}
          </Stack>
          <Button text="Choisir les FAQ" mode="ghost" fontSize={1} padding={2} onClick={() => setOpen(true)} />
        </Flex>
      </Card>
    )
  }

  return (
    <Stack space={4}>
      <Flex justify="flex-end">
        <Button text="Replier la liste" mode="bleed" fontSize={1} padding={2} onClick={() => setOpen(false)} />
      </Flex>
      {/* Category filter */}
      <Stack space={2}>
        <Label size={1}>Filtrer par catégorie</Label>
        <Select value={selectedCategory} onChange={e => setSelectedCategory(e.currentTarget.value)}>
          <option value="">— Toutes les catégories —</option>
          {categories.map(cat => (
            <option key={cat._id} value={cat._id}>{cat.title}</option>
          ))}
        </Select>
      </Stack>

      {/* FAQ list */}
      <Card border padding={3} radius={2}>
        <Stack space={2}>
          <Text size={1} weight="semibold">
            {filteredFaqs.length} question{filteredFaqs.length !== 1 ? 's' : ''}
            {selectedCategory ? ` dans cette catégorie` : ' au total'}
          </Text>
          {filteredFaqs.length === 0 && (
            <Text size={1} muted>Aucune FAQ dans cette catégorie.</Text>
          )}
          {filteredFaqs.map(faq => (
            <Flex key={faq._id} gap={3} align="center" style={{ padding: '6px 0', borderBottom: '1px solid var(--card-border-color)' }}>
              <Checkbox
                checked={isSelected(faq._id)}
                onChange={() => toggleFaq(faq._id)}
              />
              <Stack space={1} flex={1} style={{ cursor: 'pointer' }} onClick={() => toggleFaq(faq._id)}>
                <Text size={1}>{faq.question}</Text>
                {faq.categoryTitle && (
                  <Text size={0} muted>{faq.categoryTitle}</Text>
                )}
              </Stack>
            </Flex>
          ))}
        </Stack>
      </Card>

      {/* Selected summary */}
      {currentValue.length > 0 && (
        <Card padding={3} radius={2} tone="primary" border>
          <Flex align="center" justify="space-between">
            <Text size={1} weight="semibold">
              {currentValue.length} FAQ sélectionnée{currentValue.length > 1 ? 's' : ''}
            </Text>
            <Button text="Tout retirer" tone="critical" mode="ghost" fontSize={1} padding={2} onClick={removeAll} />
          </Flex>
        </Card>
      )}
    </Stack>
  )
}
