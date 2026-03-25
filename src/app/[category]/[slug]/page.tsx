import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import {
  getAllArticleSlugs,
  getArticleBySlug,
  getAllCategories,
} from '../../../../sanity/lib/queries'
import { urlFor } from '../../../../sanity/sanity.image'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import ArticleBody from '@/components/article/ArticleBody'
import CategoryBadge from '@/components/ui/CategoryBadge'

export const revalidate = 30

interface Params {
  category: string
  slug: string
}

export async function generateStaticParams(): Promise<Params[]> {
  const slugs = await getAllArticleSlugs()
  return slugs.map((item) => ({
    category: item.category.slug.current,
    slug: item.slug.current,
  }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>
}): Promise<Metadata> {
  const { slug } = await params
  const article = await getArticleBySlug(slug)
  if (!article) return {}

  const title = article.seoTitle ?? article.title
  const description = article.seoDescription ?? article.excerpt
  const imageUrl = article.mainImage
    ? urlFor(article.mainImage).width(1200).height(630).fit('crop').url()
    : undefined

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime: article.publishedAt,
      authors: article.author ? [article.author.name] : undefined,
      images: imageUrl ? [{ url: imageUrl, width: 1200, height: 630 }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: imageUrl ? [imageUrl] : undefined,
    },
  }
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<Params>
}) {
  const { slug } = await params
  const [article, categories] = await Promise.all([
    getArticleBySlug(slug),
    getAllCategories(),
  ])

  if (!article) notFound()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    description: article.excerpt,
    datePublished: article.publishedAt,
    author: article.author
      ? { '@type': 'Person', name: article.author.name }
      : undefined,
    image: article.mainImage
      ? urlFor(article.mainImage).width(1200).height(630).fit('crop').url()
      : undefined,
  }

  return (
    <>
      <Header categories={categories} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="max-w-3xl mx-auto px-6 md:px-8 py-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-muted uppercase tracking-widest mb-8">
          <Link href="/" className="hover:text-ink transition-colors duration-150">
            Início
          </Link>
          <span>/</span>
          <Link
            href={`/${article.category.slug.current}`}
            className="hover:text-ink transition-colors duration-150"
          >
            {article.category.title}
          </Link>
        </nav>

        {/* Header */}
        <header className="mb-8">
          <div className="mb-4">
            <CategoryBadge
              title={article.category.title}
              slug={article.category.slug.current}
            />
          </div>

          <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-black text-ink leading-[1.05] tracking-tight mb-5">
            {article.title}
          </h1>

          <p className="text-base text-muted leading-relaxed mb-6">
            {article.excerpt}
          </p>

          <div className="flex items-center gap-3 text-xs text-muted uppercase tracking-widest border-t border-border pt-5">
            {article.author && <span className="font-semibold text-ink">{article.author.name}</span>}
            {article.author && <span className="w-1 h-1 bg-border inline-block" />}
            <span>{formatDate(article.publishedAt)}</span>
          </div>
        </header>

        {/* Main image */}
        {article.mainImage && (
          <figure className="mb-8 -mx-6 md:-mx-8">
            <div className="relative aspect-video w-full overflow-hidden bg-border">
              <Image
                src={urlFor(article.mainImage).width(1200).height(675).fit('crop').url()}
                alt={article.mainImage.alt ?? article.title}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 768px"
              />
            </div>
          </figure>
        )}

        {/* Body */}
        {article.body && <ArticleBody body={article.body} />}

        {/* Back link */}
        <div className="mt-12 pt-8 border-t border-border">
          <Link
            href={`/${article.category.slug.current}`}
            className="text-xs font-bold uppercase tracking-widest text-red hover:text-ink transition-colors duration-150"
          >
            ← Mais em {article.category.title}
          </Link>
        </div>
      </main>

      <Footer categories={categories} />
    </>
  )
}
