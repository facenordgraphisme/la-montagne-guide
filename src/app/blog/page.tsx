import type { Metadata } from "next";
import BlogCard from "@/components/BlogCard";
import BlogFilters from "@/components/BlogFilters";
import Pagination from "@/components/Pagination";
import { client } from "@/sanity/lib/client";
import { postsPageQuery, categoryTagsQuery, massifTagsQuery } from "@/sanity/lib/queries";

import { getServerTranslations } from '@/i18n/server';

const PAGE_SIZE = 50;

type BlogPageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ searchParams }: BlogPageProps): Promise<Metadata> {
  const { at } = await getServerTranslations();
  const params = await searchParams;
  const pageNumber = Math.max(1, Number(params.page) || 1);

  return {
    title: `${at('Blog')}${pageNumber > 1 ? ` - ${at('Page')} ${pageNumber}` : ''} | La Montagne Guide`,
    description: at("Retrouvez mes derniers récits d'aventures, conseils techniques et actualités de la montagne."),
  };
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const params = await searchParams;
  const { at } = await getServerTranslations();

  const category = typeof params.category === 'string' ? params.category : undefined;
  const massif = typeof params.massif === 'string' ? params.massif : undefined;
  const pageNumber = Math.max(1, Number(params.page) || 1);

  const start = (pageNumber - 1) * PAGE_SIZE;
  const end = start + PAGE_SIZE;

  const [{ posts, total }, categories, massifs] = await Promise.all([
    client.fetch(postsPageQuery, { start, end, category: category ?? null, massif: massif ?? null }),
    client.fetch(categoryTagsQuery),
    client.fetch(massifTagsQuery),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <main className="relative pt-32 min-h-screen bg-background text-foreground transition-colors duration-300">
      <div className="container mx-auto px-6 py-20">
        <div className="max-w-4xl mb-12">
          <h1 className="text-5xl md:text-8xl font-bold tracking-tighter mb-8 bg-gradient-to-r from-foreground to-foreground/40 bg-clip-text text-transparent uppercase">
            {at('BLOG')}
          </h1>
          <p className="text-xl text-foreground/60 leading-relaxed max-w-2xl">
            {at("Retrouvez mes derniers récits d'aventures, conseils techniques et actualités de la montagne.")}
          </p>
        </div>

        <BlogFilters
          categories={categories}
          massifs={massifs}
          activeCategory={category}
          activeMassif={massif}
        />

        {posts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post: any) => (
                <BlogCard key={post.slug} post={post} />
              ))}
            </div>
            <Pagination
              currentPage={pageNumber}
              totalPages={totalPages}
              basePath="/blog"
              category={category}
              massif={massif}
            />
          </>
        ) : (category || massif) ? (
          <div className="glass p-12 rounded-[2rem] text-center border border-border">
            <h3 className="text-3xl font-bold mb-4">{at('Aucun article ne correspond à ces filtres')}</h3>
            <p className="text-foreground/40">{at('Essayez une autre catégorie ou un autre massif.')}</p>
          </div>
        ) : (
          <div className="glass p-12 rounded-[2rem] text-center border border-border">
            <div className="text-accent text-sm font-bold mb-4 tracking-[0.2em]">{at('PROCHAINEMENT')}</div>
            <h3 className="text-3xl font-bold mb-4">{at('Articles en cours de rédaction')}</h3>
            <p className="text-foreground/40">{at('Revenez bientôt pour découvrir les premières histoires.')}</p>
          </div>
        )}
      </div>
    </main>
  );
}
