// Shared by the sign-up form (client) and /api/questionnaire (server)

export type QuestionKind = 'short' | 'long' | 'single' | 'multiple' | 'date' | 'number' | 'yesno'

export type QOption = { _key: string; label: string; labelEn?: string }
export type QQuestion = {
  _key: string
  label: string
  labelEn?: string
  help?: string
  helpEn?: string
  kind: QuestionKind
  required?: boolean
  options?: QOption[]
}
export type QStep = { _key: string; title: string; titleEn?: string; questions?: QQuestion[] }

// short/long/date/number: text · single: option key · multiple: option keys · yesno: 'yes' | 'no'
export type AnswerValue = string | string[]
export type Answers = Record<string, AnswerValue>
export type Contact = { firstName: string; lastName: string; email: string; phone: string }

export const MAX_TEXT = 5000
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const DATE = /^\d{4}-\d{2}-\d{2}$/

type Lang = 'fr' | 'en'
const L = (lang: Lang, fr: string, en: string) => (lang === 'en' ? en : fr)

const isEmpty = (v: AnswerValue | undefined) => (Array.isArray(v) ? v.length === 0 : !v || !String(v).trim())

// Returns an error message, or null when the answer is acceptable
export function questionError(q: QQuestion, value: AnswerValue | undefined, lang: Lang): string | null {
  if (isEmpty(value)) return q.required ? L(lang, 'Merci de répondre à cette question.', 'Please answer this question.') : null
  const keys = new Set((q.options || []).map((o) => o._key))
  switch (q.kind) {
    case 'short':
    case 'long':
      return typeof value === 'string' && value.length <= MAX_TEXT ? null : L(lang, 'Réponse trop longue.', 'Answer too long.')
    case 'number':
      return typeof value === 'string' && value.trim() !== '' && Number.isFinite(Number(value.replace(',', '.')))
        ? null
        : L(lang, 'Merci d’indiquer un nombre.', 'Please enter a number.')
    case 'date':
      return typeof value === 'string' && DATE.test(value) && !Number.isNaN(Date.parse(value))
        ? null
        : L(lang, 'Date invalide.', 'Invalid date.')
    case 'single':
      return typeof value === 'string' && keys.has(value) ? null : L(lang, 'Choix invalide.', 'Invalid choice.')
    case 'multiple':
      return Array.isArray(value) && value.every((k) => keys.has(k)) ? null : L(lang, 'Choix invalide.', 'Invalid choice.')
    case 'yesno':
      return value === 'yes' || value === 'no' ? null : L(lang, 'Choix invalide.', 'Invalid choice.')
    default:
      return null
  }
}

export function contactErrors(c: Partial<Contact>, lang: Lang): Partial<Record<keyof Contact, string>> {
  const errors: Partial<Record<keyof Contact, string>> = {}
  const required = L(lang, 'Champ obligatoire.', 'Required field.')
  if (!c.firstName?.trim()) errors.firstName = required
  if (!c.lastName?.trim()) errors.lastName = required
  if (!c.email?.trim()) errors.email = required
  else if (!EMAIL.test(c.email.trim())) errors.email = L(lang, 'Adresse e-mail invalide.', 'Invalid email address.')
  for (const k of ['firstName', 'lastName', 'email', 'phone'] as const) {
    if ((c[k] || '').length > 200) errors[k] = L(lang, 'Trop long.', 'Too long.')
  }
  return errors
}

// Human-readable answer, always in French (the guide reads the responses in French)
export function formatAnswer(q: QQuestion, value: AnswerValue | undefined): string {
  if (isEmpty(value)) return '—'
  const label = (k: string) => q.options?.find((o) => o._key === k)?.label || k
  switch (q.kind) {
    case 'single':
      return label(value as string)
    case 'multiple':
      return (value as string[]).map(label).join(', ')
    case 'yesno':
      return value === 'yes' ? 'Oui' : 'Non'
    case 'date': {
      const [y, m, d] = String(value).split('-')
      return `${d}/${m}/${y}`
    }
    default:
      return String(value).trim()
  }
}
