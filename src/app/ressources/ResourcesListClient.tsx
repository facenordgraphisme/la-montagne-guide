'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import FAQAccordion from '@/components/FAQAccordion';

interface Resource {
  _id: string;
  title: string;
  titleEn: string;
  slug: string;
  category: string;
  intro: string;
  introEn: string;
  image: string;
  relatedActivities?: Array<{ title: string; slug: string }>;
}

interface ResourcesListClientProps {
  resources: Resource[];
  generalFaqs: any[];
}

const CATEGORIES = [
  { value: 'all', label: 'Tous les guides' },
  { value: 'alpinisme', label: 'Alpinisme' },
  { value: 'ski', label: 'Ski de Randonnée' },
  { value: 'escalade', label: 'Escalade' },
  { value: 'cascade-de-glace', label: 'Cascade de Glace' },
  { value: 'preparation', label: 'Préparation' },
  { value: 'equipement', label: 'Équipement & Matériel' }
];

export default function ResourcesListClient({ resources, generalFaqs }: ResourcesListClientProps) {
  const { at, language } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filtrer les guides
  const filteredResources = resources.filter(res => {
    const title = language === 'en' ? (res.titleEn || res.title) : res.title;
    const intro = language === 'en' ? (res.introEn || res.intro) : res.intro;
    
    const matchesSearch = 
      title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      intro?.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesCategory = selectedCategory === 'all' || res.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const getCategoryLabel = (catValue: string) => {
    return CATEGORIES.find(c => c.value === catValue)?.label || catValue;
  };

  return (
    <div className="space-y-16">
      {/* Search and Filters row */}
      <div className="flex flex-col lg:flex-row gap-6 justify-between items-stretch lg:items-center">
        {/* Categories Pills */}
        <div className="flex flex-wrap gap-2.5 max-w-4xl">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all duration-300 ${
                selectedCategory === cat.value
                  ? 'bg-accent text-white shadow-lg shadow-accent/20'
                  : 'bg-foreground/5 text-foreground/50 hover:bg-foreground/10 hover:text-foreground/80'
              }`}
            >
              {at(cat.label)}
            </button>
          ))}
        </div>

        {/* Search bar */}
        <div className="relative min-w-[280px] lg:w-96">
          <input
            type="text"
            placeholder={at('Rechercher un guide...')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-6 py-3.5 rounded-full bg-foreground/[0.02] border border-foreground/5 text-foreground placeholder-foreground/30 focus:outline-hidden focus:border-accent focus:bg-foreground/[0.04] transition-all"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/30" />
        </div>
      </div>

      {/* Guides Grid */}
      {filteredResources.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredResources.map((res) => {
            const displayTitle = language === 'en' ? (res.titleEn || res.title) : res.title;
            const displayIntro = language === 'en' ? (res.introEn || res.intro) : res.intro;

            return (
              <Link 
                href={`/ressources/${res.slug}`} 
                key={res._id} 
                className="group glass rounded-[40px] overflow-hidden flex flex-col h-full hover:border-accent transition-all duration-500 shadow-lg"
              >
                <div className="h-64 overflow-hidden relative">
                  <Image 
                    src={res.image || "/images/alpinisme.jpg"}
                    alt={displayTitle}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
                  
                  {/* Category badge */}
                  <span className="absolute top-6 left-6 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-background/80 backdrop-blur-md text-accent">
                    {at(getCategoryLabel(res.category))}
                  </span>
                </div>
                
                <div className="p-8 flex flex-col flex-1">
                  <h3 className="text-2xl font-bold mb-4 group-hover:text-accent transition-colors line-clamp-2 leading-tight">
                    {displayTitle}
                  </h3>
                  <p className="text-foreground/60 mb-8 flex-1 leading-relaxed line-clamp-3">
                    {displayIntro}
                  </p>

                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-foreground/5">
                    <span className="text-xs font-black uppercase tracking-widest text-accent group-hover:underline">
                      {at('Lire le guide')}
                    </span>
                    <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-all">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="glass p-20 rounded-[50px] text-center border border-dashed border-border max-w-2xl mx-auto">
          <h3 className="text-2xl font-bold mb-4 opacity-40 uppercase tracking-tighter">{at('Aucun guide trouvé')}</h3>
          <p className="text-foreground/40 font-medium">{at('Essayez d\'ajuster vos filtres de recherche ou de catégorie.')}</p>
        </div>
      )}

      {/* General FAQs row */}
      {generalFaqs && generalFaqs.length > 0 && (
        <div className="mt-32 pt-20 border-t border-foreground/5 max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-accent font-black tracking-widest uppercase text-xs mb-4 block">FAQ</span>
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase">{at('Questions')} <span className="text-accent italic">{at('Fréquentes')}</span></h2>
          </div>
          <FAQAccordion faqs={generalFaqs} />
        </div>
      )}
    </div>
  );
}
