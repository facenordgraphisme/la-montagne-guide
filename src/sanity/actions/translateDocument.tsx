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
  post: [['body', 'bodyEn'], ['topo', 'topoEn']],
  sejour: [['description', 'descriptionEn']],
  resource: [['content', 'contentEn']],
}

const HAS_TABS = ['sejour', 'resource']

type SpanRef = { blockIdx: number; spanIdx: number; text: string }
type ImageFieldRef = { blockIdx: number; subIdx?: number; enField: 'captionEn' | 'altEn'; text: string }

function imageRefs(img: any, blockIdx: number, subIdx?: number): ImageFieldRef[] {
  const refs: ImageFieldRef[] = []
  if (img?.caption?.trim() && !img.captionEn?.trim()) refs.push({ blockIdx, subIdx, enField: 'captionEn', text: img.caption })
  if (img?.alt?.trim() && !img.altEn?.trim()) refs.push({ blockIdx, subIdx, enField: 'altEn', text: img.alt })
  return refs
}

function extractImageFields(blocks: any[]): ImageFieldRef[] {
  const refs: ImageFieldRef[] = []
  if (!Array.isArray(blocks)) return refs
  blocks.forEach((block, blockIdx) => {
    if (block._type === 'image') refs.push(...imageRefs(block, blockIdx))
    if (block._type === 'gallery') (block.images || []).forEach((img: any, subIdx: number) => refs.push(...imageRefs(img, blockIdx, subIdx)))
  })
  return refs
}

function applyImageTranslations(blocks: any[], refs: ImageFieldRef[], translations: string[], offset: number): any[] {
  const result = blocks.map(b => (b._type === 'gallery' ? { ...b, images: (b.images || []).map((i: any) => ({ ...i })) } : { ...b }))
  refs.forEach(({ blockIdx, subIdx, enField }, i) => {
    const target = subIdx === undefined ? result[blockIdx] : result[blockIdx]?.images?.[subIdx]
    if (target) target[enField] = translations[offset + i]
  })
  return result
}

const MAIN_IMAGE_FIELD: Record<string, string> = { post: 'mainImage', sejour: 'image', resource: 'image' }

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
  const { patch } = useDocumentOperation(id, type)
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
        imageRefs: ImageFieldRef[]
        imageOffset: number
      }[] = []
      for (const [frKey, enKey] of ptPairs) {
        const blocks = (doc as any)[frKey]
        if (!Array.isArray(blocks) || blocks.length === 0) continue
        const spans = extractSpans(blocks)
        const imageRefs = extractImageFields(blocks)
        if (spans.length === 0 && imageRefs.length === 0) continue
        const offset = allTexts.length
        allTexts.push(...spans.map(s => s.text))
        const imageOffset = allTexts.length
        allTexts.push(...imageRefs.map(r => r.text))
        ptMeta.push({ enKey, blocks, spans, offset, imageRefs, imageOffset })
      }

      // ── 3. Tabs (séjour / resource) ──────────────────────────────────────
      type TabJob = {
        titleIdx: number   // index in allTexts, or -1 if skipped
        contentSpans: SpanRef[]
        contentBlocks: any[]
        contentOffset: number
        imageRefs: ImageFieldRef[]
        imageOffset: number
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
          const tabImageRefs = extractImageFields(content)
          const imageOffset = allTexts.length
          allTexts.push(...tabImageRefs.map(r => r.text))
          tabJobs.push({
            titleIdx,
            contentSpans,
            contentBlocks: content,
            contentOffset,
            imageRefs: tabImageRefs,
            imageOffset,
          })
        })
      }

      // ── 4. Main image ALT + bottom gallery ──────────────────────────────
      const pathJobs: { path: string; textIdx: number }[] = []
      const addPathJob = (path: string, text: string) => {
        pathJobs.push({ path, textIdx: allTexts.length })
        allTexts.push(text)
      }
      const mainField = MAIN_IMAGE_FIELD[type]
      const mainImg = mainField ? (doc as any)[mainField] : null
      if (mainImg?.alt?.trim() && !mainImg.altEn?.trim()) addPathJob(`${mainField}.altEn`, mainImg.alt)
      for (const img of ((doc as any).gallery || []) as any[]) {
        if (!img?._key) continue
        if (img.caption?.trim() && !img.captionEn?.trim()) addPathJob(`gallery[_key=="${img._key}"].captionEn`, img.caption)
        if (img.alt?.trim() && !img.altEn?.trim()) addPathJob(`gallery[_key=="${img._key}"].altEn`, img.alt)
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
      ptMeta.forEach(({ enKey, blocks, spans, offset, imageRefs, imageOffset }) => {
        const enBlocks = applySpanTranslations(blocks, spans, translations, offset)
        setValues[enKey] = applyImageTranslations(enBlocks, imageRefs, translations, imageOffset)
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
          if (job.contentSpans.length > 0 || job.imageRefs.length > 0) {
            const enBlocks = job.contentSpans.length > 0
              ? applySpanTranslations(job.contentBlocks, job.contentSpans, translations, job.contentOffset)
              : job.contentBlocks
            updated.contentEn = applyImageTranslations(enBlocks, job.imageRefs, translations, job.imageOffset)
          }
          return updated
        })
      }

      pathJobs.forEach(({ path, textIdx }) => { setValues[path] = translations[textIdx] })

      // Auto-generate slugEn from titleEn for post / sejour / resource
      if (['post', 'sejour', 'resource'].includes(type)) {
        const titleEnValue: string = setValues.titleEn || (doc as any).titleEn || ''
        if (titleEnValue.trim()) {
          setValues.slugEn = toSlug(titleEnValue)
        }
      }

      // No auto-publish: publishing while this patch is in flight deletes the draft under it and crashes the Studio
      patch.execute([{ set: setValues }])
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
