import { unstable_cache } from 'next/cache'

const DEEPL_ENDPOINT = 'https://api-free.deepl.com/v2/translate'

const translateText = unstable_cache(
  async (text: string): Promise<string> => {
    const key = process.env.DEEPL_API_KEY
    if (!key || !text?.trim()) return text
    try {
      const res = await fetch(DEEPL_ENDPOINT, {
        method: 'POST',
        headers: {
          'Authorization': `DeepL-Auth-Key ${key}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: [text], source_lang: 'FR', target_lang: 'EN' }),
        cache: 'no-store',
      })
      if (!res.ok) return text
      const data = await res.json()
      return data.translations?.[0]?.text ?? text
    } catch {
      return text
    }
  },
  ['deepl-fr-en'],
  { revalidate: false }
)

// Fill missing EN string fields in a data object.
// pairs: [['frField', 'enField'], ...]
// Only translates when lang === 'en' AND enField is empty.
export async function autoFill(
  obj: Record<string, any>,
  pairs: [string, string][],
  lang: string
): Promise<Record<string, any>> {
  if (lang !== 'en') return obj
  const result = { ...obj }
  await Promise.all(
    pairs.map(async ([frKey, enKey]) => {
      const fr = result[frKey]
      const en = result[enKey]
      if (fr && typeof fr === 'string' && !en?.trim()) {
        result[enKey] = await translateText(fr)
      }
    })
  )
  return result
}

// Process an array of objects (e.g. tabs, blog posts).
export async function autoFillAll(
  items: Record<string, any>[],
  pairs: [string, string][],
  lang: string
): Promise<Record<string, any>[]> {
  if (lang !== 'en') return items
  return Promise.all(items.map(item => autoFill(item, pairs, lang)))
}
