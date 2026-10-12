export type LevelIcon = {
  label?: string
  labelEn?: string
  icon?: string
  description?: any[]
  descriptionEn?: any[]
}

const norm = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').trim().toLowerCase()

// Shared by the server page (to drop the hover tooltip) and the client panel
export function findLevelIcon(icons: LevelIcon[] | null | undefined, raw?: string | null) {
  if (!raw) return undefined
  return icons?.find(i => i.icon && i.label && norm(i.label) === norm(raw))
}
