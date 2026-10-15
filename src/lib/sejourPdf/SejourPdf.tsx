/* eslint-disable jsx-a11y/alt-text -- react-pdf <Image> has no alt attribute */
import React from 'react'
import { Document, Page, View, Text, Image, Link, StyleSheet } from '@react-pdf/renderer'
import { findLevelIcon, levelDiscipline } from '@/utils/levels'
import { sortiePeriod, spotsLeft } from '@/utils/dates'

const ACCENT = '#0ea5e9'
const HIGHLIGHT = '#f97316'
const INK = '#18181b'
const MUTED = '#71717a'
const LINE = '#e4e4e7'
const LH = '14.5pt' // absolute: a bare ratio gets re-applied on nested span <Text>s, and a bare number makes react-pdf loop

// Built-in Helvetica only covers WinAnsi: swap the few characters Sanity text often contains that it can't draw
const clean = (s?: string | null) => (s || '')
  .replace(/[   ]/g, ' ')
  .replace(/[‐‑]/g, '-')
  .replace(/[→⟶]/g, '>')
  .replace(/[✓✔✅]/g, '-')
  .replace(/[\u{1F000}-\u{1FAFF}☀-➿️]/gu, '')

const s = StyleSheet.create({
  page: { paddingTop: 36, paddingBottom: 60, paddingHorizontal: 40, fontFamily: 'Helvetica', fontSize: 10, color: INK },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  logo: { height: 32, width: 160, objectFit: 'contain' },
  headerRight: { alignItems: 'flex-end' },
  kicker: { fontSize: 8, fontFamily: 'Helvetica-Bold', color: ACCENT, textTransform: 'uppercase', letterSpacing: 1.5 },
  small: { fontSize: 8, color: MUTED },
  cover: { width: '100%', height: 210, objectFit: 'cover', borderRadius: 10, marginBottom: 16 },
  title: { fontSize: 22, fontFamily: 'Helvetica-Bold', lineHeight: 1.15, marginTop: 4, marginBottom: 10, textTransform: 'uppercase' },
  ficheBox: { borderWidth: 1, borderColor: LINE, borderRadius: 10, padding: 14, marginVertical: 14 },
  ficheTitle: { fontSize: 11, fontFamily: 'Helvetica-Bold', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 },
  ficheGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  ficheCell: { width: '50%', paddingVertical: 5, paddingRight: 10 },
  ficheLabel: { fontSize: 7.5, fontFamily: 'Helvetica-Bold', color: MUTED, textTransform: 'uppercase', letterSpacing: 1 },
  ficheValue: { fontSize: 10.5, fontFamily: 'Helvetica-Bold', marginTop: 1 },
  price: { fontFamily: 'Helvetica-Bold', color: HIGHLIGHT },
  sectionTitle: { fontSize: 14, fontFamily: 'Helvetica-Bold', textTransform: 'uppercase', marginTop: 18, marginBottom: 8, paddingLeft: 8, borderLeftWidth: 3, borderLeftColor: ACCENT },
  dateRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5, borderBottomWidth: 1, borderBottomColor: LINE },
  // lineHeight lives on text styles, not on the Page: inherited by the fixed footer it stops it rendering
  p: { marginBottom: 5, lineHeight: LH },
  h2: { fontSize: 12.5, fontFamily: 'Helvetica-Bold', marginTop: 8, marginBottom: 4 },
  h3: { fontSize: 11, fontFamily: 'Helvetica-Bold', marginTop: 6, marginBottom: 3 },
  quote: { borderLeftWidth: 3, borderLeftColor: ACCENT, backgroundColor: '#f0f9ff', paddingVertical: 6, paddingHorizontal: 10, marginVertical: 6, fontFamily: 'Helvetica-Oblique', lineHeight: LH },
  encart: { borderWidth: 1, borderColor: '#fed7aa', backgroundColor: '#fff7ed', borderRadius: 8, padding: 10, marginVertical: 8 },
  encartTitle: { fontSize: 11.5, fontFamily: 'Helvetica-Bold', textTransform: 'uppercase', marginBottom: 3 },
  li: { flexDirection: 'row', marginBottom: 3, lineHeight: LH },
  bullet: { width: 12, color: ACCENT },
  image: { width: '100%', maxHeight: 260, objectFit: 'cover', borderRadius: 6, marginVertical: 6 },
  link: { color: ACCENT, textDecoration: 'underline' },
  cgv: { fontSize: 7.5, lineHeight: '10.5pt' },
  footer: { position: 'absolute', bottom: 22, left: 40, right: 40, flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: LINE, paddingTop: 6, fontSize: 7, color: MUTED },
})

