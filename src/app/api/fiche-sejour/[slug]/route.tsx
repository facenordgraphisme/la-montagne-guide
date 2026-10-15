import { renderToBuffer } from '@react-pdf/renderer'
import { client } from '@/sanity/lib/client'
import { sejourPdfQuery } from '@/lib/sejourPdf/query'
import { SejourPdf } from '@/lib/sejourPdf/SejourPdf'
import { autoFill, autoFillAll } from '@/lib/translate'

const SITE_URL = 'https://www.la-montagne-guide.fr'

// Generated on every request (route handlers aren't cached), so the PDF always reflects the current séjour
export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug: rawSlug } = await params
  let slug = rawSlug
  try { slug = decodeURIComponent(rawSlug).normalize('NFC') } catch {}
  const lang = new URL(request.url).searchParams.get('lang') === 'en' ? 'en' : 'fr'

  let sejour = await client.fetch(sejourPdfQuery, { slug })
  if (!sejour) return new Response('Séjour introuvable', { status: 404 })

  // Same DeepL fallback as the website for titles left empty in English
  if (lang === 'en') {
    sejour = await autoFill(sejour, [['title', 'titleEn']], lang)
    if (sejour.tabs?.length) sejour.tabs = await autoFillAll(sejour.tabs, [['title', 'titleEn']], lang)
    if (sejour.templateTabs?.length) sejour.templateTabs = await autoFillAll(sejour.templateTabs, [['title', 'titleEn']], lang)
  }

  const pagePath = lang === 'en' && sejour.slugEn
    ? `/en/${sejour.activitySlug}/${sejour.subCategory}/${sejour.slugEn}`
    : `/${sejour.activitySlug}/${sejour.subCategory}/${sejour.slug}`

  const pdf = await renderToBuffer(
    <SejourPdf
      sejour={sejour}
      lang={lang}
      logo={new URL('/logo-pdf.png', request.url).toString()}
      siteUrl={SITE_URL}
      pageUrl={encodeURI(`${SITE_URL}${pagePath}`)}
    />
  )

  const fileName = `${lang === 'en' ? 'trip-sheet' : 'fiche-sejour'}-${(lang === 'en' && sejour.slugEn) || sejour.slug}.pdf`
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
  return new Response(new Uint8Array(pdf), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="${fileName}"`,
      'Cache-Control': 'no-store',
      'X-Robots-Tag': 'noindex',
    },
  })
}
