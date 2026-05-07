import BlogCard from "@/components/BlogCard";
import { client } from "@/sanity/lib/client";
import { postsQuery } from "@/sanity/lib/queries";

import { getServerTranslations } from '@/i18n/server';

export default async function BlogPage() {
  const posts = await client.fetch(postsQuery);
  const { at, t } = await getServerTranslations();

  return (
    <main className="relative pt-32 min-h-screen bg-background text-foreground transition-colors duration-300">
      <div className="container mx-auto px-6 py-20">
        <div className="max-w-4xl mb-20">
          <h1 className="text-5xl md:text-8xl font-bold tracking-tighter mb-8 bg-gradient-to-r from-foreground to-foreground/40 bg-clip-text text-transparent uppercase">
            {at('BLOG')}
          </h1>
          <p className="text-xl text-foreground/60 leading-relaxed max-w-2xl">
            {at("Retrouvez mes derniers récits d'aventures, conseils techniques et actualités de la montagne.")}
          </p>
        </div>

        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post: any) => (
              <BlogCard key={post.slug} post={post} />
            ))}
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
