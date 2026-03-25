import Image from 'next/image'
import Link from 'next/link'
import CategoryBadge from '@/components/ui/CategoryBadge'
import { urlFor } from '../../../sanity/sanity.image'
import type { Article } from '@/types'

interface ArticleCardProps {
  article: Article
  variant?: 'default' | 'compact'
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export default function ArticleCard({ article, variant = 'default' }: ArticleCardProps) {
  const href = `/${article.category.slug.current}/${article.slug.current}`

  if (variant === 'compact') {
    return (
      <div className="flex gap-3 items-start py-3 border-b border-border last:border-b-0">
        {article.mainImage && (
          <div className="w-16 h-16 flex-shrink-0 overflow-hidden bg-border">
            <Image
              src={urlFor(article.mainImage).width(64).height(64).fit('crop').url()}
              alt={article.mainImage.alt ?? article.title}
              width={64}
              height={64}
              className="object-cover w-full h-full"
            />
          </div>
        )}
        <div>
          <div className="text-[10px] font-bold text-red uppercase tracking-widest mb-1">
            {article.category.title}
          </div>
          <Link href={href} className="font-serif text-sm font-bold text-ink leading-snug hover:text-red transition-colors duration-150 line-clamp-2">
            {article.title}
          </Link>
        </div>
      </div>
    )
  }

  return (
    <article className="group">
      {/* Image */}
      <Link href={href} className="block overflow-hidden bg-border aspect-video mb-3 relative">
        {article.mainImage ? (
          <Image
            src={urlFor(article.mainImage).width(600).height(338).fit('crop').url()}
            alt={article.mainImage.alt ?? article.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full bg-[#E8E4DF]" />
        )}
      </Link>

      {/* Category */}
      <div className="mb-2">
        <CategoryBadge title={article.category.title} slug={article.category.slug.current} />
      </div>

      {/* Title */}
      <Link href={href}>
        <h3 className="font-serif text-xl font-bold text-ink leading-snug tracking-tight mb-2 hover:text-red transition-colors duration-150 line-clamp-3">
          {article.title}
        </h3>
      </Link>

      {/* Excerpt */}
      <p className="text-sm text-muted leading-relaxed line-clamp-2 mb-3">
        {article.excerpt}
      </p>

      {/* Meta */}
      <span className="text-xs text-muted/70 uppercase tracking-wide">
        {formatDate(article.publishedAt)}
      </span>
    </article>
  )
}