/* ---------- Portable Text → react-pdf ---------- */

const fontFor = (marks: string[]) => {
  const b = marks.includes('strong'), i = marks.includes('em')
  return b && i ? 'Helvetica-BoldOblique' : b ? 'Helvetica-Bold' : i ? 'Helvetica-Oblique' : undefined
}

function Spans({ block }: { block: any }) {
  const defs: any[] = block.markDefs || []
  return (
    <>
      {(block.children || []).map((child: any, i: number) => {
        const marks: string[] = child.marks || []
        const text = clean(child.text)
        const font = fontFor(marks)
        const link = defs.find(d => marks.includes(d._key) && d._type === 'link' && d.href)
        if (link) return <Link key={i} src={link.href} style={[s.link, font ? { fontFamily: font } : {}]}>{text}</Link>
        return <Text key={i} style={font ? { fontFamily: font } : undefined}>{text}</Text>
      })}
    </>
  )
}

const isEmptyBlock = (b: any) => b._type === 'block' && !(b.children || []).some((c: any) => c.text?.trim())
const align = (style?: string) =>
  style === 'blockCenter' ? 'center' : style === 'blockRight' ? 'right' : style === 'blockJustify' ? 'justify' : undefined

// size ≈ characters, used to avoid gluing a heading to a block taller than a page (react-pdf loops forever on those)
type PdfNode = { node: React.ReactElement; heading?: boolean; spacer?: boolean; size?: number }

const textLength = (b: any) => (b.children || []).reduce((n: number, c: any) => n + (c.text?.length || 0), 0)

function richNodes(blocks: any[] | null | undefined, baseStyle?: any): PdfNode[] {
  if (!blocks?.length) return []
  const out: PdfNode[] = []
  let i = 0
  while (i < blocks.length) {
    const b = blocks[i]
    // Consecutive list items → one list (numbering restarts per list); one node per item so a heading only drags the first along
    if (b._type === 'block' && b.listItem) {
      const items: any[] = []
      while (i < blocks.length && blocks[i]._type === 'block' && blocks[i].listItem) items.push(blocks[i++])
      items.forEach((it, n) => out.push({
        size: textLength(it),
        node: (
          <View key={`l${i}-${n}`} style={[s.li, { paddingLeft: ((it.level || 1) - 1) * 12 }, n === items.length - 1 ? { marginBottom: 6 } : {}]} wrap={false}>
            <Text style={s.bullet}>{it.listItem === 'number' ? `${n + 1}.` : '•'}</Text>
            <Text style={[{ flex: 1 }, baseStyle]}><Spans block={it} /></Text>
          </View>
        ),
      }))
      continue
    }
    // Consecutive "Encart" blocks → one card, first one is its title (same rule as the website)
    if (b._type === 'block' && b.style === 'encart') {
      const group: any[] = []
      while (i < blocks.length && blocks[i]._type === 'block' && blocks[i].style === 'encart') group.push(blocks[i++])
      out.push({
        size: 2000, // cards can be long: never glued, and allowed to break
        node: (
          <View key={`e${i}`} style={s.encart}>
            {group.map((g, n) => <Text key={n} style={n === 0 ? s.encartTitle : s.p}><Spans block={g} /></Text>)}
          </View>
        ),
      })
      continue
    }
    i++
    if (b._type === 'image' && b.url) {
      out.push({ size: 400, node: <Image key={`i${i}`} style={s.image} src={`${b.url}?w=1000&fm=jpg&q=75`} /> })
      continue
    }
    if (b._type !== 'block') continue // maps, CTA buttons… have no meaning on paper
    if (isEmptyBlock(b)) { out.push({ spacer: true, node: <View key={`s${i}`} style={{ height: 4 }} /> }); continue }
    const heading = b.style === 'h2' || b.style === 'h3'
    const style = b.style === 'h2' ? s.h2 : b.style === 'h3' ? s.h3 : b.style === 'blockquote' ? s.quote : s.p
    out.push({
      heading,
      size: textLength(b),
      node: (
        <Text key={`b${i}`} style={[style, heading ? {} : baseStyle, align(b.style) ? { textAlign: align(b.style) } : {}]}>
          <Spans block={b} />
        </Text>
      ),
    })
  }
  return out
}

