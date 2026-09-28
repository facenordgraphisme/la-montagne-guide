'use client'
import { useState, useCallback } from 'react'
import { useDocumentOperation } from 'sanity'
import type { DocumentActionProps } from 'sanity'

function toSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

// Which simple string fields to translate per document type
const STRING_FIELDS: Record<string, [string, string][]> = {
  post: [
    ['title', 'titleEn'],
    ['excerpt', 'excerptEn'],
  ],
  sejour: [
    ['title', 'titleEn'],
    ['duration', 'durationEn'],
    ['participants', 'participantsEn'],
    ['period', 'periodEn'],
    ['basePrice', 'basePriceEn'],
  ],
  resource: [
    ['title', 'titleEn'],
    ['intro', 'introEn'],
  ],
  tag: [
    ['name', 'nameEn'],
  ],
}

// Which Portable Text fields to translate per document type
const PT_FIELDS: Record<string, [string, string][]> = {
  post: [['body', 'bodyEn']],
  sejour: [['description', 'descriptionEn']],
  resource: [['content', 'contentEn']],
}

const HAS_TABS = ['sejour', 'resource']

type SpanRef = { blockIdx: number; spanIdx: number; text: string }

function extractSpans(blocks: any[]): SpanRef[] {
  const refs: SpanRef[] = []
  if (!Array.isArray(blocks)) return refs
  blocks.forEach((block, blockIdx) => {
    if (block._type !== 'block') return
    ;(block.children || []).forEach((child: any, spanIdx: number) => {
      if (child._type === 'span' && child.text?.trim()) {
        refs.push({ blockIdx, spanIdx, text: child.text })
      }
    })
  })
  return refs
}

function applySpanTranslations(
  blocks: any[],
  spans: SpanRef[],
  allTranslations: string[],
  offset: number
): any[] {
  // Deep-copy blocks and only replace span texts; non-text blocks are copied as-is
  const result = blocks.map(b => ({ ...b }))
  spans.forEach(({ blockIdx, spanIdx }, i) => {
    if (result[blockIdx]?.children) {
      result[blockIdx] = {
        ...result[blockIdx],
        children: result[blockIdx].children.map((c: any, j: number) =>
          j === spanIdx ? { ...c, text: allTranslations[offset + i] } : c
        ),
      }
    }
  })
  return result
}

async function batchTranslate(texts: string[]): Promise<string[]> {
  if (texts.length === 0) return []
  const res = await fetch('/api/translate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ texts }),
  })
  if (!res.ok) throw new Error(`DeepL proxy error ${res.status}`)
  const data = await res.json()
  if (data.error) throw new Error(data.error)
  return data.translations as string[]
}

