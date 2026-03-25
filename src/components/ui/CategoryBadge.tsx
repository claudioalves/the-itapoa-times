import Link from 'next/link'

interface CategoryBadgeProps {
  title: string
  slug: string
  variant?: 'red' | 'outline'
}

export default function CategoryBadge({ title, slug, variant = 'red' }: CategoryBadgeProps) {
  return (
    <Link
      href={`/${slug}`}
      className={`inline-block text-[10px] font-bold uppercase tracking-[0.12em] px-2.5 py-1 transition-colors duration-150 ${
        variant === 'red'
          ? 'bg-red text-white hover:bg-ink'
          : 'border border-border text-muted hover:border-ink hover:text-ink'
      }`}
    >
      {title}
    </Link>
  )
}
