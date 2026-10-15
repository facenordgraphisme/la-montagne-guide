// Converts levels from free text to numbers (1–4) resolved per discipline.
//   node scripts/migrate-levels.mjs settings   → tags each settings level with its discipline + number (safe anytime)
//   node scripts/migrate-levels.mjs sejours    → replaces séjour labels by numbers (run once the new code is deployed)
// Add --dry to preview without writing.
import { createClient } from '@sanity/client'
import fs from 'fs'

for (const l of fs.readFileSync('.env', 'utf8').split('\n')) {
  const m = l.match(/^([A-Z_]+)=(.*)$/)
  if (m) process.env[m[1]] = m[2].replace(/^"|"$/g, '').trim()
}
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})
const [step] = process.argv.slice(2)
const dry = process.argv.includes('--dry')

const norm = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').trim().toLowerCase()
const disciplineOf = label => {
  const l = norm(label)
  if (l.includes('alpiniste')) return 'alpinisme'
  if (l.includes('skieur')) return 'ski'
  if (l.includes('grimpeur')) return 'escalade'
  if (l.includes('glacieriste')) return 'cascade-de-glace'
}
const technicalNumber = label => {
  const l = norm(label)
  if (l.includes('debutant')) return '1'
  if (l.startsWith('tres bon')) return '3'
  if (l.startsWith('bon')) return '2'
  if (l.startsWith('excellent')) return '4'
}
const physicalNumbers = { actif: '1', prepare: '2', entraine: '3', affute: '4' }

if (step === 'settings') {
  const s = await client.fetch(`*[_id == "settings"][0]{ technicalLevelIcons, physicalLevelIcons }`)
  const technical = s.technicalLevelIcons.map(i => ({ ...i, discipline: i.discipline || disciplineOf(i.label), number: i.number || technicalNumber(i.label) }))
  const physical = s.physicalLevelIcons.map(i => ({ ...i, number: i.number || physicalNumbers[norm(i.label)] }))
  for (const i of [...technical, ...physical]) console.log(i.label, '→', i.discipline || '-', i.number)
  if (!dry) await client.patch('settings').set({ technicalLevelIcons: technical, physicalLevelIcons: physical }).commit()
} else if (step === 'sejours') {
  const sejours = await client.fetch(`*[_type == "sejour"]{ _id, activityType, level, physicalLevel, levelDiscipline }`, {}, { perspective: 'raw' })
  const tx = client.transaction()
  for (const sj of sejours) {
    const set = {}
    if (sj.level && !/^\d$/.test(sj.level)) {
      const n = technicalNumber(sj.level)
      if (n) set.level = n
      else console.warn('⚠ niveau technique non reconnu', sj._id, sj.level)
      if (sj.activityType === 'voyages' && !sj.levelDiscipline && disciplineOf(sj.level)) set.levelDiscipline = disciplineOf(sj.level)
    }
    if (sj.physicalLevel && !/^\d$/.test(sj.physicalLevel)) {
      const n = physicalNumbers[norm(sj.physicalLevel)]
      if (n) set.physicalLevel = n
      else console.warn('⚠ niveau physique non reconnu', sj._id, sj.physicalLevel)
    }
    if (Object.keys(set).length) {
      console.log(sj._id, sj.level, '/', sj.physicalLevel, '→', set)
      tx.patch(sj._id, p => p.set(set))
    }
  }
  if (!dry) await tx.commit()
} else {
  console.log('Usage: node scripts/migrate-levels.mjs settings|sejours [--dry]')
}