export function translateDocumentAction(props: DocumentActionProps) {
  const { id, type, draft, published } = props
  const { patch, publish } = useDocumentOperation(id, type)
  const [status, setStatus] = useState<'idle' | 'running' | 'done' | 'error'>('idle')

  const handleTranslate = useCallback(async () => {
    const doc = draft || published
    if (!doc) return
    setStatus('running')

    try {
      const allTexts: string[] = []

      // ── 1. Simple string/text fields ────────────────────────────────────
      const stringPairs = STRING_FIELDS[type] || []
      const stringMeta: { enKey: string; textIdx: number }[] = []
      for (const [frKey, enKey] of stringPairs) {
        const fr = (doc as any)[frKey]
        const en = (doc as any)[enKey]
        if (fr && typeof fr === 'string' && !en?.trim()) {
          stringMeta.push({ enKey, textIdx: allTexts.length })
          allTexts.push(fr)
        }
      }

      // ── 2. Portable Text fields ──────────────────────────────────────────
      const ptPairs = PT_FIELDS[type] || []
      const ptMeta: {
        enKey: string
        blocks: any[]
        spans: SpanRef[]
        offset: number
      }[] = []
      for (const [frKey, enKey] of ptPairs) {
        const blocks = (doc as any)[frKey]
        if (!Array.isArray(blocks) || blocks.length === 0) continue
        const spans = extractSpans(blocks)
        if (spans.length === 0) continue
        const offset = allTexts.length
        allTexts.push(...spans.map(s => s.text))
        ptMeta.push({ enKey, blocks, spans, offset })
      }

      // ── 3. Tabs (séjour / resource) ──────────────────────────────────────
      type TabJob = {
        titleIdx: number   // index in allTexts, or -1 if skipped
        contentSpans: SpanRef[]
        contentBlocks: any[]
        contentOffset: number
      }
      const tabJobs: TabJob[] = []
      if (HAS_TABS.includes(type)) {
        const tabs: any[] = (doc as any).tabs || []
        tabs.forEach(tab => {
          let titleIdx = -1
          if (tab.title && !tab.titleEn?.trim()) {
            titleIdx = allTexts.length
            allTexts.push(tab.title)
          }
          let contentSpans: SpanRef[] = []
          let contentOffset = -1
          const content: any[] = tab.content || []
          if (content.length > 0) {
            contentSpans = extractSpans(content)
            if (contentSpans.length > 0) {
              contentOffset = allTexts.length
              allTexts.push(...contentSpans.map(s => s.text))
            }
          }
          tabJobs.push({
            titleIdx,
            contentSpans,
            contentBlocks: content,
            contentOffset,
          })
        })
      }

      if (allTexts.length === 0) {
        setStatus('done')
        setTimeout(() => setStatus('idle'), 2000)
        return
      }

      // ── Translate all at once ────────────────────────────────────────────
      const translations = await batchTranslate(allTexts)

      // ── Build patch ──────────────────────────────────────────────────────
      const setValues: Record<string, any> = {}

      // String fields
      stringMeta.forEach(({ enKey, textIdx }) => {
        setValues[enKey] = translations[textIdx]
      })

      // PT fields
      ptMeta.forEach(({ enKey, blocks, spans, offset }) => {
        setValues[enKey] = applySpanTranslations(blocks, spans, translations, offset)
      })

      // Tabs
      if (HAS_TABS.includes(type)) {
        const tabs: any[] = (doc as any).tabs || []
        setValues.tabs = tabs.map((tab, i) => {
          const job = tabJobs[i]
          const updated = { ...tab }
          if (job.titleIdx !== -1) {
            updated.titleEn = translations[job.titleIdx]
          }
          if (job.contentOffset !== -1 && job.contentSpans.length > 0) {
            updated.contentEn = applySpanTranslations(
              job.contentBlocks,
              job.contentSpans,
              translations,
              job.contentOffset
            )
          }
          return updated
        })
      }

      // Auto-generate slugEn from titleEn for post / sejour / resource
      if (['post', 'sejour', 'resource'].includes(type)) {
        const titleEnValue: string = setValues.titleEn || (doc as any).titleEn || ''
        if (titleEnValue.trim()) {
          setValues.slugEn = toSlug(titleEnValue)
        }
      }

      patch.execute([{ set: setValues }])
      // Give the patch time to commit, then auto-publish so the front-end sees the translation
      await new Promise(r => setTimeout(r, 800))
      if (!publish.disabled) {
        publish.execute()
      }
      setStatus('done')
      setTimeout(() => setStatus('idle'), 3000)
    } catch (e) {
      console.error('[translateDocumentAction]', e)
      setStatus('error')
      setTimeout(() => setStatus('idle'), 3000)
    }
  }, [draft, published, id, type, patch])

  if (!['post', 'sejour', 'resource', 'tag'].includes(type)) return null

  return {
    label:
      status === 'running' ? 'Traduction…'
      : status === 'done'    ? '✓ Traduit !'
      : status === 'error'   ? '⚠ Erreur traduction'
      : '🌐 Traduire EN',
    disabled: status === 'running' || !(draft || published),
    tone:
      status === 'done'  ? ('positive' as const)
      : status === 'error' ? ('critical' as const)
      : undefined,
    onHandle: handleTranslate,
  }
}