// Headings never end a page alone: each one is glued to the next piece of content
function KeepWithNext({ nodes }: { nodes: PdfNode[] }) {
  const out: React.ReactNode[] = []
  for (let i = 0; i < nodes.length; i++) {
    if (!nodes[i].heading) { out.push(nodes[i].node); continue }
    const group = [nodes[i].node]
    while (nodes[i + 1]?.spacer) i++
    while (nodes[i + 1]?.heading) group.push(nodes[++i].node)
    const next = nodes[i + 1]
    if (next && (next.size ?? 0) < 700) {
      group.push(nodes[++i].node)
      out.push(<View key={`k${i}`} wrap={false}>{group}</View>)
    } else {
      // Long block: it can't be glued, so just ask for a few lines of room after the heading(s)
      out.push(<View key={`k${i}`} wrap={false} minPresenceAhead={50}>{group}</View>)
    }
  }
  return <>{out}</>
}

const RichText = ({ blocks, baseStyle }: { blocks?: any[] | null; baseStyle?: any }) =>
  <KeepWithNext nodes={richNodes(blocks, baseStyle)} />

/* ---------- Document ---------- */

export type PdfSejour = any

export function SejourPdf({ sejour, lang, logo, siteUrl, pageUrl }: { sejour: PdfSejour; lang: 'fr' | 'en'; logo?: string; siteUrl: string; pageUrl: string }) {
  const en = lang === 'en'
  const pick = (fr?: any, enValue?: any) => (en && (Array.isArray(enValue) ? enValue.length : enValue) ? enValue : fr)
  const L = (fr: string, enText: string) => (en ? enText : fr)

  const settings = sejour.settings || {}
  const discipline = levelDiscipline(sejour.activityType, sejour.levelDiscipline, sejour.subCategory)
  const levelLabel = (icons: any[], raw?: string) => {
    const m = findLevelIcon(icons?.map(i => ({ ...i, icon: 'x' })), raw, discipline)
    return m ? pick(m.label, m.labelEn) : raw
  }

  const fiche: [string, React.ReactNode][] = ([
    [L('Durée', 'Duration'), pick(sejour.duration, sejour.durationEn)],
    [L('Massif', 'Area'), sejour.massif],
    [L('Niveau technique', 'Technical level'), sejour.level && levelLabel(settings.technicalLevelIcons, sejour.level)],
    [L('Niveau physique', 'Physical level'), sejour.physicalLevel && levelLabel(settings.physicalLevelIcons, sejour.physicalLevel)],
    [L('Participants', 'Group size'), pick(sejour.participants, sejour.participantsEn)],
    [L('Période', 'Season'), pick(sejour.period, sejour.periodEn)],
  ] as [string, any][]).filter(([, v]) => v)

  const prices: [string, string][] = (sejour.prixToutCompris
    ? [[L('Tout compris', 'All inclusive'), pick(sejour.prixToutComprisAmount, sejour.prixToutComprisAmountEn)]]
    : [
        [L('Encadrement', 'Guiding'), pick(sejour.priceEncadrement, sejour.priceEncadrementEn)],
        [L('Frais de séjour', 'Trip costs'), pick(sejour.priceFraisSejour, sejour.priceFraisSejourEn)],
      ]) as [string, string][]
  const shownPrices = prices.filter(([, v]) => v)
  const basePrice = pick(sejour.basePrice, sejour.basePriceEn)

  // Same tab order as the website: template tabs, custom tabs, then the legacy fixed sections
  const sections = [
    ...(sejour.templateTabs || []), ...(sejour.tabs || []),
  ].map((t: any) => ({ title: pick(t.title, t.titleEn), content: pick(t.content, t.contentEn), pdf: t.pdf }))
    .concat([
      { title: L('Programme', 'Itinerary'), content: sejour.programme, pdf: null },
      { title: 'Budget', content: sejour.budget, pdf: null },
      { title: L('Infos pratiques', 'Practical information'), content: sejour.infosPratiques, pdf: null },
      { title: L('Matériel', 'Equipment'), content: sejour.materiel, pdf: sejour.materielPdf },
    ])
    .filter(t => t.title && (t.content?.some((b: any) => !isEmptyBlock(b)) || t.pdf))

  const cgv = sejour.cgv
  const today = new Intl.DateTimeFormat(en ? 'en-GB' : 'fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date())
  const title = clean(pick(sejour.title, sejour.titleEn))

  const footer = (
    <View style={s.footer} fixed>
      <Text>{clean(['La Montagne Guide', settings.phone, settings.email, siteUrl.replace(/^https?:\/\//, '')].filter(Boolean).join('  ·  '))}</Text>
      <Text render={({ pageNumber, totalPages }) => `${L('Fiche à jour au', 'Updated')} ${today}  ·  ${pageNumber}/${totalPages}`} />
    </View>
  )

  return (
    <Document title={title} author="La Montagne Guide" subject={L('Fiche séjour', 'Trip sheet')} language={lang}>
      <Page size="A4" style={s.page}>
        <View style={s.header}>
          {logo ? <Image src={logo} style={s.logo} /> : <Text style={s.kicker}>La Montagne Guide</Text>}
          <View style={s.headerRight}>
            <Text style={s.kicker}>{L('Fiche séjour', 'Trip sheet')}</Text>
            <Link src={pageUrl} style={[s.small, { textDecoration: 'none' }]}>{L('Voir en ligne', 'View online')}</Link>
          </View>
        </View>

        {sejour.image && <Image src={`${sejour.image}?w=1200&h=520&fit=crop&fm=jpg&q=80`} style={s.cover} />}
        <Text style={s.title}>{title}</Text>
        <RichText blocks={pick(sejour.description, sejour.descriptionEn)} />

        {(fiche.length > 0 || basePrice || shownPrices.length > 0) && (
          <View style={s.ficheBox} wrap={false}>
            <Text style={s.ficheTitle}>{L('Fiche technique', 'Key facts')}</Text>
            <View style={s.ficheGrid}>
              {fiche.map(([label, value]) => (
                <View key={label} style={s.ficheCell}>
                  <Text style={s.ficheLabel}>{label}</Text>
                  <Text style={s.ficheValue}>{clean(String(value))}</Text>
                </View>
              ))}
              {basePrice && (
                <View style={s.ficheCell}>
                  <Text style={s.ficheLabel}>{L('À partir de', 'From')}</Text>
                  <Text style={[s.ficheValue, s.price]}>{clean(basePrice)}</Text>
                </View>
              )}
              {shownPrices.map(([label, value]) => (
                <View key={label} style={s.ficheCell}>
                  <Text style={s.ficheLabel}>{label}</Text>
                  <Text style={[s.ficheValue, s.price]}>{clean(value)}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {sejour.upcomingSorties?.length > 0 && (
          <View wrap={false}>
            <Text style={s.sectionTitle}>{L('Prochains départs', 'Upcoming dates')}</Text>
            {sejour.upcomingSorties.map((d: any, n: number) => {
              const spots = spotsLeft(d.availableSpots)
              const status = d.isFull || spots === 0
                ? L('Complet', 'Full')
                : [d.isConfirmed && L('Départ assuré', 'Guaranteed departure'), spots !== undefined && (en ? `${spots} spot${spots > 1 ? 's' : ''} left` : `${spots} place${spots > 1 ? 's' : ''} restante${spots > 1 ? 's' : ''}`)].filter(Boolean).join('  ·  ')
              return (
                <View key={n} style={s.dateRow}>
                  <Text style={{ fontFamily: 'Helvetica-Bold' }}>{clean(sortiePeriod(d, lang))}</Text>
                  <Text style={{ color: d.isFull ? '#dc2626' : MUTED }}>{status}</Text>
                </View>
              )
            })}
          </View>
        )}

        {sections.map((t, n) => (
          <View key={n}>
            <KeepWithNext nodes={[{ heading: true, node: <Text key="t" style={s.sectionTitle}>{clean(t.title)}</Text> }, ...richNodes(t.content)]} />
            {t.pdf && (
              <Link src={t.pdf} style={[s.link, { marginTop: 4 }]}>{L('Télécharger le document PDF associé', 'Download the related PDF document')}</Link>
            )}
          </View>
        ))}
        {footer}
      </Page>

      {cgv && (
        <Page size="A4" style={s.page}>
          <KeepWithNext nodes={[{ heading: true, node: <Text key="t" style={[s.sectionTitle, { marginTop: 0 }]}>{clean(pick(cgv.title, cgv.titleEn))}</Text> }, ...richNodes(pick(cgv.content, cgv.contentEn), s.cgv)]} />
          {footer}
        </Page>
      )}
    </Document>
  )
}
