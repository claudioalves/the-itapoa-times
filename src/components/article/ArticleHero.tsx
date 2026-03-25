import Image from 'next/image'
import Link from 'next/link'
import CategoryBadge from '@/components/ui/CategoryBadge'
import { urlFor } from '../../../sanity/sanity.image'
import type { Article } from '@/types'

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export default function ArticleHero({ article }: { article: Article }) {
  const href = `/${article.category.slug.current}/${article.slug.current}`

  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 border-b border-border">
      {/* Text */}
      <div className="flex flex-col justify-end p-6 md:p-10 lg:border-r border-border order-2 lg:order-1">
        <div className="mb-4">
          <CategoryBadge title={article.category.title} slug={article.category.slug.current} />
        </div>
        <Link href={href}>
          <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-black text-ink leading-[1.05] tracking-tight mb-5 hover:text-red transition-colors duration-150">
            {article.title}
          </h1>
        </Link>
        <p className="text-base text-muted leading-relaxed mb-6 max-w-xl">
          {article.excerpt}
        </p>
        <div className="flex items-center gap-3 text-xs text-muted uppercase tracking-widest">
          {article.author && <span>{article.author.name}</span>}
          {article.author && <span className="w-1 h-1 bg-border inline-block" />}
          <span>{formatDate(article.publishedAt)}</span>
        </div>
      </div>

      {/* Image */}
      <div className="relative aspect-video lg:aspect-auto lg:min-h-[420px] order-1 lg:order-2 bg-border">
        {article.mainImage ? (
          <Image
            src={urlFor(article.mainImage).width(900).height(600).fit('crop').url()}
            alt={article.mainImage.alt ?? article.title}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        ) : (
          <div className="w-full h-full bg-[#E8E4DF]" />
        )}
      </div>
    </section>
  )
}
