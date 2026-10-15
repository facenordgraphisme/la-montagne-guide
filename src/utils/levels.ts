export type LevelIcon = {
  label?: string
  labelEn?: string
  icon?: string
  discipline?: string
  number?: string
  description?: any[]
  descriptionEn?: any[]
}

// Technical levels are defined per discipline in Settings; séjours only store a number (1–4)
export const LEVEL_DISCIPLINES = [
  { title: 'Alpinisme', value: 'alpinisme' },
  { title: 'Ski', value: 'ski' },
  { title: 'Escalade', value: 'escalade' },
  { title: 'Cascade de glace', value: 'cascade-de-glace' },
]

export const LEVEL_NUMBERS = [
  { title: '1', value: '1' },
  { title: '2', value: '2' },
  { title: '3', value: '3' },
  { title: '4', value: '4' },
]

// Which discipline's scale a séjour uses: explicit override, else derived from its activity
// (parapente → alpinisme, voyages → ski or escalade depending on the univers)
export function levelDiscipline(activityType?: string | null, override?: string | null, subCategorySlug?: string | null) {
  if (override) return override
  if (activityType === 'parapente-alpinisme') return 'alpinisme'
  if (activityType === 'voyages') return subCategorySlug?.includes('ski') ? 'ski' : 'escalade'
  return activityType || undefined
}

// Same rule in GROQ, evaluated from inside a settings array filter (hence the ^. prefix)
const groqDiscipline = `coalesce(^.levelDiscipline, select(
  ^.activityType == "parapente-alpinisme" => "alpinisme",
  ^.activityType == "voyages" && ^.subCategory->slug.current match "ski" => "ski",
  ^.activityType == "voyages" => "escalade",
  ^.activityType
))`

// Projects "level"/"levelEn" as display labels for cards and lists (legacy text values pass through)
export const levelLabelProjection = `
  "level": coalesce(*[_type == "settings"][0].technicalLevelIcons[number == ^.level && (!defined(discipline) || discipline == ${groqDiscipline})][0].label, level),
  "levelEn": coalesce(*[_type == "settings"][0].technicalLevelIcons[number == ^.level && (!defined(discipline) || discipline == ${groqDiscipline})][0].labelEn, *[_type == "settings"][0].technicalLevelIcons[label == ^.level][0].labelEn)`

const norm = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').trim().toLowerCase()

export function findLevelIcon(icons: LevelIcon[] | null | undefined, raw?: string | null, discipline?: string) {
  if (!raw) return undefined
  const value = raw.trim()
  if (/^\d+$/.test(value)) {
    return icons?.find(i => i.icon && i.number === value && (!i.discipline || !discipline || i.discipline === discipline))
  }
  // Legacy séjours that still store the full label
  return icons?.find(i => i.icon && i.label && norm(i.label) === norm(value))
}
