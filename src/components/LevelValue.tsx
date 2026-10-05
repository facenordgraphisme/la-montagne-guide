/* eslint-disable @next/next/no-img-element */
export type LevelIcon = { label?: string; labelEn?: string; icon?: string }

const norm = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').trim().toLowerCase()

export function LevelValue({ raw, text, icons, showText = true, lang = 'fr' }: {
  raw?: string
  text?: string
  icons?: LevelIcon[] | null
  showText?: boolean | null
  lang?: string
}) {
  if (!text) return null
  const match = raw ? icons?.find(i => i.icon && i.label && norm(i.label) === norm(raw)) : undefined
  if (!match) return <>{text}</>
  const label = lang === 'en' ? (match.labelEn || text) : text
  return (
    <span className="inline-flex items-center justify-end gap-2">
      <img src={match.icon} alt={label} title={label} className="h-7 w-auto" />
      {showText !== false && <span>{label}</span>}
    </span>
  )
}
