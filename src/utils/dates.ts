// Formats a sortie's period from its ISO dates ("2027-03-20") — e.g. "20 – 27 mars 2027", "31 janv. – 5 févr. 2027"
export function formatDateRange(start?: string | null, end?: string | null, lang: string = 'fr') {
  if (!start) return ''
  const locale = lang === 'en' ? 'en-GB' : 'fr-FR'
  // Dates are calendar days: format in UTC so the day never shifts with the visitor's timezone
  const fmt = (iso: string, opts: Intl.DateTimeFormatOptions) =>
    new Intl.DateTimeFormat(locale, { timeZone: 'UTC', ...opts }).format(new Date(`${iso}T00:00:00Z`))
  const full: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' }
  if (!end || end <= start) return fmt(start, full)

  const sameYear = start.slice(0, 4) === end.slice(0, 4)
  const sameMonth = sameYear && start.slice(5, 7) === end.slice(5, 7)
  const from = sameMonth
    ? fmt(start, { day: 'numeric' })
    : fmt(start, sameYear ? { day: 'numeric', month: 'short' } : full)
  return `${from} – ${fmt(end, full)}`
}

// Display period of a sortie: computed from its dates, legacy free-text "date" only as fallback
export function sortiePeriod(s: { startDate?: string | null; endDate?: string | null; date?: string | null }, lang: string = 'fr') {
  return s.startDate ? formatDateRange(s.startDate, s.endDate, lang) : (s.date || '')
}

// Remaining spots as a number (field is free text in older documents, e.g. "4 places")
export function spotsLeft(availableSpots?: string | number | null) {
  if (availableSpots == null) return undefined
  const m = String(availableSpots).match(/\d+/)
  return m ? parseInt(m[0], 10) : undefined
}
