import { NextResponse } from 'next/server'
import { createClient } from 'next-sanity'
import { questionError, contactErrors, formatAnswer, type Answers, type Contact, type QStep } from '@/lib/questionnaire'

const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-05-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
  perspective: 'published',
})

// Re-read from Sanity (never trust the labels sent by the browser): published version only
const QUERY = `*[_type == "questionnaire" && _id == $id][0]{
  _id, title, closed,
  steps[]{ _key, title, questions[]{ _key, label, kind, required, options[]{ _key, label } } }
}`

export async function POST(request: Request) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- untrusted JSON, checked field by field below
  let body: Record<string, any> | null
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'invalid' }, { status: 400 })
  }

  const { questionnaireId, contact, answers, website } = body || {}
  const lang = body?.lang === 'en' ? 'en' : 'fr'

  // Honeypot filled in: a bot. Pretend it worked.
  if (website) return NextResponse.json({ ok: true, summary: '' })

  if (typeof questionnaireId !== 'string' || !contact || typeof answers !== 'object' || answers === null) {
    return NextResponse.json({ error: 'invalid' }, { status: 400 })
  }

  try {
    const q = await writeClient.fetch(QUERY, { id: questionnaireId })
    if (!q) return NextResponse.json({ error: 'not_found' }, { status: 404 })
    if (q.closed) return NextResponse.json({ error: 'closed' }, { status: 410 })

    const c: Contact = {
      firstName: String(contact.firstName || '').trim(),
      lastName: String(contact.lastName || '').trim(),
      email: String(contact.email || '').trim(),
      phone: String(contact.phone || '').trim(),
    }
    if (Object.keys(contactErrors(c, lang)).length) return NextResponse.json({ error: 'invalid' }, { status: 400 })

    const a = answers as Answers
    const rows: { _key: string; _type: string; step: string; question: string; answer: string }[] = []
    for (const step of (q.steps || []) as QStep[]) {
      for (const question of step.questions || []) {
        const value = a[question._key]
        if (questionError(question, value, lang)) return NextResponse.json({ error: 'invalid', question: question._key }, { status: 400 })
        rows.push({ _key: question._key, _type: 'questionnaireAnswer', step: step.title, question: question.label, answer: formatAnswer(question, value) })
      }
    }

    await writeClient.create({
      _type: 'questionnaireResponse',
      questionnaire: { _type: 'reference', _ref: q._id, _weak: true },
      questionnaireTitle: q.title,
      submittedAt: new Date().toISOString(),
      handled: false,
      lang,
      ...c,
      answers: rows,
    })

    // Plain-text summary, sent by email from the browser with the contact form's EmailJS template
    const lines = [`Questionnaire : ${q.title}`, '']
    let lastStep = ''
    for (const r of rows) {
      if (r.step !== lastStep) {
        lines.push('', `— ${r.step.toUpperCase()} —`)
        lastStep = r.step
      }
      lines.push(`${r.question}`, `→ ${r.answer}`)
    }
    lines.push('', 'Réponses également disponibles dans le Studio : Questionnaires.')

    return NextResponse.json({ ok: true, summary: lines.join('\n').replace(/\n{3,}/g, '\n\n') })
  } catch (error) {
    console.error('Questionnaire submission error:', error)
    // Sanity's status code and short reason (never contains the token): makes production issues diagnosable
    const e = error as { statusCode?: number; message?: string }
    return NextResponse.json(
      { error: 'server', status: e?.statusCode, detail: String(e?.message || '').slice(0, 200) },
      { status: 500 }
    )
  }
}
