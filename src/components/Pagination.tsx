import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
  currentPage: number
  totalPages: number
  basePath: string
  category?: string
  massif?: string
}

export default function Pagination({ currentPage, totalPages, basePath, category, massif }: PaginationProps) {
  if (totalPages <= 1) return null

  const buildHref = (page: number) => {
    const params = new URLSearchParams()
    if (category) params.set('category', category)
    if (massif) params.set('massif', massif)
    if (page > 1) params.set('page', String(page))
    const query = params.toString()
    return query ? `${basePath}?${query}` : basePath
  }

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

  return (
    <nav className="flex items-center justify-center gap-2 mt-20">
      <Link
        href={buildHref(Math.max(1, currentPage - 1))}
        aria-disabled={currentPage === 1}
        className={`p-2.5 rounded-full border transition-all ${
          currentPage === 1
            ? 'border-white/5 text-foreground/20 pointer-events-none'
            : 'border-white/10 text-foreground/60 hover:border-accent/40 hover:text-accent'
        }`}
      >
        <ChevronLeft size={16} />
      </Link>

      {pages.map((page) => (
        <Link
          key={page}
          href={buildHref(page)}
          className={`min-w-[2.5rem] h-10 flex items-center justify-center px-3 rounded-full text-xs font-black transition-all border ${
            page === currentPage
              ? 'bg-accent border-accent text-white shadow-xl'
              : 'bg-transparent border-white/10 text-foreground/40 hover:border-accent/40'
          }`}
        >
          {page}
        </Link>
      ))}

      <Link
        href={buildHref(Math.min(totalPages, currentPage + 1))}
        aria-disabled={currentPage === totalPages}
        className={`p-2.5 rounded-full border transition-all ${
          currentPage === totalPages
            ? 'border-white/5 text-foreground/20 pointer-events-none'
            : 'border-white/10 text-foreground/60 hover:border-accent/40 hover:text-accent'
        }`}
      >
        <ChevronRight size={16} />
      </Link>
    </nav>
  )
}
