'use client'

import { useState } from 'react'
import { PortableText } from '@portabletext/react'
import type { PortableTextComponents } from '@portabletext/react'
import { Download, FileText } from 'lucide-react'
import Link from 'next/link'
import { useLanguage } from '@/context/LanguageContext'
import FAQAccordion from './FAQAccordion'

interface Tab {
  id: string
  label: string
  content: any[] | null
  pdf?: string | null
  faqs?: any[]
}

interface SejourTabsProps {
  tabs: Tab[]
}

const isChildrenEmpty = (children: any) => {
  if (!children) return true;
  if (Array.isArray(children)) {
    return children.length === 0 || (children.length === 1 && (children[0] === '' || children[0] === null));
  }
  return children === '';
};

export default function SejourTabs({ tabs }: SejourTabsProps) {
  const { at, language } = useLanguage()

  const portableTextComponents: PortableTextComponents = {
    block: {
      blockCenter: ({ children }) => {
        const isEmpty = isChildrenEmpty(children);
        return <p style={{ textAlign: 'center', minHeight: isEmpty ? '1.5em' : undefined }}>{isEmpty ? ' ' : children}</p>;
      },
      blockRight: ({ children }) => {
        const isEmpty = isChildrenEmpty(children);
        return <p style={{ textAlign: 'right', minHeight: isEmpty ? '1.5em' : undefined }}>{isEmpty ? ' ' : children}</p>;
      },
      blockJustify: ({ children }) => {
        const isEmpty = isChildrenEmpty(children);
        return <p style={{ textAlign: 'justify', minHeight: isEmpty ? '1.5em' : undefined }}>{isEmpty ? ' ' : children}</p>;
      },
      normal: ({ children }) => {
        const isEmpty = isChildrenEmpty(children);
        return <p style={{ minHeight: isEmpty ? '1.5em' : undefined }}>{isEmpty ? ' ' : children}</p>;
      },
      h2: ({ children }) => <h2>{children}</h2>,
      h3: ({ children }) => <h3>{children}</h3>,
      blockquote: ({ children }) => (
        <blockquote className="border-l-4 border-accent pl-6 py-4 my-8 italic text-xl text-foreground/80 bg-accent/5 rounded-r-2xl text-justify">
          {children}
        </blockquote>
      ),
    },
    marks: {
      link: ({ children, value }) => (
        <a
          href={value?.href}
          target={value?.blank !== false ? '_blank' : '_self'}
          rel="noopener noreferrer"
          className="text-accent underline font-semibold hover:opacity-80 transition-opacity"
        >
          {children}
        </a>
      ),
    },
    types: {
      mapEmbed: ({ value }) => {
        if (!value?.url) return null;
        return (
          <div className="my-6 overflow-hidden rounded-2xl border border-border">
            <iframe
              src={value.url}
              width="100%"
              height={value.height || 400}
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Carte Google Maps"
            />
          </div>
        );
      },
      ctaBlock: ({ value }) => {
        const cta = value.cta
        if (!cta) return null
        const text = language === 'en' ? (cta.textEn || cta.text) : cta.text
        const label = language === 'en' ? (cta.buttonLabelEn || cta.buttonLabel) : cta.buttonLabel
        const styleMap: Record<string, string> = {
          primary: 'bg-accent/8 border-accent/20',
          highlight: 'bg-highlight/8 border-highlight/20',
          outline: 'bg-transparent border-foreground/15',
        }
        const btnClass = cta.style === 'highlight' ? 'btn-highlight' : cta.style === 'outline' ? 'btn-outline' : 'btn-primary'
        return (
          <div className={`not-prose my-8 p-8 rounded-2xl border ${styleMap[cta.style || 'primary'] || styleMap.primary} text-center`}>
            {text && <p className="text-foreground/70 mb-6 text-base leading-relaxed text-center">{text}</p>}
            <Link href={cta.link || '/contact'} className={`${btnClass} inline-block !text-sm font-black uppercase tracking-widest`}>
              {label}
            </Link>
          </div>
        )
      },
    },
  }

  const visibleTabs = tabs.filter(tab =>
    (tab.content && tab.content.length > 0) || tab.pdf || (tab.faqs && tab.faqs.length > 0)
  )

  const [activeTab, setActiveTab] = useState(visibleTabs[0]?.id ?? '')

  if (visibleTabs.length === 0) return null

  const current = visibleTabs.find(t => t.id === activeTab)

  return (
    <div className="glass rounded-[40px] border border-border shadow-xl overflow-hidden">
      {/* Tab buttons */}
      <div className="flex flex-wrap gap-2 px-8 pt-8 pb-6 border-b border-border bg-foreground/[0.02]">
        {visibleTabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all duration-300 ${
              activeTab === tab.id
                ? 'bg-accent text-white shadow-lg shadow-accent/20'
                : 'bg-foreground/5 text-foreground/50 hover:bg-foreground/10 hover:text-foreground/80'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {current && (
        <div className="px-8 py-8 prose-custom max-w-none animate-in fade-in duration-300">
          {current.content && current.content.length > 0 && (
            <PortableText value={current.content} components={portableTextComponents} />
          )}

          {current.faqs && current.faqs.length > 0 && (
            <FAQAccordion faqs={current.faqs} hideHeader />
          )}

          {current.pdf && (
            <div className="mt-8">
              <a
                href={current.pdf}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary inline-flex items-center gap-3"
              >
                <FileText size={18} className="shrink-0" />
                {at('Télécharger la liste de matériel (PDF)')}
                <Download size={16} className="shrink-0 group-hover:translate-y-0.5 transition-transform" />
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
