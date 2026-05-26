'use client'

import { useState } from 'react'
import { PortableText } from '@portabletext/react'
import { Download, FileText } from 'lucide-react'

interface Tab {
  id: string
  label: string
  content: any[] | null
  pdf?: string | null
}

interface SejourTabsProps {
  tabs: Tab[]
}

export default function SejourTabs({ tabs }: SejourTabsProps) {
  const visibleTabs = tabs.filter(tab =>
    (tab.content && tab.content.length > 0) || tab.pdf
  )

  const [activeTab, setActiveTab] = useState(visibleTabs[0]?.id ?? '')

  if (visibleTabs.length === 0) return null

  const current = visibleTabs.find(t => t.id === activeTab)

  return (
    <div>
      {/* Tab buttons */}
      <div className="flex flex-wrap gap-2 mb-8 border-b border-border pb-4">
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
        <div className="prose-custom max-w-none animate-in fade-in duration-300">
          {current.content && current.content.length > 0 && (
            <PortableText value={current.content} />
          )}

          {current.pdf && (
            <div className="mt-8">
              <a
                href={current.pdf}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-6 py-4 bg-highlight/10 hover:bg-highlight/20 border border-highlight/30 hover:border-highlight/60 text-highlight rounded-2xl font-bold text-sm uppercase tracking-widest transition-all duration-300 group"
              >
                <FileText size={18} className="shrink-0" />
                Télécharger la liste de matériel (PDF)
                <Download size={16} className="shrink-0 group-hover:translate-y-0.5 transition-transform" />
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
