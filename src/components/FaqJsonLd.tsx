type Faq = { question?: string; questionEn?: string; answer?: string; answerEn?: string } | null | undefined

export default function FaqJsonLd({ faqs, lang }: { faqs?: Faq[] | null; lang: string }) {
  const seen = new Set<string>()
  const mainEntity = (faqs || []).flatMap(f => {
    const name = (lang === 'en' ? f?.questionEn || f?.question : f?.question)?.trim()
    const text = (lang === 'en' ? f?.answerEn || f?.answer : f?.answer)?.trim()
    if (!name || !text || seen.has(name)) return []
    seen.add(name)
    return [{ '@type': 'Question', name, acceptedAnswer: { '@type': 'Answer', text } }]
  })
  if (!mainEntity.length) return null

  const json = JSON.stringify({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity })
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json.replace(/</g, '\\u003c') }} />
}
