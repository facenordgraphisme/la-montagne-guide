import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Lock } from 'lucide-react'
import { client } from '@/sanity/lib/live'
import { questionnaireBySlugQuery } from '@/sanity/lib/queries'
import { getServerTranslations } from '@/i18n/server'
import { decodeSlug } from '@/lib/localePath'
import QuestionnaireForm from '@/components/QuestionnaireForm'
import type { QStep } from '@/lib/questionnaire'

type Props = { params: Promise<{ slug: string }> }

// Private page, reached by link only: kept out of search engines and of the sitemap
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const [q, { at }] = await Promise.all([
    client.fetch(questionnaireBySlugQuery, { slug: decodeSlug(slug) }),
    getServerTranslations(),
  ])
  return {
    title: q ? `${at({ fr: q.title, en: q.titleEn })} | La Montagne Guide` : 'La Montagne Guide',
    robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
  }
}

export default async function QuestionnairePage({ params }: Props) {
  const { slug } = await params
  const [q, { at, lang }] = await Promise.all([
    client.fetch(questionnaireBySlugQuery, { slug: decodeSlug(slug) }),
    getServerTranslations(),
  ])
  if (!q) notFound()

  const L = (fr: string, en: string) => (lang === 'en' ? en : fr)
  const title = at({ fr: q.title, en: q.titleEn })
  const intro = at({ fr: q.intro, en: q.introEn })
  const steps: QStep[] = (q.steps || []).filter((s: QStep) => s.questions?.length)

  return (
    <main className="min-h-screen pt-40 md:pt-48 pb-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-2xl mx-auto">
          <span className="text-accent font-bold tracking-widest uppercase text-sm mb-4 block">{L('Inscription', 'Registration')}</span>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-6 text-gradient uppercase">{title}</h1>
          {intro && <p className="text-lg text-foreground/70 leading-relaxed whitespace-pre-line mb-10 !text-left">{intro}</p>}

          {q.closed ? (
            <div className="glass rounded-[32px] p-8 md:p-10 flex items-start gap-4">
              <Lock className="text-accent shrink-0 mt-1" size={24} aria-hidden />
              <p className="text-foreground/80 !text-left">
                {L(
                  'Les inscriptions pour ce questionnaire sont closes. Pour toute question, contactez-moi directement.',
                  'Registration for this form is closed. If you have any question, please get in touch directly.'
                )}
              </p>
            </div>
          ) : (
            <QuestionnaireForm
              id={q._id.replace(/^drafts\./, '')}
              slug={slug}
              title={q.title}
              steps={steps}
              confirmation={at({ fr: q.confirmation, en: q.confirmationEn }) || L('Merci ! Vos réponses sont bien enregistrées.', 'Thank you! Your answers have been saved.')}
            />
          )}
        </div>
      </div>
    </main>
  )
}
