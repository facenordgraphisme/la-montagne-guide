export function formatFriendlyDate(dateStr: string, locale: 'fr' | 'en' = 'fr'): string {
  if (!dateStr) return '';
  // Try to parse YYYY-MM-DD
  const match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) {
    // Fallback if it's already an ISO string or other format
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      const year = d.getUTCFullYear().toString();
      const monthIdx = d.getUTCMonth();
      const day = d.getUTCDate().toString();
      return format(year, monthIdx, day, locale);
    } catch (e) {
      return dateStr;
    }
  }

  const year = match[1];
  const monthIdx = parseInt(match[2], 10) - 1;
  const day = parseInt(match[3], 10).toString();
  return format(year, monthIdx, day, locale);
}

function format(year: string, monthIdx: number, day: string, locale: 'fr' | 'en'): string {
  const monthsFr = [
    'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
    'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'
  ];
  const monthsEn = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const monthName = locale === 'fr' ? monthsFr[monthIdx] : monthsEn[monthIdx];
  return locale === 'fr' ? `${day} ${monthName} ${year}` : `${monthName} ${day}, ${year}`;
}
