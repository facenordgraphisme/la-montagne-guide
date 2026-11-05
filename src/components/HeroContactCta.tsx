import Link from '@/components/LocaleLink'
import { MessageCircle } from 'lucide-react'
import { getServerTranslations } from '@/i18n/server'

// The navbar Contact button only shows from the sm breakpoint up, so phones get one under the H1
export default async function HeroContactCta({ className = '' }: { className?: string }) {
  const { lang } = await getServerTranslations()
  return (
    <Link
      href="/contact"
      className={`sm:hidden inline-flex items-center gap-2 btn-primary !text-white text-sm font-black uppercase tracking-widest ${className}`}
    >
      <MessageCircle size={16} aria-hidden />
      {lang === 'en' ? 'Contact me' : 'Me contacter'}
    </Link>
  )
}
