import { cookies } from 'next/headers'
import { sanityTranslations } from './translations'
import en from './dictionaries/en.json'
import fr from './dictionaries/fr.json'

const dictionaries = { en, fr }

const normalize = (s: string) => s
  .toLowerCase()
  .trim()
  .replace(/[\u2013\u2014\u2015]/g, '-') // Normalize dashes
  .replace(/\s+/g, ' ')               // Normalize spaces

const normalizedDictionary: Record<string, string> = {}
Object.entries(sanityTranslations).forEach(([k, v]) => {
  normalizedDictionary[normalize(k)] = v
})

export async function getLanguage() {
  const cookieStore = await cookies()
  return (cookieStore.get('language')?.value || 'fr') as 'fr' | 'en'
}

export async function getServerTranslations() {
  const lang = await getLanguage()
  
  const t = (key: string) => {
    const keys = key.split('.')
    let value: any = (dictionaries as any)[lang]
    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k]
      } else {
        value = undefined
        break
      }
    }
    return value || key
  }

  const at = (text: any) => {
    if (!text) return ''
    
    if (typeof text === 'object' && (text.fr || text.en)) {
      return text[lang] || text['fr'] || ''
    }
    
    if (typeof text === 'string') {
      if (lang === 'fr') return text
      
      const normText = normalize(text)
      
      let result = (sanityTranslations as any)[text] || (normalizedDictionary as any)[normText]
      if (result) return result

      // Partial match for dates
      if (/\d+ [a-zA-Z-]+ \d+/.test(text)) {
        let dateText = text;
        Object.entries(normalizedDictionary).forEach(([k, v]) => {
          if (dateText.toLowerCase().includes(k)) {
            const regex = new RegExp(k, 'gi');
            dateText = dateText.replace(regex, v);
          }
        });
        return dateText;
      }
      
      return text
    }
    
    return String(text)
  }

  const translatePortableText = (blocks: any) => {
    if (!blocks) return blocks
    if (Array.isArray(blocks)) return blocks
    if (blocks[lang]) return blocks[lang]
    if (blocks['fr']) return blocks['fr']
    return blocks
  }

  return { t, at, lang, translatePortableText }
}
