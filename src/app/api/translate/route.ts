import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { texts } = await req.json()

  if (!Array.isArray(texts) || texts.length === 0) {
    return NextResponse.json({ translations: [] })
  }

  const key = process.env.DEEPL_API_KEY
  if (!key) {
    return NextResponse.json({ error: 'DEEPL_API_KEY not configured' }, { status: 500 })
  }

  try {
    const res = await fetch('https://api-free.deepl.com/v2/translate', {
      method: 'POST',
      headers: {
        'Authorization': `DeepL-Auth-Key ${key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: texts, source_lang: 'FR', target_lang: 'EN' }),
    })

    if (!res.ok) {
      const err = await res.text()
      return NextResponse.json({ error: err }, { status: 502 })
    }

    const data = await res.json()
    return NextResponse.json({
      translations: data.translations.map((t: any) => t.text),
    })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
